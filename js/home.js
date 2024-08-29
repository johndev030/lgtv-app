/* eslint-disable no-undef */
"use strict";
var homePage = {
  keys: {
    focusedPart: "sliderSelection",
    sliderSelection: 0
  },
  sliderIndex: 0,
  currentSlideIndex: 0,
  preview_video: false,
  id: "#media-grid-container",

  init: function () {
    currentRoute = "home-page";
    this.showNav();
    this.showSliders();
    this.showMediaGrid();
    this.showHomePage();
    this.hoverSlider(0);
    this.playSliderVideo();
    this.initVariables();
    initRangeSider();
    hideSplashImage();
  },

  showNav: function () {
    navPage.init();
  },

  showSliders: function () {
    var sliderHTML = "";
    var dotHTML = "";
    var keys = this.keys;
    sliderImgs.map(function (sliderImg, index) {
      sliderHTML +=
        '<div><img  id = "' + index + '"class = "slide" src="' + sliderImg.url + '" /></div>';
      dotHTML += '<span class="slider-dot"></span>';
    });
    $(".slideshow-container").html(sliderHTML);
    $(".sliders-dots-container").html(dotHTML);
    this.showSlider(keys.sliderSelection);
    this.showSliderSection();
  },

  showMediaGrid: function () {
    mediaGridPage.init();
  },

  showHomePage: function () {
    $("#app").removeClass("hidden");
    $("#media-grid-container").removeClass("hidden");
  },

  hoverSlider: function (index) {
    this.keys.focusedPart = "sliderSelection";
    this.keys.sliderSelection = index;
  },

  playSliderVideo: function () {
    var keys = this.keys;
    focusedVideo = sliders[keys.sliderSelection];
    var title = focusedVideo.title || "";
    var creatorName = focusedVideo.creator.channel_name;
    $("#video-title-creator-container .video-title").text(title);
    $(".video-creator").text(creatorName);
    var prevRouteIndex = 1
    this.preview_video = true;
    if (keys.focusedPart === "sliderSelection") {
      videoPlayerVariables.prevFocus = "sliderSelection";

      try {
        mediaPlayer.init("my-video", currentRoute);
        var url = focusedVideo.videro_src;
        if (
          currentRoute !== "media-grid-page"
        ) {
          mediaPlayer.playAsync(url);
        }
      } catch (error) {
        console.error("Error occurred:", error);
      }

    }
  },

  initVariables: function () {
    mediaGridPage.keys.gridSelection = 0;
    mediaGridPage.keys.gridItemSelection = 0;
    mediaGridPage.currentRowsTopPosition = 0;
    $(this.id + " .media-grid-rows-container").css("top", 0);
    navPage.keys.navSelection = 1;

    var screenWidth = window.innerWidth;
    var screenHeight = window.innerHeight;
    if (screenWidth === 1280 && screenHeight === 720) {
      rowLeftMargin = 72.6656;
    }
  },

  showSlider: function (index) {
    var keys = this.keys;
    focusedVideo = sliders[index];
    this.showSliderContents();
    this.unfocusSliders();
    this.focusSlider(index);
    this.updateSlider(keys.sliderSelection);
  },

  focusSlider: function (index) {
    this.sliderIndex = index;
    this.unfocusThumbnails();
    this.unfocusDescriptionText();
    var currentSlider = $(this.id).find(".slide")[this.sliderIndex];
    $(currentSlider).addClass("focused-slider");

    $(this.id + " .slideshow-container").removeClass("invisible");
    $(this.id + " .sliders-dots-container").removeClass("invisible");
    $(this.id + " .large-thumbnail-container").addClass("invisible");
    $(this.id + " .focused-content-info-button-container").removeClass(
      "invisible"
    );
    $(this.id + " .play-button").addClass("focused");
  },

  unfocusSliders: function () {
    $(this.id + " .slide").removeClass("focused-slider");
    $(this.id + " .play-button").removeClass("focused");
  },

  updateSlider: function (index) {
    var keys = this.keys;
    var dots = $(".slider-dot");
    var i;
    var slides = document.querySelectorAll(".slide");
    if (index < 0) {
      index = slides.length - 1;
    } else if (index >= slides.length) {
      index = 0;
    }
    if (this.currentSlideIndex > -1) {
      slides[this.currentSlideIndex].classList.add("fade-out");
      slides[this.currentSlideIndex].classList.remove("fade-in");
      slides[index].classList.remove("fade-out");
      slides[index].classList.add("fade-in");
      this.currentSlideIndex = index;
    }
    for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
    }
    dots[keys.sliderSelection].className += " active";
  },

  unfocusThumbnails: function () {
    $(this.id + " .video-duration").removeClass("focused");
    $(this.id + " .video-description").removeClass("focused");
    $(this.id + " .video-title").removeClass("focused");
    $(this.id + " .media-grid-thumbnail").removeClass("focused-thumbnail");

    $(this.id + " .media-grid-rows-window").addClass("inactive");
    $(this.id + " .focused-content-info-container").addClass("inactive");
    $(this.id + " .media-grid-row-title-container").addClass("hidden");
  },

  unfocusDescriptionText: function () {
    $(this.id + " .focused-content-info-container").removeClass("focused");
    $(this.id + " .focused-content-info-description").removeClass("focused");
    $(this.id + " .focused-content-info-desc-container").removeClass("focused");
  },

  showSliderContents: function () {
    var title = focusedVideo.title || "";
    var creator = getCreatorName(focusedVideo);
    var descriptionText = focusedVideo.description || "";
    var html =
      "<div>" +
      '<div class="focused-content-info-title-container">' +
      '<p class="focused-content-info-title dark-theme ellipsis-text">' +
      title +
      "</p>" +
      '<p class="focused-content-info-creator dark-theme ellipsis-text">' +
      creator +
      "</p>" +
      "</div>" +
      '<div class="focused-content-info-desc-container" onmouseenter="homePage.hoverSliderDescription()" onclick="descriptionModal.showQRModal()">' +
      '<span class="focused-content-info-description dark-theme ellipsis-text">' +
      descriptionText.replace(/\n/g, "<br/>") +
      "</span>" +
      "</div>" +
      '<div class="focused-content-info-button-container">' +
      '<button id = "play-video" class="play-button focused-content-info-button" onmouseenter="homePage.hoverPlayButton()" onclick="homePage.playVideo()">Play</button>' +
      "</div>" +
      "</div>";
    $(this.id + " .focused-content-info-container").html(html);
  },

  showLogo: function () {
    $(this.id + " .logo-container").removeClass("hidden");
  },

  hideLogo: function () {
    $(this.id + " .logo-container").addClass("hidden");
  },

  showMediaGridContents: function () {
    $(".media-grid-row-title-container").removeClass("hidden");
    $(".focused-content-info-container").removeClass("inactive");
    $(this.id + " .media-grid-rows-window").removeClass("inactive");
    $(this.id + " .large-thumbnail-container").removeClass("invisible");
  },

  hideMediaGridContents: function () {
    $(this.id + " .media-grid-rows-window").addClass("hidden");
  },

  hideSliderContents: function () {
    $(this.id + " .focused-content-info-container").addClass("hidden");
    $(".sliders-dots-container").addClass("hidden");
  },

  hideSliderSection: function () {
    $(".slideshow-container").addClass("hidden");
    $(".sliders-dots-container").addClass("hidden");
    $(".focused-content-info-button-container").addClass("invisible");
  },

  showSliderSection: function () {
    $(".slideshow-container").removeClass("hidden");
    $(".sliders-dots-container").removeClass("hidden");
    $(".focused-content-info-button-container").removeClass("invisible");
  },

  playVideo: function () {
    var keys = this.keys;
    if (this.preview_video == true) {
      this.preview_video = false;
      this.hideSliderContents();
      this.hideMediaGridContents();
      hideNavigation();
      currentRoute = "video-player";
    } else {
      url = focusedVideo.videro_src;
      try {
        mediaPlayer.init("my-video", currentRoute);
        videoPlayerVariables.init(url, keys.focusedPart);

      } catch (error) {
        console.error("Error occurred:", error);
      }
    }
  },

  hoverSliderDescription: function () {
    this.unfocusSliders();
    mediaGridPage.unfocusThumbnails();
    descriptionModal.init(currentRoute);
  },

  hoverPlayButton: function () {
    $(".focused-content-info-desc-container").removeClass("focused");
    homePage.focusSlider();
    currentRoute = "home-page";
  },

  goBack: function () {
    turnOffModal.init("home-page");
  },

  handleMenuClick: function () {
    $("#play-video").trigger("click");
  },

  handleMenusUpDown: function (increment) {
    if (increment < 0) {
      this.hoverSliderDescription();
    } else {
      this.preview_video = false;
      pauseVideo();
      this.hideSliderSection();
      hideVideoContainer();
      this.showMediaGridContents();
      mediaGridPage.keys.gridSelection = 0;
      mediaGridPage.keys.gridItemSelection = 0;
      mediaGridPage.keys.episodeSelection = 0;
      mediaGridPage.keys.focusedPart = "gridSelection";
      mediaGridPage.id = "#media-grid-container";
      focusedVideo = mediaContent[0].items[0];
      console.log(focusedVideo);
      mediaGridPage.focusThumbnail();
      mediaGridPage.updateVideoContent();
      currentRoute = "media-grid-page";
    }
  },

  handleMenuLeftRight: function (increment) {
    var keys = this.keys;
    keys.sliderSelection += increment;
    if (keys.sliderSelection >= sliders.length) {
      keys.sliderSelection = sliders.length - 1;
      return;
    }
    if (keys.sliderSelection < 0) {
      keys.sliderSelection = 0;
      currentRoute = "nav-page";
      navPage.expand("home-page");
      return;
    }

    this.showSlider(keys.sliderSelection);
    hideVideoContainer();
    this.playSliderVideo();
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
