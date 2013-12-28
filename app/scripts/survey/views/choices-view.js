define([
	'backbone',
	'communicator',
	'survey/views/choice-view',
	'hbs!tmpl/survey/choices'],
function( Backbone, Communicator, choiceView, choicesTemp ){
	'use strict';

	return Backbone.Marionette.CompositeView.extend({
  		template: choicesTemp,
  		itemView: choiceView,

  		ui: {
  			stepTitle: 'h6'
  		},

  		onRender: function(){
  			var step = this.collection.parents[0],
            survey = step.survey,
            stepTitle = step.get('title'),
            historyEntry,
            selectedChoiceView;
  			
        this.ui.stepTitle.text( stepTitle );

  		}

	});
});