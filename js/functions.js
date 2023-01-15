import * as table from './table.js';
import * as queryDB from './queryDB.js'
import * as main from './main.js'

// Show only the selected section and hide the others
export function toggleSection(sec) {
  $(`section#${sec}`).slideDown(1000);
  $(`section:not(#${sec})`).each(function () {
    $(this).slideUp(1000);
  });
}

// Check whether input field is empty
function showErrorMsg(element, condition, msg) {
  if (!condition) msg = ''; // Remove error message
  $(element).text(msg);
  return msg.length > 0; // Return true if there is an error
}

// Check whether an element is hidden
export const isHidden = (elem) => {
  const styles = window.getComputedStyle(elem);
  return styles.display === 'none' || styles.visibility === "hidden";
};

// Update select id dropdown in update section
export const updateSelectId = () => {
  $('#select-id-button').remove();
  if (table.idArray.length > 0) {
    let selectElement = `<select name="slct-id" id="select-id"></select>`;
    $(selectElement).insertAfter('#select-id-label');
    $("#select-id").html(""); // Refresh select-id
    $(table.idArray).each(function () {
      let opt = document.createElement("option");
      $(opt).val(this).text(this);
      $("#select-id").append(opt);
    });
    $("#select-id").selectmenu();
  }
};

// Subtract arr2 from arr1 and return arr1
export const subArray = (arr1, arr2) => {
  for (let i = 0; i < arr2.length; i++)
    arr1.splice(arr1.indexOf(arr2[i]), 1);
  return arr1;
}

// Delete selected employee(s)
export const deleteEmployee = () => {
  let idAr = [];
  $(".db-table")
    .children(":gt(0)")
    .each(function () {
      if ($(this).hasClass("delete"))
        idAr.push($(this).children().first().text());
    });
  main.deleteEmployee(idAr);
};

// Enable user to select rows from table
export const enableDelete = () => {
  $(".db-table")
    .children(":gt(0)")
    .each(function () {
      $(this).addClass("delete-hover");
      $(this).on("click", function () {
        $(this).toggleClass("delete");
      });
    });
};

// Disable user from selecting rows from table
export const disableDelete = () => {
  $(".db-table")
    .children(":gt(0)")
    .each(function () {
      $(this).removeClass("delete-hover");
      $(this).removeClass("delete");
      $(this).off();
    });
};

// Validate each input field
export function validateInput(elem, value) {
  let sp = `#${elem.id}-error`;
  switch (elem.name) {
    case "id":
      return (
        showErrorMsg(sp, value === "", "Required field") ||
        showErrorMsg(sp, value < 0, "Negative Numbers are not allowed") ||
        showErrorMsg(sp, isNaN(value), "Only Numbers are allowed") ||
        showErrorMsg(
          sp,
          table.idArray.includes(value.toString()),
          "This id is already used"
        )
      );
    case "name":
      return (
        showErrorMsg(sp, value === "", "Required field") ||
        showErrorMsg(sp, !(/^[a-z ]+$/gi.test(value)), 'Remove digits and/or special letters') ||
        showErrorMsg(sp, value.length < 3, "Must be at least 3 letters")
      );
    case "age":
      return (
        showErrorMsg(sp, value === "", "Required field") ||
        showErrorMsg(sp, isNaN(value), "Only Numbers are allowed") ||
        showErrorMsg(
          sp,
          value < 20 || value > 60,
          "Age must be between 20 and 60"
        )
      );
    case "salary":
      return (
        showErrorMsg(sp, value === "", "Required field") ||
        showErrorMsg(sp, value < 0, "Negative Numbers are not allowed") ||
        showErrorMsg(sp, isNaN(value), "Only Numbers are allowed")
      );
  }
}
