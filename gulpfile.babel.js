import gulp from 'gulp';
import {PATH} from './dir';
import del from 'del' ; 
import minify from 'gulp-uglify';
import sass from 'gulp-sass';
import Cache from 'gulp-file-cache';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import browserSync from 'browser-sync';
import ejs from 'gulp-ejs';
import rename from 'gulp-rename';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import 'babel-polyfill'

const cache = new Cache();
const reload = browserSync.create();
const sassOption = {
    outputStyle : "expanded",
    indentType : "tab",
    indentWidth : 1,
    precision: 3,
    sourceComments: false
};
gulp.task('reload', async () => {
	await reload.reload({ stream : true })
})
gulp.task('css', async () => {
	await gulp.src(PATH.SRC.css)
    .pipe( gulp.dest(PATH.DIST.css))
})

gulp.task('sass', async () => {
	await gulp.src([PATH.SRC.scss,PATH.SRC.sass])
    .pipe( cache.filter() )
    .pipe( plumber({ errorHandler: notify.onError("SCSS Compile error <%= error.message %>") }))
    .pipe( sass(sassOption) )
    .pipe( cache.cache() )
    .pipe( gulp.dest(PATH.DIST.css))
})

gulp.task('cleanAssets', async () => {
    del.sync(PATH.DIST.assets+'/*');
})

gulp.task('assets' , async () => {
    await gulp.src(PATH.SRC.assets)
    .pipe(gulp.dest(PATH.DIST.assets));
})

gulp.task('js',async () => {
    await gulp.src(PATH.SRC.js)
    .pipe(plumber({ errorHandler: notify.onError("JS Compile Error : <%= error.message %>") }) )
    .pipe(babel())
    .pipe(minify())
    .pipe(gulp.dest(PATH.DIST.js));
})

gulp.task('bundle-js',async () => {
    await gulp.src(PATH.SRC.js)
    .pipe(plumber({ errorHandler: notify.onError("JS Compile Error : <%= error.message %>") }) )
    .pipe(babel())
    .pipe(minify())
	.pipe(concat('bundle.js'))
    .pipe(gulp.dest(PATH.DIST.js));
})

gulp.task('bundle-lib',async () => {
    await gulp.src(PATH.SRC.lib)
    .pipe(plumber({ errorHandler: notify.onError("JS Compile Error : <%= error.message %>") }) )
    .pipe(concat('lib.bundle.js'))
    .pipe(gulp.dest(PATH.DIST.lib));
})

gulp.task('lib',async () => {
    await gulp.src(PATH.SRC.lib)
    .pipe(gulp.dest(PATH.DIST.lib));
})

gulp.task('ejs', async () => {
    await gulp.src([PATH.SRC.ejs,PATH.SRC.ignoreInc])
    .pipe(plumber({ errorHandler: notify.onError("ejs Compile Error : <%= error.message %>") }) )
    .pipe(ejs())
    .pipe(rename({extname:'.html'}))
    .pipe(gulp.dest(PATH.DIST.html));
});


gulp.task('html', async () => {
    await gulp.src(PATH.SRC.html)
    .pipe(gulp.dest(PATH.DIST.html));
});

gulp.task('browserSync', async () =>{
    return await reload.init({
        startPath : '/index.html',
        port : PATH.DIR.port,
        watch: true,
        server: { baseDir: 'dist/' }
    });
});

gulp.task('build', async () => {
    await del.sync('dist'+'/**/*');
    await gulp.series('js','css','sass','html','ejs','lib','assets')()
});

gulp.task('watch', () => {
    gulp.watch(PATH.SRC.js,  gulp.series('js','reload'))
    gulp.watch(PATH.SRC.lib,  gulp.series('lib','reload'))
	gulp.watch([PATH.SRC.scss,PATH.SRC.sass],  gulp.series('sass','reload'))
	gulp.watch(PATH.SRC.css,  gulp.series('css','reload'))
    gulp.watch(PATH.SRC.ejs,  gulp.series('ejs','reload'))
    gulp.watch(PATH.SRC.html,  gulp.series('html','reload'))
    gulp.watch(PATH.SRC.assets,  gulp.series('cleanAssets','assets','reload'))
});


gulp.task( 'default' , gulp.parallel('browserSync','watch'));