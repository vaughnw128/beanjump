const tile_width = 50, tile_height = 50; // pixel dimensions
const game_width = 13, game_height = 9; // 13x9 tile area for actual game

function drawGame() {
    // draw grid/path (650 x 450 area)
    let foundMouse = false;
    let towers = [];

    // draw each base tile and highlight the one the mouse is on
	for (let i = 0; i < game.level.length; i++) {
        for (let j = 0; j < game.level[0].length; j++) {
            game.level[i][j].draw();
            if (game.level[i][j].tower) {
                towers.push(game.level[i][j].tower);
            }
            
            if (!foundMouse && game.level[i][j].hasCoords(mouse_x, mouse_y)) {
                foundMouse = true;
                game.level[i][j].highlight();
                game.mouseOver = game.level[i][j];
            }
        }
    }

    for (let i = 0; i < towers.length; i++) {
        towers[i].draw();
    }

    if (game.selected) {
        game.selected.tower.drawRange();
        game.selected.tower.cooldown += 1;
        game.selected.tower.draw();
    }

    // draws path from the tower to the target enemy
    for (let i = 0; i < towers.length; i++) {
        towers[i].drawLine();
    }

    if (!foundMouse) {
        game.mouseOver = null;
    }
    
    // draw tower menu
    ctx.fillStyle = 'rgb(204, 153, 0)';
    ctx.fillRect(canvas.width-200, 0, canvas.width, canvas.height-150);

    // draw bottom menu/upgrade display
    ctx.fillStyle = 'rgb(204, 200, 0)';
    ctx.fillRect(0, canvas.height - 150, canvas.width, canvas.height);

    // draw enemies
    for (let i = 0; i < game.enemies.length; i++) {
        game.enemies[i].update();
    }

    // draw existing towers
    /* todo: this */

    // draw potential new towers
    if (game.placing) {
        game.placing.draw();
    }
}

function drawMenu() {
    /* todo: draw menu */
}