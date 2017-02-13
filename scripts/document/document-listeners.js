document.addEventListener("DOMContentLoaded", function() {
  var taxes = [
    federalTaxes,
    socialSecurityWithholding,
    medicareWithholding
  ];

  function populateTable(table) {
    _.forEach(taxes, function(tax) {
      row = table.insertRow();
      nameCell = row.insertCell(0);
      nameCell.innerHTML = tax.name;
      //insert a value cell
      row.insertCell(1);
    });
  }
  populateTable(document.getElementById('tax-table'));

  function clearTableValues(table) {
    _.forEach(table.rows, (function(row) {
      row.cells[1].innerHTML = "";
    }));

    return table;
  }

  document.getElementById("calculateButton").addEventListener("click", function(){
    var grossIncome = document.getElementById("grossIncome").value;


    table = clearTableValues(document.getElementById('tax-table'));

    _.forEach(taxes, function(tax, index) {
      row = table.rows[index];
      valueCell = row.cells[1];
      valueCell.innerHTML = tax(grossIncome);
    });
  });
});
