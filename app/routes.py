"""
    returns pages that don't require additional interaction with the server
"""

from flask import render_template
from app import app

@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')

@app.route('/beantd')
def beantd():
    return render_template('beantd.html')