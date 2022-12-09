import { Process } from "decova-environment";
import { DirectoryInfo, FileInfo, Path } from "wv-filesystem";
import { Dialog } from "../Dialog";
import { IWalkthrough } from "./_Foundation/IWalkthrough";
import { RegisterWalkthrough } from "./_Foundation/_RegisterWalkthrough";
const fs = require('fs');
const os = require('os');
const path = require('path');

@RegisterWalkthrough()
export class WTR_Fun_GrapWallpapers implements IWalkthrough
{
    text = 'Fun >> Grap wallpapers';

    async execAsync()
    {
        const tempDirPath = path.join(DirectoryInfo.special.tempDir.fullName, 'wv-gotcha/grapped-wallpapers');
        const userHomeDir = DirectoryInfo.special.userProfile;
        const tempDir = new DirectoryInfo(tempDirPath);
        tempDir.ensure();
        
        Dialog.exec(`explorer \"${tempDir.fullName}\"`);

        const spotListDirPath = Path.join(userHomeDir.fullName, `AppData/Local/Packages/Microsoft.Windows.ContentDeliveryManager_cw5n1h2txyewy/LocalState/Assets`);
        const bingImagePath = Path.join(userHomeDir.fullName, `/AppData/Roaming/Microsoft/Windows/Themes/TranscodedWallpaper`);
        
        const spotLightFiles = new DirectoryInfo(spotListDirPath).getFiles().xWhere(f=>f.fileSize > 100000);
        for(let f of spotLightFiles)
        {
            f.copyTo(`${tempDir.fullName}/${f.name}.jpeg`);
        }
        
        const bingImageFile = new FileInfo(bingImagePath);

        if(bingImageFile.exists() === false)
        {
            Dialog.warning(`Bing image file doesn\'t exist @${bingImagePath}`);
        }
        else
        {
            bingImageFile.copyTo(`${tempDir.fullName}/${bingImageFile.name}.jpg`);
        }
        
        await Dialog.instructAsync('Please wait the grapped in folder to open in the explorer');
    }
}