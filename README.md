# vxcv

Splash page for [vxcv.com](https://vxcv.com). Plain static HTML, CSS and JS, with no build step.

```
public/
  index.html    page markup, including the tiled SVG background
  styles.css    theme tokens (light, dark, system) and layout
  theme.js      applies a saved theme choice before first paint
  app.js        theme switch, heading decode, lit-tile flicker
  favicon.svg
  .htaccess     HTTPS and www redirects, security headers, caching
```

## Local preview

```sh
python3 -m http.server -d public 8000
```

Then open http://localhost:8000. The `.htaccess` rules apply only on the production web server.

## Deploy

Every push to `main` runs `.github/workflows/deploy.yml`. It copies `public/` to the web host's document root with rsync over SSH, then checks the live page. The workflow reads these secrets from the `prod` environment:

| Secret | Value |
|---|---|
| `SSH_HOST` | web host name |
| `SSH_USERNAME` | account user name |
| `SSH_PRIVATE_KEY` | dedicated deploy key (Ed25519) |
| `SSH_KNOWN_HOSTS` | pinned host keys (`ssh-keyscan` output) |
