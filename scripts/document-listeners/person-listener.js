function PersonListener() {}

PersonListener.prepare = function(tableElement) {


  parsePersonInformation = function() {
    var person = {};
    var inputs = document.querySelectorAll('.person-table input');

    _.forEach(inputs, function(input) {
      person[input.name] = input.value;
    });

    console.log(person);
  };

  document.getElementById("calculateButton").addEventListener("click", function(){
    parsePersonInformation();
  });
};
