# School DRRM Hub — Offline-First UI Starter

A responsive React + Vite Progressive Web App (PWA) starter for a school Disaster Risk Reduction and Management portal.

## Included in this starter
- Responsive admin/teacher/student/parent portal preview
- Dashboard, learning modules, alerts, reports and placeholder admin sections
- Installable PWA configuration and service-worker asset precaching
- Connection status indicator
- Local demo hazard reports saved in the current browser
- Local learning progress
- Accessible labels, keyboard focus styles and mobile navigation

## Important safety and functionality limitations
This is a **UI starter**, not an operational emergency-response system.
- Demo alerts are not connected to PAGASA, PHIVOLCS, NDRRMC, DepEd or emergency services.
- Hazard reports are stored only in the current browser's local storage; they are not transmitted to the school.
- There is no production login, role-based authorization, shared database, SMS, live map, student roster or dispatch integration.
- Do not enter real student names, health information, addresses or other sensitive data in this prototype.
- Offline mode does not guarantee that remote reporting or notifications will work without a network.
- Validate all emergency instructions with official guidance and the school's approved DRRM plan before operational use.

## Run locally
Install Node.js LTS, then run:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Build
```bash
npm run build
npm run preview
```

## Publish with GitHub Pages
1. Create a GitHub repository, for example `school-drrm-pwa`.
2. Upload/extract the project files into the repository root.
3. In GitHub, open **Settings → Pages** and select **GitHub Actions** as the build/deployment source.
4. Add a workflow file at `.github/workflows/deploy.yml` (example below).
5. Push to the `main` branch. After the workflow succeeds, open the Pages URL and test install/offline behavior.

### GitHub Actions workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy School DRRM PWA to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm install
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

The Vite configuration uses `base: './'` to support project paths on GitHub Pages. Test the deployed app from its actual Pages URL.

## Offline testing
1. Open the app once while online.
2. Wait for the service worker to install.
3. In browser DevTools → Network, enable **Offline** and reload.
4. Verify that cached app screens open. Test again on the actual target phone/browser.
5. Remember: live alerts, shared accounts, cloud backups and sending reports require network connectivity and a backend integration.

## Recommended next stages
1. Confirm school name, logo, colors and verified contact information.
2. Build proper authentication and role-based access.
3. Add a backend for authorized shared records and synchronization.
4. Define data privacy, retention, audit, backup and incident response procedures.
5. Validate emergency procedures with school leadership and DRRM responders.
6. Pilot with synthetic data before any real school deployment.
