define([
	'backbone',
	'communicator',
  'survey/views/step-navigator-view',
	'hbs!tmpl/survey/steps-navigator'],
function( Backbone, Communicator, stepNavigatorView, stepsNavigatorTemp ){
	'use strict';

	return Backbone.Marionette.CompositeView.extend({
  		template: stepsNavigatorTemp,
      itemView: stepNavigatorView,
      className: 'step-indicators',

      events : {
        'click .results':'showResults'
      },

      showResults: function(){
        Communicator.events.trigger('nextStep', 'end');
      },
      
      onRender: function(){
        this.$el.find(':first-child').appendTo( this.$el );
        this.$el.find(':first-child').addClass('active-step');  
      }

	});
});