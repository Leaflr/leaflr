define([
	'backbone',
	'communicator',
	'models/survey-model',
	'survey'
],
function( Backbone, Communicator, surveyModel, survey ) {
    'use strict';

	var surveysCollection = Backbone.Collection.extend({
		model: surveyModel
	});

	var surveys = new surveysCollection([ survey ]);

	return surveys;
});
