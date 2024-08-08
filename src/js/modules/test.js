
let State = {};
@import "../states/game-1.js"


let DEBUG = false;

let Test = {
	init(APP) {

		// return;

		// APP.els.content.data({ show: "start-view" });


		// return setTimeout(() => {
		// 	let board = ["c14", "h2", "d14", "c9", "c10"],
		// 		players = [
		// 			{ carda: "d12", cardb: "c6" },
		// 			{ carda: "h7", cardb: "s2" }
		// 		];
		// 	let w = Hands.getWinners(players);
		// 	console.log( w );
		// }, 500);


		// return setTimeout(() => {
		// 	Poker.dispatch({ type: "set-opponents", value: 4, noStart: true });
		// 	Poker.dispatch({ type: "shuffle-deck" });
		// 	Poker.dispatch({ type: "deal-flop" });
		// }, 500);


		// return setTimeout(() => {
		// 	Poker.dispatch({ type: "set-opponents", value: 3 });
		// 	// temp
		// 	// players.map(p => p.bet(1000));
		// 	// players.map(p => p.cardA = 1);
		// 	// players.map(p => p.cardB = 1);
		// }, 500);


		// setTimeout(() => {
		// 	// thinking
		// 	let seat = APP.els.seats.get(0).data({ status: "THINKiNG" });
		// 	seat.find("svg.outline rect").cssSequence("anim", "animationend", el => {
		// 		el.removeClass("anim");
		// 		console.log( "check or fold" );
		// 	});
		// }, 600);


		return setTimeout(() => {
			// Poker.dispatch({ type: "shuffle-deck" });
			Poker.dispatch({
				type: "restore-state",
				data: State["post-flop"]  // pre-flop	post-flop	full-table
			});

			// temp
			// APP.els.board.find(".card:nth(0)").addClass("winner");
			// APP.els.board.find(".card:nth(1)").addClass("winner");
			// APP.els.board.find(".card:nth(2)").addClass("loser");
			// APP.els.board.find(".card:nth(3)").addClass("loser");
			// APP.els.board.find(".card:nth(4)").addClass("winner");
			// APP.els.seats.get(1).data({ status: "WINNER" });

			// setTimeout(() => Poker.dispatch({ type: "output-pgn" }), 100);
		}, 500);

	}
};
