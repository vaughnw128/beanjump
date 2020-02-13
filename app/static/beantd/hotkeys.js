const keys = {};

window.onkeyup = function(e) {
	let key = e.keyCode ? e.keyCode : e.which;
	if (key == 85) {
		game.enemies.push(new UncleSam());
	}
	if (key == 82) {
		game.enemies.push(new Redneck());
	}
	if (key == 84) {
		if (game.placing) {
			game.placing = null;
		} else {
			game.placing = new TowerPlace(3, 'gunbean');
		}
	}
}