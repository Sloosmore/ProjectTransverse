require("dotenv").config();
const OpenAI = require("openai");

const openAIKey = process.env.OPENAI_KEY;
const openai = new OpenAI({ apiKey: openAIKey });

const markdownToGuided = async (md, pref) => {
  try {
    const guided = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You will recive notes in markdown in this style ${pref}. It is your job to turn these notes into guided notes.
            If there is any information in the prefferences use them to help in the creation of guided notes.
            Otherwise change the notes by taking this set of notes and creating skeleton notes (such as removing content from bullets and leaving blank bullets) and
            creating fill in the blanks.
            ONLY RETURN THE MARKDOWN without other comments.`,
        },
        {
          role: "user",
          content: `Here is the markdown to turn into guided notes ${md}.`,
        },
      ],
      model: "gpt-3.5-turbo-1106",
    });
    return guided.choices[0].message.content;
  } catch {
    console.error(error);
  }
};

module.exports = { markdownToGuided };
