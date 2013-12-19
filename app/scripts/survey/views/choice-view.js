define([
	'backbone',
	'communicator',
	'hbs!tmpl/survey/choice'],
function( Backbone, Communicator, choiceTemp ){
	'use strict';

	return Backbone.Marionette.ItemView.extend({
  		template: choiceTemp,
      className: 'choice',

  		events: {
  			'click':'selected'
  		},

      onRender: function(){
        this.$el.fadeIn(1200);

        // sets viewed to true so step navigator will
        // only allow the current most step to be opened
        this.model.step.set('viewed', true);
      },

  		selected: function(){
        var self = this;
        /* set answer to step model */
        this.model.step.attributes.answer = this.model.attributes.name;
        
        // CSS animation classes
        this.$el.find('.icon').addClass('checked');
        this.$el.find('.icon-svg').addClass('checked').attr('src','images/icons/checkmark.svg');
        this.$el.siblings().find('.icon-wrapper').addClass('not-checked');
        this.$el.addClass('fade-out').siblings().addClass('fade-out');
    		
        window.setTimeout(function(){
          // make step as completed
          self.model.step.set('completed', self.model);
          // trigger event to render next step
          Communicator.events.trigger('nextStep', self.model.get('nextStep') );
        }, 1000); 

  			if (this.model.get('onSelect'))
  			this.model.attributes.onSelect( this.model );
  		}
	});
});
