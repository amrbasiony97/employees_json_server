// Query database
export function loadJSON(dbPath) {
  return Promise.resolve($.ajax({
    url: dbPath,
    method: "get"
  }));
}

// Update employee
export function updateData(dbPath, obj) {
  $.ajax({
    type: "put",
    url: dbPath,
    data: obj,
  });
}

// Delete from database
export function deleteData(dbPath) {
  $.ajax({
    type: 'delete',
    url: dbPath
  })
}