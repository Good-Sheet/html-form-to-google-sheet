// this is the name of the sheet tab at the bottom of the spreadsheet
const sheetName = "Sheet1";

function doPost(e) {
  // a catch for running in the editor
  if (e === undefined) return;

  // lock the sheet while we edit it
  let lock = LockService.getScriptLock();
  lock.tryLock(10000);

  // get Sheet1 on our spreadsheet
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);

  // grab our column headers (in row A1)
  let headers = sheet.getRange("A1").getDataRegion(SpreadsheetApp.Dimension.COLUMNS).getValues()[0];

  // take the user's input and map it to our headers
  let row = headers.map((header) => {
    return header === "timestamp" ? new Date() : e.parameter[header];
  });

  // add our new data to the sheet
  sheet.appendRow(row);

  // release the lock when we're done
  lock.releaseLock();

  // report success back
  return ContentService
    .createTextOutput(JSON.stringify({ "result": "success", "row": row }))
    .setMimeType(ContentService.MimeType.JSON);
}
