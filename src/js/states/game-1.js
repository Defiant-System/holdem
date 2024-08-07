
State["pre-flop"] = {
		buttonIndex: 0,
		currentBetAmount: 10,
		deck: {
			cards: "c8 h10 s12 h12 d2 h3 h4 d14 d11 c2 "+
					"c11 c12 c4 d12 h8 h6 s2 s14 s5 c7 "+
					"d13 c13 d7 d5 c9 h2 c6 s4 s3 d9 s6 "+
					"h11 h13 c14 c10 s8 s10 s7 h7 d4 d3 "+
					"s13 d8 d6 h5 h9 d10 c3 c5 s11 s9 h14",
			index: 2,
		},
		players: {
			"0": { bankroll: 500, name: "Hakan", cardA: "h5", cardB: "c14", totalBet: 0, subtotalBet: 0, },
			"1": { bankroll: 495, name: "Nina", cardA: "c6", cardB: "s5", totalBet: 5, subtotalBet: 5, },
			"2": { bankroll: 490, name: "Jenny", cardA: "c5", cardB: "h4", totalBet: 10, subtotalBet: 10, },
			"5": { bankroll: 500, name: "Daniel", cardA: "c2", cardB: "d7", totalBet: 0, subtotalBet: 0, },
			// "5": { bankroll: 500, name: "Daniel", cardA: "d14", cardB: "s13", totalBet: 0, subtotalBet: 0 },
		},
	};


State["post-flop"] = {
		buttonIndex: 0,
		currentBetAmount: 0,
		deck: {
			cards: "c8 h10 s12 h12 d2 h3 h4 d14 d11 c2 "+
					"c11 c12 c4 d12 h8 h6 s2 s14 s5 c7 "+
					"d13 c13 d7 d5 c9 h2 c6 s4 s3 d9 s6 "+
					"h11 h13 c14 c10 s8 s10 s7 h7 d4 d3 "+
					"s13 d8 d6 h5 h9 d10 c3 c5 s11 s9 h14",
			index: 2,
		},
		players: {
			"0": { bankroll: 500, name: "Hakan", cardA: "h5", cardB: "c14", totalBet: 0, subtotalBet: 0 },
			"1": { bankroll: 495, name: "Nina", cardA: "c6", cardB: "s5", totalBet: 5, subtotalBet: 5, },
			"2": { bankroll: 490, name: "Jenny", cardA: "c5", cardB: "h4", totalBet: 10, subtotalBet: 10, },
			"5": { bankroll: 500, name: "Daniel", cardA: "c2", cardB: "d7", totalBet: 0, subtotalBet: 0 },
			// "5": { bankroll: 500, name: "Daniel", cardA: "d14", cardB: "s13", totalBet: 0, subtotalBet: 0 },
		},
		flop: ["h10", "s9", "c11"],
	};
