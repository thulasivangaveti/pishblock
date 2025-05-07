document.getElementById("scanBtn").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "scanEmail" }, (response) => {
        const suspiciousWords = ["urgent", "verify", "click here", "login now"];
        let score = 0;
  
        suspiciousWords.forEach(word => {
          if (response.body.toLowerCase().includes(word)) {
            score += 25;
          }
        });
  
        const risk = score >= 75 ? "🔴 High Risk" :
                     score >= 25 ? "🟡 Medium Risk" : "🟢 Safe";
  
        document.getElementById("result").innerText = `Scan complete.\nRisk Level: ${risk}`;
      });
    });
  });
  