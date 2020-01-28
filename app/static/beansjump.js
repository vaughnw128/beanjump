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

class Player {
    // the server will decide who is player 1/player 2
    // player 1 spawns on the left side of the screen, player 2 on the right
    // after constructoring, an arrow will appear pointing down towards the player the client is while a timer ticks down on the server
    // once server timer is done it will emit something to start the game
    constructor(left, top, rep, sid) {
        this.sid = sid;

        this.rep = rep;
        this.left = left;
        this.top = top;

        this.rep.style.top = this.top + '%';
    }
}

let floatyTexts = [];
let keys = {};

window.onkeydown = function(e) {
    let key = e.keyCode? e.keyCode : e.which;
    keys[key] = true;
}

window.onkeyup = function(e) {
    let key = e.keyCode ? e.keyCode : e.which;
    keys[key] = false;
}

function checkKeys() {
    let sending = {jumping: false, lefting: false, righting: false};
    if (keys[jump_key]) {
        sending.jumping = true;
    }

    if (keys[left_key]) {
        sending.lefting = true;
    }

    if (keys[right_key]) {
        sending.righting = true;
    }
    //console.log(sending);
    socket.emit('key data', sending);
}
var player, enemy;
let jump_key = 38, left_key = 37, right_key = 39, lose_key = 80;
var stop = false;
let fpsInterval, then, startTime, elapsed;
function startGame(fps) {
    document.body.style.overflow = 'hidden';

    fpsInterval = 1000 / fps;
    then = Date.now();
    startTime = then;
    runGame();
}

function runGame() {
    requestAnimationFrame(runGame);
    now = Date.now();
    elapsed = now - then;

    if (stop) {
        return;
    }

    if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);
        checkKeys();
    }
}

var socket = io.connect('http://' + document.domain + ':' + location.port + '/mmbj');
var queueing = false;

function enterQueue() {
    let rq = document.getElementById('randomQ');
    let fq = document.getElementById('friendQ');

    if (queueing) {
        fq.style.display = 'block';
        rq.innerHTML = 'Enter Queue';
        socket.emit('cancel queue', {});
    } else {
        fq.style.display = 'none';
        rq.innerHTML = 'Cancel Queue';
        socket.emit('enter queue', {});
    }
    queueing = !queueing;
}

function playWithFriend() {
    let rq = document.getElementById('randomQ');
    let fq = document.getElementById('friendQ');

    if (queueing) {
        rq.style.display = 'block';
        fq.innerHTML = 'Play with Friend';
        socket.emit('cancel with', {});
    } else {
        rq.style.display = 'none';
        fq.innerHTML = 'Cancel Queue';
        let gc = prompt('Enter game code:');
        socket.emit('play with', {'code': gc});
    }
    queueing = !queueing;
}

socket.on('found game', (msg) => {
    let p = document.createElement('img');
    let e = document.createElement('img');

    p.src = 'static/images/bean.png';
    e.src = 'static/images/bean.png';

    let gs = document.getElementById('game_stuff');

    gs.appendChild(p);
    gs.appendChild(e);

    player = new Player(msg.p1.left, msg.p1.top, p, msg.me);
    enemy = new Player(msg.p2.left, msg.p2.top, e, msg.enemy);

    player.rep.classList.add('player');
    enemy.rep.classList.add('player');

    player.rep.style.width = '3.6458%';
    player.rep.style.height = '5.5555%';

    enemy.rep.style.width = '3.6458%';
    enemy.rep.style.height = '5.5555%';

    player.rep.style.position = 'absolute';
    enemy.rep.style.position = 'absolute';

    player.left = player.left - (player.rep.clientWidth/1920)/2;
    enemy.left = enemy.left - (enemy.rep.clientWidth/1920)/2;
    player.rep.style.left = player.left + '%';
    enemy.rep.style.left = enemy.left + '%';

    document.getElementById('menu_stuff').style.display = 'none';
    document.getElementById('game_stuff').style.display = 'block';
    startGame(30);
});

socket.on('next', (msg) => {
    //console.log(msg);
    let mid = player.sid;
    let eid = enemy.sid;
    player.rep.style.left = msg.players[mid].left + '%';
});