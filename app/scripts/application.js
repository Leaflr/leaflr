define([
	'backbone',
	'communicator',
	'survey/models/survey-model',
	'survey/models/step-model',
	'survey/models/choice-model',
	'survey/models/metric-model',
	'survey/views/take-survey-view',
	'survey',
	'survey/routers/survey-router',
	'interface'
],

function( Backbone, Communicator, surveyModel, stepModel, choiceModel, metricModel, takeSurvey, Survey, surveyRouter ) {
    'use strict';

	var App = new Backbone.Marionette.Application({
        loadedSurvey: false,

        /* Function to load surveys. */
        loadSurvey: function(surveyName) {
	        App.takeSurvey.show( new takeSurvey({ model: Survey( surveyName ) }) );
            /* Set surveyName as loadedSurvey for boolean logic
             * to check if survey is loaded. */
            this.loadedSurvey = surveyName;
        }    
    }),
	router = new surveyRouter();
	
	App.addRegions({
		allSurveys: '#survey-list',
        surveyList: '#survey-choices',
		takeSurvey: '#take-survey'
	});
	
	App.addInitializer(function(){
        /* Check if survey is loaded. Load default if not. */
        if(!this.loadedSurvey) {
            this.loadSurvey('survey-choice');
        }
	});

	return App;
});
