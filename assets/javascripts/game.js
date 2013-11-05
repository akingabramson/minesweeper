(function(root){
	var MS = root.Minesweeper = (root.Minesweeper || {});

	var Game = MS.Game = function (boardDiv) {
		this.$boardDiv = $("#board");
		this.$smiley = $("#smiley");
		this.$smiley.attr("src", "assets/images/smiley.gif")
		this.board = new MS.Board(this.$boardDiv, 10, 8);

	};

	Game.prototype.run = function () {
		var game = this;
		this.bindSquare();
		this.bindSmiley();
		this.bindCheat();
	};

	Game.prototype.bindSquare = function () {
		var game = this;

		$(".square").on("click", function (event) {
			var $square = $(event.currentTarget);
			var row = $square.data("row");
			var col = $square.data("col");
			game.board.makeMove(row, col);
			if (game.board.gameOver) {
				game.end();
			}
		});
	}

	Game.prototype.bindSmiley = function () {
		var game = this;

		this.$smiley.on("click", function () {
			if (game.board.checkForWin() && !game.board.gameOver) {
				// change the gif
				game.board.cheer();
			} else {
				game.$smiley.attr("src", "assets/images/dead.gif")
			}
			game.board.gameOver = true;
		});
	}

	Game.prototype.bindCheat = function () {
		$("#cheat").on("click", this.board.revealMines.bind(this.board));
	}

	Game.prototype.end = function () {
		$(".square").unbind("click");
		$("#smiley").unbind("click")
		$("#cheat").unbind("click");
	}

})(window);