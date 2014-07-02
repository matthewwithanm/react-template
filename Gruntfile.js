'use strict';

module.exports = function(grunt) {
  var TEST_SERVER_PORT = process.env.TEST_SERVER_PORT || 4000;

  // Project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      standalone: {
        options: {
          transform: ['browserify-shim'],
          bundleOptions: {
            standalone: 'ReactTemplate'
          }
        },
        files: {
          './browser-builds/react-template.js': './lib/index.js'
        }
      }
    },
    uglify: {
      browserbuilds: {
        files: [
          {
            expand: true,
            cwd: './browser-builds/',
            src: '**/*.js',
            dest: './browser-builds/'
          }
        ]
      }
    },
    connect: {
      options: {
        port: TEST_SERVER_PORT,
        base: '.'
      },
      tests: {
        options: {
          keepalive: false
        }
      },
      testskeepalive: {
        options: {
          keepalive: true
        }
      }
    },
    mocha: {
      all: {
        options: {
          run: true,
          log: true,
          logErrors: true,
          reporter: 'Spec',
          urls: ["http://localhost:" + TEST_SERVER_PORT + "/test/index.html"],
          mocha: {
            grep: grunt.option('grep')
          }
        }
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'Spec',
          clearRequireCache: true,
          grep: grunt.option('grep')
        },
        src: ['test/**/*.js']
      }
    },
    watch: {
      options: {
        atBegin: true
      },
      lib: {
        files: ['lib/**/*.js'],
        tasks: ['build:standalone']
      }
    },
    bump: {
      options: {
        files: ['package.json', 'bower.json'],
        commit: true,
        commitFiles: ['-a'],
        createTag: true,
        push: false
      }
    }
  });

  // Load Grunt plugins
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Define tasks.
  grunt.registerTask('build', ['build:standalone']);
  grunt.registerTask('build:standalone', ['browserify']);
  grunt.registerTask('default', ['build']);
  grunt.registerTask('test:phantom', ['build:standalone', 'connect:tests', 'mocha']);
  grunt.registerTask('test:browser', ['build:standalone', 'connect:testskeepalive']);
  grunt.registerTask('test:server', ['settestglobals', 'mochaTest']);
  grunt.registerTask('test', ['test:phantom', 'settestglobals', 'mochaTest']);
  return grunt.registerTask('settestglobals', function() {
    // Sets globals for the server tests so we can use the same module for
    // browser tests.
    GLOBAL.chai = require('chai');
    GLOBAL.ReactTemplate = require('./lib/index');
  });
};
