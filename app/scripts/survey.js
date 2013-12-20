define([
	'backbone',
	'communicator',
	'survey/models/survey-model',
	'survey/models/step-model',
	'survey/models/choice-model',
  'survey/models/metric-model',
  'hbs!tmpl/survey/custom-step-vehicle',
], function(
  Backbone,
  Communicator,
  surveyModel,
  stepModel,
  choiceModel,
  metricModel,
  specificVehicleTemp ) {
  'use strict';

  //  vehicleType       = new stepModel({ title: 'What type of vehicle do you have?' }),
  //  fuelType          = new stepModel({ title: 'What type of fuel does your vehicle take?' }),
 //    roadType          = new stepModel({ title: 'What type of road is your commute?' }),
 //    distanceTraveled  = new stepModel({ title: 'How far do you commute?' }),
  //  specificDistance  = new stepModel({ title: 'specific distance' }),
  //  specificVehicle   = new stepModel({ title: 'Select your vehicle' }),
  //  userLocation      = new stepModel({ title: 'What is your location?' }),
 //    tripFrequency     = new stepModel({ title: 'How often will you ride your bike?' }),
 //    foo               = new stepModel({ title: 'foo' }),

  // Pull in the JSON.
 var rs = $.ajax({
   dataType: 'json',
   url: 'data/cahps.json',
   type: 'GET',
   async: false,
   success: function(data, textStatus, err) {
     return data;
   } 
 });
 var raw = eval('('+rs.responseText+')');

  /* Compile JSON Survey
   * =================== */
  function compileSurvey(obj) {
    for(var k in obj) {
      var v = obj[k];
      if(typeof obj[k] == "object" && obj[k] !== null) {
        compileSurvey(obj[k]); // Recurse 
      } else {
        if(k.match(/^_/)) {   // Match the underscore
          obj[k.replace(/_/g, '')] = eval('('+v+')');
        }
      }
    }   
    return obj;
  }

  // Do the compile
  console.log('Compiling Survey');
  raw = compileSurvey(raw);

  /* Build Metrics array
   * =================== */
  var metricsArray = [];
  $.each(raw.metrics, function(index, val){
    metricsArray[index] = new metricModel(val, {parse: true});
  });

  /* Build Step Array
   * ================ */
  var stepsArray = [];
  $.each(raw.steps, function(index, val) {
    /* Build Choice Array
     * ================== */
    var choiceArray = [];
    $.each(val.choices, function(i, v){
      choiceArray[i] = new choiceModel(v, {parse: true});
    });
    stepsArray[index] = new stepModel({
      title: val.title,
      name: val.name,
      choices: choiceArray
    }); 
  });

  /* Build Survey
   * ============ */
  var survey = new surveyModel({
    name: raw.name,
    category: raw.category,
    resultTitle: raw.resultTitle,
    metrics: metricsArray,
    steps: stepsArray
  });
  console.log(survey);

/* ====== DO NOT DELETE COMMENTED OUT CODE ====== */
/*   ====== NEED TO REFERENCE AJAX CALLS ======== */
/*
  var survey = new surveyModel({ 
    name: 'Bike to Work', 
    category: 'transit', 
    completed: true, 
    resultTitle: 'By biking to work you saved',
    metrics: [
      new metricModel({ name: 'gas', type: 'minus', measurement: 'Gallons of Gas'}),
      new metricModel({ name: 'emissions', type: 'minus', measurement: 'CO² ppm' }),
      new metricModel({ name: 'money', type: 'plus', measurement: 'Dollars Saved' }),
      new metricModel({ name: 'fitness', type: 'plus', measurement: 'Calories Burned', showSlider: false }),
      new metricModel({ name: 'oil', type: 'minus', measurement: 'Barrels of Oil', showSlider: false })
    ],
    steps: [ 
      new stepModel({
        title: 'What type of vehicle do you drive?',
        name: 'vehicle type',
        choices: [
          new choiceModel({
            name: 'sedan',
            iconClass: 'sedan',
            icon: 'sedan.svg',
            nextStep: 'fuel type',
            onSelect: function( choice ){
             
              choice.survey.results.carvid = 17760;
              $.ajax({
                url: 'data/vehicle.php?vid=17760',
                success: function(data) {
                  data = eval('('+data+')');
                  
                  console.log('FULL', data);
                  choice.survey.results.vehicle_nonspec = 1;
                  choice.survey.results.carmpghwy  = data.highway08;
                  choice.survey.results.carmpgcity = data.city08;
                  choice.survey.results.carco2      = data.co2TailpipeGpm;

                }
              });
              
              choice.saveMetric({ 'gas': 20, 'money': 10, 'emissions': 5 });
            }
          }),
          new choiceModel({
            name: 'suv',
            iconClass: 'suv',
            icon: 'suv.svg',
            nextStep: 'fuel type',
            onSelect: function( choice ) {
              choice.survey.results.carvid = 18068;
              $.ajax({
                url: 'data/vehicle.php?vid=18068',
                success: function(data) {
                  data = eval('('+data+')');

                  console.log('FULL', data);
                  choice.survey.results.vehicle_nonspec = 1;
                  choice.survey.results.carmpghwy  = data.highway08;
                  choice.survey.results.carmpgcity = data.city08;
                  choice.survey.results.carco2      = data.co2TailpipeGpm;
                }
              });

              choice.saveMetric({ 'gas': 60, 'money': 12, 'emissions': 15 });
            }
          }),
          new choiceModel({
            name: 'truck',
            iconClass: 'truck',
            icon: 'truck.svg',
            nextStep: 'fuel type',
            onSelect: function( choice ) {
              choice.survey.results.carvid = 17893;
              $.ajax({
                url: 'data/vehicle.php?vid=17893',
                success: function(data) {
                  data = eval('('+data+')');

                  console.log('FULL', data);
                  self.model.collection.parents[0].results.vehicle_nonspec = 1;
                  choice.survey.results.carmpghwy  = data.highway08;
                  choice.survey.results.carmpgcity = data.city08;
                  choice.survey.results.carco2      = data.co2TailpipeGpm;

                }
              });
              choice.saveMetric({ 'gas': 40, 'money': 40, 'emissions': 10 });
            }
          }),
          new choiceModel({
            name: 'specific',
            iconClass: 'sedan',
            icon: 'specifcVehicle.svg',
            nextStep: 'specific vehicle'
          }),
      ]}),
      
      // new stepModel({
      //   title: 'Enter your vehicle information',
      //   name: 'specific vehicle',
      //   template: 'template name',
      //   nextStep: 'fuel type'
      // }),

      new stepModel({
        name: 'fuel type',
        title: 'what type of fuel does your car use',
        choices: [
          new choiceModel({
            name: 'gas',
            iconClass: 'gas',
            icon: 'gas.svg',
            nextStep: 'user location',
            onSelect: function( choice ) {
              choice.survey.results.carfueltype = this.name;
              choice.saveMetric({ 'gas': 20, 'money': 20, 'emissions': 7 });
            }
          }),
          new choiceModel({
            name: 'electric',
            iconClass: 'electric',
            icon: 'electric.svg',
            nextStep: 'user location',
            onSelect: function( choice ) {
              choice.survey.results.carfueltype = this.name;
              choice.saveMetric({ 'gas': 5, 'money': 5, 'emissions': 0 });
            }
          }),
          new choiceModel({
            name: 'Diesel',
            iconClass: 'diesel',
            icon: 'diesel.svg',
            nextStep: 'user location',
            onSelect: function( choice ) {
              choice.survey.results.carfueltype = this.name;
              choice.saveMetric({ 'gas': 40, 'money': 40, 'emissions': 30 });
            }
          }),
          new choiceModel({
            name: 'hybrid',
            iconClass: 'hybrid',
            icon: 'hybrid.svg',
            nextStep: 'specific distance',
          }),
      ]}),

      new stepModel({
        name: 'user location',
        title: 'What is your location?',
        choices: [
          new choiceModel({
            name: 'Get Location',
            iconClass: 'geocode',
            icon: 'geocode.svg',
            nextStep: 'distance traveled',
            onSelect: function( choice ) {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(pos) {
                  var lat = pos.coords.latitude;
                  var lng = pos.coords.longitude;
                  choice.survey.results.loc = lat+','+lng;
                  choice.survey.results.zip = '95811';
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
                        choice.survey.results.loc = data.results.address_components[8].postal_code;

                    }
                  });
                  // END COMMENT
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
            nextStep: 'distance traveled',
            onSelect: function( choice ) {
              choice.survey.results.loc = this.name;
            }
          }),
      ]}),

      new stepModel({
        name: 'distance traveled',
        title: 'How many miles do you commute to work?',
        choices: [
          new choiceModel({
            name: '0-5',
            iconClass: '0-5',
            icon: '0-5.svg',
            nextStep: 'road type',
            onSelect: function( choice ) {
              choice.survey.results.tripdistance = 3;
              choice.saveMetric({ 'gas': 10, 'money': 5, 'emissions': 5 });
            }
          }),
          new choiceModel({
            name: '6-9',
            iconClass: '5-10',
            icon: '6-9.svg',
            nextStep: 'road type',
            onSelect: function( choice ) {
              choice.survey.results.tripdistance = 7;
              choice.saveMetric({ 'gas': 13, 'money': 10, 'emissions': 10 });
            }
          }),
          new choiceModel({
            name: '10',
            iconClass: '10',
            icon: '10.svg',
            nextStep: 'road type',
            onSelect: function( choice ) {
              choice.survey.results.tripdistance = 13;
              choice.saveMetric({ 'gas': 15, 'money': 15, 'emissions': 15 });
            }
          }),
          new choiceModel({
            name: 'Specific',
            iconClass: 'specificDistance',
            icon: 'specificDistance.svg',
            nextStep: 'road type',
          })
      ]}),

      new stepModel({
        name: 'road type',
        title: 'What type of road or something?',
        choices: [
          new choiceModel({
            name: 'Mostly Highway',
            iconClass: 'mostlyHighway',
            icon: 'mostlyHighway.svg',
            nextStep: 'trip frequency',
            onSelect: function( choice ) {
              choice.survey.results.hwyper = 80;
              choice.saveMetric({ 'gas': 40, 'money': 40, 'emissions': 40 });
            }
          }),
          new choiceModel({
            name: 'Equal Highway / City',
            iconClass: 'equalRoad',
            icon: 'equalRoad.svg',
            nextStep: 'trip frequency',
            onSelect: function( choice ) {
              choice.survey.results.hwyper = 50;
              choice.saveMetric({ 'gas': 40, 'money': 40, 'emissions': 40 });
            }
          }),
          new choiceModel({
            name: 'Mostly City',
            iconClass: 'mostlyCity',
            icon: 'mostlyCity.svg',
            nextStep: 'trip frequency',
            onSelect: function( choice ) {
              choice.survey.results.hwyper = 80;
              choice.saveMetric({ 'gas': 40, 'money': 40, 'emissions': 40 });
            }
          }),
          new choiceModel({
            name: 'Specific',
            iconClass: 'specificRoad',
            icon: 'specificRoad.svg',
            nextStep: 'trip frequency'
          }),
      ]}),

      new stepModel({
        name: 'trip frequency',
        title: 'How often do you bike instead of drive?',
        choices: [
        new choiceModel({
          name: '1 day a week',
          iconClass: '1-day',
          icon: '1-day.svg',
          nextStep: 'end',
          onSelect: function( choice ) {
            choice.survey.results.freq = 1;
            choice.saveMetric({ 'gas': 40, 'money': 40, 'emissions': 40 });
          }
        }),
        new choiceModel({
          name: '3 days a week',
          iconClass: '3-day',
          icon: '3-day.svg',
          nextStep: 'end',
          onSelect: function( choice ) {
            choice.survey.results.freq = 3;
            choice.saveMetric({ 'gas': 20, 'money': 20, 'emissions': 20 });
          }
        }),
        new choiceModel({
          name: '5 days a week',
          iconClass: '5-day',
          icon: '5-day.svg',
          nextStep: 'end',
          onSelect: function( choice ) {
            choice.survey.results.freq = 5;
            choice.saveMetric({ 'gas': 40, 'money': 40, 'emissions': 40 });
          }
        }),
        new choiceModel({
          name: 'Specific',
          iconClass: 'specificDays',
          icon: 'specificDays.svg',
          nextStep: 'end'
        }),
      ]})
    ]
  })
  */

	return survey;
});
