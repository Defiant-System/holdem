
let Test = {
	init(APP) {

		// return;

		return setTimeout(() => {
			Poker.dispatch({ type: "set-opponents", value: 4, noStart: true });
			Poker.dispatch({ type: "shuffle-deck" });
			Poker.dispatch({ type: "deal-flop" });
		}, 500);

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
						"0": { bankroll: 3000, name: "Hakan" },
						// "1": { bankroll: 4000, name: "Nina" },
						"2": { bankroll: 4000, name: "Jenny" },
						// "3": { bankroll: 4000, name: "Ricardo" },
						"4": { bankroll: 4000, name: "Mary" },
						// "5": { bankroll: 5000, name: "Ann" },
						// "6": { bankroll: 5000, name: "Jack" },
						"7": { bankroll: 2050, name: "Daniel" },
					},
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
