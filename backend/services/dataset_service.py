"""
Dataset Service – loads and serves the insurance CSV.
"""
import os
import pandas as pd
import numpy as np
import logging

logger = logging.getLogger(__name__)


class DatasetService:
    def __init__(self, path: str):
        self._path = path
        self._df: pd.DataFrame = pd.DataFrame()
        self._load()

    # ── Public ──────────────────────────────────────────
    def reload(self, path: str):
        self._path = path
        self._load()

    def get_df(self) -> pd.DataFrame:
        return self._df.copy()

    def get_overview(self) -> dict:
        df = self._df
        return {
            "total_records": int(len(df)),
            "num_features": int(len(df.columns) - 1),  # exclude target
            "target_variable": "charges",
            "missing_values": int(df.isnull().sum().sum()),
            "duplicate_rows": int(df.duplicated().sum()),
            "columns": list(df.columns),
        }

    def get_paginated(self, page: int, per_page: int, filters: dict) -> dict:
        df = self._df.copy()

        # Apply filters
        if filters.get("sex"):
            df = df[df["sex"] == filters["sex"]]
        if filters.get("smoker"):
            df = df[df["smoker"] == filters["smoker"]]
        if filters.get("region"):
            df = df[df["region"] == filters["region"]]
        if filters.get("bmi_min"):
            df = df[df["bmi"] >= float(filters["bmi_min"])]
        if filters.get("bmi_max"):
            df = df[df["bmi"] <= float(filters["bmi_max"])]
        if filters.get("age_min"):
            df = df[df["age"] >= int(filters["age_min"])]
        if filters.get("age_max"):
            df = df[df["age"] <= int(filters["age_max"])]
        if filters.get("search"):
            s = filters["search"].lower()
            df = df[
                df["sex"].str.contains(s, na=False)
                | df["smoker"].str.contains(s, na=False)
                | df["region"].str.contains(s, na=False)
            ]

        total = len(df)
        start = (page - 1) * per_page
        page_df = df.iloc[start : start + per_page].copy()
        page_df["charges"] = page_df["charges"].round(2)

        return {
            "data": page_df.to_dict(orient="records"),
            "total": total,
            "page": page,
            "per_page": per_page,
            "total_pages": max(1, (total + per_page - 1) // per_page),
            "overview": self.get_overview(),
        }

    # ── Private ─────────────────────────────────────────
    def _load(self):
        if not os.path.exists(self._path):
            logger.warning("Dataset not found: %s — generating synthetic data", self._path)
            self._df = self._generate_synthetic()
            os.makedirs(os.path.dirname(self._path), exist_ok=True)
            self._df.to_csv(self._path, index=False)
            return

        self._df = pd.read_csv(self._path)
        self._df.columns = self._df.columns.str.lower().str.strip()
        logger.info("Dataset loaded: %d rows", len(self._df))

    def _generate_synthetic(self) -> pd.DataFrame:
        np.random.seed(42)
        n = 1338
        ages = np.random.randint(18, 65, n)
        sexes = np.random.choice(["male", "female"], n)
        bmis = np.round(np.random.normal(30.6, 6.1, n).clip(15.96, 53.13), 2)
        children = np.random.choice([0, 1, 2, 3, 4, 5], n, p=[0.43, 0.24, 0.18, 0.12, 0.02, 0.01])
        smokers = np.random.choice(["yes", "no"], n, p=[0.205, 0.795])
        regions = np.random.choice(
            ["northeast", "northwest", "southeast", "southwest"], n,
            p=[0.2425, 0.2425, 0.2725, 0.2425],
        )
        charges = []
        for i in range(n):
            base = 1500 + ages[i] * 250
            bmi_f = (bmis[i] - 25) * 50 if bmis[i] > 25 else 0
            child_f = children[i] * 400
            smoke_f = 23500 if smokers[i] == "yes" else 0
            if smokers[i] == "yes" and bmis[i] >= 30:
                smoke_f += (bmis[i] - 30) * 1400
            reg_f = {"northeast": 400, "northwest": 0, "southeast": -200, "southwest": -100}[regions[i]]
            sex_f = -500 if sexes[i] == "female" else 0
            noise = np.random.normal(0, 1500)
            charge = max(1121.87, base + bmi_f + child_f + smoke_f + reg_f + sex_f + noise)
            charges.append(round(charge, 2))
        return pd.DataFrame(
            dict(age=ages, sex=sexes, bmi=bmis, children=children, smoker=smokers, region=regions, charges=charges)
        )
