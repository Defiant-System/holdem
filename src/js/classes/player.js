
class Player {
	constructor(data) {
		let opt = {
				name: "Anon",
				bankroll: 0,
				cardA: "",
				cardB: "",
				status: "",
				totalBet: 0,
				subtotalBet: 0,
				...data,
			};
		this.index = opt.index;
		this.name = opt.name;
		this.bankroll = opt.bankroll;
		this.cardA = opt.cardA;
		this.cardB = opt.cardB;
		this.status = opt.status;
		this.totalBet = opt.totalBet;
		this.subtotalBet = opt.subtotalBet;
		// update UI
		if (this.index !== undefined) this.syncEl();
	}

	setCard(which, delay, card) {
		// referense
		this[which] = card;

		// insert element UI
		let cname = this.index === 0 ? `card ${card} ${which}` : `${which}`,
			key = `${which.slice(-1)}El`;
		this[key] = this.cardsEl.append(`<div class="${cname}"></div>`);

		// calculations
		let deckOffset = holdem.els.deck.offset(".table"),
			cOffset = this[key].offset(".table"),
			l = deckOffset.left - cOffset.left,
			t = deckOffset.top - cOffset.top;

		this[key].css({ "transform": `translate(${l}px, ${t}px)`, "--delay": delay });

		requestAnimationFrame(() => this[key].addClass("in-deck dealt").css({ transform: "translate(0px, 0px)" }));
		setTimeout(() => {
			this[key].cssSequence("!in-deck", "transitionend", el => {
					
			});
		}, 10);
	}

	update(data) {
		//reset values
		Object.keys(data).map(key => this[key] = data[key]);
		// update UI
		this.syncEl();
	}

	syncEl() {
		// this.element
		this.el = holdem.els.seats.get(this.index);
		this.cardsEl = this.el.find(".cards");
		this.el.find(".name").data({ name: this.name });
		this.el.find(".chips").html(this.bankroll.format(" "));
		this.el.addClass(`s${this.index}`);
	}

	bet(val) {
		this.totalBet += val;
		this.bankroll -= val;
		this.el.find(".bet").html(this.totalBet.format(" "));
		this.el.find(".chips").html(this.bankroll.format(" "));
		this.el.data({ state: "betting" });
	}
}
