# Medical Insurance Cost Prediction — Statistics & Machine Learning Web Application

An end-to-end, full-stack Data Science and Actuarial Statistics web application built as an academic college project. The platform demonstrates how **Multiple Linear Regression (OLS)** and **Random Forest Ensemble Learning** can be applied to predict annual healthcare costs based on demographic and lifestyle risk factors.

---

## 🌟 Key Features

1. **Interactive Healthcare Cost Predictor**:
   - Dynamic real-time insurance cost estimation.
   - Algorithmic choice: Compare **Multiple Linear Regression** vs. **Random Forest Regressor**.
   - Feature attribution breakdown showing dollar impacts and percentage influence per factor.
   - Actuarial risk categorization (Low, Moderate, Elevated, High Risk) with 95% confidence intervals.

2. **Exploratory Data Analysis (EDA) & Statistics**:
   - Complete descriptive statistics table (Mean, Median, Standard Deviation, Min, Max, Skewness, Kurtosis).
   - Frequency distribution histograms across Age, BMI, and Medical Charges.
   - Smoker vs. Non-Smoker disparity box plots and scatter plots highlighting exponential cost acceleration for high-BMI smokers.
   - Categorical breakdowns across Gender, Family Size (children), and US Geographic Regions.

3. **Regression Diagnostics & Statistical Inference**:
   - Empirical multiple linear regression equation with estimated $\beta_j$ coefficients.
   - Statistical hypothesis testing: $t$-statistics, standard errors, and $p$-values ($H_0: \beta_j = 0$).
   - Classical Ordinary Least Squares (OLS) assumption checks:
     - Linearity & Homoscedasticity via fitted vs. residual scatter plots.
     - Multicollinearity assessment using Pearson correlation heatmaps and Variance Inflation Factors (VIF).
     - Normality of residuals analysis.

4. **Model Comparison Suite**:
   - Side-by-side metric comparison table:
     - $R^2$ (Coefficient of Determination)
     - Adjusted $R^2$
     - Mean Absolute Error (MAE)
     - Root Mean Squared Error (RMSE)
   - Radar and bar chart visualizations comparing model variance and accuracy.
   - Random Forest Mean Decrease Impurity (MDI) feature importances.

5. **Dataset Explorer & Data Management**:
   - Interactive paginated table of 1,338 patient records.
   - Multi-column filtering by demographic variables, age range, and BMI thresholds.
   - Custom CSV dataset upload with automated schema verification and dynamic model retraining.

6. **Audit & Query History**:
   - Persistent SQLite history database capturing every prediction query and timestamp.
   - Real-time cost trajectory time-series charts.
   - One-click CSV export for external reporting and grading review.

7. **Academic Documentation & Viva Guide**:
   - Comprehensive theoretical background, mathematical derivations, and technical architecture specifications built directly into the web UI.

---

## 🔬 Statistical & Machine Learning Framework

### 1. Multiple Linear Regression (OLS)
$$Y_i = \beta_0 + \sum_{j=1}^{p} \beta_j X_{ij} + \epsilon_i, \quad \epsilon_i \sim \mathcal{N}(0, \sigma^2)$$

- **Analytical Solution**: Parameter estimates computed via the Normal Equation:
  $$\hat{\beta} = (X^T X)^{-1} X^T Y$$
- **Interpretability**: Each $\beta_j$ signifies the partial derivative $\frac{\partial Y}{\partial X_j}$ — the average expected change in annual medical insurance charges per unit increment in predictor $X_j$, holding all other factors constant.

### 2. Random Forest Regressor
- Meta-estimator aggregating 100 decorrelated decision trees using Bootstrap Aggregation (Bagging).
- Effectively captures the nonlinear interaction between **Smoker Status** and **High BMI ($\ge 30$)** without requiring manual interaction engineering.

### 3. Evaluation Metrics
- **$R^2$**: Proportion of variance in insurance charges explained by the independent variables.
- **Adjusted $R^2$**: Penalizes extraneous predictors: $1 - \left[\frac{(1-R^2)(n-1)}{n-p-1}\right]$.
- **MAE**: Average absolute magnitude of errors: $\frac{1}{n} \sum |y_i - \hat{y}_i|$.
- **RMSE**: Quadratic scoring rule penalizing large outliers: $\sqrt{\frac{1}{n}\sum(y_i - \hat{y}_i)^2}$.

---

## 🏗️ System Architecture

- **Backend**: Python 3 (Flask, scikit-learn, statsmodels, pandas, numpy, SQLite).
- **Frontend**: React 18, Vite, Recharts, Lucide Icons, Modern CSS Design System.
- **Port Mapping**:
  - Backend API: `http://localhost:5000`
  - Frontend Client: `http://localhost:5173` (with `/api` proxy configured)

---

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 1. Launch the Backend API
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python app.py
```
*The backend server will start on `http://localhost:5000`.*

### 2. Launch the Frontend Application
```bash

```
*Open `http://localhost:5173` in your browser.*

---

## 📡 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check and server timestamp |
| `GET` | `/api/dataset` | Paginated dataset records with filtering parameters |
| `GET` | `/api/statistics` | Descriptive statistics, distributions, and EDA summaries |
| `GET` | `/api/model-metrics` | Regression coefficients, $p$-values, $R^2$, MAE, RMSE |
| `GET` | `/api/correlation` | Pearson correlation matrix with $p$-values |
| `POST` | `/api/predict` | Predict charges for patient profile; persists to history |
| `POST` | `/api/upload-dataset` | Upload new CSV dataset and retrain models |
| `GET` | `/api/history` | Retrieve prediction query logs |
| `DELETE` | `/api/history/:id` | Delete specific history log |
| `DELETE` | `/api/history` | Clear all prediction logs |

---

## 🎓 Viva & Project Defense Guide

1. **Why is smoking the most significant factor?**
   - In both OLS and Random Forest, smoking status accounts for over 70% of model variance. Smoking introduces substantial actuarial risk for chronic cardiovascular and respiratory diseases, causing baseline charges to increase by upwards of $20,000 annually.
2. **Why compare Linear Regression against Random Forest?**
   - Linear regression provides clear interpretability and coefficient hypothesis testing ($p < 0.001$). However, Random Forest accounts for nonlinear interaction effects (such as the exponential surge in claims when an obese patient also smokes), resulting in higher $R^2$ and lower RMSE.
3. **How is multicollinearity handled?**
   - Features were checked using Pearson correlation matrices and Variance Inflation Factors (VIF). Demographic features (Age, Sex, Region) show low mutual collinearity (VIF &lt; 2.5), validating stable OLS estimation.
