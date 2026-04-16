import Tesseract from 'tesseract.js';

/**
 * Extracts academic tasks from raw text using regex heuristics.
 */
const parseTextForTasks = (text) => {
  const tasks = [];
  
  // Normalize text to make parsing easier
  const normalizedText = text.replace(/\n/g, ' ');

  // 1. Look for common task identifiers to split the text into chunks or identify sentences
  // e.g. "Quiz 1 is on...", "Submit your assignment by..."
  const taskKeywords = /(quiz|exam|assignment|project|submission|homework|midterm|finals)/gi;
  
  // 2. Look for subjects: 2-4 uppercase letters, optional space, 2-3 numbers (e.g. CSIT 221, IT101)
  const subjectRegex = /([A-Z]{2,4}\s?\d{2,3})/g;
  
  // 3. Look for dates: Oct 25, October 25th, 10/25/2024, tomorrow
  const dateRegex = /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s\d{1,2}(st|nd|rd|th)?|\d{1,2}\/\d{1,2}(\/\d{2,4})?|tomorrow/gi;
  
  // 4. Look for times: 11:59 PM, 23:59, 5 PM
  const timeRegex = /(\d{1,2}:\d{2}\s?(?:AM|PM|am|pm))|(\d{1,2}\s?(?:AM|PM|am|pm))/g;

  // Let's try splitting the text into sentences to isolate tasks
  const sentences = text.split(/(?<=[.!?\n])\s+/);

  sentences.forEach((sentence, index) => {
    // If the sentence mentions a task keyword OR a date, it might be a task
    const keywordMatch = sentence.match(taskKeywords);
    const dateMatch = sentence.match(dateRegex);
    
    if (keywordMatch || dateMatch) {
      // Find subject specifically in this sentence, or fallback to looking in the whole text
      const subjectMatch = sentence.match(subjectRegex) || text.match(subjectRegex);
      const timeMatch = sentence.match(timeRegex);

      // Guess the title
      let title = "Extracted Task";
      if (keywordMatch) {
        title = sentence.substring(0, 30).split('.')[0]; // keep it short
        if (title.length < 5) title = `${keywordMatch[0]} Task`;
      } else if (dateMatch) {
        title = "Scheduled Deadline";
      }

      // Format date for the input field (YYYY-MM-DD)
      let formattedDate = new Date().toISOString().split('T')[0]; // Default today
      if (dateMatch) {
        const rawDate = dateMatch[0].toLowerCase();
        if (rawDate.includes('tomorrow')) {
          const tmrw = new Date();
          tmrw.setDate(tmrw.getDate() + 1);
          formattedDate = tmrw.toISOString().split('T')[0];
        } else {
          // Attempt to parse standard dates (might need a real date library like date-fns for robustness, but JS Date works for basic stuff)
          // We will append current year if missing just so JS parser doesn't break
          const parsed = new Date(rawDate + `, ${new Date().getFullYear()}`);
          if (!isNaN(parsed.getTime())) {
            formattedDate = parsed.toISOString().split('T')[0];
          }
        }
      }

      // Guess Priority based on keyword
      let priority = 'Medium';
      const lowCaseSentence = sentence.toLowerCase();
      if (lowCaseSentence.includes('exam') || lowCaseSentence.includes('final') || lowCaseSentence.includes('project')) {
        priority = 'High';
      } else if (lowCaseSentence.includes('reading') || lowCaseSentence.includes('review')) {
        priority = 'Low';
      }

      tasks.push({
        id: Date.now() + Math.random(),
        title: title.trim(),
        subject: subjectMatch ? subjectMatch[0].toUpperCase() : '',
        date: formattedDate,
        time: timeMatch ? timeMatch[0].toUpperCase() : '11:59 PM', // Default to EOD
        priority: priority
      });
    }
  });

  // If we couldn't parse anything specific but there is text, give one generic task
  if (tasks.length === 0 && text.trim().length > 0) {
    tasks.push({
      id: Date.now(),
      title: "Task from Announcement",
      subject: '',
      date: new Date().toISOString().split('T')[0],
      time: '11:59 PM',
      priority: 'Medium'
    });
  }

  // Remove exact duplicates
  const uniqueTasks = [];
  const titles = new Set();
  for (const t of tasks) {
    if (!titles.has(t.title)) {
      titles.add(t.title);
      uniqueTasks.push(t);
    }
  }

  return uniqueTasks;
};

/**
 * Main entry point for extraction. Handles both raw text and Image files (File object).
 */
export const extractTasksFromInput = async (data, onProgress = () => {}) => {
  if (data.type === 'text') {
    onProgress("Analyzing text structure...");
    // Simulate slight delay so it doesn't feel instantaneous
    await new Promise(r => setTimeout(r, 1000));
    return parseTextForTasks(data.content);
  } 
  
  if (data.type === 'file' && data.file) {
    try {
      onProgress("Initializing AI Vision Engine (OCR)...");
      const result = await Tesseract.recognize(
        data.file,
        'eng',
        { logger: m => {
          if (m.status === 'recognizing text') {
            onProgress(`Reading image content: ${Math.round(m.progress * 100)}%`);
          }
        }}
      );
      
      onProgress("Applying extraction logic to found text...");
      const extractedText = result.data.text;
      console.log("OCR Result:", extractedText);
      
      return parseTextForTasks(extractedText);
    } catch (err) {
      console.error("OCR Error:", err);
      // Fallback
      return parseTextForTasks("Failed to read image. Emergency fallback fallback task.");
    }
  }

  return [];
};
