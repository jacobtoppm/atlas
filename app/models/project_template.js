var _ = require('underscore'),
	Backbone = require('backbone'),
	baseFilter = require('./base_filter.js'),
	seed = require('./../../db/seeds/project_templates.json');

exports.Model = baseFilter.Model.extend({
	apiUrlRoot: '/api/v1/project_templates'
});

exports.Collection = baseFilter.Collection.extend({

	dbCollection: 'project_templates',

	dbSeed: seed,

	model: exports.Model,

	apiUrl: '/api/v1/project_templates',

	hasSingleActiveChild: true,

	initializeActiveStatesOnReset: true,

	comparator: 'order',

	initialize: function() {
		this.reset(seed);
	}

});