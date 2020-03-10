const keys = {};

window.onkeyup = function(e) {
	let key = e.keyCode ? e.keyCode : e.which;
	// if (key == 85) {
	// 	game.enemies.push(new UncleSam());
	// }
	// if (key == 82) {
	// 	game.enemies.push(new Redneck());
	// }

	// g to place gunbean
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

	// l to place lazer bean
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

	// b to place beanberg
	if (key == 66) {
		if (game.placing) {
			game.placing = null;
		} else {
			if (new BeanBerg(null).cost > game.cash) {
				return;
			}
			game.placing = new TowerPlace(new BeanBerg(null).range, 'beanberg', new BeanBerg(null).cost);
		}
	}

	// s to sell a tower
	if (key == 83) {
		if (game.selected) {
			game.selected.tower.sell();
			game.selected = null;
		}
	}

	// esc to cancel placing a tower
	if (key == 27) {
		if (game.placing) {
			game.placing = null;
		}
	}
}