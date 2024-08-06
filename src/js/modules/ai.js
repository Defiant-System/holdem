
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
		let nextPlayer = Poker.getPlayer(currentBettorIndex);
		console.log( nextPlayer.name );
		if (nextPlayer.status == "bust" || nextPlayer.status == "fold") {
			incrementBettorIndex = 1;
		} else if (!Poker.hasMoney(currentBettorIndex)) {
			nextPlayer.status = "call";
			incrementBettorIndex = 1;
		} else if (nextPlayer.status == "call" && nextPlayer.subtotalBet == currentBetAmount) {
			incrementBettorIndex = 1;
		} else {
			nextPlayer.status = "";
			if (currentBettorIndex == 0) {
				APP.dialog.dispatch({ type: "show-dialog", actions: "call-fold-raise" });
				return;
			} else {
				setTimeout(() => this.getBet(currentBettorIndex), 500);
				return;
			}
		}
		let can_break = true;
		for (let j = 0; j < players.length; j++) {
			let s = players[j].status;
			if (s == "OPTION") {
				can_break = false;
				break;
			}
			if (s != "BUST" && s != "FOLD") {
				if (Poker.hasMoney(j) && players[j].subtotalBet < currentBetAmount) {
					can_break = false;
					break;
				}
			}
		}
		if (incrementBettorIndex) {
			currentBettorIndex = Poker.getNextPlayerPosition(currentBettorIndex, 1);
		}
		if (can_break) {
			console.log("ready_for_next_card, 999 * global_speed");
		} else {
			console.log("main, 999 * global_speed");
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
