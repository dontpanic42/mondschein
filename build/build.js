({
    //appDir: '../',
    baseUrl: '../public/js',
    //dir: '../../deploy',

    optimize: 'uglify',

    out: '../public/js/mondschein.min.js',

    mainConfigFile: '../public/js/mondschein.js',

    name: 'mondschein',

    //exclude .git, .DS_Store etc
    fileExclusionRegExp: /^\./
})
