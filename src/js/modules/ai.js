
let AI = (() => {

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
	think() {

	},
	getBet(x) {
		let n = currentBetAmount - players[x].subtotalBet;
		let b = !board[0] ? this.getPreFlopBet() : this.getPostFlopBet();
		
		if (b >= players[x].bankroll) { // ALL IN
			players[x].status = "";
		} else if (b < n) { // BET 2 SMALL
			b = 0;
			players[x].status = "fold";
		} else if (b == n) { // CALL
			players[x].status = "call";
		} else if (b > n) {
			if (b - n < currentMinRaise) { // RAISE 2 SMALL
				b = n;
				players[x].status = "call";
			} else {
				players[x].status = ""; // RAISE
			}
		}
		if (this.betFunction(x, b) == 0) {
			players[x].status = "fold";
			this.betFunction(x, 0);
		}
		// go to next player
		currentBettorIndex = Poker.getNextPlayerPosition(currentBettorIndex, 1);
		// next thing to do (!?)
		this.think();
	},
	betFunction(player_index, bet_amount) {
		
	},
	getPreFlopBet() {
		
	},
	getPostFlopBet() {
		
	}
};

return Main;

})();
