class OurMode {
    constructor() {
        this._testMode = true;
    }
}

class OurDriveInfo extends OurMode {
    constructor(_testMode) {
        super(_testMode);
        this._driveURL = "https://drive.google.com/drive/u/0/folders/******";
    }

    // DriveのURLからIDを返す
    _driveID() {
        const _pattern = /[a-zA-Z0-9-_]*$/;
        return this._driveURL.match(_pattern)[0];
    }
}

class OurImageInfo extends OurDriveInfo {
    constructor(_driveURL, _testMode) {
        super(_driveURL, _testMode);
        this._driveID = super._driveID();
    }

    get pictures() {
        let _pic = [];

        try {
            if (this._testMode) {
                throw new Error("ローカル環境で実行");
            }
            let files = DriveApp.getFolderById(this._driveID).getFiles();
            while (files.hasNext()) {
                let file = files.next();
                pic.push([file.getName(), file.getUrl(), file.getId()]);
            }
        } catch (e) {
            _pic = [
                [
                    "3.jpeg",
                    "https://drive.google.com/file/d/1Y1L9Hwi4H7HCByPonWJ0w8KLi7V64nWg/view?usp=drivesdk",
                    "1Y1L9Hwi4H7HCByPonWJ0w8KLi7V64nWg",
                ],
                [
                    "2.jpeg",
                    "https://drive.google.com/file/d/1STgyHl4tiQ4jF41wWY7f31oo-JuD4Nx0/view?usp=drivesdk",
                    "1STgyHl4tiQ4jF41wWY7f31oo-JuD4Nx0",
                ],
                [
                    "1.jpeg",
                    "https://drive.google.com/file/d/1OzrFU1UJiPpL79o3oWy1715lPS9FNgvU/view?usp=drivesdk",
                    "1OzrFU1UJiPpL79o3oWy1715lPS9FNgvU",
                ],
            ];
        } finally {
            return _pic;
        }
    }
}

const oi = new OurImageInfo();

console.log(oi.pictures);
