
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
			actions,
			value,
			el;
		// console.log(event);
		switch (event.type) {
			// custom events
			case "show-dialog":
				actions = event.actions || "call-fold";
				// update UI
				APP.els.seats.get(0).find(".bet").html(currentBetAmount);
				// bankroll update
				value = Math.max(players[0].bankroll - currentBetAmount, 0);
				APP.els.seats.get(0).find(".bankroll").html(value);
				// if value is "zero", no need for "raise" slider
				if (value === 0) actions = "call-fold";

				//  check-raise
				Self.els.el.removeClass("hidden").data({ actions });
				APP.els.table.addClass("shows-user-actions");
				break;
			case "hide-dialog":
				// reset UI / hide dialog
				Self.els.el.addClass("hidden").removeAttr("data-actions");
				APP.els.table.removeClass("shows-user-actions");
				// reset slider highlight
				Self.els.handle.parent().removeClass("dragged");
				// reset "raise" button
				Self.els.el.find(".button.raise").addClass("disabled");
				break;
			case "player-check":
				break;
			case "player-raise":
				// temp
				Poker.playerBets(0, Self.drag.bet);
				// "hide" dialog
				Self.dispatch({ type: "hide-dialog" });

				players[0].status = "CALL";
				currentBettorIndex = Poker.getNextPlayerPosition(currentBettorIndex, 1);
				// think next step AI
				AI.think();
				break;
			case "player-fold":
				break;
			case "player-call":
				// temp
				Poker.playerBets(0, currentBetAmount);
				// "hide" dialog
				Self.dispatch({ type: "hide-dialog" });

				players[0].status = "CALL";
				currentBettorIndex = Poker.getNextPlayerPosition(currentBettorIndex, 1);
				// think next step AI
				AI.think();
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
					rollEl = APP.els.seats.get(0).find(".bankroll"),
					betEl = APP.els.seats.get(0).find(".bet"),
					minBet = currentBetAmount,
					bankroll = players[0].bankroll,
					limit = { min: 1, max: 96 },
					offsetX = el.offset().left,
					clickX = event.clientX;
				// drag details
				Self.drag = { el, betEl, rollEl, minBet, bankroll, clickX, offsetX, limit };

				// enable raise button
				Self.els.el.find(".button.raise").removeClass("disabled");
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

				// resize raise value
				let perc = (left - Drag.limit.min) / (Drag.limit.max - Drag.limit.min),
					bet = Drag.minBet + Math.round((Drag.bankroll - Drag.minBet) * perc);
				Drag.betEl.html(bet);
				Drag.rollEl.html(Drag.bankroll - bet);

				// save value for "mouseup"
				Drag.bet = bet;
				break;
			case "mouseup":
				if (Drag.bet === 0) {
					// reset slider element
					Drag.el.parent().removeClass("dragged");
					// reset "raise" button
					Self.els.el.find(".button.raise").addClass("disabled");
				}
				// cover UI
				Self.els.content.removeClass("cover");
				// unbind event handlers
				Self.els.doc.off("mousemove mouseup", Self.slide);
				break;
		}
	}
}
