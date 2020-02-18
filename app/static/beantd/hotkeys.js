const keys = {};

window.onkeyup = function(e) {
	let key = e.keyCode ? e.keyCode : e.which;
	if (key == 85) {
		game.enemies.push(new UncleSam());
	}
	if (key == 82) {
		game.enemies.push(new Redneck());
	}
	if (key == 71) {
		if (game.placing) {
			game.placing = null;
		} else {
			if (new GunBean(null).cost > game.cash) {
				return;
			}
			game.placing = new TowerPlace(new GunBean(null).range, 'gunbean', new GunBean(null).cost);
		}
	}
	if (key == 76) {
		if (game.placing) {
			game.placing = null;
		} else {
			if (new LazerBean(null).cost > game.cash) {
				return;
			}
			game.placing = new TowerPlace(new LazerBean(null).range, 'lazerbean', new LazerBean(null).cost);
		}
	}
}