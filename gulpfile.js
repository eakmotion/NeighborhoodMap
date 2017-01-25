var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    cleanCSS = require('gulp-clean-css'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    server = require('gulp-server-livereload');

gulp.task('scripts', function(){
  gulp.src('js/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/js/'));
});

gulp.task('styles', function(){
  gulp.src('css/**/*.css')
    .pipe(cleanCSS())
    .pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
    .pipe(gulp.dest('dist/css/'));
});

gulp.task('watch', function(){
  gulp.watch('js/**/*.js', ['scripts']);
  gulp.watch('css/**/*.css', ['styles']);
})

gulp.task('webserver', function(){
  gulp.src('./')
    .pipe(server({
      livereload: true,
      open: true
    }));
});

gulp.task('default', ['scripts', 'styles', 'watch', 'webserver']);
