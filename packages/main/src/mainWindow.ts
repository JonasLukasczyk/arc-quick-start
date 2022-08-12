import { BrowserWindow } from 'electron';
import path from 'path';
import { join } from 'path';
import { URL } from 'url';

async function createWindow() {
  const mainWindow = new BrowserWindow({
    show: false, // Use 'ready-to-show' event to show window
    webPreferences: {
      nativeWindowOpen: true,
      webviewTag: false, // The webview tag is not recommended. Consider alternatives like iframe or Electron's BrowserView. https://www.electronjs.org/docs/latest/api/webview-tag#warning
      preload: join(__dirname, '../../preload/dist/index.cjs'),
    },
    width:700,
    height:700,

  });

  /**
  * If you install `show: true` then it can cause issues when trying to close the window.
  * Use `show: false` and listener events `ready-to-show` to fix these issues.
  *
  * @see https://github.com/electron/electron/issues/25012
  */
  mainWindow.on('ready-to-show', () => {
    mainWindow?.show();

    if (import.meta.env.DEV) {
      mainWindow?.webContents.openDevTools();
    }
  });

  /**
  * URL for main window.
  * Vite dev server for development.
  * `file://../renderer/index.html` for production and test
  */
  const pageUrl = import.meta.env.DEV && import.meta.env.VITE_DEV_SERVER_URL !== undefined
    ? import.meta.env.VITE_DEV_SERVER_URL
    : new URL('../renderer/dist/index.html', 'file://' + __dirname).toString();


  await mainWindow.loadURL(pageUrl);

  return mainWindow;
}

// -------------------------------------------------------------------------

/**
* Restore existing BrowserWindow or Create new BrowserWindow
*/
export async function restoreOrCreateWindow() {
  let window = BrowserWindow.getAllWindows().find(w => !w.isDestroyed());

  if (window === undefined) {
    window = await createWindow();
  }

  if (window.isMinimized()) {
    window.restore();
  }

  window.focus();
}
