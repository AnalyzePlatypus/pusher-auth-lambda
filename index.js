var Pusher = require('pusher');


var pusher_instance = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  useTLS: true,
});

function parseBody(bodyString) {
  const body = {};
  bodyString.split("&").map(field => {
    var segments = field.split("=");
    body[segments[0]] = segments[1];
  });
  return body;
}


async function handler(event) {
  try {

  
  body = parseBody(event.body);
  console.log(body);
  

  var socketId = body.socket_id;
  var channel = body.channel_name;
  var role = event.queryStringParameters.role;
  var presenceData = {
    user_id: role,
    user_info: {
      ip_address: event.headers['X-Forwarded-For'],
      deviceInfo: AppleDetectBrowser(event.headers["User-Agent"], event.headers["Accept-Language"]).report
    }
  }
  
  var auth = pusher_instance.authenticate(socketId, channel, presenceData);
  
  const response = {
      statusCode: 200,
      body: JSON.stringify(auth),
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
  };

    return response;
  } catch(e) {
    console.error(e);
    return {
      statusCode: 400,
      body: e,
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    }
  }
};


function AppleDetectBrowser(userAgent, language) {  
  var version, webkitVersion, isEdge, iOSAgent, iOSDevice, iOSMajorVersion, iOSMinorVersion, browser = {};
  isEdge = /\sedge\//.test(userAgent);
  if (isEdge) {
      version = (userAgent.match(/(?:edge\/)([\d\.]*)/) || [])[1]
  } else {
      version = (userAgent.match(/.*(?:rv|chrome|webkit|opera|ie)[\/: ](.+?)([ \);]|$)/) || [])[1]
  }
  browser.version = version;
  webkitVersion = (userAgent.match(/webkit\/(.+?) /) || [])[1];
  iOSAgent = userAgent.split(/\s*[;)(]\s*/) || [];
  iOSDevice = iOSAgent[1];
  // iOSDeviceVersion = iOSAgent[2] ? iOSAgent[2].match(/(\d{1,})_(\d{1,})/i) : null;
  // iOSMajorVersion = iOSDeviceVersion ? iOSDeviceVersion[1] : null;
  // iOSMinorVersion = iOSDeviceVersion ? iOSDeviceVersion[2] : null;
  browser.windows = browser.isWindows = !!/windows/.test(userAgent);
  browser.mac = browser.isMac = !!/macintosh/.test(userAgent) || (/mac os x/.test(userAgent) && !/like mac os x/.test(userAgent));
  browser.lion = browser.isLion = !!(/mac os x 10[_\.][7-9]/.test(userAgent) && !/like mac os x 10[_\.][7-9]/.test(userAgent));
  browser.iPhone = browser.isiPhone = (iOSDevice === "iphone");
  browser.iPod = browser.isiPod = (iOSDevice && iOSDevice.indexOf("ipod") > -1);
  browser.iPad = browser.isiPad = (iOSDevice === "ipad");
  browser.iOS = browser.isiOS = browser.iPhone || browser.iPod || browser.iPad;
  browser.iOSMajorVersion = browser.iOS ? iOSMajorVersion * 1 : undefined;
  browser.iOSMinorVersion = browser.iOS ? iOSMinorVersion * 1 : undefined;
  browser.android = browser.isAndroid = !!/android/.test(userAgent);
  browser.silk = browser.isSilk = !!/silk/.test(userAgent);
  browser.opera = /opera/.test(userAgent) ? version : 0;
  browser.isOpera = !!browser.opera;
  browser.msie = /msie \d+\.\d+|trident\/\d+\.\d.*; rv:\d+\.\d+[;\)]/.test(userAgent) && !browser.opera ? version : 0;
  browser.isIE = !!browser.msie;
  browser.isIE8OrLower = !!(browser.msie && parseInt(browser.msie, 10) <= 8);
  browser.isIE9OrLower = !!(browser.msie && parseInt(browser.msie, 10) <= 9);
  browser.isIE10OrLower = !!(browser.msie && parseInt(browser.msie, 10) <= 10);
  browser.isIE10 = !!(browser.msie && parseInt(browser.msie, 10) === 10);
  browser.isIE11 = !!(browser.msie && parseInt(browser.msie, 10) === 11);
  browser.edge = isEdge ? version : 0;
  browser.isEdge = isEdge;
  browser.mozilla = !isEdge && /mozilla/.test(userAgent) && !/(compatible|webkit|msie|trident)/.test(userAgent) ? version : 0;
  browser.isMozilla = !!browser.mozilla;
  browser.webkit = (!isEdge && /webkit/.test(userAgent)) ? webkitVersion : 0;
  browser.isWebkit = !!browser.webkit;
  browser.chrome = !isEdge && /chrome/.test(userAgent) ? version : 0;
  browser.isChrome = !!browser.chrome;
  browser.mobileSafari = /apple.*mobile/.test(userAgent) && browser.iOS ? webkitVersion : 0;
  browser.isMobileSafari = !!browser.mobileSafari;
  browser.iPadSafari = browser.iPad && browser.isMobileSafari ? webkitVersion : 0;
  browser.isiPadSafari = !!browser.iPadSafari;
  browser.iPhoneSafari = browser.iPhone && browser.isMobileSafari ? webkitVersion : 0;
  browser.isiPhoneSafari = !!browser.iphoneSafari;
  browser.iPodSafari = browser.iPod && browser.isMobileSafari ? webkitVersion : 0;
  browser.isiPodSafari = !!browser.iPodSafari;
  browser.isiOSHomeScreen = browser.isMobileSafari && !/apple.*mobile.*safari/.test(userAgent);
  browser.safari = browser.webkit && !browser.chrome && !browser.iOS && !browser.android ? webkitVersion : 0;
  browser.isSafari = !!browser.safari;
  // browser.language = language.split("-", 1)[0];
  browser.current = browser.edge ? "edge" : browser.msie ? "msie" : browser.mozilla ? "mozilla" : browser.chrome ? "chrome" : browser.safari ? "safari" : browser.opera ? "opera" : browser.mobileSafari ? "mobile-safari" : browser.android ? "android" : "unknown";
  browser.platform = browser.isWindows ? "Windows" : browser.isMac ? 'macOS' : browser.isiPhone ? "iPhone" : browser.isiPod ? "iPod Touch" : browser.isAndroid ? 'Android' : "Unknown platform";

  browser.report = `${capitalize(browser.current)} on ${browser.platform}`;
  return browser;
}

function capitalize([firstLetter, ...rest]) {
  return [firstLetter.toLocaleUpperCase(), ...rest].join('');
}

exports.handler = handler;
exports.default = handler;
