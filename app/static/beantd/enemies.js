/*
    enemy movement is gonna be like
    each path tile has a direction encoded into it
    when the enemy reaches the center of the tile (+- a few px) 
    their direction sets to the tile direction
*/

class Enemy {
    constructor(hp, speed, left, top, direction, src, damage) {
        this.created = new Date().getTime();
        this.dist = 0;
        this.width = 40;
        this.height = 40;
        this.xoff = this.width/2;
        this.yoff = this.height/2;
        this.hp = hp;
        this.value = hp/2;
        this.speed = speed;
        this.left = left;
        this.top = top;
        this.direction = direction; // angle probably
        this.src = src;
        this.damage = damage;
        this.randShift = parseInt(Math.random() * 11 - 5);
        this.top += this.randShift;
    }

    update() {
        let now = new Date().getTime();
        this.dist = (now - this.created) * this.speed;
        for (let i = 0; i < game.level.length; i++) {
            for (let j = 0; j < game.level[0].length; j++) {
                if (!(game.level[i][j] instanceof Path)) {
                    continue;
                }
                if (game.level[i][j].hasCoords(this.left, this.top)) {
                    if (Math.abs(this.left - (game.level[i][j].left + game.level[i][j].width/2)) < this.speed &&
                    Math.abs(this.top - (game.level[i][j].top + game.level[i][j].height/2)) < this.speed + Math.abs(this.randShift) &&
                    this.direction != game.level[i][j].direction) {
                        // close enough to the center
                        this.left = game.level[i][j].left + game.level[i][j].width/2;
                        this.top = game.level[i][j].top + game.level[i][j].height/2 + this.randShift;
                        this.direction = game.level[i][j].direction;
                        return;
                    }
                }
            }
        }
        
        this.left += this.speed*Math.cos(this.direction * Math.PI/180);
        this.top -= this.speed*Math.sin(this.direction * Math.PI/180);

        if (this.offScreen()) {
            this.finish();
        }

        this.kill();
        
        if (!ctx) {
            let ctx = canvas.getContext('2d');
         }
         // DONT do this
         // draw the image so that this.left/this.top represent the center of the image
         ctx.drawImage(document.getElementById(this.src), this.left - this.xoff, this.top - this.yoff);
    }

    offScreen() {
        if (this.left + this.width < 0 || this.top + this.height < 0) {
            return true;
        }
        return false;
    }

    // killed by tower
    kill() {
        if (this.hp <= 0) {
            game.cash += this.value;
            for (let i = 0; i < game.enemies.length; i++) {
                if (game.enemies[i].toString() == this.toString()) {
                    game.enemies.splice(i,1);
                    return;
                }
            }
        }
    }

    // made it to the end/"finish line"
    finish() {
        // find self & remove
        for (let i = 0; i < game.enemies.length; i++) {
            if (game.enemies[i].toString() == this.toString()) {
                game.enemies.splice(i,1);
                game.hp -= this.damage;
                return;
            }
        }
    }

    toString() {
        return 'type: ' + this.src + '\thp: ' + this.hp + '\tspeed: ' + this.speed + '\tleft: ' + this.left + '\ttop: ' + this.top + '\tfacing: ' + this.direction;
    }
}

class UncleSam extends Enemy {
    constructor() {
        let left = game.startTile.left + game.startTile.width/2;
        let top = game.startTile.top + game.startTile.height/2;
        super(100, 1, left, top, game.startTile.direction, 'unclesam', 2);
    }
}

class Redneck extends Enemy {
    constructor() {
        let left = game.startTile.left + game.startTile.width/2;
        let top = game.startTile.top + game.startTile.height/2;
        super(20, 2, left, top, game.startTile.direction, 'redneck', 1);
    }
}