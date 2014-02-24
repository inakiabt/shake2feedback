# Shake2Feedback
An Titanium tool to supply instant easy feedback from an app, including screenshot and hidden device/app extra info via email.

## Install

1. Download the repo as zip etc.
2. Also install ti.pain (`gittio install ti.paint`)
3. In your `app.js` (or wherever you want) add:

```javascript
require('shake2feedback').init({
    subject: 'Feedback',
    recipients: ['support@company.com', 'ticket@jra.company.com']
})
```
## Custom styles
```javascript
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
## Extra info
A base64 encoded json object will be sent hidden in email body message
```
[feedback message]
<div style="color: white" id="info">base64encodedejsonobjecthere</div>
[screenshot]
```

## Extra info builder callback
Allows to extend the extra info object
```javascript
require('shake2feedback').init({
    recipients: ['support@company.com', 'ticket@jra.company.com'],
    onBuildExtraInfo: function(extraInfo){
        extraInfo.appVersion = '1.0';
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
