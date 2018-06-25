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
