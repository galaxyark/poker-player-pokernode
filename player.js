
module.exports = {

  VERSION: "aggressive pokerNode",

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

    this.get_ranking();

    bet(game_state.current_buy_in - game_state.players[game_state.in_action].bet);
  },

  showdown: function(game_state) {

  },

  get_ranking: function() {
    console.log("This function gets ranking.")
  }
};
