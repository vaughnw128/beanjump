"""
    the thing that will decide when to spawn a new veg and run the game u know
    needs to be a class so that it can be replicated
"""
import math

def constrain(val, min, max):
    if val < min:
        val = min
    if val > max:
        val = max
    return val

class BeanJump:

    def __init__(self, player1, player2):
        self.player1 = Player(player1, first=True)
        self.player2 = Player(player2)
        self.veggies = []
    
    def update(self, player, keys):
        if self.player1.id == player:
            self.player1.update(keys)
        else:
            self.player2.update(keys)

        for veg in self.veggies:
            veg.update()
        
        # todo: check all collisions
        return { 'players': {self.player1.id: self.player1.getPos(), self.player2.id: self.player2.getPos()} }


class Player:

    """
        handle player's position, speed/movement, score, eventually skin + username
       ~~ probably not object avoidance, i'll build that into vegetable class ~~
       definitely not object avoidance, thatll be client side because i wont store all the veggies server side
    """

    def __init__(self, id, first=False):
        self.id = id
        self.first = first

        # assume for now bean is a point w/out width or height
        # ALL POSITIONS IN PERCENTAGES! WE'RE DOING THIS ONE RIGHT
        self.top = 66
        self.left = 25 if first else 75

        self.accelX = 0
        self.accelY = 0
    
    def getPos(self):
        return { 'accelX': self.accelX, 'accelY': self.accelY }

    def update(self, keys):
        self.accelY = self.accelX = 0
        if keys['jumping']:
            self.accelY = -(6.67*2)
        
        if keys['lefting']:
            self.accelX -= 1.10
        
        if keys['righting']:
            self.accelX += 1.10


class Vegetable:
    
    def __init__(self):
        self.leafyGreen = leafyGreen # 0 1 2
        self.speed = 0 # define later
        self.cooldown = 0

        self.speed *= -1 if side == 'right' else 1
        self.y = [69, 60, 40][self.leafyGreen]
        self.x = 100 if side == 'right' else -10

    def make(self): 
        pass

    def isTime(self):
        if self.cooldown <= 0:
            return True
        self.cooldown -= 1
        return False