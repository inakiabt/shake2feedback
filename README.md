# Shake2Feedback
An Titanium tool to supply instant easy feedback from an app, including screenshot.

## Install

1. Use [gitTio](http://gitt.io/component/wz.Feedback): `gittio install wz.Feedback` or download the repo as zip etc.
2. Also install ti.pain (`gittio install ti.paint`)
3. In your `alloy.js` add:

```
require('shake2feedback').init({
    recipients: ['support@company.com', 'ticket@jra.company.com']
})
```
## Custom styles
```
/*
UI components:
feedbackWindow, cancelButton, sendButton, comment, screenshot, paintView
 */
require('shake2feedback').init({
    recipients: ['support@company.com', 'ticket@jra.company.com'],
    styles: {
        feedbackWindow: {
            borderColor: 'red'
        }
    }
}
})
```

## Use
Shake, then feedback :)

## Customize
Use the `Feedback_` keys to translate texts.

## License
Copyright WappZapp TV

MIT License
