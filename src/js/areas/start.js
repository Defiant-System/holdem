
// holdem.start

{
	init() {
		// fast references
		this.els = {
			el: window.find(".start-view"),
			content: window.find("content"),
		};
	},
	dispatch(event) {
		let APP = holdem,
			Self = APP.start,
			value,
			el;
		// console.log(event);
		switch (event.type) {
			// custom events
			case "set-opponents":
				// reset seats
				APP.els.seats.attr({ class: "seat" }).removeAttr("data-status");
				// forward event
				Poker.dispatch({ ...event, value: +event.arg });
				APP.els.content.data({ show: "game-view" });
				break;
		}
	}
}
