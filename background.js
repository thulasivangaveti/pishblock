chrome.runtime.onInstalled.addListener(() => {
    console.log("Gmail Phishing Detector Extension Installed!");
});

// Listen for phishing detection request (optional future use)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "checkPhishing") {
        let emailContent = message.emailText;
        let emailId = message.emailId;
        let isPhishing = detectPhishing(emailContent);
        if (isPhishing) {
            deleteEmail(emailId);
        }
        sendResponse({ phishing: isPhishing });
    }
});

function detectPhishing(emailText) {
    const phishingKeywords = ["urgent", "password", "verify", "click here", "login now", "suspended", "account locked"];
    return phishingKeywords.some(keyword => emailText.toLowerCase().includes(keyword));
}

function deleteEmail(emailId) {
    chrome.identity.getAuthToken({ interactive: true }, function(token) {
        fetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${emailId}/trash`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
        .then(response => {
            if (response.ok) {
                console.log(`Email ID ${emailId} moved to Trash successfully.`);
            } else {
                console.error("Failed to delete email:", response.statusText);
            }
        })
        .catch(error => console.error("Error deleting email:", error));
    });
}
