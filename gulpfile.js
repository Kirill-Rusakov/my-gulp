const gulp = require('gulp');
require('./gulp/dev');
require('./gulp/docs');

gulp.task('default', 
        gulp.series('clean:dev', 
            gulp.parallel('html:dev', 'sass:dev', 'scripts:dev', 'images:dev', 'fonts:dev', 'files:dev'), 
            gulp.parallel('watch:dev', 'server:dev')
        )
);

gulp.task('docs', 
        gulp.series('clean:docs', 
            gulp.parallel('html:docs', 'sass:docs', 'scripts:docs', 'images:docs', 'fonts:docs', 'files:docs'), 
            gulp.parallel('server:docs')
        )
);