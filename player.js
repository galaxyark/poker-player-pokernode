
module.exports = {

  VERSION: "Default JavaScript folding player",

  bet_request: function(game_state, bet) {
    bet(game_state.current_buy_in);
  },

  showdown: function(game_state) {

  }
};
