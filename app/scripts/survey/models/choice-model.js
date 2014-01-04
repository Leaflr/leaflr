define(['backbone','communicator','backbone.associations'], function( Backbone, Communicator ){
	'use strict';

	// static option model has a single return value
	// ex. multiple choice, true or false

	return Backbone.AssociatedModel.extend({
		idAttribute: '_id',
		defaults: {
            returnValue: '',
            nextStep: ''
		},

		constructor: function(){

			Backbone.AssociatedModel.apply(this, arguments);
			this.onSelect = function( ){  }
		},

		initialize: function(){
			console.log('Choice Created')
			Communicator.events.on('surveyCreated', this.init, this);
		},

		init: function(){
			this.step = this.collection.parents[0];
			this.survey = this.step.collection.parents[0];
			this.history = { 
				step: this.step,
				values: [],
				answer: ''
			}
		},

		getHistoryEntry: function(){
			var self = this;

			return _.find( this.survey.history, function(entry){
				return entry.step.cid == self.step.cid;
			});
		},

		saveMetric: function( metricValues ){
            metricValues = this.attributes.metricVals;
			var historyEntry = this.getHistoryEntry();
			console.log('saveMetric',this)
			// reset values
			this.history.values = []
			
			for (var metric in metricValues){
				var value = metricValues[metric],
					oldValue,
					metricObj = { 
						metric: metric, 
						value: value
					},
					model = _.find( this.survey.get('metrics').models, function( model ){
						return model.get('name') == metric;
					});
				
				if (!historyEntry){
					// if this is the first run through, save value
					model.add( value );
				} else {
					// if current step has an entry in history
					// 1. finds previous entry in history
					// 2. gets old value to subtract and adds new value
					for (var entry in historyEntry.values ){
						var existingEntry = historyEntry.values[entry];

						if ( metric == existingEntry.metric ){
							oldValue = existingEntry.value;
						}
					}
					model.subtract( oldValue ).add( value );
				}

				this.history.values.push( metricObj )
			}
			
			// if history entry exists
			if ( !historyEntry )
			this.survey.history.push( this.history );
			else 
			historyEntry.values = this.history.values;

			this.step.set('history', this.history);
			
			return this;
		},

		saveAnswer: function( answer ){
			var historyEntry = this.getHistoryEntry();

			this.history.answer = answer;

			// if history entry exists
			if ( !historyEntry )
			this.survey.history.push( this.history );
			else
			historyEntry.answer = answer;

			return this;
		},

		validate: function( attr, options ){
			// future validation
		}
	});
});
