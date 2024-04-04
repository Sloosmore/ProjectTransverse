const supabase = require("../../../db/supabase");
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
  } catch (error) {
    console.error("Error in recording diagram to DB:", error);
    return false;
  }
  return true;
};

async function mermaid2SVG(mermaidContent) {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
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

  await page.waitForSelector(".mermaid svg");

  const svg = await page.$eval(".mermaid svg", (element) => element.outerHTML);

  await browser.close();

  return svg;
}

const svg2PNG = async (svg) => {
  try {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(svg, { waitUntil: ["load", "domcontentloaded"] });
    const dimensions = await page.evaluate(() => {
      const svgElement = document.querySelector("svg");
      return {
        width: svgElement.clientWidth,
        height: svgElement.clientHeight,
      };
    });

    await page.setViewport({
      width: dimensions.width,
      height: dimensions.height,
      deviceScaleFactor: 2,
    });
    const pngBuffer = await page.screenshot({ type: "png" });
    await browser.close();
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
