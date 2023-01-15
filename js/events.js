import * as Fn from "./functions.js";
import * as main from "./main.js";
import * as table from "./table.js";

$(function () {
  // Add click event on menu list items
  $(".menu > li").on("click", function () {
    $(this).addClass("active");
    $(`.menu > li:not(:contains(${$(this).text()}))`).each(function () {
      $(this).removeClass("active");
    });
    Fn.toggleSection($(this).text().toLowerCase());
  });

  // Add event on delete menu item
  $(".menu > li:contains(Delete)").on("click", Fn.enableDelete);

  // Remove event from delete menu item
  $("li:not(.menu > li:contains(Delete))").on("click", Fn.disableDelete);

  // prevent button default behavior
  $("button")
    .button()
    .on("click", (e) => {
      e.preventDefault();
    });

  // Validate input
  $("input[type=text]").on("keyup focusout", function (e) {
    // Prevent tab and shift keys from showing error status before even typing any thing while focus in
    if ((e.keyCode !== 9) & (e.keyCode !== 16)) {
      Fn.validateInput(this, e.target.value)
        ? $(this).addClass("error")
        : $(this).removeClass("error");
    }
  });

  // Add employee button
  $("#add-btn").on("click", function () {
    $("#add-fieldset input").trigger("keyup"); // Check for last time before adding a new employee
    if (!$("#add-fieldset input").hasClass("error")) {
      main.addEmployee();
    }
  });

  // Search employee button
  $("#search-input").on("keyup", function () {
    main.searchEmployee($(this).val());
  });

  // Cancel search results and restore original table
  $("#search-input").on("blur", function () {
    main.searchEmployee('');
    $('#search-input').val('');
  });

  // Update employee button
  $("#update-btn").on("click", function () {
    let counter = $(
      '.update-input-container:not([style*="display: none;"])'
    ).length;
    $("#update-fieldset input").each(function () {
      if (!Fn.isHidden($(this).closest("div").get(0))) {
        $(this).trigger("keyup");
      } // Only validate visible input fields
    });
    // Update employee info only if user selected at least one item of data to be changed
    if (counter > 0) {
      if (!$("#update-fieldset input").hasClass("error")) {
        main.updateEmployee();
      }
    }
  });

  // Delete employee button (Confirmation message)
  $("#delete-btn").on("click", function () {
    let confirmMsg = `<div id="dialog-confirm" title="Delete selected employees?"><p><span class="ui-icon ui-icon-alert" style="float:left; margin:12px 12px 20px 0;"></span>Selected employees will be permanently deleted from database and cannot be recovered. Are you sure?</p></div>`;
    $(confirmMsg).dialog({
      resizable: false,
      height: "auto",
      width: 400,
      modal: true,
      buttons: {
        "Delete employees": function () {
          Fn.deleteEmployee();
          $(this).dialog("close");
        },
        Cancel: function () {
          $(this).dialog("close");
        },
      },
    });
  });

  // Update id select menu in update section to match existing employees
  $(".menu > li:contains(Update)").on("click", Fn.updateSelectId);

  // Prepare checkbox and input fields in update section
  $(".menu > li:contains(Update)").on("click", function () {
    $(".update-input-container").each(function () {
      $(this).hide();
    });
    // Uncheck checkboxes by default
    $(".ui-checkboxradio-checked").each(function () {
      $(this).removeClass("ui-checkboxradio-checked ui-state-active");
    });
  });

  // Show and hide input fields in update section
  $("#update-checkbox label").each(function () {
    $(this).on("click", function () {
      if ($(this).hasClass("ui-checkboxradio-checked")) {
        // Hide input field
        $(this)
          .closest("form")
          .find(`div:contains(${$(this).text()})`)
          .slideUp(500);
        // Remove input field red border
        $(this)
          .closest("form")
          .find(`input[name=${$(this).text().toLowerCase()}]`)
          .removeClass("error");
        // Remove error message
        $(this)
          .closest("form")
          .find(`#update-${$(this).text().toLowerCase()}-error`)
          .text("");
      } else {
        // Show input field
        $(this)
          .closest("form")
          .find(`div:contains(${$(this).text()})`)
          .slideDown(500);
      }
    });
  });
});
