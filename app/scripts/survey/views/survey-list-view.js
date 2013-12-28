define([
	'backbone',
	'communicator',
	'survey/views/survey-list-single-view',
	'hbs!tmpl/survey/survey-list-temp'],
	 function( Backbone, Communicator, surveyListSingle, surveyListTemp ){
	'use strict';

	return Backbone.Marionette.CompositeView.extend({
		itemView: surveyListSingle,
		template: surveyListTemp,
		itemViewContainer: function(){
			return '.completed-surveys'
		},
		initialize: function(){
		}
	});
});