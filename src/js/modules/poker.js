
let START_DATE;
let NUM_ROUNDS;
let HUMAN_WINS_AGAIN;
let HUMAN_GOES_ALL_IN;
let STOP_AUTOPLAY = 0;
let RUN_EM = 0;
let STARTING_BANKROLL = 500;
let SMALL_BLIND = 5;
let BIG_BLIND = 10;

let globalSpeed = 900;
let globalPotRemainder = 0;

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
		// create bots
		Bots.push(new Player({ name: "Ricardo" }));
		Bots.push(new Player({ name: "Ann" }));
		Bots.push(new Player({ name: "Daniel" }));
		Bots.push(new Player({ name: "Jack" }));
		Bots.push(new Player({ name: "Jenny" }));
		Bots.push(new Player({ name: "Mary" }));
		Bots.push(new Player({ name: "Nina" }));
		// reset game + shuffle bots
		this.dispatch({ type: "new-game" });
		// create deck
		for (let i=2, j=0; i<15; i++) {
			cards[j++] = `h${i}`;
			cards[j++] = `d${i}`;
			cards[j++] = `c${i}`;
			cards[j++] = `s${i}`;
		}
	},
	dispatch(event) {
		let APP = holdem,
			Self = Poker,
			dealer, player, seats,
			data, value,
			isEveryoneAllIn,
			numBetting, boardCards,
			el;
		switch (event.type) {
			case "new-game":
				START_DATE = new Date();
				NUM_ROUNDS = 0;
				HUMAN_WINS_AGAIN = 0;
				// shuffle bots
				Bots.sort(() => .5 - Math.random());
				break;
			case "set-opponents":
				value = event.value || 1;
				// player seats indices
				seats = [...Array(7)].map((j,i) => i+1).sort(() => .5 - Math.random());
				// reset players array
				players = new Array(value + 1);
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
				// sort players by seat index
				players = players.sort((a, b) => a.index - b.index);
				// start new round
				if (!event.noStart) Self.dispatch({ type: "start-new-round" });
				break;
			case "start-new-round":
				if (players.filter(p => p.bankroll > 0).length === 1) {
					return APP.dispatch({ type: "show-start-view" });
				}
				// show "bust"
				players.map(p => p.bankroll < 1 ? p.status = "BUST" : void(0));

				Self.dispatch({ type: "reset-table" });
				Self.dispatch({ type: "new-game" });
				Self.dispatch({ type: "reset-round" });
				Self.dispatch({ type: "shuffle-deck" });
				// debug purpose
				Self.dispatch({ type: "temp-sum-all-money", debug: 99 });
				// deal
				Self.dispatch({ type: "blinds-and-deal" });
				break;
			case "reset-table":
				// reset flip/flops
				APP.els.board.prop({ className: "board" });
				// reset pot element
				APP.els.pot.prop({ className: "pot hidden" }).html(0);
				// remove community cards
				APP.els.table.find(".board .card").remove();
				// remove card elements
				APP.els.seats.find(".cards > *").remove();
				// reset user0 seat
				APP.els.seats.removeClass("hole-flip");
				// reset players
				players.map(p => {
					let status = p.bankroll < 1 ? "BUST" : "";
					p.update({ cardA: "", cardB: "", totalBet: 0, status });
					p.reset();
				});
				break;
			case "reset-round":
				RUN_EM = 0;
				NUM_ROUNDS++;
				HUMAN_GOES_ALL_IN = 0;
				currentMinRaise = 0;
				buttonIndex = Self.getNextPlayerPosition(buttonIndex, 1);
				// clear player bets + reset minimum bet
				Self.clearBets();
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
			case "temp-sum-all-money":
				value = Self.activePlayers.reduce((a, p) => p.bankroll + p.totalBet + a, 0);
				if (event.debug === 99) console.log("NO-"+ event.debug, value);
				break;
			case "blinds-and-deal":
				// reset players
				players
					.filter(p => p.status !== "BUST")
					.map(p => p.update({ cardA: "", cardB: "", totalBet: 0, subtotalBet: 0, status: "" }));
				// first shuffle deck
				Self.dispatch({ type: "shuffle-deck" });
				// pay blinds
				let smallBlind = Self.getNextPlayerPosition(buttonIndex, 1),
					bigBlind = Self.getNextPlayerPosition(smallBlind, 1);
				
				// next player in turn
				currentBettorIndex = Self.getNextPlayerPosition(bigBlind, 1);

				Self.playerBets(smallBlind, SMALL_BLIND);
				Self.playerBets(bigBlind, BIG_BLIND);

				// reset deck
				setTimeout(() => APP.els.deck.cssSequence("appear", "transitionend", el => {
					let delay = 0,
						cpIndex = buttonIndex,
						il = Self.activePlayers.length;
					// deal hole card 1
					for (let i=0; i<il; i++) {
						cpIndex = Self.getNextPlayerPosition(cpIndex, 1);
						Self.getPlayer(cpIndex).setCard("cardA", cards[deckIndex++], delay++);
					}
					// deal hole card 2
					cpIndex = buttonIndex;
					for (let i=0; i<il; i++) {
						cpIndex = Self.getNextPlayerPosition(cpIndex, 1);
						Self.getPlayer(cpIndex).setCard("cardB", cards[deckIndex++], delay++, delay === il*2);
					}
				}));
				break;
			case "hole-cards-dealt":
				// reset deck
				APP.els.deck.cssSequence("disappear", "transitionend", el => el.removeClass("appear disappear"));
				if (players[0].status === "BUST") {
					Self.dispatch({ type: "go-to-betting" });
				} else {
					// flip users hole cards
					players[0].el.find(".cards").cssSequence("hole-flip", "transitionend", el =>
						Self.dispatch({ type: "go-to-betting" }));
				}
				break;
			case "go-to-betting":
				numBetting = Self.getNumBetting();
				// isEveryoneAllIn = Self.activePlayers.filter(p => p.bankroll < 1).length === Self.activePlayers.length;
				isEveryoneAllIn = Self.activePlayers.filter(p => p.bankroll < 1).length >= 1;
				
				if (isEveryoneAllIn) {
					// show players cards
					Self.activePlayers.map(p => p.showCards());
					// collect bets to pot
					Self.dispatch({
						type: "move-bets-to-pot",
						ticker: {
							start: +APP.els.pot.html(),
							end: Self.getPotSize(),
						},
						finally: "auto-dealer-cards",
					});
				} else if (numBetting > 1) {
					// think next step AI
					setTimeout(() => AI.think(), event.wait || 0);
				} else {
					setTimeout(() => Self.dispatch({ type: "ready-for-next-card" }), globalSpeed);
				}
				break;
			case "auto-dealer-cards":
				boardCards = APP.els.board.find(".card");
				if (!boardCards[0]) {
					setTimeout(() => Self.dispatch({ type: "deal-flop" }), globalSpeed >> 1);
				} else if (!boardCards[3]) {
					setTimeout(() => Self.dispatch({ type: "deal-turn" }), globalSpeed >> 1);
				} else if (!boardCards[4]) {
					setTimeout(() => Self.dispatch({ type: "deal-river" }), globalSpeed >> 1);
				} else {
					Self.dispatch({ type: "handle-end-of-round" });
				}
				break;
			case "move-bets-to-pot":
				// make sure pot is shown
				APP.els.pot.removeClass("hidden");
				// get current pot size from DOM
				value = event.ticker.start;
				APP.els.table.cssSequence("bets-to-pot", "transitionend", tEl => {
					let total = event.ticker.end,
						doTick = value !== total ? "" : "no-tick";
					tEl.find(".pot")
						.css({ "--roll": value, "--total": total })
						.cssSequence("ticker "+ doTick, "animationend", potEl => {
							// reset elements
							potEl.removeClass("ticker no-tick").html(total).removeAttr("style");
							// reset table
							tEl.removeClass("bets-to-pot");
							// clear player bets + reset minimum bet
							Self.clearBets();
							// auto play cards
							Self.dispatch({ type: event.finally });
						});
				});
				break;
			case "ready-for-next-card":
				numBetting = Self.getNumBetting();
				if (numBetting <= 1) {
					Self.dispatch({ type: "handle-end-of-round" });
					return;
				}
				
				boardCards = APP.els.board.find(".card");
				for (let i=0; i<players.length; i++) {
					players[i].totalBet += players[i].subtotalBet;
					if (!["BUST", "FOLD"].includes(players[i].status)) players[i].status = "";
				}

				// game finished - handle winning hand, etc
				if (boardCards[4]) {
					// collect bets to pot
					return Self.dispatch({
						type: "move-bets-to-pot",
						ticker: {
							start: +APP.els.pot.html(),
							end: Self.getPotSize(),
						},
						finally: "handle-end-of-round",
					});
				}
				
				currentMinRaise = BIG_BLIND;
				Self.resetPlayerStatuses(2);

				dealer = Self.getPlayer(buttonIndex);
				if (dealer.status == "FOLD") {
					let player = players[Self.getNextPlayerPosition(buttonIndex, -1)];
					if (player) player.status = "OPTION";
				} else {
					dealer.status = "OPTION";
				}
				currentBettorIndex = Self.getNextPlayerPosition(buttonIndex, 1);
				let showCards = 0;
				if (numBetting < 2) showCards = 1;

				// if (!RUN_EM) {
					for (let i=0; i<players.length; i++) { // <-- UNROLL
						players[i].unHighlight();
						if (players[i].status != "BUST" && players[i].status != "FOLD") {
							players[i].subtotalBet = 0;
						}
					}
				// }
				// if (numBetting < 2) RUN_EM = 1;
				
				if (!boardCards[0]) {
					APP.els.pot.removeClass("hidden").html(0);
				}
				
				// collect bets to pot
				Self.dispatch({
					type: "move-bets-to-pot",
					ticker: {
						start: +APP.els.pot.html(),
						end: Self.getPotSize(),
					},
					finally: "auto-dealer-cards",
				});
				break;
			case "deal-flop":
				// reset deck
				setTimeout(() => APP.els.deck.cssSequence("appear", "transitionend", el => {
					let flop = [];
					for (let i=0; i<3; i++) {
						let c = cards[deckIndex++];
						flop.push(`<div class="card ${c} card-back flop-${i+1} in-deck" data-value="${c}"></div>`);
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
											// think next step AI
											Self.dispatch({ type: "go-to-betting", wait: globalSpeed });
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
					// burn & turn
					let burn = cards[deckIndex++],
						card = APP.els.void.append(`<div class="card card-back"></div>`),
						deckOffset = APP.els.deck.offset(".table"),
						voidOffset = card.offset(".table"),
						l = deckOffset.left - voidOffset.left,
						t = deckOffset.top - voidOffset.top;
					// anim start
					card.css({ transform: `translate(${l}px, ${t}px)` });

					setTimeout(() => {
						card.css({ transform: `translate(0px, 0px)` })
							.cssSequence("to-void", "transitionend", el => {
								// card / smoke-puff
								el.removeClass("card").cssSequence("smoke-puffs", "animationend", el => {
									// remove burn-card / smoke-puff
									el.remove();

									// append turn
									let turn = cards[deckIndex++],
										card = APP.els.board.append(`<div class="card card-back ${turn} turn in-deck" data-value="${turn}"></div>`),
										deckOffset = APP.els.deck.offset(".table"),
										turnOffset = card.offset(".table"),
										l = deckOffset.left - turnOffset.left,
										t = deckOffset.top - turnOffset.top;

									// anim start
									card.css({ transform: `translate(${l}px, ${t}px) rotateY(180deg)` });

									setTimeout(() => {
										card.removeClass("in-deck")
											.css({ transform: `translate(0px, 0px) rotateY(180deg)` })
											.cssSequence("fly-turn", "transitionend", el => {
												// flip turn card
												el.cssSequence("flip-turn", "animationend", el => {
													// reset deck
													APP.els.deck.cssSequence("disappear", "transitionend", el => {
														el.removeClass("appear disappear");
														// think next step AI
														Self.dispatch({ type: "go-to-betting", wait: globalSpeed });
													});
												});
											});
									}, 10);
								});
							});
					}, 10);
				}));
				break;
			case "deal-river":
				// reset deck
				setTimeout(() => APP.els.deck.cssSequence("appear", "transitionend", el => {
					// burn & turn
					let burn = cards[deckIndex++],
						card = APP.els.void.append(`<div class="card card-back"></div>`),
						deckOffset = APP.els.deck.offset(".table"),
						voidOffset = card.offset(".table"),
						l = deckOffset.left - voidOffset.left,
						t = deckOffset.top - voidOffset.top;
					// anim start
					card.css({ transform: `translate(${l}px, ${t}px)` });

					setTimeout(() => {
						card.css({ transform: `translate(0px, 0px)` })
							.cssSequence("to-void", "transitionend", el => {
								// card / smoke-puff
								el.removeClass("card").cssSequence("smoke-puffs", "animationend", el => {
									// remove burn-card / smoke-puff
									el.remove();

									// append river
									let river = cards[deckIndex++],
										card = APP.els.board.append(`<div class="card card-back ${river} river in-deck" data-value="${river}"></div>`),
										deckOffset = APP.els.deck.offset(".table"),
										riverOffset = card.offset(".table"),
										l = deckOffset.left - riverOffset.left,
										t = deckOffset.top - riverOffset.top;

									// anim start
									card.css({ transform: `translate(${l}px, ${t}px) rotateY(180deg)` });

									setTimeout(() => {
										card.removeClass("in-deck")
											.css({ transform: `translate(0px, 0px) rotateY(180deg)` })
											.cssSequence("fly-river", "transitionend", el => {
												// flip river card
												el.cssSequence("flip-river", "animationend", el => {
													// reset deck
													APP.els.deck.cssSequence("disappear", "transitionend", el => {
														el.removeClass("appear disappear");
														// think next step AI
														Self.dispatch({ type: "go-to-betting", wait: globalSpeed });
													});
												});
											});
									}, 10);
								});
							});
					}, 10);
				}));
				break;
			case "restore-state":
				let entries = Object.keys(event.data.players);
				// reset players array
				players = new Array(entries.length);
				// resurrect players
				entries.map((num, i) => players[i] = new Player({ ...event.data.players[num], index: +num }));
				
				// make sure game view is shown
				APP.dispatch({ type: "show-game-view" });

				// if hole cards not have been dealt
				if (!players[0].cardA) {
					Self.dispatch({ type: "blinds-and-deal" });
				}
				// restore community cards
				if (event.data.flop) {
					// restore flop cards
					value = event.data.flop.map((c, i) => `<div class="card ${c} card-back flop-${i+1} no-anim" data-value="${c}"></div>`);
					APP.els.board.addClass("fan-flop flip-flop no-anim").html(value.join(""));
					
					if (event.data.turn) {
						// append turn
						APP.els.board.addClass("flip-turn").append(`<div class="card card-back turn ${event.data.turn} flip no-anim" data-value="${event.data.turn}"></div>`);
					}
					if (event.data.river) {
						// append river
						APP.els.board.addClass("flip-river").append(`<div class="card card-back river ${event.data.river} flip no-anim" data-value="${event.data.river}"></div>`);
					}
				}
				// pot size
				if (event.data.pot) Self.dispatch({ type: "update-total-pot-value", value: event.data.pot });

				// update dealer button
				Self.dispatch({ type: "set-dealer", index: event.data.buttonIndex });
				// restore deck / card index
				cards = event.data.deck.cards.split(" ");
				deckIndex = event.data.deck.index || 0;
				// next player for action
				currentBettorIndex = event.data.currentBettorIndex || buttonIndex || 0;
				// current bet amount
				currentBetAmount = event.data.currentBetAmount || 0;

				// think next step AI
				AI.think();
				break;
			case "update-total-pot-value":
				value = event.value || Self.getPotSize();
				APP.els.pot.removeClass("hidden").html(value);
				break;
			case "set-dealer":
				buttonIndex = event.index;
				// update UI
				APP.els.dealer.data({ pos: `p${event.index}` }).removeClass("hidden");
				APP.els.deck.data({ pos: `p${event.index}` });
				break;
			case "handle-end-of-round":
				let candidates = new Array(players.length),
					allocations = new Array(players.length),
					winningHands = new Array(players.length),
					totalBetsPerPlayer = new Array(players.length),
					stillActiveCandidates = 0;

				for (let i=0; i<candidates.length; i++) {
					allocations[i] = 0;
					totalBetsPerPlayer[i] = players[i].totalBet;
					if (players[i].status != "FOLD" && players[i].status != "BUST") {
						candidates[i] = players[i];
						stillActiveCandidates += 1;
					}
				}

				let totalPotSize = Self.getPotSize(),
					bestHandName = "",
					bestHandPlayers,
					currentPotToSplit = 0,
					potRemainder = 0;
				if (globalPotRemainder) {
					potRemainder = globalPotRemainder;
					totalPotSize += globalPotRemainder;
					globalPotRemainder = 0;
				}

				if (Self.activePlayers.length === 1) {
					let player = Self.activePlayers[0];
					player.wins(totalPotSize);
					Self.dispatch({
						type: "highlight-single-winner",
						player,
						dialog: {
							head: `${player.name} Wins!`,
							text: `<b>${totalPotSize}</b> to ${player.name}`,
						}
					});
					return;
				}

				isEveryoneAllIn = true;
				Self.activePlayers.map(p => isEveryoneAllIn && p.status === "ALLIN");
				if (isEveryoneAllIn && APP.els.board.find(".card").length < 5) {
					return Self.dispatch({ type: "go-to-betting" });
				}
				
				while (totalPotSize > (potRemainder + 0.9) && stillActiveCandidates) {
					// The first round all who not folded or busted are candidates
					// If that/ose winner(s) cannot get all of the pot then we try
					// with the remaining players until the pot is emptied
					let winners = Hands.getWinners(candidates);
					if (!bestHandPlayers) bestHandPlayers = winners;
					
					if (!winners) {
						potRemainder = totalPotSize;
						totalPotSize = 0;
						break;
					}

					// Get the lowest winner bet, e.g. an all-in
					let lowestWinnerBet = totalPotSize * 2;
					let numWinners = 0;
					for (let i=0; i<winners.length; i++) {
						// Only the winners bets
						if (!winners[i]) continue;
						
						if (!bestHandName) {
							bestHandName = winners[i].hand_name;
						}
						numWinners++;
						if (totalBetsPerPlayer[i] < lowestWinnerBet) {
							lowestWinnerBet = totalBetsPerPlayer[i];
						}
					}

					// Compose the pot
					// If your bet was less than (a fold) or equal to the lowest winner bet:
					//    then add it to the current pot
					// If your bet was greater than lowest:
					//    then just take the 'lowestWinnerBet' to the pot

					// Take in any fraction from a previous split
					currentPotToSplit = potRemainder;
					potRemainder = 0;

					for (let i=0; i<players.length; i++) {
						if (lowestWinnerBet >= totalBetsPerPlayer[i]) {
							currentPotToSplit += totalBetsPerPlayer[i];
							totalBetsPerPlayer[i] = 0;
						} else {
							currentPotToSplit += lowestWinnerBet;
							totalBetsPerPlayer[i] -= lowestWinnerBet;
						}
					}

					// Divide the pot - in even integrals
					let share = Math.floor(currentPotToSplit / numWinners);
					// and save any remainders to next round
					potRemainder = currentPotToSplit - share * numWinners;

					for (let i=0; i<winners.length; i++) {
						// You have got your share
						if (totalBetsPerPlayer[i] < 0.01) candidates[i] = null;
						
						// You should not have any
						if (!winners[i]) continue;
						
						totalPotSize -= share; // Take from the pot
						allocations[i] += share; // and give to the winners
						winningHands[i] = winners[i].hand_name;
					}

					// Iterate until pot size is zero - or no more candidates
					for (let i=0; i<candidates.length; i++) {
						if (candidates[i] == null) continue;
						stillActiveCandidates += 1
					}
					if (stillActiveCandidates == 0) {
						potRemainder = totalPotSize;
					}
				} // End of pot distribution
				
				globalPotRemainder = potRemainder;
				potRemainder = 0;

				let humanLoses = 0;
				// Distribute the pot - and then do too many things
				for (let i=0; i<allocations.length; i++) {
					if (allocations[i] > 0) {
						let aString = allocations[i].toString();
						let dotIndex = aString.indexOf(".");
						if (dotIndex > 0) {
							aString = aString + "00";
							allocations[i] = aString.substring(0, dotIndex + 3) - 0;
						}
						let bankroll = players[i].bankroll;
						// players[i].bankroll += allocations[i];
						if (bestHandPlayers[i]) {
							Self.dispatch({
								type: "highlight-winning-hand",
								player: players[i],
								bestHandPlayers: bestHandPlayers[i],
								winnings: allocations[i],
								dialog: {
									head: `${players[i].name} wins!`,
									text: `${winningHands[i]} gives <b>${allocations[i]}</b> to ${players[i].name}`,
								}
							});
						} else {
							if (allocations[i] > 0) {
								// console.log(`${allocations[i]} is returned to ${players[i].name}`);
								bankroll += allocations[i];
								players[i].update({ bankroll });
							}
							players[i].status = "LOSER";
							players[i].showCards();
						}
					} else {
						if (!Self.hasMoney(players[i].index) && players[i].status != "BUST") {
							// players[i].status = "BUST";
							if (i == 0) humanLoses = 1;
						}
						if (!["FOLD", "BUST"].includes(players[i].status)) {
							players[i].status = "LOSER";
							players[i].showCards();
						}
					}
				}
				// Have a more liberal take on winning
				if (allocations[0] > 5) {
					HUMAN_WINS_AGAIN++;
				} else {
					HUMAN_WINS_AGAIN = 0;
				}
				console.log("End of iteration");
				break;
			case "highlight-single-winner":
				event.player.status = "WINNER";
				
				// UI update
				setTimeout(() => {
					let toSeat = `to-seat-${event.player.index}`,
						roll = event.player.bankroll,
						total = roll + Self.getPotSize();
					// show winnings dialog
					APP.dialog.dispatch({ type: "finish-round", ...event.dialog });
					
					APP.els.table.find(".pot").cssSequence(toSeat, "transitionend", el => {
						// reset pot element
						el.removeClass(toSeat).addClass("hidden").html("");
						// hide "betting" element
						event.player.el.removeClass("betting");
						// player bankroll ticker
						event.player.el.find(".bankroll")
							.css({
								"--roll": roll,
								"--total": total,
							})
							.cssSequence("ticker", "animationend", el => {
								// update user bankroll
								event.player.bankroll += total;
								// update bankroll content
								el.removeClass("ticker").html(event.player.bankroll).cssProp({ "--roll": "", "--total": "" });
							});
					});
				}, globalSpeed);
				break;
			case "highlight-winning-hand":
				event.player.status = "WINNER";
				event.player.showCards();

				// UI update
				setTimeout(() => {
					event.bestHandPlayers.highlight.map(c => {
						let wCard = APP.els.board.find(`.card[data-value="${c}"]`);
						if (!wCard.length) wCard = event.player.el.find(`.card[data-value="${c}"]`);
						wCard.css({ transform: "" }).addClass("winner");
					});
					// loser cards
					APP.els.board.find(`.card:not(.winner)`).addClass("loser");
					event.player.el.find(`.card:not(.winner)`).addClass("loser");

					let toSeat = `to-seat-${event.player.index}`,
						roll = event.bankroll || event.player.bankroll,
						total = event.winnings || (roll + Self.getPotSize());
					APP.els.table.find(".pot").cssSequence(toSeat, "transitionend", el => {
						// reset pot element
						el.removeClass(toSeat).addClass("hidden").html("");
						// player bankroll ticker
						event.player.el.find(".bankroll")
							.css({
								"--roll": roll,
								"--total": total,
							})
							.cssSequence("ticker", "animationend", el => {
								// update user bankroll
								event.player.bankroll += total;
								// update bankroll content
								el.removeClass("ticker").html(event.player.bankroll).cssProp({ "--roll": "", "--total": "" });
								// show winnings dialog
								APP.dialog.dispatch({ type: "finish-round", ...event.dialog });
							});
					});
				}, globalSpeed);
				break;
			case "output-pgn":
				data = {
					buttonIndex: buttonIndex,
					currentBetAmount: currentBetAmount,
					deck: {
						cards: cards.join(" "),
						index: deckIndex,
					},
					players: {},
				};
				// iterate players
				players.map(p => {
					data.players[p.index] = {
						bankroll: p.bankroll,
						name: p.name,
						cardA: p.cardA,
						cardB: p.cardB,
						totalBet: p.totalBet,
						subtotalBet: p.subtotalBet,
						status: p.status,
					};
				});
				
				console.log( JSON.stringify(data, null, "  ") );
				break;
		}
	},
	get boardCards() {
		let ret = Array(6);
		holdem.els.board.find(".card").map((c, i) => ret[i] = c.getAttribute("data-value"));
		return ret;
	},
	get activePlayers() {
		return players.filter(p => !["BUST", "FOLD"].includes(p.status));
	},
	clearBets () {
		for (let i=0; i<players.length; i++) {
			// players[i].subtotalBet = 0;
			players[i].update({ subtotalBet: 0 });
		}
		currentBetAmount = 0;
	},
	getNumBetting() {
		let n = 0;
		for (let i=0; i<players.length; i++) {
			if (players[i].status != "FOLD" && players[i].status != "BUST" && this.hasMoney(players[i].index)) {
				n++;
			}
		}
		return n;
	},
	getPotSize() {
		let p = 0;
		for (let i=0; i<players.length; i++) {
			p += players[i].totalBet + players[i].subtotalBet;
		}
		return p;
	},
	getNextPlayerPosition(i, delta) {
		let seats = players.filter(p => !["BUST", "FOLD"].includes(p.status)).map(p => p.index),
		// let seats = players.map(p => p.index),
			index = seats.indexOf(i),
			add = seats.length * seats.length;
		return seats[(index + delta + add) % seats.length];
	},
	getPlayer(pos) {
		return players.find(p => p.index === pos);
	},
	makeReadableRank(r) {
		if (r < 11) return r;
		else if (r == 11) return "J";
		else if (r == 12) return "Q";
		else if (r == 13) return "K";
		else if (r == 14) return "A";
	},
	hasMoney(i) {
		let player = this.getPlayer(i);
		return player.bankroll >= 0.01;
	},
	resetPlayerStatuses(type) {
		for (let i=0; i<players.length; i++) {
			switch (type) {
				case 0: players[i].status = ""; break;
				case 1: if (players[i].status != "BUST") players[i].status = ""; break;
				case 2: if (players[i].status != "FOLD" && players[i].status != "BUST") players[i].status = ""; break;
			}
		}
	},
	playerFolds(playerIndex) {
		let player = this.getPlayer(playerIndex);
		player.status = "FOLD";
		player.el.removeClass("betting").data({ status: "FOLD" });
	},
	playerBets(playerIndex, betAmount) {
		let player = this.getPlayer(playerIndex);
		if (player.status == "FOLD") {
			return 0;
			// FOLD ;
		} else if (betAmount >= player.bankroll) {
			betAmount = player.bankroll;

			let oldCurrentBet = currentBetAmount;
			if (player.subtotalBet + betAmount > currentBetAmount) {
				currentBetAmount = player.subtotalBet + betAmount;
			}

			// currentMinRaise should be calculated earlier ? <--
			let new_currentMinRaise = currentBetAmount - oldCurrentBet;
			if (new_currentMinRaise > currentMinRaise) {
				currentMinRaise = new_currentMinRaise;
			}
			player.status = "ALLIN";
		} else if (betAmount + player.subtotalBet == currentBetAmount) {
			// console.log(player.name, "CHECK", currentBetAmount);
			player.status = currentBetAmount > 0 ? "CALL" : "CHECK";
		} else if (currentBetAmount > player.subtotalBet + betAmount) {
			console.log("2 SMALL");
			// COMMENT OUT TO FIND BUGS
			if (playerIndex == 0) {
				let minBet = currentBetAmount - player.subtotalBet;
				console.log(`The current bet to match is ${currentBetAmount} \nYou must bet a total of at least ${minBet} or fold`);
			}
			return 0;
		// } else if (betAmount + player.subtotalBet > currentBetAmount
		// 			&& this.getPotSize() > 0
		// 			&& betAmount + player.subtotalBet - currentBetAmount < currentMinRaise) {
		// 	// COMMENT OUT TO FIND BUGS
		// 	if (playerIndex == 0) {
		// 		console.log("Minimum raise is currently " + currentMinRaise + ".");
		// 	}
		// 	return 0;
		} else {
			player.status = "CALL";

			let previousCurrentBet = currentBetAmount;
			currentBetAmount = player.subtotalBet + betAmount;

			if (this.getPotSize() > 0) {
				currentMinRaise = currentBetAmount - previousCurrentBet;
				if (currentMinRaise < BIG_BLIND) {
					currentMinRaise = BIG_BLIND;
				}
			}
		}
		player.subtotalBet += betAmount;
		player.bankroll -= betAmount;
		player.bet(player.subtotalBet);

		// UI show pot size
		// this.dispatch({ type: "update-total-pot-value" });

		return 1;
	},
};
