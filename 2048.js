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
	tiles: new Array(),
	
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
			
			/* sort the tiles array */
			Game.tiles = Utilities.sortTileArray(Game.tiles);
			for(var i=0; i<Game.tiles.length; i++) {
				console.log(Game.tiles[i].index);
			}
			/* Up arrow pressed */
			if(event.which === 38) {
				Game.moveUp();
			}
			
			/* Down arrow pressed */
			if(event.which === 40) {
				Game.moveDown();
			}
			
			/* Right arrow pressed */
			if(event.which === 39) {
				Game.moveRight();
			}
			
			/* Left arrow pressed */
			if(event.which === 37) {
				Game.moveLeft();
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
		/* generate a random location for the tile to generate where there is no tile already */
		var randIndex = Math.floor(Math.random() * Game.squaresEmpty.length )
		var randEmptyValue = Game.squaresEmpty[randIndex];
		
		/* if the random index was undefined that means the game is over */
		if(!randIndex  && randIndex !== 0) {
			Game.showScore();
		}
		
		/* add this index to the filled square array and delete from the empty array */
		Game.squaresFilled.push(randEmptyValue);
		Game.squaresEmpty.splice(randIndex, 1);
		
		var group = new Kinetic.Group();
		
		/* decide whether square will be a 2 or 4 randomly */
		var squareValue;
		if(Math.random() > .5) {
			squareValue = 2;
		} else {
			squareValue = 4;
		}
		
		var square = new Kinetic.Rect({
			x: Game.grid[randEmptyValue].x,
			y: Game.grid[randEmptyValue].y,
			width: SQUARE_SIZE,
			height: SQUARE_SIZE,
			fill: squareValue === 2 ? COLORS[0] : COLORS[1],
			cornerRadius: 10,
			name: 'tile'
		});
		group.add(square);
		
		var text = new Kinetic.Text({
			x: Game.grid[randEmptyValue].x,
			y: Game.grid[randEmptyValue].y,
			fontSize: 33,
			fontFamily: 'Calibri',
			fill: 'black',
			text: squareValue,
			name: 'text'
		});
		group.add(text);
		Game.tiles.push({group: group, value: squareValue, index: randEmptyValue});
		
		Game.tileLayer.add(group);
		Game.stage.add(Game.tileLayer);
	},
	
	start: function() {
		Game.tileLayer = new Kinetic.Layer();
		for(var i=0; i<2; i++) {
			Game.generateRandomTile();
		}
	},

	moveUp: function() {
		/* loop through the tiles starting from the top of the grid and traverse down
		   sliding the tiles up if necessary */
		var tileIndex;
		for(var i=0; i<Game.tiles.length; i++) {
			tileIndex = Game.tiles[i].index;
			/* if the tile is in the top row do nothing */
			if(tileIndex % 4 === 0) {
				continue;
			} else {
				
			}
			//console.log("about to move index: "+Game.tiles[i].index+" to" + tileIndex); 
			/* move the tile to its new space */
			Game.moveTile(Game.tiles[i].group, tileIndex);
		}
		setTimeout(function() {
			Game.generateRandomTile();
		}, 1000);
	},
	
	moveDown: function() {
		Game.generateRandomTile();
	},
	
	moveRight: function() {
		Game.generateRandomTile();
	},
	
	moveLeft: function() {
		Game.generateRandomTile();
	},
	
	moveTile: function(tileGroup, moveIndex) {console.log(tileGroup.find('.tile'));
		var tween = new Kinetic.Tween({
			node: tileGroup.find('.tile'), 
			x: Game.grid[moveIndex].x,
			y: Game.grid[moveIndex].y,
			easing: Kinetic.Easings['ElasticEaseOut'],
			duration: 2
		});
		tween.play();
		tween = new Kinetic.Tween({
			node: tileGroup.find('.text'), 
			x: Game.grid[moveIndex].x,
			y: Game.grid[moveIndex].y,
			easing: Kinetic.Easings['ElasticOut'],
			duration: 1
		});
		tween.play();
	},
	
	showScore: function() {
	
	}
};

var Utilities = {
	sortTileArray: function(tileArray) {
		/* add index values into array */
		var indexList = new Array();
		for(var i=0; i<tileArray.length; i++) {
			indexList.push(tileArray[i].index);	
		};
		indexList.sort();
		
		var sortedArray = new Array();
		for(var i=0; i<tileArray.length; i++) {
			sortedArray.push({	
				value: tileArray[i].value, 
				index: indexList[i]
			});
		}
		return sortedArray;
	}
};