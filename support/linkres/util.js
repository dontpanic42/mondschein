var fileExtensionRegex = /.+\.([^?]+)(\?|$)/;

var fileExtensionsSupported = [
       'gif',
       'jpg',
       'jpeg',
       'png',
       'bmp'
];

exports.getFileExtension = function(link) {
    var ex;
    if( (ex = link.match(fileExtensionRegex)) ) 
        return ex[1];
    return void(0);
}

exports.isSupportedImage = function(link) {
    var ex = exports.getFileExtension(link.toLowerCase());
    return(fileExtensionsSupported.indexOf(ex) == -1)? false : true;
}

exports.extend = function(a, b) {
    for(var i in b)
        a[i] = b[i];

    return a;
}
