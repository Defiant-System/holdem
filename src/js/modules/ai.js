
let AI = (() => {

let APP;
let P, HCONF, ID_CONF, CALL_LEVEL, BET_LEVEL, POT_LEVEL, BANKROLL;
let CALL, SMALL, MED, BIG, ALLIN;
let RANKA, RANKB;
let FOLD = 0;
let holeRankings =
	"AA:100,KK:96,QQ:95,JJ:93,AKs:94," +
	"TT:86,AQs:85,AJs:84,KQs:84,AK:85," +
	"99:76,JTs:75,QJs:75,KJs:74,ATs:74,AQ:73," +
	"T9s:66,KQ:66,88:66,QTs:65,98s:64,J9s:65,AJ:65,KTs:65," +                          // THIS & ABOVE: EARLY POSITION
	"77:56,87s:55,Q9s:55,T8s:54,KJ:55,QJ:54,JT:54,76s:53,97s:53,Axs:54,65s:53," +      // THIS & ABOVE: LATE POSITION
	"66:46,AT:46,55:45,86s:44,KT:45,QT:44,54s:45,K9s:45,J8s:44,75s:43," +
	"44:36,J9:35,64s:33,T9:34,53s:33,33:35,98:34,43s:34,22:34,Kxs:34,T7s:33,Q8s:33," + // THIS & ABOVE: BUTTON
	"87:26,A9:26,Q9:25,76:25,42s:23,32s:23,96s:23,85s:22,J8:22,J7s:22,65:22,54:22,74s:21,K9:22,T8:21,";


let Main = {
	init() {
		// local available reference to application
		APP = holdem;
	},
	think() {
		let incrementBettorIndex = 0;
		
		for (let i=0; i<players.length; i++) {
			players[i].unHighlight();
		}

		let nextPlayer = Poker.getPlayer(currentBettorIndex);
		if (nextPlayer.status == "BUST" || nextPlayer.status == "FOLD") {
			incrementBettorIndex = 1;
		} else if (!Poker.hasMoney(currentBettorIndex)) {
			console.log(nextPlayer.name, "CHECK");
			nextPlayer.status = "CALL";
			incrementBettorIndex = 1;
		} else if (nextPlayer.status == "CALL" && nextPlayer.subtotalBet == currentBetAmount) {
			incrementBettorIndex = 1;
		} else {
			nextPlayer.status = "";
			if (currentBettorIndex == 0) {
				let actions = currentBetAmount === 0 ? "check-fold" : "call-fold-raise";
				APP.dialog.dispatch({ type: "show-dialog", actions });
				return;
			} else {
				nextPlayer.highlight();
				
				setTimeout(() => this.getBet(currentBettorIndex), 1500);
				return;
			}
		}
		let can_break = true;
		for (let j=0; j<players.length; j++) {
			let s = players[j].status;
			if (s == "OPTION") {
				can_break = false;
				break;
			}
			if (s != "BUST" && s != "FOLD") {
				if (Poker.hasMoney(players[j].index) && players[j].subtotalBet < currentBetAmount) {
					can_break = false;
					break;
				}
			}
		}
		if (incrementBettorIndex) {
			currentBettorIndex = Poker.getNextPlayerPosition(currentBettorIndex, 1);
		}
		if (can_break) {
			// console.log("ready_for_next_card, 999 * global_speed");
			setTimeout(() => Poker.dispatch({ type: "ready-for-next-card" }), 500);
		} else {
			setTimeout(() => Main.think(), 500);
		}
	},
	getBet(x) {
		let player = Poker.getPlayer(x);
		let n = currentBetAmount - player.subtotalBet;
		let b = !Poker.boardCards[0] ? this.getPreFlopBet() : this.getPostFlopBet();

		if (b >= player.bankroll) { // ALL IN
			// console.log("ALL IN");
			player.status = "";
		} else if (b < n) { // BET 2 SMALL
			b = 0;
			player.status = "FOLD";
		} else if (b == n) { // CALL
			// console.log(player.name, "CHECK");
			player.status = "CALL";
		} else if (b > n) {
			if (b - n < currentMinRaise) { // RAISE 2 SMALL
				b = n;
				player.status = "CALL";
			} else {
				// console.log("RAISE");
				player.status = ""; // RAISE
			}
		}
		if (Poker.playerBets(x, b) == 0) {
			player.status = "FOLD";
			Poker.playerBets(x, 0);
		}
		// console.log(player.cardA, player.cardB, b);
		// console.log(player.status);
		// console.log( "getBet", currentBettorIndex, player.status, b );

		// go to next player
		currentBettorIndex = Poker.getNextPlayerPosition(currentBettorIndex, 1);
		
		// next thing to do (!?)
		this.think();
	},
	getPreFlopBet() {
		var num_players_playing_the_hand = this.internal_setup();

		if ((HUMAN_GOES_ALL_IN || HUMAN_WINS_AGAIN > 1) && (HCONF > 60 || RANKA == RANKB || RANKA > 13 || RANKB > 13)) {
			var other_making_stand = 0;
			for (var i = 1; i < players.length; i++) {
				if (players[i].bankroll < 1 && players[i].status != "BUST") {
					other_making_stand = 1;
				}
			}
			if (other_making_stand < 1) { // should really check to see if bet_level is big and anyone has called...that's taking a stand too...
				if (BET_LEVEL > 70) {
					return this.internal_what_do_x("40:CALL,60:ALLIN");
				}
				return this.internal_what_do_x("15:MED,40:SMALL,45:CALL");
			}
			if (HCONF > 75) {
				return this.internal_what_do_x("15:MED,40:SMALL,45:CALL");
			}
		}

		if (HCONF > 99) {
			if (POT_LEVEL > 75) return this.internal_what_do_x("60:ALLIN,10:BIG,20:MED,5:SMALL,5:CALL");
			if (num_players_playing_the_hand < 4) return this.internal_what_do_x("2:BIG,15:MED,33:SMALL,50:CALL");
			return this.internal_what_do_x("2:ALLIN,8:BIG,40:MED,40:SMALL,10:CALL");
		}
		if (HCONF > 90) {
			if (POT_LEVEL > 50) return this.internal_what_do_x("15:ALLIN,35:BIG,30:MED,15:SMALL,5:CALL");
			if (num_players_playing_the_hand > 3) return this.internal_what_do_x("5:ALLIN,15:BIG,35:MED,35:SMALL,10:CALL");
			return this.internal_what_do_x("2:ALLIN,6:BIG,15:MED,55:SMALL,22:CALL");
		}
		if (HCONF > 80) {
			if (POT_LEVEL > 50) {
				if (ID_CONF == "LO") return this.internal_what_do_x("100:ALLIN");
				return this.internal_what_do_x("100:CALL");
			}
			return this.internal_what_do_x("5:ALLIN,15:BIG,15:MED,30:SMALL,35:CALL");
		}

		if (P.subtotalBet > 0 && CALL_LEVEL < 40) {
			if (HCONF > 20 || RANKA > 10 || RANKB > 10) return this.internal_what_do_x("5:SMALL,95:CALL");
		}

		if (HCONF > 70) {
			if (POT_LEVEL > 75) {
				if (ID_CONF == "LO") return this.internal_what_do_x("100:ALLIN");
				return this.internal_what_do_x("100:CALL");
			}
			if (POT_LEVEL > 50) {
				if (ID_CONF == "LO") return this.internal_what_do_x("50:ALLIN,50:BIG");
				return this.internal_what_do_x("100:CALL");
			}
			if (num_players_playing_the_hand > 3) return this.internal_what_do_x("5:ALLIN,15:BIG,30:MED,30:SMALL,20:CALL");
			return this.internal_what_do_x("2:ALLIN,7:BIG,35:MED,36:SMALL,20:CALL");
		}
		if (HCONF > 60) {
			if (POT_LEVEL > 75) {
				if (ID_CONF == "LO") return this.internal_what_do_x("100:ALLIN");
				if (CALL_LEVEL < 70) return CALL;
				if (ID_CONF == "HI") return this.internal_what_do_x("25:CALL");
				return this.internal_what_do_x("34:CALL");
			}
			if (POT_LEVEL > 50) {
				if (ID_CONF == "LO") return this.internal_what_do_x("75:ALLIN,25:BIG");
				if (CALL_LEVEL < 70) return CALL;
				return this.internal_what_do_x("65:CALL");
			}
			if (num_players_playing_the_hand > 3) return this.internal_what_do_x("3:ALLIN,17:BIG,30:MED,30:SMALL,20:CALL");
			return this.internal_what_do_x("1:ALLIN,2:BIG,7:MED,40:SMALL,50:CALL");
		}
		if (HCONF > 50) {
			if (POT_LEVEL > 75) {
				if (CALL_LEVEL < 40) return CALL;
				return FOLD;
			}
			if (POT_LEVEL > 50) {
				if (CALL_LEVEL < 40) return CALL;
				return this.internal_what_do_x("1:ALLIN,8:CALL");
			}
			return this.internal_what_do_x("1:ALLIN,1:BIG,5:MED,20:SMALL,73:CALL");
		}
		if (HCONF > 40) {
			if (BET_LEVEL > 40) {
				if (CALL_LEVEL < 40) return CALL;
				return FOLD;
			}
			if (BET_LEVEL > 30) {
				if (CALL_LEVEL < 30) return CALL;
				if (ID_CONF == "LO") return this.internal_what_do_x("24:CALL");
				return this.internal_what_do_x("37:CALL");
			}
			return this.internal_what_do_x("1:ALLIN,1:BIG,19:SMALL,79:CALL");
		}
		if (HCONF > 30) {
			if (BET_LEVEL > 40) {
				if (CALL_LEVEL < 30) return CALL;
				return FOLD;
			}
			if (BET_LEVEL > 30) {
				if (CALL_LEVEL < 30) return this.internal_what_do_x("15:SMALL,85:CALL");
				if (ID_CONF == "LO") return this.internal_what_do_x("1:CALL");
				return this.internal_what_do_x("20:CALL");
			}
			return this.internal_what_do_x("1:ALLIN,1:BIG,9:SMALL,89:CALL");
		}
		if (HCONF > 20) {
			if (BET_LEVEL > 30) {
				if (CALL_LEVEL < 30) return CALL;
				return FOLD;
			}
			if (BET_LEVEL > 20) {
				if (CALL_LEVEL < 20) return CALL;
				if (ID_CONF == "LO") return this.internal_what_do_x("1:CALL");
				return this.internal_what_do_x("20:CALL");
			}
			return this.internal_what_do_x("1:ALLIN,99:CALL");
		}
		if (CALL_LEVEL > 20) return FOLD;
		if (CALL_LEVEL > 10) {
			if (ID_CONF == "LO") return this.internal_what_do_x("20:CALL");
			return this.internal_what_do_x("1:MED,40:CALL");
		}
		if (CALL_LEVEL > 5) {
			if (ID_CONF == "LO") return this.internal_what_do_x("1:BIG,15:CALL");
			return this.internal_what_do_x("35:CALL");
		}
		if (ID_CONF == "LO") return this.internal_what_do_x("1:ALLIN,79:CALL");

		return CALL;
	},
	getPostFlopBet() {
		var dummy = this.internal_setup();
		var ROUND = 3;
		if (Poker.boardCards[4]) ROUND = 5;
		else if (Poker.boardCards[3]) ROUND = 4;

		if (P.subtotalBet > 0) { // so no check-raising!!!!!!!!
			if (HCONF > 20 || RANKA > 10 || RANKB > 10) {
				if ((CALL_LEVEL < 40 && ROUND < 4) || (CALL_LEVEL < 30 && ROUND < 5)) return CALL;
			}
		}

		var VERDICT = "";
		var STRAIGHT_FLUSH = Hands.test.straightFlush(P);
		var FOUR_OF_A_KIND = Hands.test.fourOfKind(P);
		var FULL_HOUSE = Hands.test.fullHouse(P);
		var FLUSH = Hands.test.flush(P);
		var STRAIGHT = Hands.test.straight(P);
		var THREE_OF_A_KIND = Hands.test.threeOfKind(P);
		var TWO_PAIR = Hands.test.twoPair(P);
		var ONE_PAIR = Hands.test.onePair(P);
		var FLUSH_DRAW = 0;

		if (ROUND < 5) {
			if (FLUSH["num_needed"] == 1) {
				var suit = FLUSH["suit"];
				if (P.cardA.substring(0, 1) == suit || P.cardB.substring(0, 1) == suit) FLUSH_DRAW = 1;
			}
		}

		if (STRAIGHT_FLUSH["num_needed"] < 1) {
			if (STRAIGHT_FLUSH["num_mine"] > 0) VERDICT = "GREAT";
			else VERDICT = "PLAY BOARD";
		}
		if (VERDICT == "" && FOUR_OF_A_KIND["num_needed"] < 1) {
			if (FOUR_OF_A_KIND["num_mine"] > 0) VERDICT = "GREAT";
			else {
				VERDICT = "PLAY BOARD"; // SHOULD CHECK MY KICKER!!!!!!!................
			}
		}
		if (VERDICT == "" && FULL_HOUSE["num_needed"] < 1) { // consider 2 or 3 on the board, (higher full house, 4 of a kind)
			if (FULL_HOUSE["num_mine"] > 0) VERDICT = "GREAT";
			else VERDICT = "PLAY BOARD";
		}
		if (VERDICT == "" && FLUSH["num_needed"] < 1) { // look for full house, etc.
			var num_mine = FLUSH["num_mine"];
			if (num_mine > 1) VERDICT = "GREAT";
			else if (num_mine > 0) {
				var rank = 0;
				if (P.cardA.substring(0, 1) == FLUSH["suit"]) rank = RANKA;
				else rank = RANKB;
				if (rank < 11) VERDICT = "GOOD"; // 12???????
				else VERDICT = "GREAT";
			} else VERDICT = "MAYBE"; // could look @ board & decide if person was tryin' for flush...FACTOR: ANALYZE BETTING PATTERNS!...
		}
		if (VERDICT == "" && STRAIGHT["num_needed"] < 1) { // look for flush, etc.
			if (STRAIGHT["num_mine"] > 0) VERDICT = "GREAT";
			else VERDICT = "PLAY BOARD";
			if (this.internal_exists_flush_potential() < 3) VERDICT = "MAYBE"; // //////////POTENTIALLY BAD!!!!!!unless i can get it...!!!!!!!!!!!!!!!!!!
		}
		if (VERDICT == "" && THREE_OF_A_KIND["num_needed"] < 1) { // look for straight, etc.
			if (THREE_OF_A_KIND["num_mine"] > 0) VERDICT = "GREAT";
			else {
				var k1 = THREE_OF_A_KIND["kicker_1"];
				var k2 = THREE_OF_A_KIND["kicker_2"];
				if ((k1 == RANKA && k2 == RANKB) || (k1 == RANKB && k2 == RANKA)) VERDICT = "GREAT";
				else if (k1 == RANKA || k1 == RANKB) VERDICT = "GOOD";
				else if (k1 > 11 && k2 > 9) VERDICT = "GOOD";
				else VERDICT = "MAYBE"; // should really bet "POTENTIALLY BAD".............but can i get it?...............!!!!!!!!!!!!!
			}
			if (this.internal_exists_flush_potential() < 3) {
				VERDICT = "MAYBE"; // //////////POTENTIALLY BAD!!!!!!!!!unless i can get it...!!!!!!!!!!
			}
			if (this.internal_exists_straight_potential() < 2) {
				VERDICT = "MAYBE"; // //////////"POTENTIALLY BAD!!!!!!!unless i can get it...!!!!!!!!!!!!
			}
		}
		if (VERDICT == "" && TWO_PAIR["num_needed"] < 1) {
			num_mine = TWO_PAIR["num_mine"];
			if (num_mine > 1) {
				if (RANKA == RANKB) {
					VERDICT = "GOOD";
				} else {
					VERDICT = "GREAT";
				}
			} else if (num_mine > 0) {
				if (ROUND < 4) {
					VERDICT = "GREAT"; // hmmmmmmmm........
				} else {
					rank = TWO_PAIR["rank_1"];
					if (rank != RANKA && rank != RANKB) {
						rank = TWO_PAIR["rank_2"];
					}
					if (rank < 10) {
						VERDICT = "MAYBE"; // 11??????
					} else {
						VERDICT = "GOOD";
					}
				}
			} else {
				var kick = TWO_PAIR["kicker"];
				if (kick == RANKA || kick == RANKB || kick > 10) {
					VERDICT = "PLAY BOARD";
				} else {
					VERDICT = "MAYBE"; // "POTENTIALLY BAD"????????................................!!!!unless i can get it...!!!!
				}
			}
			if (this.internal_exists_flush_potential() < 3) {
				VERDICT = "MAYBE"; // ///////////"POTENTIALLY BAD!!!!!!!!unless i can get it...!!!!!!!!!!!!!!!!
			}
			if (this.internal_exists_straight_potential() < 2) {
				VERDICT = "MAYBE"; // //////////"POTENTIALLY BAD!!!!!!unless i can get it...!!!!!!!!!!!!!
			}
		}
		if (VERDICT == "" && ONE_PAIR["num_needed"] < 1) {
			if (ONE_PAIR["num_mine"] > 0) {
				var my_rank = ONE_PAIR["rank"];
				var num_overcards = 0;
				var board = Poker.boardCards;
				for (var i=0; i<board.length; i++) {
					if (board[i] && Hands.getRank(board[i]) > my_rank) num_overcards++;
				}
				if (num_overcards < 1) {
					VERDICT = "GOOD";       // Moved from (Comment1) below
					if (my_rank > 11) {
						VERDICT = "GREAT";
					}
					// (Comment1) VERDICT = "GOOD";       // <-- What is this ?  overwriting VERDICT
				} else if (num_overcards < 2) {
					VERDICT = "MAYBE";      // Moved from (Comment2) below
					if (my_rank > 7) {
						VERDICT = "GOOD";
					}
					// (Comment2) VERDICT = "MAYBE";      // <-- What is this ?  overwriting VERDICT
				} else {
					VERDICT = "MAYBE";
				}
				if (this.internal_exists_flush_potential() < 3) {
					VERDICT = "MAYBE"; // ///////////"POTENTIALLY BAD!!!!!!!!!unless i can get it...!!!!!!!!!!!!!!!
				}
				if (this.internal_exists_straight_potential() < 2) {
					VERDICT = "MAYBE"; // //////////"POTENTIALLY BAD!!!!!!!unless i can get it...!!!!!!!!!!!!
				}
			}
			// add verdict "POTENTIALLY BAD" here, for example, for when the board looks dangerous?
			// but what if i can get it!?!?!!!!!!!!!!!!!!!!!!!!!!!!!
		}

		// special case if verdict is MAYBE AND i have a draw...tend not to fold
		// special case where verdict is good & i have a draw...tend not to fold
		if ((HUMAN_GOES_ALL_IN || HUMAN_WINS_AGAIN > 1) && (VERDICT == "GREAT" || VERDICT == "GOOD" || VERDICT == "MAYBE" || RANKA == RANKB)) {
			var other_making_stand = 0;
			for (var index = 1; index < players.length; index++) {
				if (players[index].bankroll < 1 && players[index].status != "BUST") {
					other_making_stand = 1;
				}
				break;
			}
			if (other_making_stand < 1) { // should really check to see if bet_level is big and anyone has called...that's taking a stand too...
				if (BET_LEVEL > 70) {
					return this.internal_what_do_x("40:CALL,60:ALLIN");
				}
				return this.internal_what_do_x("10:MED,40:SMALL,50:CALL");
			}
			// Don't let the human get away too easy
			if (VERDICT == "GREAT" || VERDICT == "GOOD") {
				return this.internal_what_do_x("10:MED,40:SMALL,50:CALL");
			}
		}

		if (VERDICT == "GREAT") {
			if (ROUND < 5) {
				return this.internal_what_do_x("5:ALLIN,5:BIG,25:MED,45:SMALL,20:CALL");
			}
			return this.internal_what_do_x("30:ALLIN,40:BIG,30:MED");
		}
		if (VERDICT == "GOOD") {
			if (ROUND < 4) {
				if (BET_LEVEL > 79) {
					if (CALL_LEVEL < 70 || FLUSH_DRAW) return CALL;
					return this.internal_what_do_x("59:CALL");
				}
				if (P.subtotalBet > 0) return this.internal_what_do_x("1:ALLIN,2:BIG,5:MED,20:SMALL,72:CALL");
				return this.internal_what_do_x("3:ALLIN,40:BIG,42:MED,10:SMALL,5:CALL");
			}
			if (BET_LEVEL < 50) {
				if (P.subtotalBet > 0) return this.internal_what_do_x("1:BIG,3:MED,21:SMALL,75:CALL");
				return this.internal_what_do_x("10:BIG,20:MED,50:SMALL,20:CALL");
			}
			if (BET_LEVEL < 80) {
				if (CALL_LEVEL < 50) return CALL;
				return this.internal_what_do_x("65:CALL"); // SOME THINGS DEPEND ON THE BOARD,POT ODDS,CONFIDENCE!!!!!!!!!!!!!!!!!!!!!!!
			}
			if (CALL_LEVEL < 70) return CALL;
			if (ROUND < 5) return this.internal_what_do_x("35:CALL");
			return this.internal_what_do_x("25:CALL");
		}
		if (VERDICT == "MAYBE") {
			if (BET_LEVEL < 50) {
				if (CALL > 0) return this.internal_what_do_x("5:MED,15:SMALL,80:CALL");
				return this.internal_what_do_x("5:BIG,20:MED,50:SMALL,25:CALL");
			}
			if (BET_LEVEL < 70) {
				if (ROUND < 4 && FLUSH_DRAW) return CALL;
				if (CALL_LEVEL < 40) return CALL;
				if (ID_CONF == "LO") {
					if (ROUND < 4) return this.internal_what_do_x("35:CALL");
					if (ROUND < 5) return this.internal_what_do_x("65:CALL");
					return this.internal_what_do_x("89:CALL");
				}
				if (ROUND < 4) return this.internal_what_do_x("61:CALL");
				if (ROUND < 5) return this.internal_what_do_x("31:CALL");
				return this.internal_what_do_x("19:CALL");
			}
			if (CALL_LEVEL < 40) return CALL;
			if (ROUND < 4) {
				if (CALL_LEVEL < 50) return CALL;
				return this.internal_what_do_x("50:CALL");
			}
			return this.internal_what_do_x("11:CALL");
		}
		if (FLUSH_DRAW) {
			if (ROUND < 4) return this.internal_what_do_x("20:MED,40:SMALL,40:CALL");
			if (ROUND < 5) {
				if (CALL < 1) return this.internal_what_do_x("10:MED,90:SMALL");
				if (CALL_LEVEL < 40) return CALL;
				return this.internal_what_do_x("33:CALL"); // depends on how good my cards are!!!!
			}
			// otherwise, cleanup process handles it
		}
		if (VERDICT == "PLAY BOARD") {
			return CALL;
		}

		// perhaps use the ranking to come up w/ a preliminary strategy & then modify that strategy:
		// bluff
		// slow play
		// take a stand...human wins 4 in a row & human still playing & num players is 2 & i have good/maybe cards then call!
		// play straight

		var hi_rank = RANKA;
		if (RANKA < RANKB) {
			hi_rank = RANKB;
		}
		if (HCONF > 80) {
			if (CALL < 1) {
				if (ROUND < 5) return this.internal_what_do_x("10:MED,80:SMALL,10:CALL");
				return this.internal_what_do_x("20:MED,70:SMALL,10:CALL");
			}
			if (CALL_LEVEL < 50) return CALL;
			if (CALL_LEVEL < 70 && ROUND < 5) return CALL;
			if (CALL_LEVEL < 80 && ROUND < 4) return CALL;
			return FOLD;
		}
		if (HCONF > 70) {
			if (CALL < 1) {
				if (ROUND < 5) return this.internal_what_do_x("10:MED,75:SMALL,15:CALL");
				return this.internal_what_do_x("10:MED,80:SMALL,10:CALL");
			}
			if (CALL_LEVEL < 40) return CALL;
			if (CALL_LEVEL < 50) return this.internal_what_do_x("50:CALL");
			return FOLD;
		}
		if (hi_rank > 13 || HCONF > 50) {
			if (CALL < 1) {
				if (ROUND < 5) return this.internal_what_do_x("5:MED,75:SMALL,20:CALL");
				return this.internal_what_do_x("5:MED,75:SMALL,20:CALL");
			}
			if (CALL_LEVEL < 30) return CALL;
			if (CALL_LEVEL < 40 && ROUND < 4) return CALL;
			return FOLD;
		}
		if (CALL < 1) {
			if (ROUND < 5) return this.internal_what_do_x("20:SMALL,80:CALL");
			return this.internal_what_do_x("5:MED,70:SMALL,25:CALL");
		}
		if (CALL_LEVEL < 20) return CALL;
		if (CALL_LEVEL < 30) return this.internal_what_do_x("10:SMALL,20:CALL");

		return FOLD;
	},
	internal_exists_flush_potential() {
		var the_hash = Hands.test.flush(new Player());
		return the_hash["num_needed"];
	},
	internal_exists_straight_potential() {
		var the_hash = Hands.test.straight(new Player());
		return the_hash["num_needed"];
	},
	internal_setup() {
		// Poker.activePlayers.length;
		P = Poker.getPlayer(currentBettorIndex);
		CALL = currentBetAmount - P.subtotalBet;
		RANKA = Hands.getRank(P.cardA);
		RANKB = Hands.getRank(P.cardB);
		HCONF = this.internal_get_hole_ranking();
		CALL_LEVEL = this.internal_get_bet_level(CALL);
		BET_LEVEL = this.internal_get_bet_level(currentBetAmount);
		POT_LEVEL = this.internal_get_pot_level();
		BANKROLL = P.bankroll;
		var total_bankrolls = Poker.getPotSize();
		var number_of_players_in_game = 0;
		var num_players_playing_the_hand = 0;
		for (var i = 0; i < players.length; i++) {
			total_bankrolls += players[i].bankroll;
			if (players[i].status != "BUST") {
				number_of_players_in_game++;
				if (players[i].status != "FOLD") {
					num_players_playing_the_hand++;
				}
			}
		}
		ID_CONF = "MID";
		var avg_bankroll = total_bankrolls / number_of_players_in_game;
		if (BANKROLL < avg_bankroll / 2) ID_CONF = "LO";
		if (BANKROLL > avg_bankroll * 1.5) ID_CONF = "HI";
		SMALL = CALL + BIG_BLIND * 2; // consider MINIMUM RAISE here & below!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		if (POT_LEVEL > 40) SMALL += 5;
		if (number_of_players_in_game > 3) {
			MED = CALL + BIG_BLIND * 4;
			BIG = CALL + BIG_BLIND * 10;
		} else {
			SMALL += 5;
			MED = this.internal_round5(CALL + 0.1 * BANKROLL); // consider minimum raise!!!!!!!!!!!!!!!!!!!!!!!!!!!!
			BIG = this.internal_round5(CALL + 0.2 * BANKROLL); // consider minimum raise!
		}
		ALLIN = BANKROLL;

		return num_players_playing_the_hand;
	},
	internal_what_do_x(q, r) {
		q += ",";
		if (!r) r = Math.random();
		var p = 0;
		while (1) {
			var a = q.indexOf(":");
			var b = q.indexOf(",", a);
			if (a < 0 || b < 0) {
				return FOLD;
			}
			var probability = (q.substring(0, a) - 0) / 100;
			var action = q.substring(a + 1, b);
			q = q.substring(b + 1);
			p += probability;
			if (r <= p) {
				return this.internal_tokenize_string(action);
			}
		}
		// Never reached
	},
	internal_tokenize_string(string) {
		switch (string) {
			case "FOLD": return FOLD;
			case "CALL": return CALL;
			case "SMALL": return SMALL;
			case "MED": return MED;
			case "BIG": return BIG;
			case "ALLIN": return ALLIN;
		}
		// console.error("internal_tokenize_string() cannot tokenize " + string);
	},
	internal_get_hole_ranking() {
		var player = Poker.getPlayer(currentBettorIndex);
		var a = player.cardA;
		var b = player.cardB;
		var n_rank_a = Hands.getRank(a);
		var n_rank_b = Hands.getRank(b);
		if (n_rank_b > n_rank_a) {
			a = player.cardB;
			b = player.cardA;
			n_rank_a = Hands.getRank(a);
			n_rank_b = Hands.getRank(b);
		}
		var r_rank_a = this.internal_my_make_readable_rank(n_rank_a);
		var r_rank_b = this.internal_my_make_readable_rank(n_rank_b);
		var suited = "";
		if (Hands.getSuit(a) == Hands.getSuit(b)) suited = "s";
		var h = "";
		if (n_rank_a == n_rank_b) h = "" + r_rank_a + "" + r_rank_b;
		else h = "" + r_rank_a + "" + r_rank_b + suited;
		var q = this.internal_lookup_hole_ranking(h);
		if (!q) {
			h = "" + r_rank_a + "x" + suited;
			q = this.internal_lookup_hole_ranking(h);
		}
		return q;
	},
	internal_get_bet_level(b) {
		var size = b / P.bankroll;
		if (size <= 0.015 || b <= 5) return 5;
		if (size <= 0.02 || b <= 10) return 10;
		if (size <= 0.03 || b <= 15) return 20;
		if (size <= 0.06 || b <= 30) return 30;
		if (size <= 0.12 || b <= 60) return 40;
		if (size <= 0.21 || b <= 100) return 50;
		if (size <= 0.35 || b <= 150) return 70;
		if (size <= 0.41 || b <= 200) return 80;
		return 100;
	},
	internal_get_pot_level() {
		var p = Poker.getPotSize();
		var b = Poker.getPlayer(currentBettorIndex).bankroll;
		if (p > 0.5 * b) return 100;
		if (p > 0.25 * b) return 51;
		return 1;
	},
	internal_lookup_hole_ranking(h) {
		var i = holeRankings.indexOf(h + ":");
		if (i < 0) return 0;
		var j = holeRankings.indexOf(",", i);
		var r = holeRankings.substring(i + h.length + 1, j);
		return r - 0;
	},
	internal_round5(n) {
		if (n < 5) return 5;
		var s = "" + n;
		var i = s.indexOf(".");
		if (i > 0) s = s.substring(0, i);
		n = s - 0;
		while (n % 5 != 0) n++;
		return n;
	},
	internal_my_make_readable_rank(r) {
		var rank = Poker.makeReadableRank(r);
		if (rank == 10) rank = "T";
		return rank;
	}
};

return Main;

})();
