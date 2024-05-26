// Example: Modify the DOM when the script is injected
function modifyDOM() {
    console.log(`localStorage: ${localStorage}`);
    document.documentElement.innerHTML = '';
    document.body.style.backgroundColor = 'lightblue';
  
    const banner = document.createElement('div');
    banner.textContent = 'This site is blacklisted!';
    banner.style.position = 'fixed';
    banner.style.top = '0';
    banner.style.width = '100%';
    banner.style.backgroundColor = 'red';
    banner.style.color = 'white';
    banner.style.textAlign = 'center';
    banner.style.zIndex = '1000';
    banner.style.padding = '10px';
    document.body.appendChild(banner);
  }
  
  modifyDOM();