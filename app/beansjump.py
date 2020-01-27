"""
    the thing that will decide when to spawn a new veg and run the game u know
    needs to be a class so that it can be replicated
"""

class BeanJump:

    def __init__(self, player1, player2):
        self.players = { player1: Player(player1, first=True), player2: Player(player2) }
        self.veggies = []
    
    def update(self, player, keys):
        self.players[player].update(keys)

        for veg in veggies:
            veg.update()
        
        # todo: check all collisions
        return {}


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

        self.xaccel = 0
        self.yaccel = 0
        self.gravity = 0.17

        self.xvel = 0
        self.yvel = 0
    
    def getPos(self):
        return { 'left': self.left, 'top': self.top }

    def update(self, keys):
        if keys['jumping']:
            self.yaccel = -6.67
        
        if keys['lefting']:
            self.xaccel -= 0.52
        
        if keys['righting']:
            self.xaccel += 0.52



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
