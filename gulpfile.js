// Include gulp
var gulp = require('gulp'); 

// Include Our Plugins
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

// Lint Task
gulp.task('lint', function() {
    return gulp.src('js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src('scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('css'));
});


//copy dependencies
//TODO: this...
// see example for injecting multiple source streams
// https://www.npmjs.org/package/gulp-inject


//inject dependencies
// gulp.task('inject', function () {
//   var target = gulp.src('index.html');
//   var sources = gulp.src([
//     'bower_components/jquery/jquery.min.js',
//     'bower_components/angular/angular.min.js',
//     'bower_components/bootstrap/dist/css/bootstrap.css'
//     ], {read: false});

//    return target.pipe(inject(sources))
//     .pipe(gulp.dest('./dist'));
// });

var wiredep = require('wiredep').stream;

gulp.task('bower', function () {
  gulp.src('index.html')
    .pipe(wiredep({}))
    .pipe(gulp.dest('dist'));
});

var mainBowerFiles = require('main-bower-files');

gulp.task('vendor', function() {
    return gulp.src(mainBowerFiles(/* options */),{ base: 'bower_components' })
        .pipe(gulp.dest('dist/bower_components'))
});


// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src('js/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('js/*.js', ['lint', 'scripts']);
    gulp.watch('scss/*.scss', ['sass']);
    gulp.watch('*.html',['bower'])
});

// Default Task
gulp.task('default', ['bower','vendor', 'lint', 'sass', 'scripts', 'watch']);