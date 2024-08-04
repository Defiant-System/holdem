
class Player {
	constructor(data) {
		let opt = {
				name: "Anon",
				img: "~/icons/user-placeholder.png",
				bankroll: 0,
				carda: "",
				cardb: "",
				status: "",
				totalBet: 0,
				subtotalBet: 0,
				...data,
			};
		this.name = opt.name;
		this.bankroll = opt.bankroll;
		this.carda = opt.carda;
		this.cardb = opt.cardb;
		this.status = opt.status;
		this.totalBet = opt.totalBet;
		this.subtotalBet = opt.subtotalBet;
	}

	reset(data) {
		//reset values
		Object.keys(data).map(key => this[key] = data[key]);
		// this.element
		this.el = holdem.els.seats.get(this.index);
		this.el.find(".name").data({ name: this.name });
		this.el.find(".chips").html(this.bankroll);
		this.el.addClass(`p${this.index}`);
	}
}
