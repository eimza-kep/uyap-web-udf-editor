/**
 * UDF (UYAP Doküman Formatı) Generator & Exporter
 * HTML editör içeriğini resmi UYAP UDF (ZIP + XML) formatına dönüştürür.
 */

window.UdfGenerator = {
    /**
     * Editördeki HTML içeriğini UYAP UDF Blob dosyasına dönüştürür
     * @param {HTMLElement|string} editorElementOrHtml - Editör içeriği
     * @returns {Promise<Blob>}
     */
    async generateUdfBlob(editorElementOrHtml) {
        const xmlContent = this.htmlToUdfXml(editorElementOrHtml);

        const zip = new JSZip();
        // UYAP standardı: content.xml
        zip.file("content.xml", xmlContent);

        // ZIP blobu oluştur
        const blob = await zip.generateAsync({
            type: "blob",
            compression: "DEFLATE",
            compressionOptions: { level: 6 }
        });

        return blob;
    },

    /**
     * UDF dosyasını kullanıcının cihazına indirir
     * @param {Blob} blob - UDF blob verisi
     * @param {string} filename - Dosya adı
     */
    downloadUdf(blob, filename = "belge.udf") {
        if (!filename.endsWith(".udf")) {
            filename += ".udf";
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 2000);
    },

    /**
     * HTML içeriğini UYAP uyumlu content.xml metnine dönüştürür
     */
    htmlToUdfXml(editorElementOrHtml) {
        let container;
        if (typeof editorElementOrHtml === "string") {
            container = document.createElement("div");
            container.innerHTML = editorElementOrHtml;
        } else {
            container = editorElementOrHtml.cloneNode(true);
        }

        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<template format_id="1.8">\n';
        xml += '  <properties>\n';
        xml += '    <pageFormat mediaSizeName="1" leftMargin="70.86" rightMargin="70.86" topMargin="70.86" bottomMargin="70.86" paperOrientation="1" headerMargin="35.43" footerMargin="35.43"/>\n';
        xml += '  </properties>\n';
        xml += '  <elements>\n';

        // Blok seviyesindeki öğeleri sırayla işle
        const childNodes = container.childNodes;
        if (childNodes.length === 0) {
            xml += '    <paragraph alignment="3">\n';
            xml += '      <content fontName="Times New Roman" fontSize="12" bold="false" italic="false" underline="false"></content>\n';
            xml += '    </paragraph>\n';
        } else {
            for (let node of childNodes) {
                xml += this.processNodeToXml(node);
            }
        }

        xml += '  </elements>\n';
        xml += '</template>';
        return xml;
    },

    /**
     * DOM düğümünü UYAP XML'e dönüştürür
     */
    processNodeToXml(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent.trim();
            if (!text) return "";
            return `    <paragraph alignment="3">\n      <content fontName="Times New Roman" fontSize="12" bold="false" italic="false" underline="false">${this.escapeXml(text)}</content>\n    </paragraph>\n`;
        }

        if (node.nodeType !== Node.ELEMENT_NODE) return "";

        const tagName = node.tagName.toLowerCase();

        // Paragraf veya başlıklar
        if (tagName === "p" || tagName === "div" || tagName.startsWith("h")) {
            let alignment = "3"; // varsayılan justify
            const textAlign = node.style.textAlign || "";
            if (textAlign === "left") alignment = "0";
            else if (textAlign === "right") alignment = "1";
            else if (textAlign === "center") alignment = "2";
            else if (textAlign === "justify") alignment = "3";

            // Başlıklar için varsayılan boyut ve kalınlık
            let defaultSize = "12";
            let defaultBold = "false";
            if (tagName === "h1") { defaultSize = "16"; defaultBold = "true"; }
            if (tagName === "h2") { defaultSize = "14"; defaultBold = "true"; }
            if (tagName === "h3") { defaultSize = "13"; defaultBold = "true"; }

            let pXml = `    <paragraph alignment="${alignment}">\n`;
            
            // Eğer paragraf boşsa
            if (!node.textContent && (node.innerHTML === "<br>" || !node.innerHTML)) {
                pXml += `      <content fontName="Times New Roman" fontSize="${defaultSize}" bold="${defaultBold}" italic="false" underline="false"></content>\n`;
            } else {
                pXml += this.extractContentsFromElement(node, {
                    fontName: "Times New Roman",
                    fontSize: defaultSize,
                    bold: defaultBold === "true",
                    italic: false,
                    underline: false
                });
            }

            pXml += '    </paragraph>\n';
            return pXml;
        }

        // Tablo
        if (tagName === "table") {
            let tXml = '    <table>\n';
            const rows = node.querySelectorAll("tr");
            rows.forEach(tr => {
                tXml += '      <row>\n';
                const cells = tr.querySelectorAll("td, th");
                cells.forEach(td => {
                    tXml += '        <cell>\n';
                    const cellPs = td.querySelectorAll("p");
                    if (cellPs.length > 0) {
                        cellPs.forEach(p => {
                            tXml += this.processNodeToXml(p);
                        });
                    } else {
                        tXml += `          <paragraph alignment="0">\n            <content fontName="Times New Roman" fontSize="11" bold="false" italic="false" underline="false">${this.escapeXml(td.textContent.trim())}</content>\n          </paragraph>\n`;
                    }
                    tXml += '        </cell>\n';
                });
                tXml += '      </row>\n';
            });
            tXml += '    </table>\n';
            return tXml;
        }

        // Listeler (ul / ol)
        if (tagName === "ul" || tagName === "ol") {
            let listXml = "";
            const items = node.querySelectorAll("li");
            let idx = 1;
            items.forEach(li => {
                const prefix = tagName === "ol" ? `${idx++}. ` : "• ";
                listXml += `    <paragraph alignment="3">\n`;
                listXml += `      <content fontName="Times New Roman" fontSize="12" bold="false" italic="false" underline="false">${prefix}${this.escapeXml(li.textContent.trim())}</content>\n`;
                listXml += `    </paragraph>\n`;
            });
            return listXml;
        }

        // Diğer elemanlar için içeriği al
        return `    <paragraph alignment="3">\n      <content fontName="Times New Roman" fontSize="12" bold="false" italic="false" underline="false">${this.escapeXml(node.textContent.trim())}</content>\n    </paragraph>\n`;
    },

    /**
     * Paragraf altındaki inline düğümleri stil özellikleriyle tarar
     */
    extractContentsFromElement(element, currentStyle) {
        let result = "";

        for (let child of element.childNodes) {
            if (child.nodeType === Node.TEXT_NODE) {
                const text = child.textContent;
                if (!text) continue;
                result += `      <content fontName="${currentStyle.fontName}" fontSize="${currentStyle.fontSize}" bold="${currentStyle.bold}" italic="${currentStyle.italic}" underline="${currentStyle.underline}">${this.escapeXml(text)}</content>\n`;
            } else if (child.nodeType === Node.ELEMENT_NODE) {
                const tag = child.tagName.toLowerCase();
                const newStyle = { ...currentStyle };

                if (tag === "strong" || tag === "b") newStyle.bold = true;
                if (tag === "em" || tag === "i") newStyle.italic = true;
                if (tag === "u") newStyle.underline = true;

                // Inline styles
                if (child.style.fontWeight === "bold" || parseInt(child.style.fontWeight, 10) >= 600) newStyle.bold = true;
                if (child.style.fontStyle === "italic") newStyle.italic = true;
                if (child.style.textDecoration && child.style.textDecoration.includes("underline")) newStyle.underline = true;
                if (child.style.fontFamily) {
                    const cleanFont = child.style.fontFamily.replace(/['"]/g, "").split(",")[0].trim();
                    if (cleanFont) newStyle.fontName = cleanFont;
                }
                if (child.style.fontSize) {
                    const match = child.style.fontSize.match(/(\d+)/);
                    if (match) newStyle.fontSize = match[1];
                }

                if (tag === "br") {
                    result += `      <content fontName="${newStyle.fontName}" fontSize="${newStyle.fontSize}" bold="${newStyle.bold}" italic="${newStyle.italic}" underline="${newStyle.underline}">\n</content>\n`;
                } else {
                    result += this.extractContentsFromElement(child, newStyle);
                }
            }
        }

        if (!result) {
            result = `      <content fontName="Times New Roman" fontSize="12" bold="false" italic="false" underline="false">${this.escapeXml(element.textContent.trim())}</content>\n`;
        }

        return result;
    },

    escapeXml(text) {
        if (!text) return "";
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&apos;");
    }
};
