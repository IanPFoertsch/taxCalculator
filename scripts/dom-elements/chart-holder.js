function ChartHolder(config, parentIdentifier) {
  DOMElement.call(this, config, parentIdentifier);
  this.type = 'Div';

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
  var currentLabels = _.map(this.chart.data.datasets, (set) => {
    return set.label;
  });

  var labels = Object.keys(dataSeries);

  _.each(labels, (label) => {
    if (currentLabels.includes(label)) {
      var series = _.find(this.chart.data.datesets, (set) => {
        return set.label === label;
      });
      series.data = dataSeries[label];
    } else {
      var newData = {
        label: label,
        data: dataSeries[label],
        fill: true
      };
      this.chart.data.datasets.push(newData);
    }
  });
  this.chart.update();
};

CanvasHandler.prototype.drawChart = function(canvas)  {
  this.chart =  new Chart(canvas, {
    type: 'line',
    data: {
      datasets: [{}]
    },
    options: {
      scales: {
        xAxes: [{
          type: 'linear',
          position: 'bottom'
        }]
      }
    }
  });
};
