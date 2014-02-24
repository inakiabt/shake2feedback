var isOpen = false,
    hintText = '',
    Paint = require('ti.paint'),
    isAndroid = Ti.Platform.osname === 'android',
    OS_IOS = !isAndroid,
    initialized = false,

    // UI
    feedbackWindow,
    cancelButton,
    sendButton,
    comment,
    screenshot,
    paintView,
    defaultStyles,

    extraInfoBuilder,

    subject,
    recipients;

exports.init = function(options){
    if (!initialized)
    {
        extraInfoBuilder = options.onBuildExtraInfo;

        Ti.Gesture.addEventListener('shake', function(e) {

            // Only show once
            if (isOpen)
            {
                return;
            }

            isOpen = true;

            // Take screenshot
            Titanium.Media.takeScreenshot(function(e) {
                // Open window
                openWindow(options, e.media);
            });
        });
        initialized = true;
    }
};

function openWindow(options, image)
{

    options = options || {};

    var styles = options.styles || {};

    recipients = options.recipients;
    subject = options.subject;

    defaults(styles, defaultStyles);

    // UI
    feedbackWindow = Ti.UI.createWindow(styles.feedbackWindow);
    cancelButton = Ti.UI.createButton(styles.cancelButton);
    sendButton = Ti.UI.createButton(styles.sendButton);
    comment = Ti.UI.createTextArea(styles.comment);
    screenshot = Ti.UI.createImageView(styles.screenshot);
    paintView = Paint.createPaintView(styles.paintView);

    if (!isAndroid)
    {
        cancelButton.setStyle(Ti.UI.iPhone.SystemButtonStyle.PLAIN);
        sendButton.setStyle(Ti.UI.iPhone.SystemButtonStyle.PLAIN);
    }

    feedbackWindow.addEventListener('close', clean);
    sendButton.addEventListener('click', sendFeedback);
    cancelButton.addEventListener('click', closeWindow);
    comment.addEventListener('focus', removeHintText);

    screenshot.setImage(image);

    screenshot.add(paintView);
    feedbackWindow.add(cancelButton);
    feedbackWindow.add(sendButton);
    feedbackWindow.add(comment);
    feedbackWindow.add(screenshot);

    feedbackWindow.open();
}

function closeWindow(evt)
{

    feedbackWindow.close();
}

function clean(evt)
{

    feedbackWindow.removeEventListener('close', clean);
    sendButton.removeEventListener('click', sendFeedback);
    cancelButton.removeEventListener('click', closeWindow);
    comment.removeEventListener('focus', removeHintText);

    screenshot.remove(paintView);
    feedbackWindow.remove(screenshot);
    feedbackWindow.remove(cancelButton);
    feedbackWindow.remove(sendButton);
    feedbackWindow.remove(comment);

    feedbackWindow = null;

    isOpen = false;
}

function sendFeedback(evt)
{
    if (!isOpen)
    {
        return;
    }

    var emailDialog = Titanium.UI.createEmailDialog();

    // Not supported
    if (!emailDialog.isSupported())
    {
        alert(L('Feedback_couldNotCreateEmail', 'Could not create email'));
        return;
    }

    emailDialog.setSubject(subject || L('Feedback_subject', 'Feedback'));

    if (recipients)
    {
        emailDialog.setToRecipients(recipients);
    }

    var body = comment.value,
        extraInfo = {
            apiName: Ti.Platform.apiName,
            architecture: Ti.Platform.architecture,
            availableMemory: Ti.Platform.availableMemory,
            displayCaps: Ti.Platform.displayCaps,
            id: Ti.Platform.id,
            feedback: body,
            locale: Ti.Platform.locale,
            manufacturer: Ti.Platform.manufacturer,
            model: Ti.Platform.model,
            name: Ti.Platform.name,
            osname: Ti.Platform.osname,
            version: Ti.Platform.version
        };

    if (typeof extraInfoBuilder === 'function')
    {
        extraInfoBuilder(extraInfo);
    }

    body += '<div style="color: white" id="info">' + Ti.Utils.base64encode(JSON.stringify(extraInfo))+'</div>';

    emailDialog.setMessageBody(body);
    emailDialog.addAttachment(screenshot.toImage());

    if (OS_IOS)
    {
        emailDialog.setHtml(true);
    }

    emailDialog.addEventListener('complete', function(e) {
        if (e.result == emailDialog.SENT)
        {
            // Fixes possible error while two modal windows are being closed (email dialog is a modal window too)
            setTimeout(closeWindow, 1000);
        }
    });

    emailDialog.open();
}

function removeHintText(evt)
{
    if (!isOpen)
    {
        return;
    }
    comment.removeEventListener('focus', removeHintText);
    comment.value = '';
}

// from underscore.js https://github.com/jashkenas/underscore
function defaults(obj, source)
{
    if (source && obj)
    {
        for (var prop in source)
        {
            if (obj[prop] === void 0)
            {
                obj[prop] = source[prop];
            } else if (typeof obj[prop] === 'object') {
                defaults(obj[prop], source[prop]);
            }
        }
    }
}

defaultStyles = {
    "feedbackWindow": {
        backgroundColor: "#CCC",

        top: '22dp',

        modal: true,

        /* not available on iOS7, hide on iOS6 */
        navBarHidden: false
    },

    "cancelButton": {
        top: '5dp',
        height: '30dp',
        left: '5dp',

        backgroundColor: "#333",
        color: "#FFF",
        font: {
            fontSize: '14dp'
        },

        title: L('Feedback_cancel', ' Cancel ')
    },

    "sendButton": {
        top: '5dp',
        right: '5dp',
        height: '30dp',

        backgroundColor: "#333",
        color: "#FFF",
        font: {
            fontSize: '14dp'
        },

        title: L('Feedback_send', ' Send ')
    },

    "comment" : {
        top: '40dp',
        right: '5dp',
        height: '90dp',
        left: '5dp',

        value: L('Feedback', 'Draw on the screenshot and write your feedback here.'),

        color: "#333",
        textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
        fontFamily: {
            fontSize: '14dp'
        },
        backgroundColor: "#FFF"
    },

    "screenshot" : {
        top: '135dp',
        right: '5dp',
        bottom: '5dp',
        left: '5dp'
    },

    "paintView" : {
        width: Ti.UI.FILL,
        height: Ti.UI.FILL,

        backgroundColor: "transparent",

        eraseMode: false,
        strokeWidth: 5.0,
        strokeColor: 'blue',
        strokeAlpha: 255
    }
};