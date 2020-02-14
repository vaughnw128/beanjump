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

class TowerIcon {
    constructor(top, src) {
        this.left = canvas.width - 175; // change later if i want to do 2 columns
        this.top = top;
        this.src = src;
        this.width = 150;
        this.height = 50;
    }

    hasCoords(x, y) {
        if (x >= this.left && x <= this.left + this.width &&
            y >= this.top && y <= this.top + this.height) {
            return true;
        }
        return false;
    }

    draw() {
        ctx.drawImage(document.getElementById(this.src), this.left, this.top);
    }

    buyTower() {
        game.placing = new TowerPlace(0,'');
    }
}

class GunBeanIcon extends TowerIcon {
    constructor() {
        super(25, 'gunbeanicon');
    }

    buyTower() {
        if (game.placing) {
            game.placing = null;
            return;
        }
        if (new GunBean(null).cost > game.cash) {
            return;
        }
        game.placing = new TowerPlace(3, 'gunbean', new GunBean(null).cost);
    }
}

// after you select the tower icon/press T
// it spawns one of these classes
// this just keeps the tower icon under your mouse + shows radius +
// checks whether the tile u clicked on is a valid game.placing spot +
// if so it places an actual tower there
class TowerPlace {
    constructor(range, src, cost) {
        this.range = range;
        this.cost = cost;
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
        ctx.arc(mouse_x, mouse_y, this.range*50 + 25, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'rgb(10,10,10,0.25)';
        ctx.fill();

        // draw actual tower
        ctx.drawImage(document.getElementById(this.src), mouse_x - this.xoff, mouse_y - this.yoff);
    }

    // checks on click if the game.mouseOver tile is valid
    isValid() {
        if (game.mouseOver.type == 'highground' && game.mouseOver.buildable && game.mouseOver.tower == null) {
            return true;
        }
        return false;
    }

    place() {
        if (this.src == 'gunbean') {
            game.mouseOver.tower = new GunBean(game.mouseOver);
        }
        game.placing = null;
        game.cash -= this.cost;
    }
}

// the actual tower that stays on the tile and shoots and is upgradeable
class Tower {
    constructor(tile, damage, range, src, cooldown, cost, direction=0, targeting='first') {
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
        this.cost = cost;
        this.line = null;
    }

    shoot() {
        // check all game.enemies to see who is in range and furthest along the path
        let available = [];

        for (let i = 0; i < game.enemies.length; i++) {
            let dx = Math.abs(this.tile.left + this.tile.width/2 - game.enemies[i].left);
            let dy = Math.abs(this.tile.top + this.tile.height/2 - game.enemies[i].top);
            let dist = Math.sqrt((dx*dx) + (dy*dy));

            if (dist < this.range*50 + 25) {
                available.push(game.enemies[i]);
            }
        }

        if (available.length == 0) {
            return;
        }

        if (this.targeting == 'first') {
            // find furthest along path
            let max_dist = available[0].dist;
            let index = 0;
            for (let i = 1; i < available.length; i++) {
                if (available[i].dist > max_dist) {
                    max_dist = available[i].dist;
                    index = i;
                }
            }
            this.line = {
                sx: this.tile.left + this.tile.width/2,
                sy: this.tile.top + this.tile.height/2,
                ex: available[index].left,
                ey: available[index].top
            };

            this.direction = 90 + 180*Math.atan((this.line.ey-this.line.sy)/(this.line.ex-this.line.sx))/Math.PI;
            if (this.line.ex < this.line.sx) {
                this.direction += 180;
            }
            available[index].hp -= this.damage;
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

    drawRange() {
        if (!ctx) {
            let ctx = canvas.getContext('2d');
        }

        ctx.beginPath();
        ctx.arc(this.tile.left + this.tile.width/2, this.tile.top + this.tile.height/2, this.range*50 + 25, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'rgb(10,10,10,0.25)';
        ctx.fill();
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
        super(tile, 5, 3, 'gunbean', 30, 20);
    }

    /* todo: upgrade system */
}


