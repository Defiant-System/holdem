
// holdem.table

{
	init() {
		// fast references
		this.els = {
			el: window.find(".game-view .table"),
			content: window.find("content"),
		};
	},
	dispatch(event) {
		let APP = holdem,
			Self = APP.table,
			value,
			el;
		// console.log(event);
		switch (event.type) {
			// custom events
			case "select-world":
				break;
		}
	}
}
