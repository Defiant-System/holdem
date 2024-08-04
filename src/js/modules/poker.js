
let START_DATE;
let NUM_ROUNDS;
let HUMAN_WINS_AGAIN;
let HUMAN_GOES_ALL_IN;
let STOP_AUTOPLAY = 0;
let RUN_EM = 0;
let STARTING_BANKROLL = 5000;
let SMALL_BLIND = 50;
let BIG_BLIND = 100;

let globalSpeed = 600;

let Bots = [];
let cards = new Array(52);
let players,
	board,
	deckIndex,
	buttonIndex;
let currentBettorIndex,
	currentBetAmount,
	currentMinRaise;


let Poker = {
	init() {
		this.dispatch({ type: "create-bots" });
		this.dispatch({ type: "create-deck" });
		this.dispatch({ type: "new-game" });
	},
	dispatch(event) {
		let APP = holdem,
			Self = Poker,
			seats,
			value,
			el;
		switch (event.type) {
			case "create-bots":
				Bots.push(new Player({ name: "Ricardo" }));
				Bots.push(new Player({ name: "Ann" }));
				Bots.push(new Player({ name: "Daniel" }));
				Bots.push(new Player({ name: "Jack" }));
				Bots.push(new Player({ name: "Jenny" }));
				Bots.push(new Player({ name: "Mary" }));
				Bots.push(new Player({ name: "Nina" }));
				break;
			case "create-deck":
				// create deck
				for (let i=2, j=0; i<15; i++) {
					cards[j++] = `h${i}`;
					cards[j++] = `d${i}`;
					cards[j++] = `c${i}`;
					cards[j++] = `s${i}`;
				}
				break;
			case "new-game":
				START_DATE = new Date();
				NUM_ROUNDS = 0;
				HUMAN_WINS_AGAIN = 0;
				// shuffle bots
				Bots.sort(() => .5 - Math.random());
				break;
			case "set-opponents":
				// player seats indices
				seats = [...Array(7)].map((j,i) => i+1).sort(() => .5 - Math.random());
				// reset players array
				players = new Array(event.value + 1);
				// player user
				players[0] = new Player({ name: ME.firstName, img: ME.avatar });
				// player bots
				for (let i=1; i<players.length; i++) {
					players[i] = Bots[i-1];
				}
				// reset all
				for (let i=0; i<players.length; i++) {
					players[i].update({
						index: i === 0 ? 0 : seats.pop(),
						status: "",
						totalBet: 0,
						subtotalBet: 0,
						bankroll: STARTING_BANKROLL,
					});
				}
				// start new round
				Self.dispatch({ type: "start-new-round" });
				break;
			case "start-new-round":
				Self.newRound();
				Self.shuffle();
				Self.blindsAndDeal();
				break;
			case "hole-cards-dealt":
				// reset deck
				APP.els.deck.cssSequence("disappear", "transitionend", el => el.removeClass("appear disappear"));
				// flip users hole cards
				APP.els.seats.get(0).find(".cards").addClass("hole-flip");
				break;
		}
	},
	setDealer(index) {
		buttonIndex = index;
		// update UI
		holdem.els.dealer.data({ pos: `p${index}` });
		holdem.els.deck.data({ pos: `p${index}` });
	},
	restoreState(data) {
		let entries = Object.keys(data.players);
		// reset players array
		players = new Array(entries.length);
		// resurrect players
		entries.map((num, i) => players[i] = new Player({ ...data.players[num], index: +num }));
		// restore dealer index
		buttonIndex = data.dealer;
		// start new round
		this.dispatch({ type: "start-new-round" });
	},
	getNextPlayerPosition(i, delta) {
		let seats = players.filter(p => !["BUST", "FOLD"].includes(p.status)).map(p => p.index),
			index = seats.indexOf(i),
			add = seats.length * seats.length;
		return seats[(index + delta + add) % seats.length]
	},
	getPlayer(pos) {
		return players.find(p => p.index === pos);
	},
	newRound() {
		RUN_EM = 0;
		NUM_ROUNDS++;
		HUMAN_GOES_ALL_IN = 0;
		currentMinRaise = 0;
		buttonIndex = this.getNextPlayerPosition(buttonIndex, 1);
		// update dealer button
		this.setDealer(buttonIndex);
	},
	shuffle() {
		let rndInt = m => Math.floor(Math.random() * m);
		for (let i=0, il=cards.length; i<il; ++i) {
			let j = i + rndInt(il - i);
			let tmp = cards[i];
			cards[i] = cards[j];
			cards[j] = tmp;
		}
		deckIndex = 0;
	},
	blindsAndDeal() {
		let smallBlind = this.getNextPlayerPosition(buttonIndex, 1),
			bigBlind = this.getNextPlayerPosition(smallBlind, 1),
			bettor = this.getNextPlayerPosition(bigBlind, 1),
			playerSmallBlind = this.getPlayer(smallBlind),
			playerBigBlind = this.getPlayer(bigBlind),
			playerBettor = this.getPlayer(bettor);
		playerSmallBlind.bet(SMALL_BLIND);
		playerBigBlind.bet(BIG_BLIND);
		// flag player as "thinking"
		playerBettor.update({ status: "OPTION" });

		// reset deck
		setTimeout(() => holdem.els.deck.cssSequence("appear", "transitionend", el => {
			// deal hole card 1
			let delay = 0,
				cpIndex = buttonIndex;
			for (let i=0, il=players.length; i<il; i++) {
				cpIndex = this.getNextPlayerPosition(cpIndex, 1);
				this.getPlayer(cpIndex).setCard("cardA", cards[deckIndex++], delay++);
			}
			// deal hole card 2
			cpIndex = buttonIndex;
			for (let i=0, il=players.length; i<il; i++) {
				cpIndex = this.getNextPlayerPosition(cpIndex, 1);
				this.getPlayer(cpIndex).setCard("cardB", cards[deckIndex++], delay++, delay+1 === il*2);
			}
		}));
	}
};
