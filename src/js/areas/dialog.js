
// holdem.dialog

{
	init() {
		// fast references
		this.els = {
			el: window.find(".game-view .actions.options"),
			finish: window.find(".game-view .actions.finish"),
			content: window.find("content"),
			handle: window.find(".actions.options .slider .handle"),
			btnRaise: window.find(".actions.options .button.raise"),
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
				// un-highlight highlighted player
				APP.els.table.find(".highlight").removeClass("highlight");
				// bet or raise
				value = currentBetAmount > 0 ? "Raise" : "Bet";
				Self.els.btnRaise.html(value);
				// update UI
				APP.els.seats.get(0).find(".bet").html(currentBetAmount);
				
				// "thinking" outline
				players[0].status = "THINKING";
				setTimeout(() =>
					players[0].el.cssSequence("thinking", "transitionend", el =>
						Self.dispatch({ type: "user-think-to-long" })), 20);

				// bankroll update
				value = Math.max(players[0].bankroll - currentBetAmount, 0);
				APP.els.seats.get(0).find(".bankroll").html(value);
				// if value is "zero", no need for "raise" slider
				if (value === 0) actions = "call-fold";

				//  check-raise
				Self.els.el.removeClass("hidden").data({ actions });
				APP.els.table.addClass("shows-user-actions");
				break;
			case "user-think-to-long":
				// Self.dispatch({ type: "hide-dialog" });
				// players[0].status = "CHECK";
				if (currentBetAmount > 0) Self.els.el.find(".button.fold").trigger("click");
				else Self.els.el.find(".button.check").trigger("click");
				break;
			case "hide-dialog":
				// reset user
				players[0].el.removeClass("thinking");
				// reset UI / hide dialog
				Self.els.el.addClass("hidden").removeAttr("data-actions");
				APP.els.table.removeClass("shows-user-actions");
				// reset slider highlight
				Self.els.handle.parent().removeClass("dragged");
				Self.els.handle.css({ left: "" });
				// reset "raise" button
				Self.els.el.find(".button.raise").addClass("disabled");
				break;
			case "player-fold":
				Poker.playerFolds(currentBettorIndex);
				// "hide" dialog
				Self.dispatch({ type: "hide-dialog" });
				// go to next player
				currentBettorIndex = Poker.getNextPlayerPosition(currentBettorIndex, 1);
				// think next step AI
				AI.think();
				break;
			case "player-check":
			case "player-raise":
			case "player-call":
				// value of bet
				value = event.type === "player-raise" ? Self.drag.bet : currentBetAmount; // currentBetAmount = 0, when user "checks"
				// user bets
				Poker.playerBets(currentBettorIndex, value);
				// "hide" dialog
				Self.dispatch({ type: "hide-dialog" });
				// player status
				players[currentBettorIndex].status = event.type === "player-check" ? "CHECK" : "CALL";
				// go to next player
				currentBettorIndex = Poker.getNextPlayerPosition(currentBettorIndex, 1);
				// think next step AI
				AI.think();
				break;
			case "finish-round":
				Self.els.finish.find("h3").html(`Jenny wins!`);
				Self.els.finish.find("h4").html(`Straight gives 250 to Jenny`);
				Self.els.finish.removeClass("hidden");
				break;
			case "new-round":
				Self.els.finish.addClass("hidden");
				Poker.dispatch({ type: "start-new-round" });
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
				if (Drag.bet === Drag.minBet) {
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
