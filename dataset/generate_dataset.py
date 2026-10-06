"""
Generate a realistic insurance dataset matching the standard
Medical Cost Personal Dataset (Kaggle) structure.
This script produces 1338 rows similar to the original dataset.
"""
import numpy as np
import pandas as pd

np.random.seed(42)
n = 1338

ages = np.random.randint(18, 65, n)
sexes = np.random.choice(['male', 'female'], n)
bmis = np.round(np.random.normal(30.6, 6.1, n).clip(15.96, 53.13), 2)
children = np.random.choice([0, 1, 2, 3, 4, 5], n, p=[0.43, 0.24, 0.18, 0.12, 0.02, 0.01])
smokers = np.random.choice(['yes', 'no'], n, p=[0.205, 0.795])
regions = np.random.choice(['northeast', 'northwest', 'southeast', 'southwest'], n,
                           p=[0.2425, 0.2425, 0.2725, 0.2425])

charges = []
for i in range(n):
    base = 1500 + ages[i] * 250
    bmi_factor = (bmis[i] - 25) * 50 if bmis[i] > 25 else 0
    child_factor = children[i] * 400
    smoke_factor = 23500 if smokers[i] == 'yes' else 0
    # smoker+obese interaction
    if smokers[i] == 'yes' and bmis[i] >= 30:
        smoke_factor += (bmis[i] - 30) * 1400
    region_factor = {'northeast': 400, 'northwest': 0, 'southeast': -200, 'southwest': -100}[regions[i]]
    sex_factor = -500 if sexes[i] == 'female' else 0
    noise = np.random.normal(0, 1500)
    charge = max(1121.87, base + bmi_factor + child_factor + smoke_factor + region_factor + sex_factor + noise)
    charges.append(round(charge, 2))

df = pd.DataFrame({
    'age': ages,
    'sex': sexes,
    'bmi': bmis,
    'children': children,
    'smoker': smokers,
    'region': regions,
    'charges': charges
})

df.to_csv('insurance.csv', index=False)
print(f"Dataset generated: {len(df)} rows")
print(df.head())
print(df.describe())
