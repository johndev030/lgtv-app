var showModel = function (args) {
    var _this = this;
    this.id = args.metadata["oftv_show-field--root_playlist_id"][0];
    this.title = CommonHelpers.htmlDecode(args.title.rendered) || "";
    this.thumbnails = args.metadata["oftv_show-field--profile_image_srcset"];

    this.getThumbnailUrl = function (required_size) {
        var url = null;
        var size = 0;
        for (const item in _this.thumbnails) {
            var thumbnail = _this.thumbnails[item];
            if (thumbnail.width == thumbnail.height && Math.abs(thumbnail.width - required_size) < Math.abs(size - required_size)) {
                size = thumbnail.width;
                url = thumbnail.source_url;
            }
        }
        return url || appDefaults.thumbnailUrl;
    };


    this.thumbnailUrl = this.getThumbnailUrl(200);
    this.largeThumbnailUrl = args.metadata["oftv_show-field--zype_image_480"][0];
};
