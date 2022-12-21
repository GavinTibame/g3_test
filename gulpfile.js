const {
    src,
    dest,
    series,
    parallel,
    watch
} = require('gulp');

function defaultTask(cb) {
    console.log("gulp 4 success");
    cb();
}
// exports.後面可以自定義，寫好後可以在terminal用gulp 自定義 去執行
exports.do = defaultTask

function TaskA(cb) {
    console.log("A");
    cb();
}
function TaskB(cb) {
    console.log("B");
    cb();
}
function TaskC(cb) {
    console.log("C");
    cb();
}
function TaskD(cb) {
    console.log("D");
    cb();
}

function TaskE(cb) {
    console.log("E");
    cb();
}
// 排序執行 series()
exports.async = series(TaskA, TaskB);

// 同時執行 parallel()
// exports.sync = parallel(TaskA, TaskB, TaskC, TaskD, TaskE);

exports.all = series(TaskA, TaskB, parallel(TaskC, TaskD), TaskE);

// 從 src 來源 pipe 到 dest 目的地

function move() {
    return src("src/index.html").pipe(dest("dist"));
}

exports.move = move;

const uglify = require("gulp-uglify"),
    rename = require("gulp-rename"),
    cleanCSS = require("gulp-clean-css");

function cssMinify() {
    return src("css/*.css").pipe(cleanCSS()).pipe(dest("dist/css"));
}

exports.zipCSS = cssMinify;

function jsMinify() {
    return src("js/*.js").pipe(uglify()).pipe(dest("dist/js"));
}
exports.zipJS = jsMinify;

const sass = require("gulp-sass")(require("sass"));

function sassMinify() {
    return src("src/sass/*.scss")
        .pipe(sass.sync().on("error", sass.logError)) // convect
        .pipe(cleanCSS()) // zip
        .pipe(rename({ extname: ".min.css" })) // rename
        .pipe(dest("dist/css"));
}
exports.zipSCSS = sassMinify;

const fileInclude = require("gulp-file-include");

function htmlMinify() {
    return src("src/*.html")
        .pipe(fileInclude({
            prefix: "@@", basepath: "@file"
        }))
        .pipe(dest("dist/"));
}

function layoutMinify() {
    return src("src/**/*.html")
        .pipe(fileInclude({
            prefix: "@@", basepath: "@file"
        }))
        .pipe(dest("dist/"));
}

exports.template = htmlMinify;

exports.layout = layoutMinify;

function imgMove() {
    return src("src/img/*.*").pipe(dest("dist/img"))
}

const browserSync = require('browser-sync'),
    reload = browserSync.reload;

function browser(done) {
    browserSync.init({
        server: {
            baseDir: "./dist",
            index: "index.html"
        },
        port: 3000
    });
    watch(["src/*.html", "src/**/*.html"], htmlMinify).on("change", reload)
    watch(["src/sass/*.scss", "src/sass/**/*.scss"], sassMinify).on("change", reload)
    watch("js/*.js", jsMinify).on("change", reload)
    watch("src/img/*.*", imgMove).on("change", reload)
    done();
}

// 開發時的實時打包
exports.default = browser;

function watchFile() {
    // 要分開path
    watch(["src/*.html", "src/**/*.html"], htmlMinify)
    watch(["src/sass/*.scss", "src/sass/**/*.scss"], sassMinify)
    watch("js/*.js", jsMinify)
    watch("src/img/*.*", imgMove)
}

exports.watch = watchFile;

// 開發完成後的打包
exports.package = parallel(htmlMinify, sassMinify, jsMinify, imgMove);

