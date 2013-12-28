define([
	'backbone',
	'hbs!tmpl/survey-list-single-temp',
	'hbs!tmpl/survey-list-metric'], 
function( Backbone, surveyListSingleTemp, metricTemp ){
	'use strict';

	return Backbone.Marionette.ItemView.extend({
		template: surveyListSingleTemp,
		tagName: 'li',
		className: function(){
			return this.model.get('name').toLowerCase();
		},
		onRender: function(){
			
			if (this.model.get('completed') == false) this.$el.hide();
			
			var metrics = this.model.get('metrics').toJSON(),
				list = [];

			for (var key in metrics){
				list.push( metricTemp(metrics[key]) );
			}

			this.$el.find('.resources').append( list.join('') );
		}
	});

});