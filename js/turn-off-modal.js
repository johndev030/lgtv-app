/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
"use strict";
var turnOffModal = {
  keys: {
    focusedPart: "menuSelection",
    menuSelection: 0
  },
  menuDom: $("#turn-off-modal button"),
  prev_route: "",
  movie: null,
  init: function (prev_route) {
    this.prev_route = prev_route;
    currentRoute = "turn-off-modal";
    $(this.menuDom[0]).addClass("active");
    $("#turn-off-modal").modal("show");
  },

  goBack: function () {
    $(this.menuDom).removeClass("active");
    $("#turn-off-modal").modal("hide");
    currentRoute = this.prev_route;
  },

  hoverMenuItem: function (index) {
    var keys = this.keys;
    keys.focusedPart = "menuSelection";
    keys.menuSelection = index;
    $(this.menuDom).removeClass("active");
    $(this.menuDom[index]).addClass("active");
  },

  handleMenuClick: function () {
    var keys = this.keys;
    if (keys.focusedPart === "menuSelection") {
      switch (keys.menuSelection) {
        case 0:
          this.goBack();
          break;
        case 1:
          window.close();
          break;
      }
    }
  },

  handleMenusUpDown: function (increment) { },

  handleMenuLeftRight: function (increment) {
    var keys = this.keys;
    if (keys.focusedPart === "menuSelection") {
      keys.menuSelection += increment;
      if (keys.menuSelection < 0) keys.menuSelection = 0;
      if (keys.menuSelection > 1) keys.menuSelection = 1;
      this.hoverMenuItem(keys.menuSelection);
    }
  },
  HandleKey: function (e) {
    switch (e.keyCode) {
      case lgKey.RIGHT:
        this.handleMenuLeftRight(1);
        break;
      case lgKey.LEFT:
        this.handleMenuLeftRight(-1);
        break;
      case lgKey.DOWN:
        this.handleMenusUpDown(1);
        break;
      case lgKey.UP:
        this.handleMenusUpDown(-1);
        break;
      case lgKey.ENTER:
        this.handleMenuClick();
        break;
      case lgKey.RETURN:
        this.goBack();
        break;
    }
  }
};
