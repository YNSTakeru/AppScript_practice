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
        const [id, name, website, gender] = broadCastData;
        const imageId = imageObj[name];
        let htmlTag = `<ul data-gender="${gender}" data-website="${website}">
                  <li style="display: flex; gap: 20px">
                      <div>配信者名</div>
                      <div>${name}</div>
                      <div>${gender}</div>
                  </li>
                  <li style="display: flex; gap: 20px">
                      <div>配信サイト</div>
                      <div>${website}</div>
                  </li>
                  <li>
                      <img src="https://drive.google.com/uc?id=${imageId}" width="300" alt="${name}画像" />
                  </li>
              </ul>`;

        imageIDColumn.push([htmlTag]);
    }
    broadCastersht
        .getRange(2, 5, broadCastersht.getLastRow() - 1, 1)
        .setValues(imageIDColumn);
    broadCastersht.activate();
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
}

function doGet() {
    let msg = "";
    let ss = SpreadsheetApp.getActiveSpreadsheet();
    let imageInfosht = ss.getSheetByName("配信者");
    // 最後に入力されてる行番号を取得
    let lastRow = imageInfosht.getLastRow();
    let data = imageInfosht
        .getRange(2, 1, lastRow - 1, imageInfosht.getLastColumn())
        .getValues();
    for (value of data) {
        const [id, name, website, gender, htmlTag] = value;
        msg += htmlTag;
    }

    let html = HtmlService.createTemplateFromFile("index");
    html.msg = msg;
    return html.evaluate().setTitle("画像一覧");
}
