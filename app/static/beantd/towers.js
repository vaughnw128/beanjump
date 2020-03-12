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
        ctx.drawImage(document.getElementById(this.src), this.left, this.top);
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
        this.src = 'path';
        this.type = 'path';
        this.buildable = false; // might change if i add walls
    }
}

class HighGround extends Tile {
    constructor(left, top) {
        super(left, top);
        let rn = parseInt(Math.random() * 3) + 1;
        this.src = 'highground' + rn;
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
        super(100, 'gunbeanicon');
    }

    buyTower() {
        if (game.placing) {
            game.placing = null;
            return;
        }
        if (new GunBean(null).cost > game.cash) {
            return;
        }
        game.placing = new TowerPlace(new GunBean(null).range, 'gunbean', new GunBean(null).cost);
    }
}

class LazerBeanIcon extends TowerIcon {
    constructor() {
        super(175, 'lazerbeanicon');
    }

    buyTower() {
        if (game.placing) {
            game.placing = null;
            return;
        }
        if (new LazerBean(null).cost > game.cash) {
            return;
        }
        game.placing = new TowerPlace(new LazerBean(null).range, 'lazerbean', new LazerBean(null).cost);
    }
}

class BeanBergIcon extends TowerIcon {
    constructor() {
        super(250, 'beanbergicon');
    }

    buyTower() {
        if (game.placing) {
            game.placing = null;
            return;
        }
        if (new BeanBerg(null).cost > game.cash) {
            return;
        }
        game.placing = new TowerPlace(new BeanBerg(null).range, 'beanberg', new BeanBerg(null).cost);
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
            game.mouseOver.tower.value = parseInt(new GunBean(null).cost*2/3);
        }
        if (this.src == 'lazerbean') {
            game.mouseOver.tower = new LazerBean(game.mouseOver);
            game.mouseOver.tower.value = parseInt(new LazerBean(null).cost*2/3);
        }
        if (this.src == 'beanberg') {
            game.mouseOver.tower = new BeanBerg(game.mouseOver);
            game.mouseOver.tower.value = parseInt(new BeanBerg(null).cost*2/3);
        }
        game.placing = null;
        game.cash -= this.cost;
    }
}

// the actual tower that stays on the tile and shoots and is upgradeable
class Tower {
    constructor(direction=0, targeting='first') {
        this.value = 0;
        this.damage = 0;
        this.range = 0;
        this.tile = null;
        this.src = '';
        this.direction = direction;
        this.width = 40;
        this.height = 40;
        this.xoff = this.width/2;
        this.yoff = this.height/2;
        this.targeting = targeting;
        this.initialCD = 0;
        this.cooldown = this.initialCD;
        this.cost = 0;
        this.line = null;
        this.path1 = [];
        this.path2 = [];
        this.final = false;
    }

    changeSkin() {
        if (this.path1.length == 0 && this.path2.length == 0 && !this.final) {
            this.src += 'final';
            this.final = true;
        }
    }

    drawUpgradeMenu() {
        ctx.beginPath();
        ctx.moveTo(200, canvas.height - 150);
        ctx.lineTo(200, canvas.height);
        ctx.strokeStyle = '#000000';
        ctx.stroke();
        
        ctx.moveTo(500, canvas.height - 150);
        ctx.lineTo(500, canvas.height);
        ctx.stroke();

        ctx.moveTo(800, canvas.height - 150);
        ctx.lineTo(800, canvas.height);
        ctx.stroke();

        ctx.font = '20px Calibri';
        ctx.fillStyle =  'black';

        if (this.path1.length == 0) {
            ctx.fillText('no more upgrades', 210, canvas.height - 100);
            ctx.fillText('for this path', 220, canvas.height - 80);
        } else {
            ctx.font = '25px Calibri';
            ctx.fillText(this.path1[0].title, 205, canvas.height - 120);
            ctx.font = '20px Calibri';
            ctx.fillText(this.path1[0].description, 205, canvas.height - 90);
            ctx.fillText(`$${this.path1[0].price}`, 300, canvas.height - 50);
        }

        if (this.path2.length == 0) {
            ctx.fillText('no more upgrades', 510, canvas.height - 100);
            ctx.fillText('for this path', 520, canvas.height - 80);
        } else {
            ctx.font = '25px Calibri';
            ctx.fillText(this.path2[0].title, 505, canvas.height - 120);
            ctx.font = '20px Calibri';
            ctx.fillText(this.path2[0].description, 505, canvas.height - 90);
            ctx.fillText(`$${this.path2[0].price}`, 600, canvas.height - 50);
        }
    }

    getAvailableEnemies() {
        let available = [];
        
        for (let i = 0; i < game.enemies.length; i++) {
            let dx = Math.abs(this.tile.left + this.tile.width/2 - game.enemies[i].left);
            let dy = Math.abs(this.tile.top + this.tile.height/2 - game.enemies[i].top);
            let dist = Math.sqrt((dx*dx) + (dy*dy));

            if (dist < this.range*50 + 25) {
                available.push(game.enemies[i]);
            }
        }

        return available;
    }

    selectEnemy(available) {
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
            return index;
        }
    }

    shoot() {
        // check all game.enemies to see who is in range and furthest along the path
        let available = this.getAvailableEnemies();

        if (available.length == 0) {
            return;
        }

        let index = this.selectEnemy(available);

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

        this.cooldown = this.initialCD;
    }

    drawLine() {
        if (this.line) {
            ctx.beginPath();
            ctx.moveTo(this.line.sx, this.line.sy);
            ctx.lineTo(this.line.ex, this.line.ey);
            ctx.strokeStyle = '#000000';
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

        this.changeSkin();

        // supposedly this will draw the image rotated to face its direction
        ctx.save();
        ctx.translate(this.tile.left + this.tile.width/2, this.tile.top + this.tile.height/2);
        ctx.rotate(this.direction*Math.PI/180);
        ctx.drawImage(document.getElementById(this.src),-1*this.xoff, -1*this.yoff);
        ctx.restore();
    }

    sell() {
        game.cash += this.value;
        this.tile.tower = null;
    }
}

// basic tower type
class GunBean extends Tower {
    constructor(tile) {
        super();
        this.tile = tile;
        this.damage = 4;
        this.range = 2;
        this.src = 'gunbean';
        this.cooldown = 30;
        this.initialCD = this.cooldown;
        this.cost = 50;
        
        this.path1 = [
            {
                price: 70,
                title: 'bigger bullets',
                description: 'increase damage from 4 to 10',
                action() {
                    game.selected.tower.damage = 10;
                }
            }
        ];

        this.path2 = [
            {
                price: 30,
                title: 'telescope',
                description: 'increase range to 3 tiles',
                action() {
                    game.selected.tower.range = 3;
                }
            },
            {
                price: 160,
                title: 'fully automatic',
                description: 'increase hit speed',
                action() {
                    game.selected.tower.initialCD = 15;
                    game.selected.tower.cooldown = 0;
                }
            }
        ];
    }

    drawLine() {
        if (this.line) {
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.moveTo(this.line.sx, this.line.sy);
            ctx.lineTo(this.line.ex, this.line.ey);
            ctx.strokeStyle = '#000000';
            ctx.stroke();
        }
    }
}

class LazerBean extends Tower {
    constructor(tile) {
        super();
        this.tile = tile;
        this.damage = 20;
        this.range = 2;
        this.src = 'lazerbean';
        this.cooldown = 90;
        this.initialCD = this.cooldown;
        this.cost = 100;
        this.lazerWidth = 1;
        this.explode = false;
        this.explosion = {
            c_x: 0,
            c_y: 0,
            radius: 30,
            damage: 20
        };

        this.path1 = [
            {
                price: 200,
                title: 'high power shots',
                description: 'lazer does more damage',
                action() {
                    game.selected.tower.damage = 50;
                    game.selected.tower.lazerWidth = 3;
                }
            },
            {
                price: 600,
                title: 'explody',
                description: 'lazer explodes enemy it hits',
                action() {
                    game.selected.tower.explode = true;
                }
            }
        ];

        this.path2 = [
            {
                price: 120,
                title: 'quick charge',
                description: 'reduce cooldown between shots',
                action() {
                    game.selected.tower.initialCD = 60;
                }
            }
        ];
    }

    drawLine() {
        if (this.line) {
            ctx.beginPath();
            ctx.lineWidth = this.lazerWidth;
            ctx.moveTo(this.line.sx, this.line.sy);
            ctx.lineTo(this.line.ex, this.line.ey);
            ctx.strokeStyle = '#FF0000';
            ctx.stroke();
        }
        if (this.explode && this.line) {
            ctx.beginPath();
            ctx.arc(this.explosion.c_x, this.explosion.c_y, this.explosion.radius, 0, 2*Math.PI);
            ctx.fillStyle = 'rgb(255,0,0,0.25)';
            ctx.fill();
        }
    }

    shoot() {
        // check all game.enemies to see who is in range and furthest along the path
        let available = this.getAvailableEnemies();
        if (available.length == 0) {
            return;
        }

        let index = this.selectEnemy(available);

        this.line = {
            sx: this.tile.left + this.tile.width/2,
            sy: this.tile.top + this.tile.height/2,
            ex: available[index].left,
            ey: available[index].top
        };

        if (this.explode) {
            this.explosion.c_x = this.line.ex;
            this.explosion.c_y = this.line.ey;
        }

        this.direction = 90 + 180*Math.atan((this.line.ey-this.line.sy)/(this.line.ex-this.line.sx))/Math.PI;
        
        if (this.line.ex < this.line.sx) {
            this.direction += 180;
        }

        available[index].hp -= this.damage;

        if (this.explode) {
            // find everyone in radius
            for (let i = 0; i < game.enemies.length; i++) {
                if (game.enemies[i].toString() != available[index].toString()) {
                    if (distBetween(this.line.ex, this.line.ey, game.enemies[i].left, game.enemies[i].top) <= this.explosion.radius) {
                        game.enemies[i].hp -= this.explosion.damage;
                    }
                }
            }
        }

        // add options for strongest/weakest targeting too
        

        this.cooldown = this.initialCD;
    }
}

class BeanBerg extends Tower {
    constructor(tile) {
        super();
        this.tile = tile;
        this.damage = 0;
        this.range = 1;
        this.src = 'beanberg';
        this.cooldown = 180;
        this.initialCD = this.cooldown;
        this.cost = 250;
        this.color = 'rgb(255, 255, 0, 0.25)'; // can change to represent higher levels
        this.slow = {
            // 60 = 1 second
            cooldown: 60*4,
            // percentage of original speed
            percentage: .6,
            damage: 0
        };

        this.path1 = [
            {
                price: 300,
                title: 'go faster',
                description: 'reduce cooldown between shots',
                action() {
                    game.selected.tower.cooldown = 0;
                    game.selected.tower.initialCD = 120;
                }
            }
        ];

        this.path2 = [
            {
                price: 800,
                title: 'irradiate',
                description: 'does aoe damage over time',
                action() {
                    game.selected.tower.slow.damage = 0.4; // damage per tick so make it low
                }
            }
        ];
    }

    drawLine() {
        if (this.line) {
            ctx.beginPath();
            ctx.arc(this.tile.left + this.tile.width/2, this.tile.top + this.tile.height/2, this.range*50 + 25, 0, 2*Math.PI, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    shoot() {
        let available = this.getAvailableEnemies();
        
        if (available.length == 0) {
            return;
        }

        for (let i = 0; i < available.length; i++) {
            if (available[i].slowCD <= this.slow.cooldown) {
                available[i].slowCD = this.slow.cooldown;
                available[i].speed = available[i].realSpeed*this.slow.percentage;
                if (available[i].dot < this.slow.damage) {
                    available[i].dot = this.slow.damage;
                }
            }
        }

        this.line = {
            radius: this.range * 50 + 25
        };
        
        this.cooldown = this.initialCD;
    }
}