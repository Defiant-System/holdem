
@import "./classes/player.js"

@import "./modules/utils.js"
@import "./modules/ai.js"
@import "./modules/hands.js"
@import "./modules/poker.js"
@import "./modules/test.js"


const ME = karaqu.user;


const holdem = {
	init() {
		// render table seats
		window.render({
			template: "table-seats",
			match: "//Data/Seats",
			append: window.find(".table"),
		});
		// fast references
		this.els = {
			content: window.find("content"),
			table: window.find(".table"),
			board: window.find(".board"),
			pot: window.find(".pot"),
			deck: window.find(".deck"),
			dealer: window.find(".dealer"),
			seats: window.find(".seat"),
		};

		// init objects
		AI.init()
		Hands.init();
		Poker.init();

		// init all sub-objects
		Object.keys(this)
			.filter(i => typeof this[i].init === "function")
			.map(i => this[i].init(this));

		// DEV-ONLY-START
		Test.init(this);
		// DEV-ONLY-END
	},
	dispatch(event) {
		let Self = holdem,
			value,
			el;
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
				Self.els.content.data({ theme: event.arg });
				break;
			default:
				el = event.el;
				if (!el && event.origin) el = event.origin.el;
				if (el) {
					let pEl = el.parents(`?div[data-area]`);
					if (pEl.length) {
						let name = pEl.data("area");
						return Self[name].dispatch(event);
					}
				}
		}
	},
	start: @import "./areas/start.js",
	table: @import "./areas/table.js",
	dialog: @import "./areas/dialog.js",
};

window.exports = holdem;
