"""
TrackMyApps — Job Application Tracker API
Flask + SQLAlchemy + SQLite
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
CORS(app)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///trackmyapps.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

STATUSES = ["Applied", "OA/Test", "Interview", "Offer", "Rejected"]


class Application(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    company = db.Column(db.String(120), nullable=False)
    role = db.Column(db.String(120), nullable=False)
    status = db.Column(db.String(30), default="Applied")
    applied_date = db.Column(db.String(20), default=lambda: datetime.utcnow().strftime("%Y-%m-%d"))
    notes = db.Column(db.Text, default="")
    link = db.Column(db.String(300), default="")

    def to_dict(self):
        return {
            "id": self.id,
            "company": self.company,
            "role": self.role,
            "status": self.status,
            "applied_date": self.applied_date,
            "notes": self.notes,
            "link": self.link,
        }


@app.route("/api/applications", methods=["GET"])
def list_applications():
    status_filter = request.args.get("status")
    query = Application.query
    if status_filter and status_filter in STATUSES:
        query = query.filter_by(status=status_filter)
    apps = query.order_by(Application.applied_date.desc()).all()
    return jsonify([a.to_dict() for a in apps])


@app.route("/api/applications", methods=["POST"])
def create_application():
    data = request.get_json()
    if not data.get("company") or not data.get("role"):
        return jsonify({"error": "company and role are required"}), 400
    app_entry = Application(
        company=data["company"],
        role=data["role"],
        status=data.get("status", "Applied"),
        applied_date=data.get("applied_date", datetime.utcnow().strftime("%Y-%m-%d")),
        notes=data.get("notes", ""),
        link=data.get("link", ""),
    )
    db.session.add(app_entry)
    db.session.commit()
    return jsonify(app_entry.to_dict()), 201


@app.route("/api/applications/<int:app_id>", methods=["PUT"])
def update_application(app_id):
    app_entry = Application.query.get_or_404(app_id)
    data = request.get_json()
    for field in ["company", "role", "status", "applied_date", "notes", "link"]:
        if field in data:
            setattr(app_entry, field, data[field])
    db.session.commit()
    return jsonify(app_entry.to_dict())


@app.route("/api/applications/<int:app_id>", methods=["DELETE"])
def delete_application(app_id):
    app_entry = Application.query.get_or_404(app_id)
    db.session.delete(app_entry)
    db.session.commit()
    return jsonify({"message": "deleted"})


@app.route("/api/stats", methods=["GET"])
def stats():
    apps = Application.query.all()
    counts = {s: 0 for s in STATUSES}
    for a in apps:
        if a.status in counts:
            counts[a.status] += 1
    return jsonify({"total": len(apps), "by_status": counts})


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5001)
