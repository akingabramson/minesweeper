$(function(){
	var game = new Minesweeper.Game();
	game.run();

	$("#restart").on("click", function() {
		game.end();
		game = new Minesweeper.Game();
		game.run();
	});


});