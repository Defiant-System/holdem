
let Test = {
	init(APP) {
		// return;

		// return setTimeout(() => Poker.opponents(3), 500);

		return setTimeout(() => {
			Poker.restoreState({
				"0": { bankroll: 300, name: "Hakan" },
				"2": { bankroll: 400, name: "Nina" },
				"4": { bankroll: 500, name: "Jenny" },
			});
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
