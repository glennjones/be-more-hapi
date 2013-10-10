module.exports = function( grunt ) {
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.initConfig({
		jshint: {
			files: ['grunt.js', 'lib/*.js'],
			options: {
				curly: true,
				eqeqeq: true,
				immed: true,
				latedef: false, 
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				boss: true,
				eqnull: true,
				browser: false,
				node: true,
				strict: false,
				quotmark: 'single'
			}
		},
		mochaTest: {
			files: ['test/*-test.js']
		},
		watch: {
			files: 'lib/*.js',
			tasks: 'mochaTest'
		}
	});
	// Default task.
	grunt.registerTask( 'default', 'mochaTest', 'jshint' );
};