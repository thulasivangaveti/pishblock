function showWarning() {
    if (document.getElementById("phish-warning")) return;
  
    const banner = document.createElement("div");
    banner.id = "phish-warning";
    banner.style.background = "red";
    banner.style.color = "white";
    banner.style.padding = "10px";
    banner.style.position = "fixed";
    banner.style.top = "0";
    banner.style.left = "0";
    banner.style.right = "0";
    banner.style.zIndex = "9999";
    banner.innerHTML = "⚠️ Warning: This email may be a phishing attempt! <button id='delete-email'>🗑 Delete</button>";
  
    document.body.prepend(banner);
  
    document.getElementById("delete-email").addEventListener("click", () => {
      alert("To delete email, grant Gmail API access. (Future integration)");
    });
  }
  
  function analyzeEmail() {
    const emailBody = document.querySelector(".a3s");
    if (!emailBody) return;
  
    const emailText = emailBody.innerText.toLowerCase();
    const suspiciousPatterns = ["urgent", "verify", "click here", "login now"];
    if (suspiciousPatterns.some(p => emailText.includes(p))) {
      showWarning();
    }
  }
  
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === "scanEmail") {
      const emailBody = document.querySelector(".a3s");
      const bodyText = emailBody ? emailBody.innerText : "";
      sendResponse({ body: bodyText });
    }
  });
  
  setTimeout(analyzeEmail, 3000);
  