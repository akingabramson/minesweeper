(function(root){
	var MS = root.Minesweeper = (root.Minesweeper || {});

	var Square = MS.Square = function ($squareDiv, row, col) {
		this.$squareDiv = $squareDiv,
		this.row = row,
		this.col = col;
		this.hasMine = false;
		this.revealed = false;
	};

	Square.prototype.reveal = function (board, visitedSquares) {
		if (this.hasMine) {
			var $bombIMG = $("<img class='square-img' src='assets/images/bombsquare.png'>");
			this.$squareDiv.html($bombIMG);
		} else {
			var adjacentMines = board.adjacentMines(this.row, this.col);

			if (adjacentMines === 0) {
				visitedSquares = (visitedSquares || {}); // don't want to visit the same square twice
				visitedSquares[this.row] = (visitedSquares[this.row] || {})
				visitedSquares[this.row][this.col] = true;

				board.revealAdjacentSquares(this.row, this.col, visitedSquares);
			}
			var adjacentString = adjacentMines.toString()
			var $num = $("<span class='square-num'>").html(adjacentString);
			this.$squareDiv.html($num);
		}
		
		this.revealed = true;

	};



})(window);