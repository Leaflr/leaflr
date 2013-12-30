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
  			'click' : 'selected'
  		},

  		selected: function(){
        var self = this;
        var theme = self.model.get('theme');

        /* set answer to step model */
        this.model.step.attributes.answer = this.model.attributes.name;

        // add CSS animation classes
        this.$el.find('.icon').addClass('checked');
        this.$el.find('.icon-svg').addClass('checked').attr('src','themes/'+theme+'/images/icons/checkmark.svg');
        this.$el.siblings().find('.icon-wrapper').addClass('not-checked');

        window.setTimeout(function(){
          // make step as completed
          self.model.step.set('completed', self.model);
          self.$el.closest('.step').attr('class','step reset-animation slide-out');

          // trigger event to render next step
          Communicator.events.trigger('nextStep', self.model.get('nextStep') );
          
        }, 500); 

  			if (this.model.get('onSelect'))
  			this.model.attributes.onSelect( this.model );

  		}
	});
});
