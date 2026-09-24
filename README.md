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

## 📄 Lisans
MIT License — Açık kaynaklı ve ücretsizdir. Adalet Bakanlığı ile resmi bir bağı yoktur, bağımsız geliştirilmiştir.
