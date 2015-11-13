import * as util from 'gulp-util';

var config = {

    production: !!util.env.production,

    // Code that is shared with other projects such as my.newamerica.org. To be extended into its own CMS.
    boilerplate: [

    	'./app.js',

    	'./app/middleware/**/*',
    	'./app/assets/scripts/polyfills/**/*',
    	'./app/models/base_crud.js',

    	'./app/components/crud/**/*',
    	'./app/components/form/**/*',

    	'./app/components/general/loader.jsx',
    	'./app/components/general/modal.jsx',
    	'./app/components/general/static.jsx',

    	'./app/components/route_handlers/helpers/**/*',

    	'./db/connector.js',
    	'./db/batch_modifier/**/*',

    	'./public/assets/styles/app.css',

    	'./gulp_tasks/devops.js'

    ],

    source: {

    	js: {

    		// Vendor scripts that are lazy-loaded when needed, then kept on the window.
			vendorAsyncSingle: [
		        './bower_components/d3/d3.min.js', 
		        './bower_components/mapbox.js/mapbox.js'
		    ],

		    vendorAsyncCKEditor: [
		    	'./bower_components/ckeditor/**/*'
		    ],

		    vendorAsyncXlsxParser: [
		    	'./bower_components/js-xlsx/jszip.js',
		        './bower_components/js-xlsx/dist/xlsx.js'
		    ],

		    // vendor scripts
		    vendor: [
		        './bower_components/chartist/dist/chartist.js',
		        './bower_components/chartist-html/build/chartist-html.js',
		        './app/assets/scripts/vendor_config/**/*'
		    ]

    	}

    }

};

export default config;