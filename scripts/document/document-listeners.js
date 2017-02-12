document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("calculateButton").addEventListener("click", function(){
    var val = document.getElementById("incomeInput").value;
    var calculator = new Calculator();
    var table = document.querySelectorAll('.tax-table');
    document.getElementById("federalIncomeTaxAmount").innerHTML = calculator.calculateTaxes(val);
  });


});
