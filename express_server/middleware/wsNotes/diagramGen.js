const supabase = require("../../db/supabase");
const sharp = require("sharp");
const puppeteer = require("puppeteer");

const diagramRecord2DB = async (note_id, diagram_id, file_path, mermaid_MD) => {
  try {
    const { data: record, error: insertError } = await supabase
      .from("diagram")
      .insert({
        note_id,
        diagram_id,
        file_path,
        mermaid_content: mermaid_MD,
      })
      .select();
  } catch {
    console.error("Error in Turning svg to png:", error);
    return false;
  }
  return true;
};

async function mermaid2SVG(mermaidContent) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(`
      <!DOCTYPE html>
      <body>
        <div class="mermaid">
          ${mermaidContent}
        </div>
        <script src="https://unpkg.com/mermaid/dist/mermaid.min.js"></script>
        <script>mermaid.initialize({startOnLoad:true});</script>
      </body>
    `);

  await page.waitForSelector(".mermaid");

  const svg = await page.$eval(".mermaid", (element) => element.innerHTML);

  await browser.close();

  return svg;
}

const svg2PNG = async (svg) => {
  try {
    const pngBuffer = await sharp(Buffer.from(svg)).toFormat("png").toBuffer();
    return pngBuffer;
  } catch (error) {
    console.error("Error in Turning svg to png:", error);
  }
};

const diagram2Storage = async (file_path, buffer) => {
  try {
    console.log("file_path", file_path);
    const { error: uploadError } = await supabase.storage
      .from("diagrams")
      .upload(file_path, buffer, {
        contentType: "image/png",
        upsert: true,
      });

    //get pulic_URLs for now
    const response = await supabase.storage
      .from("diagrams")
      .getPublicUrl(file_path);
    console.log(response);
    return response.data.publicUrl;
  } catch (error) {
    console.error("Error in Turning svg to png:", error);
  }
};

module.exports = { diagramRecord2DB, mermaid2SVG, svg2PNG, diagram2Storage };
