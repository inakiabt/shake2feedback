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

    subject,
    recipients;

exports.init = function(options){
    if (initialized === true)
    {
        return;
    }

    options = options || {};

    var styles = options.styles || {};

    recipients = options.recipients;
    subject = options.subject;

    defaults(styles, defaultStyles);

    // UI
    var feedbackWindow = Ti.UI.createWindow(styles.feedbackWindow),
        cancelButton = Ti.UI.createButton(styles.cancelButton),
        sendButton = Ti.UI.createButton(styles.sendButton),
        comment = Ti.UI.createTextArea(styles.comment),
        screenshot = Ti.UI.createImageView(styles.screenshot),
        paintView = Paint.createPaintView(style.paintView);

    if (!isAndroid)
    {
        cancelButton.setStyle(Ti.UI.iPhone.SystemButtonStyle.PLAIN);
        sendButton.setStyle(Ti.UI.iPhone.SystemButtonStyle.PLAIN);
    }

    feedbackWindow.addEventListener('close', closeWindow);
    sendButton.addEventListener('click', sendFeedback);
    comment.addEventListener('focus', removeHintText);

    Ti.Gesture.addEventListener('shake', function(e) {

        // Save hintText
        hintText = comment.value;

        // Only show once
        if (isOpen)
        {
            return;
        }

        isOpen = true;

        // Take screenshot
        Titanium.Media.takeScreenshot(function(e) {

            // Set values
            comment.value = hintText;
            screenshot.image = e.media;

            // Open window
            feedbackWindow.open();
        });
    });

    screenshot.add(paintView);
    feedbackWindow.add(cancelButton);
    feedbackWindow.add(sendButton);
    feedbackWindow.add(comment);
    feedbackWindow.add(screenshot);

    initialized = true;
};

function closeWindow(evt)
{
    this.close();

    isOpen = false;
}

function sendFeedback(evt)
{
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

    emailDialog.setMessageBody(comment.value);
    emailDialog.addAttachment(screenshot.toImage());

    if (OS_IOS)
    {
        emailDialog.setHtml(true);
    }

    emailDialog.addEventListener('complete', function(e) {
        if (e.result == emailDialog.SENT) {
            closeWindow();
        }
    });

    emailDialog.open();
}

function removeHintText(evt)
{
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

defaultStyles = styles = {
    "feedbackWindow": {
        backgroundColor: "#CCC",

        modal: true,

        /* not available on iOS7, hide on iOS6 */
        navBarHidden: true
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