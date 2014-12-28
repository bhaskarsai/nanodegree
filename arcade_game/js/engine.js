/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {

    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

        canvas.width = 808;
        canvas.height = 606;

        document.body.appendChild(canvas);

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {

      /*  Get time delta information which is required for smooth animation.
       *  Because devices process instructions at different speeds, a constant
       *  value that would be the same for everyone (regardless of how fast
       *  their computer is) makes animation smooth.
       */
      var now = Date.now(),
          dt = (now - lastTime) / 1000.0;

      /* Call the update/render functions and pass the time delta to
       * the update function since it Is used for smooth animation
       * only if the game is not paused.
       */
      if (!player.paused) {
          update(dt);
          render();
      }

      /**
       * Set the lastTime variable which is used to determine the time delta
       *     for the next time this function is called.
       */
      lastTime = now;

      /**
       * Use the browser's requestAnimationFrame function to call this
       *     function again as soon as the browser is able to draw another frame.
       */
      win.requestAnimationFrame(main);
    };

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
      lastTime = Date.now();
      main();
    }

   /* This function is called by main (the game loop) and itself calls all
    * of the functions which are needed to update an entity's data.
    * @param dt A time delta between ticks.
    */
    function update(dt) {
      updateEntities(dt);
    }

    /*  This is called by the update function and loops through all of the
     *  objects within the allEnemies array as defined in app.js and calls
     *  their update() methods. It will then call the update function for the
     *  player object. These update methods should focus purely on updating
     *  the data/properties related to the object.
     * @param dt A time delta between ticks.
     */
    function updateEntities(dt) {
      allEnemies.forEach(function(enemy) {
        enemy.update(dt);
      });

      player.update();
    }

    /*
     * This function initially draws the 'game level', it will then call
     * the renderEntities function. This function is called every
     * game tick (or loop of the game engine).
     */
    function render() {
      //Initial header text and values
      document.getElementsByClassName('lives')[0].innerHTML = 'Lives:  ' +
        player.lives.join(' ');
      document.getElementsByClassName('level')[0].innerHTML = 'Level:  ' +
        player.level;
      document.getElementsByClassName('score')[0].innerHTML = 'Score:  ' +
        player.score;

      /*
       * This array holds the relative URL to the image used
       * for that particular row of the game level.
       */
      var rowImages = [
        'images/water-block.png',   // Top row is water
        'images/stone-block.png',   // Row 1 of 4 of stone
        'images/stone-block.png',   // Row 2 of 4 of stone
        'images/stone-block.png',   // Row 3 of 4 of stone
        'images/stone-block.png',   // Row 1 of 4 of stone
        'images/grass-block.png'    // Row 1 of 1 of grass
        ],
        numRows = 6,
        numCols = 8,
        row, 
        col;
              
      /*
       * Loop through the number of rows and columns defined above
       * and, using the rowImages array, draw the correct image for that
       * portion of the 'grid' and add the exit door.
       */
      for (row = 0; row < numRows; row++) {
        for (col = 0; col < numCols; col++) {

            /*
             * The drawImage function of the canvas' context element
             * requires 3 parameters: the image to draw, the x coordinate
             * to start drawing and the y coordinate to start drawing.
             * Resources helpers refer to the images
             * so that they get the benefits of caching these images, since
             * they're used over and over.
             */
            if (row == 0 && col == player.exit) {
                ctx.drawImage(Resources.get('images/door.png'), col * 101, row * 83);
            } else {
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }
      }

      renderEntities();
    }

    /*
     * This function is called by the render function and is called on each game
     * tick. It's purpose is to then call the render functions defined
     * on the enemy and player entities within app.js.
     */
    function renderEntities() {
        allEnemies.forEach(function(enemy) {
           enemy.render();
        });

        player.render();
        item.render();
    }

      /* Load all of the images needed to draw the game level.
      *  Then set init as the callback method, so that when
      *  all of these images are properly loaded the game will start.
      */
    Resources.load([
      'images/stone-block.png',
      'images/water-block.png',
      'images/grass-block.png',
      'images/door.png',
      'images/enemy-bug-1.png',
      'images/Gem_Blue.png',
      'images/Gem_Green.png',
      'images/Gem_Orange.png',
      'images/Heart.png',
      'images/char-1.png',
      'images/char-2.png',
      'images/char-3.png',
      'images/char-4.png',
      'images/char-5.png'
    ]);

    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developer's can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);