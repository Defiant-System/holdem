
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

	setCard(which, card, delay, isLast) {
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
			t = deckOffset.top - cOffset.top,
			r = this.index === 0 ? 180 : 0;
		this[key].css({ "transform": `translate(${l}px, ${t}px) rotateY(${r}deg)`, "--delay": delay });

		// deal card animation
		requestAnimationFrame(() => this[key].addClass("in-deck dealt").css({ transform: `translate(0px, 0px) rotateY(${r}deg)` }));
		setTimeout(() => {
			this[key].cssSequence("!in-deck", "transitionend", el => {
				// reset card
				el.removeClass("in-deck");
				// "signal" - flip user hold cards
				if (isLast) Poker.dispatch({ type: "hole-cards-dealt" });
			});
		}, 10);
	}

	update(data) {
		//reset values
		Object.keys(data).map(key => this[key] = data[key]);
		// if totalBet is set to zero, update UI
		if (this.el && this.totalBet === 0) this.el.data({ status: "" });
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
		// seat state
		this.el.data({ status: this.status });

		if (this.totalBet) {
			this.el.find(".bet").html(this.totalBet.format(" "));
		}

		if (this.cardA && this.cardB && !this.cardsEl.find(".card").length) {
			let cA = this.index === 0 ? `card ${this.cardA} cardA` : `cardA`,
				cB = this.index === 0 ? `card ${this.cardB} cardB` : `cardB`;
			this.AEL = this.cardsEl.append(`<div class="${cA} dealt"></div>`);
			this.BEL = this.cardsEl.append(`<div class="${cB} dealt"></div>`);
		}
	}

	bet(val) {
		this.totalBet += val;
		this.bankroll -= val;
		this.el.find(".bet").html(this.totalBet.format(" "));
		this.el.find(".chips").html(this.bankroll.format(" "));
		this.el.data({ status: "betting" });
	}
}
