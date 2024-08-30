
let Hands = (() => {

let Main = {
	init() {
		
	},
	getWinners(players) {
		// test & compare
		let winners;
		let tests = Object.keys(Test);
		for (var i=0; i<tests.length; i++) {
			winners = this.winnersHelper(players, tests[i]);
			if (winners) break;
		}
		return winners;
	},
	winnersHelper(players, test) {
		let best;
		let winners = new Array(players.length);
		for (let i=0; i<players.length; i++) {
			// Busted or folded
			if (!players[i]) continue;
			
			let a = Test[test](players[i]);
			let num_needed = a["num_needed"];
			if (num_needed > 0 || (num_needed == 0 && num_needed != "0")) continue;
			
			if (typeof best === "undefined") {
				best = a;
				winners = new Array(players.length); // intentional ? zorro
				winners[i] = a;
			} else {
				let comp = Compare[test](a, best);
				if (comp == "a") { // a won
					best = a;
					winners = new Array(players.length); // intentional ? zorro
					winners[i] = a;
				} else if (comp == "b") { // 'best' is still  best
				} else if (comp == "c") { // A draw, add as a winner
					winners[i] = a;
				}
			}
		}
		for (let i=0; i<winners.length; i++) {
			if (winners[i]) return winners;
		}
		return null;
	}
};


let Test = {
	straightFlush(player) {
		let cards = Utils.groupCards(player);
		let suit = Utils.getPredominantSuit(cards);
		let workingCards = new Array(8);
		let workingIndex = 0;
		for (let i=0; i<7; i++) {
			if (Utils.getSuit(cards[i]) == suit) {
				let rank = Utils.getRank(cards[i]);
				workingCards[workingIndex++] = rank;
				if (rank == 14) workingCards[7] = 1; // ace==1 too
			}
		}
		for (let i=0; i<workingCards.length; i++) {
			if (workingCards[i] == null) workingCards[i] = -1; // FF
		}
		workingCards.sort(Utils.compNum);
		let absoluteLongestStretch = 0;
		let absoluteHighCard = 0;
		let currentLongestStretch = 1;
		let currentHighCard = 0;
		for (let i=0; i<8; i++) {
			let a = workingCards[i];
			let b = workingCards[i + 1];
			if (a && b && a - b == 1) {
				currentLongestStretch++;
				if (currentHighCard < 1) currentHighCard = a;
			} else if (a) {
				if (currentLongestStretch > absoluteLongestStretch) {
					absoluteLongestStretch = currentLongestStretch;
					if (currentHighCard < 1) currentHighCard = a;
					absoluteHighCard = currentHighCard;
				}
				currentLongestStretch = 1;
				currentHighCard = 0;
			}
		}
		let numMine = 0;
		for (let i=0; i<absoluteLongestStretch; i++) {
			if (suit + (absoluteHighCard - i) == player.cardA || suit + (absoluteHighCard - i) == player.cardB) numMine++;
		}

		let highlight = [],
			len = 5;
		while (len--) {
			cards.filter(c => c).map(c => (c.slice(0,1) === suit && Utils.getRank(c) === absoluteHighCard - len) ? highlight.push(c) : void(0));
		}

		let hashResult = {};
		hashResult["straight_hi"] = absoluteHighCard;
		hashResult["num_needed"] = 5 - absoluteLongestStretch;
		hashResult["num_mine"] = numMine;
		hashResult["highlight"] = highlight;
		hashResult["hand_name"] = "Straight Flush";

		return hashResult;
	},
	fourOfKind(player) {
		let cards = Utils.groupCards(player);
		let ranks = new Array(13);
		for (let i=0; i<13; i++) {
			ranks[i] = 0;
		}
		for (let i=0; i < cards.length; i++) {
			ranks[Utils.getRank(cards[i]) - 2]++;
		}
		let four = "";
		let kicker = "";
		for (let i=0; i<13; i++) {
			if (ranks[i] == 4) four = i + 2;
			else if (ranks[i] > 0) kicker = i + 2;
		}
		let numMine = 0;
		if (Utils.getRank(player.cardA) == four) numMine++;
		if (Utils.getRank(player.cardB) == four) numMine++;
		
		let numNeeded = 4;
		if (four) numNeeded = 0;

		let highlight = [];
		cards.filter(c => c).map(c => {
			if (Utils.getRank(c) === four) highlight.push(c);
			if (Utils.getRank(c) === kicker) highlight.push(c);
		});

		let hashResult = {};
		hashResult["rank"] = four;
		hashResult["kicker"] = kicker;
		hashResult["num_needed"] = numNeeded;
		hashResult["num_mine"] = numMine;
		hashResult["highlight"] = highlight;
		hashResult["hand_name"] = "Four of a Kind";

		return hashResult;
	},
	fullHouse(player) {
		let cards = Utils.groupCards(player);
		let ranks = new Array(13);
		for (let i=0; i<13; i++) {
			ranks[i] = 0;
		}
		for (let i=0; i<cards.length; i++) {
			ranks[Utils.getRank(cards[i]) - 2]++;
		}
		let three = "";
		let two = "";
		for (let i=0; i<13; i++) {
			if (ranks[i] == 3) {
				if (three > two) two = three;
				three = i + 2;
			} else if (ranks[i] == 2) {
				two = i + 2;
			}
		}
		let numNeeded = 5;
		let majorRank = "";
		let numMineMajor = 0;
		if (three) {
			numNeeded -= 3;
			majorRank = three;
			if (Utils.getRank(player.cardA) == three) numMineMajor += 1;
			if (Utils.getRank(player.cardB) == three) numMineMajor += 1;
		}

		let hashResult = {};
		hashResult["major_rank"] = majorRank;
		hashResult["num_mine_major"] = numMineMajor;

		let minorRank = "";
		let numMineMinor = 0;
		if (two) {
			numNeeded -= 2;
			minorRank = two;
			if (Utils.getRank(player.cardA) == two) numMineMinor += 1;
			if (Utils.getRank(player.cardB) == two) numMineMinor += 1;
		}

		let highlight = [];
		cards.filter(c => c).map(c => {
			if (Utils.getRank(c) === minorRank) highlight.push(c);
			if (Utils.getRank(c) === majorRank) highlight.push(c);
		});

		hashResult["minor_rank"] = minorRank;
		hashResult["num_mine_minor"] = numMineMinor;
		hashResult["num_mine"] = numMineMinor + numMineMajor;
		hashResult["num_needed"] = numNeeded;
		hashResult["highlight"] = highlight;
		hashResult["hand_name"] = "Full House";

		return hashResult;
	},
	flush(player) {
		let cards = Utils.groupCards(player);
		let suit = Utils.getPredominantSuit(cards);
		let workingCards = new Array(7);
		let workingIndex = 0;
		let numInFlush = 0;
		for (let i=0; i<cards.length; i++) {
			if (Utils.getSuit(cards[i]) == suit) {
				numInFlush++;
				workingCards[workingIndex++] = Utils.getRank(cards[i]);
			}
		}
		for (let i=0; i<workingCards.length; i++) {
			if (workingCards[i] == null) {
				workingCards[i] = -1; // FF
			}
		}
		workingCards.sort(Utils.compNum);

		let hashResult = {};
		let numMine = 0;
		for (let i=0; i<5; i++) {
			let s = workingCards[i];
			if (!s) s = "";
			hashResult["flush_" + i] = s;
			if (suit + workingCards[i] == player.cardA || suit + workingCards[i] == player.cardB) numMine++;
		}

		let highlight = [],
			len = 5;
		while (len--) {
			cards.filter(c => c).map(c => (c.slice(0,1) === suit && Utils.getRank(c) === hashResult["flush_"+ len]) ? highlight.push(c) : void(0));
		}

		hashResult["num_needed"] = 5 - numInFlush;
		hashResult["num_mine"] = numMine;
		hashResult["suit"] = suit;
		hashResult["highlight"] = highlight;
		hashResult["hand_name"] = "Flush";
		
		return hashResult;
	},
	straight(player) {
		let cards = Utils.groupCards(player);
		let workingCards = new Array(8);
		let ranks = new Array(13);
		for (let i=0; i<7; i++) {
			let rank = Utils.getRank(cards[i]);
			if (ranks[rank - 2]) continue;
			else ranks[rank - 2] = 1;
			workingCards[i] = rank;
			if (rank == 14) {
				workingCards[7] = 1; // ace==1 too
			}
		}
		for (let i=0; i<workingCards.length; i++) {
			if (workingCards[i] == null) {
				workingCards[i] = -1; // FF
			}
		}
		workingCards.sort(Utils.compNum);
		let absoluteLongestStretch = 0;
		let absoluteHighCard = 0;
		let currentLongestStretch = 1;
		let currentHighCard = 0;
		for (let i=0; i<8; i++) {
			let a = workingCards[i];
			let b = workingCards[i + 1];
			if (a && b && a - b == 1) {
				currentLongestStretch++;
				if (currentHighCard < 1) {
					currentHighCard = a;
				}
			} else if (a) {
				if (currentLongestStretch > absoluteLongestStretch) {
					absoluteLongestStretch = currentLongestStretch;
					if (currentHighCard < 1) {
						currentHighCard = a;
					}
					absoluteHighCard = currentHighCard;
				}
				currentLongestStretch = 1;
				currentHighCard = 0;
			}
		}
		let numMine = 0;
		for (let i=0; i<absoluteLongestStretch; i++) {
			if (absoluteHighCard - i == Utils.getRank(player.cardA) ||
				absoluteHighCard - i == Utils.getRank(player.cardB)) {
				numMine++;
			}
		}

		let highlight = [],
			len = 5;
		while (len--) {
			cards.filter(c => c).map(c => (Utils.getRank(c) === absoluteHighCard - len) ? highlight.push(c) : void(0));
		}

		let hashResult = {};
		hashResult["straight_hi"] = absoluteHighCard;
		hashResult["num_needed"] = 5 - absoluteLongestStretch;
		hashResult["num_mine"] = numMine;
		hashResult["highlight"] = highlight;
		hashResult["hand_name"] = "Straight";

		return hashResult;
	},
	threeOfKind(player) {
		let cards = Utils.groupCards(player);
		let ranks = new Array(13);
		for (let i=0; i<13; i++) {
			ranks[i] = 0;
		}
		for (let i=0; i<cards.length; i++) {
			ranks[Utils.getRank(cards[i]) - 2]++;
		}
		let three = "";
		let kicker1 = "";
		let kicker2 = "";
		for (let i=0; i<13; i++) {
			if (ranks[i] == 3) {
				three = i + 2;
			} else if (ranks[i] == 1) {
				kicker2 = kicker1;
				kicker1 = i + 2;
			} else if (ranks[i] > 1) {
				kicker1 = i + 2;
				kicker2 = i + 2;
			}
		}
		let numMine = 0;
		if (Utils.getRank(player.cardA) == three) numMine++;
		if (Utils.getRank(player.cardB) == three) numMine++;

		let numNeeded = 3;
		if (three) numNeeded = 0;

		let highlight = [];
		cards.filter(c => c).map(c => {
			if (Utils.getRank(c) === three) highlight.push(c);
			if (Utils.getRank(c) === kicker1) highlight.push(c);
			if (Utils.getRank(c) === kicker2) highlight.push(c);
		});

		let hashResult = {};
		hashResult["rank"] = three;
		hashResult["num_needed"] = numNeeded;
		hashResult["num_mine"] = numMine;
		hashResult["kicker_1"] = kicker1;
		hashResult["kicker_2"] = kicker2;
		hashResult["highlight"] = highlight;
		hashResult["hand_name"] = "Three of a Kind";

		return hashResult;
	},
	twoPair(player) {
		let cards = Utils.groupCards(player);
		let ranks = new Array(13);
		for (let i=0; i<13; i++) ranks[i] = 0;
		for (let i=0; i<cards.length; i++) ranks[Utils.getRank(cards[i]) - 2]++;
		let first = "";
		let second = "";
		let kicker = "";
		for (let i=12; i>-1; i--) {
			if (ranks[i] == 2) {
				if (!first) {
					first = i + 2;
				} else if (!second) {
					second = i + 2;
				} else if (!kicker) {
					kicker = i + 2;
				} else {
					break;
				}
			} else if (!kicker && ranks[i] > 0) {
				kicker = i + 2;
			}
		}
		let numMine = 0;
		if (Utils.getRank(player.cardA) == first || Utils.getRank(player.cardA) == second) numMine++;
		if (Utils.getRank(player.cardB) == first || Utils.getRank(player.cardB) == second) numMine++;
		
		let numNeeded = 2;
		if (second) numNeeded = 0;
		else if (first) numNeeded = 1;
		else numNeeded = 2;

		let highlight = [];
		cards.filter(c => c).map(c => {
			if (Utils.getRank(c) === first) highlight.push(c);
			if (Utils.getRank(c) === second) highlight.push(c);
			if (Utils.getRank(c) === kicker) highlight.push(c);
		});

		let hashResult = {};
		hashResult["rank_1"] = first;
		hashResult["rank_2"] = second;
		hashResult["num_needed"] = numNeeded;
		hashResult["num_mine"] = numMine;
		hashResult["kicker"] = kicker;
		hashResult["highlight"] = highlight;
		hashResult["hand_name"] = "Two Pair";

		return hashResult;
	},
	onePair(player) {
		let cards = Utils.groupCards(player);
		let ranks = new Array(13);
		for (let i=0; i<13; i++) {
			ranks[i] = 0;
		}
		for (let i=0; i<cards.length; i++) {
			ranks[Utils.getRank(cards[i]) - 2]++;
		}
		let pair = 0;
		let kicker1 = "";
		let kicker2 = "";
		let kicker3 = "";
		for (let i=0; i<13; i++) {
			if (ranks[i] == 2) {
				pair = i + 2;
			} else if (ranks[i] == 1) {
				kicker3 = kicker2;
				kicker2 = kicker1;
				kicker1 = i + 2;
			} else if (ranks[i] > 2) {
				kicker1 = i + 2;
				kicker2 = i + 2;
				kicker3 = i + 2;
			}
		}
		let numMine = 0;
		if (Utils.getRank(player.cardA) == pair) numMine++;
		if (Utils.getRank(player.cardB) == pair) numMine++;
		let numNeeded = 1;
		if (pair) numNeeded = 0;
		
		let highlight = [];
		cards.filter(c => c).map(c => {
			if (Utils.getRank(c) === pair) highlight.push(c);
			if (Utils.getRank(c) === kicker1) highlight.push(c);
			if (Utils.getRank(c) === kicker2) highlight.push(c);
			if (Utils.getRank(c) === kicker3) highlight.push(c);
		});

		let hashResult = {};
		hashResult["rank"] = pair;
		hashResult["num_needed"] = numNeeded;
		hashResult["num_mine"] = numMine;
		hashResult["kicker_1"] = kicker1;
		hashResult["kicker_2"] = kicker2;
		hashResult["kicker_3"] = kicker3;
		hashResult["highlight"] = highlight;
		hashResult["hand_name"] = "One Pair";

		return hashResult;
	},
	hiCard(player) {
		let cards = Utils.groupCards(player);
		let workingCards = new Array(cards.length);
		for (let i=0; i<workingCards.length; i++) {
			workingCards[i] = Utils.getRank(cards[i]);
		}
		for (let i=0; i<workingCards.length; i++) {
			if (workingCards[i] == null) {
				workingCards[i] = -1; // FF
			}
		}
		workingCards.sort(Utils.compNum);

		let hashResult = {};
		for (let i=0; i<5; i++) {
			if (!workingCards[i]) {
				workingCards[i] = "";
			}
			hashResult["hi_card_"+ i] = workingCards[i];
		}

		let highlight = [];
		cards.filter(c => c).map(c => {
			if (Utils.getRank(c) === workingCards[0]) highlight.push(c);
			if (Utils.getRank(c) === workingCards[1]) highlight.push(c);
			if (Utils.getRank(c) === workingCards[2]) highlight.push(c);
			if (Utils.getRank(c) === workingCards[3]) highlight.push(c);
			if (Utils.getRank(c) === workingCards[4]) highlight.push(c);
		});

		hashResult["num_needed"] = 0;
		hashResult["highlight"] = highlight;
		hashResult["hand_name"] = "High Card";

		return hashResult;
	}
};

let Compare = {
	straightFlush(a, b) {
		return Compare.straight(a, b);
	},
	fourOfKind(a, b) {
		let rank_a = a["rank"];
		let rank_b = b["rank"];
		if (rank_a > rank_b) return "a";
		else if (rank_b > rank_a) return "b";
		else {
			let kicker_a = a["kicker"];
			let kicker_b = b["kicker"];
			if (kicker_a > kicker_b) return "a";
			else if (kicker_b > kicker_a) return "b";
			else return "c";
		}
	},
	fullHouse(a, b) {
		let major_a = a["major_rank"];
		let major_b = b["major_rank"];
		if (major_a > major_b) return "a";
		else if (major_b > major_a) return "b";
		else {
			let minor_a = a["minor_rank"];
			let minor_b = b["minor_rank"];
			if (minor_a > minor_b) return "a";
			else if (minor_b > minor_a) return "b";
			else return "c";
		}
	},
	flush(a, b) {
		for (let i=0; i<5; i++) {
			let flush_a = a["flush_"+ i];
			let flush_b = b["flush_"+ i];
			if (flush_a > flush_b) return "a";
			else if (flush_b > flush_a) return "b";
		}
		return "c";
	},
	straight(a, b) {
		let hi_a = a["straight_hi"];
		let hi_b = b["straight_hi"];
		if (hi_a > hi_b) return "a";
		else if (hi_b > hi_a) return "b";
		else return "c";
	},
	threeOfKind(a, b) {
		let rank_a = a["rank"];
		let rank_b = b["rank"];
		if (rank_a > rank_b) return "a";
		if (rank_b > rank_a) return "b";

		let kicker_a = a["kicker_1"];
		let kicker_b = b["kicker_1"];
		if (kicker_a > kicker_b) return "a";
		if (kicker_b > kicker_a) return "b";

		kicker_a = a["kicker_2"];
		kicker_b = b["kicker_2"];
		if (kicker_a > kicker_b) return "a";
		if (kicker_b > kicker_a) return "b";

		return "c";
	},
	twoPair(a, b) {
		let rank_a = a["rank_1"];
		let rank_b = b["rank_1"];
		if (rank_a > rank_b) return "a";
		if (rank_b > rank_a) return "b";

		rank_a = a["rank_2"];
		rank_b = b["rank_2"];
		if (rank_a > rank_b) return "a";
		if (rank_b > rank_a) return "b";

		let kicker_a = a["kicker"];
		let kicker_b = b["kicker"];
		if (kicker_a > kicker_b) return "a";
		if (kicker_b > kicker_a) return "b";

		return "c";
	},
	onePair(a, b) {
		let rank_a = a["rank"];
		let rank_b = b["rank"];
		if (rank_a > rank_b) return "a";
		if (rank_b > rank_a) return "b";

		let kicker_a = a["kicker_1"];
		let kicker_b = b["kicker_1"];
		if (kicker_a > kicker_b) return "a";
		if (kicker_b > kicker_a) return "b";

		kicker_a = a["kicker_2"];
		kicker_b = b["kicker_2"];
		if (kicker_a > kicker_b) return "a";
		if (kicker_b > kicker_a) return "b";

		kicker_a = a["kicker_3"];
		kicker_b = b["kicker_3"];
		if (kicker_a > kicker_b) return "a";
		if (kicker_b > kicker_a) return "b";

		return "c";
	},
	hiCard(a, b) {
		for (let i = 0; i < 5; i++) {
			let hi_a = a["hi_card_"+ i];
			let hi_b = b["hi_card_"+ i];
			if (hi_a > hi_b) return "a";
			if (hi_b > hi_a) return "b";
		}
		return "c";
	}
};

let Utils = {
	getSuit(card) {
		return card ? card.substring(0, 1) : "";
	},
	getRank(card) {
		return card ? card.substring(1) - 0 : "";
	},
	getPredominantSuit(cards) {
		let suitCount = [0, 0, 0, 0];
		for (let i=0, il=cards.length; i<il; i++) {
			let s = this.getSuit(cards[i]);
			if (s == "c") suitCount[0]++;
			else if (s == "s") suitCount[1]++;
			else if (s == "h") suitCount[2]++;
			else if (s == "d") suitCount[3]++;
		}
		let suitIndex = 0;
		if (suitCount[1] > suitCount[suitIndex]) suitIndex = 1;
		if (suitCount[2] > suitCount[suitIndex]) suitIndex = 2;
		if (suitCount[3] > suitCount[suitIndex]) suitIndex = 3;
		if (suitIndex == 0) return "c";
		if (suitIndex == 1) return "s";
		if (suitIndex == 2) return "h";
		if (suitIndex == 3) return "d";
		return "";
	},
	groupCards(player) {
		let board = window.find(".board .card").map(c => c.getAttribute("data-value"));
		let c = new Array(7);
		for (let i = 0; i < 5; i++) {
			c[i] = board[i];
		}
		c[5] = player.cardA;
		c[6] = player.cardB;
		return c;
	},
	compNum(a, b) {
		return b - a;
	}
};

	return { ...Main, ...Utils, test: Test, compare: Compare };
})();
