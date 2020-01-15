"""
    the thing that will decide when to spawn a new veg and run the game u know
    needs to be a class so that it can be replicated
"""

class BeanJump:

    def __init__(self, player1, player):
        self.player1 = Player(player1, first=True)
        self.player2 = Player(player2)



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
        self.y_pos = 66
        self.x_pos = 25 if first else 75