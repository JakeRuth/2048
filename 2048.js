/*
 *
 *
 * 2048 re-code by: Jake Ruth
 *
 *
 */
 
/* Globals */
var MAX_TILES = 16;
var SQUARE_SIZE = 115;
var SQUARE_MARGIN = 8; //(500 - (115 * 4) / 4)
var STAGE_HEIGHT = 500;
var STAGE_WIDTH = 500;
var COLORS = ['maroon','red','orangered','orange','yellow','lightgreen','green','cyan','darkcyan','blue', 'purple', 'pink', 'magenta']

$(function() {
	Game.init();
});

var Game = {
	stage: null,
	squareLayer: null,
	tileLayer: null,
	grid: null,
	squares: new Array(),
	squaresFilled: new Array(),
	squaresEmpty: new Array(),
	
	init: function() {
		/* create the stage */
		Game.stage = new Kinetic.Stage({container: 'game', width: STAGE_WIDTH, height: STAGE_HEIGHT});
		Game.createGrid();
		Game.activateButtonListeners();
		/* instantiate the arrays that will be used to keep track of which boxes are filled or empty */
		Game.initCheckArrays();
		Game.initLayers();
		Game.start();
	},
	
	createGrid: function() {
		var grid = new Array();
		/* loop throught he grid of the game and create start points
		   for the boxes to be drawn */
		for(var x=SQUARE_MARGIN; x<STAGE_WIDTH; x += SQUARE_SIZE) {
			for(var y=SQUARE_MARGIN; y<STAGE_HEIGHT; y += SQUARE_SIZE) {
				grid.push({x:x , y:y});
				y += SQUARE_MARGIN;
			}
			x += SQUARE_MARGIN;
		}
		
		Game.grid = grid;
	},
	
	activateButtonListeners: function() {
		$(document).keydown(function(event){
			event.preventDefault();
			
			/* Up arrow pressed */
			if(event.which === 38) {
			
			}
			
			/* Down arrow pressed */
			if(event.which === 40) {
			
			}
			
			/* Right arrow pressed */
			if(event.which === 39) {
			
			}
			
			/* Left arrow pressed */
			if(event.which === 37) {
			
			}
		});
	},
	
	initCheckArrays: function() {
		/* loop through the arrays and initialize them all */
		for(var i=0; i<MAX_TILES; i++) {
			Game.squaresEmpty.push(i);
		}
	},
	
	initLayers: function() {
		Game.squareLayer = new Kinetic.Layer();
		Game.backgroundSquareLayer();
	},
	
	backgroundSquareLayer: function() {
		var group = new Kinetic.Group();
		
		/* loop through the game area to create 20 light gray boxes */
		for(var i=0; i<Game.grid.length; i++) {
			var square = new Kinetic.Rect({
				x: Game.grid[i].x,
				y: Game.grid[i].y,
				width: SQUARE_SIZE,
				height: SQUARE_SIZE,
				fill: '#D1D1D1'
			});
			
			group.add(square);
			Game.squares.push({square:false});
		}
		
		Game.squareLayer.add(group);
		Game.stage.add(Game.squareLayer);
	},

	generateRandomTile: function() {
		/* generate a random location for the file to generate where there is no tile already */
		var randIndex = Game.squaresEmpty[Math.floor(Math.random() * Game.squaresEmpty.length )];
		randIndex >= Game.grid.length ? randIndex-- : randIndex;
		
		/* add this index to the filled square array and delete from the empty array */
		Game.squaresFilled.push(Game.squaresEmpty[randIndex]);
		Game.squaresEmpty.splice(randIndex, 1);
		
		var group = new Kinetic.Group();
		
		/* decide whether square will be a 2 or 4 randomly */
		var squareValue;
		if(Math.random() > .5) {
			squareValue = 2;
		} else {
			squareValue = 4;
		}
		console.log(randIndex);
		var square = new Kinetic.Rect({
			x: Game.grid[randIndex].x,
			y: Game.grid[randIndex].y,
			width: SQUARE_SIZE,
			height: SQUARE_SIZE,
			fill: squareValue === 2 ? COLORS[0] : COLORS[1],
			cornerRadius: 10
		});
		group.add(square);
		
		var text = new Kinetic.Text({
			x: Game.grid[randIndex].x,
			y: Game.grid[randIndex].y,
			fontSize: 33,
			fontFamily: 'Calibri',
			fill: 'black',
			text: squareValue
		});
		group.add(text);
		
		Game.tileLayer.add(group);
		Game.stage.add(Game.tileLayer);
	},
	
	start: function() {
		Game.tileLayer = new Kinetic.Layer();
		for(var i=0; i<2; i++) {
			Game.generateRandomTile();
		}
	}
}