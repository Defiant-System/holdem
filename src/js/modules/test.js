
let State = {};
@import "../states/game-1.js"


let DEBUG = false;

let Test = {
	init(APP) {

		return;

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
				// over-jenny-wins
				data: State["post-turn"]
			});

			// return setTimeout(() => APP.els.table.find(".pot").addClass("to-seat-5"), 1500);

			// setTimeout(() => {
			// 	APP.els.table.cssSequence("bets-to-pot", "transitionend", tEl => {
			// 		let roll = 100,
			// 			total = 520;
			// 		tEl.find(".pot")
			// 			.css({
			// 				"--roll": roll,
			// 				"--total": total,
			// 			})
			// 			.cssSequence("ticker", "animationend", potEl => {
			// 				// reset elements
			// 				potEl.removeClass("ticker").html(total);
			// 				// reset seats
			// 				tEl.find(".seat.betting .bet").html("");
			// 				tEl.find(".seat.betting").removeClass("betting");
			// 				// reset table
			// 				tEl.removeClass("bets-to-pot");
			// 			});
			// 	});
			// }, 800);

			// setTimeout(() => window.find(`.actions .button.call`).trigger("click"), 2400);
			// setTimeout(() => window.find(`.actions .button.check`).trigger("click"), 2500);
			// setTimeout(() => {
			// 	APP.dialog.dispatch({ type: "player-raise", raise: 290 });
			// }, 400);

			// setTimeout(() => Poker.dispatch({ type: "output-pgn" }), 100);
		}, 500);

	}
};
