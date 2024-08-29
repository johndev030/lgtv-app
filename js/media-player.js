/* eslint-disable no-undef */
"use strict";
var mediaPlayer = {
  videoObj: null,
  parent_id: "app",
  STATES: {
    STOPPED: 0,
    PLAYING: 1,
    PAUSED: 2,
    CLOSED: 3,
    PREPARED: 4
  },
  state: 0,
  currentTime: 0,
  id: "",
  prev_route: "",

  init: function (id, prev_route) {
    this.prev_route = prev_route;
    this.id = id;
    this.videoObj = null;
    this.state = this.STATES.STOPPED;
    this.currentTime = 0;
    if (!this.videoObj && id) {
      this.videoObj = document.getElementById(id);
      var videoObj = this.videoObj;
      var _this = this;

      if (id) {
        this.videoObj = document.getElementById(id);
        var videoObj = this.videoObj;
        var that = this;
        this.videoObj.addEventListener('error', function (e) {
          $('#' + that.parent_id)
            .find('.video-error')
            .show();
        });
        this.videoObj.addEventListener('canplay', function (e) {
          $('#' + that.parent_id)
            .find('.video-error')
            .hide();
        });
        this.videoObj.addEventListener('durationchange', function (event) { });
        this.videoObj.addEventListener("loadeddata", function () {
          var duration = parseInt(videoObj.duration);
          var attributes = {
            min: 0,
            max: duration,
          };
          $("#" + _this.parent_id)
            .find(".video-progress-bar-slider")
            .attr(attributes);
          $("#" + _this.parent_id)
            .find(".video-progress-bar-slider")
            .rangeslider("update", true);
          $("#" + _this.parent_id)
            .find(".video-progress-bar-slider")
            .prop("disabled", false);
          $("#" + _this.parent_id)
            .find(".video-progress-bar-slider")
            .rangeslider("update");
        });



        this.videoObj.ontimeupdate = function () {
          $("#" + _this.parent_id)
            .find(".video-error")
            .hide();
          var duration = videoObj.duration;
          var currentTime = videoObj.currentTime;
          if (duration > 0) {
            $("#" + _this.parent_id)
              .find(".video-progress-bar-slider")
              .val(currentTime)
              .change();
            $("#" + _this.parent_id)
              .find(".video-current-time")
              .html(_this.formatTime(currentTime));
          }
        };

        this.videoObj.addEventListener("loadedmetadata", function () {
          var duration = parseInt(videoObj.duration);
          var attributes = {
            min: 0,
            max: duration,
          };
          $(".video-total-time").html(mediaPlayer.formatTime(duration));
          $(".video-progress-bar-slider").attr(attributes);
          $(".video-progress-bar-slider").rangeslider("update", true);
        });

        this.videoObj.addEventListener("waiting", function () { });
        this.videoObj.addEventListener("suspend", function () { });
        this.videoObj.addEventListener("stalled", function () { });
        this.videoObj.addEventListener("ended", function () { videoPlayerVariables.showNextVideo(1); });

      }
    }
  },

  play: function (url) {
    if (this.state < this.STATES.PAUSED) {
      return;
    }
    this.state = this.STATES.PLAYING;
    if (url) {
      this.videoObj.src = url;
    } else {
      this.videoObj.play();
    }
  },
  playAsync: function (url) {
    if (url) {
      if (!homePage.preview_video) showLoader();
      videoPlayerVariables.hideControlBar();
      this.videoObj.pause();
      var that = this;
      $('#' + this.parent_id)
        .find('.video-error')
        .hide();
      while (this.videoObj.firstChild)
        this.videoObj.removeChild(this.videoObj.firstChild);
      this.videoObj.load();

      var source = document.createElement('source');
      if (
        currentRoute === "video-player" ||
        currentRoute === "home-page" ||
        currentRoute === "description-modal"
      ) {
        source.setAttribute('src', url);
        this.videoObj.appendChild(source);
        this.videoObj.play();
        hideLoader();
        showVideoContainer();
      }
      if (currentRoute !== "media-grid-page") {
        videoPlayerVariables.showControlBar(true);
      }


      source.addEventListener('error', function (e) {
        $('#' + that.parent_id)
          .find('.video-error')
          .show();
      });
      source.addEventListener('emptied', function (event) {
        $('#' + that.parent_id)
          .find('.video-error')
          .show();
      });
    } else {
      this.videoObj.play();
    }
    this.state = this.STATES.PLAYING;
  },

  pause: function () {
    this.videoObj.pause();
    this.state = this.STATES.PAUSED;
  },
  stop: function () {
    this.videoObj.pause();
    this.currentTime = 0;
    this.state = this.STATES.STOPPED;
  },
  close: function () {
    this.videoObj.pause();
    this.state = this.STATES.STOPPED;
  },

  formatTime: function (seconds) {
    var hh = Math.floor(seconds / 3600),
      mm = Math.floor(seconds / 60) % 60,
      ss = Math.floor(seconds) % 60;
    return (
      (hh ? (hh < 10 ? "0" : "") + hh + ":" : "") +
      (mm < 10 ? "0" : "") +
      mm +
      ":" +
      (ss < 10 ? "0" : "") +
      ss
    );
  }
};
