define([
	'backbone',
	'communicator',
	'survey/views/choice-view',
	'hbs!tmpl/survey/choices'
],
function( Backbone, Communicator, choiceView, choicesTemp ) {
	'use strict';

	return Backbone.Marionette.CompositeView.extend({
  		template: choicesTemp,
  		itemView: choiceView,

  		ui: {
  			stepTitle: 'h6'
  		},

  		onRender: function() {
  		    var step = this.collection.parents[0],
            survey = step.survey,
            theme  = step.survey.theme,
            stepTitle = step.get('title'),
            historyEntry,
            selectedChoiceView;
  			
            this.ui.stepTitle.text( stepTitle );

            // find values that were saved
            function findHistoryEntry(){
                return _.find( survey.history, function(entry){
                    if ( entry.step.cid == step.get('completed').step.cid )
                    return entry.step;
                });
            }
            
            // if step has been completed already
            // 1. gets history entry
            // 2. gets choice view of selected choice
            if ( step.has('completed') ){
                historyEntry = findHistoryEntry();
                selectedChoiceView = this.children.findByModel( step.get('completed') );
                  
                // add classes to choices to indicate which were chosen
                selectedChoiceView.$el.find('.icon-wrapper').addClass('chosen');
                selectedChoiceView.$el.find('.icon').addClass('checked');
                selectedChoiceView.$el.find('.icon-svg').addClass('checked').attr('src','themes/'+theme+'/images/icons/checkmark.svg');
                selectedChoiceView.$el.siblings().find('.icon-wrapper').addClass('not-checked');

                // set history on step model to show selected values on metric sliders 
                step.set('history', historyEntry);
            }

        }
    });
});
