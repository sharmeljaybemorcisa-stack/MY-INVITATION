// GOOGLE APPS SCRIPT BACKEND
// 1. Create a Google Sheet.
// 2. Extensions > Apps Script.
// 3. Paste this code.
// 4. Change OWNER_EMAIL below to your email.
// 5. Deploy > New deployment > Web app.
//    Execute as: Me
//    Who has access: Anyone
// 6. Copy the Web App URL into invitation.html.

const OWNER_EMAIL = "YOUR_EMAIL_HERE@gmail.com";
const SHEET_NAME = "Responses";

function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(["Timestamp", "Answer", "Invitation", "IP/Device"]);
  }
}

function doPost(e) {
  try {
    setup();

    const data = JSON.parse(e.postData.contents || "{}");
    const answer = data.answer || "UNKNOWN";
    const invitation = data.invitation || "Invitation";
    const timestamp = new Date();

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

    // Basic browser information. IP is intentionally not collected here.
    const userAgent = (e.parameter && e.parameter.userAgent) || "Web invitation";

    sheet.appendRow([timestamp, answer, invitation, userAgent]);

    const subject = answer === "YES"
      ? "❤️ Invitation Response: SHE SAID YES!"
      : "😢 Invitation Response: She said NO";

    const message =
      "You received a response to your invitation.\n\n" +
      "Answer: " + answer + "\n" +
      "Date/Time: " + timestamp + "\n" +
      "Invitation: " + invitation + "\n\n" +
      "Check your Google Sheet for the saved response.";

    MailApp.sendEmail({
      to: OWNER_EMAIL,
      subject: subject,
      body: message
    });

    return ContentService
      .createTextOutput(JSON.stringify({success:true}))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success:false,
        error:String(err)
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
