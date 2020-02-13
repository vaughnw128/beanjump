const canvas = document.createElement('canvas');
canvas.width = 850;
canvas.height = 600;
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');
loadLevel(test);

var mouse_x = 0, mouse_y = 0;

$(document).mousemove(function(event) {
	mouse_x = event.pageX - ($(window).width()/2 - canvas.width/2);
	mouse_y = event.pageY - 8; // adjust for weird padding on top of canvas i couldn't remove
});

canvas.onmousedown = () => {
	/* 
		todo: 
		add extra logic here to tell if the mouse was clicked over the grid
		or over the area where u buy/upgrade towers
	*/

	for (let i = 0; i < level.length; i++) {
		for (let j = 0; j < level[0].length; j++) {
			if (level[i][j].hasCoords(mouse_x, mouse_y)) {
				if (placing && placing.isValid()) {
					placing.place();
					return;
				}

				if (level[i][j].type == 'highground' && level[i][j].tower) {
					selected = level[i][j];
					return;
				}
			}
		}
	}

	selected = null;
}

let fpsInterval, then, startTime, elapsed;
function startGame(fps) {
	fpsInterval = 1000 / fps;
	then = Date.now();
	startTime = then;
	runGame();
}

function runGame() {
	requestAnimationFrame(runGame);
	now = Date.now();
	elapsed = now - then;

	if (elapsed > fpsInterval) {
		then = now - (elapsed % fpsInterval);
        
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawGame();
	}
}

startGame(60);