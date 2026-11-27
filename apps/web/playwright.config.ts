import { defineConfig, devices } from '@playwright/test';

const baseURL = 'http://127.0.0.1:5173';

export default defineConfig({
  testDir: './tests/browser',
  use: { baseURL, reducedMotion: 'reduce', serviceWorkers: 'block' },
  projects: [
    { name: 'chrome', use: { ...devices['Desktop Chrome'], channel: 'chrome' } },
    {
      name: 'mobile-webkit',
      use: { ...devices['iPhone SE'], viewport: { width: 320, height: 667 } },
    },
  ],
  webServer: {
    command: 'pnpm dev:mock --host 127.0.0.1 --strictPort',
    url: `${baseURL}/analyzer`,
    reuseExistingServer: !process.env.CI,
  },
});
