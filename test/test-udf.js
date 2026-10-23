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
    "js/udf-markdown.js",
    "js/udf-signer.js"
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

// E-İmza (Issue #1) arayüz kontrolleri
assert(indexHtml.includes("btnSignUdf"), "E-İmza butonu (btnSignUdf) index.html içinde bulunmalıdır");
assert(indexHtml.includes("signModal"), "E-İmza modal penceresi (signModal) index.html içinde bulunmalıdır");
assert(indexHtml.includes("signedDocBanner"), "İmzalı belge üst bilgi çubuğu (signedDocBanner) index.html içinde bulunmalıdır");
assert(indexHtml.includes("udf-signer.js"), "udf-signer.js komut dosyası index.html içinde referans verilmelidir");

// 3. Verify CSS variables and rules in editor.css
const editorCss = fs.readFileSync(path.join(__dirname, "..", "css", "editor.css"), "utf-8");
assert(editorCss.includes('data-theme="dark"'), "Dark mode data-theme selector must exist in editor.css");
assert(editorCss.includes('dark-mode'), "Dark mode body class selector must exist in editor.css");
assert(editorCss.includes('--bg-page-area: #0f172a'), "Dark mode page background area must be defined");
assert(editorCss.includes('.action-btn.eimza'), "E-İmza butonu için .action-btn.eimza stili tanımlanmalıdır");
assert(editorCss.includes('.signed-doc-banner'), "İmzalı belge bandı için .signed-doc-banner stili tanımlanmalıdır");
assert(editorCss.includes('.signer-agent-box'), "Ajan durum kutusu için .signer-agent-box stili tanımlanmalıdır");

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

// 5. Test UdfSigner (Issue #1 - CAdES-BES & XML-DSIG E-İmza Desteği)
const UdfSigner = require("../js/udf-signer.js");
const JSZip = require("../js/jszip.min.js");

async function runSignerTests() {
    console.log("Running UdfSigner unit and integration tests...");

    // 5.1 ESHS Sertifika Sağlayıcıları listesi
    assert(UdfSigner.CERT_PROVIDERS.KAMU_SM, "Kamu SM sertifika sağlayıcısı tanımlı olmalı");
    assert(UdfSigner.CERT_PROVIDERS.TURKTRUST, "TÜRKTRUST sertifika sağlayıcısı tanımlı olmalı");
    assert(UdfSigner.CERT_PROVIDERS.E_GUVEN, "E-Güven sertifika sağlayıcısı tanımlı olmalı");
    assert(UdfSigner.CERT_PROVIDERS.E_TUGRA, "E-Tuğra sertifika sağlayıcısı tanımlı olmalı");
    assert(UdfSigner.CERT_PROVIDERS.TNB_KEP, "TNBE-İmza sertifika sağlayıcısı tanımlı olmalı");

    // 5.2 Varsayılan imzalayan bilgisi üretimi
    const defaultSigner = UdfSigner.createDefaultSignerInfo({ name: "Av. Zeynep Kaya", tcNo: "98765432101" });
    assert.strictEqual(defaultSigner.name, "Av. Zeynep Kaya");
    assert.strictEqual(defaultSigner.tcNo, "98765432101");
    assert(defaultSigner.serialNumber.startsWith("TR"), "Seri numarası TR ile başlamalı");
    assert(defaultSigner.date.includes("T"), "Tarih ISO benzeri biçimde olmalı");

    // 5.3 XML içine <signers> düğümü ekleme
    const dummyXml = '<?xml version="1.0" encoding="UTF-8"?>\n<template format_id="1.8">\n  <elements>\n    <paragraph><content>Dilekçe Metni</content></paragraph>\n  </elements>\n</template>';
    const signedXml = UdfSigner.embedSignerIntoContentXml(dummyXml, {
        name: "Av. Selim Şahin",
        role: "Vekil",
        tcNo: "11223344556",
        baroSicil: "Ank-55123",
        issuer: UdfSigner.CERT_PROVIDERS.TURKTRUST.name
    });

    assert(signedXml.includes("<signers>"), "<signers> bloku XML'e eklenmeli");
    assert(signedXml.includes('name="Av. Selim Şahin"'), "İmzalayan adı signer etiketinde yer almalı");
    assert(signedXml.includes('tcNo="11223344556"'), "T.C. Kimlik No signer etiketinde yer almalı");
    assert(signedXml.includes('baroSicil="Ank-55123"'), "Baro Sicil No signer etiketinde yer almalı");
    assert(signedXml.includes(UdfSigner.CERT_PROVIDERS.TURKTRUST.name), "ESHS sağlayıcı adı signer etiketinde yer almalı");
    assert(signedXml.includes("</template>"), "Template kapanış etiketi korunmalı");

    // 5.4 XML-DSIG / CAdES signature.xml üretimi
    const sigEnvelope = UdfSigner.createSignatureXml(signedXml, {
        name: "Av. Selim Şahin",
        tcNo: "11223344556",
        serialNumber: "TR1234567890"
    });

    assert(sigEnvelope.signatureXml.includes('<Signature xmlns="http://www.w3.org/2000/09/xmldsig#"'), "XML-DSIG kök etiketi bulunmalı");
    assert(sigEnvelope.signatureXml.includes('<DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>'), "SHA-256 DigestMethod bulunmalı");
    assert(sigEnvelope.signatureXml.includes("<DigestValue>"), "DigestValue etiketi bulunmalı");
    assert(sigEnvelope.signatureXml.includes("<SignatureValue>"), "SignatureValue etiketi bulunmalı");
    assert(sigEnvelope.signatureXml.includes("<X509Certificate>"), "X509Certificate etiketi bulunmalı");
    assert(sigEnvelope.signatureXml.includes("2.16.792.1.2.1.1.5.7.1.1"), "BTK Nitelikli Sertifika OID bulunmalı");
    assert(sigEnvelope.digestHex.length === 64, "SHA-256 özeti 64 hex karakter uzunluğunda olmalı");

    // 5.5 İmzalı UDF ZIP Paketi Oluşturma
    const zipPackageBuffer = await UdfSigner.createSignedUdfPackage(dummyXml, {
        name: "Av. Deniz Aydın",
        role: "Vekil / Avukat",
        tcNo: "55443322110",
        baroSicil: "İzmir-12984",
        issuer: UdfSigner.CERT_PROVIDERS.E_GUVEN.name
    }, JSZip);

    assert(zipPackageBuffer, "ZIP paketi oluşturulmalı");
    assert(zipPackageBuffer.length > 500, `ZIP paketi boyutu yeterli olmalı (${zipPackageBuffer.length} bytes)`);

    // 5.6 UDF İmza Doğrulama (verifyUdfSignature)
    const verification = await UdfSigner.verifyUdfSignature(zipPackageBuffer, JSZip);
    assert.strictEqual(verification.isSigned, true, "Paket imzalı olarak doğrulanmalı");
    assert.strictEqual(verification.hasSignatureXml, true, "signature.xml mevcut olmalı");
    assert.strictEqual(verification.signers.length, 1, "1 adet imzalayan bulunmalı");
    assert.strictEqual(verification.signers[0].name, "Av. Deniz Aydın", "İmzalayan adı doğru ayrıştırılmalı");
    assert.strictEqual(verification.signers[0].tcNo, "55443322110", "T.C. Kimlik No doğru ayrıştırılmalı");
    assert.strictEqual(verification.signers[0].baroSicil, "İzmir-12984", "Baro Sicil doğru ayrıştırılmalı");
    assert.strictEqual(verification.signers[0].issuer, UdfSigner.CERT_PROVIDERS.E_GUVEN.name, "ESHS sağlayıcı doğru ayrıştırılmalı");
    assert(verification.summary.includes("Av. Deniz Aydın"), "Doğrulama özeti imzalayan adını içermeli");

    // 5.7 İmzasız UDF Paketi ile Doğrulama Testi
    const unsignedZip = new JSZip();
    unsignedZip.file("content.xml", dummyXml);
    const unsignedBuffer = await unsignedZip.generateAsync({ type: "nodebuffer" });
    const unsignedVerification = await UdfSigner.verifyUdfSignature(unsignedBuffer, JSZip);
    assert.strictEqual(unsignedVerification.isSigned, false, "İmzasız paket isSigned=false dönmeli");
    assert.strictEqual(unsignedVerification.signers.length, 0, "İmzasız pakette signer listesi boş olmalı");

    // 5.8 Ajan Yoklama (probeLocalhostAgent) Testi
    const probe = await UdfSigner.probeLocalhostAgent(300);
    assert(typeof probe === "object", "Probe nesnesi dönmeli");
    assert("detected" in probe, "Probe nesnesinde detected alanı olmalı");
    assert("message" in probe, "Probe nesnesinde message alanı olmalı");

    console.log("All UdfSigner tests passed successfully!");
}

runSignerTests().then(() => {
    console.log("All UYAP Web UDF Editor tests (including Dark Mode, Markdown/RAG, and E-İmza) passed successfully!");
}).catch(err => {
    console.error("Test failed:", err);
    process.exit(1);
});
