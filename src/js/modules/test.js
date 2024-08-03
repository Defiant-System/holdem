
let Test = {
	init(APP) {
		return;
		
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
