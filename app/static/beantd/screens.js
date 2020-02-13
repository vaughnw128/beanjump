var selected = null;
var level = [];
var enemies = [];
var startTile;
var mouseOver = null;
var placing = null;

const tile_width = 50, tile_height = 50; // pixel dimensions
const game_width = 13, game_height = 9; // 13x9 tile area for actual game

function loadLevel(which) {
    level = [];
    let l = which[0].split('\n');
    for (let i = 0; i < l.length; i++) {
        level.push([]);
        let b = l[i].split('');
        for (let j = 0; j < b.length; j++) {
            if (b[j] == '0') {
                level[i].push(new HighGround(j*tile_height, i*tile_width));
            } else if (b[j] == '<') {
                level[i].push(new Path(j*tile_height, i*tile_width, 180));
            } else if (b[j] == '>') {
                level[i].push(new Path(j*tile_height, i*tile_width, 0));
            } else if (b[j] == '^') {
                level[i].push(new Path(j*tile_height, i*tile_width, 90));
            } else if (b[j] == 'v') {
                level[i].push(new Path(j*tile_height, i*tile_width, 270));
            }
        }
    }
    startTile = level[which[1].start_y][which[1].start_x];
}

function drawGame() {
    // draw grid/path (650 x 450 area)
    let foundMouse = false;
    let towers = [];

    // draw each base tile and highlight the one the mouse is on
	for (let i = 0; i < level.length; i++) {
        for (let j = 0; j < level[0].length; j++) {
            level[i][j].draw();
            if (level[i][j].tower) {
                towers.push(level[i][j].tower);
            }
            
            if (!foundMouse && level[i][j].hasCoords(mouse_x, mouse_y)) {
                foundMouse = true;
                level[i][j].highlight();
                mouseOver = level[i][j];
            }
        }
    }

    for (let i = 0; i < towers.length; i++) {
        towers[i].draw();
    }

    // draws path from the tower to the target enemy
    for (let i = 0; i < towers.length; i++) {
        towers[i].drawLine();
    }

    if (!foundMouse) {
        mouseOver = null;
    }
    
    // draw tower menu
    ctx.fillStyle = 'rgb(204, 153, 0)';
    ctx.fillRect(canvas.width-200, 0, canvas.width, canvas.height-150);

    // draw bottom menu/upgrade display
    ctx.fillStyle = 'rgb(204, 200, 0)';
    ctx.fillRect(0, canvas.height - 150, canvas.width, canvas.height);

    // draw enemies
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].update();
    }

    // draw existing towers
    /* todo: this */

    // draw potential new towers
    if (placing) {
        placing.draw();
    }
}

function drawMenu() {
    /* todo: draw menu */
}