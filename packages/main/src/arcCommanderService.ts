import { ipcMain,app,shell,BrowserWindow } from 'electron';
const wget = require('node-wget');
import fs from 'fs';
import os from 'os';
import { exec,execSync } from 'child_process';
import https from 'https';
const PATH = require('path');

var httpsOptions = {
    host: 'api.github.com',
    port: 443,
    path: '',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'user-agent': 'node.js'
    }
};

const config = {
  arc_commander:null,
  arc_name:null,
  user_gitlab:null,
  user_eMail:null,
  user_name:null,
  arcs:null,
};

export const ArcCommanderService = {

  debug: async e=>{
    return [
      JSON.stringify(process.env),
      app.getPath('exe'),
      app.getAppPath()
    ];
  },

  getArcCommanderPath: async e=>{

    let platform = os.platform();
    let root = null;
    switch(platform){
      case 'win32':
        root = process.env['PORTABLE_EXECUTABLE_DIR'];
        break;
      case 'darwin':
        root = app.getAppPath().split('arc-quick-start.app')[0];
        break;
      case 'linux':
        root = process.env['PWD'];
        break;
    }
    if(!root)
      console.error('unable to determine app folder');

    return root;
  },

  getWebPageAsJson:  url => {
    return new Promise(
      (resolve,reject) => {
        httpsOptions.path = url;

        const req = https.request(httpsOptions, res => {
          let output = '';
          res.setEncoding('utf8');
          res.on('data', chunk => {
            output += chunk;
          });
          res.on('end', () => {
            resolve(JSON.parse(output));
          });
        });
        req.on('error', err => {
          console.error(err);
          resolve(err);
        });
        req.end();
      }
    );
  },

  checkInitialState: async e=>{
    const path = await ArcCommanderService.getArcCommanderPath();

    const configPath = PATH.join(path,'config.json');

    if(fs.existsSync( configPath )){
      const config_ = fs.readFileSync(configPath, {encoding:'UTF-8'});
      const config__ = JSON.parse(config_);
      for(const key of Object.keys(config)){
        config[key] = config__[key];
      }
    }

    const arcs = [];
    for(let dir of fs.readdirSync(path,{withFileTypes:true})){
      if(dir.isDirectory()){
        const path_ = PATH.join(PATH.join(path,dir.name), '.arc');
        if(fs.existsSync(path_)){
          arcs.push(dir.name);
        }
      }
    }
    config.arcs = arcs;

    let platform = os.platform();
    switch(platform){
      case 'win32':
        platform = 'win';
        break;
      case 'darwin':
        platform = 'osx';
        break;
      case 'linux':
        platform = 'linux';
        break;
      default:
        console.error('ERROR: Arc Commander not supported on current platform:', platform);
        return null;
    }

    const releases = await ArcCommanderService.getWebPageAsJson(
      '/repos/nfdi4plants/arcCommander/releases'
    );
    if(releases.length){
      const sortedReleases = [];

      for(const release of releases){
        const name = release.html_url.split('/').pop();
        for(const asset of release.assets){
          if(asset.name.indexOf('arc')>=0){
            const version = name.split('-')[0].slice(1).split('.').map(parseFloat);
            const condensedVersion = 1000000*version[0] + 10000*version[1] + 100*version[2];
            sortedReleases.push( [ name, asset.browser_download_url,condensedVersion ] );
            break;
          }
        }
      }
      sortedReleases.sort( (a,b)=>b[2]-a[2] );

      for(let release of sortedReleases){
        if(release[0].indexOf(platform)>=0){
          const temp = release[1].split('/');
          const filename = temp[temp.length-2]+'-'+temp[temp.length-1];
          config.arc_commander = {
            filename: filename,
            url: release[1],
            path:path
          };
          break;
        }
      }

      if(!config.arc_commander){
        return null;
      }
    }

    config.arc_commander.exists = fs.existsSync(
      config.arc_commander.path+'/'+config.arc_commander.filename
    );
    return config;
  },

  downloadFile: async (url,path) => {
    return new Promise<void>(resolve => {
      console.log('Downloading '+ url);
      wget({url: url, dest: path}, ()=>resolve());
    });
  },

  downloadArcCommander: async (e) => {
    const acPath = PATH.join(config.arc_commander.path,config.arc_commander.filename);
    await ArcCommanderService.downloadFile(
      config.arc_commander.url,
      acPath
    );
    if(os.platform()!=='win32'){
      try{
        execSync(`chmod +x ${acPath}`, { cwd: config.arc_commander.path });
      } catch(e) {
      }
    }
    config.arc_commander.exists = true;
    return config;
  },

  openExternalLink: async (e,url) => {
    shell.openExternal(url);
  },

  setConfigEntries: async (e,entries) => {
    for(let key of Object.keys(entries)){
      config[key] = entries[key];
    }
    const path = await ArcCommanderService.getArcCommanderPath();
    fs.writeFileSync(
      PATH.join(path,'config.json'),
      JSON.stringify(config)
    );

    return config;
  },

  runCommandASync: (command,options) => new Promise((resolve,reject)=>{
    try {
      exec(
        command,
        options,
        (error, stdout, stderr) => {
          resolve([error===null,stdout+'\n'+stderr,error]);
        }
      );
    } catch (error) {
      resolve([0,error]);
    }
  }),

  runCommand: async (e,params) => {
    console.log(params);

    const acPath = PATH.join(
      config.arc_commander.path,
      config.arc_commander.filename
    );

    const result = await ArcCommanderService.runCommandASync(
      `"${acPath}" ${params}`,
      {cwd:config.arc_commander.path}
    );

    return result;
  },

  init: async () => {
    ipcMain.handle('ACS_checkInitialState', ArcCommanderService.checkInitialState);
    ipcMain.handle('ACS_getArcCommanderPath', ArcCommanderService.getArcCommanderPath);
    ipcMain.handle('ACS_downloadArcCommander', ArcCommanderService.downloadArcCommander);
    ipcMain.handle('ACS_openExternalLink', ArcCommanderService.openExternalLink);
    ipcMain.handle('ACS_setConfigEntries', ArcCommanderService.setConfigEntries);
    ipcMain.handle('ACS_runCommand', ArcCommanderService.runCommand);

    ipcMain.handle('ACS_debug', ArcCommanderService.debug);
  }
};
