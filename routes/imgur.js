var http = require('https');
var clientKey = 'eb077345a0ec708';
var secretKey = 'a88a5bfc3db65fbb4698ae6c9b3c3a530edde77c';
var apiVersion = 3;

var url = "api.imgur.com";

var endpoints = {
	albumInfo: '/album/:id',
	albumImages: '/album/:id/images'
};

function imgurRequest(uri, callback) {
	var options = {
		host: url,
		path: '/' + apiVersion + uri,
		headers: {
			Authorization: 'Client-ID ' + clientKey
		}
	};

	console.log(options.host + options.path)

	http.get(options, function(response) {
		var data = '';
		response.on('data', function(chunk) {
	 		data += chunk;
	 	});

	 	response.on('end', function() {
	 		try {
	 			console.log(data);
	 			callback(response.statusCode, response.headers, JSON.parse(data));
	 		} catch(e) {
	 			console.log(e);
	 			console.log(data);
	 			callback(response.statusCode, response.headers, {});
	 		}
	 	})
	});
}

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function isImgurLink(str) {
	return (str.indexOf('imgur') == -1)? false : true;
}

function isDirectLink(str) {
	var suffixes =[
		'.jpg',
		'.jpeg',
		'.gif',
		'.png',
		'.bmp'
	];

	for(var i = 0; i < suffixes.length; i++)
		if(endsWith(str, suffixes[i])) return true;

	return false;
}

function getAlbumId(link) {
	var i = link.lastIndexOf('/');
	return link.substring(i + 1);
}

function createThumbnailLink(link) {
	var suffixi = link.lastIndexOf('.');
	if(suffixi == -1) return 'img/unknown.gif';

	var linkpre = link.substring(0, suffixi);
	var suffix  = link.substring(suffixi);
	return linkpre + 'm' + suffix;
}

/**
 Returns: 

 {
	image: link_to_image,
	link: original link,
	isGallery: true|false
 }

 */
exports.getSyncLinkInfo = function(link) {
	var result = {
		image: 'img/unknown.gif',
		thumb: 'img/unknown.gif',
		link: link,
		isGallery: false,
		albumid: 0,
	};

	//link is gallery...
	if(link.indexOf('/a/') != -1) {
		result.isGallery = true;
		result.albumid = getAlbumId(link);
		return result;
	} else {
	//link is image
		result.image = (isDirectLink(link))?
			link :
			link + '.jpg';
		result.thumb = isImgurLink(link)?
							createThumbnailLink(result.image) :
							result.image;
		return result;
	}
};

exports.getAlbumInfo = function(albumId, callback) {
	imgurRequest(endpoints.albumInfo.replace(':id', albumId), 
		function(status, headers, body) {
		if(status !== 200) body = {};
		callback(body);
	});
};

exports.getAlbumImages = function(albumId, callback) {
	imgurRequest(endpoints.albumInfo.replace(':id', albumId), 
		function(status, headers, body) {
		if(status !== 200) body = {};

	 	var ar = body.data.images;
		if(ar.length) {
			for(var i = 0; i < ar.length; i++) {
				ar[i].thumb = createThumbnailLink(ar[i].link);
			}
		}

		callback(ar);
	});
};