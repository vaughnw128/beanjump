"""
    handle MULTIPLAYER BEAN JUMP BABY OH YEAH YEAH
"""

from flask import render_template, url_for, request
from app import app, socketio, emit
from werkzeug.contrib.cache import SimpleCache
from app.beansjump import BeanJump

gamecodes = SimpleCache(default_timeout=0)
waiting = SimpleCache(default_timeout=0)
waitingIndex = 0

games = [] # bean jump instances
onGame = 0
players = {} # points players to the correct instance

debug = open('../debug.txt', 'w+')
debug.write('')
debug.close()

debug = open('../debug.txt', 'a')

@app.route('/beansjump')
def beansjump():
    return render_template('beansjump.html')

@socketio.on('key data', namespace='/mmbj')
def updateGame(message):
    emit('next', games[players[request.sid]].update(request.sid, message))

@socketio.on('enter queue', namespace='/mmbj')
def enterQueue(message):
    global waitingIndex, waiting, debug, games, players, onGame
    debug.write('something happening')
    for i in range(waitingIndex):
        if waiting.has(i):
            debug.write('queue has someone in it already: ' + request.sid)
            opponent = waiting.get(i)
            new = BeanJump(opponent, request.sid)
            players[opponent] = onGame
            players[request.sid] = onGame

            games.append(new)

            emit('found game', {'p1': games[onGame].players[request.sid].getPos(), 'p2': games[onGame].players[opponent].getPos()}, room=opponent)
            emit('found game', {'p1': games[onGame].players[opponent].getPos(), 'p2': games[onGame].players[request.sid].getPos()}, room=request.sid)

            onGame += 1
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

the entire game, vegetable spawns, is handled on the server. client side JS sends the player's movement to the server, the server interprets
then sends back the other player's movements + any vegetables that need to be killed

remember to handle DCs and stuff! 

player "wins" by having a higher score than the other player and the other player is dead. maybe different modes? sudden death/normal


"""