import gulp from 'gulp';
import nodemon from 'gulp-nodemon';
import liveReload from 'gulp-livereload';
import path from 'path';

var devTasks = [

    {
        name: 'css-build',
        shouldRun: function(file) {
            var ext = path.extname(file);
            return (ext === '.scss');
        }
    },

    {
        name: 'js-build-component',
        shouldRun: function(file) {
            var ext = path.extname(file);
            return ([ '.jsx', '.cjsx' ].indexOf(ext) > -1);
        }
    },

    {
        name: 'js-build-source',
        shouldRun: function(file) {
            return (file.slice(0, 18) === 'app/assets/scripts');
        }
    },

    {
        name: 'js-build-vendor',
        shouldRun: function(file) {
            return false;
        }
    }

];

var buildTaskList = function(changedFiles) {
    var tasks = [];
    changedFiles.forEach((file) => {
        devTasks.forEach((devTask) => {
            if ((tasks.indexOf(devTask.name) === -1) && (devTask.shouldRun(file))) {
                tasks.push(devTask.name);
            }
        });
    });
    if (tasks.length === 0) { return [ 'css-build' ]; }
    return tasks;
};

// Development environment.
gulp.task('dev', () => {
    liveReload.listen();
    nodemon({
        script: './app.js',
        ext: 'js jade scss coffee cjsx jsx',
        ignore: [ 'node_modules/**/*', 'bower_components/**/*', 'spec/**/*', 'db/**/*' ],
        tasks: buildTaskList
    })
    .on('restart', function() { 
        gulp.src('./app.js')
            .pipe(liveReload());
    });
});

// Development environment for the intranet project.
gulp.task('dev-intranet', () => {
    liveReload.listen();
    nodemon({
        script: './app.js',
        ext: 'js jade scss coffee cjsx jsx',
        tasks: function(changedFiles) {
            return ['default'];
        }
    })
    .on('restart', function() { 
        gulp.src('./app.js')
            .pipe(liveReload());
    });
});