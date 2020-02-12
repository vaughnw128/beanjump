class Tile {
    constructor(left, top) {
        this.src = '';
        this.tower = null;
        this.width = 50;
        this.height = 50;
        this.left = left;
        this.top = top;
    }

    draw() {
        if (!ctx) {
           let ctx = canvas.getContext('2d');
        }
        ctx.drawImage(document.getElementById(this.type), this.left, this.top);
    }

    hasCoords(x, y) {
        if (x >= this.left && x <= this.left + this.width &&
            y >= this.top && y <= this.top + this.height) {
            return true;
        }
        return false;
    }

    highlight() {
        if (!ctx) {
            let ctx = canvas.getContext('2d');
        }
        ctx.fillStyle = 'rgb(255, 255, 255, 0.3)';
        ctx.fillRect(this.left, this.top, this.width, this.height);
    }
}

class Path extends Tile {
    constructor(left, top, direction) {
        super(left, top);
        this.direction = direction;
        this.src = 'static/beantd/path.png';
        this.type = 'path';
        this.buildable = false; // might change if i add walls
    }
}

class HighGround extends Tile {
    constructor(left, top) {
        super(left, top);
        this.src = 'static/beantd/grass.png';
        this.type = 'grass';
        this.buildable = true;
        this.tower = null;
    }
}


class Tower {
    constructor(tile) {
        this.damage = 0;
        this.range = 0;
        this.tile = tile;
    }

    shoot() {
        // check all enemies to see who is in range and furthest along the path
    }
}


/*
    enemy movement is gonna be like
    each path tile has a direction encoded into it
    when the enemy reaches the center of the tile (+- a few px) 
    their direction sets to the tile direction
*/

class Enemy {
    constructor(hp, speed, left, top, direction, src) {
        this.width = 40;
        this.height = 40;
        this.xoff = this.width/2;
        this.yoff = this.height/2;
        this.hp = hp;
        this.speed = speed;
        this.left = left;
        this.top = top;
        this.direction = direction; // angle probably
        this.src = src;
    }

    update() {
        for (let i = 0; i < level.length; i++) {
            for (let j = 0; j < level[0].length; j++) {
                if (!(level[i][j] instanceof Path)) {
                    continue;
                }
                if (level[i][j].hasCoords(this.left, this.top)) {
                    if (Math.abs(this.left - (level[i][j].left + level[i][j].width/2)) < this.speed &&
                    Math.abs(this.top - (level[i][j].top + level[i][j].height/2)) < this.speed &&
                    this.direction != level[i][j].direction) {
                        // close enough to the center
                        this.left = level[i][j].left + level[i][j].width/2;
                        this.top = level[i][j].top + level[i][j].height/2;
                        this.direction = level[i][j].direction;
                        return;
                    }
                }
            }
        }
        
        this.left += Math.cos(this.direction * Math.PI/180);
        this.top -= Math.sin(this.direction * Math.PI/180);

        if (this.offScreen()) {
            this.finish();
        }
        
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
            // increase cash
            for (let i = 0; i < enemies.length; i++) {
                if (enemies[i].toString() == this.toString()) {
                    enemies.splice(i,1);
                    return;
                }
            }
        }
    }

    // made it to the end/"finish line"
    finish() {
        // find self & remove
        for (let i = 0; i < enemies.length; i++) {
            if (enemies[i].toString() == this.toString()) {
                enemies.splice(i,1);
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
        let left = startTile.left + startTile.width/2;
        let top = startTile.top + startTile.height/2;
        super(100, 2, left, top, startTile.direction, 'unclesam');
    }
}

class Redneck extends Enemy {
    constructor() {
        let left = startTile.left + startTile.width/2;
        let top = startTile.top + startTile.height/2;
        super(20, 2, left, top, startTile.direction, 'redneck');
    }
}