import Tesseract from 'tesseract.js';

const toLocalISOString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Extracts academic tasks from raw text using regex heuristics.
 */
const parseTextForTasks = (text) => {
  const tasks = [];
  
  // Normalize text to make parsing easier
  const normalizedText = text.replace(/\n/g, ' ');

  // 1. Look for common task identifiers to split the text into chunks or identify sentences
  // e.g. "Quiz 1 is on...", "Submit your assignment by..."
  const taskKeywords = /(quiz|exam|assignment|project|submission|submit|homework|midterm|finals|activity|module)/gi;
  
  // Make sure to not capture months or common non-subject words as subjects
  const invalidSubjectWords = "JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC|JANUARY|FEBRUARY|MARCH|APRIL|JUNE|JULY|AUGUST|SEPTEMBER|OCTOBER|NOVEMBER|DECEMBER|MONDAY|TUESDAY|WEDNESDAY|THURSDAY|FRIDAY|SATURDAY|SUNDAY|TODAY|TOMORROW|EXAM|EXAMS|QUIZ|TASK|TEST|PRELIM|MIDTERM|FINALS|THE|AND|FOR|WITH|THIS";
  const subjectRegex = new RegExp(`\\b(?!(?:${invalidSubjectWords})\\b)([A-Z]{2,6}(?:\\s?\\d{1,4}[A-Z]?(?!\\s*:))?)\\b`, 'gi');
  
  // 2. Look for subjects: word boundary + 2-5 uppercase letters, optional space, 1-3 numbers
  // This is now replaced by the constructed subjectRegex above
  
  // 3. Look for dates: Oct 25, 10/25/2024, tomorrow, next week, days of the week, or Month DD, YYYY
  const dateRegex = /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s\d{1,2}(st|nd|rd|th)?(,\s?\d{4}|\s\d{4})?|\d{1,2}\/\d{1,2}(\/\d{2,4})?|tomorrow|next week|today|monday|tuesday|wednesday|thursday|friday|saturday|sunday/gi;
  
  // 4. Look for times: 11:59 PM, 23:59, 5 PM
  const timeRegex = /(?:\b\d{1,2}:\d{2}(?:\s?[aApP][mM])?\b)|(?:\b\d{1,2}\s?[aApP][mM]\b)/g;

  // Let's try splitting the text into sentences to isolate tasks
  // We use newline and punctuation to split
  const sentences = text.split(/(?<=[.!?\n])\s+/);

  let lastSeenDate = toLocalISOString(new Date()); // Default today

  sentences.forEach((sentence, index) => {
    // If the sentence mentions a task keyword OR a date OR a time, we might have a task
    const keywordMatch = sentence.match(taskKeywords);
    const dateMatch = sentence.match(dateRegex);
    const timeMatch = sentence.match(timeRegex);
    
    // Update lastSeenDate if a date is found in this sentence
    if (dateMatch) {
      const rawDate = dateMatch[0].toLowerCase();
      if (rawDate.includes('tomorrow')) {
        const tmrw = new Date();
        tmrw.setDate(tmrw.getDate() + 1);
        lastSeenDate = toLocalISOString(tmrw);
      } else if (rawDate.includes('next week')) {
        const nextWk = new Date();
        nextWk.setDate(nextWk.getDate() + 7);
        lastSeenDate = toLocalISOString(nextWk);
      } else if (rawDate.includes('today')) {
        lastSeenDate = toLocalISOString(new Date());
      } else if (['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].some(d => rawDate.includes(d))) {
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const targetDay = days.findIndex(d => rawDate.includes(d));
        if (targetDay !== -1) {
          const d = new Date();
          const currentDay = d.getDay();
          let distance = targetDay - currentDay;
          if (distance <= 0) distance += 7; 
          d.setDate(d.getDate() + distance);
          lastSeenDate = toLocalISOString(d);
        }
      } else {
        // Handle explicit dates. Remove potential trailing time/extra strings, append year if missing.
        let dateStrForParse = dateMatch[0];
        if (!/\d{4}/.test(dateStrForParse)) {
            dateStrForParse += `, ${new Date().getFullYear()}`;
        }
        const parsed = new Date(dateStrForParse);
        if (!isNaN(parsed.getTime())) {
          lastSeenDate = toLocalISOString(parsed);
        }
      }
    }

    if (keywordMatch || timeMatch || (dateMatch && sentence.trim().length > dateMatch[0].length)) {
      // Find subject specifically in this sentence, or fallback to looking in the whole text
      let subjectCandidate = null;
      let sMatch = subjectRegex.exec(sentence);
      if (sMatch) subjectCandidate = sMatch[0];
      else {
         // Reset lastIndex for global regex
         subjectRegex.lastIndex = 0;
         sMatch = subjectRegex.exec(text);
         if (sMatch) subjectCandidate = sMatch[0];
      }
      
      // Reset regex state since we use 'g'
      subjectRegex.lastIndex = 0;

      // Extract subject using a fallback if purely using regex fails:
      // If there's a time on the line, assume preceding alphanumeric characters could refer to the subject.
      let finalSubject = subjectCandidate ? subjectCandidate.toUpperCase() : '';
      if (!finalSubject && timeMatch) {
          const textBeforeTime = sentence.split(timeMatch[0])[0].trim();
          let cleaned = textBeforeTime.replace(dateRegex, '').replace(taskKeywords, '').replace(/[^\w\s()-]/g, '').trim();
          if (cleaned.length > 0 && cleaned.length < 20) {
             finalSubject = cleaned;
          }
      }

      // Guess the title intelligently
      let title = "Extracted Task";
      if (keywordMatch) {
        const keyword = keywordMatch[0].toLowerCase();
        
        if (keyword === 'activity' || keyword === 'submission' || keyword === 'submit' || keyword === 'module') {
           title = `Pending ${keyword.charAt(0).toUpperCase() + keyword.slice(1)}`;
        } else if (keyword === 'exam' || keyword === 'quiz' || keyword === 'midterm' || keyword === 'finals') {
           title = `Upcoming ${keyword.charAt(0).toUpperCase() + keyword.slice(1)}`;
        } else {
           title = `${keyword.charAt(0).toUpperCase() + keyword.slice(1)} Task`;
        }
      } else if (dateMatch && !timeMatch && !finalSubject) {
        // Just a date line, maybe skip or just use as context. 
        // We updated lastSeenDate, so we can possibly skip creating an empty task here.
        return;
      } else {
        title = "Scheduled Deadline";
      }

      // Use the accumulated lastSeenDate
      let formattedDate = lastSeenDate;

      // Guess Priority based on keyword
      let priority = 'Medium';
      const lowCaseSentence = sentence.toLowerCase();
      if (lowCaseSentence.includes('exam') || lowCaseSentence.includes('final') || lowCaseSentence.includes('project')) {
        priority = 'High';
      } else if (lowCaseSentence.includes('reading') || lowCaseSentence.includes('review')) {
        priority = 'Low';
      }

      // Format time intelligently (extract start time instead of end time for ranges)
      let finalTime = '11:59 PM';
      if (timeMatch) {
        finalTime = timeMatch[0].toUpperCase();
        if (!finalTime.includes('AM') && !finalTime.includes('PM') && timeMatch.length > 1) {
          const secondTime = timeMatch[1].toUpperCase();
          if (secondTime.includes('AM')) finalTime += ' AM';
          else if (secondTime.includes('PM')) finalTime += ' PM';
        }
      }

      tasks.push({
        id: Date.now() + Math.random(),
        title: title.trim(),
        subject: finalSubject,
        date: formattedDate,
        time: finalTime,
        priority: priority
      });
    }
  });

  // Remove exact duplicates instead of title-only duplicates
  const uniqueTasks = [];
  const signatures = new Set();
  for (const t of tasks) {
    const sig = `${t.title}-${t.subject}-${t.date}-${t.time}`;
    if (!signatures.has(sig)) {
      signatures.add(sig);
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
