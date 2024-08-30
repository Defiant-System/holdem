
let State = {};
@import "../states/game-1.js"


let DEBUG = false;

let Test = {
	init(APP) {

		// return;

		// return APP.els.content.data({ show: "game-view" });


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
				// pre-flop	post-flop	post-turn	post-river	full-table
				// post-river-high-card	post-river-one-pair	post-river-two-pair	post-river-three
				// post-river-straight	post-river-flush	post-river-full-house
				// post-river-four	post-river-straight-flush	post-river-royal-flush
				data: State["pre-flop"]
			});


			// setTimeout(() => window.find(`.actions .button.call`).trigger("click"), 400);

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
