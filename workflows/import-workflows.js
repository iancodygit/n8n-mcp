#!/usr/bin/env node

/**
 * Script to import n8n workflows via API
 * Usage: node import-workflows.js
 * 
 * Requires environment variables:
 * - N8N_API_URL: Your n8n instance URL (e.g., http://localhost:5678)
 * - N8N_API_KEY: Your n8n API key
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Configuration
const API_URL = process.env.N8N_API_URL || 'http://localhost:5678';
const API_KEY = process.env.N8N_API_KEY;

if (!API_KEY) {
  console.error('❌ N8N_API_KEY environment variable is required');
  console.log('\nTo get your API key:');
  console.log('1. Open n8n Settings → API');
  console.log('2. Generate an API key');
  console.log('3. Set: export N8N_API_KEY=your-key-here');
  process.exit(1);
}

// Workflow templates
const WORKFLOWS = [
  {
    file: 'transcript-pipeline-blog-generator-information-extractor.json',
    name: 'Transcript Pipeline - Blog Generator (AI)',
    description: 'Uses Information Extractor for AI-powered text extraction from Notion blocks'
  },
  {
    file: 'workflow-1-blog-generator-fixed.json',
    name: 'Blog Generator (Code Node)',
    description: 'Alternative version using Code node for text extraction'
  },
  {
    file: 'video-content-pipeline-complete.json',
    name: 'Complete Content Pipeline',
    description: 'Full pipeline for Blog, Newsletter, LinkedIn, and Instagram'
  }
];

/**
 * Make API request to n8n
 */
async function makeRequest(method, endpoint, data = null) {
  const url = new URL(`${API_URL}/api/v1${endpoint}`);
  const protocol = url.protocol === 'https:' ? https : http;
  
  const options = {
    hostname: url.hostname,
    port: url.port,
    path: url.pathname + url.search,
    method: method,
    headers: {
      'X-N8N-API-KEY': API_KEY,
      'Content-Type': 'application/json'
    }
  };

  return new Promise((resolve, reject) => {
    const req = protocol.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(response);
          } else {
            reject(new Error(`API Error ${res.statusCode}: ${response.message || body}`));
          }
        } catch (e) {
          reject(new Error(`Failed to parse response: ${body}`));
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

/**
 * Check n8n connection
 */
async function checkConnection() {
  try {
    console.log(`🔌 Connecting to n8n at ${API_URL}...`);
    const workflows = await makeRequest('GET', '/workflows');
    console.log(`✅ Connected! Found ${workflows.data.length} existing workflows\n`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to connect to n8n: ${error.message}`);
    console.log('\nMake sure:');
    console.log('1. n8n is running');
    console.log('2. API is enabled in Settings');
    console.log('3. API key is correct');
    return false;
  }
}

/**
 * Import a workflow
 */
async function importWorkflow(workflowFile, name, description) {
  const filePath = path.join(__dirname, 'templates', workflowFile);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${workflowFile}`);
    return false;
  }

  try {
    console.log(`📤 Importing: ${name}`);
    
    // Read workflow file
    const workflowData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Prepare workflow for import
    const workflow = {
      name: workflowData.name || name,
      nodes: workflowData.nodes || [],
      connections: workflowData.connections || {},
      settings: workflowData.settings || {
        executionOrder: 'v1',
        saveDataSuccessExecution: 'all',
        saveDataErrorExecution: 'all',
        saveExecutionProgress: true,
        saveManualExecutions: true
      },
      active: false // Start inactive
    };

    // Create workflow
    const result = await makeRequest('POST', '/workflows', workflow);
    console.log(`✅ Created workflow: ${result.name} (ID: ${result.id})`);
    console.log(`   ${description}\n`);
    
    return result;
  } catch (error) {
    console.error(`❌ Failed to import ${name}: ${error.message}\n`);
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 n8n Workflow Import Tool\n');
  console.log('================================\n');

  // Check connection
  if (!await checkConnection()) {
    process.exit(1);
  }

  console.log('📦 Importing workflows...\n');
  
  let successCount = 0;
  let failCount = 0;

  // Import each workflow
  for (const workflow of WORKFLOWS) {
    const result = await importWorkflow(workflow.file, workflow.name, workflow.description);
    if (result) {
      successCount++;
    } else {
      failCount++;
    }
  }

  // Summary
  console.log('================================\n');
  console.log('📊 Import Summary:');
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Failed: ${failCount}\n`);

  if (successCount > 0) {
    console.log('🎯 Next Steps:');
    console.log('1. Open n8n and navigate to Workflows');
    console.log('2. Configure credentials for each workflow:');
    console.log('   - Notion API (notion_credentials)');
    console.log('   - OpenAI API (openai_credentials)');
    console.log('   - Google Gemini API (google_palm_credentials)');
    console.log('3. Update Notion database IDs in workflow nodes');
    console.log('4. Test with sample data');
    console.log('5. Activate workflows when ready\n');
  }
}

// Run
main().catch(console.error);