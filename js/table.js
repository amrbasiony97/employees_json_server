import * as queryDB from "./queryDB.js";
import * as Fn from "./functions.js";

export let idArray;
export default class Table {
  #table;
  #dbPath;
  #deptNames;

  constructor() {
    this.#table = $(".db-table");
    this.#dbPath = "http://localhost:3000";
    this.#createIdArray();
  }

  // Create an Object of departmentId : departmentName to save time (Assume that user cannot add, update or delete departments!)
  async #createIdArray() {
    this.#deptNames = {};
    await queryDB.loadJSON(`${this.#dbPath}/employees`).then((empData) => {
      idArray = empData.map((emp) => emp.id);
      $(empData).each(
        (row) => {
          let id = empData[row].departmentId;

          queryDB
            .loadJSON(`${this.#dbPath}/departments/${id}`)
            .then((deptData) => {
              if (!this.#deptNames.hasOwnProperty(id))
                this.#deptNames[`${id}`] = deptData.name;
            }); // Loop over departments and get their names
        } // Loop over employees and get their department ids
      );
    });
    this.updateTable(); // Wait until deptNames object is created and then update table
  }

  // Print table header
  #printTableHeader() {
    let tableHeader = document.createElement("tr");
    queryDB.loadJSON(`${this.#dbPath}/employees`).then((data) => {
      for (let header in data[0]) {
        let headerCell = document.createElement("th");

        // Change DepartmentId to Department, otherwise keep as default
        header == "departmentId"
          ? $(headerCell).text("department")
          : $(headerCell).text(header);
        $(tableHeader).append(headerCell);
      }
      this.#table.html(tableHeader);
    });
    this.#table.html(tableHeader);
  }

  // Print table rows
  #printTableBody() {
    queryDB.loadJSON(`${this.#dbPath}/employees`).then((data) =>
      $(data).each((row) => {
        let tableRow = document.createElement("tr");
        for (let col in data[row]) {
          let cell = document.createElement("td");

          // Assign department name to Department column, otherwise keep as default
          col === "departmentId"
            ? $(cell).text(this.#deptNames[data[row][col]])
            : $(cell).text(data[row][col]);
          $(tableRow).append(cell);
        }
        this.#table.append(tableRow);
      })
    );
  }

  updateTable() {
    this.#printTableHeader();
    this.#printTableBody();
  }

  addEmployee() {
    idArray.push($("#add-id").val()); // Add id of new employee to idArray
    $.post(`${this.#dbPath}/employees`, {
      id: $("#add-id").val(),
      name: $("#add-name").val(),
      age: $("#add-age").val(),
      salary: $("#add-salary").val(),
      departmentId: $("#add-dept :checked").val(),
    });
  }

  searchEmployee(keyword) {
    this.#printTableHeader();
    queryDB
      .loadJSON(`${this.#dbPath}/employees/?name_like=${keyword}`)
      .then((data) =>
        $(data).each((row) => {
          let tableRow = document.createElement("tr");
          for (let col in data[row]) {
            let cell = document.createElement("td");

            // Assign department name to Department column, otherwise keep as default
            col === "departmentId"
              ? $(cell).text(this.#deptNames[data[row][col]])
              : $(cell).text(data[row][col]);
            $(tableRow).append(cell);
          }
          this.#table.append(tableRow);
        })
      );
  }

  async updateEmployee() {
    let obj = await queryDB
      .loadJSON(`${this.#dbPath}/employees/${$("#select-id :checked").val()}`)
      .then((data) => data);
    $("#update-fieldset input, #update-dept").each(function () {
      if (!Fn.isHidden($(this).closest("div").get(0))) {
        // Only for shown input fields
        if ($(this).parent().get(0).name === "departmentId") {
          // Special case for department id
          obj["departmentId"] = $(this).val();
        }
        else
          obj[this.name] = $(this).val();
      }
    });
    queryDB.updateData(
      `${this.#dbPath}/employees/${$("#select-id :checked").val()}`,
      obj
    );
  }

  deleteEmployee(idAr) {
    idArray = Fn.subArray(idArray, idAr);
    for (let i = 0; i < idAr.length; i++) {
      queryDB.deleteData(`${this.#dbPath}/employees/${idAr[i]}`);
    }
  }
}
