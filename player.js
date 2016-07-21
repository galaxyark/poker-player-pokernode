
module.exports = {

  VERSION: "aggressive pokerNode",

  bet_request: function(game_state, bet) {

    console.log(
    "round= " + round,
    " bet_index= " + bet_index,
    " small_blind= " + small_blind,
    " orbits= " + orbits,
    " dealer= " + dealer,
    " community_cards= " + community_cards,
    " current_buy_in= " + current_buy_in,
    " pot= " + pot
    );

    bet(game_state.current_buy_in - game_state.players[game_state.in_action].bet);
  },

  showdown: function(game_state) {

  }
};
