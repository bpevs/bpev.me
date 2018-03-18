// include the required packages.
const gulp = require("gulp");
const stylus = require("gulp-stylus");


gulp.task("default", function () {
  return gulp.src("./source/**/*.styl")
    .pipe(stylus({
      compress: true
    }))
    .pipe(gulp.dest("./build"));
});
