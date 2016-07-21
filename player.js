module.exports = {
  VERSION: "pokerNode v1",

  holdCards: function(game_state) {
    return game_state.players[game_state.in_action].hole_cards;
  },

  ranking: [],

  getRanking: function(game_state, callback) {
    var cards = this.holdCards(game_state).concat(game_state.community_cards);

    console.log(cards);

    if (cards.length < 5) {
      callback();
      return;
    }

    var request = require('request');
    var self = this;

    request.get({
      headers: {'content-type' : 'application/x-www-form-urlencoded'},
      url:     'http://rainman.leanpoker.org/rank',
      body:    "cards=" + JSON.stringify(cards)
    }, function(error, response, body) {
      self.ranking = body;
      console.log(body);
      callback(JSON.parse(body));
    });
  },

  bet_request: function(game_state, bet) {

    console.log(
    "round= " + game_state.round,
    " bet_index= " + game_state.bet_index,
    " small_blind= " + game_state.small_blind,
    " orbits= " + game_state.orbits,
    " dealer= " + game_state.dealer,
    " community_cards= " + game_state.community_cards,
    " current_buy_in= " + game_state.current_buy_in,
    " pot= " + game_state.pot
    );

    this.getRanking(game_state, function(body) {
      console.log('bet');
      console.log(body);

      var next_move = function(rank){
  	  	if (rank >= 7) {
  	  		return 0;
  	  	} else if (rank >= 2) {
  	  		return 1;
  	  	} else {
  	  		return 2;
  	  	}
  	  };

  	  var fold = function (bet) {
  	  	bet(0);
  	  };

  	  var check = function (game_state, bet) {
  	    bet(game_state.current_buy_in - game_state.players[game_state.in_action].bet);
  	  };

  	  var raise = function(game_state, bet) {
  	  	var minRaise = game_state.current_buy_in - game_state.players[game_state.in_action].bet + game_state.minimum_raise;
  	  	console.log("Current bet_size is " + minRaise);
  	  	bet(minRaise);
  	  };

      if (!body) {
        check(game_state, bet);
        return;
      }

      var customRank = next_move(body.rank);
      console.log("Rank is " + body.rank + ", Custom ranking is " + customRank);
      switch(customRank) {
      	case 0:  // we have good hand
    			raise(game_state, bet);
    			break;
    		case 1:
    			check(game_state, bet);
    			break;
    		case 2:
    			fold(bet);
    			break;
    		default:
    			fold(bet);
      }
    });
  },

  showdown: function(game_state) {

  }
};

// Return the size of the other stacks
function otherStacks(game_state) {
  var total = 0;
  var count = game_state.players.length;
  game_state.players.forEach(function(v, i) {
    total += v.stack;
  });
  return total/count;
}


//x console.log(otherStacks(bet3.game_state));

// Return 7 for pair of high cards
// 5 for any other pair
// 1-3 for single high cards or two of same suit
function rank2cards(cards) {
  function faceCard(card) {
    return card.rank === "K" 
      || card.rank === "Q"
      || card.rank === "J"
      || card.rank === "A";
  }

  if (cards.length < 2) {
    return 0;
  } else if (cards.length === 2) {
    if (cards[0].rank == cards[1].rank) {
      // a pair
      if (faceCard(cards[0])) {
        return 7;
      } else {
        return 5;
      }
    } else {
      var score = 0
      if ( cards[0].suit === cards[1].suit) {
        score += 1;
      }
      if ( faceCard(cards[0]) || faceCard(cards[1]) ) {
        score += 2;
      }
      if ( parseInt(cards[0].rank) >= 10) {
        score += 1;
      }
      if ( parseInt(cards[1].rank) >= 10) {
        score += 1;
      }
      return score;
    }
  }
  return 0;
}

console.log(rank2cards([
          { "rank": "K", "suit": "hearts"},
          { "rank": "K", "suit": "spades"}
    ])
);


// Return fraction being bet by most aggressive opponent
function mostAggressive(game_state) {
  var strongest = 0; // fraction
  game_state.players.forEach(function(v, i) {
    // Only look at other players, not us
    if (!("hole_cards" in v) || v.hole_cards.length === 0) {
      if (v.stack > 0) {
        var f = v.bet/v.stack;
        if (f > strongest) {
          strongest = f;
        }
      }
    }
  });
  return strongest;
}

var bets = {
  "players": [
      {
        "id": 0,
        "name": "Albert",
        "status": "active",
        "version": "Default random player",
        "stack": 1010,
        "bet": 320
      },
      {
        "id": 1,
        "name": "Bob",
        "status": "active",
        "version": "Default random player",
        "stack": 1590,
        "bet": 80,
        "hole_cards": [
          {
            "rank": "6",
            "suit": "hearts"
          },
          {
            "rank": "K",
            "suit": "spades"
          }
        ]
      },
      {
        "id": 2,
        "name": "Chuck",
        "status": "out",
        "version": "Default random player",
        "stack": 0,
        "bet": 0
      }
    ]
};

console.log("a=", mostAggressive(bets));
