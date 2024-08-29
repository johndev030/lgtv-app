/* eslint-disable no-undef */
"use strict";
var videoPlayerVariables = {
  keys: {
    focusedPart: "controlBar",
    controlBar: 2,
    mtwSelection: 0
  },
  videoControlDom: $(".video-control-icon"),
  prevFocus: "",
  showControl: true,

  init: function (url, prevFocus) {
    currentRoute = "video-player";
    this.prevFocus = prevFocus;
    this.initVideoContents();
    this.playVideo(url);
    this.hideMediaGridContents();
    hideNavigation();
    initRangeSider();
    this.showControlBar(true);
    setCurrentTime(0);
  },

  initVideoContents: function () {
    var title = focusedVideo.title || "";
    var creator = focusedVideo.creator.channel_name;
    $("#video-title-creator-container .video-title").text(title);
    $("#video-title-creator-container .video-creator").text(creator);
  },

  hideMediaGridContents: function () {
    $(".media-grid-view").addClass("hidden");
  },

  showSliderContents: function () {
    $("#media-grid-container").removeClass("hidden");
    $(".focused-content-info-container").removeClass("hidden");
    $("#media-grid-container .media-grid-rows-window").removeClass("hidden");
    $(".sliders-dots-container").removeClass("hidden");
    showNavigation();
    hideVideoContainer();
  },

  showNextVideo: function (increment) {
    var _this = this;
    if (increment > 0) focusedVideo = mediaGridPage.nextVideo;
    else focusedVideo = mediaGridPage.prevVideo;

    var creatorName = focusedVideo.creator.channel_name;
    var prevRouteIndex = 1
    ZypeApiHelpers.searchCreators(creatorName)
      .then(function (creator) {
        if (creator.length) {
          ZypeApiHelpers.getPlaylistChildren(creator[0].id).then(response => {
            var creatorPlaylistData = response[0].content;
            mediaGridPage.addCreatorPlaylist(creatorPlaylistData, prevRouteIndex);
          });
        } else {
          var creatorData = mediaContent.filter(function (content) {
            return content.title == creatorName;
          });
          var creatorPlaylistData = creatorData[0].content;
          mediaGridPage.addCreatorPlaylist(creatorPlaylistData, prevRouteIndex);
        }
        return getPlayerURL(focusedVideo._id)
      }).then(function (url) {
        isPrevNextVideo();
        mediaPlayer.init("my-video", currentRoute);
        videoPlayerVariables.init(url, _this.prevFocus);
        homePage.preview_video = false;
      })
      .catch(function (error) {
        console.error("Error occurred:", error);
      });
  },

  playPauseVideo: function () {
    this.showControlBar(false);
    if (mediaPlayer.state === mediaPlayer.STATES.PLAYING) {
      try {
        mediaPlayer.pause();
        $(".video-control-icon.active.play-pause").removeClass("pause");
        $(".video-control-icon.active.play-pause").removeClass("play");
        $(".video-control-icon.active.play-pause").addClass("pause");
      } catch (e) {
        console.error("Error occurred:", error);
      }
    } else if (mediaPlayer.state === mediaPlayer.STATES.PAUSED) {
      try {
        mediaPlayer.play();
        $(".video-control-icon.active.play-pause").removeClass("pause");
        $(".video-control-icon.active.play-pause").removeClass("play");
        $(".video-control-icon.active.play-pause").addClass("play");
      } catch (e) {
        console.error("Error occurred:", error);
      }
    }
  },

  playVideo: function (url) {
    try {
      mediaPlayer.playAsync(url);
    } catch (e) {
      "Error occurred:", e;
    }
  },

  resetMTWSection: function () {
    $("#mtw").removeClass("expanded");
    $("#mtw .media-grid-thumbnail").removeClass("focused-thumbnail");
    $("#mtw .episodes").css({ "margin-left": "0px" });
  },

  hideControlBar: function () {
    this.showControl = false;
    this.keys.focusedPart = "controlBar";
    this.keys.controlBar = 2;
    $("#video-player-controller").slideUp();
    $("#video-title-creator-container").slideUp();
    $(".video-control-icon-container").removeClass("hidden");
    this.resetMTWSection();
  },

  showControlBar: function (move_focus) {
    var keys = this.keys;
    if (!homePage.preview_video) {
      $("#video-player-controller").slideDown();
      $("#video-title-creator-container").slideDown();
      this.showControl = true;
      if (move_focus) {
        keys.focusedPart = "controlBar";
        $(".rangeslider__fill").removeClass("active");
        $(".rangeslider__handle").removeClass("active");
        $(".video-details").removeClass("active");
        $(this.videoControlDom).removeClass("active");
        $(this.videoControlDom[2]).addClass("active");
      }
      clearTimeout(this.timeOut);
      var _this = this;
      this.timeOut = setTimeout(function () {
        _this.hideControlBar();
      }, 4000);
    }
  },

  seekToTime: function (step) {
    clearTimeout(this.seek_timer);
    var current_time = mediaPlayer.videoObj.currentTime;
    var duration = parseInt(mediaPlayer.videoObj.duration);
    this.current_time = current_time;
    var newTime = this.current_time + step;
    if (newTime < 0) newTime = 0;
    if (newTime >= duration) newTime = duration;
    this.current_time = newTime;
    try {
      mediaPlayer.pause();
    } catch (e) { }

    if (duration > 0) {
      $("#catchup")
        .find(".video-current-time")
        .html(mediaPlayer.formatTime(newTime));

      $("#catchup")
        .find(".progress-amount")
        .css({ width: newTime / duration * 100 + "%" });
    }
    this.seek_timer = setTimeout(function () {
      mediaPlayer.videoObj.currentTime = newTime;
      setTimeout(function () {
        try {
          mediaPlayer.play();
        } catch (e) { }
      }, 200);
    }, 500);

  },

  showVideoDetails: function () {
    descriptionModal.init("video-player");
    $("#slider-description-modal").modal("show");
    descriptionModal.focusedPart = "modalSelection";
  },

  reset: function () {
    hideVideoContainer();
    showNavigation();
    currentRoute = "media-grid-page";
  },

  hoverSeekBar: function () {
    var keys = this.keys;
    keys.focusedPart = "seek_bar";
    $(this.videoControlDom).removeClass("active");
    $(".rangeslider__fill").addClass("active");
    $(".rangeslider__handle").addClass("active");
    this.showControlBar(false);
    this.unfocusThumbnails();
    collapseMTWSection();
  },

  hoverMTWVideo: function (index) {
    var keys = this.keys;
    keys.mtwSelection = index;
    keys.focusedPart = "mtwSelection";
    expandMTWSection();
    this.showControlBar(false);
    this.removeAllActiveClass();
    this.focusThumbnail();
  },

  hoverVideoControlIcon: function (index) {
    var keys = this.keys;
    keys.focusedPart = "controlBar";
    this.removeAllActiveClass();
    collapseMTWSection();
    keys.controlBar = index;
    $(this.videoControlDom[index]).addClass("active");
    this.showControlBar(false);
  },

  hoverVideoDetails: function () {
    var keys = this.keys;
    this.removeAllActiveClass();
    keys.focusedPart = "video_details";
    $(".video-details").addClass("active");
    collapseMTWSection();
    this.showControlBar(false);
  },

  removeAllActiveClass: function () {
    $(".video-details").removeClass("active");
    $(".rangeslider__fill").removeClass("active");
    $(".rangeslider__handle").removeClass("active");
    $(this.videoControlDom).removeClass("active");
    this.unfocusThumbnails();
  },

  backToEpisode: function () {
    mediaGridPage.id = "#playlist-episode-container";
    $("#playlist-episode-container").removeClass("hidden");
    this.reset();
  },

  goBack: function () {
    pauseVideo();
    this.hideControlBar();
    switch (this.prevFocus) {
      case "sliderSelection":
        this.showSliderContents();
        currentRoute = "home-page";
        break;
      case "gridSelection":
        mediaGridPage.id = "#media-grid-container";
        $("#media-grid-container").removeClass("hidden");
        this.reset();
        break;
      case "episodeSelection":
        this.backToEpisode();
        break;
      case "playButtonSelection":
        this.backToEpisode();
        break;
      case "videoSelection":
        $("#video-container").addClass("hidden");
        $("#search-container").removeClass("hidden");
        $(".navigation-view").removeClass("hidden");
        currentRoute = "search-page";
        break;
    }
  },

  menuClickEvent: function () {
    var keys = this.keys;
    if (this.showControl) {
      if (keys.focusedPart == "controlBar") {
        $(this.videoControlDom[keys.controlBar]).trigger("click");
      } else if (keys.focusedPart == "mtwSelection") {
        $($("#mtw .thumbnail-container")[keys.mtwSelection]).trigger("click");
      } else if (keys.focusedPart == "video_details") {
        $(".video-details").trigger("click");
      }
    } else {
      this.showControlBar(true);
    }
  },

  updateControlIcon: function (increment) {
    var keys = this.keys;
    var _this = this;
    keys.controlBar += increment;
    if (keys.controlBar < 0) keys.controlBar = 0;
    if (keys.controlBar >= _this.videoControlDom.length)
      keys.controlBar = _this.videoControlDom.length - 1;
    $(_this.videoControlDom).removeClass("active");
    $(_this.videoControlDom[keys.controlBar]).addClass("active");

    if (keys.controlBar !== 1) {
      if (
        !$(".video-control-icon.play-pause").hasClass("pause") ||
        !$(".video-control-icon.play-pause").hasClass("play")
      ) {
        $(".video-control-icon.play-pause").addClass("play");
      }
    }
  },

  focusThumbnail: function () {
    var keys = this.keys;
    var thumbnail = $("#mtw .thumbnail-container")[keys.mtwSelection];
    $($(thumbnail).find(".media-grid-thumbnail")).addClass("focused-thumbnail");
    $($(thumbnail).find(".video-title")).addClass("focused");
    $($(thumbnail).find(".video-description")).addClass("focused");
    $($(thumbnail).find(".video-duration")).addClass("focused");
  },

  unfocusThumbnails: function () {
    $("#mtw .video-duration").removeClass("focused");
    $("#mtw .video-description").removeClass("focused");
    $("#mtw .video-title").removeClass("focused");
    $("#mtw .media-grid-thumbnail").removeClass("focused-thumbnail");
  },

  lastThumbTouchesEdge: function () {
    var thumbnails = $("#mtw .thumbnail-container");
    var thumbnail = thumbnails[thumbnails.length - 1];
    var htmlWidth = document.documentElement.clientWidth;
    var thumbnailRight = $(thumbnail).position().left + $(thumbnail).width();
    return thumbnailRight <= htmlWidth;
  },

  focusedThumbTouchesEdge() {
    var focusedThumbnail = $("#mtw .focused-thumbnail")[0];
    var thumbnailInfo = {
      height: $(focusedThumbnail).height(),
      width: $(focusedThumbnail).width(),
      top: $(focusedThumbnail).position().top,
      left: $(focusedThumbnail).position().left
    };

    var htmlWidth = document.documentElement.clientWidth;
    var thumbnailRight = thumbnailInfo.left + 1.25 * thumbnailInfo.width;
    var touchesLeft = thumbnailInfo.left <= 0 || thumbnailRight <= 0;
    var touchesRight =
      thumbnailInfo.left >= htmlWidth || thumbnailRight >= htmlWidth;
    return touchesLeft || touchesRight;
  },

  shiftRow: function () {
    var keys = this.keys;
    var thumbnail = $("#mtw .thumbnail-container")[keys.mtwSelection];
    var newLeftPosition = -($(thumbnail).width() + 12) * keys.mtwSelection;
    var row = $("#mtw .episodes");
    $(row).css({ "margin-left": String(newLeftPosition) + "px" });
  },

  shiftMTWThumbnail: function (increment) {
    var keys = this.keys;
    var thumbnails = $("#mtw .thumbnail-container");
    if (keys.mtwSelection < 0) {
      keys.mtwSelection = 0;
      return;
    } else if (keys.mtwSelection >= thumbnails.length) {
      keys.mtwSelection = thumbnails.length - 1;
      return;
    } else {
      this.unfocusThumbnails();
      this.focusThumbnail();
      if (increment > 0) {
        if (!this.lastThumbTouchesEdge()) {
          this.shiftRow();
        }
      } else {
        if (this.focusedThumbTouchesEdge()) {
          this.shiftRow();
        }
      }
    }
  },

  handleMenuLeftRight: function (increment) {
    var keys = this.keys;
    this.showControlBar(false);
    switch (keys.focusedPart) {
      case "controlBar":
        var isAdjacentVideo = isPrevNextVideo();
        if (
          isAdjacentVideo == "noPrev" &&
          increment == -1 &&
          keys.controlBar == 2 &&
          $(".video-control-icon.previous").hasClass("disabled")
        ) {
          this.updateControlIcon(-2);
          return;
        } else if (
          isAdjacentVideo == "noPrev" &&
          increment == -1 &&
          keys.controlBar == 2 &&
          !$(".video-control-icon.previous").hasClass("disabled")
        ) {
          this.updateControlIcon(increment);
          return;
        } else if (increment == -1 && keys.controlBar == 0) {
          return;
        } else if (
          isAdjacentVideo == "noPrev" &&
          increment == 1 &&
          keys.controlBar == 2
        ) {
          this.updateControlIcon(increment);
          return;
        } else if (
          isAdjacentVideo == "noPrev" &&
          increment == -1 &&
          keys.controlBar !== 2
        ) {
          this.updateControlIcon(increment);
          return;
        } else if (
          $(".video-control-icon.previous").hasClass("disabled") &&
          increment == 1 &&
          keys.controlBar == 0
        ) {
          this.updateControlIcon(2);
          return;
        } else if (
          !$(".video-control-icon.previous").hasClass("disabled") &&
          increment == 1 &&
          keys.controlBar == 0
        ) {
          this.updateControlIcon(increment);
          return;
        } else if (isAdjacentVideo == "noNext" && increment == -1) {
          this.updateControlIcon(increment);
          return;
        } else if (
          isAdjacentVideo == "noNext" &&
          increment == 1 &&
          keys.controlBar !== 2
        ) {
          this.updateControlIcon(increment);
          return;
        } else if (isAdjacentVideo == true) {
          this.updateControlIcon(increment);
          return;
        }

        break;
      case "seek_bar":
        if (increment > 0) this.seekToTime(10);
        else this.seekToTime(-10);
        break;
      case "mtwSelection":
        keys.mtwSelection += increment;
        this.shiftMTWThumbnail(increment)

        break;
    }
  },

  handleMenusUpDown: function (increment) {
    var keys = this.keys;
    if (this.showControl) {
      this.showControlBar(false);
      switch (keys.focusedPart) {
        case "controlBar":
          $(this.videoControlDom).removeClass("active");
          keys.controlBar = 2;
          if (increment < 0) {
            keys.focusedPart = "video_details";
            $(".video-details").addClass("active");
          } else {
            keys.focusedPart = "seek_bar";
            $(".rangeslider__fill").addClass("active");
            $(".rangeslider__handle").addClass("active");
          }
          break;
        case "video_details":
          if (increment > 0) {
            keys.focusedPart = "controlBar";
            $(".video-details").removeClass("active");
            $(this.videoControlDom[keys.controlBar]).addClass("active");
          }
          break;
        case "seek_bar":
          $(".rangeslider__fill").removeClass("active");
          $(".rangeslider__handle").removeClass("active");
          if (increment < 0) {
            keys.focusedPart = "controlBar";
            $(this.videoControlDom[keys.controlBar]).addClass("active");
          } else {
            keys.focusedPart = "mtwSelection";
            expandMTWSection();
            this.focusThumbnail();
          }
          break;
        case "mtwSelection":
          if (increment < 0) {
            keys.focusedPart = "seek_bar";
            collapseMTWSection();
            $(".rangeslider__fill").addClass("active");
            $(".rangeslider__handle").addClass("active");
            this.unfocusThumbnails();
            break;
          }
      }
    } else this.showControlBar(true);
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
        this.menuClickEvent();
        break;
      case lgKey.RETURN:
        this.goBack();
        break;
    }
  }
};
