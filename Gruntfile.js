module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      files: ['Gruntfile.js', 'script/**/*.js', 'spec/**/*.js'],
      options: {
        globals: {
          jQuery: true
        },
        'esversion': 6
      }
    },
    watch: {
      files: [
        '<%= jshint.files %>',
        'scripts/**/*.js',
        'index.html',
        'style.css'
      ],
      options: {
        livereload: true
      },
      tasks: [
        'jshint'
      ]
    },
    express: {
			all: {
				options: {
					port: 9000,
					hostname: '0.0.0.0',
					bases: ['../tax_calculator'],
					livereload: true
				}
			}
		}
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express');
  grunt.registerTask('server', ['express', 'watch']);
};
