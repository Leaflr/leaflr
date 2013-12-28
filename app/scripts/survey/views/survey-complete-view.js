define(['backbone','survey/views/survey-complete-single-view','hbs!tmpl/survey/survey-complete'], function(Backbone, surveyCompleteSingle, surveyComplete){
	'use strict';

	return Backbone.Marionette.CompositeView.extend({
		template: surveyComplete,
		itemView: surveyCompleteSingle,
		itemViewContainer: '.survey-results',
		className: 'results'
	});
});