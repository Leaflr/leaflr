define([
	'backbone',
	'communicator',
	'survey/models/step-model',
	'survey/models/metric-model',
	'backbone.associations'
],
function( Backbone, Communicator, stepModel, metricModel ) {
    'use strict';

	return Backbone.AssociatedModel.extend({
		idAttribute: '_id',
		defaults: {
			name: '',
			status: 'inactive'
		},

		initialize: function(){
			console.log('Survey Created')
			Communicator.events.trigger('surveyCreated');
			this.history = []
			this.results = {}
		},

		relations: [
	      {
	        type: Backbone.Many,
	        key: 'steps', 
	        relatedModel: stepModel, 
	      },
	      {
	        type: Backbone.Many,
	        key: 'metrics',
	        relatedModel: metricModel
	      }
  		]
	});
});
