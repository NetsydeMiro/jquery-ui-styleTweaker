module.exports = (grunt) -> 
  grunt.initConfig

    coffee:
      compile: 
        files: 
          'spec/styleTweakerSpec.js': 'spec/styleTweakerSpec.coffee'
          'spec/CssPropertyInfoSpec.js': 'spec/CssPropertyInfoSpec.coffee'
        options: 
          sourceMap: true

    watch:
      compile: 
        files: 'spec/*Spec.coffee'
        tasks: 'compile'
      test:
        files: ['src/*.js', 'spec/*Spec.js']
        tasks: 'test:dev'

    jshint: 
      all:
        'src/*.js'

    jasmine: 
      # we keep _SpecRunner.html around when devving to help debug
      dev: 
        src: 'src/*.js'
        options:
          specs: 'spec/*Spec.js'
          vendor: ['lib/jquery-2.1.3.js', 'lib/jquery-ui-1.11.2-core.js']
          keepRunner: true
      prod: 
        src: 'src/*.js'
        options:
          specs: 'spec/*Spec.js'
          vendor: ['lib/jquery-2.1.3.js', 'lib/jquery-ui-1.11.2-core.js']
    exec: 
      pushtodemo:
        cmd:
          # first we push changes to demo site, then we commit all branches
          [
            'git checkout gh-pages', 
            'git checkout master src/CssPropertyInfo.js src/jquery.ui.styleTweaker.js',
            'git checkout master spec/CssPropertyInfoSpec.coffee',
            'git checkout master spec/styleTweakerSpec.coffee',

            'grunt compile',

            'git add -A && git commit -a -m "merging updates"',
            'git checkout master'
          ].join ' && '
  
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-jshint'
  grunt.loadNpmTasks 'grunt-contrib-jasmine'
  grunt.loadNpmTasks 'grunt-exec'

  grunt.registerTask 'compile', ['coffee']
  grunt.registerTask 'test', ['jshint', 'jasmine:prod']
  grunt.registerTask 'test:dev', ['jshint', 'jasmine:dev']

  grunt.registerTask 'default', ['compile', 'test']
  grunt.registerTask 'travis', ['default']

