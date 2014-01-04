define([
	'backbone',
	'communicator',
	'survey/views/metric-sliders-view',
    'survey/views/steps-navigator-view',
    'survey/views/steps-view',
	'survey/views/choices-view',
    'survey/views/custom-step-view',
    'survey/views/survey-complete-view',
	'hbs!tmpl/survey/take-survey',
    'handlebars',],
function( Backbone, Communicator, metricSlidersView, stepsNavigatorView, stepsView, choicesView, customStepView, surveyCompleteView, takeSurveyTemp, Handlebars ){
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

    	regions: {
    	  metricSliders: "#metric-sliders",
          stepNavigator: '#step-navigator',
    	  surveySteps: "#survey-steps"
    	},

    	initialize: function(){
    		var self = this;

            // event is fired when a choice is clicked
    		Communicator.events.on('nextStep', function( stepName ){
    			if ( stepName == 'end' ) self.endSurvey(); 
                else self.nextStep( stepName );
    		});
    	},

    	onRender: function(){
    		var metrics = this.model.get('metrics'),
                steps   = this.model.get('steps');
			
			// initialize metric sliders
    		this.metricSliders.show( new metricSlidersView({ collection: metrics }) );
            this.stepNavigator.show( new stepsNavigatorView({ collection: steps }) );
            this.surveySteps.show( new stepsView({ collection: steps }) );
    	},

        nextStep: function( stepName ){
            var nextStepModel = _.find( this.model.get('steps').models, function(step){
                return step.get('name') == stepName;
            }), 
            nextStepView;

            nextStepModel.set('active', true);
                    
            nextStepView = this.surveySteps.currentView.children.findByModel( nextStepModel );
            nextStepView.activateStep();        
        },

        endSurvey: function(){
            
            this.model.set('completed', true);
            
            this.$el.find('#step-navigator .results').css('display','inline-block').addClass('active-step').siblings().removeClass('active-step');

            Communicator.events.trigger('endSurvey', this.model);

            var results = this.model.results;

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

            // this.metricSliders.closeAnimate();

            var surveyCompleted = new surveyCompleteView({ collection: this.model.get('metrics') });
            surveyCompleted.render();
            this.surveySteps.$el.append( surveyCompleted.el );

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

	});
});
