
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
		this._status = opt.status;
		this.totalBet = opt.totalBet;
		this.subtotalBet = opt.subtotalBet;

		// update UI
		if (this.index !== undefined) this.syncEl();
	}

	get status() {
		return this._status;
	}

	set status(v) {
		// console.log( this.name, "status", v );
		// internal value
		this._status = v;
		// seat state
		if (this.el) this.el.data({ status: this._status });
	}

	unHighlight() {
		this.el.removeClass("highlight");
	}

	highlight() {
		this.el.addClass("highlight");
	}

	showCards() {
		this.AEL.addClass(`card card-back ${this.cardA}`).data({ value: this.cardA });
		this.BEL.addClass(`card card-back ${this.cardB}`).data({ value: this.cardB });
		this.cardsEl.addClass("show");
	}

	setCard(which, card, delay, isLast) {
		// reference
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
		// if subtotalBet is set to zero, update UI
		if (this.el && this.subtotalBet === 0) {
			this.el.find(".bet").html("");
			this.el.removeClass("betting");
		}
		// update UI
		this.syncEl();
	}

	syncEl() {
		// this.element
		this.el = holdem.els.seats.get(this.index);
		this.cardsEl = this.el.find(".cards");
		this.el.find(".name").data({ name: this.name });
		this.el.find(".bankroll").html(this.bankroll.format(" "));
		this.el.addClass(`s${this.index}`);
		// seat state
		this.el.data({ status: this.status });
		// update UI
		if (this.subtotalBet) this.bet();

		if (this.cardA && this.cardB && !this.cardsEl.find(".card, .cardA").length) {
			let cA = this.index === 0 ? `card ${this.cardA} cardA` : `cardA`,
				cB = this.index === 0 ? `card ${this.cardB} cardB` : `cardB`;
			this.cardsEl.append(`<div class="${cA} dealt"></div>`);
			this.cardsEl.append(`<div class="${cB} dealt"></div>`);
		}
		if (!this.AEL || !this.AEL.length) this.AEL = this.cardsEl.find(".cardA");
		if (!this.BEL || !this.BEL.length) this.BEL = this.cardsEl.find(".cardB");
	}

	wins(v) {
		let roll = this.bankroll,
			total = roll + v;
		this.update({ subtotalBet: 0 });
		// player bankroll ticker
		this.el.find(".bankroll")
			.css({
				"--roll": roll,
				"--total": total,
			})
			.cssSequence("ticker", "animationend", el => {
				// update internal bankroll value
				this.bankroll = total;
				// reset seat UI
				el.removeClass("ticker").html(total);
				// start new round
				Poker.dispatch({ type: "start-new-round" });
			});
	}

	bet() {
		// this.totalBet += val;
		// this.bankroll -= val;
		this.el.find(".bet").html(this.subtotalBet.format(" "));
		this.el.find(".bankroll").html(this.bankroll.format(" "));
		this.el.toggleClass("betting", this.subtotalBet === 0);
	}
}
