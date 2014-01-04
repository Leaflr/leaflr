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
        'click .results' : 'showResults',
        'click .step-dots div' : 'selectStep'
      },

      ui: {
        slider: '.step-slider',
        indicators: '.step-dots',
      },

      initialize: function(){
        Communicator.events.on('stepActivated', this.resizeSlider, this);
      },

      showResults: function(){
        Communicator.events.trigger('nextStep', 'end');
      },
      
      onRender: function(){
        this.$el.find('.step-dot:first-child').appendTo( this.ui.indicators );
        this.$el.find('.step-dot:first-child').addClass('active-step');
        this.initStepSlider(); 
      },

      selectStep: function(e){
        var target = $(e.target),
            index = target.index() + 1;

        this.selectIndicator( index, target );
        this.ui.slider.slider('value', index);

        e.stopPropagation();
      },

      resizeSlider: function(){
        var stepsWidth = this.ui.indicators.width(),
            activeStep = this.ui.indicators.find('.active-step').index(),
            steps = this.ui.indicators.children().filter(':visible').length;

        this.ui.slider.css({'width': stepsWidth });
        
        this.ui.slider.slider('option', {
          max: steps + 1,
          value: activeStep + 1
        }); 
      },

      selectIndicator: function( pos, dom ){
          var cid = dom.data('model');

          dom.addClass('active-step').siblings().removeClass('active-step');
          this.collection.get(cid).trigger('sliderSelected');
      },

      initStepSlider: function(){
        var self = this,
            indicators = this.ui.indicators,
            steps,
            max;

        this.ui.slider.slider({
          min: 1,
          start: function(){
            steps = $('#survey-steps .step');
            max = self.ui.slider.slider('option','max');
          },
          slide: function( event, ui ){
            if ( ui.value == max ) ui.value = max - 1;
            
            var currentIndicator = indicators.find(':eq(' + (ui.value - 1) + ')');

            self.selectIndicator( ui.value, currentIndicator );
           
          }
        });

      }

	});
});