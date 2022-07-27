# better-cycom

This is just a react app that implements the Cycom client and can be used via a userscript.

```javascript
// ==UserScript==
// @name         Better Cycom
// @namespace    http://www.playcybots.com/
// @version      1.0
// @description  Better Cycom
// @author       Jason Tokoph (kodeking)
// @match        http://playcybots.com:2020/chat*
// @match        http://www.playcybots.com:2020/chat*
// @icon         https://www.google.com/s2/favicons?domain=playcybots.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Disables the original cycom code
    window.initPage = function() { console.log('disabled original cycom'); };
    if (window.socket) {
        window.socket.disconnect();
    }

    // Create the root DOM element to boot the app into
    var root = document.createElement('div');
    root.id = 'root';
    document.body.appendChild(root);

    // Inject the new javascript
    var script = document.createElement('script');
    script.src = `https://better-cycom-kodeking.s3.amazonaws.com/app.js?d=${+new Date()}`;
    document.body.appendChild(script);

    // Inject the new css
    var style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = `https://better-cycom-kodeking.s3.amazonaws.com/app.css?d=${+new Date()}`;
    document.body.appendChild(style);
})();
```
