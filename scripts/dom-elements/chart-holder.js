

function ChartHolder(config, parentIdentifier) {
  DOMElement.call(this, config, parentIdentifier);
  this.type = 'Div';
  this.updateFunction = config.updateFunction;
  var handlerClazz = (function(type) {
    switch(type) {
    case 'line':
      return LineCanvasHandler;
    case 'bar':
      return BarCanvasHandler;
    }
  })(this.config.canvas.type);

  this.canvasHandler = new handlerClazz(config.canvas, this.identifier);
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

CanvasHandler.prototype.drawChart = function(canvas)  {
  var chartConfig = ChartJSAdapter.chartConfig(this.config.type);

  this.chart = new Chart(canvas, chartConfig);
};

function LineCanvasHandler(config, parentIdentifier) {
  CanvasHandler.call(this, config, parentIdentifier);
}

LineCanvasHandler.prototype = Object.create(CanvasHandler.prototype);

LineCanvasHandler.prototype.update = function(dataSeries) {
  //TODO: break this out to have a "ChartAdapter" class to map
  //logic to specific input requirements for different chart types
  //or charting libraries.

  var currentLabels = _.reduce(this.chart.data.datasets, (memo, dataset) => {
    //filter out chartJS's metadata dataset
    if (dataset.label != undefined) {
      memo.push(dataset.label)
    }
    return memo
  }, [])


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
        fill: 'origin',
        backgroundColor: '#' + Math.floor(Math.random() * 16777215).toString(16)
      };
      this.chart.data.datasets.push(newData);
      this.chart.data.labels.push(label)
    }
  });

  this.chart.update();
};

function BarCanvasHandler(config, parentIdentifier) {
  CanvasHandler.call(this, config, parentIdentifier);
}

BarCanvasHandler.prototype = Object.create(CanvasHandler.prototype);

BarCanvasHandler.prototype.update = function(data) {
  // better yet see: https://jsfiddle.net/Lvj2qnrp/1/
  // see: https://stackoverflow.com/questions/37499623/chart-js-stacked-and-grouped-bar-chart
  //labels need to be the years
  var existingData = this.chart.config.data.datasets;
  _.forOwn(data.data, (datum, label) => {

    var existing = _.find(existingData, (existingDatum) => {
      return existingDatum.label === label;
    });
    if (existing) {
      existing.data = datum;
    } else {
      this.chart.config.data.datasets.push({
        label: label,
        backgroundColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
        stack: 'Stack 0',
        data: datum
      });
    }
  });
  this.chart.config.data.labels = data.labels;
  this.chart.update();
};
