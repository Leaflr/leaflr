define([
	'backbone',
	'communicator',
	'survey/views/metric-sliders-view',
	'survey/views/choices-view',
    'survey/views/custom-step-view',
    'survey/views/survey-complete-view',
	'hbs!tmpl/survey/take-survey',
    'handlebars',],
function( Backbone, Communicator, metricSlidersView, choicesView, customStepView, surveyCompleteView, takeSurveyTemp, Handlebars ){
	'use strict';

    Backbone.Marionette.Region.prototype.closeAnimate = function(view){
        var view = this.currentView;

        if (!view || view.isClosed){ return; }
        
        this.$el.animate({ 'height': 0 }, 300);

        // call 'close' or 'remove', depending on which is found
        if (view.close) { view.close(); }
        else if (view.remove) { view.remove(); }

        Backbone.Marionette.triggerMethod.call(this, "close");

        delete self.currentView;
    }

	return Backbone.Marionette.Layout.extend({
  		template: takeSurveyTemp,

  		events: {
  			
  		},

    	regions: {
    	  metricSliders: "#metric-sliders",
    	  surveyStep: "#survey-step"
    	},

    	initialize: function(){
    		var self = this;

            // event is fired when a choice is clicked
    		Communicator.events.on('nextStep', function( stepName ){
    			if ( stepName == 'end' ){
                    self.endSurvey(); 
                } else {
                    var nextStepModel = _.find( self.model.get('steps').models, function(step){
                        return step.get('name') == stepName;
                    });
                    self.compileStep( nextStepModel );
                }
    		});
    	},

    	onRender: function(){
    		var metrics = this.model.get('metrics');
			
			// initialize metric sliders
    		this.metricSliders.show( new metricSlidersView({ collection: metrics }) );

    		// compile first step
    		this.compileStep();
    	},

        endSurvey: function(){
        
            Communicator.events.trigger('endSurvey', this.model);

            var results = this.model.results;
            console.log('complete',this.model)

            // Calculations
            var gallons = ((results.tripdistance * (results.hwyper / 100)) / results.carmpghwy) + ((results.tripdistance * ((100 - results.hwyper) / 100)) / results.carmpgcity);
            gallons = (gallons * (2 * results.freq));

            var money   = (gallons * 3.33);
            var boi = (gallons / 19);

            var co2     = results.tripdistance * results.carco2;
            co2 = ((co2 * results.freq) * 2);

            var calories  = results.tripdistance * 48;
            calories = ((calories * results.freq) * 2);

            var data = {};
            data.oil = boi.toFixed(2);
            data.money = '$'+money.toFixed(2);
            data.gas = gallons.toFixed(2);
            data.calories = calories;

            console.log('gallons', gallons);
            console.log('money', money);
            console.log('co2', co2);
            console.log('cal', calories);
            console.log('boi', boi);

            this.metricSliders.closeAnimate();

            this.surveyStep.show( new surveyCompleteView({ collection: this.model.get('metrics') }))

            /* Send data to database
             * ===================== */
            $.ajax({
              url: 'data/survey_insert.php',
              type: 'POST',
              data: this.model.results,
              onSuccess: function(data) {
                console.log(data)
              }
            });
        },

    	compileStep: function( step ){
    		var steps = this.model.get('steps').models,
    			step,
                view,
                parent,
    			stepsContent = [];
                // console.log(steps)
            // if first step in survey, show first set of choices
        	if ( !step ) step = steps[0].get('choices');
            // if custom step
            else if ( step.get('template') ) step = step;
            // else show the next step
        	else step = step.get('choices');
        	
        	this.currentStep = step;
        	console.log(this.model.history)
            // sets view depending on type of step
            if ( step && step.get('template') )
            view = new customStepView({ model: step, template: step.get('template') });
            else
            view = new choicesView({ collection: step });
    		
            this.surveyStep.show( view );
    	}

	});
});
