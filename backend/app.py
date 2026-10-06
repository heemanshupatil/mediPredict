"""
Medical Insurance Cost Prediction - Backend
Flask API Server
"""
import os
import json
import sqlite3
import logging
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS

from services.dataset_service import DatasetService
from services.ml_service import MLService
from services.stats_service import StatsService

# ──────────────────────────────────────────────
# App Setup
# ──────────────────────────────────────────────
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(BASE_DIR, "..", "dataset", "insurance.csv")
DB_PATH = os.path.join(BASE_DIR, "data", "history.db")

# ──────────────────────────────────────────────
# Services (singleton)
# ──────────────────────────────────────────────
dataset_service = DatasetService(DATASET_PATH)
ml_service = MLService(dataset_service)
stats_service = StatsService(dataset_service)


# ──────────────────────────────────────────────
# SQLite helpers
# ──────────────────────────────────────────────
def get_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS predictions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
            age INTEGER,
            sex TEXT,
            bmi REAL,
            children INTEGER,
            smoker TEXT,
            region TEXT,
            model TEXT,
            predicted_cost REAL
        )
    """)
    conn.commit()
    conn.close()


# ──────────────────────────────────────────────
# Routes
# ──────────────────────────────────────────────
@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "timestamp": datetime.utcnow().isoformat()})


@app.route("/api/dataset", methods=["GET"])
def get_dataset():
    try:
        page = int(request.args.get("page", 1))
        per_page = int(request.args.get("per_page", 20))
        filters = {
            "sex": request.args.get("sex"),
            "smoker": request.args.get("smoker"),
            "region": request.args.get("region"),
            "bmi_min": request.args.get("bmi_min"),
            "bmi_max": request.args.get("bmi_max"),
            "age_min": request.args.get("age_min"),
            "age_max": request.args.get("age_max"),
            "search": request.args.get("search"),
        }
        result = dataset_service.get_paginated(page, per_page, filters)
        return jsonify(result)
    except Exception as e:
        logger.exception("Dataset error")
        return jsonify({"error": str(e)}), 500


@app.route("/api/statistics", methods=["GET"])
def get_statistics():
    try:
        return jsonify(stats_service.compute_all())
    except Exception as e:
        logger.exception("Statistics error")
        return jsonify({"error": str(e)}), 500


@app.route("/api/model-metrics", methods=["GET"])
def get_model_metrics():
    try:
        return jsonify(ml_service.get_metrics())
    except Exception as e:
        logger.exception("Model metrics error")
        return jsonify({"error": str(e)}), 500


@app.route("/api/correlation", methods=["GET"])
def get_correlation():
    try:
        return jsonify(stats_service.compute_correlation())
    except Exception as e:
        logger.exception("Correlation error")
        return jsonify({"error": str(e)}), 500


@app.route("/api/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No input data"}), 400

        # Validate
        errors = _validate_input(data)
        if errors:
            return jsonify({"error": "Validation failed", "details": errors}), 422

        model_name = data.get("model", "linear_regression")
        prediction = ml_service.predict(data, model_name)

        # Save to history
        conn = get_db()
        conn.execute(
            """INSERT INTO predictions
               (timestamp, age, sex, bmi, children, smoker, region, model, predicted_cost)
               VALUES (?,?,?,?,?,?,?,?,?)""",
            (
                datetime.utcnow().isoformat(),
                int(data["age"]),
                data["sex"],
                float(data["bmi"]),
                int(data["children"]),
                data["smoker"],
                data["region"],
                model_name,
                prediction["predicted_cost"],
            ),
        )
        conn.commit()
        conn.close()

        return jsonify(prediction)
    except Exception as e:
        logger.exception("Prediction error")
        return jsonify({"error": str(e)}), 500


@app.route("/api/upload-dataset", methods=["POST"])
def upload_dataset():
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400
        f = request.files["file"]
        if not f.filename.endswith(".csv"):
            return jsonify({"error": "Only CSV files are accepted"}), 400
        if len(f.read()) > 10 * 1024 * 1024:
            return jsonify({"error": "File too large (max 10MB)"}), 400
        f.seek(0)

        import pandas as pd
        import io

        content = f.read().decode("utf-8")
        df = pd.read_csv(io.StringIO(content))

        required_cols = {"age", "sex", "bmi", "children", "smoker", "region", "charges"}
        missing = required_cols - set(df.columns.str.lower())
        if missing:
            return jsonify({"error": f"Missing required columns: {missing}"}), 422

        save_path = os.path.join(BASE_DIR, "..", "dataset", "insurance.csv")
        df.to_csv(save_path, index=False)

        # Reload services
        dataset_service.reload(save_path)
        ml_service.train_all()

        return jsonify({"message": "Dataset uploaded and models retrained", "rows": len(df)})
    except Exception as e:
        logger.exception("Upload error")
        return jsonify({"error": str(e)}), 500


@app.route("/api/history", methods=["GET"])
def get_history():
    try:
        conn = get_db()
        rows = conn.execute("SELECT * FROM predictions ORDER BY id DESC").fetchall()
        conn.close()
        return jsonify([dict(r) for r in rows])
    except Exception as e:
        logger.exception("History error")
        return jsonify({"error": str(e)}), 500


@app.route("/api/history/<int:pred_id>", methods=["DELETE"])
def delete_history(pred_id):
    try:
        conn = get_db()
        conn.execute("DELETE FROM predictions WHERE id=?", (pred_id,))
        conn.commit()
        conn.close()
        return jsonify({"message": "Deleted"})
    except Exception as e:
        logger.exception("Delete history error")
        return jsonify({"error": str(e)}), 500


@app.route("/api/history", methods=["DELETE"])
def clear_history():
    try:
        conn = get_db()
        conn.execute("DELETE FROM predictions")
        conn.commit()
        conn.close()
        return jsonify({"message": "History cleared"})
    except Exception as e:
        logger.exception("Clear history error")
        return jsonify({"error": str(e)}), 500


# ──────────────────────────────────────────────
# Validation
# ──────────────────────────────────────────────
def _validate_input(data):
    errors = []
    try:
        age = int(data.get("age", -1))
        if not 18 <= age <= 100:
            errors.append("Age must be between 18 and 100")
    except (TypeError, ValueError):
        errors.append("Age must be a valid integer")

    try:
        bmi = float(data.get("bmi", -1))
        if not 10.0 <= bmi <= 70.0:
            errors.append("BMI must be between 10 and 70")
    except (TypeError, ValueError):
        errors.append("BMI must be a valid number")

    try:
        children = int(data.get("children", -1))
        if not 0 <= children <= 10:
            errors.append("Children must be between 0 and 10")
    except (TypeError, ValueError):
        errors.append("Children must be a valid integer")

    if data.get("sex") not in ("male", "female"):
        errors.append("Sex must be 'male' or 'female'")
    if data.get("smoker") not in ("yes", "no"):
        errors.append("Smoker must be 'yes' or 'no'")
    if data.get("region") not in ("northeast", "northwest", "southeast", "southwest"):
        errors.append("Region must be one of: northeast, northwest, southeast, southwest")
    return errors


# ──────────────────────────────────────────────
# Main
# ──────────────────────────────────────────────
if __name__ == "__main__":
    init_db()
    ml_service.train_all()
    app.run(host="0.0.0.0", port=5000, debug=False)
