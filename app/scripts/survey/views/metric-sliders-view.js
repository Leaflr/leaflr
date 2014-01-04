define([
	'backbone',
	'communicator',
	'survey/views/metric-slider-view',
	'hbs!tmpl/survey/metric-sliders'
],
function( Backbone, Communicator, metricSliderView, metricSlidersTemp ){
	'use strict';

	return Backbone.Marionette.CollectionView.extend({
  		template: metricSlidersTemp,
  		className: 'metric-sliders',
  		itemView: metricSliderView
	});
});
