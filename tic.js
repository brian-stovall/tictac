document.addEventListener('DOMContentLoaded', function() {
	//make references to the DOM objects
	var grab = document.getElementById.bind(document);
	var winBoard = grab('board-container');
	var squares = winBoard.getElementsByClassName('board-square');
	var eksCat = grab('eksCat');
	var ohCat = grab('ohCat');

	//images
	var eksImage = 'assets/pusheen.png';
	var ohImage = 'assets/nyan.png';

	//constants for boardState
	var eks = 'x';
	var oh = 'o';
	var empty = '_';

	var boardState = initBoard();
	var playerMark;
	var aiMark;

	//center place the eksCat and ohCat images
	var cats = document.getElementsByClassName('catImg');
	for (var i = 0; i < cats.length; i++) {
		cats[i].style.top = (window.innerHeight - cats[i].offsetHeight)/1.5 + 'px';
		cats[i].style.left = (window.innerWidth - 2 * cats[i].offsetWidth)/3 * (i+1) 
			+ (i*cats[i].offsetWidth) + 'px';
	}

	//set up click functions for cats
	ohCat.onclick = () => {
		playerMark = oh;
		aiMark = eks;
		begin();
	}

	eksCat.onclick = () => {
		playerMark = eks;
		aiMark = oh;
		begin();
	}


	//center the board
	winBoard.style.top = (window.innerHeight - winBoard.offsetHeight)/2 + 'px';
	winBoard.style.left = (window.innerWidth - winBoard.offsetWidth)/2 + 'px';

	//get an appropriate square size
	var squareSize = winBoard.offsetWidth/3;

	//set up the board squares
	for (var i = 0; i < squares.length; i++) {
		var square = squares[i];

		//give them widths and heights
		square.style['min-width'] = squareSize + 'px';
		square.style['min-height'] = squareSize + 'px';

		//give them x and y props
		square.x = parseInt(square.id[0]);
		square.y = parseInt(square.id[1]);

		//place them in the window
		square.style.top = squareSize * square.y + 'px';
		square.style.left = squareSize * square.x + 'px';
	}

		//starts the game
	function begin() {
			//set the stage
			for (var i = 0; i < cats.length; i++) 
				cats[i].style.visibility = 'hidden';
			greeting.style.visibility = 'hidden';
			winBoard.style.visiblity = 'visible';
			for (i = 0; i < squares.length; i++)
				squares[i].style.visibility = 'visible';

			//oh always starts, so if aiMark is oh, give the ai a turn first
			if (aiMark === oh) {
					var choice = document.getElementById(aiChoice(boardState, aiMark, playerMark));
					placeMarker(aiMark, boardState, choice.id);
					choice.style['background-image'] = (aiMark === eks) ?
						'url(' + eksImage + ')' :
						'url(' + ohImage + ')' ;
						choice.classList.add('animated');
						choice.classList.add( (aiMark === oh) ? 'zoomInLeft' : 'bounceIn');
			}

			for (i = 0; i < squares.length; i++) {
				var square = squares[i];
				square.onclick = function() {
					var validChoice = placeMarker(playerMark, boardState, this.id);
					if (validChoice === true) {
						this.style['background-image'] = (playerMark === eks) ?
							'url(' + eksImage + ')' :
							'url(' + ohImage + ')' ;
						this.classList.add('animated');
						this.classList.add((playerMark === oh) ? 'zoomInLeft' : 'bounceIn');
						
						if (checkWin(boardState, playerMark)) newGame ('I lost - impossible!? Rematch!');
						if (checkDraw(boardState)) window.setTimeout(callRematch, 1000);

						//ai gets a move
						var choice = document.getElementById(aiChoice(boardState, aiMark, playerMark));
						placeMarker(aiMark, boardState, choice.id);
						choice.style['background-image'] = (aiMark === eks) ?
							'url(' + eksImage + ')' :
							'url(' + ohImage + ')' ;
						choice.classList.add('animated');
						choice.classList.add( (aiMark === oh) ? 'zoomInLeft' : 'bounceIn');

						if (checkWin(boardState, aiMark)) window.setTimeout(gloat, 1000);
						if (checkDraw(boardState)) window.setTimeout(callRematch, 1000);
					}
				}
		};
	}

	function callRematch() {
		newGame('A draw? Rematch!');
	}

	function gloat() {
		newGame('That\'s how it\'s done. Again?');
	};


	//begins a new game with a message
	function newGame(message) {
		boardState = initBoard();
		winBoard.style.visiblity = 'hidden';
		for (i = 0; i < squares.length; i++) {
			squares[i].style.visibility = 'hidden';
			squares[i].style['background-image'] = '';
			squares[i].classList.remove('animated');
			squares[i].classList.remove('bounceIn');
			squares[i].classList.remove('zoomInLeft');
		}

		greeting.textContent = message;
		for (var i = 0; i < cats.length; i++) 
			cats[i].style.visibility = 'visible';
		greeting.style.visibility = 'visible';
	}

//array helper functions-------------------------------------------------------

	//removes all duplicates from an array
	function unique(arr) {
		return arr.filter( (val, idx, array) => 
			{ return array.indexOf(val) === idx; });
	}

	//randomly choose an array element, or false for empty array
	function randomArrayElem(arr) {
		if (arr.length === 0) return false;
		return arr[Math.floor(Math.random() * arr.length)];
	}


//begin code for internal game state-------------------------------------------

	//initializes an empty boardState 
	function initBoard() {
		var board = {};
		for (var i = 0; i < 3; i++)
			for (var j = 0; j < 3; j++)
				board[i+''+j] = empty;

		return board;
	}

	//generate all the board 'triplets'
	function getTrips(board) {
		var keys = Object.keys(board);

		//to be filled with subarrays of appropriate keys
		var trips = [];

		//first the vertical and horizontal trips
		for (var i = 0; i < 3; i++) {
			trips.push(keys.filter( (val) => {return val[0] === i.toString();}));
			trips.push(keys.filter( (val) => {return val[1] === i.toString();}));
		}

		//now the two diagonal trips
		trips.push(['00', '11', '22']);
		trips.push(['02', '11', '20']);


		//now return all the corresponding values
		for (i = 0; i < trips.length; i++)
			trips[i] = trips[i].map( (val) => {return [board[val], val];});


		return trips;
	}
		
	//check a single trip to see if it has a number of the marker
	function countInTrip (trip, num, marker) {
		var count = trip.map( (val) => {return (val[0] === marker) ? 1 : 0;})
		if (count.length > 0) count = count.reduce( (prev, curr) => {return (prev + curr)});
		return (count === num) ? true : false;
	}

	//returns a list of trips have num amount of a marker
	function checkBoard(board, num, marker) {
		var trips = getTrips(board);
		trips = trips.filter( (val) => {return countInTrip(val, num, marker);});
		return trips;
	}

	//composes the functions to look for a win for the marker
	function checkWin(board, marker) {
		return checkBoard(board, 3, marker).length > 0;
	}

	//check for a draw
	function checkDraw(board) {
		return (getMoves(getTrips(board)).length === 0)
	}


	//looks for trips that have winning/losing moves
	function getAtaris(board, marker) {
		return checkBoard(board, 2, marker);
	}

	//returns an array of the possible moves from a trip
	function getEmptyTrip(trip) {
		return temp =  trip.filter( (val) => { return (val[0] === empty) ? true : false;}).
			map( (val) => {return val[1]});
	}

	//returns an array of the possible moves from a set of trips
	function getMoves(trips) {
		var moves = [];
		var temp = trips.map( (val) => {return getEmptyTrip(val);}).
			filter( (val) => {return val.length > 0;});

		//now to flatten and unique-ify them
		for (var i = 0; i < temp.length; i++)
			for (var j = 0; j < temp.length; j++)
				moves.push(temp[i][j]);

		//finally, filter the empty entries
		return unique(moves).filter( (val) => {return val;});

	}

	//returns the corners in a trip style
	function getCorners(board) {
		return [[board['00'], '00'], 
						[board['20'], '20'],
						[board['02'], '02'],
						[board['22'], '22']];
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

//begin ai code----------------------------------------------------------------

  //ai method to make a choice when there are no
	//wins or neccessary blocking moves
	function aiDefaultChoice(board) {
		//first, favor the middle if possible
		if (board['11'] === empty) return '11';
		else {
			//console.log('available corners: ' + getEmptyTrip(getCorners(board)));
			//then move to the corners and finally, any random space
			return (randomArrayElem(getEmptyTrip(getCorners(board))) || 
				randomArrayElem(getMoves(getTrips(board))));
		}
	}

	//ai function - first looks for a winning move, then a blocking one
	//then chooses a default one
	function aiChoice(board, aiMark, playerMark) {
		//console.log('ataris: ' + getAtaris(board, aiMark));
		//console.log('blocks: ' + getAtaris(board, playerMark));
		return (
			randomArrayElem(getMoves(getAtaris(board, aiMark))) ||
			randomArrayElem(getMoves(getAtaris(board, playerMark))) ||
			aiDefaultChoice(board));
	}

//end ai code-------------------------------------------------------------------


});
