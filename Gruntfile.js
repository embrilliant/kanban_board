module.exports = function(grunt) {

    // 1. All configuration goes here
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            // 2. Configuration for concatinating files goes here.
            dist: {
                src: [
                     // All JS in the libs folder
                     "js/emily/kanban/*", "app.js"
                      // This specific file
                ],
                dest: "production/js/production.js"
            }
        },

        uglify: {
            build: {
                src: 'production/js/production.js',
                dest: 'production/js/production.min.js'
            }
        },

        copy: {
            main: {
                files: [

                    // includes files within path and its sub-directories
                    {expand: true, src: 'css/*', dest: 'production/'},
                    {expand: true, src: 'js/lib/**', dest: 'production/'},
                    //{expand: true, src: ['*'], dest: 'production/', filter: 'isFile'},
                    {expand: true, src: ['index.html'], dest: 'production/', filter: 'isFile'}
                    //{expand: true, src: ['app.js'], dest: 'production/', filter: 'isFile'}
                ]
            }
        },

        useminPrepare: {
            html: 'index.html',
            options: {
                dest: 'production'
            }
        },

        usemin:{
            html:['production/index.html']
        }

    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-usemin');

    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', ['copy', 'useminPrepare', 'concat', 'uglify', 'usemin']);

};
