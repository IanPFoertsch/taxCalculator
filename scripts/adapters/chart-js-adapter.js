'use-strict';
function ChartJSAdapter() {}

ChartJSAdapter.cashFlowConversion = function(projection) {
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
