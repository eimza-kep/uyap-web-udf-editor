/**
 * UYAP Web UDF Editor - Markdown & LLM/RAG Export Converter
 * Transforms UDF rich-text / HTML editor content into clean GitHub-Flavored Markdown
 * and structured JSON format ready for Vector DBs and LLM RAG pipelines.
 * (udf2md compatible isomorphic converter)
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.UdfMarkdown = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {

    function htmlStringToMarkdown(html) {
        if (!html) return "";
        let md = html;

        // Strip scripts and styles
        md = md.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
        md = md.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");

        // Headings
        md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, "\n\n# $1\n\n");
        md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, "\n\n## $1\n\n");
        md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, "\n\n### $1\n\n");
        md = md.replace(/<h4[^>]*>(.*?)<\/h4>/gi, "\n\n#### $1\n\n");
        md = md.replace(/<h5[^>]*>(.*?)<\/h5>/gi, "\n\n##### $1\n\n");
        md = md.replace(/<h6[^>]*>(.*?)<\/h6>/gi, "\n\n###### $1\n\n");

        // Bold & Italic
        md = md.replace(/<(strong|b)[^>]*>(.*?)<\/\1>/gi, "**$2**");
        md = md.replace(/<(em|i)[^>]*>(.*?)<\/\1>/gi, "*$2*");
        md = md.replace(/<u[^>]*>(.*?)<\/u>/gi, "<u>$1</u>");
        md = md.replace(/<(del|s|strike)[^>]*>(.*?)<\/\1>/gi, "~~$2~~");

        // Lists
        md = md.replace(/<li[^>]*>(.*?)<\/li>/gi, "\n- $1");
        md = md.replace(/<\/?(ul|ol)[^>]*>/gi, "\n");

        // Tables
        md = md.replace(/<table[^>]*>([\s\S]*?)<\/table>/gi, function (_, tableInner) {
            const rows = [];
            const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
            let trMatch;
            while ((trMatch = trRegex.exec(tableInner)) !== null) {
                const cells = [];
                const cellRegex = /<(?:th|td)[^>]*>([\s\S]*?)<\/(?:th|td)>/gi;
                let cMatch;
                while ((cMatch = cellRegex.exec(trMatch[1])) !== null) {
                    const text = cMatch[1].replace(/<[^>]+>/g, "").trim().replace(/\|/g, "\\|");
                    cells.push(text);
                }
                if (cells.length > 0) rows.push(cells);
            }
            if (rows.length === 0) return "";
            const colCount = Math.max(...rows.map(r => r.length));
            let tMd = "\n\n";
            const header = rows[0];
            while (header.length < colCount) header.push("");
            tMd += "| " + header.join(" | ") + " |\n";
            tMd += "| " + Array(colCount).fill("---").join(" | ") + " |\n";
            for (let i = 1; i < rows.length; i++) {
                const r = rows[i];
                while (r.length < colCount) r.push("");
                tMd += "| " + r.join(" | ") + " |\n";
            }
            return tMd + "\n\n";
        });

        // Paragraphs & Divs
        md = md.replace(/<\/(p|div)>/gi, "\n\n");
        md = md.replace(/<(p|div)[^>]*>/gi, "");
        md = md.replace(/<br\s*\/?>/gi, "\n");
        md = md.replace(/<hr\s*\/?>/gi, "\n\n---\n\n");

        // Links
        md = md.replace(/<a\b[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi, "[$2]($1)");

        // Strip remaining HTML tags
        md = md.replace(/<[^>]+>/g, "");

        // Decode common HTML entities
        md = md.replace(/&nbsp;/g, " ")
               .replace(/&amp;/g, "&")
               .replace(/&lt;/g, "<")
               .replace(/&gt;/g, ">")
               .replace(/&quot;/g, '"')
               .replace(/&#39;/g, "'");

        // Normalize multiple consecutive blank lines
        md = md.replace(/\n{3,}/g, "\n\n").trim();
        return md;
    }

    function htmlToMarkdown(input) {
        if (!input) return "";
        if (typeof input === "string") {
            return htmlStringToMarkdown(input);
        }
        if (input.innerHTML !== undefined) {
            return htmlStringToMarkdown(input.innerHTML);
        }
        return String(input);
    }

    function htmlToRagJson(input, docTitle) {
        const md = htmlToMarkdown(input);
        const plainText = md.replace(/[*#~`_\[\]]/g, "").replace(/\n{3,}/g, "\n\n").trim();
        const paragraphs = plainText.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
        const sections = [];

        // Split by Markdown headers (# H1, ## H2, etc.)
        const lines = md.split("\n");
        let currentSectionTitle = "Giriş / Genel";
        let currentSectionBuffer = [];

        for (const line of lines) {
            const hMatch = line.match(/^(#{1,4})\s+(.+)$/);
            if (hMatch) {
                if (currentSectionBuffer.length > 0) {
                    sections.push({
                        title: currentSectionTitle,
                        content: currentSectionBuffer.join("\n").trim()
                    });
                    currentSectionBuffer = [];
                }
                currentSectionTitle = hMatch[2].trim();
            } else {
                currentSectionBuffer.push(line);
            }
        }
        if (currentSectionBuffer.length > 0) {
            sections.push({
                title: currentSectionTitle,
                content: currentSectionBuffer.join("\n").trim()
            });
        }

        const words = plainText.split(/\s+/).filter(Boolean);

        return {
            title: docTitle || "UYAP Dokümanı",
            schemaVersion: "1.0-rag",
            generator: "UYAP Web UDF Editor (udf2md integrated)",
            exportedAt: new Date().toISOString(),
            metadata: {
                charCount: plainText.length,
                wordCount: words.length,
                paragraphCount: paragraphs.length,
                sectionCount: sections.length
            },
            markdown: md,
            plainText: plainText,
            sections: sections.length > 0 ? sections : [{ title: "Ana Metin", content: md }]
        };
    }

    return {
        htmlToMarkdown,
        htmlToRagJson
    };
}));
