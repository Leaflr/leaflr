define([
	'backbone',
	'communicator',
	'survey/views/choices-view',
	'hbs!tmpl/survey/step'],
function( Backbone, Communicator, choicesView, stepTemp ){
	'use strict';

	return Backbone.Marionette.ItemView.extend({
  		template: stepTemp,
  		className: 'step',

      initialize: function(){
        // triggered from step slider
        this.model.on('sliderSelected', this.sliderSelected, this);
      },

  		onRender: function(){
  			var choices = this.model.get('choices'),
  				  view = new choicesView({ collection: choices });

  			view.render();

  			this.$el.append( view.el );
  		},

      activateStep: function(){
        var self = this;

        this.$el.attr('class', 'step slide-in');

        if ( !this.model.has('history') ) this.reactivateSliders();

        if ( !this.$el.is(':last-child') )
        setTimeout(function(){
          self.$el.attr('class', 'step reset-animation')
        }, 300);

      },

      reactivateSliders: function(){
        var sliders = $('#metric-sliders'),
          currentValues = sliders.find('.value'),
          historyValues = sliders.find('.past-value');

        currentValues.removeClass('inactive-slider');
        historyValues.css('display','none');
      },

      sliderSelected: function( isLastStep ){
        

        if ( isLastStep == true ){
          this.$el.attr('class','step reset-animation slide-out-fast');
          $('#survey-steps .results').addClass('slide-out-fast');
        } else {
          this.$el.attr('class','step reset-animation slide-in-fast').nextAll().addClass('slide-out-fast');
          this.$el.prevAll().addClass('slide-out-fast');
        }
      }

	});
});