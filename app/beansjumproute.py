"""
    handle MULTIPLAYER BEAN JUMP BABY OH YEAH YEAH
"""

from flask import render_template, url_for
from app import app, socketio, emit
from werkzeug.contrib.cache import SimpleCache

gamecodes = SimpleCache(default_timeout=0)


@app.route('/beansjump')
def beansjump():
    return render_template('beansjump.html')

@socketio.on('playwith', namespace='/mmbj')
def checkAvailable(message):
    # message will be a string thats the game code

    if gamecodes.get(message):
        # someone is waiting with the same code
        # delete the existing cache code and move both player ids into game
        # to emit to a specific player:
        # emit('string', data, room=request.sid)
        return
    
    # nobody is waiting with the code
    # add it to cache

    gamecodes.set(message, request.sid)

    

"""

notes

two options to "queue:" actual queue and play vs friend
implement vs friend first

there's a button, "join game" on click opens an input box/prompt
type in anything u want (text only?)
socket sends to server, stores it in "joinCache" or whatever
if it goes to store and there's another one of the samething, it gets both player ids and puts them in the game

actual game is "split" screen where the two players are on the same screen. there is a line down the middle that they can't cross.
veg spawn rates are maybe reduced but veggies are mirrored across both sides.
veggies ignore the center line, go right through to the other player's side

the entire game, vegetable spawns, is handled on the server. client side JS sends the player's movement to the server, the server interprets
then sends back the other player's movements + any vegetables that need to be killed

remember to handle DCs and stuff! 

player "wins" by having a higher score than the other player and the other player is dead. maybe different modes? sudden death/normal


"""