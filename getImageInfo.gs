function setBroadCasterInfo() {
    let ss = SpreadsheetApp.getActiveSpreadsheet();
    let broadCastersht = ss.getSheetByName("配信者");
    let imagesht = ss.getSheetByName("画像情報");

    let broadCasterArry = broadCastersht
        .getRange(
            2,
            1,
            broadCastersht.getLastRow() - 1,
            broadCastersht.getLastColumn()
        )
        .getValues();
    let imageArry = imagesht
        .getRange(2, 1, imagesht.getLastRow() - 1, imagesht.getLastColumn())
        .getValues();
    let imageObj = {};
    for (imageData of imageArry) {
        imageObj[imageData[1]] = imageData[2];
    }
    let imageIDColumn = [];

    for (broadCastData of broadCasterArry) {
        imageIDColumn.push([imageObj[broadCastData[1]]]);
    }
    broadCastersht
        .getRange(2, 5, broadCastersht.getLastRow() - 1, 1)
        .setValues(imageIDColumn);
}

function getFileListInFolder() {
    let ss = SpreadsheetApp.getActiveSpreadsheet();
    let driveURLsht = ss.getSheetByName("DriveのURL");
    let imageInfosht = ss.getSheetByName("画像情報");

    // 1行2列目から3行1列取得
    let [driveURL, width, nameFlg] = driveURLsht
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
        arry.push([i + 1, fileName, shareId]);
        i++;
    }

    let rows = arry.length;
    let cols = arry[0].length;

    imageInfosht.getRange(2, 1, rows, cols).setValues(arry);
    setBroadCasterInfo();
    broadCastersht.activate();
}
