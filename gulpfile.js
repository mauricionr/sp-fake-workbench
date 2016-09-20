"use strict";

const gulp = require("gulp"),
    spsave = require("gulp-spsave"),
    argv  = require('yargs').argv;

try {
    global.settings = require("./settings.js");
} catch (e) {
    global.settings = { username: "", password: "", siteUrl: "", folder: "" };
}

gulp.task("upload", () => {
    console.log(argv.component)
    if (global.settings.spsave.siteUrl === "") {
        throw "A required custom 'settings.js' file is not present in root of this repository. Make a copy of settings.example.js, rename it as settings.js, and fill out the appropriate settings for your site.";
    }
    if (!argv.component) {
        throw "Tell me wich component to upload"
    }
    console.log(`Starting ${argv.component}`)
    return gulp.src(`./components/${argv.component}/**`)
        .pipe(spsave({
            username: global.settings.spsave.username,
            password: global.settings.spsave.password,
            siteUrl: global.settings.spsave.siteUrl,
            folder: `Style Library/components/${argv.component}`,
            checkin: true,
            checkinType: 1
        }));
});

gulp.task("watch", function(){
    if(!argv.component) throw `Tell which component to watch`
    console.log(`Watching ${argv.component}`)
    gulp.watch([`components/${argv.component}/*.*`], ["upload"]);
});