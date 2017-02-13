module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      files: ['Gruntfile.js', 'script/**/*.js', 'spec/**/*.js'],
      options: {
        globals: {
          jQuery: true
        }
      }
    },
    watch: {

      files: [
        '<%= jshint.files %>',
        'script/**/*.js',
        'index.html',
      ],
      options: {
        livereload: true
      },
      tasks: ['jshint']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-serve');

  grunt.registerTask('default', ['jshint']);

};
