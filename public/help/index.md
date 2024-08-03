
<h1>
	<img src="~/icon.svg" style="float: left; width: 42px; margin: 3px 5px 0 0;">
	Texas Hold'em
</h1>

### Basic Gameplay

To start the game, each player is dealt 2 cards face down.
The player to the left of the dealer must bet half of the
minimum bet immediately. The next player must bet the
minimum bet. These mandatory upfront bets are called the
small and big blinds.

The player after the second blind can then choose to **call**
_(bet the minimum)_, **raise** _(bet more than the minimum)_, or
**fold** _(not play this round)_.

Betting goes around the table. It is then time for the
"**flop**". Three cards are dealt face up. These are shared
amongst all players. For example, if you have a King and
another King comes up on the flop, then you have a pair of
Kings.

After the flop, there's another round of betting. Then, a
4th shared card is dealt face up. Then more betting.
Finally, a 5th shared card is dealt followed by a round of
betting.

Any players still in the game can then show their cards.
The player with the best 5-card hand is the winner.

### Order of Hands

Only the best 5 cards play even though 7 are available to
each player. For example, if you hold a 4 and a 2 and then
the flop comes up 9,9,9,4,10...you have a full house nines
over fours.

This is a list of hands from best to worst.

<div class="hand">
	<span class="card cA"></span>
	<span class="card cK"></span>
	<span class="card cQ"></span>
	<span class="card cJ"></span>
	<span class="card c10"></span>
	<span class="name">Royal Flush</span>
	<span class="info">Ace, King, Queen, Jack, and a Ten of the same suit</span>
</div>

<div class="hand">
	<span class="card h6"></span>
	<span class="card h7"></span>
	<span class="card h8"></span>
	<span class="card h9"></span>
	<span class="card h10"></span>
	<span class="name">Straight Flush</span>
	<span class="info">Combination with five cards in a row with the same suit, that is not A-high</span>
</div>

<div class="hand">
	<span class="card hK"></span>
	<span class="card cK"></span>
	<span class="card dK"></span>
	<span class="card sK"></span>
	<span class="card c4"></span>
	<span class="name">Four of a Kind</span>
	<span class="info">Combination of 4 cards of the same rank</span>
</div>

<div class="hand">
	<span class="card h10"></span>
	<span class="card c10"></span>
	<span class="card d10"></span>
	<span class="card h7"></span>
	<span class="card c7"></span>
	<span class="name">Full House</span>
	<span class="info">Three cards of the same rank and a pair</span>
</div>

<div class="hand">
	<span class="card hQ"></span>
	<span class="card h10"></span>
	<span class="card h7"></span>
	<span class="card h6"></span>
	<span class="card h2"></span>
	<span class="name">Flush</span>
	<span class="info">Five cards of the same suit that are not in a row</span>
</div>

<div class="hand">
	<span class="card hQ"></span>
	<span class="card dJ"></span>
	<span class="card c10"></span>
	<span class="card c9"></span>
	<span class="card d8"></span>
	<span class="name">Straight</span>
	<span class="info">Five cards in a row</span>
</div>

<div class="hand">
	<span class="card h7"></span>
	<span class="card s7"></span>
	<span class="card c7"></span>
	<span class="card hQ"></span>
	<span class="card s4"></span>
	<span class="name">Three of a Kind</span>
	<span class="info">Three cards of the same rank and two cards that do not match</span>
</div>

<div class="hand">
	<span class="card c9"></span>
	<span class="card s9"></span>
	<span class="card h2"></span>
	<span class="card c2"></span>
	<span class="card c10"></span>
	<span class="name">Two Pairs</span>
	<span class="info">Combination with two different pairs</span>
</div>

<div class="hand">
	<span class="card cJ"></span>
	<span class="card dJ"></span>
	<span class="card cQ"></span>
	<span class="card d8"></span>
	<span class="card h4"></span>
	<span class="name">One Pair</span>
	<span class="info">Two cards with the same rank and three random cards</span>
</div>

<div class="hand">
	<span class="card hA"></span>
	<span class="card s10"></span>
	<span class="card c9"></span>
	<span class="card s5"></span>
	<span class="card d2"></span>
	<span class="name">High Card</span>
	<span class="info">When all your cards are with different ranks and no combination is possible</span>
</div>



### How to Play Texas Hold 'em Poker

What's the best way to make a lot of money? There are all
kinds of theories on this, but it seems that experience is
the best thing to have. But here's some advice...Only play
a round if you really like your starting 2 cards. For
example A,K or K,K. Here's where high cards are best. If
you hold a pair of 7s, you might want to consider folding.

Other than that, be careful what you bet. Do you really
think that you have the best hand? Watch out for other
possibilities. Is someone trying for a Straight? A Flush?
Could they have Three of a Kind? A Full House??!?!!!!???.
No one ever has Four of a Kind.


<style>

.hand {
	position: relative;
	display: inline-block;
	width: 250px;
	height: 150px;
	line-height: 1.25;
	vertical-align: top;
	text-align: center;
	padding-top: 73px;

	.card {
		&:nth-child(1) { transform: translateX(40px) translateY(10px) rotate(-13deg); }
		&:nth-child(2) { transform: translateX(70px) translateY(5px) rotate(-5deg); }
		&:nth-child(3) { transform: translateX(100px) translateY(0px) rotate(0deg); }
		&:nth-child(4) { transform: translateX(130px) translateY(5px) rotate(5deg); }
		&:nth-child(5) { transform: translateX(160px) translateY(10px) rotate(13deg); }
	}

	.name {
		font-weight: 700;
		display: block;
	}

	.info {
		display: block;
		font-size: 12px;
		font-style: italic;
		padding: 2px 31px 0;
	}
}

.card {
	position: absolute;
	top: 0;
	left: 0;
	width: 45px;
	height: 61px;
	border-radius: 3px;
	background: 50% 50%/contain no-repeat;
	box-shadow: 0 0 0 1px #11111111,
				0 2px 5px #00000022;

	&.sA	{ background-image: url(~/icons/sA.png), url(~/icons/spades-front.png); }
	&.s2	{ background-image: url(~/icons/s2.png), url(~/icons/spades-front.png); }
	&.s3	{ background-image: url(~/icons/s3.png), url(~/icons/spades-front.png); }
	&.s4	{ background-image: url(~/icons/s4.png), url(~/icons/spades-front.png); }
	&.s5	{ background-image: url(~/icons/s5.png), url(~/icons/spades-front.png); }
	&.s6	{ background-image: url(~/icons/s6.png), url(~/icons/spades-front.png); }
	&.s7	{ background-image: url(~/icons/s7.png), url(~/icons/spades-front.png); }
	&.s8	{ background-image: url(~/icons/s8.png), url(~/icons/spades-front.png); }
	&.s9	{ background-image: url(~/icons/s9.png), url(~/icons/spades-front.png); }
	&.s10	{ background-image: url(~/icons/s10.png), url(~/icons/spades-front.png); }
	&.sJ	{ background-image: url(~/icons/sJ.png); }
	&.sQ	{ background-image: url(~/icons/sQ.png); }
	&.sK	{ background-image: url(~/icons/sK.png); }

	&.hA	{ background-image: url(~/icons/hA.png), url(~/icons/hearts-front.png); }
	&.h2	{ background-image: url(~/icons/h2.png), url(~/icons/hearts-front.png); }
	&.h3	{ background-image: url(~/icons/h3.png), url(~/icons/hearts-front.png); }
	&.h4	{ background-image: url(~/icons/h4.png), url(~/icons/hearts-front.png); }
	&.h5	{ background-image: url(~/icons/h5.png), url(~/icons/hearts-front.png); }
	&.h6	{ background-image: url(~/icons/h6.png), url(~/icons/hearts-front.png); }
	&.h7	{ background-image: url(~/icons/h7.png), url(~/icons/hearts-front.png); }
	&.h8	{ background-image: url(~/icons/h8.png), url(~/icons/hearts-front.png); }
	&.h9	{ background-image: url(~/icons/h9.png), url(~/icons/hearts-front.png); }
	&.h10	{ background-image: url(~/icons/h10.png), url(~/icons/hearts-front.png); }
	&.hJ	{ background-image: url(~/icons/hJ.png); }
	&.hQ	{ background-image: url(~/icons/hQ.png); }
	&.hK	{ background-image: url(~/icons/hK.png); }

	&.dA	{ background-image: url(~/icons/dA.png), url(~/icons/diamonds-front.png); }
	&.d2	{ background-image: url(~/icons/d2.png), url(~/icons/diamonds-front.png); }
	&.d3	{ background-image: url(~/icons/d3.png), url(~/icons/diamonds-front.png); }
	&.d4	{ background-image: url(~/icons/d4.png), url(~/icons/diamonds-front.png); }
	&.d5	{ background-image: url(~/icons/d5.png), url(~/icons/diamonds-front.png); }
	&.d6	{ background-image: url(~/icons/d6.png), url(~/icons/diamonds-front.png); }
	&.d7	{ background-image: url(~/icons/d7.png), url(~/icons/diamonds-front.png); }
	&.d8	{ background-image: url(~/icons/d8.png), url(~/icons/diamonds-front.png); }
	&.d9	{ background-image: url(~/icons/d9.png), url(~/icons/diamonds-front.png); }
	&.d10	{ background-image: url(~/icons/d10.png), url(~/icons/diamonds-front.png); }
	&.dJ	{ background-image: url(~/icons/dJ.png); }
	&.dQ	{ background-image: url(~/icons/dQ.png); }
	&.dK	{ background-image: url(~/icons/dK.png); }

	&.cA	{ background-image: url(~/icons/cA.png), url(~/icons/clubs-front.png); }
	&.c2	{ background-image: url(~/icons/c2.png), url(~/icons/clubs-front.png); }
	&.c3	{ background-image: url(~/icons/c3.png), url(~/icons/clubs-front.png); }
	&.c4	{ background-image: url(~/icons/c4.png), url(~/icons/clubs-front.png); }
	&.c5	{ background-image: url(~/icons/c5.png), url(~/icons/clubs-front.png); }
	&.c6	{ background-image: url(~/icons/c6.png), url(~/icons/clubs-front.png); }
	&.c7	{ background-image: url(~/icons/c7.png), url(~/icons/clubs-front.png); }
	&.c8	{ background-image: url(~/icons/c8.png), url(~/icons/clubs-front.png); }
	&.c9	{ background-image: url(~/icons/c9.png), url(~/icons/clubs-front.png); }
	&.c10	{ background-image: url(~/icons/c10.png), url(~/icons/clubs-front.png); }
	&.cJ	{ background-image: url(~/icons/cJ.png); }
	&.cQ	{ background-image: url(~/icons/cQ.png); }
	&.cK	{ background-image: url(~/icons/cK.png); }
}

</style>
