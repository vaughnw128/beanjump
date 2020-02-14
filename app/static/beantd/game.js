class Game {
    constructor(level) {
        this.loadLevel(level);
        this.selected = null;
        this.enemies = [];
        this.mouseOver = null;
        this.placing = null;

        this.hp = 20;
        this.cash = 100;
        
        // for tower menu
        this.towerIcons = [];
        this.towerIcons.push(new GunBeanIcon());
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
}