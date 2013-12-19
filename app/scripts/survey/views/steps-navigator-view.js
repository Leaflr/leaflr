define([
	'backbone',
	'communicator',
  'survey/views/step-navigator-view',
	'hbs!tmpl/survey/steps-navigator',
  'jquery-ui',
  'jquery-ui-touch-punch'],
function( Backbone, Communicator, stepNavigatorView, stepsNavigatorTemp ){
	'use strict';

	return Backbone.Marionette.CompositeView.extend({
  		template: stepsNavigatorTemp,
      itemView: stepNavigatorView,
      className: 'step-indicators',
      itemViewContainer: '.step-dots',

      events : {
        'click .results':'showResults'
      },

      ui: {
        slider: '.step-slider',
        indicators: '.step-dots'
      },

      initialize: function(){
        Communicator.events.on('stepActivated', this.resizeSlider, this);
      },

      showResults: function(){
        Communicator.events.trigger('nextStep', 'end');
      },
      
      onRender: function(){
        this.$el.find('.step-dot:first-child').appendTo( this.$el );
        this.$el.find('.step-dot:first-child').addClass('active-step');

        this.initStepSlider(); 
      },

      resizeSlider: function(){
        var stepsWidth = this.ui.indicators.width(),
            activeStep = this.ui.indicators.find('.active-step').index() + 1,
            steps = this.ui.indicators.children().filter(':visible').length;
console.log(steps, activeStep)
this.ui.slider.css({'width': stepsWidth - 24, 'left':'-11px' });
        this.ui.slider.slider('option', {
          max: steps,
          value: activeStep
        });

        
      },

      initStepSlider: function(){
        this.ui.slider.slider({
          min: 1,
          slide: function( event, ui ){
            console.log(ui.value)
          }
        });
      }

	});
});