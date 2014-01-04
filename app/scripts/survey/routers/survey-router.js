define([
	'backbone',
	'communicator'
],
function( Backbone, Communicator ){
	'use strict';

	return Backbone.Router.extend({
  		
  		routes: {
  		  ":survey/(:step)": "surveyStep"
  		},

  		surveyStep: function( survey, step ){
        survey = survey.replace(/-/g,' ');
        step = step.replace(/-/g,' ');
  			
  		}
	});
});
