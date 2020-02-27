function distBetween(x1, y1, x2, y2) {
    let dx = Math.abs(x2 - x1);
    let dy = Math.abs(y2 - y1);
    return Math.sqrt(dx*dx + dy*dy);
}

class Game {
    constructor(level) {
        this.loadLevel(level);
        this.selected = null;
        this.enemies = [];
        this.mouseOver = null;
        this.placing = null;

        this.hp = 20;
        this.cash = 200;
        
        // for tower menu
        this.towerIcons = [];
        this.towerIcons.push(new GunBeanIcon());
        this.towerIcons.push(new LazerBeanIcon());

        this.wave = null;
        this.onLevel = 1;
    }

    loadLevel(which) {
        this.level = [];
        let l = which[0].split('\n');
        for (let i = 0; i < l.length; i++) {
           this.level.push([]);
            let b = l[i].split('');
            for (let j = 0; j < b.length; j++) {
                if (b[j] == '0') {
                    this.level[i].push(new HighGround(j*tile_height, i*tile_width));
                } else if (b[j] == '<') {
                    this.level[i].push(new Path(j*tile_height, i*tile_width, 180));
                } else if (b[j] == '>') {
                    this.level[i].push(new Path(j*tile_height, i*tile_width, 0));
                } else if (b[j] == '^') {
                    this.level[i].push(new Path(j*tile_height, i*tile_width, 90));
                } else if (b[j] == 'v') {
                    this.level[i].push(new Path(j*tile_height, i*tile_width, 270));
                }
            }
        }
        this.startTile = this.level[which[1].start_y][which[1].start_x];
    }

    end() {
        if (this.hp <= 0) {
            alert('you lose lol');
            game = null;
            menu = new Menu();
        }
    }
}

class Menu {
    constructor() {
        // coords of start button
        this.start_l = 256;
        this.start_t = 186;
        this.start_r = 458;
        this.start_b = 275;

        // coords of credits button
        this.credit_l = 360;
        this.credit_t = 342;
        this.credit_r = 511;
        this.credit_b = 402;

        // coords of return to main menu button
        this.ret_l = 100;
        this.ret_t = 550;
        this.ret_r = 250;
        this.ret_b = 590;

        this.showing = 'main';

        this.credits = ['programming/game design: ben lepsch',
    'gun bean concept: thurston whitlow',
    'moral support: minh dao',
    'occasional debugger 1: avery newman',
    'occasional debugger 2: alex ralstone'];
    }

    onStart(x, y) {
        if (this.showing != 'main') {
            return false;
        }
        if (x >= this.start_l && x <= this.start_r) {
            if (y >= this.start_t && y <= this.start_b) {
                return true;
            }
        }
        return false;
    }

    onCredits(x, y) {
        if (this.showing != 'main') {
            return false;
        }
        if (x >= this.credit_l && x <= this.credit_r) {
            if (y >= this.credit_t && y <= this.credit_b) {
                return true;
            }
        }
        return false;
    }

    onReturn(x, y) {
        if (this.showing == 'main') {
            return false;
        }
        if (x >= this.ret_l && x <= this.ret_r) {
            if (y >= this.ret_t && y <= this.ret_b) {
                return true;
            }
        }
        return false;
    }

    startGame() {
        game = new Game(test);
        menu = null;
    }

    showCredits() {
        this.showing = 'credits';
    }

    showMain() {
        this.showing = 'main';
    }
}