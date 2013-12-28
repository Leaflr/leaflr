define([
	'backbone',
	'communicator',
	'survey/models/survey-model',
	'survey/models/step-model',
	'survey/models/choice-model',
  'survey/models/metric-model',
  'hbs!tmpl/custom-step-vehicle',
], function(
  Backbone,
  Communicator,
  surveyModel,
  stepModel,
  choiceModel,
  metricModel,
  specificVehicleTemp ) {
  'use strict';

	var survey = new surveyModel({ name: 'Bike to Work', category: 'transit', completed: true, resultTitle: 'By biking to work you saved' }),
		vehicleType       = new stepModel({ title: 'What type of vehicle do you have?' }),
		fuelType          = new stepModel({ title: 'What type of fuel does your vehicle take?' }),
    roadType          = new stepModel({ title: 'What type of road is your commute?' }),
    distanceTraveled  = new stepModel({ title: 'How far do you commute?' }),
		specificDistance  = new stepModel({ title: 'specific distance' }),
		specificVehicle   = new stepModel({ title: 'Select your vehicle' }),
		userLocation      = new stepModel({ title: 'What is your location?' }),
    tripFrequency     = new stepModel({ title: 'How often will you ride your bike?' }),
    foo               = new stepModel({ title: 'foo' }),
		gas               = new metricModel({ name: 'gas', type: 'minus', measurement: 'Gallons of Gas'}),
		emissions         = new metricModel({ name: 'emissions', type: 'minus', measurement: 'CO² ppm' }),
		money             = new metricModel({ name: 'money', type: 'plus', measurement: 'Dollars Saved' }),
    calories          = new metricModel({ name: 'fitness', type: 'plus', measurement: 'Calories Burned', showSlider: false }),
    oil               = new metricModel({ name: 'oil', type: 'minus', measurement: 'Barrels of Oil', showSlider: false });

	survey.set('metrics', [ gas, emissions, money, calories, oil ]);

	survey.set('steps', [
    vehicleType,
    fuelType,
    roadType,
    distanceTraveled,
    specificDistance,
    specificVehicle,
    userLocation,
    tripFrequency
  ]);

  survey.results = {};
  survey.results.vehicle_nonspec = 0;

	/////////////////////////////
	// 	STEP 1
	/////////////////////////////

  /* Vehicle Type
   * ============ */	
	vehicleType.set('choices', [
		new choiceModel({
			name: 'sedan',
			iconClass: 'sedan',
			icon: 'sedan.svg',
			nextStep: fuelType,
			onSelect: function( step ){
        survey.results.carvid = 17760;
        $.ajax({
          url: 'data/vehicle.php?vid=17760',
          success: function(data) {
            data = eval('('+data+')');

            console.log('FULL', data);
            survey.results.vehicle_nonspec = 1;
            survey.results.carmpghwy  = data.highway08;
            survey.results.carmpgcity = data.city08;
            survey.results.carco2      = data.co2TailpipeGpm;

          }
        });
        
        step.saveMetric({ 'gas': 20, 'money': 10, 'emissions': 5 });
				// gas.add(20);
    //     money.add(10);
    //     emissions.add(5);
			}
		}),
		new choiceModel({
			name: 'suv',
			iconClass: 'suv',
			icon: 'suv.svg',
			nextStep: fuelType,
      onSelect: function() {
        survey.results.carvid = 18068;
        $.ajax({
          url: 'data/vehicle.php?vid=18068',
          success: function(data) {
            data = eval('('+data+')');

            console.log('FULL', data);
            survey.results.vehicle_nonspec = 1;
            survey.results.carmpghwy  = data.highway08;
            survey.results.carmpgcity = data.city08;
            survey.results.carco2      = data.co2TailpipeGpm;
          }
        });

        gas.add(60);
        money.add(12);
        emissions.add(15);
      }
		}),
		new choiceModel({
			name: 'truck',
			iconClass: 'truck',
			icon: 'truck.svg',
			nextStep: fuelType,
      onSelect: function() {
        survey.results.carvid = 17893;
        $.ajax({
          url: 'data/vehicle.php?vid=17893',
          success: function(data) {
            data = eval('('+data+')');

            console.log('FULL', data);
            self.model.collection.parents[0].results.vehicle_nonspec = 1;
            survey.results.carmpghwy  = data.highway08;
            survey.results.carmpgcity = data.city08;
            survey.results.carco2      = data.co2TailpipeGpm;

          }
        });

        gas.add(40);
        money.add(40);
        emissions.add(10);

      }
		}),
		new choiceModel({
			name: 'specific',
			iconClass: 'sedan',
			icon: 'specifcVehicle.svg',
			nextStep: specificVehicle
		}),
	]);

  specificVehicle.set({
    template: specificVehicleTemp,
    nextStep: fuelType, 
  });

  /* Fuel Type
   * ========= */
	fuelType.set('choices', [
		new choiceModel({
			name: 'gas',
			iconClass: 'gas',
			icon: 'gas.svg',
      nextStep: userLocation,
      onSelect: function() {
        survey.results.carfueltype = this.name;

        gas.add(20);
        money.add(20);
        emissions.add(7);
      }
		}),
		new choiceModel({
			name: 'electric',
			iconClass: 'electric',
			icon: 'electric.svg',
      nextStep: userLocation,
      onSelect: function() {
        survey.results.carfueltype = this.name;

        gas.add(5);
        money.add(5);
        emissions.add(0);
      }
		}),
		new choiceModel({
			name: 'Diesel',
			iconClass: 'diesel',
			icon: 'diesel.svg',
      nextStep: userLocation,
      onSelect: function() {
        survey.results.carfueltype = this.name;

        gas.add(40);
        money.add(40);
        emissions.add(30);
      }
		}),
		new choiceModel({
			name: 'hybrid',
			iconClass: 'hybrid',
			icon: 'hybrid.svg',
      nextStep: specificDistance,
		}),
	]);

  /* Location
   * ======== */
  userLocation.set('choices', [
    new choiceModel({
      name: 'Get Location',
      iconClass: 'geocode',
      icon: 'geocode.svg',
      nextStep: distanceTraveled,
      onSelect: function() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(pos) {
            var lat = pos.coords.latitude;
            var lng = pos.coords.longitude;
            survey.results.loc = lat+','+lng;
            survey.results.zip = '95811';
            /* Grab zipcode from google api
             * ============================ */
             /*
             // Do this later...
            $.ajax({
              url: 'http://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lng+'&sensor=true',
              type: 'GET',
              async: true,
              success: function(data) {
                console.log('google results', data);  
                  survey.results.loc = data.results.address_components[8].postal_code;

              }
            });
            */
          });
        } else {
          console.log("Geolocation is not supported by this browser.");
        }
      }
    }),
    new choiceModel({
      name: 'Enter Zipcode',
      iconClass: 'zipcode',
      icon: 'zipcode.svg',
      nextStep: distanceTraveled,
      onSelect: function() {
        survey.results.loc = this.name;
      }
    }),
  ]);

  /* Distance Traveled
   * ================= */
  distanceTraveled.set('choices', [
    new choiceModel({
      name: '0-5',
      iconClass: '0-5',
      icon: '0-5.svg',
      nextStep: roadType,
      onSelect: function() {
        survey.results.tripdistance = 3;

        gas.add(10);
        money.add(5);
        emissions.add(5);
      }
    }),
    new choiceModel({
      name: '6-9',
      iconClass: '5-10',
      icon: '6-9.svg',
      nextStep: roadType,
      onSelect: function() {
        survey.results.tripdistance = 7;

        gas.add(13);
        money.add(10);
        emissions.add(10);
      }
    }),
    new choiceModel({
      name: '10',
      iconClass: '10',
      icon: '10.svg',
      nextStep: roadType,
      onSelect: function() {
        survey.results.tripdistance = 13;

        gas.add(15);
        money.add(15);
        emissions.add(15);
      }
    }),
    new choiceModel({
      name: 'Specific',
      iconClass: 'specificDistance',
      icon: 'specificDistance.svg',
      nextStep: roadType,
    })
  ]);

  /* Road Type
   * ========= */
  roadType.set('choices', [
    new choiceModel({
      name: 'Mostly Highway',
      iconClass: 'mostlyHighway',
      icon: 'mostlyHighway.svg',
      nextStep: tripFrequency,
      onSelect: function() {
        survey.results.hwyper = 80;

          gas.add(40);
          money.add(40);
          emissions.add(40);
      }
    }),
    new choiceModel({
      name: 'Equal Highway / City',
      iconClass: 'equalRoad',
      icon: 'equalRoad.svg',
      nextStep: tripFrequency,
      onSelect: function() {
        survey.results.hwyper = 50;

          gas.add(40);
          money.add(40);
          emissions.add(40);
      }
    }),
    new choiceModel({
      name: 'Mostly City',
      iconClass: 'mostlyCity',
      icon: 'mostlyCity.svg',
      nextStep: tripFrequency,
      onSelect: function() {
        survey.results.hwyper = 80;

          gas.add(40);
          money.add(40);
          emissions.add(40);
      }
    }),
    new choiceModel({
      name: 'Specific',
      iconClass: 'specificRoad',
      icon: 'specificRoad.svg',
      nextStep: tripFrequency
    }),
  ]);


  /* Trip Frequency (how often ride bike)
   * ==================================== */
  tripFrequency.set('choices', [
    new choiceModel({
      name: '1 day a week',
      iconClass: '1-day',
      icon: '1-day.svg',
      nextStep: 'end',
      onSelect: function() {
        survey.results.freq = 1;

        gas.add(40);
        money.add(40);
        emissions.add(40);
      }
    }),
    new choiceModel({
      name: '3 days a week',
      iconClass: '3-day',
      icon: '3-day.svg',
      nextStep: 'end',
      onSelect: function() {
        survey.results.freq = 3;

        gas.add(20);
        money.add(20);
        emissions.add(20);
      }
    }),
    new choiceModel({
      name: '5 days a week',
      iconClass: '5-day',
      icon: '5-day.svg',
      nextStep: 'end',
      onSelect: function() {
        survey.results.freq = 5;

        gas.add(40);
        money.add(40);
        emissions.add(40);
      }
    }),
    new choiceModel({
      name: 'Specific',
      iconClass: 'specificDays',
      icon: 'specificDays.svg',
      nextStep: 'end'
    }),
  ]);

  // Communicator.events.trigger('surveyCreated');

	// specificVehicle.set('choices', [
	// 	new choiceModel({
	// 		name: 'vehicle',
	// 		customView: '',
	// 		nextStep: ''
	// 	})
	// ]);

	return survey;
});
