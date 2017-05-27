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
  this.chart.data.datasets[0].data = dataSeries;
  this.chart.update();
};

CanvasHandler.prototype.drawChart = function(canvas)  {
  this.chart =  new Chart(canvas, {
    type: 'line',
    data: {
      datasets: [{
        label: 'defaults',
        fill: true,
        data: [{
          x: 0,
          y: 60000
        }, {
          x: 3,
          y: 65000
        }, {
          x: 10,
          y: 70000
        }],
      }]
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
