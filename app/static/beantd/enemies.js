/*
    represents a wave of enemies
    i need a way to make it so that it will automatically create waves from a number
    no randomization either so the levels are all the same
*/

class Wave {
    constructor(onLevel=1) {
        this.cdBetween = 50 * 1/onLevel;
        this.cdBetween = (this.cdBetween < 12) ? 12 : this.cdBetween;
        this.cooldown = 0;
        this.enemies = [];
        //this.finishReward = 60;
        this.finishReward = 0;

        let difficulty = (Math.pow(Math.E, .1*onLevel) + onLevel)*100;
        console.log(difficulty);

        while (difficulty > 1000) {
            difficulty -= 900;
            this.enemies.push(new Warren());
        }

        while (difficulty > 200) {
            difficulty -= 100;
            this.enemies.push(new UncleSam());
        }

        while (difficulty > 0) {
            difficulty -= 30;
            this.enemies.push(new Redneck());
        }
    }

    update() {
        if (this.spawning() && this.enemies.length >= 1) {
            this.enemies[0].created = new Date().getTime();
            game.enemies.push(this.enemies[0]);
            this.enemies.splice(0, 1);
        }
        if (this.enemies.length == 0 && game.enemies.length == 0) {
            game.onLevel += 1;
            game.cash += this.finishReward;
            game.wave = null;
        }
    }

    spawning() {
        if (this.cooldown <= 0) {
            this.cooldown = this.cdBetween;
            return true;
        }
        this.cooldown -= 1;
        return false;
    }
}

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
        //this.value = Math.ceil(hp/9);
        this.speed = speed;
        this.realSpeed = speed;
        this.slowCD = 0;
        this.left = left;
        this.top = top;
        this.direction = direction; // angle probably
        this.src = src;
        this.damage = damage;
        this.randShift = parseInt(Math.random() * 11 - 5);
        this.top += this.randShift;
        this.dot = 0;
    }

    update() {
        if (this.slowCD <= 0) {
            this.speed = this.realSpeed;
            this.dot = 0;
        } else {
            this.slowCD -= 1;
            this.hp -= this.dot;
        }
        
        let now = new Date().getTime();
        this.dist += (now - this.created) * this.speed;
        this.created = now;
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
                if (game.enemies[i].equals(this)) {
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
            if (game.enemies[i].equals(this)) {
                game.enemies.splice(i,1);
                game.hp -= this.damage;
                return;
            }
        }
    }

    equals(enemy) {
        if (typeof enemy === "object" && enemy instanceof Enemy) {
            if (enemy.src === this.src && enemy.hp === this.hp &&
            enemy.speed === this.speed && enemy.left === this.left &&
            enemy.top === this.top && enemy.direction === this.direction &&
            enemy.dist === this.dist) {
                return true;
            }
        }
        return false;
    }
}

class Warren extends Enemy {
    constructor(left, top) {
        let l = (left) ? left : game.startTile.left + game.startTile.width/2;
        let t = (top) ? top : game.startTile.top + game.startTile.height/2;
        super(850, 1.5, l, t, game.startTile.direction, 'warren', 5);
        this.value = 100;
    }
}

class UncleSam extends Enemy {
    constructor(left, top) {
        let l = (left) ? left : game.startTile.left + game.startTile.width/2;
        let t = (top) ? top : game.startTile.top + game.startTile.height/2;
        super(100, 1, l, t, game.startTile.direction, 'unclesam', 2);
        this.value = 25;
    }
}

class Redneck extends Enemy {
    constructor(left, top) {
        let l = (left) ? left : game.startTile.left + game.startTile.width/2;
        let t = (top) ? top : game.startTile.top + game.startTile.height/2;
        super(20, 2, l, t, game.startTile.direction, 'redneck', 1);
        this.value = 6;
    }
}