"""
    serve + interact with /beanjump
"""

from flask import render_template, url_for
from app import app, socketio, db, emit
from app.models import Score

@app.route('/beanjump')
def beanjump():
    return render_template('beanjump.html')
"""
@socketio.on('new score', namespace='/beanjumpdata')
def add_score(message):
    already = False

    # make sure there's no exact duplicates
    for score in Score.query.all():
        #print('checking duplicate: ' + score.username + ' and ' + message[0] + '\t' + str(score.score) + ' and ' + str(message[1]))
        if score.username == message[0]:
            already = True
            
            try:
                a = int(message[1])
                print('throwing error time')
            except ValueError:
                return
            print('adding new score')
            
            if score.score > message[1]:
                return

            new = Score(username=message[0], score=message[1])
            db.session.delete(score)
            db.session.add(new)
            db.session.commit()
    
    if not already:
        new = Score(username=message[0], score=message[1])
        db.session.add(new)
        db.session.commit()
"""
@socketio.on('get scores', namespace='/beanjumpdata')
def get_scores(message):
    sending = []
    for score in Score.query.order_by(Score.score.desc()).all():
        sending.append([score.username, score.score])
    
    emit('update', sending)

@socketio.on('find score', namespace='/beanjumpdata')
def find_score(message):
    sending = { 'username': message, 'highscore': 0, 'rank': 0 }
    scores = Score.query.order_by(Score.score.desc()).all()
    for i in range(len(scores)):
        if scores[i].username == message:
            sending['highscore'] = scores[i].score
            sending['rank'] = i + 1
            break
    emit('found score', sending)
