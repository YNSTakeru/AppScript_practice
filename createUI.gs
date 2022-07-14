function onOpen() {
    let ui = SpreadsheetApp.getUi();
    let menu = ui.createMenu("画像一覧");
    menu.addItem("Googleドライブより画像一覧を取得", "getFileListInFolder");
    menu.addToUi();
}
