define([
    'backbone',
    'communicator'
],
function( Backbone, Communicator ) {
	'use strict';

	return Backbone.Marionette.ItemView.extend({
        events: {
            'click .submit':'triggerNext',
            'change .year': 'yearSelect',
            'change .make': 'makeSelect',
            'change .model': 'optSelect',
            'change .options': 'vehicleDone'
		},
		initialize: function(){
			console.log(this)
		},
        onRender: function() {
            if(this.model.get('step') == 'specific vehicle') {
                $('.options').hide();
                $.ajax({
                    url: 'data/vehicle.php?year=0',
                    success: function(data) {
                        data = eval('('+data+')');
                        $.each(data.menuItem, function(index, val) {
                            var opt = $('<option>', {
                                value: val.value,
                                html: val.text
                            });
                            $(opt).appendTo($('.year'));
                        });
                    }
                });
            }
        },

		triggerNext: function(){
			Communicator.events.trigger('nextStep', this.model.get('nextStep'))
		},

        yearSelect: function() {
            var year = $('.year').val();
            $.ajax({
                url: 'data/vehicle.php?year='+year,
                success: function(data) {
                    data = eval('('+data+')');
                    $.each(data.menuItem, function(index, val) {
                        var opt = $('<option>', {
                            value: val.value,
                            html: val.text
                        });
                        $(opt).appendTo($('.make'));
                    });
                }
            });
        },
        makeSelect: function() {
            var make = $('.make').val();
            var year = $('.year').val();
            $.ajax({
                url: 'data/vehicle.php?year='+year+'&make='+make,
                success: function(data) {
                    data = eval('('+data+')');
                    $.each(data.menuItem, function(index, val) {
                        var opt = $('<option>', {
                            value: val.value,
                            html: val.text
                        });
                        $(opt).appendTo($('.model'));
                    });
                }
            });
        },
        optSelect: function() {
            var year = $('.year').val();
            var make = $('.make').val();
            var model = $('.model').val();
            var self = this;
            $.ajax({
                url: 'data/vehicle.php?year='+year+'&make='+make+'&model='+model,
                success: function(data) {
                    data = eval('('+data+')');
                    // check single.
                    if(data.menuItem.length > 0) {
                        $('.options').show();
                        $.each(data.menuItem, function(index, val) {
                            var opt = $('<option>', {
                                value: val.value,
                                html: val.text
                            });
                            $(opt).appendTo($('.options'));
                        });
                    } else {
                        self.model.collection.parents[0].results.car_id = data.menuItem.value;
                        self.vehicleDone();
                    } //end else
                }
            });
        },
        vehicleDone: function() {
            var self = this;
            var year = $('.year').val();
            var make = $('.make').val();
            var model = $('.model').val();
            var option = $('.options').val();
            if(option == null) {
                option = self.model.collection.parents[0].results.car_id;
            }

            $.ajax({
                url: 'data/vehicle.php?vid='+option,
                success: function(data) {
                    data = eval('('+data+')');

                    console.log('FULL', data);
                    self.model.collection.parents[0].results.caryear = year;
                    self.model.collection.parents[0].results.carmake = make;
                    self.model.collection.parents[0].results.carmodel = model;
                    self.model.collection.parents[0].results.vehicle_nonspec = 1;
                    if(option != null) {
                        self.model.collection.parents[0].results.carvid = option;
                    }
                    self.model.collection.parents[0].results.carmpghwy  = data.highway08;
                    self.model.collection.parents[0].results.carmpgcity = data.city08;
                    self.model.collection.parents[0].results.carco2      = data.co2TailpipeGpm;
                    self.triggerNext();
                }
            });
        }
	});
});
