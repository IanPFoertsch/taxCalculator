var stackedLineConfig = function() {
  return {
    type: 'line',
    data: { datasets: [{}] },
    options: { scales: {
      xAxes: [{
        type: 'linear',
        position: 'bottom'
      }],
      yAxes: [{
        stacked: true
      }] }
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


function ChartHolder(config, parentIdentifier) {
  DOMElement.call(this, config, parentIdentifier);
  this.type = 'Div';
  this.updateFunction = config.updateFunction;
  this.canvasHandler = new CanvasHandler(config.canvas, this.identifier);
}

ChartHolder.protoype = Object.create(DOMElement.prototype);

ChartHolder.prototype.prepare = function() {
  DOMElement.prototype.prepare.call(this);

  this.canvasHandler.prepare();
};

ChartHolder.prototype.update = function(dataSeries) {
  this.canvasHandler.update(dataSeries);
}

function CanvasHandler(config, parentIdentifier) {
  DOMElement.call(this, config, parentIdentifier);
  this.type = 'Canvas';
}

CanvasHandler.protoype = Object.create(DOMElement.prototype);

CanvasHandler.prototype.prepare = function() {
  DOMElement.prototype.prepare.call(this);

  this.drawChart(this.element);
};

CanvasHandler.prototype.update = function(dataSeries) {
  //TODO: break this out to have a "ChartAdapter" class to map
  //logic to specific input requirements for different chart types
  //or charting libraries.
  var currentLabels = _.map(this.chart.data.datasets, (set) => {
    return set.label;
  });
  var labels = Object.keys(dataSeries);

  _.each(labels, (label) => {
    if (currentLabels.includes(label)) {
      var series = _.find(this.chart.data.datasets, (set) => {
        return set.label === label;
      });
      series.data = dataSeries[label];
    } else {
      var newData = {
        label: label,
        data: dataSeries[label],
        fill: '2',
        backgroundColor: '#' + Math.floor(Math.random() * 16777215).toString(16)
      };
      this.chart.data.datasets.push(newData);
    }
  });

  this.chart.update();
};

CanvasHandler.prototype.drawChart = function(canvas)  {
  var chartConfig = (function(type) {
    switch(type) {
    case 'line':
      return stackedLineConfig();
    case 'bar':
      return stackedBarConfig();
    }
  })(this.config.type);

  this.chart = new Chart(canvas, chartConfig);
};
