# n8n Workflow Templates Documentation

## Overview
This folder contains n8n workflow templates for processing video transcripts from Notion and generating multi-platform content.

## Available Workflows

### 1. Transcript Pipeline - Blog Post Generator (Information Extractor)
**File:** `transcript-pipeline-blog-generator-information-extractor.json`
**Status:** ✅ RECOMMENDED - Uses proper n8n AI nodes
**Features:**
- Uses Information Extractor node for AI-powered text extraction
- Connects with OpenAI for extraction and Google Gemini for blog generation
- Processes all Notion block types (paragraphs, headings, lists, quotes, code blocks)
- Schema-based extraction with structured output

**Required Nodes:**
- `@n8n/n8n-nodes-langchain.informationExtractor` - Information Extractor
- `@n8n/n8n-nodes-langchain.lmChatOpenAi` - OpenAI Chat Model
- `@n8n/n8n-nodes-langchain.chainLlm` - Basic LLM Chain
- `@n8n/n8n-nodes-langchain.lmChatGoogleGemini` - Google Gemini Chat Model
- `@n8n/n8n-nodes-langchain.chatPromptTemplate` - Chat Prompt Template

### 2. Video Content Pipeline - Complete
**File:** `video-content-pipeline-complete.json`
**Status:** ✅ Working
**Features:**
- Complete 4-workflow pipeline
- Generates Blog, Newsletter, LinkedIn, and Instagram content
- Sequential webhook triggers between workflows
- Error handling and status updates

### 3. Individual Workflow Components
- `workflow-1-blog-generator-fixed.json` - Blog generation with manual text extraction
- `workflow-2-newsletter-generator.json` - Newsletter content generation
- `workflow-3-linkedin-generator.json` - LinkedIn post generation
- `workflow-4-instagram-generator.json` - Instagram caption generation

## Installation Instructions

### Method 1: Import via n8n UI
1. Open your n8n instance
2. Go to Workflows → Import
3. Select the JSON file from `/workflows/templates/`
4. Configure credentials:
   - Notion API
   - OpenAI API (for Information Extractor)
   - Google Gemini API (for content generation)

### Method 2: Via n8n MCP Tools (if configured)
```javascript
// Load workflow file
const workflow = require('./workflows/templates/transcript-pipeline-blog-generator-information-extractor.json');

// Create workflow via MCP
n8n_create_workflow({
  name: workflow.name,
  nodes: workflow.nodes,
  connections: workflow.connections,
  settings: workflow.settings
});
```

## Required Credentials

### Notion API
- Create integration at https://www.notion.so/my-integrations
- Grant access to your databases
- Add credential in n8n with ID: `notion_credentials`

### OpenAI API
- Get API key from https://platform.openai.com
- Add credential in n8n with ID: `openai_credentials`
- Used for Information Extractor node

### Google Gemini API
- Get API key from Google Cloud Console
- Add credential in n8n with ID: `google_palm_credentials`
- Used for blog content generation

## Notion Database Setup

### Video/Transcript Database
**Database ID:** `bdd14a97edf74955a841be2ab498c8da`
**Required Properties:**
- `Status` (Select): "Ready to Process", "Processing", "Completed"
- `Title` (Title): Video/transcript title
- Content blocks containing transcript text

### Content Hub Database
**Database ID:** `f30872f72ecf47f38bdd4ad17a1a813e`
**Required Properties:**
- `Title` (Title)
- `Content Type` (Select): "Blog Post", "Newsletter", "LinkedIn Post", "Instagram Caption"
- `Status` (Select): "Draft", "Published"
- `Word Count` (Number)
- `Source` (Text)
- `SEO Keywords` (Text) - for blog posts
- `Hashtags` (Text) - for social media posts
- `Target Audience` (Select)

## Node Types Required in n8n

### Core Nodes (Standard)
- `n8n-nodes-base.scheduleTrigger`
- `n8n-nodes-base.notion`
- `n8n-nodes-base.if`
- `n8n-nodes-base.code`
- `n8n-nodes-base.webhook`
- `n8n-nodes-base.httpRequest`

### AI Nodes (LangChain Package)
Install the `@n8n/n8n-nodes-langchain` package if not available:
```bash
npm install @n8n/n8n-nodes-langchain
```

Available AI nodes:
- Information Extractor
- Basic LLM Chain
- Summarization Chain
- Question and Answer Chain
- Text Classifier
- AI Transform (Cloud only)

## Workflow Execution Flow

1. **Schedule Trigger** - Runs every 5 minutes
2. **Find Transcripts** - Queries Notion for "Ready to Process" items
3. **Check if Found** - Validates transcript exists
4. **Update Status** - Marks as "Processing"
5. **Get Page Content** - Fetches all Notion blocks
6. **Information Extractor** - Uses AI to extract text from blocks
7. **Basic LLM Chain** - Generates blog content with Gemini
8. **Create Blog** - Saves to Content Hub in Notion

## Troubleshooting

### Import Error: "Could not find property option"
- Ensure you have the latest n8n version
- Install `@n8n/n8n-nodes-langchain` package
- Check that all node types are available in your instance

### Information Extractor Not Available
- This is part of the LangChain package
- May require n8n Cloud or self-hosted with AI features enabled
- Alternative: Use the Code node version in `transcript-pipeline-blog-generator-fixed.json`

### Credentials Not Found
- Create credentials in n8n UI first
- Use exact credential IDs as specified in workflows
- Test each credential before running workflow

## Environment Variables (for MCP)

```bash
# Required for n8n MCP workflow management
N8N_API_URL=http://localhost:5678
N8N_API_KEY=your-api-key-here

# Required for HTTP mode
MCP_SERVER_URL=http://localhost:3000
```

## Testing Workflows

1. **Test with Sample Data:**
   - Create a test page in your Notion database
   - Add sample transcript text in various block types
   - Set status to "Ready to Process"
   - Manually execute workflow

2. **Monitor Execution:**
   - Check n8n execution logs
   - Verify each node's output
   - Check Notion Content Hub for created content

## Support

For issues with:
- **Workflow Logic:** Check node connections and parameters
- **AI Nodes:** Ensure LangChain package is installed
- **Credentials:** Verify API keys are valid and have proper permissions
- **MCP Tools:** Check environment variables and API access

## Version History

- v1.0 - Initial workflow with manual Code node extraction
- v2.0 - Added AI Transform node (Cloud only)
- v3.0 - Updated to use Information Extractor (recommended)
- v4.0 - Complete pipeline with all content types