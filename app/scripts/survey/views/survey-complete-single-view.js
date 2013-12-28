define(['backbone','hbs!tmpl/survey/survey-complete-single'], function(Backbone, surveyCompleteSingle){
	'use strict';

	return Backbone.Marionette.ItemView.extend({
		template: surveyCompleteSingle,
		
		className: function(){
			return 'result ' + this.model.get('type');
		},

		ui: {
			val: '.result-value'
		},

		onRender: function(){
			var value = this.model.get('value'),
				index = this.model.collection.indexOf(this.model),
				self = this,
				delay;

			if (index == 0) delay = 0;
			else delay = index * 250;

			self.ui.val.text(0);

			window.setTimeout(function(){
				$({ resultValue: 0 }).animate({ resultValue: value }, {
		            step: function() { 
		                self.ui.val.text(Math.ceil(this.resultValue));
		            }
		        }, 500);
			}, delay )
	        
		}
	});
});