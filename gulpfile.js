var gulp        	= require('gulp'),
    sass        	= require('gulp-sass'),
    browserSync 	= require('browser-sync'),
    del         	= require('del'),
    imagemin    	= require('gulp-imagemin'),
    pngquant        = require('imagemin-pngquant'),
    cache       	= require('gulp-cache'),
    autoprefixer 	= require('gulp-autoprefixer');
    gcmq            = require('gulp-group-css-media-queries');

gulp.task('sass', function() {
	return gulp.src('scss/**/*.scss')
	.pipe(sass().on('error', sass.logError))
	.pipe(autoprefixer(['last 15 version', '>1%', 'ie 8', 'ie 7'], {cascade: true}))
	.pipe(gulp.dest('css'))
	.pipe(browserSync.reload({stream: true}))
});

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: '../',
			index: "index.html",
            directory: true
		},
		watchTask: true
	});
});

gulp.task('build', ['clean','img', 'sass', 'gcmq'], function() {
	var buildCSS = gulp.src([
		'css/main.css'
	])
		.pipe(gulp.dest('dist/css'));

	var buildFonts = gulp.src('fonts/**/*')
		.pipe(gulp.dest('dist/fonts'));

	var buildJS = gulp.src('js/**/*')
		.pipe(gulp.dest('dist/js'));

	var buildHTML = gulp.src('*.html')
		.pipe(gulp.dest('dist'))
});

gulp.task('clean', function() {
	return del.sync('dist');
});

gulp.task('clear', function() {
	return cache.clearAll();
});

gulp.task('img', function() {
	return gulp.src('sourceimages/**/*')
	.pipe(cache(imagemin({
		interlaced: true,
		progressive: true,
		svgoPlugins: [{removeViewBox: false}],
		une: [pngquant()]
	})))
	.pipe(gulp.dest('dist/images'));
});

// gulp.task('styles', function() {
//   return gulp.src('css/main.css')
//     .pipe(csscomb())
//     .pipe(gulp.dest('dist/css'));
// });

gulp.task('gcmq', function () {
    gulp.src('css/main.css')
    .pipe(gcmq())
    .pipe(gulp.dest('dist/css'));
});

gulp.task('watch', ['browser-sync', 'sass'] , function() {
	gulp.watch('scss/**/*.scss', ['sass']);
	gulp.watch('*.html', browserSync.reload);
	gulp.watch('**/*.css', browserSync.reload);
	gulp.watch('js/**/*.js', browserSync.reload);
});