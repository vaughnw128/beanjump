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
        probably not object avoidance, i'll build that into vegetable class
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
        self.gravity = 0.17

        self.velocityX = 0
        self.velocityY = 0

        self.maxVelX = 1.3
        self.maxVelY = 2.2
    
    def getPos(self):
        return { 'left': self.left, 'top': self.top }

    def update(self, keys):
        if keys['jumping']:
            self.accelY = -6.67
        
        if keys['lefting']:
            self.accelX -= 0.52
        
        if keys['righting']:
            self.accelX += 0.52

        self.velocityX = constrain(self.velocityX + self.accelX, -1*self.maxVelX, self.maxVelX)
        self.velocityY = constrain(self.velocityY + self.gravity + self.accelY, -1*self.maxVelY, self.maxVelY)

        self.left += self.velocityX
        self.top += self.velocityY

        self.accelX = math.ceil(self.accelX/4) if self.accelX < 0 else math.floor(self.accelX/4)
        self.accelY = math.ceil(self.accelY/2) if self.accelY < 0 else math.floor(self.accelY/2)

        # need to check if its off the screen


class Vegetable:
    
    def __init__(self, leafyGreen, side):
        self.leafyGreen = leafyGreen # 0 1 2
        self.speed = 0 # define later

        self.speed *= -1 if side == 'right' else 1
        self.y = [69, 60, 40][self.leafyGreen]
        self.x = 100 if side == 'right' else -10

    def update(self):
        self.x += speed
        # todo: check if veg is off screen
