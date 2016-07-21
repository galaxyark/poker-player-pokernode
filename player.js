module.exports = {
  VERSION: "aggressive pokerNode",

  holdCards: function(game_state) {
    return game_state.players[game_state.in_action].hole_cards;
  },

  ranking: [],

  getRanking: function(game_state, callback) {
    var cards = this.holdCards(game_state).concat(game_state.community_cards);
    var request = require('request');
    var self = this;

    request.get({
      headers: {'content-type' : 'application/x-www-form-urlencoded'},
      url:     'http://rainman.leanpoker.org/rank',
      body:    "cards=" + JSON.stringify(cards)
    }, function(error, response, body) {
      self.ranking = body;
      console.log(body);
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

    this.getRanking(game_state, function() {
      bet(game_state.current_buy_in - game_state.players[game_state.in_action].bet);
    });
  },

  showdown: function(game_state) {

  }
};
