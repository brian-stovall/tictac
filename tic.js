document.addEventListener('DOMContentLoaded', function() {
	//make references to the DOM objects
	var grab = document.getElementById.bind(document);
	var board = grab('board-container');
	var squares = board.getElementsByClassName('board-square');

	//images
	var eksImage = 'assets/pusheen.png';
	var ohImage = 'assets/nyan.png';

	//constants for boardState
	var eks = 'x';
	var oh = 'o';
	var empty = '_';

	var boardState = initBoard();
	var playerMarker = oh;

	//center the board
	board.style.top = (window.innerHeight - board.offsetHeight)/2 + 'px';
	board.style.left = (window.innerWidth - board.offsetWidth)/2 + 'px';

	//get an appropriate square size
	var squareSize = board.offsetWidth/3;

	//set up the board squares
	for (var i = 0; i < squares.length; i++) {
		var square = squares[i];
		console.log('setting up ' + square.id);

		//give them widths and heights
		square.style['min-width'] = squareSize + 'px';
		square.style['min-height'] = squareSize + 'px';

		//give them x and y props
		square.x = parseInt(square.id[0]);
		square.y = parseInt(square.id[1]);

		//place them in the window
		square.style.top = squareSize * square.y + 'px';
		square.style.left = squareSize * square.x + 'px';

		//temporary
		square.textContent = square.id;

		square.onclick = function() {
			if (placeMarker(playerMarker, boardState, this.id)) {
				this.style['background-image'] = (playerMarker === eks) ?
					'url(' + eksImage + ')' :
					'url(' + ohImage + ')' ;
			}
		};

	}

//begin code for internal game state-------------------------------------------

	//initializes an empty boardState 
	function initBoard() {
		var board = {};
		for (var i = 0; i < 3; i++)
			for (var j = 0; j < 3; j++)
				board[i+''+j] = empty;

		console.log('board initialized: ' + Object.keys(board).toString());
		return board;
	}

	//generate all the board 'triplets'
	function getTrips(board) {
		var keys = Object.keys(board);

		//to be filled with subarrays of appropriate keys
		var trips = [];

		//first the vertical and horizontal trips
		for (var i = 0; i < 3; i++) {
			trips.push(keys.filter( (val) => {return val[0] === i;}));
			trips.push(keys.filter( (val) => {return val[1] === i;}));
		}

		//now the two diagonal trips
		trips.push(['00', '11', '22']);
		trips.push(['02', '11', '20']);

		//now return all the corresponding values
		for (i = 0; i < trips.length; i++)
			trips[i] = trips[i].map( (val) => {return board.val;});

		return trips;
	}
		
	//check a single trip to see if it's one play away from being won
	function checkTrip(trip, marker) {
		var count = trip.map( (val) => {return (val === marker) ? 1 : 0;}).
			reduce( (prev, curr) => {return (prev + curr)});
		return (count === 2) ? true : false;
	}

	//returns a list of trips that are one move from being won
	function checkTrips(board, marker) {
		var trips = getTrips(board);
		return trips.map( (val) => {return checkTrip(val, marker);});
	}

	//place a marker on the board
	function placeMarker(marker, board, space) {
		if (board[space] !== empty) return false;
		else {
			board[space] = marker;
			return true;
		}
	}
//end game state code----------------------------------------------------------
});
