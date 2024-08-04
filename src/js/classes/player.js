
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
		this._cardA = opt.cardA;
		this._cardB = opt.cardB;
		this.status = opt.status;
		this.totalBet = opt.totalBet;
		this.subtotalBet = opt.subtotalBet;
		// update UI
		if (this.index !== undefined) this.syncEl();
	}

	get cardA() {
		return this._cardA;
	}

	set cardA(v) {
		this._cardA = v;
		// calculations
		let cname = this.index === 0 ? `card ${v} in-deck` : "cardA in-deck",
			deckOffset = holdem.els.deck.offset(".table"),
			cardsOffset = this.cardsEl.offset(".table"),
			t = deckOffset.top - cardsOffset.top,
			l = deckOffset.left - cardsOffset.left;
		// update UI
		this.aEl = this.cardsEl.append(`<div class="${cname}" style="top: ${t}px; left: ${l}px; --delay: ${this.index};"></div>`);

		setTimeout(() => {
			this.aEl.css({ top: 0, left: -16, width: 31, height: 41 });
			this.aEl.cssSequence("landing", "transitionend", el => {
				if (this.index === 0) {
					// user ME, flip card animation
				} else {
					el.removeClass("landing in-deck");
				}
			});
		}, 100);
	}

	get cardB() {
		return this._cardB;
	}

	set cardB(v) {
		this._cardB = v;
		// calculations
		let cname = this.index === 0 ? `card ${v} in-deck` : "cardB in-deck",
			deckOffset = holdem.els.deck.offset(".table"),
			cardsOffset = this.cardsEl.offset(".table"),
			t = deckOffset.top - cardsOffset.top,
			l = deckOffset.left - cardsOffset.left;
		// update UI
		this.bEl = this.cardsEl.append(`<div class="${cname}" style="top: ${t}px; left: ${l}px; --delay: ${this.index};"></div>`);

		setTimeout(() => {
			this.bEl.css({ top: 0, left: -7, width: 31, height: 41 });
			this.bEl.cssSequence("landing", "transitionend", el => {
				if (this.index === 0) {
					// user ME, flip card animation
				} else {
					el.removeClass("landing in-deck");
				}
			});
		}, 1100);
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
