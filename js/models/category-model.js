var CategoryModel = function (args) {
    this.id = args.id;
    this.title = CommonHelpers.htmlDecode(args.name) || "";
    this.link = args.link;
};
