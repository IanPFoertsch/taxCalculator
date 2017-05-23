function ChartHolder(config, parentIdentifier) {
  DOMElement.call(this, config, parentIdentifier);
  this.type = 'Div';
}

ChartHolder.protoype = Object.create(DOMElement.prototype);

ChartHolder.prototype.prepare = function() {
  DOMElement.prototype.prepare.call(this);

  //TODO: extract this out to the CanvasHandler
  this.canvas = document.createElement('Canvas');
  this.canvas.width = this.config.width;
  this.canvas.height = this.config.height;

  this.element.className += this.config.cssClasses;
  this.element.appendChild(this.canvas);
  this.drawChart(this.canvas);
};

ChartHolder.prototype.drawChart = (canvas) => {
  this.chart =  new Chart(canvas, {
    type: 'line',
    data: {
      datasets: [{
        label: 'Scatter Dataset',
        data: [{
          x: 0,
          y: 1
        }, {
          x: 3,
          y: 2
        }, {
          x: 10,
          y: 6
        }],
        fill: false
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
