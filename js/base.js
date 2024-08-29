/* eslint-disable no-undef */
/* eslint-disable no-unused-vars  */
"use strict";

var appInfo = {};
var sliders = [];
var sliderImgs = [];
var focusedVideo = {};
var currentRoute = "auth";
var apiPrefixUrl = "https://api.zype.com/";
var playerPrefixUrl = "https://player.zype.com/embed/";
var playlistId = "";
var mediaContent = {};
var creators = [];
var creatorPlaylist = [];
var categories = [];
var episodes = [];
var videos = [];
var rowLeftMargin = 109;
var mtwVideoCount = 10;
var swimlaneHeight = 388;
var defaultThumbnailUrl = "images/placeholder.png";
var navData = [
  { title: "Search", src: "images/Menu_0_Hover.png" },
  { title: "Home", src: "images/Menu_1_Selected.png" },
  { title: "Creators", src: "images/Menu_2_Hover.png" }
];
var isKeyboard = false;
var layout1 = "'swimlane'", layout2 = "'episodes'", layout3 = "'mtw'";
var animationTime = 200;
var arrowStep = 4;

function initRangeSider() {
  var sliderElement = $(".video-progress-bar-slider")[0];
  $(".video-current-time").text("00:00");
  $(".video-total-time").text("00:00");
  $(sliderElement).attr({
    min: 0,
    max: 100
  });
  $(sliderElement).rangeslider({
    polyfill: false,
    rangeClass: "rangeslider",
    onSlideEnd: function (position, value) {
      sliderPositionChanged(value);
    }
  });
  $(sliderElement).val(0).change();
  $(sliderElement).attr("disabled", true);
  $(sliderElement).rangeslider("update");
}

function sliderPositionChanged(newTime) {
  setCurrentTime(newTime);
  $("#" + mediaPlayer.parent_id)
    .find(".video-progress-bar-slider")
    .val(newTime)
    .change();
  $("#" + mediaPlayer.parent_id)
    .find(".video-current-time")
    .html(mediaPlayer.formatTime(newTime));
}

function setCurrentTime(time) {
  mediaPlayer.videoObj.currentTime = time;
}

function showToast(title, text) {

  $("#toast-body").html("<div>" + title + "<br>" + text + "</div>");
  $("#toast").toast({ animation: true, delay: 4000 });
  $("#toast").toast("show");
}

function formatDuration(seconds) {
  var hours = Math.floor(seconds / 3600);
  var minutes = Math.floor(seconds % 3600 / 60);
  var remainingSeconds = seconds % 60;

  var h = hours == 0 ? "" : hours < 10 ? "0" + hours + ":" : hours + ":";
  var m =
    minutes == 0 ? "00" : minutes < 10 ? "0" + minutes + ":" : minutes + ":";
  var s =
    remainingSeconds == 0
      ? "00"
      : remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;

  return h + m + s;
}

function saveData(key, data) {
  window[key] = data;
}

function pauseVideo() {
  try {
    mediaPlayer.pause();
    mediaPlayer.state = mediaPlayer.STATES.PAUSED;
  } catch (e) {
    "Error occurred:", e;
  }
}

function isPlaying() {
  if (mediaPlayer.videoObj.currentTime > 0) {
    return true;
  } else {
    return false;
  }
}

function replayVideo() {
  setCurrentTime(0)
  mediaPlayer.play();
}

function fadeImage(nextImageURL) {
  var currentImage = $(mediaGridPage.id + " .large-thumbnail");
  var nextImage = $("<img>")
    .attr("src", nextImageURL)
    .addClass("large-thumbnail");
  currentImage.fadeOut(100, function () {
    currentImage.addClass("thumb-fade-out");
    currentImage.remove();
    $(mediaGridPage.id + " .large-thumbnail-container").append(nextImage);
    nextImage.addClass("thumb-fade-in");
    nextImage.fadeIn(2000);
  });
}

function hideVideoContainer() {
  $("#video-container").addClass("hidden");
  videoPlayerVariables.hideControlBar();
}

function showVideoContainer() {
  $("#video-container").removeClass("hidden");
}

function hideNavigation() {
  $(".navigation-view").addClass("hidden");
}

function showNavigation() {
  $(".navigation-view").removeClass("hidden");
}

function collapseMTWSection() {
  $("#mtw").removeClass("expanded");
  $(".video-control-icon-container").removeClass("hidden");
  $("#mtw .swiper-prev-btn-container").addClass("hidden")
  $("#mtw .swiper-next-btn-container").addClass("hidden")
}

function expandMTWSection() {
  $("#mtw").addClass("expanded");
  $(".video-control-icon-container").addClass("hidden");
  $("#mtw .swiper-prev-btn-container").removeClass("hidden")
  $("#mtw .swiper-next-btn-container").removeClass("hidden")
}

function compareDates(a, b) {
  const dateA = new Date(a.published_at);
  const dateB = new Date(b.published_at);

  if (dateA < dateB) return -1;
  if (dateA > dateB) return 1;
  return 0;
}

function isPrevNextVideo() {
  if (!mediaGridPage.isNextVideo) {
    $(".video-control-icon.previous").removeClass("disabled");
    $(".video-control-icon.next").addClass("disabled");
    return "noNext";
  } else if (!mediaGridPage.isPrevVideo) {
    $(".video-control-icon.next").removeClass("disabled");
    $(".video-control-icon.previous").addClass("disabled");
    return "noPrev";
  } else {
    $(".video-control-icon.previous").removeClass("disabled");
    $(".video-control-icon.next").removeClass("disabled");
    return true;
  }
}

function htmlDecode(input) {
  var doc = new DOMParser().parseFromString(input, "text/html");
  return doc.documentElement.textContent;
}

function shuffle(array) {
  return Array(array.length)
    .fill(null)
    .map((_, i) => [Math.random(), i])
    .sort(([a], [b]) => a - b)
    .map(([, i]) => array[i]);
}

var categoryModel = function (args) {
  var _this = this;
  this.id = args.id;
  this.title = htmlDecode(args.name) || "";
  this.link = args.link;
};

function getCreatorName(video) {
  var data = video.categories;
  var value = "";
  if (data != undefined && data.length > 0) {
    var category = data[0];
    value = category.value[0];
  }
  return value;
}

function getSlidersThumbnail() {
  sliderImgs = sliders.map(slider => ({
    url: slider.thumbnail
  }));
}

function httpRequest(method, url, params) {
  var def = new $.Deferred();
  console.log('request');
  console.log(method);
  console.log(url);
  console.log(params);

  $.ajax({
    url: url,
    type: method,
    crossDomain: true,
    dataType: "json",
    xhrFields: { withCredentials: false },
    data: params
  })
    .done(function (resp) {

      console.log(resp);
      def.resolve(resp);
      console.log(def.resolve(resp));

    })
    .fail(function (xhr) {
      def.reject(xhr.responseJSON);
    });

  return def.promise();
}

function getPlayerURL(id) {
  var params = { app_key: appDefaults.appKey };

  return new Promise(function (resolve, reject) {
    $.ajax({
      method: "GET",
      url: playerPrefixUrl + id,
      headers: { "Content-Type": "application/json" },
      data: params,
      success: function (data) {
        var url = data.response.body.outputs[0].url;
        resolve(url);
      },
      error: function (xhr, status, error) {
        reject(error);
      }
    });
  });
}

function getCreator(params) {
  var url = "https://of.tv/wp-json/wp/v2/oftv_show";
  return httpRequest("GET", url, params);
}

function getCategories(params) {
  var url = "https://of.tv/wp-json/wp/v2/g";
  return httpRequest("GET", url, params);
}

function getPlaylistVideos(playlistId, params) {
  var url = apiPrefixUrl + "playlists/" + playlistId + "/videos";
  params.app_key = appDefaults.appKey;
  return httpRequest("GET", url, params);
}

function getPlaylists(params) {
  var url = "https://api.of.tv/v0/pages/home";
  params = "";
  return httpRequest("GET", url, params);
}
function getCreators() {
  var url = "https://api.of.tv/v0/pages/creators";
  var params = "";
  return httpRequest("GET", url, params);
}

function getEpisodes(params) {
  var url = "https://api.of.tv/v0/pages/creators/" + params;
  params = "";
  return httpRequest("GET", url, params);
}
function getPlaylist(playlistId, params) {
  var url = apiPrefixUrl + "playlists/" + playlistId;
  params.app_key = appDefaults.appKey;
  return httpRequest("GET", url, params);
}
function getCreatorGenrewise(params) {
  var url = "https://api.of.tv/v0/pages/creators";
  return httpRequest("GET", url, params);
}
function getVideos(params) {
  var url = apiPrefixUrl + "videos";
  params.app_key = appDefaults.appKey;
  return httpRequest("GET", url, params);
}


function searchCreatorsByCategory(category) {
  return new Promise((resolve, reject) => {
    var params = {
      genre: category.title
    };
    getCreatorGenrewise(params).then(
      resp => {

        var creators_array = [];
        if (resp.data.creators) {
          var creators_data = resp.data.creators;
          for (var i = 0; i < creators_data.length; i++) {
            console.log(creators_data);
            creators_array.push(creators_data[i]);

          }
        }
        console.log(creators_array);
        resolve(creators_array);
      },
      err => {
        resolve([]);
      }
    );
  });
}

function callMultiple(functionCallsArray) {
  var _this = this;
  var promise = functionCall => functionCall[0].apply(_this, functionCall[1]);

  var promiseArray = functionCallsArray.map(promise);
  var resolvedPromises = promiseArray.map(p =>
    Promise.resolve(p).then(undefined, e => null)
  );

  return Promise.all(resolvedPromises);
}

function getGridItemSelection() {

  console.log(mediaContent[mediaGridPage.keys.gridSelection].gridItemSelection);
  console.log(mediaContent[mediaGridPage.keys.gridSelection]);

  return mediaContent[mediaGridPage.keys.gridSelection].gridItemSelection;
}

function showLoader() {
  $("#preloader").removeClass("hidden");
}

function hideLoader() {
  $("#preloader").addClass("hidden");
}


function hideSplashImage() {
  $("#splash-image-container").hide();
}