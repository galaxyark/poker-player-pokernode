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
      callback(body);
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
      cosnole.log(body);

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
        check();
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
