
let StateCards = "c8 h10 s12 h12 d2 h3 h4 d14 d11 c2 "+
					"c11 c12 c4 d12 h8 h6 s2 s14 s5 c7 "+
					"d13 c13 d7 d5 c9 h2 c6 s4 s3 d9 s6 "+
					"h11 h13 c14 c10 s8 s10 s7 h7 d4 d3 "+
					"s13 d8 d6 h5 h9 d10 c3 c5 s11 s9 h14";

State["over-jenny-wins"] = {
		pot: 20,
		buttonIndex: 0,
		currentBetAmount: 0,
		currentBettorIndex: 3,
		deck: {
			cards: StateCards,
			index: 2,
		},
		players: {
			"0": { bankroll: 500, name: ME.firstName, cardA: "h5", cardB: "c14", totalBet: 0, subtotalBet: 0, status: "FOLD", },
			"1": { bankroll: 595, name: "Nina", cardA: "c6", cardB: "s5", totalBet: 0, subtotalBet: 10, status: "FOLD", },
			"3": { bankroll: 490, name: "Jenny", cardA: "c4", cardB: "c12", totalBet: 0, subtotalBet: 10, status: "WINNER" },
		},
		flop: ["h13", "s12", "c11"],
	};

State["pre-flop-2-bots"] = {
		buttonIndex: 1,
		currentBetAmount: 10,
		currentBettorIndex: 1,
		deck: {
			cards: StateCards,
			index: 2,
		},
		players: {
			"1": { bankroll: 495, name: "Nina", cardA: "h5", cardB: "c14", totalBet: 0, subtotalBet: 5, },
			"3": { bankroll: 490, name: "Jenny", cardA: "c4", cardB: "c12", totalBet: 0, subtotalBet: 10, },
		},
	};

State["pre-flop-single"] = {
		buttonIndex: 0,
		currentBetAmount: 10,
		currentBettorIndex: 0,
		deck: {
			cards: StateCards,
			index: 2,
		},
		players: {
			"0": { bankroll: 90, name: ME.firstName, cardA: "h5", cardB: "c11", totalBet: 0, subtotalBet: 5, },
			"3": { bankroll: 490, name: "Jenny", cardA: "c4", cardB: "c14", totalBet: 0, subtotalBet: 10, },
		},
	};

State["pre-flop"] = {
		buttonIndex: 0,
		currentBetAmount: 10,
		currentBettorIndex: 1,
		deck: {
			cards: StateCards,
			index: 2,
		},
		players: {
			"0": { bankroll: 295, name: ME.firstName, cardA: "h5", cardB: "c14", totalBet: 0, subtotalBet: 5, },
			"1": { bankroll: 290, name: "Nina", cardA: "c6", cardB: "s5", totalBet: 0, subtotalBet: 10, },
			// "3": { bankroll: 490, name: "Jenny", cardA: "c4", cardB: "c12", totalBet: 0, subtotalBet: 10, },
			// "5": { bankroll: 0, name: "Daniel", status: "BUST", },
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
			"0": { bankroll: 500, name: ME.firstName, cardA: "h5", cardB: "c14", totalBet: 0, subtotalBet: 0, },
			"5": { bankroll: 500, name: "Daniel", cardA: "c2", cardB: "d3", totalBet: 0, subtotalBet: 0, },
			"6": { bankroll: 495, name: "Nina", cardA: "c6", cardB: "s5", totalBet: 0, subtotalBet: 5, },
			"7": { bankroll: 490, name: "Jenny", cardA: "c5", cardB: "h4", totalBet: 0, subtotalBet: 10, },
			// "5": { bankroll: 500, name: "Daniel", cardA: "d14", cardB: "s13", totalBet: 0, subtotalBet: 0 },
		},
	};

State["post-flop"] = {
		pot: 20,
		buttonIndex: 0,
		currentBetAmount: 10,
		currentBettorIndex: 0,
		deck: {
			cards: StateCards,
			index: 2,
		},
		players: {
			"0": { bankroll: 490, name: ME.firstName, cardA: "h5", cardB: "c14", totalBet: 10, subtotalBet: 0 },
			"1": { bankroll: 490, name: "Nina", cardA: "c6", cardB: "c2", totalBet: 10, subtotalBet: 10, },
			// "2": { bankroll: 490, name: "Jenny", cardA: "c5", cardB: "h4", totalBet: 10, subtotalBet: 0, },
			// "5": { bankroll: 500, name: "Daniel", cardA: "d14", cardB: "s13", totalBet: 0, subtotalBet: 0 },
		},
		flop: ["h13", "s12", "c11"],
	};

State["post-turn"] = {
		pot: 130,
		buttonIndex: 0,
		currentBetAmount: 0,
		currentBettorIndex: 2,
		deck: {
			cards: StateCards,
			index: 2,
		},
		players: {
			"0": { bankroll: 120, name: ME.firstName, cardA: "s11", cardB: "c14", totalBet: 10, subtotalBet: 0, },
			"2": { bankroll: 390, name: "Jenny", cardA: "c10", cardB: "d10", totalBet: 10, subtotalBet: 0, },
		},
		flop: ["h10", "s9", "c11"],
		turn: "h12",
	};

State["post-river-high-card"] = {
		buttonIndex: 0,
		currentBetAmount: 0,
		currentBettorIndex: 1,
		deck: {
			cards: StateCards,
			index: 2,
		},
		players: {
			"0": { bankroll: 490, name: ME.firstName, cardA: "c7", cardB: "c4", totalBet: 10, subtotalBet: 20, },
			"1": { bankroll: 490, name: "Nina", cardA: "h6", cardB: "c2", totalBet: 10, subtotalBet: 20, },
			"2": { bankroll: 490, name: "Jenny", cardA: "c5", cardB: "h4", totalBet: 10, subtotalBet: 0, status: "FOLD" },
			"5": { bankroll: 500, name: "Daniel", cardA: "c2", cardB: "d7", totalBet: 0, subtotalBet: 0, status: "FOLD" },
		},
		flop: ["h10", "s9", "c11"],
		turn: "h12",
		river: "h3",
	};

State["post-river-one-pair"] = {
		pot: 110,
		buttonIndex: 0,
		currentBetAmount: 0,
		currentBettorIndex: 1,
		deck: {
			cards: StateCards,
			index: 2,
		},
		players: {
			"0": { bankroll: 490, name: ME.firstName, cardA: "c3", cardB: "c7", totalBet: 55, subtotalBet: 0, },
			"1": { bankroll: 290, name: "Nina", cardA: "h13", cardB: "c2", totalBet: 55, subtotalBet: 0, },
			// "2": { bankroll: 490, name: "Jenny", cardA: "c5", cardB: "h4", totalBet: 10, subtotalBet: 0, status: "FOLD" },
			// "5": { bankroll: 500, name: "Daniel", cardA: "c2", cardB: "d7", totalBet: 0, subtotalBet: 0, status: "FOLD" },
		},
		flop: ["h10", "s9", "c11"],
		turn: "h8",
		// river: "h3",
	};

State["post-river-two-pair"] = {
		buttonIndex: 0,
		currentBetAmount: 0,
		currentBettorIndex: 1,
		deck: {
			cards: StateCards,
			index: 2,
		},
		players: {
			"0": { bankroll: 490, name: ME.firstName, cardA: "c3", cardB: "c14", totalBet: 10, subtotalBet: 20, },
			"1": { bankroll: 490, name: "Nina", cardA: "h6", cardB: "c2", totalBet: 10, subtotalBet: 20, },
			"2": { bankroll: 490, name: "Jenny", cardA: "c5", cardB: "h4", totalBet: 10, subtotalBet: 0, status: "FOLD" },
			"5": { bankroll: 500, name: "Daniel", cardA: "c2", cardB: "d7", totalBet: 0, subtotalBet: 0, status: "FOLD" },
		},
		flop: ["h14", "s9", "c11"],
		turn: "h12",
		river: "h3",
	};

State["post-river-three"] = {
		buttonIndex: 0,
		currentBetAmount: 0,
		currentBettorIndex: 1,
		deck: {
			cards: StateCards,
			index: 2,
		},
		players: {
			"0": { bankroll: 490, name: ME.firstName, cardA: "c3", cardB: "d3", totalBet: 10, subtotalBet: 20, },
			"1": { bankroll: 490, name: "Nina", cardA: "h6", cardB: "c2", totalBet: 10, subtotalBet: 20, },
			"2": { bankroll: 490, name: "Jenny", cardA: "c5", cardB: "h4", totalBet: 10, subtotalBet: 0, status: "FOLD" },
			"5": { bankroll: 500, name: "Daniel", cardA: "c2", cardB: "d7", totalBet: 0, subtotalBet: 0, status: "FOLD" },
		},
		flop: ["h14", "s9", "c11"],
		turn: "h12",
		river: "h3",
	};

State["post-river-straight"] = {
		buttonIndex: 0,
		currentBetAmount: 0,
		currentBettorIndex: 1,
		deck: {
			cards: StateCards,
			index: 2,
		},
		players: {
			"0": { bankroll: 490, name: ME.firstName, cardA: "c8", cardB: "d10", totalBet: 10, subtotalBet: 20, },
			"1": { bankroll: 490, name: "Nina", cardA: "h6", cardB: "c2", totalBet: 10, subtotalBet: 20, },
			"2": { bankroll: 490, name: "Jenny", cardA: "c5", cardB: "h4", totalBet: 10, subtotalBet: 0, status: "FOLD" },
			"5": { bankroll: 500, name: "Daniel", cardA: "c2", cardB: "d7", totalBet: 0, subtotalBet: 0, status: "FOLD" },
		},
		flop: ["h14", "s9", "c11"],
		turn: "h12",
		river: "h3",
	};

State["post-river-flush"] = {
		buttonIndex: 0,
		currentBetAmount: 0,
		currentBettorIndex: 1,
		deck: {
			cards: StateCards,
			index: 2,
		},
		players: {
			"0": { bankroll: 490, name: ME.firstName, cardA: "h8", cardB: "h10", totalBet: 10, subtotalBet: 20, },
			"1": { bankroll: 490, name: "Nina", cardA: "h6", cardB: "c2", totalBet: 10, subtotalBet: 20, },
			"2": { bankroll: 490, name: "Jenny", cardA: "c5", cardB: "h4", totalBet: 10, subtotalBet: 0, status: "FOLD" },
			"5": { bankroll: 500, name: "Daniel", cardA: "c2", cardB: "d7", totalBet: 0, subtotalBet: 0, status: "FOLD" },
		},
		flop: ["h14", "s9", "c11"],
		turn: "h12",
		river: "h3",
	};

State["post-river-full-house"] = {
		buttonIndex: 0,
		currentBetAmount: 0,
		currentBettorIndex: 1,
		deck: {
			cards: StateCards,
			index: 2,
		},
		players: {
			"0": { bankroll: 490, name: ME.firstName, cardA: "d3", cardB: "c3", totalBet: 10, subtotalBet: 20, },
			"1": { bankroll: 490, name: "Nina", cardA: "h6", cardB: "c2", totalBet: 10, subtotalBet: 20, },
			"2": { bankroll: 490, name: "Jenny", cardA: "c5", cardB: "h4", totalBet: 10, subtotalBet: 0, status: "FOLD" },
			"5": { bankroll: 500, name: "Daniel", cardA: "c2", cardB: "d7", totalBet: 0, subtotalBet: 0, status: "FOLD" },
		},
		flop: ["d11", "s9", "c11"],
		turn: "h12",
		river: "h3",
	};

State["post-river-four"] = {
		buttonIndex: 0,
		currentBetAmount: 0,
		currentBettorIndex: 1,
		deck: {
			cards: StateCards,
			index: 2,
		},
		players: {
			"0": { bankroll: 490, name: ME.firstName, cardA: "d3", cardB: "c3", totalBet: 10, subtotalBet: 20, },
			"1": { bankroll: 490, name: "Nina", cardA: "h6", cardB: "c2", totalBet: 10, subtotalBet: 20, },
			"2": { bankroll: 490, name: "Jenny", cardA: "c5", cardB: "h4", totalBet: 10, subtotalBet: 0, status: "FOLD" },
			"5": { bankroll: 500, name: "Daniel", cardA: "c2", cardB: "d7", totalBet: 0, subtotalBet: 0, status: "FOLD" },
		},
		flop: ["d11", "s9", "s3"],
		turn: "h12",
		river: "h3",
	};

State["post-river-straight-flush"] = {
		buttonIndex: 0,
		currentBetAmount: 0,
		currentBettorIndex: 1,
		deck: {
			cards: StateCards,
			index: 2,
		},
		players: {
			"0": { bankroll: 490, name: ME.firstName, cardA: "h10", cardB: "h8", totalBet: 10, subtotalBet: 20, },
			"1": { bankroll: 490, name: "Nina", cardA: "h6", cardB: "c2", totalBet: 10, subtotalBet: 20, },
			"2": { bankroll: 490, name: "Jenny", cardA: "c5", cardB: "h4", totalBet: 10, subtotalBet: 0, status: "FOLD" },
			"5": { bankroll: 500, name: "Daniel", cardA: "c2", cardB: "d7", totalBet: 0, subtotalBet: 0, status: "FOLD" },
		},
		flop: ["h11", "h9", "s3"],
		turn: "h12",
		river: "h3",
	};

State["post-river-royal-flush"] = {
		buttonIndex: 0,
		currentBetAmount: 0,
		currentBettorIndex: 1,
		deck: {
			cards: StateCards,
			index: 2,
		},
		players: {
			"0": { bankroll: 0, name: ME.firstName, cardA: "s3", cardB: "h14", totalBet: 10, subtotalBet: 20, },
			"1": { bankroll: 0, name: "Nina", cardA: "h9", cardB: "c2", totalBet: 10, subtotalBet: 20, },
			"2": { bankroll: 0, name: "Jenny", cardA: "c5", cardB: "h4", totalBet: 10, subtotalBet: 0, status: "FOLD" },
			"5": { bankroll: 500, name: "Daniel", cardA: "c2", cardB: "d7", totalBet: 0, subtotalBet: 0, status: "FOLD" },
		},
		flop: ["h11", "h13", "h10"],
		turn: "h12",
		river: "h3",
	};

State["full-table"] = {
		pot: 100,
		buttonIndex: 0,
		currentBetAmount: 0,
		currentBettorIndex: 1,
		deck: {
			cards: StateCards,
			index: 2,
		},
		players: {
			"0": { bankroll: 500, name: ME.firstName, cardA: "c6", cardB: "s5", totalBet: 0, subtotalBet: 10, },
			"1": { bankroll: 500, name: "Nina", cardA: "c5", cardB: "s4", totalBet: 0, subtotalBet: 10, },
			"2": { bankroll: 500, name: "Jenny", cardA: "c4", cardB: "s3", totalBet: 0, subtotalBet: 10, },
			"3": { bankroll: 500, name: "Ricardo", cardA: "c3", cardB: "s2", totalBet: 0, subtotalBet: 10, },
			"4": { bankroll: 500, name: "Mary", cardA: "c2", cardB: "d9", totalBet: 0, subtotalBet: 10, },
			"5": { bankroll: 500, name: "Ann", cardA: "h6", cardB: "d8", totalBet: 0, subtotalBet: 10, },
			"6": { bankroll: 500, name: "Jack", cardA: "h6", cardB: "d7", totalBet: 0, subtotalBet: 10, },
			"7": { bankroll: 500, name: "Daniel", cardA: "h6", cardB: "d6", totalBet: 0, subtotalBet: 10, },
		},
		flop: ["h10", "s9", "c11"],
	};

