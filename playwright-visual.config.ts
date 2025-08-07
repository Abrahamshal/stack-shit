import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/visual-*.spec.ts',
  
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  
  /* Opt out of parallel tests for visual regression */
  workers: 1,
  
  /* Reporter to use */
  reporter: [
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results/visual-results.json' }]
  ],
  
  /* Shared settings for all the projects below */
  use: {
    /* Base URL to use in actions */
    baseURL: 'http://localhost:8080',

    /* Collect trace when retrying the failed test */
    trace: 'on-first-retry',
    
    /* Screenshot options */
    screenshot: {
      mode: 'only-on-failure',
      fullPage: false // Never use fullPage to avoid dimension issues
    },
    
    /* Visual regression specific settings */
    ignoreHTTPSErrors: true,
    
    /* Viewport size */
    viewport: { width: 1920, height: 1080 },
  },

  /* Configure projects for visual regression testing */
  projects: [
    {
      name: 'Desktop Chrome',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 }
      },
    },
    {
      name: 'Desktop Firefox',
      use: { 
        ...devices['Desktop Firefox'],
        viewport: { width: 1920, height: 1080 }
      },
    },
    {
      name: 'Mobile Chrome',
      use: { 
        ...devices['Pixel 5'],
        viewport: { width: 393, height: 851 }
      },
    },
    {
      name: 'Tablet iPad',
      use: { 
        ...devices['iPad Pro'],
        viewport: { width: 1024, height: 1366 }
      },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:8080',
    reuseExistingServer: !process.env.CI,
  },
  
  /* Folder for test artifacts such as screenshots */
  outputDir: 'test-results/visual',
  
  /* Maximum time one test can run for */
  timeout: 30 * 1000,
  
  /* Configure screenshot comparison */
  expect: {
    toHaveScreenshot: {
      // Threshold between 0-1 for pixel differences
      threshold: 0.2,
      // Maximum allowed pixel difference
      maxDiffPixels: 100,
      // Animation handling
      animations: 'disabled',
      // Mask dynamic content
      mask: ['.calendly-inline-widget'],
    }
  }
});