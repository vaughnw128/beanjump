var canvas = document.getElementById('mycanvas');

var wheight = $(window).height();
var wwidth = $(window).width();

canvas.style.width = (1900/1920) * wwidth + 'px';
canvas.style.height = Math.ceil((800/900) * wheight) + 'px';

var ctx = canvas.getContext('2d');

ctx.fillStyle = 'rgb(25,134,156)';
ctx.fillRect(0, 0, canvas.width, 2*canvas.height/3);

ctx.fillStyle = 'rgb(25,224,58,1)';
ctx.fillRect(0, 2*canvas.height/3, canvas.width, canvas.height);

let ground = 2*canvas.height/3;