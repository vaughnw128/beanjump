"""
    models for the database
"""

from app import db

class Score(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(12))
    score = db.Column(db.Integer, index=True)