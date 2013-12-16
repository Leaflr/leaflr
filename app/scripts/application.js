define([
	'backbone',
	'communicator',
	'survey/models/survey-model',
	'survey/models/step-model',
	'survey/models/choice-model',
	'survey/models/metric-model',
	'survey/views/take-survey-view',
	'survey',
	'interface'
],

function( Backbone, Communicator, surveyModel, stepModel, choiceModel, metricModel, takeSurvey, survey ) {
    'use strict';

	var App = new Backbone.Marionette.Application();
	
	App.addRegions({
		allSurveys: '#survey-list',
		takeSurvey: '#take-survey'
	});

	App.addInitializer(function(){
		App.takeSurvey.show( new takeSurvey({ model: survey }) );
	});

	return App;
});