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
    
    // draw tower menu background
    ctx.fillStyle = 'rgb(204, 153, 0)';
    ctx.fillRect(canvas.width-200, 0, canvas.width, canvas.height-150);

    for (let i = 0; i < game.towerIcons.length; i++) {
        game.towerIcons[i].draw();
    }


    // draw bottom menu/upgrade display
    ctx.fillStyle = 'rgb(204, 200, 0)';
    ctx.fillRect(0, canvas.height - 150, canvas.width, canvas.height);

    // draw base hp/gold
    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(`base hp: ${game.hp}`, 10, canvas.height - 120);
    ctx.fillText(`cash: $${game.cash}`, 10, canvas.height - 90)

    // draw enemies
    for (let i = 0; i < game.enemies.length; i++) {
        game.enemies[i].update();
        game.end();
        if (!game) {
            return;
        }
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
    ctx.drawImage(document.getElementById('btdmenu'), 0, 0);
}