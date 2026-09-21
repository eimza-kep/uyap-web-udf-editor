/**
 * UYAP Web UDF Editörü - Kullanıcı Arayüzü ve Etkileşim Yöneticisi
 */

document.addEventListener("DOMContentLoaded", () => {
    // DOM Elementleri
    const editor = document.getElementById("udfEditor");
    const pageWrapper = document.getElementById("pageWrapper");
    const docTitleInput = document.getElementById("docTitleInput");
    const fileInput = document.getElementById("fileInput");
    const dropOverlay = document.getElementById("dropOverlay");
    const toastContainer = document.getElementById("toastContainer");

    // İstatistik elementleri
    const charCountEl = document.getElementById("charCount");
    const wordCountEl = document.getElementById("wordCount");
    const zoomLevelEl = document.getElementById("zoomLevel");

    // Modallar
    const templateModal = document.getElementById("templateModal");
    const tableModal = document.getElementById("tableModal");
    const aboutModal = document.getElementById("aboutModal");

    // Yakınlaştırma (Zoom) durumu
    let currentZoom = 1.0;

    // Modern HTML execCommand stil desteğini etkinleştir (span style üretir)
    try {
        document.execCommand("styleWithCSS", 0, true);
    } catch (e) {
        console.warn("styleWithCSS desteği:", e);
    }

    /* ==========================================================================
       Toast Bildirim Fonksiyonu
       ========================================================================== */
    function showToast(message, type = "info") {
        const toast = document.createElement("div");
        toast.className = `toast ${type}`;
        
        let icon = '<i class="ph-fill ph-info"></i>';
        if (type === "success") icon = '<i class="ph-fill ph-check-circle"></i>';
        if (type === "error") icon = '<i class="ph-fill ph-warning-circle"></i>';

        toast.innerHTML = `<span style="font-size: 1.1rem;">${icon}</span> <span>${message}</span>`;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.transition = "opacity 0.3s ease, transform 0.3s ease";
            toast.style.opacity = "0";
            toast.style.transform = "translateY(10px)";
            setTimeout(() => toast.remove(), 300);
        }, 3200);
    }

    /* ==========================================================================
       İstatistik Güncelleme (Karakter, Kelime)
       ========================================================================== */
    function updateStats() {
        const text = editor.innerText || "";
        const chars = text.length;
        const words = text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;

        charCountEl.innerHTML = `<i class="ph ph-text-aa"></i> ${chars} karakter`;
        wordCountEl.innerHTML = `<i class="ph ph-list-dashes"></i> ${words} kelime`;
    }

    editor.addEventListener("input", updateStats);
    editor.addEventListener("keyup", updateStats);

    /* ==========================================================================
       Toolbar Format Butonları
       ========================================================================== */
    // Standart Komutlar
    document.querySelectorAll("[data-command]").forEach(btn => {
        btn.addEventListener("click", () => {
            const command = btn.getAttribute("data-command");
            document.execCommand(command, false, null);
            editor.focus();
            updateToolbarState();
        });
    });

    // Yazı Tipi Değiştirme
    const fontSelect = document.getElementById("fontSelect");
    if (fontSelect) {
        fontSelect.addEventListener("change", (e) => {
            document.execCommand("fontName", false, e.target.value);
            editor.focus();
        });
    }

    // Yazı Boyutu Değiştirme (pt cinsinden hassas ayarlama)
    const fontSizeSelect = document.getElementById("fontSizeSelect");
    if (fontSizeSelect) {
        fontSizeSelect.addEventListener("change", (e) => {
            const sizePt = e.target.value;
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                if (!range.collapsed) {
                    const span = document.createElement("span");
                    span.style.fontSize = sizePt;
                    try {
                        range.surroundContents(span);
                    } catch (err) {
                        // Eğer karmaşık seçim varsa execCommand ile fallback
                        document.execCommand("fontSize", false, "3");
                    }
                }
            }
            editor.focus();
        });
    }

    // Metin Rengi Seçici
    const colorInput = document.getElementById("textColorInput");
    const colorSwatch = document.getElementById("colorSwatch");
    if (colorInput) {
        colorInput.addEventListener("input", (e) => {
            const color = e.target.value;
            if (colorSwatch) colorSwatch.style.backgroundColor = color;
            document.execCommand("foreColor", false, color);
            editor.focus();
        });
    }

    // Paragraf Girintisi (1.5 cm)
    const btnIndent = document.getElementById("btnIndent");
    if (btnIndent) {
        btnIndent.addEventListener("click", () => {
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                let node = selection.anchorNode;
                while (node && node !== editor && node.nodeName !== "P" && node.nodeName !== "DIV") {
                    node = node.parentNode;
                }
                if (node && node !== editor) {
                    node.style.textIndent = "1.5cm";
                } else {
                    document.execCommand("indent", false, null);
                }
            }
            editor.focus();
        });
    }

    // Satır Aralığı (Line Spacing)
    const lineSpacingSelect = document.getElementById("lineSpacingSelect");
    if (lineSpacingSelect) {
        lineSpacingSelect.addEventListener("change", (e) => {
            const spacing = e.target.value;
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                let node = selection.anchorNode;
                while (node && node !== editor && node.nodeName !== "P" && node.nodeName !== "DIV") {
                    node = node.parentNode;
                }
                if (node && node !== editor) {
                    node.style.lineHeight = spacing;
                } else {
                    editor.style.lineHeight = spacing;
                }
            }
            editor.focus();
        });
    }

    // Buton aktiflik durumu (Bold, Italic, Alignment)
    function updateToolbarState() {
        document.querySelectorAll("[data-command]").forEach(btn => {
            const cmd = btn.getAttribute("data-command");
            try {
                if (document.queryCommandState(cmd)) {
                    btn.classList.add("active");
                } else {
                    btn.classList.remove("active");
                }
            } catch (e) {}
        });
    }

    editor.addEventListener("selectionchange", updateToolbarState);
    editor.addEventListener("mouseup", updateToolbarState);
    editor.addEventListener("keyup", updateToolbarState);

    /* ==========================================================================
       Yakınlaştırma (Zoom) Kontrolleri
       ========================================================================== */
    function setZoom(newZoom) {
        currentZoom = Math.min(Math.max(0.5, newZoom), 2.0);
        pageWrapper.style.transform = `scale(${currentZoom})`;
        zoomLevelEl.textContent = `${Math.round(currentZoom * 100)}%`;
    }

    document.getElementById("btnZoomIn").addEventListener("click", () => setZoom(currentZoom + 0.1));
    document.getElementById("btnZoomOut").addEventListener("click", () => setZoom(currentZoom - 0.1));
    document.getElementById("btnZoomReset").addEventListener("click", () => setZoom(1.0));

    /* ==========================================================================
       Tablo Ekleme
       ========================================================================== */
    const btnOpenTableModal = document.getElementById("btnOpenTableModal");
    const btnInsertTable = document.getElementById("btnInsertTable");
    const tableRowsInput = document.getElementById("tableRows");
    const tableColsInput = document.getElementById("tableCols");

    if (btnOpenTableModal && tableModal) {
        btnOpenTableModal.addEventListener("click", () => {
            tableModal.showModal();
        });
    }

    if (btnInsertTable && tableModal) {
        btnInsertTable.addEventListener("click", () => {
            const rows = parseInt(tableRowsInput.value) || 2;
            const cols = parseInt(tableColsInput.value) || 2;

            let html = '<table style="width: 100%; border-collapse: collapse; margin: 12px 0;"><tbody>';
            for (let r = 0; r < rows; r++) {
                html += '<tr>';
                for (let c = 0; c < cols; c++) {
                    if (r === 0) {
                        html += '<th style="border: 1px solid #334155; padding: 6px 10px; background-color: #f1f5f9;">Başlık ' + (c + 1) + '</th>';
                    } else {
                        html += '<td style="border: 1px solid #334155; padding: 6px 10px;">Hücre ' + (r) + '-' + (c + 1) + '</td>';
                    }
                }
                html += '</tr>';
            }
            html += '</tbody></table><p></p>';

            document.execCommand("insertHTML", false, html);
            tableModal.close();
            editor.focus();
            showToast("Tablo eklendi.", "success");
        });
    }

    /* ==========================================================================
       Dosya Açma ve Okuma (UDF / XML)
       ========================================================================== */
    async function loadUdfFile(file) {
        try {
            showToast("UDF dosyası okunuyor...", "info");
            const result = await window.UdfParser.parse(file);
            
            // Editöre yerleştir
            editor.innerHTML = result.html;

            // Belge adını güncelle
            let docName = file.name.replace(/\.(udf|xml)$/i, "");
            docTitleInput.value = docName;

            updateStats();
            showToast(`"${file.name}" başarıyla açıldı.`, "success");
        } catch (err) {
            console.error("UDF Açma Hatası:", err);
            showToast("UDF dosyası açılamadı: " + err.message, "error");
        }
    }

    // Dosya Seç Butonu
    const btnOpenFile = document.getElementById("btnOpenFile");
    if (btnOpenFile && fileInput) {
        btnOpenFile.addEventListener("click", () => fileInput.click());
        fileInput.addEventListener("change", (e) => {
            if (e.target.files && e.target.files.length > 0) {
                loadUdfFile(e.target.files[0]);
                fileInput.value = "";
            }
        });
    }

    // Sürükle - Bırak (Drag and Drop)
    let dragCounter = 0;
    window.addEventListener("dragenter", (e) => {
        e.preventDefault();
        dragCounter++;
        dropOverlay.classList.add("active");
    });

    window.addEventListener("dragleave", (e) => {
        e.preventDefault();
        dragCounter--;
        if (dragCounter <= 0) {
            dragCounter = 0;
            dropOverlay.classList.remove("active");
        }
    });

    window.addEventListener("dragover", (e) => {
        e.preventDefault();
    });

    window.addEventListener("drop", (e) => {
        e.preventDefault();
        dragCounter = 0;
        dropOverlay.classList.remove("active");

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            if (file.name.toLowerCase().endsWith(".udf") || file.name.toLowerCase().endsWith(".xml")) {
                loadUdfFile(file);
            } else {
                showToast("Lütfen geçerli bir .udf veya .xml dosyası bırakın.", "error");
            }
        }
    });

    /* ==========================================================================
       Dışa Aktarma (UDF İndir, PDF/Yazdır, TXT)
       ========================================================================== */
    // UDF Olarak Kaydet & İndir
    const btnExportUdf = document.getElementById("btnExportUdf");
    if (btnExportUdf) {
        btnExportUdf.addEventListener("click", async () => {
            try {
                showToast("UDF paketi oluşturuluyor...", "info");
                const blob = await window.UdfGenerator.generateUdfBlob(editor);
                const filename = (docTitleInput.value.trim() || "belge") + ".udf";
                window.UdfGenerator.downloadUdf(blob, filename);
                showToast(`"${filename}" başarıyla indirildi.`, "success");
            } catch (err) {
                console.error("UDF İndirme Hatası:", err);
                showToast("UDF oluşturulamadı: " + err.message, "error");
            }
        });
    }

    // PDF / Yazdır
    const btnPrintPdf = document.getElementById("btnPrintPdf");
    if (btnPrintPdf) {
        btnPrintPdf.addEventListener("click", () => {
            window.print();
        });
    }

    // Düz Metin İndir (.txt)
    const btnExportTxt = document.getElementById("btnExportTxt");
    if (btnExportTxt) {
        btnExportTxt.addEventListener("click", () => {
            const text = editor.innerText;
            const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
            const filename = (docTitleInput.value.trim() || "belge") + ".txt";
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(url), 2000);
            showToast(`"${filename}" metin olarak indirildi.`, "success");
        });
    }

    // Yeni Belge
    const btnNewDoc = document.getElementById("btnNewDoc");
    if (btnNewDoc) {
        btnNewDoc.addEventListener("click", () => {
            if (confirm("Mevcut belgeniz temizlenecektir. Emin misiniz?")) {
                editor.innerHTML = '<p><br></p>';
                docTitleInput.value = "Yeni_Dilekce";
                updateStats();
                showToast("Yeni boş belge oluşturuldu.", "info");
            }
        });
    }

    /* ==========================================================================
       Hazır Şablonlar Modalı
       ========================================================================== */
    const btnOpenTemplates = document.getElementById("btnOpenTemplates");
    const templateContainer = document.getElementById("templateListContainer");

    if (btnOpenTemplates && templateModal) {
        btnOpenTemplates.addEventListener("click", () => {
            renderTemplates();
            templateModal.showModal();
        });
    }

    function renderTemplates() {
        if (!templateContainer || !window.LegalTemplates) return;
        templateContainer.innerHTML = "";

        Object.keys(window.LegalTemplates).forEach(key => {
            const t = window.LegalTemplates[key];
            const card = document.createElement("div");
            card.className = "template-card";
            card.innerHTML = `
                <div class="template-info">
                    <h4><i class="ph-fill ph-file-text"></i> ${t.title}</h4>
                    <p>Standart UYAP formatına uygun hazırlanmış resmi dilekçe.</p>
                </div>
                <button class="action-btn secondary" style="pointer-events: none;">Kullan</button>
            `;
            card.addEventListener("click", () => {
                editor.innerHTML = t.html;
                docTitleInput.value = t.filename.replace(".udf", "");
                templateModal.close();
                updateStats();
                showToast(`"${t.title}" şablonu yüklendi.`, "success");
            });
            templateContainer.appendChild(card);
        });
    }

    /* ==========================================================================
       Hakkında Modalı
       ========================================================================== */
    const btnAbout = document.getElementById("btnAbout");
    if (btnAbout && aboutModal) {
        btnAbout.addEventListener("click", () => {
            aboutModal.showModal();
        });
    }

    // Modal Kapatma Butonları
    document.querySelectorAll("[data-close-modal]").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const modal = e.target.closest("dialog");
            if (modal) modal.close();
        });
    });

    // Modal Dışına Tıklayınca Kapatma
    [templateModal, tableModal, aboutModal].forEach(modal => {
        if (modal) {
            modal.addEventListener("click", (e) => {
                const rect = modal.getBoundingClientRect();
                const isInDialog = (
                    rect.top <= e.clientY &&
                    e.clientY <= rect.top + rect.height &&
                    rect.left <= e.clientX &&
                    e.clientX <= rect.left + rect.width
                );
                if (!isInDialog) {
                    modal.close();
                }
            });
        }
    });

    /* ==========================================================================
       Klavye Kısayolları (Ctrl+S, Ctrl+O, Ctrl+P)
       ========================================================================== */
    window.addEventListener("keydown", (e) => {
        if (e.ctrlKey || e.metaKey) {
            if (e.key === "s" || e.key === "S") {
                e.preventDefault();
                btnExportUdf.click();
            } else if (e.key === "o" || e.key === "O") {
                e.preventDefault();
                fileInput.click();
            } else if (e.key === "p" || e.key === "P") {
                // Varsayılan print zaten çalışır ama temizlemek için
                // window.print()
            }
        }
    });

    // Başlangıç: Dava dilekçesi şablonunu varsayılan olarak yükle
    if (window.LegalTemplates && window.LegalTemplates.davaDilekcesi) {
        editor.innerHTML = window.LegalTemplates.davaDilekcesi.html;
        docTitleInput.value = "Dava_Dilekcesi";
        updateStats();
    }
});
