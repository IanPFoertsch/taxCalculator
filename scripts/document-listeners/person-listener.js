function PersonListener(rows) {
  this.listeners = _.reduce(rows, function(memo, config) {
    memo[config.label] = new InputListener(config);
    return memo;
  }, {});
}

PersonListener.prototype.getInput = function() {
  return _.reduce(this.listeners, function(person, listener, name) {
    person[name] = listener.getInput();
    return person;
  }, {});
};
