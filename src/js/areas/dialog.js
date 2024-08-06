
// holdem.dialog

{
	init() {
		// fast references
		this.els = {
			el: window.find(".game-view .actions"),
			content: window.find("content"),
			handle: window.find(".actions .slider .handle"),
			doc: $(document),
		};
		// bind event handlers
		this.els.handle.on("mousedown", this.slide);
	},
	dispatch(event) {
		let APP = holdem,
			Self = APP.dialog,
			value,
			el;
		// console.log(event);
		switch (event.type) {
			// custom events
			case "show-dialog":
				value = event.actions || "call-fold";
				//  check-raise
				Self.els.el.removeClass("hidden").data({ actions: value });
				APP.els.table.addClass("shows-user-actions");

				APP.els.table.find(".seat.s0 .bet").html(10);
				break;
			case "hide-dialog":
				// reset UI / hide dialog
				Self.els.el.addClass("hidden").removeAttr("data-actions");
				APP.els.table.removeClass("shows-user-actions");
				// reset slider highlight
				Self.els.handle.parent().removeClass("dragged");
				break;
			case "player-check":
			case "player-raise":
			case "player-fold":
				break;
			case "player-call":
				// temp
				Poker.playerBets(0, 10);
				// "hide" dialog
				Self.dispatch({ type: "hide-dialog" });
				break;
			case "player-raise":
				console.log(event);
				break;
		}
	},
	slide(event) {
		let APP = holdem,
			Self = APP.dialog,
			Drag = Self.drag;
		// console.log(event);
		switch (event.type) {
			case "mousedown":
				// prevent default behaviour
				event.preventDefault();

				let el = Self.els.handle,
					limit = {
						min: 1,
						max: 146
					},
					offsetX = el.offset().left,
					clickX = event.clientX;
				Self.drag = { el, clickX, offsetX, limit };

				// pause slider highlight
				el.parent().addClass("dragged");
				// cover UI
				Self.els.content.addClass("cover");
				// bind event handlers
				Self.els.doc.on("mousemove mouseup", Self.slide);
				break;
			case "mousemove":
				let left = event.clientX - Drag.clickX + Drag.offsetX;
				left = Math.max(Math.min(Drag.limit.max, left), Drag.limit.min);
				Drag.el.css({ left });

				// TODO: resize raise value

				break;
			case "mouseup":
				// cover UI
				Self.els.content.removeClass("cover");
				// unbind event handlers
				Self.els.doc.off("mousemove mouseup", Self.slide);
				break;
		}
	}
}
