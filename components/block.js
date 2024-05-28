// Function to replace the DOM
function replaceDOM(rule) {
    // Clear the existing DOM
    document.documentElement.innerHTML = '';
  
    // Create new content
    const newContent = document.createElement('div');
    newContent.innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f2f2f2; font-family: Arial, sans-serif;">
        <div style="text-align: center; padding: 20px; background: white; box-shadow: 0 4px 8px rgba(0,0,0,0.1); border-radius: 10px;">
          <h1 style="color: #d9534f;">Site Blocked by Chrome Blocker</h1>
          <p style="color: #333; font-size: 18px;">Access to this site is blocked by rule ${rule}.</p>
          <p style="color: #666; font-size: 14px;">Please remove rule or turn off chrome blocker if you want to access this site.</p>
        </div>
      </div>
    `;
  
    // Append the new content to the document body
    document.body.appendChild(newContent);
  }

  chrome.runtime.onMessage.addListener(function(message, x, y) {
    replaceDOM(message);
});
