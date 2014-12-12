/*
Author: Bhaskar Thatraju  [github: bhaskarsai]
Date: 11/19/2014
Purpose: App engine for playing the frogger game
*/

/*
Method: random(min, max)
Input: Takes minimum and maximum numbers
Output: return a random number between min and max values
*/
var random = function (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

//global variable declaration
var imgData = new Array(), 
heart,
enemybug;

//Push the life images; set heart image and enemy-bug image that runs in multiple rows.
imgData.push("images/Gem_Blue.png");
imgData.push("images/Gem_Green.png");
imgData.push("images/Gem_Orange.png");
heart = '<img src = "images/Heart.png">',
enemybug = 'images/enemy-bug-1.png';


//Setting default in the constructor
var Enemy = function () {
  this.type = random(1, 6);
  this.sprite = enemybug;
  this.x = this.type * -101;
  this.y = random(0, 4) * 83 + 62;
  this.speed = this.type * 100;
};


/*
Method: Enemy.update(dt)
Input: A time delta between ticks
Output: none/void
Description: Update the enemy's position, required method for game
*/
Enemy.prototype.update = function(dt) {
  var length = allEnemies.length;

  this.x += this.speed * dt;  
  for (var enemy = 0; enemy < length; enemy ++) {
    if (allEnemies[enemy].x > 808) {
      allEnemies.splice(enemy, 1, new Enemy());
    }
  }

  //add enemy at various levels
  if (length < 4 + Math.floor(player.level / 5)) {
    allEnemies.push(new Enemy());
  }else if (length > 4 + Math.floor(player.level / 5)) {
    allEnemies.pop();
  }
};


/*
Method: Enemy.render()
Input: none
Output: none/void
Description: Operates on an instance of Enemy and draws the enemy on the screen.
*/
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


//Display enemy images for each row
var allEnemies = [new Enemy(), new Enemy(), new Enemy(), new Enemy()];


/*
Method: Item() Object
Input: none
Output: none/void
Description: Lifes/Items that player can collect while playing the game 
             creating an item object.
*/
var Item = function() {
  this.type = random(1, 4);
  this.sprite = imgData[(this.type)-1];
  this.x = random(0, 8) * 101;
  this.y = random(0, 4) * 83 + 55;
};


/*
Method: Item.Render()
Input: none
Output: none/void
Description: Draws/Rendering of the Item on the stage.
*/
Item.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Instantiate item
var item = new Item();


/*
Method: Player() Object
Input: player icon/image
Output: none/void
Description: The player starts at a random location on the bottom row as a 
             male unless the game was restarted and a female was selected.
*/
var Player = function (type) {
  this.type = type;
  this.sprite = 'images/char-' + this.type + '.png';
  this.x = random(0, 8) * 101;
  this.y = 402;
  this.exit = random(0, 8);
  this.level = 1;
  this.score = 0;
  this.lives = [heart, heart, heart];
  this.paused = false;
};


/*
Method: Player.update(dt)
Input: none
Output: none/void
Description: Operates on an instance of Player and checks for collisions with objects.
*/
Player.prototype.update = function() {

  //Check for enemy collisions.
  var length = allEnemies.length;
  for (var enemy = 0; enemy < length; enemy ++) {
    if (Math.abs(allEnemies[enemy].x - this.x) < 50 &&
      Math.abs(allEnemies[enemy].y - this.y) < 66) {

      //play appropriate audio sounds 
    if (this.type === 1) {
      sounds[1].play();
    }else {
      sounds[0].play();
    }

    this.lives.pop();
    this.reset();
    }
  }

  //check collossion for the items on the stage
  if (Math.abs(item.x - this.x) < 50 && Math.abs(item.y - this.y) < 66) {

    if (item.type === 4) {
      sounds[3].play();
      this.lives.push(heart);
    }else {
      sounds[2].play();
      this.score += item.type * 100;
    }

    item.x = -101;
  }else if (this.y < 45) {
    //Increase level, play a sound, create a new item, and reset player if a door collision happens.
    if (Math.abs(this.exit * 101 - this.x) < 50) {
      sounds[4].play();
      this.level ++;
      item = new Item();
    }else {
      sounds[5].play();
      this.lives.pop();
    }
    this.reset();
  }
};

/*
Method: Player.render(dt)
Input: none
Output: none/void
Description: Render screen with appropriate sprite
*/
Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


/*
Method: Player.handleInput(keycode)
Input: input from Key-board onKeyPress
Output: none/void
Description: Operates on an instance of Player and moves the player
*/

Player.prototype.handleInput = function (keycode) {
  
  //Manage directional keys along with P;
  if (keycode === 'up' && this.y > 44 && !this.paused) {
    this.y -= 83;
  }else if (keycode === 'down' && this.y < 377 && !this.paused) {
    this.y += 83;
  }else if (keycode === 'left' && this.x > 83 && !this.paused) {
    this.x -= 101;
  }else if (keycode === 'right' && this.x < 707 && !this.paused) {
    this.x += 101;
  }else if (keycode === 'p') {
    
    //Change player ICON
    if (this.type === 5) {
      this.type = 1;
    }else {
      this.type ++;
    }

   this.sprite = 'images/char-' + this.type + '.png';
  }else if (keycode === 'q') {
   //Pause the game and show quit or resume  
    this.paused = true;
    var quit = confirm('Press OK to quit or CANCEL to resume.');

    if (quit) {
      window.close();
    }else {
      this.paused = false;
    }

  }else if (keycode === 'space') {
    if (this.paused) {
      this.paused = false;
    }else {
      this.paused = true;
    }
  }
};

//Instantiate the player.
var player = new Player(1);


/*
Method: Player.reset()
Input: none
Output: none/void
Description: Reset player position after finishing the game.
*/
Player.prototype.reset = function () {
  //Confirm Game over and let user choose to restart
  if (this.lives.length === 0) {
    sounds[6].play();
    document.getElementsByClassName('lives')[0].innerHTML = 'Lives:  ' + this.lives;
    var gameOver = confirm('Game Over!  Press OK to play again or CANCEL to quit.');
    if (gameOver) {
      player = new Player(this.type);
    }else {
      //close browser window
      window.close();
    }
  }
  this.x = random(0, 8) * 101;
  this.y = 402;
  ctx.clearRect(this.exit * 101, 0, 101, 171);
  this.exit = random(0, 8);
};


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
    32: 'space',
    80: 'p',
    81: 'q'
  };
  
  player.handleInput(allowedKeys[e.keyCode]);
});