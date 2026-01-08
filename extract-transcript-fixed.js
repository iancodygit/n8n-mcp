// Get all blocks from the Notion page
const blocks = $input.all();
let fullTranscript = '';

// Extract text from all blocks
for (const item of blocks) {
  const block = item.json;
  
  // Handle different block types
  if (block.type === 'paragraph' && block.paragraph?.rich_text) {
    const texts = block.paragraph.rich_text.map(t => t.plain_text || '');
    fullTranscript += texts.join('') + '\n';
  }
  else if (block.type === 'heading_1' && block.heading_1?.rich_text) {
    const texts = block.heading_1.rich_text.map(t => t.plain_text || '');
    fullTranscript += '# ' + texts.join('') + '\n\n';
  }
  else if (block.type === 'heading_2' && block.heading_2?.rich_text) {
    const texts = block.heading_2.rich_text.map(t => t.plain_text || '');
    fullTranscript += '## ' + texts.join('') + '\n\n';
  }
  else if (block.type === 'heading_3' && block.heading_3?.rich_text) {
    const texts = block.heading_3.rich_text.map(t => t.plain_text || '');
    fullTranscript += '### ' + texts.join('') + '\n\n';
  }
  else if (block.type === 'quote' && block.quote?.rich_text) {
    const texts = block.quote.rich_text.map(t => t.plain_text || '');
    fullTranscript += '> ' + texts.join('') + '\n\n';
  }
  else if (block.type === 'bulleted_list_item' && block.bulleted_list_item?.rich_text) {
    const texts = block.bulleted_list_item.rich_text.map(t => t.plain_text || '');
    fullTranscript += '- ' + texts.join('') + '\n';
  }
  else if (block.type === 'numbered_list_item' && block.numbered_list_item?.rich_text) {
    const texts = block.numbered_list_item.rich_text.map(t => t.plain_text || '');
    fullTranscript += '• ' + texts.join('') + '\n';
  }
  else if (block.type === 'toggle' && block.toggle?.rich_text) {
    const texts = block.toggle.rich_text.map(t => t.plain_text || '');
    fullTranscript += texts.join('') + '\n';
  }
  else if (block.type === 'callout' && block.callout?.rich_text) {
    const texts = block.callout.rich_text.map(t => t.plain_text || '');
    fullTranscript += texts.join('') + '\n';
  }
  else if (block.type === 'code' && block.code?.rich_text) {
    const texts = block.code.rich_text.map(t => t.plain_text || '');
    fullTranscript += '```\n' + texts.join('') + '\n```\n';
  }
}

// Clean up the transcript
fullTranscript = fullTranscript.trim();

// Get video title from previous node if available
let videoTitle = 'Untitled';
try {
  const videoData = $('Find Videos to Process').item.json;
  if (videoData.properties?.Title?.title?.[0]?.text?.content) {
    videoTitle = videoData.properties.Title.title[0].text.content;
  } else if (videoData.properties?.Name?.title?.[0]?.text?.content) {
    videoTitle = videoData.properties.Name.title[0].text.content;
  }
} catch (e) {
  // Use default title if can't access previous node
}

// Calculate word count
const wordCount = fullTranscript.split(/\s+/).filter(word => word.length > 0).length;

// Return the extracted data
return [
  {
    json: {
      transcript: fullTranscript || 'No transcript content found in the page blocks.',
      videoTitle: videoTitle,
      blockCount: blocks.length,
      wordCount: wordCount,
      hasContent: fullTranscript.length > 0
    }
  }
];