# n8n Workflow Templates

This folder contains n8n workflow templates for the Transcript Pipeline content generation system.

## 📁 Folder Structure

```
workflows/
├── templates/           # Workflow JSON files
│   ├── transcript-pipeline-blog-generator-information-extractor.json  # ✅ RECOMMENDED
│   ├── workflow-1-blog-generator-fixed.json
│   ├── workflow-2-newsletter-generator.json
│   ├── workflow-3-linkedin-generator.json
│   ├── workflow-4-instagram-generator.json
│   └── video-content-pipeline-complete.json
├── documentation/       # Detailed guides
│   └── WORKFLOW_GUIDE.md
├── import-workflows.js  # Import script
└── README.md           # This file
```

## 🚀 Quick Start

### Option 1: Manual Import (Easiest)
1. Open n8n
2. Go to **Workflows** → **Import from File**
3. Select JSON file from `workflows/templates/`
4. Configure credentials

### Option 2: API Import Script
```bash
# Set your n8n API credentials
export N8N_API_URL=http://localhost:5678
export N8N_API_KEY=your-api-key-here

# Run import script
node workflows/import-workflows.js
```

### Option 3: Direct Copy-Paste
1. Open workflow JSON file
2. Copy entire contents
3. In n8n: **Workflows** → **Import from URL or JSON**
4. Paste and import

## 📋 Workflow Descriptions

### 🌟 Recommended: Information Extractor Version
**File:** `transcript-pipeline-blog-generator-information-extractor.json`
- Uses AI-powered Information Extractor node
- Requires `@n8n/n8n-nodes-langchain` package
- Best for complex Notion page structures
- Handles all block types automatically

### 🔧 Alternative: Code Node Version
**File:** `workflow-1-blog-generator-fixed.json`
- Uses JavaScript Code node for extraction
- Works on all n8n instances
- Manual block type handling
- Good fallback if AI nodes unavailable

### 📦 Complete Pipeline
**File:** `video-content-pipeline-complete.json`
- Contains all 4 workflows
- Blog → Newsletter → LinkedIn → Instagram
- Sequential webhook triggers
- Full content generation pipeline

## 🔑 Required Credentials

Configure these in n8n before running workflows:

| Credential | ID | Purpose | Get From |
|------------|-----|---------|----------|
| Notion API | `notion_credentials` | Read/write Notion pages | [Notion Integrations](https://www.notion.so/my-integrations) |
| OpenAI API | `openai_credentials` | Information Extractor | [OpenAI Platform](https://platform.openai.com) |
| Google Gemini | `google_palm_credentials` | Content generation | [Google AI Studio](https://makersuite.google.com/app/apikey) |

## 📚 Notion Database Setup

### Input Database (Transcripts)
- **Database ID:** `bdd14a97edf74955a841be2ab498c8da`
- **Properties:**
  - `Status` (Select): "Ready to Process"
  - `Title` (Title)
  - Transcript content in page blocks

### Output Database (Content Hub)
- **Database ID:** `f30872f72ecf47f38bdd4ad17a1a813e`
- **Properties:**
  - `Title` (Title)
  - `Content Type` (Select)
  - `Status` (Select)
  - `Word Count` (Number)
  - `Source` (Text)

## 🛠️ Troubleshooting

### "Could not find property option" Error
- Update n8n to latest version
- Install LangChain package: `npm install @n8n/n8n-nodes-langchain`
- Use Code node version as fallback

### Information Extractor Not Available
- Check if using n8n Cloud or self-hosted
- Ensure AI features are enabled
- Alternative: Use `workflow-1-blog-generator-fixed.json`

### API Import Fails
1. Enable API in n8n Settings
2. Generate API key
3. Check n8n is running
4. Verify URL and port

## 📖 Documentation

See [`documentation/WORKFLOW_GUIDE.md`](documentation/WORKFLOW_GUIDE.md) for:
- Detailed node descriptions
- Configuration parameters
- Execution flow diagrams
- Advanced troubleshooting

## 🤝 Support

For issues:
1. Check workflow connections
2. Verify credentials are configured
3. Test with sample data
4. Review execution logs in n8n

## 📝 Version Notes

- **v3.0** - Information Extractor implementation
- **v2.0** - AI Transform attempt (Cloud only)
- **v1.0** - Initial Code node version