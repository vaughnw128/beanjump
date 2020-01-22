"""
    handle MULTIPLAYER BEAN JUMP BABY OH YEAH YEAH
"""

from flask import render_template, url_for, request
from app import app, socketio, emit
from werkzeug.contrib.cache import SimpleCache

gamecodes = SimpleCache(default_timeout=0)
waiting = SimpleCache(default_timeout=0)
waitingIndex = 0

debug = open('../debug.txt', 'w+')
debug.write('')
debug.close()

debug = open('../debug.txt', 'a')

@app.route('/beansjump')
def beansjump():
    return render_template('beansjump.html')

@socketio.on('enter queue', namespace='/mmbj')
def enterQueue(message):
    global waitingIndex, waiting, debug
    debug.write('something happening')
    for i in range(waitingIndex):
        if waiting.has(i):
            debug.write('queue has someone in it already: ' + request.sid)
            opponent = waiting.get(i)
            emit('found game', '', room=opponent)
            emit('found game', '', room=request.sid)
            waiting.delete(i)
            return
    waiting.set(waitingIndex, request.sid)
    waitingIndex += 1
    debug.write('added request.sid ' + request.sid + ' to queue')

@socketio.on('cancel queue', namespace='/mmbj')
def cancelQueue(message):
    global waitingIndex, waiting
    for i in range(waitingIndex):
        if waiting.get(i) == request.sid:
            waiting.delete(i)
            return

@socketio.on('play with', namespace='/mmbj')
def enterFriendQueue(message):
    global gamecodes
    # message will be a string thats the game code

    if gamecodes.has(message):
        # someone is waiting with the same code
        # delete the existing cache code and move both player ids into game
        # to emit to a specific player:
        # emit('string', data, room=request.sid)
        return
    
    # nobody is waiting with the code
    # add it to cache

    gamecodes.set(message, request.sid)

@socketio.on('cancel with', namespace='/mmbj')
def leaveFriendQueue(message):
    pass


"""

notes

actual game is "split" screen where the two players are on the same screen. there is a line down the middle that they can't cross.
veg spawn rates are maybe reduced but veggies are mirrored across both sides.
veggies ignore the center line, go right through to the other player's side

the entire game, vegetable spawns, is handled on the server. client side JS sends the player's movement to the server, the server interprets
then sends back the other player's movements + any vegetables that need to be killed

remember to handle DCs and stuff! 

player "wins" by having a higher score than the other player and the other player is dead. maybe different modes? sudden death/normal


"""