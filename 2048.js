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
		Game.initArrays();
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
	
	initArrays: function() {
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
		
		group = new Kinetic.Group();
		
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
		Game.tiles.push({tile: square, text: text, value: squareValue, index: randEmptyValue});
		
		/* sort the tiles array */
		Game.tiles = Utilities.sortTileArray(Game.tiles);
		
		/* sort the arrays */ 
		Game.squaresFilled.sort(function(a, b) { return a - b; });
		Game.squaresEmpty.sort(function(a, b) { return a - b; });
		
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
		var tileIndex, moveIndex;
		for(var i=0; i<Game.tiles.length; i++) {
			var move;
			tileIndex = Game.tiles[i].index;
			/* if the tile is in the top row do nothing */
			if(tileIndex % 4 === 0) {
				move = false;
			} else {
				/* check to see if the tile before it is free, if it is look at the next tile
				   and do this until you reach the top of the board of another tile */
				for(var j=0; j < tileIndex % 4; j++) {
					/* check to see if the tile before it is taken */
					if(Utilities.checkItemInArray((tileIndex - (j+1)), Game.squaresFilled)) {
						/* make move falsde only if the object already isn't set to move */
						if(!move) {
							move = false;
						}
						/* index is already occupied, exit loop */
						break;
					} else {
						/* space is not occupied, square is allowed to move here */
						move = true;
						moveIndex = tileIndex - (j+1);
					}
				}
			}
			 
			/* move the tile to its new space */
			if(move) {
				/* update the tiles index */
				Game.tiles[i].index = moveIndex;
				
				/* update the arrays to keep track of filled and unfilled tile spaces */
				Game.squaresFilled.push(moveIndex);
				Game.squaresFilled.splice(Game.squaresFilled.indexOf(tileIndex), 1);
				Game.squaresEmpty.splice(Game.squaresEmpty.indexOf(moveIndex), 1);
				Game.squaresEmpty.push(tileIndex);
				/* sort the arrays */ 
				Game.squaresFilled.sort(function(a, b) { return a - b; });
				Game.squaresEmpty.sort(function(a, b) { return a - b; });
				Game.moveTile(i, moveIndex);
			}
		}
		setTimeout(function() {
			Game.generateRandomTile();
		}, 150);
	},
	
	moveDown: function() {
		/* loop through the tiles starting from the bottom right of the grid and traverse up
		   sliding the tiles up if necessary */
		var tileIndex, moveIndex;
		for(var i=Game.tiles.length - 1; i>=0; i--) {
			var move;
			tileIndex = Game.tiles[i].index;
			/* if the tile is in the bottom row do nothing */
			if(tileIndex % 4 === 3) {
				move = false;
			} else {
				/* find the index of the bottom most tile of this row */
				var bottomTileIndex;
				//tile is in 1st collumn
				if(tileIndex < 3) { bottomTileIndex = 3; }
				//tile is in 2nd collumn
				else if(tileIndex < 7) { bottomTileIndex = 7; }
				//tile is in 3rd collumn
				else if(tileIndex < 11) { bottomTileIndex = 11; }
				//tile is in last collumn
				else { bottomTileIndex = 15; }
				
				/* check to see if the tile before it is free, if it is look at the next tile
				   and do this until you reach the top of the boarder of another tile */
				for(var j=tileIndex; j < bottomTileIndex; j++) {
					/* check to see if the tile before it is taken */
					if(Utilities.checkItemInArray((j + 1), Game.squaresFilled)) {
						/* make move false only if the object already isn't set to move */
						if(!move) {
							move = false;
						}
						/* index is already occupied, exit loop */
						break;
					} else {
						/* space is not occupied, square is allowed to move here */
						move = true;
						moveIndex = j + 1;
					}
				}
			}
			 
			/* move the tile to its new space */
			if(move) {
				/* update the tiles index */
				Game.tiles[i].index = moveIndex;
				
				/* update the arrays to keep track of filled and unfilled tile spaces */
				Game.squaresFilled.push(moveIndex);
				Game.squaresFilled.splice(Game.squaresFilled.indexOf(tileIndex), 1);
				Game.squaresEmpty.splice(Game.squaresEmpty.indexOf(moveIndex), 1);
				Game.squaresEmpty.push(tileIndex);
				/* sort the arrays */ 
				Game.squaresFilled.sort(function(a, b) { return a - b; });
				Game.squaresEmpty.sort(function(a, b) { return a - b; });
				Game.moveTile(i, moveIndex);
			}
		}
		setTimeout(function() {
			Game.generateRandomTile();
		}, 150);
	},
	
	moveRight: function() {
		/* loop through the tiles starting from the top left of the grid and traverse right
		   sliding the tiles right if necessary */
		var tileIndex, moveIndex;
		
		/* create a loop to increase index as follows :
		 * 0, 4, 8, 12, 1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15
		 *
		 * The bottom of the loop has more loop logic
		 */
		var move;
		for(var i=Game.tiles.length - 1; i >= 0; i--) {
			move = false;
			tileIndex = Game.tiles[i].index;
			/* if the tile is in the right collumn do nothing */
			if(tileIndex > 11) {
				move = false;
			} else {
				/* find the index of the bottom most tile of this row */
				var rightTileIndex;
				//tile is in 1st row
				if(tileIndex % 4 === 0) { rightTileIndex = 12; }
				//tile is in 2nd row
				else if(tileIndex % 4 === 1) { rightTileIndex = 13; }
				//tile is in 3rd row
				else if(tileIndex % 4 === 2) { rightTileIndex = 14; }
				//tile is in last row
				else if(tileIndex % 4 === 3) { rightTileIndex = 15; }
				
				/* check to see if the tile before it is free, if it is look at the next tile
				   and do this until you reach the top of the board of another tile */
				for(var j=tileIndex; j < rightTileIndex; j+=4) {
					/* check to see if the tile before it is taken */
					if(Utilities.checkItemInArray((j + 4), Game.squaresFilled)) {
						/* make move falsde only if the object already isn't set to move */
						if(!move) {
							move = false;
						}
						/* index is already occupied, exit loop */
						break;
					} else {
						/* space is not occupied, square is allowed to move here */
						move = true;
						moveIndex = j + 4;
					}
				}
			}
			 
			/* move the tile to its new space */
			if(move) {
				/* update the tiles index */
				Game.tiles[i].index = moveIndex;
				
				/* update the arrays to keep track of filled and unfilled tile spaces */
				Game.squaresFilled.push(moveIndex);
				Game.squaresFilled.splice(Game.squaresFilled.indexOf(tileIndex), 1);
				Game.squaresEmpty.splice(Game.squaresEmpty.indexOf(moveIndex), 1);
				Game.squaresEmpty.push(tileIndex);
				/* sort the arrays */ 
				Game.squaresFilled.sort(function(a, b) { return a - b; });
				Game.squaresEmpty.sort(function(a, b) { return a - b; });
				Game.moveTile(i, moveIndex);
			}
		}
		setTimeout(function() {
			Game.generateRandomTile();
		}, 150);
	},
	
	moveLeft: function() {
		/* loop through the tiles starting from the top left of the grid and traverse right
		   sliding the tiles right if necessary */
		var tileIndex, moveIndex;
		
		/* create a loop to increase index as follows :
		 * 0, 4, 8, 12, 1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15
		 *
		 * The bottom of the loop has more loop logic
		 */
		var move;
		for(var i=0; i < Game.tiles.length; i++) {
			move = false;
			tileIndex = Game.tiles[i].index;
			
			/* if the tile is in the left row do nothing */
			if(tileIndex < 4) {
				move=false;
			} else {console.log("going to try to move tile: "+tileIndex);
				/* find the index of the bottom most tile of this row */
				var leftTileIndex;
				//tile is in 1st row
				if(tileIndex % 4 === 0) { leftTileIndex = 0; }
				//tile is in 2nd row
				else if(tileIndex % 4 === 1) { leftTileIndex = 1; }
				//tile is in 3rd row
				else if(tileIndex % 4 === 2) { leftTileIndex = 2; }
				//tile is in last row
				else if(tileIndex % 4 === 3) { leftTileIndex = 3; }
				
				/* check to see if the tile before it is free, if it is look at the next tile
				   and do this until you reach the top of the board of another tile */
				for(var j=tileIndex; j > leftTileIndex; j-=4) {
					/* check to see if the tile before it is taken */
					if(Utilities.checkItemInArray((j - 4), Game.squaresFilled)) {
						/* make move falsde only if the object already isn't set to move */
						if(!move) {
							move = false;
						}
						/* index is already occupied, exit loop */
						break;
					} else {console.log('going to move it to at least: '+(j-4));
						/* space is not occupied, square is allowed to move here */
						move = true;
						moveIndex = j - 4;
					}
				}
			}
			 
			/* move the tile to its new space */
			if(move) {console.log('moving tile: '+tileIndex+' to: '+moveIndex);
				/* update the tiles index */
				Game.tiles[i].index = moveIndex;
				
				/* update the arrays to keep track of filled and unfilled tile spaces */
				Game.squaresFilled.push(moveIndex);
				Game.squaresFilled.splice(Game.squaresFilled.indexOf(tileIndex), 1);
				Game.squaresEmpty.splice(Game.squaresEmpty.indexOf(moveIndex), 1);
				Game.squaresEmpty.push(tileIndex);
				/* sort the arrays */ 
				Game.squaresFilled.sort(function(a, b) { return a - b; });
				Game.squaresEmpty.sort(function(a, b) { return a - b; });
				Game.moveTile(i, moveIndex);
			}
		}
		setTimeout(function() {
			Game.generateRandomTile();
		}, 150);
	},
	
	moveTile: function(tileIndex, moveIndex) {
		var tween = new Kinetic.Tween({
			node: Game.tiles[tileIndex].text, 
			x: Game.grid[moveIndex].x,
			y: Game.grid[moveIndex].y,
			easing: Kinetic.Easings['StrongEaseOut'],
			duration: .15
        });
		tween.play();
		tween = new Kinetic.Tween({
			node: Game.tiles[tileIndex].tile, 
			x: Game.grid[moveIndex].x,
			y: Game.grid[moveIndex].y,
			easing: Kinetic.Easings['StrongEaseOut'],
			duration: .15
        });
		tween.play();
	},
	
	showScore: function() {
	
	}
};

var Utilities = {
	//this is a very messy function, should be cleaned up and optimized
	sortTileArray: function(tileArray) {
		var sortedArray = new Array();
		var indexList = new Array();
		for(var i=0; i<tileArray.length; i++) {
			indexList.push(tileArray[i].index);
		}
		indexList.sort(function(a, b) { return a - b; });
		
		for(var i=0; i<tileArray.length; i++) {
			var tile;
			var currIndex = indexList[i];
			/* loop to find the index in tile array map that matches the current index */
			for(var j=0; j<tileArray.length; j++) {
				if(tileArray[j].index === currIndex) {
					tile = tileArray[j];
					break;
				}
			}
			/* add the tile to the sorted array */
			sortedArray.push(tile);
		}
		return sortedArray;
	},
	
	checkItemInArray: function(item, array) {
		for(var i=0; i<array.length; i++) {
			if(array[i] === item) {
				return true
			}
		}
		return false;
	}
};