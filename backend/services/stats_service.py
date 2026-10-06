"""
Statistics Service – descriptive statistics, EDA, correlation.
"""
import logging
import numpy as np
import pandas as pd
from scipy import stats as scipy_stats

logger = logging.getLogger(__name__)


class StatsService:
    def __init__(self, dataset_service):
        self._ds = dataset_service

    def compute_all(self) -> dict:
        df = self._ds.get_df()
        result = {
            "overview": self._ds.get_overview(),
            "descriptive": self._descriptive(df),
            "distributions": self._distributions(df),
            "categorical_analysis": self._categorical(df),
            "scatter_data": self._scatter(df),
            "box_plots": self._boxplots(df),
        }
        return result

    def compute_correlation(self) -> dict:
        df = self._ds.get_df()

        # Encode categoricals for full correlation
        df_enc = df.copy()
        df_enc["sex_enc"] = (df_enc["sex"] == "male").astype(int)
        df_enc["smoker_enc"] = (df_enc["smoker"] == "yes").astype(int)
        region_dummies = pd.get_dummies(df_enc["region"], prefix="region", drop_first=True)
        df_enc = pd.concat([df_enc, region_dummies], axis=1)

        num_cols = ["age", "bmi", "children", "sex_enc", "smoker_enc", "charges"]
        corr = df_enc[num_cols].corr().round(4)

        matrix = []
        for col in num_cols:
            row_data = []
            for col2 in num_cols:
                row_data.append(round(float(corr.loc[col, col2]), 4))
            matrix.append(row_data)

        # Pair-wise with charges
        pairs = []
        for col in ["age", "bmi", "children", "sex_enc", "smoker_enc"]:
            r, p = scipy_stats.pearsonr(df_enc[col], df_enc["charges"])
            pairs.append({"variable": col, "correlation": round(float(r), 4), "p_value": round(float(p), 6)})

        return {
            "matrix": matrix,
            "labels": num_cols,
            "pairs_with_charges": pairs,
        }

    # ── Private ─────────────────────────────────────────
    def _descriptive(self, df: pd.DataFrame) -> dict:
        result = {}
        for col in ["age", "bmi", "children", "charges"]:
            series = df[col].dropna()
            mode_result = scipy_stats.mode(series, keepdims=True)
            result[col] = {
                "mean": round(float(series.mean()), 4),
                "median": round(float(series.median()), 4),
                "mode": round(float(mode_result.mode[0]), 4),
                "std": round(float(series.std()), 4),
                "variance": round(float(series.var()), 4),
                "min": round(float(series.min()), 4),
                "max": round(float(series.max()), 4),
                "q1": round(float(series.quantile(0.25)), 4),
                "q3": round(float(series.quantile(0.75)), 4),
                "iqr": round(float(series.quantile(0.75) - series.quantile(0.25)), 4),
                "skewness": round(float(series.skew()), 4),
                "kurtosis": round(float(series.kurtosis()), 4),
            }
        return result

    def _distributions(self, df: pd.DataFrame) -> dict:
        out = {}
        for col in ["age", "bmi", "charges"]:
            series = df[col].dropna()
            counts, edges = np.histogram(series, bins=20)
            out[col] = {
                "counts": counts.tolist(),
                "bin_edges": [round(float(e), 2) for e in edges],
                "bin_centers": [round(float((edges[i] + edges[i+1]) / 2), 2) for i in range(len(edges)-1)],
            }
        return out

    def _categorical(self, df: pd.DataFrame) -> dict:
        return {
            "sex": {
                "value_counts": df["sex"].value_counts().to_dict(),
                "charges_by_group": df.groupby("sex")["charges"].mean().round(2).to_dict(),
            },
            "smoker": {
                "value_counts": df["smoker"].value_counts().to_dict(),
                "charges_by_group": df.groupby("smoker")["charges"].mean().round(2).to_dict(),
            },
            "region": {
                "value_counts": df["region"].value_counts().to_dict(),
                "charges_by_group": df.groupby("region")["charges"].mean().round(2).to_dict(),
            },
            "children": {
                "value_counts": df["children"].value_counts().sort_index().to_dict(),
                "charges_by_group": df.groupby("children")["charges"].mean().round(2).to_dict(),
            },
        }

    def _scatter(self, df: pd.DataFrame) -> dict:
        sample = df.sample(min(400, len(df)), random_state=42)
        return {
            "age_vs_charges": [
                {"x": int(r["age"]), "y": round(float(r["charges"]), 2), "smoker": r["smoker"]}
                for _, r in sample.iterrows()
            ],
            "bmi_vs_charges": [
                {"x": round(float(r["bmi"]), 2), "y": round(float(r["charges"]), 2), "smoker": r["smoker"]}
                for _, r in sample.iterrows()
            ],
        }

    def _boxplots(self, df: pd.DataFrame) -> dict:
        result = {}
        for col in ["age", "bmi", "charges"]:
            series = df[col].dropna()
            q1 = float(series.quantile(0.25))
            q3 = float(series.quantile(0.75))
            iqr = q3 - q1
            whisker_low = float(max(series.min(), q1 - 1.5 * iqr))
            whisker_high = float(min(series.max(), q3 + 1.5 * iqr))
            outliers = series[(series < whisker_low) | (series > whisker_high)].tolist()
            result[col] = {
                "q1": round(q1, 2),
                "median": round(float(series.median()), 2),
                "q3": round(q3, 2),
                "whisker_low": round(whisker_low, 2),
                "whisker_high": round(whisker_high, 2),
                "outlier_count": len(outliers),
                "outliers": [round(float(v), 2) for v in outliers[:50]],
            }
        return result
