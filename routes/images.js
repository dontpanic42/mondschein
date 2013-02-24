var imgur = require ('./imgur');

exports.appendPreviewInfo = function(info) {
	var result = imgur.getSyncLinkInfo(info.link);

	info.image = result.image;
	info.link = result.link;
	info.isGallery = result.isGallery;
	info.thumb = result.thumb;
	info.albumid = result.albumid;

	return info;
}