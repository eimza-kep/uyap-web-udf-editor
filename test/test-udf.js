const assert = require("assert");
const fs = require("fs");
const path = require("path");

console.log("Running UYAP Web UDF Editor tests...");

// Verify key files exist and are non-empty
const requiredFiles = [
    "index.html",
    "css/editor.css",
    "js/editor-ui.js",
    "js/udf-generator.js",
    "js/udf-parser.js",
    "js/templates.js",
    "js/jszip.min.js"
];

for (const f of requiredFiles) {
    const fullPath = path.join(__dirname, "..", f);
    assert(fs.existsSync(fullPath), `Missing required file: ${f}`);
    const size = fs.statSync(fullPath).size;
    assert(size > 100, `File ${f} is too small (${size} bytes)`);
}

// Verify index.html contains modern Phosphor icons and CDN scripts
const indexHtml = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf-8");
assert(indexHtml.includes("phosphor-icons"), "Phosphor icons must be included");
assert(indexHtml.includes("mammoth"), "Mammoth DOCX support must be included");
assert(indexHtml.includes("pdfjsLib"), "PDF.js support must be included");
assert(indexHtml.includes("Tesseract"), "Tesseract.js OCR support must be included");

console.log("All UYAP Editor assets and integrations verified successfully!");
