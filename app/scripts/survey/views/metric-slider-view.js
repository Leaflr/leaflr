define([
	'backbone',
	'communicator',
	'hbs!tmpl/survey/metric-slider'],
function( Backbone, Communicator, metricSliderTemp ){
	'use strict';

	return Backbone.Marionette.ItemView.extend({
  		template: metricSliderTemp,
      className: function(){
  			var name = this.model.get('name');
  			return 'slider metric-slider-inner ' + name;
  		},
  		initialize: function(){
  			this.listenTo(this.model, 'change:value', this.changeVal);
  		},
  		changeVal: function(){
  			this.$el.find('.value').width( this.model.get('value') + '%' );
  		},
      onBeforeRender: function(){
        if ( this.model.get('showSlider') == false ){
          this.$el.hide();
        } 
      }
	});
});