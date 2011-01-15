require(["bdge/bdge"], function(bdge) {

// The function passed to setGameInit will be run before the engine starts
// Most of your game logic will go inside this function
bdge.setGameInit(function() {
    // In order to access the engine, we require its components
    var engine = require("bdge/engine");
    var input = require("bdge/input");
    var loader = require("bdge/loader");
    var util = require("bdge/util");
    var draw = require("bdge/draw");
    
    // Define your game code
});

/* 
 * Now we start the loader, which in turn loads all of our resources and starts
 * the engine. If a function is passed to start, it is run after the resources
 * are loaded, before the first engine cycle.
 */
bdge.start();

});