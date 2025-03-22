/**
 * AnnouncementBar.js
 * 
 * Usage options:
 * 1. Inline config:
 * <script>
 * window.LYRDY_ANNOUNCEMENT_CONFIG = {
 *   enabled: true,
 *   message: "Your announcement here",
 *   hideable: true
 * };
 * </script>
 * <script src="https://cdn.layeredy.com/utilities/announcementbar.js"></script>
 * 
 * 2. Remote config (requires CORS):
 * <script>
 * window.LYRDY_ANNOUNCEMENT_CONFIG_URL = "https://example.com/path/to/config.json";
 * </script>
 * <script src="https://cdn.layeredy.com/utilities/announcementbar.js"></script>
 */

(function() {
    const FALLBACK_CONFIG = {
      enabled: true,
      message: "You haven't configured your announcement bar yet! Add data-config attribute to your script tag.",
      hideable: true
    };
    
    const COOKIE_NAME = 'lyrdy_announcement_hide';
    
    function getConfig() {
      if (window.LYRDY_ANNOUNCEMENT_CONFIG && typeof window.LYRDY_ANNOUNCEMENT_CONFIG === 'object') {
        console.log('lyrdy/utils (https://lyrdy.co/announcementbar): Found inline config object');
        return {
          type: 'inline',
          config: window.LYRDY_ANNOUNCEMENT_CONFIG
        };
      }
      
      if (window.LYRDY_ANNOUNCEMENT_CONFIG_URL) {
        console.log('lyrdy/utils (https://lyrdy.co/announcementbar): Using global config URL:', window.LYRDY_ANNOUNCEMENT_CONFIG_URL);
        return {
          type: 'url',
          url: window.LYRDY_ANNOUNCEMENT_CONFIG_URL
        };
      }
      
      const scripts = document.getElementsByTagName('script');
      for (let i = 0; i < scripts.length; i++) {
        const script = scripts[i];
        const src = script.getAttribute('src') || '';
        if (src.indexOf('announcementbar.js') !== -1) {
          const configUrl = script.getAttribute('data-config');
          if (configUrl) {
            console.log('lyrdy/utils (https://lyrdy.co/announcementbar): Using data-config:', configUrl);
            return {
              type: 'url',
              url: configUrl
            };
          }
        }
      }
      
      console.log('lyrdy/utils (https://lyrdy.co/announcementbar): No config found');
      return { type: 'none' };
    }
    
    function setCookie(name, value, days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      const expires = "expires=" + date.toUTCString();
      document.cookie = name + "=" + value + ";" + expires + ";path=/";
    }
    
    function getCookie(name) {
      const cookieName = name + "=";
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.indexOf(cookieName) === 0) {
          return cookie.substring(cookieName.length, cookie.length);
        }
      }
      return "";
    }
    
    function appendStyles() {
      const style = document.createElement('style');
      style.textContent = `
        .announcement-bar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          background-color: rgba(74, 110, 224, 0.45);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          color: white;
          text-align: center;
          padding: 10px 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          font-size: 14px;
          z-index: 9999;
          box-shadow: 0 2px 15px rgba(0,0,0,0.08);
          border-bottom: 1px solid rgba(255,255,255,0.15);
        }
        
        .announcement-bar-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 40px;
          position: relative;
        }
        
        .announcement-bar-close {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: white;
          font-size: 18px;
          cursor: pointer;
          padding: 5px;
          line-height: 1;
          opacity: 0.8;
          transition: opacity 0.2s ease;
        }
        
        .announcement-bar-close:hover {
          opacity: 1;
        }
        
        body.has-announcement {
          margin-top: 40px;
        }
      `;
      document.head.appendChild(style);
    }
    
    function showAnnouncementBar(config) {
      if (!config.enabled) {
        console.log('lyrdy/utils (https://lyrdy.co/announcementbar): Announcement bar disabled');
        return;
      }
      
      if (config.hideable && getCookie(COOKIE_NAME) === 'true') {
        console.log('lyrdy/utils (https://lyrdy.co/announcementbar): Announcement bar hidden by user preference');
        return;
      }
      
      console.log('lyrdy/utils (https://lyrdy.co/announcementbar): Showing announcement bar');
      
      appendStyles();
      
      const announcementBar = document.createElement('div');
      announcementBar.className = 'announcement-bar';
      
      const contentContainer = document.createElement('div');
      contentContainer.className = 'announcement-bar-content';
      
      contentContainer.textContent = config.message;
      
      if (config.hideable) {
        const closeButton = document.createElement('button');
        closeButton.className = 'announcement-bar-close';
        closeButton.textContent = '✕';
        closeButton.setAttribute('aria-label', 'Close announcement');
        
        closeButton.addEventListener('click', function() {
          announcementBar.style.display = 'none';
          document.body.classList.remove('has-announcement');
          setCookie(COOKIE_NAME, 'true', 30);
        });
        
        contentContainer.appendChild(closeButton);
      }
      
      announcementBar.appendChild(contentContainer);
      
      document.body.appendChild(announcementBar);
      document.body.classList.add('has-announcement');
    }
    
    function init() {
      const configSource = getConfig();
      
      if (configSource.type === 'none') {
        console.log('lyrdy/utils (https://lyrdy.co/announcementbar): No config found, using fallback');
        showAnnouncementBar(FALLBACK_CONFIG);
        return;
      }
      
      if (configSource.type === 'inline') {
        console.log('lyrdy/utils (https://lyrdy.co/announcementbar): Using inline config', configSource.config);
        try {
          const config = configSource.config;
          if (typeof config !== 'object') {
            throw new Error('Invalid announcement configuration format');
          }
          
          const validatedConfig = {
            enabled: Boolean(config.enabled),
            message: String(config.message || ''),
            hideable: Boolean(config.hideable)
          };
          
          console.log('lyrdy/utils (https://lyrdy.co/announcementbar): Using config', validatedConfig);
          showAnnouncementBar(validatedConfig);
        } catch (error) {
          console.error('lyrdy/utils (https://lyrdy.co/announcementbar):', error);
          showAnnouncementBar(FALLBACK_CONFIG);
        }
        return;
      }
      
      console.log('lyrdy/utils (https://lyrdy.co/announcementbar): Fetching config from', configSource.url);
      
      fetch(configSource.url)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Failed to load announcement configuration (HTTP ${response.status})`);
          }
          return response.json();
        })
        .then(config => {
          console.log('lyrdy/utils (https://lyrdy.co/announcementbar): Loaded config', config);
          
          if (typeof config !== 'object') {
            throw new Error('Invalid announcement configuration format');
          }
          
          const validatedConfig = {
            enabled: Boolean(config.enabled),
            message: String(config.message || ''),
            hideable: Boolean(config.hideable)
          };
          
          console.log('lyrdy/utils (https://lyrdy.co/announcementbar): Using config', validatedConfig);
          showAnnouncementBar(validatedConfig);
        })
        .catch(error => {
          console.error('lyrdy/utils (https://lyrdy.co/announcementbar):', error);
          showAnnouncementBar(FALLBACK_CONFIG);
        });
    }
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
})();