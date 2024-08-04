
let START_DATE;
let NUM_ROUNDS;
let HUMAN_WINS_AGAIN;
let HUMAN_GOES_ALL_IN;
let STOP_AUTOPLAY = 0;
let RUN_EM = 0;
let STARTING_BANKROLL = 500;
let SMALL_BLIND;
let BIG_BLIND;

let Bots = [];
let cards = new Array(52);
let players,
	board,
	deckIndex,
	buttonIndex;


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
		Bots.push(new Player({ name: "Bruce" }));
		Bots.push(new Player({ name: "Denzel" }));
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
			players[i].reset({
				index: i === 0 ? 0 : seats.pop(),
				carda: "",
				cardb: "",
				status: "",
				totalBet: 0,
				subtotalBet: 0,
				bankroll: STARTING_BANKROLL,
			});
		}
		buttonIndex = Math.floor(Math.random() * players.length);
	},
	restoreState(data) {
		let entries = Object.keys(data);
		// reset players array
		players = new Array(entries.length);
		// resurrect players
		entries.map((num, i) => {
			players[i] = new Player({ ...data[num], index: +num });
		});

		// console.log( players );
	},
	newRound() {

	}
};
