const supabase = require("../db/supabase");
const { getUserIdFromToken } = require("../middleware/authDecodeJWS");
const OpenAI = require("openai");
const PDFParser = require("pdf2json");
const openAIKey = process.env.OPENAI_KEY;

const pdf2md = require("@opendocsg/pdf2md");

async function convertPDFtoMarkdown(pdfBuffer) {
  try {
    // Convert the PDF buffer to Markdown text
    const markdownText = await pdf2md(pdfBuffer);
    return markdownText; // Return the Markdown text
  } catch (err) {
    console.error(err);
    throw err; // Propagate the error
  }
}

const customNotePrompt = async (req, res) => {
  try {
    console.log("customNotePrompt");
    const token = req.headers.authorization.split(" ")[1];
    const user_id = getUserIdFromToken(token);

    if (!req.file) {
      console.log("No file uploaded.");
      return res.status(400).send({ message: "No file uploaded." });
    }
    console.log("req.file", req.file);

    const pdfBuffer = req.file.buffer;
    const pdfData = await convertPDFtoMarkdown(pdfBuffer);
    console.log("pdfData", pdfData);

    const openai = new OpenAI({ apiKey: openAIKey });
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Examine the provided Markdown document and generate a set of clear, directive instructions that describe how to replicate its formatting, structure, and content style. Your output should serve as a practical guide for someone to emulate the same style in a new Markdown document. Include the following in your instructions:

        Structural Format: Identify the structural elements (like headings, lists, code blocks) used in the Markdown. Then, provide explicit commands on how to replicate these structures. For example, 'Use level-two headings (##) for main topics, followed by bullet points for details.'
        
        Formatting Style: Note the specific formatting styles (bold, italics, block quotes) and give direct commands on when and how to use them. For instance, 'Emphasize key terms using bold formatting.'
        
        Content Presentation: Describe how the content is presented (concise, detailed, with examples) and instruct on replicating this approach. For example, 'For complex topics, include analogies to simplify the concept.'
        
        Tone and Writing Style: Capture the tone (formal, informal, technical) and instruct on how to maintain a similar tone. For example, 'Adopt a conversational tone for engaging readability.'
        
        Special Elements: If there are any unique elements (like tables, hyperlinks, or images), provide commands on incorporating these. For example, 'Include hyperlinks for external references.'
        
        Your output should read like a set of commands or guidelines, providing clear and specific instructions for someone to create a Markdown document that closely matches the style, structure, and content presentation of the original.

        Ignore all specail characters and symbols and don't include them in your output.
        
        The output should be in plain text format dont use markdown format like ## or ** within the string produced.
        
        Just submit the instructions without any additional commentary.
        `,
        },
        { role: "user", content: pdfData },
      ],
      model: "gpt-3.5-turbo",
    });

    const preference = completion.choices[0].message.content;

    console.log("preference", preference);

    res.status(201).json({ preference });
  } catch (error) {
    console.log(`Upload doc error: ${error}`);
    res.status(500).send({ message: "An error occurred" });
  }
};

module.exports = { customNotePrompt };
