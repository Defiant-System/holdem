
@import "./classes/player.js"

@import "./modules/utils.js"
@import "./modules/poker.js"
@import "./modules/test.js"


const ME = karaqu.user;


const holdem = {
	init() {
		// fast references
		this.els = {
			content: window.find("content"),
			board: window.find(".board"),
			pot: window.find(".pot"),
			deck: window.find(".deck"),
			dealer: window.find(".dealer"),
			seats: window.find(".seat"),
		};

		// init objects
		Poker.init();

		// DEV-ONLY-START
		Test.init(this);
		// DEV-ONLY-END
	},
	dispatch(event) {
		let Self = holdem,
			value;
		switch (event.type) {
			// system events
			case "window.init":
				break;
			// custom events
			case "open-help":
				karaqu.shell("fs -u '~/help/index.md'");
				break;
			case "show-start-view":
			case "show-game-view":
				break;
			case "new-game":
				Poker.dispatch({ type: "start-new-round" });
				break;
			case "deal-flop":
			case "deal-turn":
			case "deal-river":
				Poker.dispatch(event);
				break;
			case "set-theme":
				Self.content.data({ theme: event.arg });
				break;
		}
	}
};

window.exports = holdem;
