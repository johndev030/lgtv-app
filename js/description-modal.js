/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
"use strict";
var descriptionModal = {
  currentIndex: 0,
  links: [],
  prev_route: "",
  focusedPart: "descriptionSelection",

  init: function (prev_route) {
    this.prev_route = prev_route;
    var descriptionText = focusedVideo.description || "";
    this.updateFocus(0);
    if (prev_route === "home-page" || prev_route === "media-grid-page")
      $(".focused-content-info-desc-container").addClass("focused");

    this.setText(descriptionText);
    currentRoute = "description-modal";
  },

  setText: function (text) {
    var pattern = /((http|https):\/\/)?(of|onlyfans)\.(com|tv)(\/[-\w.]+)?/gim;
    var matches = text.matchAll(pattern);

    var index = 0;
    this.links = [];
    for (var match of matches) {
      this.links.push(match[0]);
      var replacement =
        '<a class="description-dialog-link desc-dialog-link-index-' +
        index +
        '" onmouseenter="descriptionModal.hoverLink(' +
        index +
        ')">' +
        match[0] +
        "</a>";
      text = text.replace(match[0], replacement);
      index = index + 1;
    }
    text = text.replace(/(?:\r\n|\r|\n)/g, "<br>");
    var title = focusedVideo.title || "";
    var creator = getCreatorName(focusedVideo);
    $(".description-dialog-text-container .title").text(title);
    $(".description-dialog-text-container .creator").text(creator);
    $(".description-dialog-text").html(text);

    if (this.links.length > 0) {
      this.currentIndex = -1;
      this.updateFocus(1);
    } else {
      $(".description-dialog-qr-container").addClass("hidden");
    }
  },

  updateQR: function () {
    var link = this.links[this.currentIndex];
    var container = $(".description-dialog-qr-container");
    var img = document.createElement("img");
    img.src =
      "https://chart.googleapis.com/chart?cht=qr&choe=UTF-8&chs=340x340&chl=" +
      link;
    container.html(img);
    container.removeClass("hidden");
  },

  updateFocus: function (increment) {
    if (this.links.length > 0) {
      $(" .desc-dialog-link-index-" + this.currentIndex).removeClass("focus");
      var nextLink = this.links[this.currentIndex + increment];
      if (nextLink) {
        this.currentIndex = this.currentIndex + increment;
      } else {
        this.currentIndex = 0;
      }
      $(" .desc-dialog-link-index-" + this.currentIndex).addClass("focus");
      this.updateQR();
    }
  },

  showQRModal: function () {
    this.focusedPart = "modalSelection";
    $("#slider-description-modal").modal("show");
  },

  hoverLink: function (index) {
    this.currentIndex = index;
    this.focusedPart = "modalSelection";
    $(".description-dialog-link").removeClass("focus");
    $(" .desc-dialog-link-index-" + index).addClass("focus");
    this.updateQR();
    this.unFocusCloseBtn();
  },

  hoverCloseButton: function () {
    this.focusedPart = "closeBtn";
    this.focusCloseBtn();
  },

  closeModal: function () {
    this.focusedPart = "descriptionSelection";
    this.unFocusCloseBtn();
    $("#slider-description-modal").modal("hide");
    if (this.prev_route === "video-player")
      currentRoute = this.prev_route;
  },

  hoverModalContents: function () {
    this.focusedPart = "modalSelection";
    this.unFocusCloseBtn();
  },

  focusCloseBtn: function () {
    $(".close-btn .img").attr("src", "images/close-selected.png");
  },

  unFocusCloseBtn: function () {
    $(".close-btn .img").attr("src", "images/close.png");
  },

  goBack: function () {
    if (
      this.prev_route === "home-page" ||
      this.prev_route === "media-grid-page"
    ) {
      if (this.focusedPart == "modalSelection") {
        this.focusedPart = "descriptionSelection";
        currentRoute = "description-modal";
      } else {
        turnOffModal.init("home-page");
      }
    } else {
      $(".video-details").removeClass("active");
      $(".focused-content-info-desc-container").removeClass("focused");
      currentRoute = this.prev_route;
    }
    $("#slider-description-modal").modal("hide");
  },

  handleMenuLeftRight: function (increment) {
    if (this.focusedPart === "modalSelection") {
      this.focusedPart = "modalSelection";
      this.updateFocus(increment);
    } else {
      var keys = homePage.keys;
      keys.sliderSelection += increment;
      if (keys.sliderSelection >= sliders.length) {
        keys.sliderSelection = sliders.length - 1;
        return;
      }
      if (keys.sliderSelection < 0) {
        keys.sliderSelection = 0;
        currentRoute = "nav-page";
        navPage.expand("home-page");
        $(".focused-content-info-desc-container").removeClass("focused");
        return;
      }
      hideVideoContainer();
      homePage.showSlider(keys.sliderSelection);
      $(homePage.id + " .play-button").removeClass("focused");
      $(homePage.id + " .focused-content-info-desc-container").addClass(
        "focused"
      );
      homePage.playSliderVideo();
    }
  },

  handleMenusUpDown: function (increment) {
    switch (this.prev_route) {
      case "description-modal":
        homePage.hoverPlayButton();
        break;
      case "home-page":
        if (
          increment > 0 &&
          this.focusedPart !== "modalSelection" &&
          this.focusedPart !== "closeBtn"
        ) {
          homePage.hoverPlayButton();
        } else if (this.focusedPart === "modalSelection" && increment === -1) {
          this.hoverCloseButton();
          return;
        } else if (this.focusedPart === "closeBtn") {
          this.hoverModalContents();
          return;
        }
        break;
      case "media-grid-page":
        var keys = mediaGridPage.keys;
        if (increment > 0 && this.focusedPart !== "modalSelection") {
          $(".focused-content-info-desc-container").removeClass("focused");
          if (keys.focusedPart === "gridSelection")
            mediaGridPage.focusThumbnail();
          else
            $("#playlist-episode-container .play-button").addClass("focused");
          currentRoute = this.prev_route;
        }
        break;
      case "video-player":
        if (this.focusedPart === "modalSelection" && increment === -1) {
          $(" .desc-dialog-link-index-" + this.currentIndex).removeClass("focus");
          this.hoverCloseButton();
        }
        if (this.focusedPart === "closeBtn" && increment === 1) {
          this.updateFocus(0);
          this.hoverModalContents();
        }
        break;
    }
  },

  handleMenuClick: function () {
    if (this.focusedPart === "closeBtn") {
      this.focusedPart = "descriptionSelection";
      this.unFocusCloseBtn();
      $("#slider-description-modal").modal("hide");
      if (this.prev_route === "video-player")
        currentRoute = this.prev_route;
    } else {
      this.focusedPart = "modalSelection";
      $("#slider-description-modal").modal("show");
    }
  },

  HandleKey: function (e) {
    if (!this.is_drawing) {
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
  }
};
