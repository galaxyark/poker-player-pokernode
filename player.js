
module.exports = {

  VERSION: "Default JavaScript folding player",

  bet_request: function(game_state, bet) {
    bet(game_state.current_buy_in - game_state.players[game_state.in_action].bet);
  },

  showdown: function(game_state) {

  }
};
