'use-strict';
function ChartJSAdapter() {}

var stackedLineConfig = function() {
  return {
    type: 'line',
    data: { datasets: []},
    options: {
      scales: {
        xAxes: [{
          type: 'linear',
          position: 'bottom'
        }],
        yAxes: [{
          stacked: true,
        }]
      }
    }
  };
};

var stackedBarConfig = function() {
  return {
    type: 'bar',
    data: { datasets: [{}] },
    options: { scales: {
      xAxes: [{
        stacked: true
      }],
      yAxes: [{
        stacked: true
      }] }
    }
  };
};

ChartJSAdapter.chartConfig = function(type) {
  switch(type) {
  case 'line':
    return stackedLineConfig();
  case 'bar':
    return stackedBarConfig();
  }
};


ChartJSAdapter.lineChartConversion = function(projection) {
  var chartFormatted = {};

  var keys = Object.keys(projection[0]);

  projection.forEach((item, index) => {
    keys.forEach((key) => {
      chartFormatted[key] = chartFormatted[key] || [];

      var singleValue = {
        x: index,
        y: item[key],
      };

      chartFormatted[key].push(singleValue);
    });
  });

  return chartFormatted;
};

ChartJSAdapter.stackedBarChartConversion = function(projection) {
  var keys = Object.keys(projection[0]);
  var labels = _.map(_.range(projection.length), (i) => {
    return 'Year ' + i;
  });

  var result = {
    labels: labels,
  };

  var datasets = _.reduce(keys, (memo, key) => {
    var data = _.reduce(projection, (memo, singlePeriod) => {
      var value = singlePeriod[key];
      memo.push(value);
      return memo;
    }, []);

    memo.push({
      label: key,
      // backgroundColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
      // stack: 'Stack 0',
      data: data
    });
    return memo;
  }, []);

  result.datasets = datasets;
  return result;
};
