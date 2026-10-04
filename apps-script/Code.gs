// Google Sheets'ga arizalarni yozuvchi skript (Apps Script, Web app sifatida deploy qilinadi)
function doPost(e) {
  const p = e.parameter;
  if (p.website) return ContentService.createTextOutput('ok'); // spam tuzog'i
  const s = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (s.getLastRow() === 0) s.appendRow(['Vaqt', 'Ism', 'Aloqa', 'Maqsad', 'Qachonga', 'Byudjet']);
  s.appendRow([new Date(), p.name, p.contact, p.goal, p.when, p.budget]);
  return ContentService.createTextOutput('ok');
}
