require.config({
    paths: {
        "highcharts": "//code.highcharts.com/highcharts"
    },
    shim: {
        "highcharts": {
            "exports": "Highcharts",
            "deps": [ "jquery"] 
        },
    } // end Shim Configuration
});

define(function(require, exports, module) {
    var _ = require("underscore");
    var mvc = require("splunkjs/mvc");
    var SimpleSplunkView = require("splunkjs/mvc/simplesplunkview");
    var HighCharts = require("highcharts");

    var HighChartView = SimpleSplunkView.extend({
        className: "highchartview",

        // Set options for the visualization
        options: {
            data: "preview",  // The data results model from a search
            type: "line",
            span: 86400,
            unitLabel: '',
            valueLabel: '',
        },
        output_mode: 'json',

        // Override this method to configure the view
        createView: function() {
            // TODO: Create a visualization
            //console.log("createView");
            return { container: this.$el, } ;
        },

        // Override this method to format the data for the view
        formatData: function(data) {
            //console.log("formatData", data);
            //console.log("formatData");
            highData = {}

            var seriesField = this.settings.get('seriesField');
            var valueField = this.settings.get('valueField');

            var groupedValues = _(data).groupBy(seriesField);
            _(groupedValues).map(function(value, key){
                highData[key] = _(value).map(function(item) { 
                    if (item[valueField]) {
                        return [ new Date(item["_time"]).getTime(), parseFloat(item[valueField]) ]
                    } else {
                        return [ new Date(item["_time"]).getTime(), null ]
                    }
                });
            });

            //debugger;
            //console.log("highData", highData);
            //console.log("first", Object.keys(highData)[0])
            
            return highData;
        },

        // Override this method to put the formatted Splunk data into the view
        updateView: function(viz, data) {
            // TODO: Display the data in the view
            //console.log("updateView", data);
            
            this.$el.empty();

            var containerId = _.uniqueId("highchart");
            //console.log("id", containerId);

            //debugger;
            
            $('<div />').clone().attr('id', containerId).height(this.settings.get('height')).width(this.settings.get('width')).appendTo(this.$el);    

            // Span adjustements    
            var spanLabels = {}; 

            if(this.settings.get('span') <= 3600) {
                spanLabels = {
                    day: '%H:%M',
                    hour: '%H:%M'
                };             
            } else if(this.settings.get('span') <= 86400) {
                spanLabels = {
                    day: '%A'
                };
            } else if(this.settings.get('span') <= 604800) {
                spanLabels = {
                    day: '%H:%M',
                    hour: '%H:%M'
                };                
            } else {
                spanLabels = {
                    millisecond: '%H:%M:%S.%L',
                    second: '%H:%M:%S',
                    minute: '%H:%M',
                    hour: '%H:%M',
                    day: '%e. %b',
                    week: '%e. %b',
                    month: '%b \'%y',
                    year: '%Y'
                };
            }
            //debugger;

            // Global Highchart settings
            Highcharts.setOptions({
                global: {
                    useUTC: false
                }
            });
            
            chartOptions = {
                chart: {
                    renderTo: containerId,
                    zoomType: 'xy',
                    height: this.settings.get('height')
                },
                plotOptions: {
                    series: {
                        animation: false,
                        marker: {
                            enabled: false
                        }
                    }
                },
                title: {
                    text: ''
                },
                legend: {
                    borderWidth: 0
                },
                xAxis: [{
                    type: 'datetime',
                    tickInterval: this.settings.get('span') * 1000,
                    tickmarkPlacement: 'on',
                    dateTimeLabelFormats: spanLabels
                }, {
                    type: 'datetime',
                    lineWidth: 0,
                    tickWidth: 0,
                    tickInterval: this.settings.get('span') * 1000,
                    labels: {
                        enabled: false
                    }
                }],
                yAxis: [{ // Primary yAxis
                    lineWidth: 1,
                    tickWidth: 1,
                    labels: {
                        format: '{value}' + this.settings.get('unitLabel'),
                    },
                    title: {
                        text: this.settings.get('valueLabel'),
                    },

                }],
                tooltip: {
                
                },
                series: [{
                    name: Object.keys(highData)[0],
                    type: this.settings.get('type'),
                    xAxis: 0,
                    data: data[Object.keys(data)[0]],
                    tooltip: {
                        valueSuffix: this.settings.get('unitLabel')
                    }

                }, {
                    name: Object.keys(highData)[1],
                    type: this.settings.get('type'),
                    xAxis: 1,
                    data: data[Object.keys(data)[1]],
                    tooltip: {
                        valueSuffix: this.settings.get('unitLabel')
                    }
                }]
            } // End chartOption

            splunkHighChart = new Highcharts.Chart(chartOptions);
                
        } // End updateView
    }); // End HighChartView
    return HighChartView;
});