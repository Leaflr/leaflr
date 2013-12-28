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

      events: {
        'click .choice':'removeAnimationClass'
      },

      initialize: function(){
        Communicator.events.on('nextStep', this.removeAnimationClass, this);

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

        this.$el.addClass('slide-in');
        console.log(this.$el)
        setTimeout(function(){
          self.$el.addClass('reset-animation').removeClass('slide-in');
        }, 300);
      },

      sliderSelected: function(){
        this.$el.attr('class','step reset-animation slide-in-fast').nextAll().addClass('slide-out-fast');
        this.$el.prevAll().addClass('slide-out-fast');
      },

      // removeAnimationClass: function(){
      //   this.$el;
      //   console.log('rempove')
      // }

	});
});