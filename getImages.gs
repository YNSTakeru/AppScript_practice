class OurImageInfo {
    constructor() {}
}

function myFunction() {
    const ourDrive = new OurDriveInfo();
    const driveID = ourDrive.driveID;

    let files = DriveApp.getFolderById(driveID).getFiles();
    let pic = [];
    while (files.hasNext()) {
        let file = files.next();
        pic.push([
            file.getName(),
            file.getUrl(),
            file.getId(),
            `<img src="${file.getUrl()}" width="300" />`,
        ]);
    }

    console.log(pic);
}

function getFileListInFolder() {
    let ss = SpreadsheetApp.getActiveSpreadsheet();
    let sht1 = ss.getSheetByName("シート1");
    let sht2 = ss.getSheetByName("シート2");

    // 1行2列目から3行1列取得
    let [driveURL, width, nameFlg] = sht1
        .getRange(1, 2, 3, 1)
        .getValues()
        .map((value) => value[0]);
    let driveID = driveURL.split("/folders/")[1];
    let folder = DriveApp.getFolderById(driveID);
    let images = folder.getFiles();
    let arry = [];

    let i = 0;
    while (images.hasNext()) {
        let image = images.next();
        let fileName = image.getName().split(".")[0];
        let fileId = image.getId();
        let file = DriveApp.getFileById(fileId);

        // file.setSharing(DriveApp.Access.ANYONE_WITH_LINK,DriveApp.Permission.VIEW)
        let shareUrl = file.getUrl();
        let shareId = shareUrl.split("/d/")[1].split("/")[0];

        let imgTag = `<img src="https://drive.google.com/uc?id=${shareId}" width="${width}" style="display: block"/>`;
        arry.push([i + 1, fileName, imgTag]);
        i++;
    }

    let rows = arry.length;
    let cols = arry[0].length;

    sht2.getRange(2, 1, rows, cols).setValues(arry);
    sht2.activate();
}

// htmlにアクセスしたら実行
function doGet() {
    let msg = "";
    let ss = SpreadsheetApp.getActiveSpreadsheet();
    let sht2 = ss.getSheetByName("シート2");
    // 最後に入力されてる行番号を取得
    let lastRow = sht2.getLastRow();
    let data = sht2
        .getRange(2, 1, lastRow - 1, sht2.getLastColumn())
        .getValues();
    for (value of data) {
        msg += value[2];
    }

    let html = HtmlService.createTemplateFromFile("index");
    html.msg = msg;
    return html.evaluate().setTitle("画像一覧");
}
