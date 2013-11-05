(function(root){
	var MS = root.Minesweeper = (root.Minesweeper || {});

	var Board = MS.Board = function ($boardDiv, mineNumber, boardSize) {
		this.$boardDiv = $boardDiv,
		this.mineNumber = mineNumber,
		this.boardSize = boardSize;
		this.gameOver = false;

		this.makeBoard();
		this.assignMines();
	};

	Board.nearbyLocationAdjustments = [
		[1, 1],
		[1, 0],
		[1, -1],
		[0, 1],
		[0, -1],
		[-1, 1],
		[-1, 0],
		[-1, -1]
	]

	Board.$bombGIF = $("<img class='board-img' src='assets/images/bomb.gif'>");
	Board.$cheerGIF = $("<img class='board-img' src='assets/images/win.gif'>");
	Board.$stillMines = $("<img class='board-img' src='assets/images/win.gif'>");



	Board.prototype.makeBoard = function () {
		// make internal representation of board and DOM board
		this.$boardDiv.html("");
		this.board = [];

		for (var rowNum = 0; rowNum < this.boardSize; rowNum++) {
			var $rowDiv = $("<div class='row'>");
			var row = []

			for (var col = 0; col < this.boardSize; col++) {
				var $squareDiv = $("<div class='square' data-row='" + rowNum +"' data-col='" + col + "'><br />");
				$rowDiv.append($squareDiv);
				var square = new MS.Square($squareDiv, rowNum, col);
				row.push(square);
			}

			this.board.push(row);
			this.$boardDiv.append($rowDiv);
		};
	};

	Board.prototype.assignMines = function () {
		this.mineSpots = [];
		
		while (this.mineSpots.length < this.mineNumber) {
			var ranRow = Math.floor(Math.random()*this.boardSize);
			var ranCol = Math.floor(Math.random()*this.boardSize);
			var newSpot = [ranRow, ranCol];
			if (this.mineSpots.indexOf(newSpot) === -1) {
				var square = this.board[ranRow][ranCol];
				square.hasMine = true;
				this.mineSpots.push(newSpot);
			}
		}
	}

	Board.prototype.onBoard = function (row, col) {
		return (0 <= row && row < this.boardSize) && (0 <= col && col < this.boardSize);
	}

	Board.prototype.makeMove = function (row, col) {
		var square = this.board[row][col];
		if (square.hasMine) {
			this.gameOver = true;
			this.explode();
		}

		square.reveal(this);
	};


	Board.prototype.adjacentMines = function (row, col) {
		var mineCount = 0;
		var board = this;
		Board.nearbyLocationAdjustments.forEach(function (location) {
			var adjacentRow = row + location[0],
			adjacentCol = col + location[1];
			if (board.onBoard(adjacentRow, adjacentCol) && (board.board[adjacentRow][adjacentCol].hasMine)) {
					mineCount += 1;
			};
		});

		return mineCount;
	};

	Board.prototype.revealAdjacentSquares = function (row, col, visitedSquares) {
		var board = this; 

		Board.nearbyLocationAdjustments.forEach(function(location) {
			board._checkSpot(location, row, col, visitedSquares);
		});		
	}

	Board.prototype.explode = function () {
		this.$boardDiv.html(Board.$bombGIF);
	};

	Board.prototype.cheer = function () {
		this.$boardDiv.html(Board.$cheerGIF);
	};

	Board.prototype.stillMinesOutThere = function () {
		this.$boardDiv.html(Board.$stillMines);
	}


	Board.prototype.checkForWin = function () {
		var win = true;
		this.iterateThroughSquares(function(square) {
			if (!square.hasMine && !square.revealed) {
					win = false;
			}
		});
		return win;
	}

	Board.prototype._checkSpot = function (location, row, col, visitedSquares) {
		var adjacentRow = row + location[0],
				adjacentCol = col + location[1];

		visitedSquares[adjacentRow] = (visitedSquares[adjacentRow] || {})

		if (
			this.onBoard(adjacentRow, adjacentCol) &&
			!visitedSquares[adjacentRow][adjacentCol]
			) {
			adjacentSquare = this.board[adjacentRow][adjacentCol];
			adjacentSquare.reveal(this, visitedSquares);
		};	
	}

	Board.prototype.revealMines = function () {
		this.iterateThroughSquares(function(square){
			if (square.hasMine) {
				square.reveal();
				square.revealed = false;
			}
		})
	}

	Board.prototype.iterateThroughSquares = function (callback) {
		this.board.forEach(function(row){
			row.forEach(function(square){
				callback(square)
			});
		});
	}

})(window);