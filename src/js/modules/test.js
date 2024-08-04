
let Test = {
	init(APP) {

		// return;

		return setTimeout(() => {
			Poker.opponents(7);

			// temp
			// players.map(p => p.bet(1000));
			players.map(p => p.cardA = 1);
			players.map(p => p.cardB = 1);
		}, 500);

		return setTimeout(() => {
			Poker.restoreState({
				dealer: 0,
				players: {
					"0": { bankroll: 3000, name: "Hakan" },
					"3": { bankroll: 4000, name: "Nina" },
					"5": { bankroll: 5000, name: "Jenny" },
					"7": { bankroll: 2050, name: "Ann" },
				},
			});

			// temp
			players.map(p => p.bet(1000));
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
