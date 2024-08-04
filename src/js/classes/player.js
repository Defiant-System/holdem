
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
		// update UI
		if (this.index === 0) this.el.find(".cards").append(`<div class="card ${v}"></div>`);
		else this.el.find(".cards").data({ cardA: "1" });
	}

	get cardB() {
		return this._cardB;
	}

	set cardB(v) {
		this._cardB = v;
		// update UI
		if (this.index === 0) this.el.find(".cards").append(`<div class="card ${v}"></div>`);
		else this.el.find(".cards").data({ cardB: "1" });
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
