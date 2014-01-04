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
        var self = this,
            theme = self.model.get('theme'),
            siblings = this.$el.siblings(),
            iconWrapper = this.$el.find('.icon-wrapper'),
            icon = this.$el.find('.icon'),
            iconSVG = this.$el.find('.icon-svg');

        /* set answer to step model */
        this.model.step.attributes.answer = this.model.attributes.name;

        if ( this.model.step.has('completed') ){
          iconWrapper.removeClass('not-checked');
          siblings.find('.chosen').removeClass('chosen');
          siblings.find('.icon.checked').removeClass('checked');
          siblings.find('.icon-svg.checked').attr('src','themes/'+theme+'/images/icons/'+ siblings.find('.icon-svg.checked').attr('data-icon') ).removeClass('checked');
        }

        // add CSS animation classes
        icon.addClass('checked');
        iconSVG.addClass('checked').attr('src','themes/'+theme+'/images/icons/checkmark.svg');
        siblings.find('.icon-wrapper').addClass('not-checked');

        setTimeout(function(){
          // make step as completed
          self.model.step.set('completed', self.model);
          self.$el.closest('.step').attr('class','step reset-animation slide-out');

          // trigger event to render next step
          Communicator.events.trigger('nextStep', self.model.get('nextStep') );
            
          setTimeout(function(){
            iconWrapper.addClass('chosen');
          }, 200);

        }, 500);

  			if (this.model.get('onSelect'))
  			this.model.attributes.onSelect( this.model );

  		}
	});
});
