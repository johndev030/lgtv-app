/* eslint-disable no-undef */
var mediaGridPage = {
  keys: {
    focusedPart: "gridSelection",
    gridSelection: 0,
    gridItemSelection: 0,
    episodeSelection: 0
  },
  currentRowsTopPosition: 0,
  id: "#media-grid-container",
  prevRoute: "",
  isFastCliked: false,
  nextBtnDom: null,
  layout: "",
  previousBtnPressTime: 0,
  isPrevVideo: false,
  prevVideo: "",
  isNextVideo: false,
  nextVideo: "",

  init: function () {
    $(".media-grid-rows-container").html("");
    focusedVideo = mediaContent[0].items[0];
    mediaContent.map(function (content, index) {
      var itemHTML = "";
      var isPlaylist = content.type == "CREATORS" ? true : false;
      content.items.map(function (item, i) {
        if (isPlaylist) {
          var tTitle = item.channel_name;
          var thumnail = item.featured_image.length > 0 ? item.featured_image : 'images/placeholder.png'
        } else {
          var tTitle = item.title;
          var creator = item.creator.channel_name;
          var thumnail = item.thumbnail.length > 0 ? item.thumbnail : 'images/placeholder.png'

        }

        itemHTML +=
          '<div class="thumbnail-container" onmouseenter="mediaGridPage.hoverGridItem(' +
          index + ', ' + i + ')" onclick="mediaGridPage.playVideo(1)">' +
          '<img src="' +
          thumnail +
          '"  class="media-grid-thumbnail" />' +
          '<div class="video-title-container">' +
          '<p class="video-title ellipsis-text">' +
          tTitle +
          "</p>";

        if (!isPlaylist) {
          itemHTML +=
            '<p class="video-description align-left ellipsis-text">' +
            creator +
            "</p>" +
            '<p class="video-duration align-right">' +
            formatDuration(item.duration) +
            "</p>";
        }

        itemHTML += "</div></div>";
      });
      var mediaGridHTML =
        '<div class="media-grid-row landscape" data-index="' +
        index +
        '">' +
        '<div class="media-grid-row-title-container hidden">' +
        '<p class="media-grid-row-title dark-theme ellipsis-text invisible">' +
        content.label +
        "</p>" +
        "</div>" +
        '<div class="media-grid-row-thumbnails-container">' +
        '<div class = "swiper-prev-btn-container" onmouseleave="mediaGridPage.leaveNextButton(0)" onmouseenter="mediaGridPage.hoverNextButton(' +
        index +
        ',-1)" onclick="mediaGridPage.clickNextButton(' + layout1 + ', ' +
        index +
        ',-1)"><div class="swiper-prev-button"><img src = "images/playlist-left-arrow-blue.svg"></div></div>' +
        '<div class="media-grid-row-thumbnails">' +
        itemHTML +
        "</div>" +
        '<div class = "swiper-next-btn-container" onmouseleave="mediaGridPage.leaveNextButton(0)" onmouseenter="mediaGridPage.hoverNextButton(' +
        index +
        ',1)" onclick="mediaGridPage.clickNextButton(' + layout1 + ', ' +
        index +
        ',1)"><div class="swiper-next-button"><img src = "images/playlist-right-arrow-blue.svg"></div></div>' +
        "</div>" +
        "</div>";

      $("#media-grid-container .media-grid-rows-container").append(
        mediaGridHTML
      );
    });
  },

  shiftRowsUpDown: function (increment) {
    var newTopPosition = 0;
    if (increment < 0) {
      newTopPosition = this.currentRowsTopPosition + swimlaneHeight;
    } else newTopPosition = this.currentRowsTopPosition - swimlaneHeight;
    this.currentRowsTopPosition = newTopPosition;

    $(this.id + " .media-grid-rows-container").css({
      top: String(this.currentRowsTopPosition) + "px"
    });
  },

  updateVideoContent: function () {
    var keys = this.keys;
    console.log(focusedVideo);
    if (mediaContent[keys.gridSelection].type == "CREATORS") {
      if (focusedVideo.hasOwnProperty('playlist_id')) {
        fadeImage(focusedVideo.featured_image);
        var creator = focusedVideo.channel_name;
        $(".focused-content-info-title").text(focusedVideo.channel_name);
        $(".focused-content-info-desc-container span").html(
          focusedVideo.channel_description.replace(/\n/g, "<br/>")
        );

      } else {
        fadeImage(focusedVideo.thumbnail);
        var creator = focusedVideo.creator.channel_name;;
        $(".focused-content-info-title").text(focusedVideo.title);
        $(".focused-content-info-desc-container span").html(
          focusedVideo.description.replace(/\n/g, "<br/>")
        );

      }


    } else {
      fadeImage(focusedVideo.thumbnail);
      var creator = focusedVideo.creator.channel_name;;
      $(".focused-content-info-title").text(focusedVideo.title);
      $(".focused-content-info-desc-container span").html(
        focusedVideo.description.replace(/\n/g, "<br/>")
      );
    }

    $(".focused-content-info-creator").text(
      mediaContent[keys.gridSelection].type !== "playlists" ? creator : ""
    );


  },

  focusThumbnail: function () {
    var keys = this.keys;
    var thumbnail = {};
    var gridItemIndex = mediaContent[keys.gridSelection].gridItemSelection;
    var currentRow = $(this.id + " .media-grid-row")[keys.gridSelection];
    $("#media-grid-container .media-grid-row-title").addClass("invisible");
    $($(currentRow).find(".media-grid-row-title")).removeClass("invisible");

    $("#media-grid-container .swiper-prev-btn-container").addClass("invisible");
    $("#media-grid-container .swiper-next-btn-container").addClass("invisible");
    $($(currentRow).find(".swiper-prev-btn-container")).removeClass(
      "invisible"
    );
    $($(currentRow).find(".swiper-next-btn-container")).removeClass(
      "invisible"
    );
    if (
      keys.focusedPart === "episodeSelection" ||
      keys.focusedPart === "playButtonSelection" ||
      this.layout === "episodes"
    ) {
      thumbnail = $(this.id + " .thumbnail-container")[keys.episodeSelection];
    } else {
      thumbnail = $(currentRow).find(".thumbnail-container")[gridItemIndex];
    }

    $(this.id + " .media-grid-thumbnail").removeClass("focused-thumbnail");
    $($(thumbnail).find(".media-grid-thumbnail")).addClass("focused-thumbnail");
    $($(thumbnail).find(".video-title")).addClass("focused");
    $($(thumbnail).find(".video-description")).addClass("focused");
    $($(thumbnail).find(".video-duration")).addClass("focused");
  },

  unfocusThumbnails: function () {
    $(this.id + " .video-duration").removeClass("focused");
    $(this.id + " .video-description").removeClass("focused");
    $(this.id + " .video-title").removeClass("focused");
    $(this.id + " .media-grid-thumbnail").removeClass("focused-thumbnail");
  },

  resetMTWSection: function () {
    $("#mtw .episodes").css({ "margin-left": "0px" });
    $("#mtw .episodes").html("");
  },

  shiftRow: function () {
    var keys = this.keys;
    var row = [];
    var thumbnail = [];
    var newLeftPosition = 0;
    var itemIndex = 0;
    if (keys.focusedPart == "episodeSelection" || this.layout === "episodes") {
      row = $(this.id + " .media-grid-row-thumbnails");
      thumbnail = $(this.id + " .thumbnail-container")[keys.episodeSelection];
      itemIndex = keys.episodeSelection;
    } else {
      row = $(this.id + " .media-grid-row-thumbnails")[keys.gridSelection];
      thumbnail = $(row).find(".thumbnail-container")[0];
      itemIndex = mediaContent[keys.gridSelection].gridItemSelection;
    }
    newLeftPosition = rowLeftMargin - ($(thumbnail).width() + 12) * itemIndex;

    if (this.isFastCliked) animationTime = 0;
    else animationTime = 200;

    $(row).animate(
      { "margin-left": String(newLeftPosition) + "px" },
      animationTime
    );
  },

  rowIndex: function () {
    var keys = this.keys;
    return keys.gridSelection;
  },

  focusedThumbTouchesEdge() {
    var focusedThumbnail = $(this.id + " .focused-thumbnail")[0];
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

  lastThumbTouchesEdge: function () {
    var keys = this.keys;
    var _this = this;
    var thumbnails = [];
    var row = $(this.id + " .media-grid-row-thumbnails")[this.rowIndex()];
    if (keys.focusedPart == "episodeSelection" || this.layout === "episodes") {
      thumbnails = $(_this.id + " .thumbnail-container");
    } else {
      thumbnails = $(row).find(".thumbnail-container");
    }
    var thumbnail = thumbnails[thumbnails.length - 1];
    var htmlWidth = document.documentElement.clientWidth;
    var thumbnailRight = $(thumbnail).position().left + $(thumbnail).width();
    return thumbnailRight <= htmlWidth;
  },

  hoverEpisodeDescription: function () {
    this.keys.focusedPart = "playButtonSelection";
    this.unfocusThumbnails();
    $(this.id + " .play-button").removeClass("focused");
    descriptionModal.init("media-grid-page");
  },

  hoverPlayButton: function () {
    this.keys.focusedPart = "playButtonSelection";
    $(this.id + " .focused-content-info-desc-container").removeClass("focused");
    this.unfocusThumbnails();
    $(this.id + " .play-button").addClass("focused");
  },

  showEpisodeContents: function (id) {
    var title = focusedVideo.channel_name || "";
    var creator = focusedVideo.channel_name;
    var descriptionText = focusedVideo.channel_description || "";
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
      '<div class="focused-content-info-desc-container" onmouseenter="mediaGridPage.hoverEpisodeDescription()" onclick="descriptionModal.showQRModal()">' +
      '<span class="focused-content-info-description dark-theme ellipsis-text">' +
      descriptionText.replace(/\n/g, "<br/>") +
      "</span>" +
      "</div>" +
      '<div class="focused-content-info-button-container">' +
      '<button id = "play-video" class="play-button focused-content-info-button" onmouseenter="mediaGridPage.hoverPlayButton()" onclick="mediaGridPage.playVideo(1)">Play</button>' +
      "</div>" +
      "</div>";
    $(id + " .focused-content-info-container").html(html);
  },

  playVideo: function (prevRouteIndex) {
    var _this = this;
    var keys = this.keys;
    var vKeys = videoPlayerVariables.keys;
    console.log(vKeys);
    if (vKeys.focusedPart == "mtwSelection")
      focusedVideo = creatorPlaylist[vKeys.mtwSelection];
    var videoId = focusedVideo.playlist_id;
    collapseMTWSection();
    if (focusedVideo.hasOwnProperty('playlist_id')) {
      keys.focusedPart = "episodeSelection";
      showLoader();
      pauseVideo();
      hideVideoContainer();
      _this.id = "#playlist-episode-container";
      this.showEpisodeContents(_this.id);
      $("#media-grid-container").addClass("hidden");
      $(this.id + " .media-grid-rows-window").removeClass("inactive");
      var params = focusedVideo.oftv_handle;
      getEpisodes(params)
        .then(
          response_data => {
            console.log(response_data);
            var response = response_data.data.creator_playlist;

            var keys = this.keys;
            var pTitle = response_data.data.creator.channel_name;
            var episodes = response.items;
            console.log(episodes.length);
            if (episodes.length == 0) {
              showToast("Episode not found");
              hideLoader();
              this.goBack();
              return;
            }
            // console.log(episodes);
            saveData("episodes", episodes);
            focusedVideo = episodes[0];
            console.log(focusedVideo);
            keys.episodeSelection = 0;

            var itemHTML = "";
            episodes.map(function (item, index) {
              var tTitle = item.title;
              var creator = item.creator.channel_name;

              itemHTML +=
                '<div class="thumbnail-container" onmouseenter="mediaGridPage.hoverEpisode(' + index + ')" onclick="mediaGridPage.playVideo(1)">' +
                '<img src="' +
                item.thumbnail +
                '"  class="media-grid-thumbnail" />' +
                '<div class="video-title-container">' +
                '<p class="video-title ellipsis-text">' +
                tTitle +
                "</p>";

              itemHTML +=
                '<p class="video-description align-left ellipsis-text">' +
                creator +
                "</p>" +
                '<p class="video-duration align-right">' +
                formatDuration(item.duration) +
                "</p>" +
                "</div></div>";
            });

            var mediaGridHTML =
              '<div class="media-grid-row landscape" data-index="' +
              "index" +
              '">' +
              '<div class="media-grid-row-title-container">' +
              '<p class="media-grid-row-title dark-theme ellipsis-text">' +
              pTitle +
              "</p>" +
              "</div>" +
              '<div class="media-grid-row-thumbnails-container">' +
              '<div class = "swiper-prev-btn-container" onmouseleave="mediaGridPage.leaveNextButton(1)" onmouseenter="mediaGridPage.hoverNextButton(' + layout2 + ', -1)" onclick="mediaGridPage.clickNextButton(' + layout2 + ',0,-1)"><div class="swiper-prev-button"><img src = "images/playlist-left-arrow-blue.svg"></div></div>' +
              '<div class="media-grid-row-thumbnails">' +
              itemHTML +
              "</div>" +
              '<div class = "swiper-next-btn-container" onmouseleave="mediaGridPage.leaveNextButton(1)" onmouseenter="mediaGridPage.hoverNextButton(' + layout2 + ', 1)" onclick="mediaGridPage.clickNextButton(' + layout2 + ',0,1)"><div class="swiper-next-button"><img src = "images/playlist-right-arrow-blue.svg"></div></div>' +
              "</div>" +
              "</div>";

            $("#playlist-episode-container .media-grid-rows-container").html(
              mediaGridHTML
            );
            $("#playlist-episode-container .media-grid-rows-container").css({
              top: "0px"
            });
            this.updateVideoContent();
            mediaGridPage.focusThumbnail();

            $("#playlist-episode-container").removeClass("hidden");
            hideLoader();
          });
    } else {
      homePage.preview_video = false;
      $("#mtw .episodes").html("");
      var creatorName = focusedVideo.creator.channel_name;

      url = focusedVideo.video_src;
      mediaPlayer.init("my-video", currentRoute);
      if (currentRoute === "search-page" || prevRouteIndex === 0) {
        $("#search-container").addClass("hidden");
        videoPlayerVariables.init(url, searchPage.keys.focusedPart);
      } else videoPlayerVariables.init(url, keys.focusedPart);

    }
  },

  addCreatorPlaylist: function (creatorPlaylistData, prevRouteIndex) {
    var _this = this;
    var sortedcreatorPlaylistData = [...creatorPlaylistData];
    sortedcreatorPlaylistData.sort(compareDates);
    saveData("creatorPlaylist", sortedcreatorPlaylistData);
    _this.renderCreatorPlaylist(prevRouteIndex);
  },

  renderCreatorPlaylist: function (prevRouteIndex) {
    var newTrendingNow = []
    var firstEpisode = {}
    var creatorPlaylisLength = 0
    var trendingNow = mediaContent[mediaContent.length - 1].content;
    var videoIndex = this.getVideoIndex();
    if (videoIndex == 0) {
      creatorPlaylist.splice(videoIndex, 1);
      creatorPlaylist = creatorPlaylist.slice(0, mtwVideoCount);
      creatorPlaylisLength = creatorPlaylist.length;
      newTrendingNow = trendingNow.slice(
        0,
        mtwVideoCount - creatorPlaylisLength
      );
      creatorPlaylist = creatorPlaylist.concat(newTrendingNow);
      videoPlayerVariables.keys.mtwSelection = 0;
      this.isPrevVideo = false;
      this.isNextVideo = true;
      this.nextVideo = creatorPlaylist[0];
    } else if (videoIndex == creatorPlaylist.length - 1) {
      var prevEpisode = creatorPlaylist[creatorPlaylist.length - 2];
      newTrendingNow = trendingNow.slice(0, mtwVideoCount - 1);
      creatorPlaylist = [prevEpisode].concat(newTrendingNow);
      videoPlayerVariables.keys.mtwSelection = 1;
      this.isPrevVideo = true;
      this.isNextVideo = true;
      this.prevVideo = creatorPlaylist[0];
      this.nextVideo = creatorPlaylist[1];
    } else {
      if (videoIndex === -1) firstEpisode = creatorPlaylist[0];
      else firstEpisode = creatorPlaylist[videoIndex - 1];
      creatorPlaylist = [firstEpisode].concat(
        creatorPlaylist.slice(videoIndex + 1, creatorPlaylist.length)
      );
      creatorPlaylisLength = creatorPlaylist.length;
      newTrendingNow = trendingNow.slice(
        0,
        mtwVideoCount - creatorPlaylisLength
      );
      creatorPlaylist = creatorPlaylist.concat(newTrendingNow);
      videoPlayerVariables.keys.mtwSelection = 1;
      this.isPrevVideo = true;
      this.isNextVideo = true;
      this.prevVideo = creatorPlaylist[0];
      this.nextVideo = creatorPlaylist[1];
    }
    isPrevNextVideo();
    this.renderMTWView(prevRouteIndex);
  },

  renderMTWView: function (prevRouteIndex) {
    var itemHTML = "";
    this.resetMTWSection();
    creatorPlaylist.map(function (item, index) {
      var tTitle = item.title;
      var creator = getCreatorName(item);
      itemHTML +=
        '<div class="thumbnail-container" onmouseenter="videoPlayerVariables.hoverMTWVideo(' +
        index +
        ')" onclick="mediaGridPage.playVideo(' +
        prevRouteIndex +
        ')">' +
        '<img src="' +
        item.thumbnails[0].url +
        '"  class="media-grid-thumbnail" />' +
        '<div class="video-title-container">' +
        '<p class="video-title ellipsis-text">' +
        tTitle +
        "</p>";

      itemHTML +=
        '<p class="video-description align-left ellipsis-text">' +
        creator +
        "</p>" +
        '<p class="video-duration align-right">' +
        formatDuration(item.duration) +
        "</p>" +
        "</div></div>";
    });

    $("#mtw .episodes").html(itemHTML);
    hideLoader();
  },

  getVideoIndex: function () {
    var index = creatorPlaylist.findIndex(function (element) {
      return element._id === focusedVideo._id;
    });
    return index;
  },

  hoverNextButton: function (layout, increment) {
    var currentRow = [];
    this.keys.focusedPart = "nextBtnSelection";
    if (layout === "episodes")
      currentRow = $(
        "#playlist-episode-container .media-grid-row-thumbnails-container"
      );
    else if (layout === "mtw")
      currentRow = $("#mtw");
    else currentRow = $(this.id + " .media-grid-row")[layout];

    $(this.id + " .play-button").removeClass("focused");
    $(".focused-content-info-desc-container").removeClass("focused");
    $(".swiper-prev-btn-container").removeClass("active");
    $(".swiper-next-btn-container").removeClass("active");
    this.focusThumbnail();
    if (increment === -1) {
      $(currentRow).find(".swiper-prev-btn-container").addClass("active");
      this.nextBtnDom = $(currentRow).find(".swiper-prev-btn-container");
    } else {
      $(currentRow).find(".swiper-next-btn-container").addClass("active");
      this.nextBtnDom = $(currentRow).find(".swiper-next-btn-container");
    }
  },

  leaveNextButton: function (level) {
    $(".swiper-prev-btn-container").removeClass("active");
    $(".swiper-next-btn-container").removeClass("active");
    if (level === 0) this.keys.focusedPart = "gridSelection";
    else this.keys.focusedPart = "episodeSelection";
  },

  checkFastClick: function () {
    var currentBtnPressTime = Date.now();
    var timeDifference = currentBtnPressTime - this.previousBtnPressTime;
    if (timeDifference < 200) this.isFastCliked = true;
    else this.isFastCliked = false;

    this.previousBtnPressTime = currentBtnPressTime;
  },

  clickNextButton: function (layout, row, increment) {
    this.checkFastClick();
    this.layout = layout;
    var keys = this.keys;

    switch (layout) {
      case "swimlane":
        this.handleSwimlane(keys, row, increment);
        break;
      case "episodes":
        this.handleEpisodes(keys, increment);
        break;
      default:
        this.handleDefault(increment);
        break;
    }
  },

  handleSwimlane: function (keys, row, increment) {
    if (row === keys.gridSelection) {
      const gridItemSelection = mediaContent[keys.gridSelection].gridItemSelection + arrowStep * increment;
      keys.gridItemSelection = this.adjustSelection(gridItemSelection, 1);
      mediaContent[keys.gridSelection].gridItemSelection = keys.gridItemSelection;

      this.handleThumbnailFocusAndShift(arrowStep * increment, "video");
      this.updateVideoContent();
    }
  },

  handleEpisodes: function (keys, increment) {
    keys.episodeSelection += arrowStep * increment;
    keys.episodeSelection = this.adjustSelection(keys.episodeSelection, 2);

    this.handleThumbnailFocusAndShift(arrowStep * increment, "episode");
    this.updateVideoContent();
  },

  handleDefault: function (increment) {
    videoPlayerVariables.keys.mtwSelection += increment;
    videoPlayerVariables.shiftMTWThumbnail(increment);
  },

  adjustSelection: function (selection, type) {
    const length = this.getPlaylistLength(type);
    return Math.min(Math.max(selection, 0), length - 1);
  },

  handleThumbnailFocusAndShift: function (increment, videoType) {
    this.unfocusThumbnails();
    this.focusThumbnail();

    if ((increment > 0 && !this.lastThumbTouchesEdge()) || (increment < 0 && this.focusedThumbTouchesEdge())) {
      this.shiftRow();
    }

    this.updateFocusedVideo(videoType);
  },

  hoverGridItem: function (row, i) {
    var keys = this.keys;
    if (keys.gridSelection == row) {
      keys.gridSelection = row;
      keys.gridItemSelection = i;
      homePage.preview_video = false;
      pauseVideo();
      homePage.hideSliderSection();
      hideVideoContainer();
      homePage.showMediaGridContents();
      mediaContent[mediaGridPage.keys.gridSelection].gridItemSelection = i;
      this.keys.episodeSelection = 0;
      focusedVideo = mediaContent[row].items[i];
      this.unfocusThumbnails();
      this.focusThumbnail();
      this.updateVideoContent();
      currentRoute = "media-grid-page";
      $(".focused-content-info-desc-container").removeClass("focused");
    }
  },

  hoverEpisode: function (index) {
    var keys = this.keys;
    this.layout = "episodes"
    keys.episodeSelection = index;
    keys.episodeSelection = this.adjustSelection(keys.episodeSelection, 2);

    $(this.id + " .play-button").removeClass("focused");
    $(".focused-content-info-desc-container").removeClass("focused");
    this.keys.focusedPart = "episodeSelection";
    navPage.collapse("media-grid-page");
    currentRoute = "media-grid-page";

    this.unfocusThumbnails();
    this.focusThumbnail();
    this.updateFocusedVideo("episodes");
    this.updateVideoContent();
  },

  updateFocusedVideo: function (type) {
    var keys = this.keys;
    if (type == "video") {
      var row = mediaContent[keys.gridSelection].items;
      console.log(row);
      var gridItemSelection = getGridItemSelection();
      console.log(gridItemSelection);
      focusedVideo = row[gridItemSelection];
    } else {
      focusedVideo = episodes[keys.episodeSelection];
    }
    console.log(focusedVideo);
  },

  goBack: function () {
    var keys = this.keys;
    if (keys.focusedPart === "gridSelection") {
      turnOffModal.init("media-grid-page");
    } else {
      if (this.prevRoute === "creators-page") {
        $("#playlist-episode-container").addClass("hidden");
        $("#creators-container").removeClass("hidden");
        currentRoute = this.prevRoute;
      } else if (this.prevRoute === "search-page") {
        $("#playlist-episode-container").addClass("hidden");
        $("#search-container").removeClass("hidden");
        currentRoute = this.prevRoute;
      } else if (
        keys.focusedPart === "episodeSelection" ||
        keys.focusedPart === "playButtonSelection"
      ) {
        $("#playlist-episode-container").addClass("hidden");
        $("#media-grid-container").removeClass("hidden");
        this.id = "#media-grid-container";
        keys.focusedPart = "gridSelection";
        this.updateFocusedVideo("video");
        this.focusThumbnail();
        this.updateVideoContent();
      }
    }
  },

  getPlaylistLength: function (level) {
    var thumbnails = [];
    if (level === 1) {
      var row = $(this.id + " .media-grid-row .media-grid-row-thumbnails")[
        this.rowIndex()
      ];
      thumbnails = $(row).find(".thumbnail-container");
    } else {
      thumbnails = $(this.id + " .thumbnail-container");
    }
    return thumbnails.length;
  },

  handleMenuLeftRight: function (increment) {
    var keys = this.keys;
    switch (keys.focusedPart) {
      case "gridSelection":
        keys.gridItemSelection =
          mediaContent[keys.gridSelection].gridItemSelection;
        keys.gridItemSelection += increment;
        mediaContent[keys.gridSelection].gridItemSelection =
          keys.gridItemSelection;
        var playlistLength = this.getPlaylistLength(1);
        if (keys.gridItemSelection < 0) {
          keys.gridItemSelection = 0;
          mediaContent[keys.gridSelection].gridItemSelection = 0;
          currentRoute = "nav-page";
          this.unfocusThumbnails();
          navPage.expand("media-grid-page");
          return;
        } else if (keys.gridItemSelection > playlistLength - 1) {
          keys.gridItemSelection = playlistLength - 1;
          mediaContent[keys.gridSelection].gridItemSelection =
            playlistLength - 1;
          return;
        } else {
          this.checkFastClick();
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
        this.updateFocusedVideo("video");
        this.updateVideoContent();
        break;
      case "episodeSelection":
        keys.episodeSelection += increment;
        var episodesLength = this.getPlaylistLength(2);
        if (keys.episodeSelection < 0) {
          keys.episodeSelection = 0;
          currentRoute = "nav-page";
          this.unfocusThumbnails();
          navPage.expand("media-grid-page");
          return;
        } else if (keys.episodeSelection > episodesLength - 1) {
          keys.episodeSelection = episodesLength - 1;
          return;
        } else {
          this.checkFastClick();
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
        this.updateFocusedVideo("episode");
        this.updateVideoContent();
        break;
    }
  },

  handleMenusUpDown: function (increment) {
    var keys = this.keys;
    switch (keys.focusedPart) {
      case "gridSelection":
        keys.gridItemSelection = 0;
        keys.gridSelection += increment;
        if (increment < 0 && keys.gridSelection < 0) {
          keys.gridSelection = 0;
          $(".media-grid-row-title-container").addClass("hidden");
          $(".focused-content-info-container").addClass("inactive");
          $(this.id + " .large-thumbnail-container").addClass("invisible");
          $(this.id + " .media-grid-rows-window").addClass("inactive");
          $(".sliders-dots-container").removeClass("hidden");
          $(".slideshow-container").removeClass("hidden");
          $(".focused-content-info-button-container").removeClass("invisible");

          this.unfocusThumbnails();
          focusedVideo = sliders[homePage.keys.sliderSelection];
          homePage.playSliderVideo();
          homePage.showSliderContents();
          homePage.focusSlider();
          currentRoute = "home-page";
        } else if (
          keys.gridSelection >
          $(this.id + " .media-grid-row").length - 1
        ) {
          keys.gridSelection = $(this.id + " .media-grid-row").length - 1;
          return;
        } else {
          if (isPlaying) {
            pauseVideo();
            hideVideoContainer();
          }
          var gridItemSelection = getGridItemSelection();
          console.log(gridItemSelection);
          focusedVideo =
            mediaContent[keys.gridSelection].items[gridItemSelection];
          this.shiftRowsUpDown(increment);
          this.updateVideoContent();
          this.focusThumbnail();
        }
        break;
      case "episodeSelection":
        keys.focusedPart = "playButtonSelection";
        if (increment < 0) {
          this.unfocusThumbnails();
          $(this.id + " .play-button").addClass("focused");
        }
        break;
      case "playButtonSelection":
        if (increment > 0) {
          keys.focusedPart = "episodeSelection";
          $(this.id + " .play-button").removeClass("focused");
          this.focusThumbnail();
        } else {
          $(this.id + " .play-button").removeClass("focused");
          this.unfocusThumbnails();
          descriptionModal.init("media-grid-page");
        }
        break;
    }
  },

  handleMenuClick: function () {
    var keys = this.keys;
    var _this = this;
    var thumbnail = "";
    if (keys.focusedPart == "gridSelection") {
      var currentRow = $(this.id + " .media-grid-row")[keys.gridSelection];
      thumbnail = $(currentRow).find(".thumbnail-container")[
        keys.gridItemSelection
      ];

      $(thumbnail).trigger("click");
    } else if (keys.focusedPart === "nextBtnSelection") {
      $(_this.nextBtnDom).trigger("click");
    } else {
      thumbnail = $("#playlist-episode-container .thumbnail-container")[
        keys.episodeSelection
      ];

      $(thumbnail).trigger("click");
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
