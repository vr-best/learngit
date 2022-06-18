// 1. import electron objects
const { app, session, BrowserWindow } = require("electron");


const path=require('path');
// 2. reserve a reference to window object
let window;
// 3. wait till application started
app.on("ready", () => {
  // 4. create a new window
  window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false, // 允许跨域
      preload: path.join(__dirname, 'preload.js'),
      
    },
  });
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders['User-Agent'] = 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.109 Safari/537.36';
    
    callback({ cancel: false, requestHeaders: details.requestHeaders });
  });
  // 5. load window content
  // window.loadFile("index.html");
  window.loadURL("http://www.baidu.com",{userAgent:'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.109 Safari/537.36'});
  // window.loadURL("https://web.whatsapp.com/",{userAgent:'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.109 Safari/537.36'});
});
