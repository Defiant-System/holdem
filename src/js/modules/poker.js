
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
		this.make();
		this.newGame();
		// this.opponents(3);
	},
	make() {
		// create bots
		Bots.push(new Player({ name: "Ricardo" }));
		Bots.push(new Player({ name: "Ann" }));
		Bots.push(new Player({ name: "Daniel" }));
		Bots.push(new Player({ name: "Jack" }));
		Bots.push(new Player({ name: "Jenny" }));
		Bots.push(new Player({ name: "Mary" }));
		Bots.push(new Player({ name: "Nina" }));
		// create deck
		for (let i=2, j=0; i<15; i++) {
			cards[j++] = `h${i}`;
			cards[j++] = `d${i}`;
			cards[j++] = `c${i}`;
			cards[j++] = `s${i}`;
		}
	},
	newGame() {
		START_DATE = new Date();
		NUM_ROUNDS = 0;
		HUMAN_WINS_AGAIN = 0;
		// shuffle bots
		Bots.sort(() => .5 - Math.random());
	},
	opponents(num) {
		// player seats indices
		let seats = [...Array(7)].map((j,i) => i+1).sort(() => .5 - Math.random());
		// reset players array
		players = new Array(num + 1);
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
		// update dealer button
		this.setDealer(Math.floor(Math.random() * players.length));
		// start new round
		this.newRound();
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
		this.newRound();
		this.shuffle();
		this.blindsAndDeal();
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

		// hole card 1
		let cpIndex = buttonIndex;
		for (let i=0; i<players.length; i++) {
			cpIndex = this.getNextPlayerPosition(cpIndex, 1);
			this.getPlayer(cpIndex).cardA = cards[deckIndex++];
		}
		// hole card 2
		cpIndex = buttonIndex;
		for (let i=0; i<players.length; i++) {
			cpIndex = this.getNextPlayerPosition(cpIndex, 1);
			this.getPlayer(cpIndex).cardB = cards[deckIndex++];
		}

		// this.dealAndWriteA();
	},
	// dealAndWriteA() {
	// 	let currentPlayer;
	// 	let startPlayer;

	// 	startPlayer =
	// 	currentPlayer = this.getNextPlayerPosition(buttonIndex, 1);
	// 	// Deal cards to players still active
	// 	do {
	// 		this.getPlayer(currentPlayer).cardA = cards[deckIndex++];
	// 		currentPlayer = this.getNextPlayerPosition(currentPlayer, 1);
	// 	} while (currentPlayer != startPlayer);

	// 	// and now show the cards
	// 	currentPlayer = this.getNextPlayerPosition(buttonIndex, 1);
	// 	this.unrollPlayer(currentPlayer, currentPlayer, () => this.dealAndWriteB());
	// },
	// dealAndWriteB() {
	// 	let currentPlayer = buttonIndex;
	// 	for (let i=0; i<players.length; i++) {
	// 		currentPlayer = this.getNextPlayerPosition(currentPlayer, 1);
	// 		let player = this.getPlayer(currentPlayer);
	// 		if (player.cardB) break;
	// 		player.cardB = cards[deckIndex++];
	// 	}

	// 	currentPlayer = this.getNextPlayerPosition(buttonIndex, 1);
	// 	this.unrollPlayer(currentPlayer, currentPlayer, () => this.delayForMain());
	// },
	// unrollPlayer(startingPlayer, playerPos, finalCall) {
	// 	let nextPlayer = this.getNextPlayerPosition(playerPos, 1);
	// 	if (startingPlayer == nextPlayer) {
	// 		setTimeout(finalCall, globalSpeed);
	// 	} else {
	// 		setTimeout(() => this.unrollPlayer(startingPlayer, nextPlayer, finalCall), globalSpeed);
	// 	}
	// },
	// delayForMain() {
	// 	console.log( "main" );
	// }
};
