function h2TagThreashold(markdownString) {
  const regex = /##(?!#)/g;
  const matches = markdownString.match(regex);
  return matches && matches.length >= 2;
}

function splitMarkdownAtHeadings(mdString) {
  // Regular expression to find '##' that are not followed by another '#'
  const regex = /##(?!#)/g;

  // Find all matches along with their indices
  let matches = [];
  mdString.replace(regex, (match, offset) => {
    matches.push(offset);
    return match;
  });

  // If we have less than 2 '##', return the entire string in the first part, and an empty string in the second
  if (matches.length < 2) {
    return [mdString, ""];
  }

  // Split the string based on the found indices
  const firstPart = mdString.substring(0, matches[1]);
  const secondPart = mdString.substring(matches[1]);

  return { completeSection: firstPart, newSection: secondPart };
}

function splitTranscript(isoDate, inputString) {
  // Escape special characters in the date string for regex use
  const escapedDate = isoDate.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // Regular expression for the specified ISO date
  const datePattern = new RegExp(escapedDate, "g");

  // Find the first occurrence of the date pattern
  const match = datePattern.exec(inputString);

  // If the date is not found, return an empty string
  if (!match) {
    return "";
  }

  // Get the index of the match
  const matchIndex = match.index;

  // Return the part of the string from the date onward
  return inputString.substring(matchIndex);
}

function findLastIsoDateTime(inputString) {
  // Regular expression for ISO 8601 date-time format
  const regex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/g;

  // Find all matches
  const matches = inputString.match(regex);

  // Check if any matches were found
  if (matches && matches.length > 0) {
    // Return the last match
    return matches[matches.length - 1];
  } else {
    // Return null or an empty string if no match is found
    return null;
  }
}

function removeDateTimes(text) {
  return text
    .replace(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/g, "")
    .trim();
}

function subtractString(mainString, subString) {
  if (typeof mainString !== "string" || typeof subString !== "string") {
    throw new Error("Both arguments must be strings.");
  }
  if (subString === "") {
    return mainString;
  }
  // Find the last occurrence of subString in mainString
  const lastIndex = mainString.lastIndexOf(subString);

  // If subString is not found, return the original string
  if (lastIndex === -1) {
    return mainString;
  }

  // Remove everything up to and including the last occurrence of subString
  return mainString.substring(lastIndex + subString.length);
}

module.exports = {
  h2TagThreashold,
  splitMarkdownAtHeadings,
  splitTranscript,
  findLastIsoDateTime,
  removeDateTimes,
  subtractString,
};

//Local LLM code
/* 

const apiUrl = "http://localhost:1234/v1/chat/completions";

let systemPrompt = `Your task is to process a transcript of a spoken lecture and convert it into structured notes in Markdown format. The transcript is timestamped and covers various topics, specifically focusing on AI. Here are your specific instructions:

Continuous Analysis: As you receive the transcript, continuously analyze the content. Pay attention to changes in topics or subjects.

Markdown Formatting: Use Markdown for the notes. Each new topic identified in the lecture should start with a heading formatted as ## Topic Title.

Timestamp Inclusion: Right after each new topic heading, include the timestamp from the transcript indicating when this topic started. Format it as <2024-01-10T00:00:00.000Z>. Ensure this timestamp accurately reflects the point in the lecture where the new topic begins.

Topic-Based Sections: Create sections based on the topics discussed. Each section should contain a concise summary of the key points covered in that part of the lecture. Your summaries should be informative but not overly detailed, capturing the essence of the discussion.

Handling Ambiguities: If you're unsure about when a new topic starts, wait until you have more information to confirm the transition. Only create a new section when you're confident a topic shift has occurred.

Content Summarization: Within each section, provide a summarized version of the lecture content related to that topic. Avoid verbatim transcription; focus on distilling the main ideas and relevant details.

Your goal is to create a clear, well-organized set of notes that accurately reflects the lecture's content and structure, making it easy for someone to understand the main points and topics covered. `;

let conversationHistory = [{ role: "system", content: systemPrompt }];

async function queryAI(message) {
  // Add the new user message to the conversation history
  conversationHistory.push({ role: "user", content: message });

  // Prepare the request body with the updated conversation history
  const requestBody = {
    model: "local-model", // this field is currently unused
    messages: conversationHistory,
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Authorization': 'Bearer YOUR_API_KEY' // Not needed for local queries
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message;

    // Add the AI response to the conversation history
    conversationHistory.push({ role: "assistant", content: aiResponse });

    console.log(aiResponse); // Log the AI response
    return aiResponse;
  } catch (error) {
    console.error("Error querying AI model: ", error);
  }
}

*/
