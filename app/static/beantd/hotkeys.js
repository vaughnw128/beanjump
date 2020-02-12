const keys = {};

window.onkeyup = function(e) {
	let key = e.keyCode ? e.keyCode : e.which;
	if (key == 85) {
		enemies.push(new UncleSam());
	}
	if (key == 82) {
		enemies.push(new Redneck());
	}
	if (key == 84) {
		if (placing) {
			placing = null;
		} else {
			placing = new TowerPlace(3, 'gunbean');
		}
	}
}