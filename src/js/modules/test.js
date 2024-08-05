
let Test = {
	init(APP) {

		// return;

		// return setTimeout(() => {
		// 	Poker.dispatch({ type: "set-opponents", value: 4, noStart: true });
		// 	Poker.dispatch({ type: "shuffle-deck" });
		// 	Poker.dispatch({ type: "deal-flop" });
		// }, 500);

		// return setTimeout(() => {
		// 	Poker.dispatch({ type: "set-opponents", value: 4 });

		// 	// temp
		// 	// players.map(p => p.bet(1000));
		// 	// players.map(p => p.cardA = 1);
		// 	// players.map(p => p.cardB = 1);
		// }, 500);

		return setTimeout(() => {
			Poker.dispatch({
				type: "restore-state",
				data: {
					dealer: 0,
					players: {
						"0": { bankroll: 3000, name: "Hakan", cardA: "c6", cardB: "s5", totalBet: 300, status: "betting" },
						"1": { bankroll: 1000, name: "Nina", cardA: "c5", cardB: "s4", totalBet: 500, status: "fold" },
						"2": { bankroll: 2000, name: "Jenny", cardA: "c4", cardB: "s3", totalBet: 700, status: "betting" },
						// "3": { bankroll: 3000, name: "Ricardo", cardA: "c3", cardB: "s2", totalBet: 600, status: "all-in" },
						// "4": { bankroll: 4000, name: "Mary", cardA: "c2", cardB: "d9", totalBet: 1300, status: "check" },
						// "5": { bankroll: 5000, name: "Ann", cardA: "h6", cardB: "d8", totalBet: 2100, status: "fold" },
						"6": { bankroll: 6000, name: "Jack", cardA: "h6", cardB: "d7", totalBet: 3000, status: "fold" },
						"7": { bankroll: 2050, name: "Daniel", cardA: "h6", cardB: "d6", totalBet: 100, status: "" },
					},
					flop: ["h10", "s9", "c11"],
					turn: "h7",
					river: "c12",
					pot: 24750,
				}
			});

			// temp
			APP.els.board.find(".card:nth(0)").addClass("winner");
			APP.els.board.find(".card:nth(1)").addClass("winner");
			APP.els.board.find(".card:nth(2)").addClass("loser");
			APP.els.board.find(".card:nth(3)").addClass("loser");
			APP.els.board.find(".card:nth(4)").addClass("winner");
			APP.els.seats.get(7).data({ status: "winner" });

			// temp
			// players.map(p => p.bet(1000));
		}, 500);

		
		return setTimeout(() => {
			// thinking
			let seat = APP.els.seats.get(0).data({ status: "thinking" });
			seat.find("svg.outline rect").cssSequence("tmp", "animationend", el => {
				el.removeClass("tmp");
				console.log( "check or fold" );
			});
		}, 600);

		setTimeout(() => {
			window.find(`.board`).cssSequence("fan-flop", "transitionend", el => {
				el.cssSequence("flip-flop", "transitionend", el => {

					setTimeout(() => el.addClass("flip-turn"), 300);
					setTimeout(() => el.addClass("flip-river"), 1300);

				});
			});
		}, 500);

	}
};
