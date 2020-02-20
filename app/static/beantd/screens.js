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

    if (game.selected) {
        game.selected.tower.drawUpgradeMenu();
        ctx.strokeStyle = 'black';
        ctx.beginPath();
        ctx.rect(20, canvas.height - 60, 150, 50);
        ctx.stroke();
        ctx.fillStyle = 'black';
        ctx.font = '20px Calibri';
        ctx.fillText(`sell for $${game.selected.tower.value}`, 25, canvas.height - 35);
    }

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
    // actually draw out the menu as opposed to loading an image
    ctx.fillStyle = 'rgb(148, 90, 53)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (menu.showing == 'main') {
        ctx.strokeStyle = 'black';
        ctx.beginPath();
        ctx.rect(menu.start_l, menu.start_t, menu.start_r - menu.start_l, menu.start_b - menu.start_t);
        ctx.stroke();

        ctx.rect(menu.credit_l, menu.credit_t, menu.credit_r - menu.credit_l, menu.credit_b - menu.credit_t);
        ctx.stroke();

        ctx.font = '30px Calibri';
        ctx.fillStyle = 'black';
        ctx.fillText('bean tower defense', 200, 100);
        ctx.fillText('start gmae', menu.start_l + 30, menu.start_t + 40);
        ctx.fillText('credits', menu.credit_l + 40, menu.credit_t + 40);
    }
    if (menu.showing == 'credits') {
        ctx.font = '30px Calibri';
        ctx.fillStyle = 'black';
        let c = 100;
        for (let i = 0; i < menu.credits.length; i++) {
            ctx.fillText(menu.credits[i], 200, c + i*30);
        }

        ctx.strokeStyle = 'black';
        ctx.beginPath();
        ctx.rect(menu.ret_l, menu.ret_t, menu.ret_r - menu.ret_l, menu.ret_b - menu.ret_t);
        ctx.stroke();

        ctx.fillText('go back', menu.ret_l + 20, menu.ret_t + 30);

    }
}