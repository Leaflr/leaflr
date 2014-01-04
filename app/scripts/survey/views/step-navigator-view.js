define([
	'backbone',
	'communicator',
	'hbs!tmpl/survey/step-navigator'
],
function( Backbone, Communicator, stepNavigatorTemp ) {
	'use strict';

	return Backbone.Marionette.ItemView.extend({
        template: stepNavigatorTemp,
        className: 'step-dot',

  		events: {
  			'click':'activateStep'
  		},

        attributes: function(){
            return {
                'data-model': this.model.cid
            }
        },
  		
  		initialize: function(){
            this.model.on('change:active', this.isActive, this);
            this.model.on('sliderSelected', this.sliderSelected, this)
  		},

  		// activateStep: function(e){
    //      // compile next step if it has been completed or is next available step      
  		// 	if ( this.model.has('completed') || this.model.get('viewed') == true ){
  		// 		Communicator.events.trigger('nextStep', this.model.get('name') );
  				
    //       if ( this.model.has('history') )
  		// 		this.highlightValues();
  		// 		else
  		// 		this.reactivateSliders();
  		// 	} 
  		// },

      sliderSelected: function(){
          if ( this.model.has('history') ){
          Communicator.events.trigger('nextStep', this.model.get('name') );
          
          this.highlightValues();
          
        } else {
          this.reactivateSliders();
        }
      },

  		isActive: function(){
        // checks for currently active step and highlights step indicator
  			if ( this.model.get('active') == true ){
            // reveals first 2 steps when second choice is active
            if ( this.$el.index() == 1 )
            this.$el.prev().css('display','inline-block').text(1);

            this.$el.css('display','inline-block').text( this.$el.index() + 1 );
  				  this.$el.siblings().removeClass('active-step');
  				  this.$el.addClass('active-step');

            Communicator.events.trigger('stepActivated');

  				  this.model.collection.each(function(model){ model.set('active', false) });
  			} 
  		},

  		highlightValues: function(){
  			var self = this,
  				history = self.model.survey.history,
  				stepHistory = self.model.get('history'),
  				stepHistoryValues = {},
  				values = {},
  				index,
  				metricSliders = $('#metric-sliders');
          
  			// get index of current step history entry in survey history
  			for (var i = 0; i < history.length; i++){
	         if ( history[i].step.cid == stepHistory.step.cid )
	         index = i;
	      }

	        // get values from current step history entry
	        for (var i = 0; i < stepHistory.values.length; i++){
	        	var metricName = stepHistory.values[i].metric;
	          	stepHistoryValues[metricName] = stepHistory.values[i].value;
	        }

        	// iterate through history and add all prev history values
        	if ( index > 0){

            // adds all previous values together
				for (var i = index - 1; i >= 0 ; i--){
	        		var metricValues = history[i].values

	        		for (var n = 0; n < metricValues.length; n++ ){
	        			var metricName = metricValues[n].metric
	        			if ( values.hasOwnProperty(metricName))
	        			values[metricName] = values[metricName] + metricValues[n].value
	        			else
	        			values[metricName] = metricValues[n].value
	        		}
	        	}

            // sets the width and position of metric sliders
	        	for (var metric in values){
	        		var pastValues = values[metric],
	        			currentValue = stepHistoryValues[metric],
	        			metricSlider = metricSliders.find('.' + metric + ' .past-value');

               if ( currentValue + pastValues > 100 )
               currentValue = pastValues - 100;

	        		if ( currentValue > 0)
	        		metricSlider.css({left: pastValues + '%', width: currentValue + '%', display: 'block' });
	        		else
	        		metricSlider.css({left: 0, display: 'none' });
	        	}

	        	metricSliders.find('.value').addClass('inactive-slider');

        	} else {

            // sets the width and position of metric sliders
        		for (var metric in stepHistoryValues){
        			var value = stepHistoryValues[metric],
        				metricSlider = metricSliders.find('.' + metric + ' .past-value');

        			if ( value > 0)
	        		metricSlider.css({left: 0, width: value + '%', display: 'block' });
	        		else
	        		metricSlider.css({left: 0, display: 'none' });	
	        	}

	        	metricSliders.find('.value').addClass('inactive-slider');

        	}
  		},

  		reactivateSliders: function(){
  			var sliders = $('#metric-sliders'),
  				currentValues = sliders.find('.value'),
  				historyValues = sliders.find('.past-value');

  			currentValues.removeClass('inactive-slider');
  			historyValues.css('display','none');
  		}

	});
});
