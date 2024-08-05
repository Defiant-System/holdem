
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
						"0": { bankroll: 3000, name: "Hakan", cardA: "c6", cardB: "s5" },
						"1": { bankroll: 1000, name: "Nina", cardA: "c5", cardB: "s4" },
						"2": { bankroll: 2000, name: "Jenny", cardA: "c4", cardB: "s3" },
						"3": { bankroll: 3000, name: "Ricardo", cardA: "c3", cardB: "s2" },
						"4": { bankroll: 4000, name: "Mary", cardA: "c2", cardB: "d9" },
						"5": { bankroll: 5000, name: "Ann", cardA: "h6", cardB: "d8" },
						"6": { bankroll: 6000, name: "Jack", cardA: "h6", cardB: "d7" },
						"7": { bankroll: 2050, name: "Daniel", cardA: "h6", cardB: "d6" },
					},
					flop: ["h10", "s9", "c11"],
					turn: "",
					river: "",
					pot: 24750,
				}
			});

			// temp
			// players.map(p => p.bet(1000));
		}, 500);
		

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
