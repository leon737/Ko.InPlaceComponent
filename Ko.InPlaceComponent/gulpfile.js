"use strict";

var gulp = require("gulp"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    uglify = require("gulp-uglify"),
    babel = require("gulp-babel"),
    sourcemaps = require("gulp-sourcemaps"),
    rename = require("gulp-rename"),
    gutil = require("gulp-util"),
    watch = require("gulp-watch"),
    plumber = require("gulp-plumber"),
    amdOptimize = require('gulp-amd-optimizer');

var paths = {
    webroot: "./wwwroot/",
    dist: "../dist/"
};
const component = 'ko.inplace.component';
paths.base = `${paths.webroot}/scripts`;
paths.scriptsroot = `${paths.base}/${component}`;
paths.js = paths.scriptsroot + "**/*.js";
paths.main = `${paths.scriptsroot}/binding.js`;
const shouldMinify = true;

function processJsTask(path, root, dest) {
    let flow =
        gulp.src(path, {
            base: root
        })
             .pipe(amdOptimize({
                 baseUrl: paths.base,

             }))
            .pipe(concat(`${component}.min.js`))
            .pipe(plumber())
            .pipe(babel({
                minified: shouldMinify,
                presets: ["env"]
            }))
            .on("error", function (err) {
                gutil.log(gutil.colors.red("[Error]"), err.toString());
            });
    if (shouldMinify)
        flow = flow.pipe(uglify({
            mangle: {
                except: ['require']
            }
        }))
            .on("error", function (err) {
                gutil.log(gutil.colors.red("[Error]"), err.toString());
            });

    return flow.pipe(gulp.dest(dest));
}


gulp.task("min:js", function () {
    return processJsTask(paths.js, paths.scriptsroot, paths.dist);
});

gulp.task("build", ['min:js']);

gulp.task("watch", ['watch:js']);

gulp.task("watch:js", function () {
    return watch(paths.js, function () {
        gulp.start("min:js");
    });
});
