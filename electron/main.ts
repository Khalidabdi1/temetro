import { app, BrowserWindow, dialog ,ipcMain,screen,Menu} from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log'



const __dirname = path.dirname(fileURLToPath(import.meta.url))

// ------------- Logger for autoUpdater -------------
log.transports.file.level = 'info'
autoUpdater.logger = log

// ------------- App paths -------------
process.env.APP_ROOT = path.join(__dirname, '..')
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
       contextIsolation: true,
    nodeIntegration: false,
    },
    width:600,
    height:600,
    center:true,
   
    hasShadow:false,
    transparent:true,
    backgroundColor: '#00000000',
    frame: false, 
  resizable: true,
    
  })
  Menu.setApplicationMenu(null)

  // Send a message to renderer on load
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}



// ----------------- AutoUpdater -----------------
function initAutoUpdater() {
  autoUpdater.checkForUpdatesAndNotify()

  autoUpdater.on('checking-for-update', () => {
    log.info('Checking for update...')
  })

  autoUpdater.on('update-available', (info) => {
    log.info('Update available.', info)
    dialog.showMessageBox({
      type: 'info',
      title: 'Update available',
      message: `A new version ${info.version} is available. Downloading now...`,
    })
  })

  autoUpdater.on('update-not-available', () => {
    log.info('No updates available.')
  })

  autoUpdater.on('error', (err) => {
    log.error('Error in auto-updater:', err)
  })

autoUpdater.on('download-progress', (progressObj) => {
  const log_message = `Download speed: ${progressObj.bytesPerSecond} - Downloaded ${Math.floor(progressObj.percent)}% (${progressObj.transferred}/${progressObj.total})`
  log.info(log_message)
})

autoUpdater.on('update-available', (info) => {
  log.info('Update available.', info)
  dialog.showMessageBox({
    type: 'info',
    title: 'Update available',
    message: `A new version ${info.version} is available. Downloading now...`,
  })
})

autoUpdater.on('update-downloaded', () => {
  log.info('Update downloaded; will install now')
  dialog.showMessageBox({
    type: 'info',
    title: 'Update ready',
    message: 'Update downloaded. The app will quit and install the update now.',
  }).then(() => {
    setImmediate(() => autoUpdater.quitAndInstall())
  })
})

}

// ----------------- App lifecycle -----------------
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

ipcMain.on('change-window-size', (_, myWidth: number, myHeight: number) => {
  if (!win) return

  const { width, height } = screen.getPrimaryDisplay().workAreaSize

  win.setBounds({
    x: Math.floor((width - myWidth) / 2),
    y: Math.floor((height - myHeight) / 2),
    width: myWidth,
    height: myHeight
  })
})


app.whenReady().then(() => {
  createWindow()
  initAutoUpdater()
})
