"""
ML Service – trains Linear Regression and Random Forest, serves predictions.
"""
import logging
import numpy as np
import pandas as pd
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    r2_score, mean_absolute_error, mean_squared_error
)

logger = logging.getLogger(__name__)

CAT_FEATURES = ["sex", "smoker", "region"]
NUM_FEATURES = ["age", "bmi", "children"]
TARGET = "charges"
RANDOM_STATE = 42
TEST_SIZE = 0.2


class MLService:
    def __init__(self, dataset_service):
        self._ds = dataset_service
        self._models: dict = {}
        self._metrics: dict = {}
        self._preprocessor = None
        self._feature_names_out: list = []
        self.train_all()

    # ── Public ──────────────────────────────────────────
    def train_all(self):
        df = self._ds.get_df()
        X = df[NUM_FEATURES + CAT_FEATURES]
        y = df[TARGET]

        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=TEST_SIZE, random_state=RANDOM_STATE
        )

        # Build preprocessor
        self._preprocessor = ColumnTransformer(
            transformers=[
                ("num", StandardScaler(), NUM_FEATURES),
                ("cat", OneHotEncoder(drop="first", sparse_output=False), CAT_FEATURES),
            ]
        )

        # Fit once
        self._preprocessor.fit(X_train)
        X_train_t = self._preprocessor.transform(X_train)
        X_test_t = self._preprocessor.transform(X_test)

        # Feature names for coefficient display
        cat_encoder = self._preprocessor.named_transformers_["cat"]
        cat_names = list(cat_encoder.get_feature_names_out(CAT_FEATURES))
        self._feature_names_out = NUM_FEATURES + cat_names

        # ── Linear Regression ──
        lr = LinearRegression()
        lr.fit(X_train_t, y_train)
        lr_preds = lr.predict(X_test_t)
        self._models["linear_regression"] = lr
        self._metrics["linear_regression"] = self._eval(y_test, lr_preds, "Linear Regression")

        # ── Random Forest ──
        rf = RandomForestRegressor(n_estimators=100, random_state=RANDOM_STATE, n_jobs=-1)
        rf.fit(X_train_t, y_train)
        rf_preds = rf.predict(X_test_t)
        self._models["random_forest"] = rf
        self._metrics["random_forest"] = self._eval(y_test, rf_preds, "Random Forest Regression")

        # Actual vs predicted for scatter
        self._metrics["linear_regression"]["actual_vs_predicted"] = {
            "actual": [round(v, 2) for v in y_test.tolist()[:200]],
            "predicted": [round(v, 2) for v in lr_preds.tolist()[:200]],
        }
        self._metrics["random_forest"]["actual_vs_predicted"] = {
            "actual": [round(v, 2) for v in y_test.tolist()[:200]],
            "predicted": [round(v, 2) for v in rf_preds.tolist()[:200]],
        }

        # Coefficients / importances
        self._metrics["linear_regression"]["coefficients"] = {
            "intercept": round(float(lr.intercept_), 4),
            "features": [
                {"name": n, "coefficient": round(float(c), 4)}
                for n, c in zip(self._feature_names_out, lr.coef_)
            ],
        }
        self._metrics["random_forest"]["feature_importances"] = [
            {"name": n, "importance": round(float(v), 4)}
            for n, v in zip(self._feature_names_out, rf.feature_importances_)
        ]

        # Residuals for linear
        lr_resid = y_test.values - lr_preds
        self._metrics["linear_regression"]["residuals"] = {
            "predicted": [round(v, 2) for v in lr_preds.tolist()[:200]],
            "residuals": [round(v, 2) for v in lr_resid.tolist()[:200]],
        }

        logger.info("All models trained. LR R²=%.4f  RF R²=%.4f",
                    self._metrics["linear_regression"]["r2"],
                    self._metrics["random_forest"]["r2"])

    def predict(self, data: dict, model_name: str) -> dict:
        if model_name not in self._models:
            raise ValueError(f"Unknown model: {model_name}")

        row = pd.DataFrame([{
            "age": int(data["age"]),
            "bmi": float(data["bmi"]),
            "children": int(data["children"]),
            "sex": data["sex"],
            "smoker": data["smoker"],
            "region": data["region"],
        }])

        X_t = self._preprocessor.transform(row)
        model = self._models[model_name]
        cost = float(model.predict(X_t)[0])
        cost = max(0.0, cost)

        # Feature impact
        feature_impact = self._get_feature_impact(model_name, X_t)

        return {
            "predicted_cost": round(cost, 2),
            "model": model_name,
            "feature_impact": feature_impact,
        }

    def get_metrics(self) -> dict:
        return self._metrics

    # ── Private ─────────────────────────────────────────
    def _eval(self, y_true, y_pred, name: str) -> dict:
        r2 = float(r2_score(y_true, y_pred))
        mae = float(mean_absolute_error(y_true, y_pred))
        mse = float(mean_squared_error(y_true, y_pred))
        rmse = float(np.sqrt(mse))
        return {
            "model_name": name,
            "r2": round(r2, 4),
            "mae": round(mae, 2),
            "mse": round(mse, 2),
            "rmse": round(rmse, 2),
            "train_size": int(len(self._ds.get_df()) * (1 - TEST_SIZE)),
            "test_size": int(len(self._ds.get_df()) * TEST_SIZE),
        }

    def _get_feature_impact(self, model_name: str, X_t) -> list:
        model = self._models[model_name]
        names = self._feature_names_out

        if model_name == "linear_regression":
            # contribution = coeff * feature_value
            impacts = [
                {"name": n, "value": round(float(c * X_t[0, i]), 2)}
                for i, (n, c) in enumerate(zip(names, model.coef_))
            ]
        else:
            # For RF use importances (scaled)
            imps = model.feature_importances_
            total_imp = imps.sum()
            impacts = [
                {"name": n, "value": round(float(v / total_imp * 100), 2)}
                for n, v in zip(names, imps)
            ]

        impacts.sort(key=lambda x: abs(x["value"]), reverse=True)
        return impacts[:10]
