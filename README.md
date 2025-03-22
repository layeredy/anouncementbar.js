# announcementbar.js
A simple announcement bar for your website
![image](https://github.com/user-attachments/assets/2857f366-9bef-4eb0-9475-b323e9ebd3f6)

## Usage:

### Inline (Recommended for single-site):
```
    <script>
        window.LYRDY_ANNOUNCEMENT_CONFIG = {
          enabled: true,
          message: "Your message here",
          hideable: true
        };
        </script>
        <script src="https://cdn.layeredy.com/utilities/announcementbar.js"></script>
```

### Remote (Recommended for multi-site) | Requires CORS setup
```
  <script>
  window.LYRDY_ANNOUNCEMENT_CONFIG_URL = "https://example.com/path/to/config.json";
  </script>
  <script src="https://cdn.layeredy.com/utilities/announcementbar.js"></script>
```

> [!NOTE]
> This implementation uses our CDN-hosted announcementbar.js script from [lyrdy/cdn](https://cdn.layeredy.com). For self-hosting, you can download the script directly from [this repository](https://github.com/layeredy/anouncementbar.js/blob/main/announcementbar.js).
