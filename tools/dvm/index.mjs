#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import fetch from 'node-fetch';

class DirectusSchemaManager {
  constructor(apiURL = 'http://127.0.0.1:3002', apiToken = '') {
    this.apiURL = apiURL;
    this.apiToken = apiToken;
    this.snapshotFile = './snapshot.json';
  }

  getSnapshotFromFile() {
    try {
      const data = JSON.parse(readFileSync(this.snapshotFile, 'utf8'));
      return data;
    } catch (err) {
      console.error("Error reading the snapshot file:", err);
      process.exit(1);
    }
  }

  async applySnapshot() {
    const endpointDiff = `${this.apiURL}/schema/diff`;
    const endpointApply = `${this.apiURL}/schema/apply`;
    const headers = {
      'Authorization': `Bearer ${this.apiToken}`,
      'Content-Type': 'application/json',
    };

    try {
      const snapshotData = this.getSnapshotFromFile();
      const diffResponse = await fetch(endpointDiff, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(snapshotData),
      });

      if (!diffResponse.ok) {
        console.error('Error fetching the diff:', await diffResponse.text());
        process.exit(1);
      }
      
      const diffText = await diffResponse.text();
      
      if (!diffText) {
        console.error('There are no changes to apply. Exiting.');
        process.exit(1);
      }
      
      let diff;
      try {
        diff = JSON.parse(diffText);
      } catch (error) {
        console.error('Error parsing JSON:', error);
        process.exit(1);
      }
      
      console.log('Successfully retrieved the diff.');
      
      const applyResponse = await fetch(endpointApply, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(diff.data),
      });      

      if (applyResponse.ok) {
        console.log('Successfully applied the diff.');
      } else {
        console.error('Error applying the diff:', await applyResponse.text());
        process.exit(1);
      }
    } catch (err) {
      console.error('Error connecting to the Directus API:', err);
      process.exit(1);
    }
  }

  async saveSnapshot() {
    const endpointSnapshot = `${this.apiURL}/schema/snapshot`;
    const headers = {
      'Authorization': `Bearer ${this.apiToken}`,
      'Content-Type': 'application/json',
    };

    try {
      const snapshotResponse = await fetch(endpointSnapshot, {
        method: 'GET',
        headers: headers,
      });

      if (!snapshotResponse.ok) {
        console.error('Error fetching the snapshot:', await snapshotResponse.text());
        process.exit(1);
      }

      const snapshot = await snapshotResponse.json();
      console.log('Successfully retrieved the snapshot.');

      writeFileSync(this.snapshotFile, JSON.stringify(snapshot.data, null, 2), 'utf8');
      console.log(`Snapshot saved to ${this.snapshotFile}`);
    } catch (err) {
      console.error('Error connecting to the Directus API:', err);
      process.exit(1);
    }
  }

  executeCommand(command) {
    if (command === 'apply') {
      this.applySnapshot();
    } else if (command === 'save') {
      this.saveSnapshot();
    } else {
      console.error("Unrecognized command. Use 'apply' or 'save'.");
      process.exit(1);
    }
  }
}

const command = process.argv[2];

const manager = new DirectusSchemaManager(
  process.env.DIRECTUS_HOST ?? 'http://127.0.0.1:3002',
  process.env.DIRECTUS_ADMIN_TOKEN ?? ''
);

manager.executeCommand(command);
