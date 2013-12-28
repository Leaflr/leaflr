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
        // this.$el.fadeIn(1200);

        // sets viewed to true so step navigator will
        // only allow the current most step to be opened
        // this.model.step.set('viewed', true);
      },

      setHistory: function(){
        var self = this,
            step = this.model.step,
            survey = step.survey,
            historyEntry,
            selectedChoiceView;

        // find values that were saved
        function findHistoryEntry(){
          return _.find( survey.history, function(entry){
            console.log(entry, step)
            if ( entry.step.cid == step.cid )
            return entry.step;
          });
        }
        
        // if step has been completed already
        // 1. gets history entry
        // 2. gets choice view of selected choice
        historyEntry = findHistoryEntry();

        // set history on step model to show selected values on metric sliders 
        step.set('history', historyEntry);   
      },

  		selected: function(){
        var self = this;
        var theme = self.model.get('theme');

        /* set answer to step model */
        this.model.step.attributes.answer = this.model.attributes.name;

        
        // CSS animation classes
        this.$el.find('.icon').addClass('checked');
        this.$el.find('.icon-svg').addClass('checked').attr('src','themes/'+theme+'/images/icons/checkmark.svg');
        this.$el.siblings().find('.icon-wrapper').addClass('not-checked');

        window.setTimeout(function(){
          // make step as completed
          self.model.step.set('completed', self.model);
          self.$el.closest('.step').addClass('slide-out')
          // trigger event to render next step
          Communicator.events.trigger('nextStep', self.model.get('nextStep') );
          
        }, 500); 

  			if (this.model.get('onSelect'))
  			this.model.attributes.onSelect( this.model );

        this.setHistory();
  		}
	});
});
