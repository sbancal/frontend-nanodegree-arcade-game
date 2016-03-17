var constants = {
    offsetX: 0,
    offsetY: -32,
    stepX: 101,
    stepY: 83,
    nbSlabX: 5,
    nbSlabY: 6,
    initialPlayerX: 202,
    initialPlayerY: 300,
    initialEnemyMinDelay: 100,  // ms
    initialEnemyMaxDelay: 1000,
    newEnemyMinDelay: 100,
    newEnemyMaxDelay: 1800,
    minEnemySpeed: 100,  // px/ms
    maxEnemySpeed: 250
}

// Actors (Player & Enemies)
var Actor = function(x, y, sprite) {
    this.sprite = sprite;
    this.x = x;
    this.y = y;
};
Actor.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Enemy
var Enemy = function(){
    numRoad = Math.floor(Math.random() * 3) + 1;
    Actor.call(this, -constants.stepX, constants.offsetY + (constants.stepY * numRoad), 'images/enemy-bug.png');
    this.speed = Math.floor(Math.random() * (constants.maxEnemySpeed - constants.minEnemySpeed)) + constants.minEnemySpeed;
}
Enemy.prototype = Object.create(Actor.prototype);
Enemy.prototype.constructor = Enemy;
Enemy.prototype.update = function(dt) {
    this.x += this.speed * dt;
    if (Math.abs(this.x - player.x) < constants.stepX && Math.abs(this.y - player.y) < constants.stepY){
        player.collision();
    }
    if (this.x >= (constants.nbSlabX * constants.stepX)){
        // I've reach the end
        var index = allEnemies.indexOf(this);
        allEnemies.splice(index, 1);
        Enemy.newOne();
    }
};
Enemy.newOne = function(context){
    if (context == "initial"){
        var delay = Math.random() * (constants.initialEnemyMaxDelay - constants.initialEnemyMinDelay) + constants.initialEnemyMinDelay;
        setTimeout(function(){
            allEnemies.push(new Enemy())
        }, delay);
    }else{
        var delay = Math.random() * (constants.newEnemyMaxDelay - constants.newEnemyMinDelay) + constants.newEnemyMinDelay;
        setTimeout(function(){
            allEnemies.push(new Enemy())
        }, delay);
    }
}


// Player
var Player = function() {
    Actor.call(this, constants.initialPlayerX, constants.initialPlayerY, 'images/char-boy.png');
    this.nextMove = undefined;
}
Player.prototype = Object.create(Actor.prototype);
Player.prototype.constructor = Player;
Player.prototype.handleInput = function (key) {
    this.nextMove = key;
};
Player.prototype.update = function() {
    if (this.nextMove === "left"){
        this.x -= constants.stepX;
    }else if (this.nextMove === "up") {
        this.y -= constants.stepY;
    }else if (this.nextMove === "right") {
        this.x += constants.stepX;
    }else if (this.nextMove === "down") {
        this.y += constants.stepY;
    }
    this.nextMove = undefined;
};
Player.prototype.collision = function () {
    this.x = constants.initialPlayerX;
    this.y = constants.initialPlayerY;
};

var player = new Player();
var allEnemies = [];
Enemy.newOne("initial");
Enemy.newOne("initial");
Enemy.newOne("initial");

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});
