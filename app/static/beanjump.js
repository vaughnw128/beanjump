let carrots_only = false;

// determine where to draw the ground
let base_y = Math.floor($(window).height()*2 /3);
let recent_score = 0;
let bsdYYfhejeF = 0;
let cheats = false;

let unpaused = true;
let lastPaused = new Date().getTime();

let recent = document.getElementById('recent');
let best = document.getElementById('best');

let papi_info = document.getElementById('papiinfo');

let player = new Player('player');

let score = document.createElement('div');
score.classList.add('score');
score.innerHTML = 'Score: 0';
document.body.appendChild(score);
score.style.display = 'none';

let running = false;

let floatyTexts = [];

// set up background
let sky = document.getElementById('sky');
let ground = document.getElementById('ground');

sky.style.width = $(window).width() + 'px';
sky.style.height = $(window).height() + 'px';
sky.style.top = '0px';
sky.style.left = '0px';

////console.log($(window).width());

ground.style.width = $(window).width() + 'px';
ground.style.height = $(window).height() - (base_y + player.rep.clientHeight) + 'px';
ground.style.top = base_y + player.rep.clientHeight + 'px';
ground.style.left = '0px';

let jump_key = 38, left_key = 37, right_key = 39, pause_key = 40;
let keys = {};

player.rep.style.top = base_y + 'px';

let rebinding = null;

// read cookies for high score and keybinds, if they exist
window.onload = function() {
	if (document.cookie == '') return;
	let c = document.cookie.split('; ');

	for (let i = 0; i < c.length; i++) {
		if (c[i].slice(0,10) == 'highscore=') {
			try {
				bsdYYfhejeF = parseInt((c[i].slice(10, c[0].length)));
			} catch {
				bsdYYfhejeF = 0;
			}
			document.getElementById('best').innerHTML = 'Best score: ' + bsdYYfhejeF;
		}

		if (c[i].slice(0,5) == 'keys=') {
			let ka = c[i].slice(5, c[i].length).split(',');
			left_key = parseInt(ka[0]);
			jump_key = parseInt(ka[1]);
			right_key = parseInt(ka[2]);
			pause_key = parseInt(ka[3]);
		}
	}

	alert('this website uses cookies to remember your high score and keybinds. if you\'re not ok with this, leave the website because you can\'t turn them off.');

	requestUpdatedScores();
}

//runs the game at a specified fps
//dont touch i dont know how it works

let vm;
let cheated;

let fpsInterval, then, startTime, elapsed;
function startGame(fps) {
	document.body.style.overflow = 'hidden';

	ground.style.width = $(window).width() + 'px';
	sky.style.width = $(window).width() + 'px';

	vm = new VegetableManager();
	if (player == null) {
		player = new Player('player');
	}

	document.body.removeChild(onion.rep);
	document.body.removeChild(cabbage.rep);
	document.body.removeChild(carrot.rep);
	document.getElementById('menu_stuff').style.display = 'none';

	cheated = false;

	document.getElementById('sky').style.display = 'block';
	document.getElementById('ground').style.display = 'block';
	document.getElementById('player').style.display = 'block';
	ground.style.top = base_y + player.rep.clientHeight + 'px';
	running = true;
	player.alive = true;

	document.getElementsByClassName('score')[0].style.display = 'block';

    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    runGame();
}

function runGame() {
	if (! player.alive) {
		reset();
		return;
	}
	if (player.alive) {
    	requestAnimationFrame(runGame);
	}
	now = Date.now();
    elapsed = now - then;

	if (cheats) {
		cheated = true;
	}

	checkKeys();
    if (elapsed > fpsInterval && unpaused) {
		then = now - (elapsed % fpsInterval);

		if (player.jumpin) {
			player.accelY = -1 * player.jumpAccel;
			player.jumpin = false;
		}

		player.update();
		if (vm.isTime()) {
			vm.add();
		}
		vm.update();
		vm.checkCollision();

		for (let i = 0; i < floatyTexts.length; i++) {
			//console.log('updating?');
			////console.log(floatyTexts[i]);
			if (floatyTexts[i] != null) {
				//console.log(floatyTexts[i].moving);
				if (floatyTexts[i].moving) {
					//console.log('updating!');
					//console.log(floatyTexts[i]);
					floatyTexts[i].update();
				} else {
					floatyTexts.splice(i, 1);
					i --;
				}
			}
		}

		let score = document.getElementsByClassName('score')[0];
		score.innerHTML = 'Score: ' + player.score;
		recent_score = player.score;
		if (player.score > bsdYYfhejeF && ! cheated) {
			bsdYYfhejeF = player.score;
		}
    }
}

function reset() {
	document.body.style.overflow = 'scroll';
	let vml = vm.veggies.length;
	for (let i = 0; i < vml; i++) {
		vm.remove(0);
	}
	running = false;

	// summon menu screen veggies
	onion.summon('onion','Left');
	cabbage.summon('cabbage','Left');
	carrot.summon('carrot','Left');
	onion.rep.style.left = $(window).width()/2 + 'px';
	cabbage.rep.style.left = $(window).width()/2 + 'px';
	carrot.rep.style.left = $(window).width()/2 + 'px';
	onion.rep.style.top = $(window).height()/3 + 'px';
	cabbage.rep.style.top = $(window).height()/3 + 'px';
	carrot.rep.style.top = $(window).height()/3 + 'px';

	// bring back start button and score displays
	document.getElementById('menu_stuff').style.display = 'block';
	recent.innerHTML = 'Recent score: ' + recent_score;
	best.innerHTML = 'Best score: ' + bsdYYfhejeF;
	updateCookie('highscore', bsdYYfhejeF);

	// remove game stuff
	document.getElementById('sky').style.display = 'none';
	document.getElementById('ground').style.display = 'none';
	document.getElementById('player').style.display = 'none';

	for (let i = 0; i < floatyTexts.length; i++) {
		if (floatyTexts[i] != null) {
			document.body.removeChild(floatyTexts[i].me);
		}
	}

	floatyTexts = [];
	document.getElementsByClassName('score')[0].style.display = 'none';
	
	player = null;
	vm = null;
}

let onion = new Vegetable();
let cabbage = new Vegetable();
let carrot = new Vegetable();
onion.summon('onion','Left');
cabbage.summon('cabbage','Left');
carrot.summon('carrot','Left');
onion.rep.style.left = $(window).width()/2 + 'px';
cabbage.rep.style.left = $(window).width()/2 + 'px';
carrot.rep.style.left = $(window).width()/2 + 'px';
onion.rep.style.top = $(window).height()/3 + 'px';
cabbage.rep.style.top = $(window).height()/3 + 'px';
carrot.rep.style.top = $(window).height()/3 + 'px';
