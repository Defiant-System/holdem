
let StateCards = "c8 h10 s12 h12 d2 h3 h4 d14 d11 c2 "+
					"c11 c12 c4 d12 h8 h6 s2 s14 s5 c7 "+
					"d13 c13 d7 d5 c9 h2 c6 s4 s3 d9 s6 "+
					"h11 h13 c14 c10 s8 s10 s7 h7 d4 d3 "+
					"s13 d8 d6 h5 h9 d10 c3 c5 s11 s9 h14";

State["pre-flop"] = {
		buttonIndex: 0,
		currentBetAmount: 10,
		currentBettorIndex: 0,
		deck: {
			cards: StateCards,
			index: 2,
		},
		players: {
			"0": { bankroll: 500, name: "Hakan", cardA: "h5", cardB: "c14", totalBet: 0, subtotalBet: 0, },
			"6": { bankroll: 495, name: "Nina", cardA: "c6", cardB: "s5", totalBet: 0, subtotalBet: 5, },
			"7": { bankroll: 490, name: "Jenny", cardA: "c5", cardB: "h4", totalBet: 0, subtotalBet: 10, },
		},
	};

State["pre-flop-4"] = {
		buttonIndex: 5,
		currentBetAmount: 10,
		currentBettorIndex: 7,
		deck: {
			cards: StateCards,
			index: 2,
		},
		players: {
			"0": { bankroll: 500, name: "Hakan", cardA: "h5", cardB: "c14", totalBet: 0, subtotalBet: 0, },
			"5": { bankroll: 500, name: "Daniel", cardA: "c2", cardB: "d3", totalBet: 0, subtotalBet: 0, },
			"6": { bankroll: 495, name: "Nina", cardA: "c6", cardB: "s5", totalBet: 0, subtotalBet: 5, },
			"7": { bankroll: 490, name: "Jenny", cardA: "c5", cardB: "h4", totalBet: 0, subtotalBet: 10, },
			// "5": { bankroll: 500, name: "Daniel", cardA: "d14", cardB: "s13", totalBet: 0, subtotalBet: 0 },
		},
	};




State["post-flop"] = {
		pot: 30,
		buttonIndex: 0,
		currentBetAmount: 0,
		currentBettorIndex: 1,
		deck: {
			cards: StateCards,
			index: 2,
		},
		players: {
			"0": { bankroll: 490, name: "Hakan", cardA: "h5", cardB: "c14", totalBet: 10, subtotalBet: 0 },
			"1": { bankroll: 490, name: "Nina", cardA: "c6", cardB: "c2", totalBet: 10, subtotalBet: 0, },
			"2": { bankroll: 490, name: "Jenny", cardA: "c5", cardB: "h4", totalBet: 10, subtotalBet: 0, },
			// "5": { bankroll: 500, name: "Daniel", cardA: "d14", cardB: "s13", totalBet: 0, subtotalBet: 0 },
		},
		flop: ["h13", "s12", "c11"],
	};


State["post-turn"] = {
		buttonIndex: 0,
		currentBetAmount: 0,
		currentBettorIndex: 1,
		deck: {
			cards: StateCards,
			index: 2,
		},
		players: {
			"0": { bankroll: 490, name: "Hakan", cardA: "h5", cardB: "c14", totalBet: 10, subtotalBet: 0, },
			"1": { bankroll: 490, name: "Nina", cardA: "c6", cardB: "c2", totalBet: 10, subtotalBet: 0, },
			"2": { bankroll: 490, name: "Jenny", cardA: "c5", cardB: "h4", totalBet: 10, subtotalBet: 0, },
			"5": { bankroll: 500, name: "Daniel", cardA: "c2", cardB: "d7", totalBet: 0, subtotalBet: 0, status: "FOLD" },
			// "5": { bankroll: 500, name: "Daniel", cardA: "d14", cardB: "s13", totalBet: 0, subtotalBet: 0 },
		},
		flop: ["h10", "s9", "c11"],
		turn: "h12",
	};


State["post-river"] = {
		buttonIndex: 0,
		currentBetAmount: 0,
		currentBettorIndex: 1,
		deck: {
			cards: StateCards,
			index: 2,
		},
		players: {
			"0": { bankroll: 490, name: "Hakan", cardA: "c3", cardB: "c14", totalBet: 10, subtotalBet: 20, },
			"1": { bankroll: 490, name: "Nina", cardA: "h6", cardB: "c2", totalBet: 10, subtotalBet: 20, },
			"2": { bankroll: 490, name: "Jenny", cardA: "c5", cardB: "h4", totalBet: 10, subtotalBet: 0, status: "FOLD" },
			"5": { bankroll: 500, name: "Daniel", cardA: "c2", cardB: "d7", totalBet: 0, subtotalBet: 0, status: "FOLD" },
		},
		flop: ["h10", "s9", "c11"],
		turn: "h12",
		river: "h3",
	};


State["full-table"] = {
		buttonIndex: 0,
		currentBetAmount: 0,
		currentBettorIndex: 1,
		deck: {
			cards: StateCards,
			index: 2,
		},
		players: {
			"0": { bankroll: 500, name: "Hakan", cardA: "c6", cardB: "s5", totalBet: 10, subtotalBet: 0, },
			"1": { bankroll: 500, name: "Nina", cardA: "c5", cardB: "s4", totalBet: 10, subtotalBet: 0, },
			"2": { bankroll: 500, name: "Jenny", cardA: "c4", cardB: "s3", totalBet: 10, subtotalBet: 0, },
			"3": { bankroll: 500, name: "Ricardo", cardA: "c3", cardB: "s2", totalBet: 10, subtotalBet: 0, },
			"4": { bankroll: 500, name: "Mary", cardA: "c2", cardB: "d9", totalBet: 10, subtotalBet: 0, },
			"5": { bankroll: 500, name: "Ann", cardA: "h6", cardB: "d8", totalBet: 10, subtotalBet: 0, },
			"6": { bankroll: 500, name: "Jack", cardA: "h6", cardB: "d7", totalBet: 10, subtotalBet: 0, },
			"7": { bankroll: 500, name: "Daniel", cardA: "h6", cardB: "d6", totalBet: 10, subtotalBet: 0, },
		},
		flop: ["h10", "s9", "c11"],
	};

