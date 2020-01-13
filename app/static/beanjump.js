function constrain(val, min, max) { // used in moving player around
	if (val > max) {
		val = max;
	}
	if (val < min) {
		val = min;
	}
	return val;
}

function getCharFromCode(code) {
	if (code == 40) {
		return 'DOWN_ARROW';
	}
	if (code == 39) {
		return 'RIGHT_ARROW';
	}
	if (code == 38) {
		return 'UP_ARROW';
	}
	if (code == 37) {
		return 'LEFT_ARROW';
	}

	return String.fromCharCode(code);
}

function pause() {
	if ((new Date().getTime() - lastPaused)/1000 > 1) {
		unpaused = false;
		lastPaused = new Date().getTime();

		// need to make the pause text and background each time because otherwise it blocks the menu screen button and link
		let p_background = document.createElement('div');
		p_background.setAttribute('id','pause_background');
		p_background.classList.add('pause_background');
		p_background.style.width = $(window).width() + 'px';
		p_background.style.height = $(window).height() + 'px';
		p_background.style.left = '0px';
		p_background.style.top = '0px';
		document.body.appendChild(p_background);
		p_background.style.zIndex = 400;

		let p_text = document.createElement('div');
		p_text.setAttribute('id', 'pause_text');
		p_text.classList.add('pause_text');
		p_text.innerHTML = 'Paused<br>Press ' + getCharFromCode(pause_key) + ' to continue';
		document.body.appendChild(p_text);
		p_text.style.left = $(window).width()/2 - p_text.clientWidth/2 + 'px';
		p_text.style.top = $(window).height()/2 - p_text.clientHeight/2 + 'px';
		p_text.style.zIndex = 401;
	}
}

function unpause() {
	if ((new Date().getTime() - lastPaused)/1000 > 1) {
		document.body.removeChild(document.getElementById('pause_background'));
		document.body.removeChild(document.getElementById('pause_text'));
		let countdown = document.createElement('div');
		countdown.classList.add('countdown');
		countdown.innerHTML = '<b>3</b>';
		document.body.appendChild(countdown);
		countdown.style.zIndex = 400;
		countdown.style.left = $(window).width()/2 - countdown.clientWidth/2 + 'px';
		countdown.style.top = $(window).height()/2 - countdown.clientHeight/2 + 'px';

		setTimeout(function() {
			countdown.innerHTML = '<b>2</b>';
			countdown.style.left = $(window).width()/2 - countdown.clientWidth/2 + 'px';
			countdown.style.top = $(window).height()/2 - countdown.clientHeight/2 + 'px';
		}, 1000);
		setTimeout(function() {
			countdown.innerHTML = '<b>1</b>';
			countdown.style.left = $(window).width()/2 - countdown.clientWidth/2 + 'px';
			countdown.style.top = $(window).height()/2 - countdown.clientHeight/2 + 'px';
		}, 2000);
		setTimeout(function() { 
			document.body.removeChild(countdown);
			unpaused = true;
			lastPaused = new Date().getTime();
		}, 3000);
	}
}


let carrots_only = false;

function changeCarrots() {
	carrots_only = !carrots_only;
	alert('carrots only has been ' + ((carrots_only) ? 'enabled' : 'disabled'));
}

// determine where to draw the ground
let base_y = Math.floor($(window).height()*2 /3);
let recent_score = 0;
let best_score = 0;
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

function rebind(key) {
	rebinding = key;
}

window.onkeydown = function(e) {
	let key = e.keyCode ? e.keyCode : e.which;

	if (rebinding != null) {
		if (rebinding == 'jump') {
			jump_key = key;
		} else if (rebinding == 'pause') {
			pause_key = key;
		} else if (rebinding == 'right') {
			right_key = key;
		} else {
			left_key = key;
		}
		rebinding = null;

		updateCookie('keys', left_key + ',' + jump_key + ',' + right_key + ',' + pause_key);
		return;
	}

	keys[key] = true;
	
	if (keys[jump_key]) {
		if (! running) {
			startGame(60);
		}
	}
}

window.onkeyup = function(e) {
	let key = e.keyCode ? e.keyCode : e.which;
	keys[key] = false;
}

function checkKeys() {
	if (keys[jump_key]) {
		if (parseInt(player.rep.style.top) == base_y) {
			player.jumpin = true;
		}
	}
	if (keys[left_key]) {
		player.accelX -= 10;
	}
	if (keys[right_key]) {
		player.accelX += 10;
	}
	if (keys[pause_key]) {
		if (unpaused) {
			pause();
		} else {
			unpause();
		}
	}
}

function updateCookie(name, value) {
	document.cookie = name + '=' + value + ';';
}
var socket;

// read cookies for high score and keybinds, if they exist
window.onload = function() {
	if (document.cookie == '') return;
	let c = document.cookie.split('; ');

	for (let i = 0; i < c.length; i++) {
		if (c[i].slice(0,10) == 'highscore=') {
			best_score = (c[i].slice(10, c[0].length));
			document.getElementById('best').innerHTML = 'Best score: ' + best_score;
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

socket = io.connect('http://' + document.domain + ':' + location.port + '/beanjumpdata');

function submitScore() {
	let username = prompt('enter a username to submit with ur score: (alphanumeric characters only, 12 character limit)');

	while (!username.match(/^[a-z0-9]+$/i) || username.length > 12) {

		if (!username.match(/^[a-z0-9]+$/i)) {
			username = prompt('alphanumeric only please');
			continue;
		}

		if (username.length > 12) {
			username = prompt('less than 12 characters please');
			continue;
		}

	}

	if (typeof best_score != 'number') {
		alert('fuck you penis');
		best_score = 0;
		return;
	}
	socket.emit('new score', [username, best_score]);
}

function requestUpdatedScores() {
	socket.emit('get scores', []);
}

socket.on('update', (msg) => {
	let hsdiv = document.getElementById('highscores');
	hsdiv.style.display = 'block';

	let hs = document.getElementById('hslist');
	hs.innerHTML = '';

	for (let i = 0; i < msg.length; i++) {
		let ns = document.createElement('li');
		ns.innerHTML = msg[i][0] + ': ' + msg[i][1];
		hs.appendChild(ns);
	}
	
});

function findRank() {
	let username = prompt('enter the username to search for (capitals matter)');
	socket.emit('find score', username);
}

socket.on('found score', (msg) => {
	alert('user ' + msg.username + ' has a high score of ' + msg.highscore + ' and is ranked #' + msg.rank);
});

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
		if (player.score > best_score && ! cheated) {
			best_score = player.score;
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
	best.innerHTML = 'Best score: ' + best_score;
	updateCookie('highscore', best_score);

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
