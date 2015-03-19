/**
 * Created by yann on 24/02/2015.
 */
var React = require('react/addons');
var d3 = require('d3');
require('../../libs/nvd3');

/**
 * Created by yann on 24/02/2015.
 *
 * TODO : Snippet de base pour un composant react. Commentaire à éditer
 * @param name : nom a afficher dans le composant
 */
var TestD3 = React.createClass({

    propTypes: {},

    getDefaultProps: function () {
        return {};
    },

    getInitialState: function () {
        return {};
    },

    componentDidMount: function () {
        this.donutGraph();
        this.stackedBarGraph();
    },
    componentDidUpdate: function () {

    },
    /**
     * Crée un graphique de type donut
     */
    donutGraph: function () {
        var graph = {};

        //Donut chart example
        nv.addGraph(function () {
            var chart = graph = nv.models.pieChart()
                .x(function (d) {
                    return d.label
                })
                .y(function (d) {
                    return d.value
                })
                .showLabels(true)     //Display pie labels
                .labelThreshold(.05)  //Configure the minimum slice size for labels to show up
                .labelType("percent") //Configure what type of data to show in the label. Can be "key", "value" or "percent"
                .donut(true)          //Turn on Donut mode. Makes pie chart look tasty!
                .donutRatio(0.35);    //Configure how big you want the donut hole size to be.

            d3.select(".test-d3 svg.donut-graph")
                .datum(exampleData())
                .transition().duration(350)
                .call(chart);

            nv.utils.windowResize(chart.update);
            return chart;
        });
        // Pie chart example data. Note how there is only a single array of key-value pairs.
        function exampleData() {
            var libres = Math.floor((Math.random() * 100) + 1);
            var occupees = 100 - libres;
            return [
                {
                    "label": "Libres",
                    "value": libres
                },
                {
                    "label": "Occupées",
                    "value": occupees
                }
            ];
        }

        setInterval(function () {
            if (graph !== undefined) {
                d3.select(".test-d3 svg.donut-graph")
                    .datum(exampleData())
                    .transition().duration(350)
                    .call(graph);
            }
        }, 2000);
    },
    stackedBarGraph: function () {

        var graph = {};
        nv.addGraph(function () {
            var chart = graph = nv.models.multiBarChart()
                    .duration(350)
                    .stacked(true)
                    .reduceXTicks(true)   //If 'false', every single x-axis tick label will be rendered.
                    .rotateLabels(0)      //Angle to rotate x-axis labels.
                    .showControls(false)   //Allow user to switch between 'Grouped' and 'Stacked' mode.
                    .groupSpacing(0.1)    //Distance between each group of bars.
                ;

            chart.xAxis
                .tickFormat(d3.format(',f'));

            chart.yAxis
                .tickFormat(d3.format(',.1f'));

            d3.select('.test-d3 svg.stacked-graph')
                .datum(exampleData())
                .call(chart);

            nv.utils.windowResize(chart.update);

            return chart;
        });

        function stream_index(d, i) {
            return {x: i, y: Math.max(0, d)};
        }
        function stream_layers(n, m, o) {
            if (arguments.length < 3) o = 0;
            function bump(a) {
                var x = 1 / (.1 + Math.random()),
                    y = 2 * Math.random() - .5,
                    z = 10 / (.1 + Math.random());
                for (var i = 0; i < m; i++) {
                    var w = (i / m - y) * z;
                    a[i] += x * Math.exp(-w * w);
                }
            }
            return d3.range(n).map(function() {
                var a = [], i;
                for (i = 0; i < m; i++) a[i] = o + o * Math.random();
                for (i = 0; i < 5; i++) bump(a);
                return a.map(stream_index);
            });
        }

        //Generate some nice data.
        function exampleData() {
            return stream_layers(2, 4, .1).map(function (data, i) {
                return {
                    key: 'Stream #' + i,
                    values: data
                };
            });
        }

        setInterval(function () {
            if (graph !== undefined) {
                d3.select(".test-d3 svg.stacked-graph")
                    .datum(exampleData())
                    .transition().duration(350)
                    .call(graph);
            }
        }, 2000);

    },
    shouldComponentUpdate: function (nextProps, nextState) {
        return true;
    },

    render: function () {
        return (<div className="test-d3">
            <h3>Occupation des places : </h3>
            <svg className="donut-graph" style={{height: "120px", width: "120px"}}></svg>
            <h3>Occupation des zones : </h3>
            <svg className="stacked-graph" style={{height: "300px", width: "250px"}}></svg>
        </div>);
    }
});

// MODULE EXPORTÉ
module.exports = TestD3;