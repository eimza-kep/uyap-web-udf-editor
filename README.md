# UYAP Web UDF Editörü (Java'sız & Çevrimdışı)

[![Deploy to GitHub Pages](https://github.com/eimza-kep/uyap-web-udf-editor/actions/workflows/deploy.yml/badge.svg)](https://github.com/eimza-kep/uyap-web-udf-editor/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Zero Server](https://img.shields.io/badge/Server-Zero%20(Client%20Side)-success.svg)](index.html)
[![Formats: UDF, PDF, DOCX, TIFF](https://img.shields.io/badge/Formats-UDF%20%7C%20PDF%20%7C%20DOCX%20%7C%20TIFF-orange.svg)](index.html)

UYAP Doküman Editörü (`.udf`) dosyalarını bilgisayarınıza herhangi bir Java (JRE) kurulumu, eklenti veya harici sunucuya ihtiyaç duymadan **doğrudan web tarayıcınızda açan, düzenleyen, PDF, DOCX ve TIFF (OCR) içe aktaran ve UDF olarak kaydeden** %100 istemci taraflı (client-side) açık kaynaklı editördür.

🌐 **Canlı Demo:** [eimza-kep.github.io/uyap-web-udf-editor](https://eimza-kep.github.io/uyap-web-udf-editor/)

---

## 🌟 Öne Çıkan Özellikler

- **Java'ya Veda:** Java (JRE) kurulumu gerekmez; modern tarayıcılarda (Chrome, Firefox, Safari, Edge) sıfır gecikmeyle çalışır.
- **Çoklu Format Desteği:**
  - **UDF (.udf):** UYAP 1.8 standartlarında açma ve kaydetme
  - **DOCX (.docx):** Microsoft Word belgelerini içe aktarma (`mammoth.js`)
  - **PDF (.pdf):** PDF metinlerini sayfalar halinde editöre yükleme (`pdf.js`)
  - **TIFF / Görsel (.tiff, .tif):** Taranmış adliye evrakları için tarayıcı içi yerel OCR metin tanıma (`Tesseract.js` + `UTIF.js`)
- **Şablon Kütüphanesi:** Dava dilekçesi, cevap dilekçesi, tensip zaptı vb. hazır resmi şablonlar.
- **A4 Sayfa Simülasyonu:** Gerçek kenar boşlukları (sayfa marjinleri) ve sayfa düzeni.

## 🔒 Gizlilik & KVKK Güvencesi
- **%100 Çevrimdışı (Offline):** İnternet bağlantınızı kapatsanız dahi eksiksiz çalışır.
- Açtığınız dilekçeler ve UDF dosyaları **hiçbir uzak sunucuya veya buluta yüklenmez**.
- Tüm işlemler bilgisayarınızın kendi belleğinde (RAM) yapılır.

## ⌨️ Kısayol Tuşları

| Kısayol | İşlev |
|---------|-------|
| `Ctrl + S` | UDF Dosyası Olarak İndir |
| `Ctrl + P` | Yazdır / PDF Olarak Kaydet |
| `Ctrl + B` | Kalın (Bold) |
| `Ctrl + I` | İtalik (Italic) |
| `Ctrl + U` | Altı Çizili (Underline) |

## 🛠️ Teknolojiler
- HTML5 & CSS3 (Phosphor Icons + Inter tipografisi)
- Vanilla JavaScript (Hafif ve hızlı)
- JSZip (UDF formatını oluşturan ZIP arşivini yönetmek için)
- PDF.js, Mammoth.js, Tesseract.js (İçe aktarma ve OCR)

## 🌐 LegalTech & E-Dönüşüm Açık Kaynak Ekosistemi

Bu editör, [@eimza-kep](https://github.com/eimza-kep) açık kaynak ekosisteminin tarayıcı tabanlı LegalTech bileşenidir. İlgili diğer araçlarımız:

* 📄 [udf2md](https://github.com/eimza-kep/udf2md) - UYAP `.udf` dosyalarını Node.js CLI ve RAG boru hatları için Markdown ve JSON formatına dönüştürücü.
* 🛠️ [uyap-editor-hizli-onarim](https://github.com/eimza-kep/uyap-editor-hizli-onarim) - Masaüstü resmi UYAP Editör donma, açılmama, Java bellek ve önbellek onarım asistanı.
* ⚖️ [avukat-hukuk-excel-hesaplamalari](https://github.com/eimza-kep/avukat-hukuk-excel-hesaplamalari) - Avukatlar için AAÜT vekalet ücreti, arabuluculuk ve icra takip şablonları.
* 🤖 [turkiye-yapay-zeka-araclari](https://github.com/eimza-kep/turkiye-yapay-zeka-araclari) - Dava hafızası, içtihat özetleme ve dilekçe mimarı yapay zeka araçları.
* 🌟 [awesome-turkiye-e-donusum](https://github.com/eimza-kep/awesome-turkiye-e-donusum) - Türkiye e-Dönüşüm açık kaynak araçları ve kütüphaneleri kürasyonu.

---

## 📄 Lisans

MIT License — Açık kaynaklı ve ücretsizdir. Adalet Bakanlığı ile resmi bir bağı yoktur, bağımsız geliştirilmiştir.

