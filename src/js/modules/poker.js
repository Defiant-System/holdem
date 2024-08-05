
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
				if (!event.noStart) Self.dispatch({ type: "start-new-round" });
				break;
			case "start-new-round":
				Self.dispatch({ type: "reset-table" });
				Self.dispatch({ type: "new-game" });
				Self.dispatch({ type: "new-round" });
				Self.dispatch({ type: "shuffle-deck" });
				Self.dispatch({ type: "blinds-and-deal" });
				break;
			case "hole-cards-dealt":
				// reset deck
				APP.els.deck.cssSequence("disappear", "transitionend", el => el.removeClass("appear disappear"));
				// flip users hole cards
				APP.els.seats.get(0).find(".cards").addClass("hole-flip");
				break;
			case "reset-table":
				// remove card elements
				APP.els.seats.find(".cards > *").remove();
				// reset user0 seat
				APP.els.seats.removeClass("hole-flip");
				// reset players
				players.map(p => p.update({ cardA: "", cardB: "", totalBet: 0 }));
				break;
			case "new-round":
				RUN_EM = 0;
				NUM_ROUNDS++;
				HUMAN_GOES_ALL_IN = 0;
				currentMinRaise = 0;
				buttonIndex = Self.getNextPlayerPosition(buttonIndex, 1);
				// update dealer button
				Self.dispatch({ type: "set-dealer", index: buttonIndex });
				break;
			case "shuffle-deck":
				for (let i=0, il=cards.length; i<il; ++i) {
					let j = i + Utils.randomInt(il - i);
					let tmp = cards[i];
					cards[i] = cards[j];
					cards[j] = tmp;
				}
				deckIndex = 0;
				break;
			case "blinds-and-deal":
				let smallBlind = Self.getNextPlayerPosition(buttonIndex, 1),
					bigBlind = Self.getNextPlayerPosition(smallBlind, 1),
					bettor = Self.getNextPlayerPosition(bigBlind, 1),
					playerSmallBlind = Self.getPlayer(smallBlind),
					playerBigBlind = Self.getPlayer(bigBlind),
					playerBettor = Self.getPlayer(bettor);
				playerSmallBlind.bet(SMALL_BLIND);
				playerBigBlind.bet(BIG_BLIND);
				// flag player as "thinking"
				playerBettor.update({ status: "OPTION" });

				// reset deck
				setTimeout(() => APP.els.deck.cssSequence("appear", "transitionend", el => {
					// deal hole card 1
					let delay = 0,
						cpIndex = buttonIndex;
					for (let i=0, il=players.length; i<il; i++) {
						cpIndex = Self.getNextPlayerPosition(cpIndex, 1);
						Self.getPlayer(cpIndex).setCard("cardA", cards[deckIndex++], delay++);
					}
					// deal hole card 2
					cpIndex = buttonIndex;
					for (let i=0, il=players.length; i<il; i++) {
						cpIndex = Self.getNextPlayerPosition(cpIndex, 1);
						Self.getPlayer(cpIndex).setCard("cardB", cards[deckIndex++], delay++, delay+1 === il*2);
					}
				}));
				break;
			case "deal-flop":
				// reset deck
				setTimeout(() => APP.els.deck.cssSequence("appear", "transitionend", el => {
					let flop = [];
					for (let i=0; i<3; i++) {
						flop.push(`<div class="card ${cards[deckIndex++]} card-back flop-${i+1} in-deck"></div>`);
					}
					// prepare for anim
					flop = APP.els.board.html(flop.join("")).find(".card");
					flop.map((e, i) => {
						let card = flop.get(i),
							deckOffset = APP.els.deck.offset(".table"),
							cOffset = card.offset(".table"),
							l = deckOffset.left - cOffset.left,
							t = deckOffset.top - cOffset.top;
						// anim start
						card.css({ transform: `translate(${l}px, ${t}px) rotateY(180deg)` });
					});

					setTimeout(() => {
						flop.removeClass("in-deck")
							.css({ transform: `translate(0px, 0px) rotateY(180deg)` })
							.cssSequence("fly-flop", "transitionend", el => {
								// reset card
								el.removeClass("fly-flop").css({ transform: "" });
								// last card animation
								if (el.hasClass("flop-3")) {
									// reset deck
									APP.els.deck.cssSequence("disappear", "transitionend", el => el.removeClass("appear disappear"));
									// fan & flip flop
									APP.els.board.cssSequence("fan-flop", "transitionend", el => {
										el.cssSequence("flip-flop", "transitionend", el => {
											// continue game
											// console.log( "continue game" );
										});
									});
								}
							});
					}, 10);
				}));
				break;
			case "deal-turn":
				// reset deck
				setTimeout(() => APP.els.deck.cssSequence("appear", "transitionend", el => {
					
				}));
				break;
			case "deal-river":
				// reset deck
				setTimeout(() => APP.els.deck.cssSequence("appear", "transitionend", el => {
					
				}));
				break;
			case "restore-state":
				let entries = Object.keys(event.data.players);
				// reset players array
				players = new Array(entries.length);
				// resurrect players
				entries.map((num, i) => players[i] = new Player({ ...event.data.players[num], index: +num }));
				// restore flop cards
				value = event.data.flop.map((c, i) => `<div class="card ${c} card-back flop-${i+1} no-anim"></div>`);
				APP.els.board.addClass("fan-flop flip-flop no-anim").html(value.join());
				// restore dealer index
				buttonIndex = event.data.dealer;
				// start new round
				// Self.dispatch({ type: "start-new-round" });
				break;
			case "set-dealer":
				buttonIndex = event.index;
				// update UI
				APP.els.dealer.data({ pos: `p${event.index}` });
				APP.els.deck.data({ pos: `p${event.index}` });
				break;
		}
	},
	getNextPlayerPosition(i, delta) {
		let seats = players.filter(p => !["BUST", "FOLD"].includes(p.status)).map(p => p.index),
			index = seats.indexOf(i),
			add = seats.length * seats.length;
		return seats[(index + delta + add) % seats.length]
	},
	getPlayer(pos) {
		return players.find(p => p.index === pos);
	}
};
