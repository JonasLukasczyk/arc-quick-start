import { ipcMain,app } from 'electron';
import fs from 'fs';
import os from 'os';
import { execSync } from 'child_process';

export const ArcCommanderService = {
  arcCommanderPath: null,

  init: async () => {
    ipcMain.handle('ACS_runCommand', async (e,options) => {
      // try to retrieve arc commander
      const root = app.getAppPath();
      if(!ArcCommanderService.arcCommanderPath){
        const binaryDir = root+'/binaries/';
        if(!fs.existsSync(binaryDir))
          return null;

        const platform = os.platform();

        for(let file of fs.readdirSync(binaryDir)){
          if(file.startsWith(platform)){
            ArcCommanderService.arcCommanderPath = binaryDir+'/'+file;
            break;
          }
        }
      }
      if(!ArcCommanderService.arcCommanderPath){
        return 0;
      }

      try{
        const status = execSync(`${ArcCommanderService.arcCommanderPath} --version`, { cwd: root }).toString();
        console.log(status);
      } catch (e) {
        console.error(e);
        return 0;
      }

      return 1;
    });
  }
};
