class FloatyText {
	constructor(txt, player) {
		this.me = document.createElement('div');
		this.me.classList.add('floaty');
		this.me.innerHTML = txt;
		document.body.appendChild(this.me);
		this.me.style.left = parseInt(player.rep.style.left) + player.rep.clientWidth/2 - this.me.clientWidth/2 + 'px';
		this.me.style.top = parseInt(player.rep.style.top) + player.rep.clientHeight/2 - this.me.clientHeight/2 + 'px';
		//console.log(this.me.clientWidth);
		this.me.style.zIndex = 300;
		this.moving = true;
		this.me.style.opacity = 1;
	}

	update() {
		this.me.style.opacity = this.me.style.opacity - 0.01;
		//console.log(this.me.style.opacity);
		this.me.style.top = parseInt(this.me.style.top) - 0.5 + 'px';
		//console.log(this.me.style.top);
		if (this.me.style.opacity <= 0) {
			document.body.removeChild(this.me);
			this.moving = false;
		}
	}
}

class VegetableManager {
    constructor() {
        this.veggies = [];
    }

    add(type, speed) {

    }
}

let floatyTexts = [];
let keys = {};
let startTime;

window.onkeydown = function(e) {
    let key = e.keyCode? e.keyCode : e.which;
    startTime = Date().now();
    keys[key] = true;
}

window.onkeyup = function(e) {
    let key = e.keyCode ? e.keyCode : e.which;
    document.getElementById('bruh').innerHTML = 'thing since : ' + (Date().now() - starTime);
    keys[key] = false;
}

function checkKeys() {
    if (keys[jump_key]) {
        
    }
}

let jump_key = 38, left_key = 37, right_key = 39;

let fpsInterval, then, startTime, elapsed;
function startGame(fps) {
    document.body.style.overflow = 'hidden';

    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    runGame();
}

function runGame() {
    now = Date.now();
    elapsed = now - then;

    if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);

        
    }
}