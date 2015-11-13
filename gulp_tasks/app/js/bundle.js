import _ from 'underscore';
import gulp from 'gulp';
import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';
import watchify from 'watchify';

// Application entry point.
var entry = './app/assets/scripts/bundle.jsx';

var getBrowserifyBundler = (entries) => {
    var args = _.extend({ entries: entry }, watchify.args, { debug: true });
    var b = browserify(args);
    b.transform(babelify.configure({ optional: [ 'runtime' ] }));
    return b;
};

var getWatchifyBundler = (entries) => {
    return watchify(getBrowserifyBundler(entries));
};

var writeBundle = (bundler, name = '_bundle.js', dest = './public/assets/scripts/partials') => {
    return bundler.bundle()
        .on('error', (err) => {
            console.log('Browserify error..');
            console.dir(err);
        })
        .pipe(source(name))
        .pipe(gulp.dest(dest));
};

// Make server-side component definitions available on the client.
gulp.task('bundle', () => {
    var bundler = getBrowserifyBundler();
    return writeBundle(bundler);
});

// Make server-side component definitions available on the client.
gulp.task('bundle-watch', () => {
    var bundler = getWatchifyBundler();
    bundler.on('update', () => {
        console.log('Rebundling..')
        writeBundle(bundler);
    });
    return writeBundle(bundler);
});