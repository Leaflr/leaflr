define(['backbone','communicator','survey/models/choice-model','backbone.associations'], function( Backbone, Communicator, choiceModel ){
	'use strict';

	// static option model has a single return value
	// ex. multiple choice, true or false

	return Backbone.AssociatedModel.extend({
		idAttribute: '_id',
		defaults: {
			title: 'step 1',
			
		},

		initialize: function(){
			console.log('Step Created')
			Communicator.events.on('surveyCreated', this.init, this);
		},

		init: function(){
			this.survey = this.collection.parents[0];
		},

		onOptionSelected: function(){
			return this;
		},

		relations: [
			{
				type: Backbone.Many,
				key: 'choices',
				relatedModel: choiceModel
			}
		]
	});
});