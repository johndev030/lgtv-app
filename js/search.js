/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
var searchPage = {
  keys: {
    focusedPart: "searchBar",
    videoSelection: 0
  },
  id: "#search-container",
  videosPerRow: 4,
  searchKeyTimout: 400,
  searchKeyTimer: 0,
  lastQuery: null,
  videos: [],
  isKeyPressed: false,
  allVideos: [],
  timerId: 0,
  prevSelection: "",

  init: function () {
    currentRoute = "search-page";
    this.initVariables();
    this.hideHomeContents();
    this.activeInput();
    this.showVideos("");
  },

  hideHomeContents: function () {
    pauseVideo();
    $("#media-grid-container").addClass("hidden");
    $("#playlist-episode-container").addClass("hidden");
    $("#video-container").addClass("hidden");
    $("#creators-container").addClass("hidden");
  },

  focusInput: function () {
    $(this.id + " .query-input").focus();
  },

  activeInput: function () {
    $(this.id + " .query-input").addClass("active");
  },

  blurInput: function () {
    $(this.id + " .query-input").blur();
    $(this.id + " .query-input").removeClass("active");
  },

  initVariables: function () {
    this.keys.videoSelection = 0;
    this.keys.focusedPart = "searchBar";
    $(this.id + " .query-input").val("");

    if (this.allVideos.length) saveData("videos", this.allVideos);
    else this.allVideos = videos;

    $(this.id + " .media-grid-rows-container").css("top", 0);
    $(this.id + " .categories-grid-row").css(
      "margin-left",
      rowLeftMargin + "px"
    );
  },

  showVideos: function (query) {
    var _this = this;
    this.lastQuery = query;
    showLoader();
    ZypeApiHelpers.searchVideos(query).then(
      videos => {
        console.log('videos', videos)
        saveData("videos", videos);
        _this.renderVidoes(videos);
        hideLoader();
      },
      err => { console.error("Error occurred:", err); }
    );
  },

  renderVidoes: function (videos) {
    var data = [];
    var i = 0;
    while (i < videos.length) {
      var row = [];
      while (i < videos.length && row.length < this.videosPerRow) {
        row.push(videos[i]);
        i++;
      }
      data.push({ content: row });
    }
    $("#search-container .media-grid-rows-container").html("");
    focusedVideo = videos[0];
    $("#search-container").removeClass("hidden");
    if (data.length)
      data.map(function (content, index) {
        var itemHTML = "";
        content.content.map(function (item, col) {
          var creator = getCreatorName(item);
          itemHTML +=
            '<div class="thumbnail-container" onmouseenter="searchPage.hoverVideo(' +
            index +
            ", " +
            col +
            ')" onclick="mediaGridPage.playVideo(0)">' +
            '<img src="' +
            item.thumbnails[0].url +
            '" onerror="this.src=\'' +
            defaultThumbnailUrl +
            '\'" class="media-grid-thumbnail" />' +
            '<div class="video-title-container">' +
            '<p class="video-title ellipsis-text">' +
            item.title +
            '</p><p class="video-description align-left ellipsis-text">' +
            creator +
            '</p><p class="video-duration align-right">' +
            formatDuration(item.duration) +
            "</p></div></div>";
        });

        var mediaGridHTML =
          '<div class="media-grid-row-thumbnails" data-index="' +
          index +
          '">' +
          itemHTML +
          "</div>";

        $("#search-container .media-grid-rows-container").append(mediaGridHTML);
      });
    else {
      var html = '<div class = "result">No Results - Try another search</div>';
      $("#search-container .media-grid-rows-container").html(html);
    }
  },

  focusNavigation: function (prevSelection) {
    this.prevSelection = prevSelection;
    this.blurInput();
    this.unfocusVideos();
    navPage.expand(currentRoute);
    this.isExpand = true;
    currentRoute = "nav-page";
  },

  unfocusNavigation: function () {
    navPage.collapse(currentRoute);
  },

  unfocusVideos: function () {
    $(this.id + " .video-duration").removeClass("focused");
    $(this.id + " .video-description").removeClass("focused");
    $(this.id + " .video-title").removeClass("focused");
    $(this.id + " .media-grid-thumbnail").removeClass("focused-thumbnail");
  },

  setFocusedVideo: function () {
    this.unfocusVideos();
    this.focusVideo();
    this.moveVideoContainer();
  },

  focusVideo: function () {
    var keys = this.keys;
    var thumbnail = $(this.id).find(" .thumbnail-container")[
      this.keys.videoSelection
    ];
    $($(thumbnail).find(".media-grid-thumbnail")).addClass("focused-thumbnail");
    $($(thumbnail).find(".video-title")).addClass("focused");
    $($(thumbnail).find(".video-description")).addClass("focused");
    $($(thumbnail).find(".video-duration")).addClass("focused");
    focusedVideo = videos[keys.videoSelection];
  },

  moveVideoContainer: function () {
    var rowIndex = Math.floor(this.keys.videoSelection / this.videosPerRow);
    var videosContainer = $(this.id + " .media-grid-rows-container")[0];
    var videoRow = $(videosContainer).find(" .media-grid-row-thumbnails")[0];
    var videoThumbnailHeight = $(videoRow).outerHeight();
    var newTop = -((rowIndex - 1) * videoThumbnailHeight);

    if (this.keys.videoSelection < this.videosPerRow) newTop = 0;

    if (this.isKeyPressed) animationTime = 0;
    else animationTime = 200;

    $(videosContainer).animate(
      {
        top: String(newTop) + "px"
      },
      animationTime
    );
  },

  isFirstVideoRow: function () {
    return this.keys.videoSelection < this.videosPerRow;
  },

  setFocusedPrevRowVideo: function () {
    var keys = this.keys;
    keys.videoSelection -= this.videosPerRow;
    this.setFocusedVideo();
  },

  setFocusedNextRowVideo: function () {
    var keys = this.keys;
    keys.videoSelection += this.videosPerRow;
    if (videos[keys.videoSelection]) {
      this.setFocusedVideo();
    } else {
      keys.videoSelection = videos.length - 1;
      this.setFocusedVideo();
    }
  },

  searchValueChange: function () {
    clearTimeout(this.searchKeyTimer);
    var _this = this;
    this.searchKeyTimer = setTimeout(function () {
      var query = $(_this.id + " .query-input").val();
      if (query !== _this.lastQuery) {
        _this.showVideos(query);
        _this.lastQuery = query;
        _this.keys.videoSelection = 0;
        $(_this.id + " .query-input").blur();
      }
    }, this.searchKeyTimout);
  },

  hoverSearchBar: function () {
    this.keys.focusedPart = "searchBar";
    this.unfocusVideos();
    this.activeInput();
  },

  hoverVideo: function (row, col) {
    if (!isKeyboard) {
      var keys = this.keys;
      keys.focusedPart = "videoSelection";
      keys.videoSelection = this.videosPerRow * row + col;
      this.unfocusVideos();
      this.focusVideo();
      this.blurInput();
    }
  },

  goBack: function () {
    $("#search-container").addClass("hidden");
    $("#media-grid-container").removeClass("hidden");

    currentRoute = "home-page";
    homePage.init();
  },

  handleMenuLeftRight: function (increment) {
    var keys = this.keys;
    switch (keys.focusedPart) {
      case "searchBar":
        if (!isKeyboard) {
          if (increment > 0) this.unfocusNavigation();
          else this.focusNavigation(keys.focusedPart);
        }
        break;
      case "videoSelection":
        if (keys.videoSelection % this.videosPerRow == 0 && increment < 0) {
          this.focusNavigation(keys.focusedPart);
          return;
        }
        keys.videoSelection += increment;
        if (increment < 0 && keys.videoSelection < 0) {
          keys.videoSelection = 0;
          this.focusNavigation(keys.focusedPart);
        } else {
          if (!videos[keys.videoSelection]) {
            keys.videoSelection = videos.length - 1;
          } else {
            if (
              keys.videoSelection > -1 &&
              keys.videoSelection < this.videosPerRow
            ) {
              this.unfocusVideos();
              this.focusVideo();
            } else {
              this.setFocusedVideo();
            }
          }
        }
        break;
    }
  },

  handleMenuClick: function () {
    var keys = this.keys;
    switch (keys.focusedPart) {
      case "searchBar":
        this.focusInput();
        break;
      case "videoSelection":
        var currentVideo = $(this.id).find(" .thumbnail-container")[
          this.keys.videoSelection
        ];
        $(currentVideo).trigger("click");
        break;
    }
  },

  handleMenusUpDown: function (increment) {
    var keys = this.keys;

    switch (keys.focusedPart) {
      case "searchBar":
        if (increment > 0) {
          keys.videoSelection = 0;
          this.setFocusedVideo();
          this.blurInput();
          keys.focusedPart = "videoSelection";
        }
        break;

      case "videoSelection":
        if (increment > 0) this.setFocusedNextRowVideo();
        else {
          if (this.isFirstVideoRow()) {
            this.unfocusVideos();
            this.activeInput();
            keys.focusedPart = "searchBar";
          } else {
            if (
              keys.videoSelection > 0 &&
              keys.videoSelection < 2 * this.videosPerRow
            ) {
              keys.videoSelection -= this.videosPerRow;
              this.unfocusVideos();
              this.focusVideo();
            } else this.setFocusedPrevRowVideo();
          }
        }
        break;
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
