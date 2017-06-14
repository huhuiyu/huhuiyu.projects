//核心插件===============================================
const gulp = require("gulp");
const del = require("del");
const jshint = require("gulp-jshint");
const uglify = require("gulp-uglify");
const plumber = require("gulp-plumber");
const concat = require("gulp-concat");
const cssmin = require("gulp-clean-css");
const fileSync = require("gulp-file-sync");
const watch = require("gulp-watch");
const fs = require("fs");

// 目录信息
const baseDir = (__dirname).replace(/[\\]/g, "/") + "/";
const srcDir = baseDir + "src/";
const jsSrcDir = srcDir + "js/";
const cssSrcDir = srcDir + "css/";
const htmlSrcDir = srcDir + "html/";
const imgDir = srcDir + "images/";

const libDir = baseDir + "lib/";
const jsLibDir = libDir + "js/";
const cssLibDir = libDir + "css/";
const fontsDir = libDir + "fonts/";

const distDir = baseDir + "dist/";
const jsDistDir = distDir + "js/";
const cssDistDir = distDir + "css/";
const imgDistDir = distDir + "images/";
const fontsDistDir = distDir + "fonts/";

// 任务定义================================================
/* 默认任务 */
gulp.task("default", function() {
	console.log("胡辉煜的网站");
});

/* 清理发布目录 */
gulp.task("clean", function() {
	console.log("开始清除发布目录");
	del.sync([ distDir + "**/*" ], {
		force : true
	});
	console.log("清除发布目录完毕");
});

/* js语法检查 */
gulp.task("jshint", function() {
	console.log("检查js语法");
	return gulp.src(jsSrcDir + "**/*.js").pipe(jshint()).pipe(jshint.reporter("default"));
});

/* 项目js文件打包 */
gulp.task("jsmin", function() {
	console.log("处理js压缩");
	var jsfile = [];
	jsfile.push(jsSrcDir + "config.js");
	jsfile.push(jsSrcDir + "app.js");
	jsfile.push(jsSrcDir + "angular/**/*.js");
	jsfile.push(jsSrcDir + "startup.js");

	return gulp.src(jsfile).pipe(plumber()).pipe(concat("app.min.js")).pipe(uglify()).pipe(plumber.stop()).pipe(
			gulp.dest(jsDistDir));
});

/* 项目css文件打包 */
gulp.task("cssmin", function() {
	console.log("处理css压缩");
	var cssfile = [];
	cssfile.push(cssSrcDir + "*.css");
	return gulp.src(cssfile).pipe(plumber()).pipe(concat("app.min.css")).pipe(cssmin()).pipe(plumber.stop()).pipe(
			gulp.dest(cssDistDir));
});

/* 项目依赖的js文件打包 */
gulp.task("jslib", function() {
	console.log("处理js依赖文件");
	var jsfile = [];
	jsfile.push(jsLibDir + "jquery.min.js");
	jsfile.push(jsLibDir + "bootstrap.min.js");
	jsfile.push(jsLibDir + "angular.min.js");
	jsfile.push(jsLibDir + "angular-*.min.js");
	return gulp.src(jsfile).pipe(concat("lib.min.js")).pipe(gulp.dest(jsDistDir));
});

/* 项目依赖的css文件打包 */
gulp.task("csslib", function() {
	console.log("处理css依赖文件");
	var cssfile = [];
	cssfile.push(cssLibDir + "*.css");
	return gulp.src(cssfile).pipe(concat("lib.min.css")).pipe(gulp.dest(cssDistDir));
});

/* 处理html */
gulp.task("html", function() {
	console.log("处理html");
	return gulp.src([ htmlSrcDir + "**/*" ]).pipe(gulp.dest(distDir));
});

/* 处理images */
gulp.task("images", function() {
	console.log("处理图片");
	return gulp.src([ imgDir + "**/*" ]).pipe(gulp.dest(imgDistDir));
});

/* 处理fonts */
gulp.task("fonts", function() {
	console.log("处理字体");
	return gulp.src([ fontsDir + "**/*" ]).pipe(gulp.dest(fontsDistDir));
});

/* 开发文件监测 */
gulp.task("watch", function() {

	var processSrcWatch = function(w, t) {
		w.on("change", function(file) {
			gulp.start(t);
		});
		w.on("add", function(file) {
			gulp.start(t);
		});
		w.on("unlink", function(file) {
			gulp.start(t);
		});
	};

	var processFileWatch = function(w, s, d, needIgnore) {
		var fileChangeSync = function(file) {
			var nfile = file.replace(/[\\]/g, "/");
			console.log("改变的文件：", nfile);
			if (needIgnore === true) {
				fileSync(s, d, {
					ignore : function(dir, file) {
						var synfile = dir + file + "/";
						// console.log("同步的文件：", synfile);
						return (synfile == jsDistDir) || (synfile == cssDistDir) || (synfile == imgDistDir);
					}
				});
			} else {
				fileSync(s, d);
			}

		};
		w.on("change", fileChangeSync);
		w.on("add", fileChangeSync);
		w.on("unlink", fileChangeSync);
	};

	processSrcWatch(watch(jsSrcDir + "**/*"), "jsmin");
	processSrcWatch(watch(cssSrcDir + "**/*"), "cssmin");

	processFileWatch(watch(htmlSrcDir + "**/*"), htmlSrcDir, distDir, true);
	processFileWatch(watch(imgDir + "**/*"), imgDir, imgDistDir);

});

gulp.task("build", [ "clean", "jshint", "jsmin", "cssmin", "jslib", "csslib", "html", "images", "fonts" ], function() {
	console.log("发布完成");
});
