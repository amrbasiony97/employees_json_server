import * as queryDB from './queryDB.js'
import * as Fn from './functions.js'
import Table from './table.js'

let table = new Table();

// Use JQuery UI library for dropdown menus, exclude the one with id = select-id as it will be updated in run-time as needed
$('select:not(#select-id)').each(function() {
  $(this).selectmenu();
})

// Add new employee
export function addEmployee() {
  table.addEmployee();
  table.updateTable();
}

// Search for employee(s)
export function searchEmployee(keyword) {
  table.searchEmployee(keyword);
}

// Update employee's data
export function updateEmployee() {
  table.updateEmployee();
  table.updateTable();
}

// Delete employee(s)
export function deleteEmployee(idAr) {
  table.deleteEmployee(idAr);
  table.updateTable();
  setTimeout(() => {
    Fn.enableDelete();
  }, 500);
}

// Remove check icon from checkboxes
$(function() {
  $('#update-checkbox input').checkboxradio({
    icon: false
  })
})