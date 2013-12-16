define([
	'backbone',
	'communicator',
	'hbs!tmpl/survey/choice'],
function( Backbone, Communicator, choiceTemp ){
	'use strict';

	return Backbone.Marionette.ItemView.extend({
  		template: choiceTemp,

	});
});