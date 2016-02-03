document.addEventListener('DOMContentLoaded', function() {
	//make references to the DOM objects
	var grab = document.getElementById.bind(document);
	var board = grab('board-container');
	var squares = board.getElementsByClassName('board-square');

	//center the board
	board.style.top = (window.innerHeight - board.offsetHeight)/2 + 'px';
	board.style.left = (window.innerWidth - board.offsetWidth)/2 + 'px';


	//get an appropriate square size
	var squareSize = board.offsetWidth/3;

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

		//temporary
		square.textContent = square.id;
	}

	
});
