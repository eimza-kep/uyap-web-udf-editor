/**
 * UDF (UYAP Doküman Formatı) Parser
 * %100 İstemci Taraflı (Client-side) ZIP ve XML Çözücü
 */

window.UdfParser = {
    /**
     * UDF dosyasını ayrıştırır ve zengin HTML çıktısı üretir
     * @param {File|Blob|ArrayBuffer} inputData - UDF dosya verisi
     * @returns {Promise<{html: string, plainText: string, metadata: object}>}
     */
    async parse(inputData) {
        let arrayBuffer;
        if (inputData instanceof File || inputData instanceof Blob) {
            arrayBuffer = await inputData.arrayBuffer();
        } else if (inputData instanceof ArrayBuffer) {
            arrayBuffer = inputData;
        } else {
            throw new Error("Geçersiz dosya formatı.");
        }

        let xmlText = null;

        // 1. Adım: ZIP arşivi olarak açmayı dene (Modern UDF)
        try {
            const zip = await JSZip.loadAsync(arrayBuffer);
            
            // content.xml dosyasını bul (büyük/küçük harf duyarsız)
            let contentFile = null;
            zip.forEach((relativePath, zipEntry) => {
                if (relativePath.toLowerCase() === "content.xml" || relativePath.toLowerCase().endsWith("/content.xml")) {
                    contentFile = zipEntry;
                }
            });

            if (contentFile) {
                xmlText = await contentFile.async("string");
            } else {
                // Eğer content.xml yoksa ilk .xml dosyasını ara
                zip.forEach((relativePath, zipEntry) => {
                    if (relativePath.toLowerCase().endsWith(".xml") && !contentFile) {
                        contentFile = zipEntry;
                    }
                });
                if (contentFile) {
                    xmlText = await contentFile.async("string");
                }
            }
        } catch (zipErr) {
            console.warn("ZIP olarak açılamadı, doğrudan ham XML deneniyor:", zipErr);
        }

        // 2. Adım: Eğer ZIP değilse doğrudan ham XML olarak dene (Eski tip UDF)
        if (!xmlText) {
            const decoder = new TextDecoder("utf-8");
            const rawStr = decoder.decode(arrayBuffer);
            if (rawStr.includes("<template") || rawStr.includes("<elements") || rawStr.includes("<?xml")) {
                xmlText = rawStr;
            } else {
                // Windows-1254 Türkçe kodlamasıyla dene
                try {
                    const trDecoder = new TextDecoder("windows-1254");
                    const trStr = trDecoder.decode(arrayBuffer);
                    if (trStr.includes("<template") || trStr.includes("<elements")) {
                        xmlText = trStr;
                    }
                } catch (e) {}
            }
        }

        if (!xmlText) {
            throw new Error("UDF belgesi çözülemedi. Dosya hasarlı veya desteklenmeyen bir biçimde olabilir.");
        }

        return this.parseXmlToHtml(xmlText);
    },

    /**
     * content.xml içeriğini DOMParser ile HTML'e dönüştürür
     */
    parseXmlToHtml(xmlText) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");

        const parseError = xmlDoc.querySelector("parsererror");
        if (parseError) {
            console.error("XML Parse Hatası:", parseError.textContent);
            throw new Error("UDF içindeki XML verisi ayrıştırılamadı: " + parseError.textContent);
        }

        const metadata = {
            formatId: xmlDoc.querySelector("template")?.getAttribute("format_id") || "1.8",
            pageFormat: {}
        };

        const properties = xmlDoc.querySelector("properties");
        if (properties) {
            const pageFormat = properties.querySelector("pageFormat");
            if (pageFormat) {
                metadata.pageFormat = {
                    leftMargin: pageFormat.getAttribute("leftMargin") || "70.86",
                    rightMargin: pageFormat.getAttribute("rightMargin") || "70.86",
                    topMargin: pageFormat.getAttribute("topMargin") || "70.86",
                    bottomMargin: pageFormat.getAttribute("bottomMargin") || "70.86",
                };
            }
        }

        let htmlOutput = "";
        let plainText = "";

        // Elements düğümünü bul
        const elements = xmlDoc.querySelector("elements");
        if (!elements) {
            // Eğer elements yoksa tüm paragraf düğümlerini doğrudan ara
            const paragraphs = xmlDoc.querySelectorAll("paragraph");
            if (paragraphs.length > 0) {
                paragraphs.forEach(p => {
                    const { pHtml, pText } = this.processParagraph(p);
                    htmlOutput += pHtml;
                    plainText += pText + "\n";
                });
            } else {
                // Düz metin kurtarma modu
                const allText = xmlDoc.documentElement.textContent || "";
                htmlOutput = `<p style="text-align: justify; font-family: 'Times New Roman'; font-size: 12pt;">${this.escapeHtml(allText)}</p>`;
                plainText = allText;
            }
            return { html: htmlOutput, plainText, metadata };
        }

        // elements altındaki çocukları sıralı işle
        for (let i = 0; i < elements.children.length; i++) {
            const child = elements.children[i];
            const nodeName = child.nodeName.toLowerCase();

            if (nodeName === "paragraph") {
                const { pHtml, pText } = this.processParagraph(child);
                htmlOutput += pHtml;
                plainText += pText + "\n";
            } else if (nodeName === "table") {
                const { tHtml, tText } = this.processTable(child);
                htmlOutput += tHtml;
                plainText += tText + "\n";
            }
        }

        if (!htmlOutput.trim()) {
            htmlOutput = '<p style="text-align: justify; font-family: \'Times New Roman\'; font-size: 12pt;"><br></p>';
        }

        return { html: htmlOutput, plainText, metadata };
    },

    /**
     * Tek bir <paragraph> düğümünü HTML <p> etiketine çevirir
     */
    processParagraph(pNode) {
        const alignAttr = pNode.getAttribute("alignment");
        let textAlign = "justify"; // Varsayılan UYAP dilekçe standardı

        if (alignAttr === "0" || alignAttr === "left") textAlign = "left";
        else if (alignAttr === "1" || alignAttr === "right") textAlign = "right";
        else if (alignAttr === "2" || alignAttr === "center") textAlign = "center";
        else if (alignAttr === "3" || alignAttr === "justify") textAlign = "justify";

        let pContentHtml = "";
        let pText = "";

        const contentNodes = pNode.querySelectorAll("content");
        if (contentNodes.length > 0) {
            contentNodes.forEach(c => {
                const text = c.textContent || "";
                pText += text;

                if (!text) return;

                const fontName = c.getAttribute("fontName") || "Times New Roman";
                const fontSize = c.getAttribute("fontSize") || "12";
                const isBold = c.getAttribute("bold") === "true" || c.getAttribute("isBold") === "true";
                const isItalic = c.getAttribute("italic") === "true" || c.getAttribute("isItalic") === "true";
                const isUnderline = c.getAttribute("underline") === "true" || c.getAttribute("isUnderline") === "true";
                const colorVal = c.getAttribute("foreground");

                let spanStyle = `font-family: '${fontName}', serif; font-size: ${fontSize}pt;`;

                // Renk dönüşümü
                if (colorVal && colorVal !== "-16777216" && colorVal !== "0") {
                    const hexColor = this.colorToHex(colorVal);
                    if (hexColor) spanStyle += ` color: ${hexColor};`;
                }

                let segmentHtml = this.escapeHtml(text);
                if (isBold) segmentHtml = `<strong>${segmentHtml}</strong>`;
                if (isItalic) segmentHtml = `<em>${segmentHtml}</em>`;
                if (isUnderline) segmentHtml = `<u>${segmentHtml}</u>`;

                pContentHtml += `<span style="${spanStyle}">${segmentHtml}</span>`;
            });
        } else {
            const rawText = pNode.textContent || "";
            pText = rawText;
            if (rawText) {
                pContentHtml = `<span style="font-family: 'Times New Roman', serif; font-size: 12pt;">${this.escapeHtml(rawText)}</span>`;
            }
        }

        if (!pContentHtml) {
            pContentHtml = "<br>";
        }

        const pHtml = `<p style="text-align: ${textAlign}; margin-bottom: 0.5rem; line-height: 1.5;">${pContentHtml}</p>\n`;
        return { pHtml, pText };
    },

    /**
     * Tablo düğümlerini işler
     */
    processTable(tableNode) {
        let tHtml = '<table class="udf-table" style="width: 100%; border-collapse: collapse; margin: 1rem 0; border: 1px solid #cbd5e1;">\n';
        let tText = "";

        const rows = tableNode.querySelectorAll("row");
        rows.forEach(r => {
            tHtml += "  <tr>\n";
            const cells = r.querySelectorAll("cell");
            cells.forEach(c => {
                tHtml += '    <td style="border: 1px solid #cbd5e1; padding: 6px 10px; vertical-align: top;">';
                const paragraphs = c.querySelectorAll("paragraph");
                if (paragraphs.length > 0) {
                    paragraphs.forEach(p => {
                        const { pHtml, pText } = this.processParagraph(p);
                        tHtml += pHtml;
                        tText += pText + "\t";
                    });
                } else {
                    const cellText = c.textContent || "";
                    tHtml += this.escapeHtml(cellText);
                    tText += cellText + "\t";
                }
                tHtml += "</td>\n";
            });
            tHtml += "  </tr>\n";
            tText += "\n";
        });
        tHtml += "</table>\n";
        return { tHtml, tText };
    },

    colorToHex(val) {
        try {
            const num = parseInt(val, 10);
            if (isNaN(num)) return null;
            // RGB ayrıştırma
            const r = (num >> 16) & 255;
            const g = (num >> 8) & 255;
            const b = num & 255;
            return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
        } catch (e) {
            return null;
        }
    },

    escapeHtml(text) {
        if (!text) return "";
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
};
