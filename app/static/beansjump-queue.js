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

socket.on('found game', () => {
    alert('found a game!');
    startGame(60);
});