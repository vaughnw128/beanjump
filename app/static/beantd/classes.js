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
        this.src = 'static/beantd/highground.png';
        this.type = 'highground';
        this.buildable = true;
        this.tower = null;
    }
}

// after you select the tower icon/press T
// it spawns one of these classes
// this just keeps the tower icon under your mouse + shows radius +
// checks whether the tile u clicked on is a valid placing spot +
// if so it places an actual tower there
class TowerPlace {
    constructor(range, src) {
        this.range = range;
        this.src = src;
        this.width = 40;
        this.height = 40;
        this.xoff = this.width/2;
        this.yoff = this.height/2;
    }

    draw() {
        if (!ctx) {
            let ctx = canvas.getContext('2d');
        }

        // draw range of tower
        ctx.beginPath();
        ctx.arc(mouse_x, mouse_y, this.range*50, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'rgb(10,10,10,0.25)';
        ctx.fill();

        // draw actual tower
        ctx.drawImage(document.getElementById(this.src), mouse_x - this.xoff, mouse_y - this.yoff);
    }

    // checks on click if the mouseOver tile is valid
    isValid() {
        if (mouseOver.type == 'highground' && mouseOver.buildable && mouseOver.tower == null) {
            return true;
        }
        return false;
    }

    place() {
        if (!this.isValid()) {
            return;
        }

        if (this.src == 'gunbean') {
            mouseOver.tower = new GunBean(mouseOver);
            placing = null;
        }
    }
}

// the actual tower that stays on the tile and shoots and is upgradeable
class Tower {
    constructor(tile, damage, range, src, cooldown, direction=0, targeting='first') {
        this.damage = damage;
        this.range = range;
        this.tile = tile;
        this.src = src;
        this.direction = direction;
        this.width = 40;
        this.height = 40;
        this.xoff = this.width/2;
        this.yoff = this.height/2;
        this.targeting = targeting;
        this.initialCD = cooldown;
        this.cooldown = this.initialCD;
        this.line = null;
    }

    shoot() {
        // check all enemies to see who is in range and furthest along the path
        let available = [];

        for (let i = 0; i < enemies.length; i++) {
            if (Math.abs(enemies[i].left - (this.tile.left + this.tile.width/2)) < this.range*50 &&
            Math.abs(enemies[i].top - (this.tile.top + this.tile.height/2) < this.range*50)) {
                if (this.targeting == 'first') {
                    this.line = {
                        sx: this.tile.left + this.tile.width/2,
                        sy: this.tile.top + this.tile.height/2,
                        ex: enemies[i].left,
                        ey: enemies[i].top
                    };

                    this.direction = 90 + 180*Math.atan((this.line.ey-this.line.sy)/(this.line.ex-this.line.sx))/Math.PI;
                    if (this.line.ex < this.line.sx) {
                        this.direction += 180;
                    }
                    enemies[i].hp -= this.damage;
                    break;
                } else {
                    available.push(enemies[i]);
                }
            }
        }

        if (available.length == 0) {
            return;
        }

        // add options for strongest/weakest targeting too
        

        this.cooldown = this.initialCD;
    }

    drawLine() {
        if (this.line) {
            ctx.beginPath();
            ctx.moveTo(this.line.sx, this.line.sy);
            ctx.lineTo(this.line.ex, this.line.ey);
            ctx.strokeStyle = '#FF0000';
            ctx.stroke();
        }
    }

    readyToShoot() {
        if (this.cooldown <= this.initialCD/2) {
            this.line = null;
        }
        if (this.cooldown > 0) {
            this.cooldown --;
            return false;
        }
        return true;
    }

    draw() {
        if (!ctx) {
            let ctx = canvas.getContext('2d'); 
        }

        if (this.readyToShoot()) {
            this.shoot();
        }

        // supposedly this will draw the image rotated to face its direction
        ctx.save();
        ctx.translate(this.tile.left + this.tile.width/2, this.tile.top + this.tile.height/2);
        ctx.rotate(this.direction*Math.PI/180);
        ctx.drawImage(document.getElementById(this.src),-1*this.xoff, -1*this.yoff);
        ctx.restore();
    }
}

// basic tower type
class GunBean extends Tower {
    constructor(tile) {
        super(tile, 5, 3, 'gunbean', 60);
    }

    /* todo: upgrade system */
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

        if (this.hp <= 0) {
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