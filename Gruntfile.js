module.exports = function(grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        concat: {
            options: {
                separator: "\n\n"
            },
            all: {
                src: [
                    'src/_intro.js',
                    'src/providerManager.js',
                    'src/main.js',
                    'src/localStorageProvider.js',
                    'src/arrayProvider.js',
                    'src/_outro.js'
                ],
                dest: 'dist/<%= pkg.name.replace(".js", "") %>.js'
            },
            array: {

                src: [
                    'src/_intro.js',
                    'src/arrayProviderManager.js',
                    'src/main.js',
                    'src/arrayProvider.js',
                    'src/_outro.js'
                ],
                dest: 'dist/<%= pkg.name.replace(".js", "") %>.array.js'
            }
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name.replace(".js", "") %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            }
            ,
            dist: {
                files: {
                    'dist/<%= pkg.name.replace(".js", "") %>.min.js': ['<%= concat.all.dest %>'],
                    'dist/<%= pkg.name.replace(".js", "") %>.array.min.js': ['<%= concat.array.dest %>']
                }
            }
        }
        ,

        qunit: {
            files: ['test/*.html']
        }
        ,

        jshint: {
            files: ['dist/cacheJS.js'],
            options: {
                globals: {
                    console: true,
                    module: true,
                    document: true
                }
                ,
                jshintrc: '.jshintrc'
            }
        }
        ,

        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['concat', 'jshint', 'qunit']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('test', ['jshint', 'qunit']);
    grunt.registerTask('default', ['concat', 'jshint', 'qunit', 'uglify']);

}
;
