import { defineConfig } from 'cypress';
import getCompareSnapshotsPlugin from 'cypress-image-diff-js/plugin';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      return getCompareSnapshotsPlugin(on, config);
    },
    baseUrl: 'https://deckofcardsapi.com/api/deck',
    specPattern: 'cypress/**/*.cy.{js,jsx,ts,tsx}'
  },
});
