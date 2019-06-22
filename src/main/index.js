import {app, BrowserWindow, globalShortcut, ipcMain, ipcRenderer, Menu, shell, Tray} from 'electron'
import db from './utils/db'
import book from './utils/book'
import osUtil from './utils/osUtil'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let tray;
let settingWindow;
let desktopWindow;

const isMac = 'darwin' === process.platform;
const settingURL = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080/#/setting`
    : `file://${__dirname}/index.html#setting`

const desktopURL = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080/#/desktop`
    : `file://${__dirname}/index.html#desktop`


function init() {
    createKey();
    createTray();

    if (isMac) {
        createSetting();

        if (db.get('curr_model') === '2') {
            createWindownDesktop();

            setTimeout(() => {
                BossKey(1);
            }, 1000);
        }
    } else {
        createWindownDesktop();

        setTimeout(() => {
            BossKey(1);
        }, 1000);
    }
}

function createWindownSetting() {
    /**
     * Initial window options
     */

    settingWindow = new BrowserWindow({
        title: '设 置',
        useContentSize: true,
        width: 411,
        height: 325,
        resizable: false,
        maximizable: false,
        minimizable: false,
    })

    let webContents = settingWindow.webContents;
    webContents.on('did-finish-load', () => {
        webContents.setZoomFactor(1);
        webContents.setVisualZoomLevelLimits(1, 1);
        webContents.setLayoutZoomLevelLimits(0, 0);
    })

    settingWindow.loadURL(settingURL)

    settingWindow.on('closed', () => {
        settingWindow = null
    })
}

function createWindownDesktop() {
    /**
     * Initial window options
     */
    const titleBarStyle = isMac ? 'hidden' : 'default';

    desktopWindow = new BrowserWindow({
        useContentSize: true,
        width: 856,
        height: 47,
        resizable: true,
        frame: false,
        transparent: true,
        // y: 600,
        // x: 300
    })

    let webContents = desktopWindow.webContents;
    webContents.on('did-finish-load', () => {
        webContents.setZoomFactor(1);
        webContents.setVisualZoomLevelLimits(1, 1);
        webContents.setLayoutZoomLevelLimits(0, 0);
    })

    desktopWindow.loadURL(desktopURL)

    // 总是保留在最上层
    // desktopWindow.setAlwaysOnTop(true)

    desktopWindow.setSkipTaskbar(true);

    desktopWindow.on('closed', () => {
        desktopWindow = null
    })
}


function setText(text) {
    global.text = {text}
}

function NextPage() {
    let text = book.getNextPage();

    if (db.get('curr_model') === '1') {
        tray.setTitle(text);
    } else if (db.get('curr_model') === '2') {
        setText(text);
        desktopWindow && desktopWindow.webContents.send('text', 'ping');
    }
}

function PreviousPage() {
    let text = book.getPreviousPage();

    if (db.get('curr_model') === '1') {
        tray.setTitle(text);
    } else if (db.get('curr_model') === '2') {
        setText(text);
        desktopWindow && desktopWindow.webContents.send('text', 'ping');
    }
}

function BossKey(type) {
    let text = osUtil.getTime();

    if (db.get('curr_model') === '1') {
        tray.setTitle(text);
    }
    if (db.get('curr_model') === '2') {
        tray.setTitle('');
        setText(text);

        if (desktopWindow != null) {
            if (type === 1) {
                desktopWindow.webContents.send('text', 'boss');
            } else if (type === 2) {
                {
                    if (desktopWindow.isVisible()) {
                        desktopWindow.hide();
                    }
                    else {
                        desktopWindow.show();
                    }
                }
            }
        }
    }
}

function Exit() {
    app.quit();
}

function createKey() {
    const previousKey = db.get('previous_key')
    const nextKey = db.get('next_key')
    const bossKey = db.get('boss_key')
    const exitKey = db.get('exit_key')
    if (previousKey) {
        globalShortcut.register(previousKey, function () {
            PreviousPage();
        })
    }

    if (nextKey) {
        globalShortcut.register(nextKey, function () {
            NextPage();
        })
    }

    if (bossKey) {
        globalShortcut.register(bossKey, function () {
            BossKey(2);
        })
    }

    if (exitKey) {
        globalShortcut.register(exitKey, function () {
            Exit();
        })
    }
}

function createTray() {
    const menubarLogo = `${__static}/logo.png`

    const menuList = [
        {
            label: '关于',
            click() {
                shell.openExternal('https://github.com/cteams/Thief-Book')
            }
        },
        {
            type: 'separator'
        },
        {
            label: '设置',
            click() {
                createWindownSetting()
            }
        },
        {
            type: 'separator'
        },
        {
            role: 'quit',
            accelerator: 'CommandOrControl+Alt+X',
            label: '退出'
        },
    ];

    if (isMac) {
        menuList.splice(1, 0, {
            type: 'separator'
        }, {
            label: '任务栏版',
            type: 'radio',
            checked: db.get('curr_model') === '1',
            click() {
                db.set('curr_model', '1')

                if (desktopWindow != null) {
                    desktopWindow.close();
                }

                BossKey(1);
            }
        }, {
            label: '桌面版',
            type: 'radio',
            checked: db.get('curr_model') === '2',
            click() {
                createWindownDesktop()

                db.set('curr_model', '2')

                setTimeout(() => {
                    BossKey(1);
                }, 1000);
            }
        })
    }

    tray = new Tray(menubarLogo)
    tray.setContextMenu(Menu.buildFromTemplate(menuList))
    BossKey();
}

function createSetting() {
    if (isMac) {
        app.dock.hide();
    } else {
        //
    }
}

ipcMain.on('bg_text_color', function () {
    desktopWindow && desktopWindow.webContents.send('bg_text_color', 'ping');
})

ipcMain.on('refresh_register_key', function () {
    globalShortcut.unregisterAll();
    createKey();
})

ipcMain.on('previous_page', function () {
    PreviousPage();
})

ipcMain.on('next_page', function () {
    NextPage();
})

const shouldQuit = app.makeSingleInstance(() => {
    // Someone tried to run a second instance, we should focus our window.
    if (desktopWindow) {
        if (desktopWindow.isMinimized()) desktopWindow.restore()
        desktopWindow.focus()
    }
})

if (shouldQuit) {
    app.quit()
}

app.on('ready', init)

app.on('window-all-closed', () => {
    if (!isMac) app.quit()
})

// app.on('activate', () => {
//   if (settingWindow === null) {
//     createWindow()
//   }
// })

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

// import { autoUpdater } from 'electron-updater'

// autoUpdater.on('update-downloaded', () => {
//   autoUpdater.quitAndInstall()
// })

// app.on('ready', () => {
//   if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
// })