const keys = {};

window.onkeydown = function(e) {
	let key = e.keyCode ? e.keyCode : e.which;
	keys[key] = true;
}

window.onkeyup = function(e) {
	let key = e.keyCode ? e.keyCode : e.which;
	keys[key] = false;
}

function checkKeys() {
	/*
		eventually make hotkeys to build stuff
	*/
	if (keys[85]) {
		enemies.push(new UncleSam());
	}
	if (keys[82]) {
		enemies.push(new Redneck());
	}
}