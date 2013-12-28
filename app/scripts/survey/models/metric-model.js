define([
	'backbone',
	'communicator',
	'backbone.associations'
],
function( Backbone, Communicator ) {
    'use strict';

	return Backbone.AssociatedModel.extend({
		idAttribute: '_id',
		defaults: {
			name: '',
			value: 0,
			min: 0,
			max: 100
		},
		initialize: function(){
			var self = this;
			
			Communicator.events.on('endSurvey', function( survey ){
				var parent = self.collection.parents[0];
				if ( parent.cid == survey.cid ) self.calculateResult( survey );
			});
		},
		calculateResult: function( survey ){
			console.log(this.set('endSurvey', true))
		},
		add: function( val ){
			var oldVal = parseFloat(this.get('value')),
				newVal;

			val = parseFloat(val);
			newVal = oldVal + val;

			if (newVal > 100) newVal = 100;
			this.set('value', newVal);

			return this;
		},
		subtract: function( val ){
			var oldVal = parseFloat(this.get('value')),
				newVal;

			val = parseFloat(val);
			newVal = oldVal - val;

			if (newVal > 100) newVal = 100;
			else if (newVal > 0) newVal = 0;

			this.set('value', newVal);
			return this;
		}
	});
});
