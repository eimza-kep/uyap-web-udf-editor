const assert = require("assert");
const fs = require("fs");
const path = require("path");

console.log("Running UYAP Web UDF Editor tests...");

// 1. Verify key files exist and are non-empty
const requiredFiles = [
    "index.html",
    "css/editor.css",
    "js/editor-ui.js",
    "js/udf-generator.js",
    "js/udf-parser.js",
    "js/templates.js",
    "js/jszip.min.js",
    "js/udf-markdown.js"
];

for (const f of requiredFiles) {
    const fullPath = path.join(__dirname, "..", f);
    assert(fs.existsSync(fullPath), `Missing required file: ${f}`);
    const size = fs.statSync(fullPath).size;
    assert(size > 100, `File ${f} is too small (${size} bytes)`);
}

// 2. Verify index.html contains modern Phosphor icons, CDN scripts, and new controls
const indexHtml = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf-8");
assert(indexHtml.includes("phosphor-icons"), "Phosphor icons must be included");
assert(indexHtml.includes("mammoth"), "Mammoth DOCX support must be included");
assert(indexHtml.includes("pdfjsLib"), "PDF.js support must be included");
assert(indexHtml.includes("Tesseract"), "Tesseract.js OCR support must be included");
assert(indexHtml.includes("btnToggleTheme"), "Dark mode toggle button must be included in index.html");
assert(indexHtml.includes("btnExportMd"), "Markdown export button must be included in index.html");
assert(indexHtml.includes("btnExportRagJson"), "RAG JSON export button must be included in index.html");
assert(indexHtml.includes("udf-markdown.js"), "udf-markdown.js script must be referenced in index.html");

// 3. Verify Dark Mode CSS variables and rules in editor.css
const editorCss = fs.readFileSync(path.join(__dirname, "..", "css", "editor.css"), "utf-8");
assert(editorCss.includes('data-theme="dark"'), "Dark mode data-theme selector must exist in editor.css");
assert(editorCss.includes('dark-mode'), "Dark mode body class selector must exist in editor.css");
assert(editorCss.includes('--bg-page-area: #0f172a'), "Dark mode page background area must be defined");

// 4. Test UdfMarkdown unit converter functions
const UdfMarkdown = require("../js/udf-markdown.js");
assert(typeof UdfMarkdown.htmlToMarkdown === "function", "htmlToMarkdown function must be exported");
assert(typeof UdfMarkdown.htmlToRagJson === "function", "htmlToRagJson function must be exported");

// 4.1 Test HTML to Markdown conversion
const sampleHtml = `
<h1>İSTANBUL 1. ASLİYE HUKUK MAHKEMESİNE</h1>
<p><b>DAVACI:</b> Ahmet Yılmaz</p>
<p><i>VEKİLİ:</i> Av. Mehmet Demir</p>
<h2>DAVA KONUSU</h2>
<p>Tazminat ve alacak talebi hakkındadır.</p>
<table>
    <tr><th>Talep Kalemi</th><th>Miktar</th></tr>
    <tr><td>Maddi Tazminat</td><td>100.000 TL</td></tr>
</table>
<ul>
    <li>Delil 1: Banka dekontu</li>
    <li>Delil 2: Fatura fotokopisi</li>
</ul>
`;

const mdResult = UdfMarkdown.htmlToMarkdown(sampleHtml);
assert(mdResult.includes("# İSTANBUL 1. ASLİYE HUKUK MAHKEMESİNE"), "H1 heading must be converted to markdown #");
assert(mdResult.includes("**DAVACI:** Ahmet Yılmaz"), "Bold tag must be converted to **...**");
assert(mdResult.includes("*VEKİLİ:* Av. Mehmet Demir"), "Italic tag must be converted to *...*");
assert(mdResult.includes("## DAVA KONUSU"), "H2 heading must be converted to markdown ##");
assert(mdResult.includes("| Talep Kalemi | Miktar |"), "Table header must be converted to markdown table");
assert(mdResult.includes("| Maddi Tazminat | 100.000 TL |"), "Table cells must be converted to markdown table");
assert(mdResult.includes("- Delil 1: Banka dekontu"), "List item must be converted to markdown bullet");

// 4.2 Test HTML to RAG JSON conversion
const ragResult = UdfMarkdown.htmlToRagJson(sampleHtml, "Dava_Dilekcesi_Ahmet");
assert.strictEqual(ragResult.title, "Dava_Dilekcesi_Ahmet", "RAG JSON title must match input");
assert.strictEqual(ragResult.schemaVersion, "1.0-rag", "RAG JSON schemaVersion must be 1.0-rag");
assert(ragResult.metadata.wordCount > 5, "Word count must be computed");
assert(ragResult.metadata.charCount > 20, "Char count must be computed");
assert(Array.isArray(ragResult.sections), "Sections must be an array");
assert(ragResult.sections.length >= 2, "Sections must parse multiple headings");
assert(ragResult.markdown.length > 0, "Markdown field must be populated in RAG JSON");

console.log("All UYAP Web UDF Editor tests (including Dark Mode & Markdown/RAG exports) passed successfully!");
