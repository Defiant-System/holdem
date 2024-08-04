
@import "./classes/player.js"

@import "./modules/poker.js"
@import "./modules/test.js"


const ME = karaqu.user;


const holdem = {
	init() {
		// fast references
		this.els = {
			content: window.find("content"),
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
		switch (event.type) {
			// system events
			case "window.init":
				break;
			// custom events
			case "open-help":
				karaqu.shell("fs -u '~/help/index.md'");
				break;
		}
	}
};

window.exports = holdem;
