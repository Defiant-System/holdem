
// holdem.dialog

{
	init() {
		// fast references
		this.els = {
			el: window.find(".game-view .actions"),
			content: window.find("content"),
		};
	},
	dispatch(event) {
		let APP = holdem,
			Self = APP.dialog,
			value,
			el;
		// console.log(event);
		switch (event.type) {
			// custom events
			case "player-check":
			case "player-raise":
			case "player-call":
			case "player-fold":
				break;
			case "player-raise":
				console.log(event);
				break;
		}
	}
}
