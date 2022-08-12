import { BrowserWindow,ipcMain,app } from 'electron';
const wget = require('node-wget');
import fs from 'fs';
import os from 'os';
import { execSync } from 'child_process';

async function downloadFile(url,path) {
  return new Promise<void>(resolve => {
    console.log('Downloading ', url);
    wget({url: url, dest: path}, ()=>resolve());
  });
}

export const DownloadService = {
   init: async () => {
    ipcMain.handle('DS_downloadFile', async (e,url,path) => {
        await downloadFile(url,path);
        return 1;
    });

    ipcMain.handle('DS_downloadArcCommander', async (e) => {
      const platform = os.platform();
      const urls = {
        win32: `https://github.com/nfdi4plants/arcCommander/releases/download/v0.3.2-win.x64/arc.exe`,
        linux: `https://github.com/nfdi4plants/arcCommander/releases/download/v0.3.2-linux.x64/arc`,
        darwin: `https://github.com/nfdi4plants/arcCommander/releases/download/v0.3.2-osx.x64/arc`,
      };
      const url = urls[platform];
      if(!url)
        return 0;

      const root = app.getAppPath()+'/binaries/';
      if (!fs.existsSync(root)){
        fs.mkdirSync(root);
      }

      const temp = url.split('/');
      const path = root+platform+'-'+temp[temp.length-1];

      if(!fs.existsSync(path)){
        await downloadFile(
          url,
          path
        );
      }

      if(platform=='linux'){
        try{
          const status = execSync(`chmod +x `+path, { cwd: root }).toString();
          console.log(status);
        } catch (e) {
          console.error(e);
          return 0;
        }
      }

      return 1;
    });
  }
};
