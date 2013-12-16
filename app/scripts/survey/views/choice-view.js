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
      },

  		selected: function(){
        var self = this;
        
        this.$el.find('.icon').addClass('checked');
        this.$el.find('.icon-svg').addClass('checked').attr('src','images/icons/checkmark.svg');
        this.$el.siblings().find('.icon-wrapper').addClass('not-checked');
        this.$el.addClass('fade-out').siblings().addClass('fade-out');
    		
        window.setTimeout(function(){
          Communicator.events.trigger('nextStep', self.model.get('nextStep') );
        }, 1000); 

  			if (this.model.get('onSelect'))
  			this.model.attributes.onSelect( this.model );
  		}
	});
});