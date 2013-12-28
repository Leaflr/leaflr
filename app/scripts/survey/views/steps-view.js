define([
	'backbone',
	'communicator',
	'survey/views/step-view',
	'hbs!tmpl/survey/steps'],
function( Backbone, Communicator, stepView, stepsTemp ){
	'use strict';

	return Backbone.Marionette.CollectionView.extend({
  		template: stepsTemp,
  		itemView: stepView,
  		className: 'steps'
	});
});