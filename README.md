# UYAP Web UDF Editörü (Java'sız & Çevrimdışı)

[![Deploy to GitHub Pages](https://github.com/eimza-kep/uyap-web-udf-editor/actions/workflows/deploy.yml/badge.svg)](https://github.com/eimza-kep/uyap-web-udf-editor/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Zero Server](https://img.shields.io/badge/Server-Zero%20(Client%20Side)-success.svg)](index.html)
[![E-İmza: CAdES-BES | XML-DSIG](https://img.shields.io/badge/E--%C4%B0mza-CAdES--BES%20%7C%20XML--DSIG-emerald.svg)](index.html)
[![Formats: UDF, PDF, DOCX, TIFF, MD](https://img.shields.io/badge/Formats-UDF%20%7C%20PDF%20%7C%20DOCX%20%7C%20TIFF%20%7C%20MD-orange.svg)](index.html)

UYAP Doküman Editörü (`.udf`) dosyalarını bilgisayarınıza herhangi bir Java (JRE) kurulumu, eklenti veya harici sunucuya ihtiyaç duymadan **doğrudan web tarayıcınızda açan, düzenleyen, Nitelikli Elektronik Sertifika (E-İmza) ile imzalayan, PDF, DOCX ve TIFF (OCR) içe aktaran, Markdown/RAG formatına dönüştüren ve UDF olarak kaydeden** %100 istemci taraflı (client-side) açık kaynaklı editördür.

🌐 **Canlı Demo:** [eimza-kep.github.io/uyap-web-udf-editor](https://eimza-kep.github.io/uyap-web-udf-editor/)

---

## 🌟 Öne Çıkan Özellikler

- **Java'ya Veda:** Java (JRE) kurulumu gerekmez; modern tarayıcılarda (Chrome, Firefox, Safari, Edge) sıfır gecikmeyle çalışır.
- **🔏 E-İmza ile Doğrudan Tarayıcıdan İmzalı UDF Oluşturma (CAdES-BES & XML-DSIG):**
  - **5070 Sayılı Elektronik İmza Kanunu** ve UYAP Elektronik Belge Standartları ile tam uyumlu CAdES-BES ve XML-DSIG zarflaması.
  - Türkiye'deki tüm Nitelikli Elektronik Sertifika Hizmet Sağlayıcıları (ESHS) desteği: **TÜBİTAK Kamu SM**, **TÜRKTRUST**, **E-Güven**, **E-Tuğra** ve **TNBE-İmza**.
  - Yerel e-İmza ajanı algılama köprüsü (WebPKI / ArkSigner / Kamu SM yerel portları: 9001, 9191, 8080) veya doğrudan tarayıcı içi imzalama.
  - **CAdES-T RFC 3161 Zaman Damgası (Timestamp)** ile belgenin imza anını kesinleştirme seçeneği.
  - İmzalı `.udf` dosyaları açıldığında otomatik imza ve imzalayan bilgisi doğrulama rozeti.
- **🌙 Karanlık Mod (Dark Mode):** Gece ve loş ışıkta çalışan hukukçular için göz yormayan, sistem temasıyla (`prefers-color-scheme`) otomatik senkronize olan veya `Ctrl+Alt+D` ile açılıp kapanabilen doküman odaklı koyu tema.
- **🤖 Yapay Zeka & LLM / RAG Aktarımı:** Editördeki dilekçeleri tek tıkla GitHub-Flavored Markdown (`.md`) ve bölümlenmiş yapısal JSON (`-rag.json`) formatında dışa aktarma (yerleşik `udf2md` motoru).
- **Çoklu Format Desteği:**
  - **UDF (.udf):** UYAP 1.8 standartlarında açma, e-imzalama ve kaydetme
  - **DOCX (.docx):** Microsoft Word belgelerini içe aktarma (`mammoth.js`)
  - **PDF (.pdf):** PDF metinlerini sayfalar halinde editöre yükleme (`pdf.js`)
  - **TIFF / Görsel (.tiff, .tif):** Taranmış adliye evrakları için tarayıcı içi yerel OCR metin tanıma (`Tesseract.js` + `UTIF.js`)
  - **Markdown (.md) & Metin (.txt):** Temiz Markdown ve düz metin çıktıları
- **Şablon Kütüphanesi:** Dava dilekçesi, cevap dilekçesi, mazeret dilekçesi, tensip zaptı vb. hazır resmi şablonlar.
- **A4 Sayfa Simülasyonu:** Gerçek kenar boşlukları (sayfa marjinleri) ve sayfa düzeni.

---

## 💻 Yerel Kurulum ve Geliştirme

Projeyi yerel bilgisayarınızda çalıştırmak veya geliştirmek için Node.js ortamı yeterlidir:

```bash
# 1. Depoyu klonlayın
git clone https://github.com/eimza-kep/uyap-web-udf-editor.git
cd uyap-web-udf-editor

# 2. Testleri çalıştırın
npm test
# veya
node test/test-udf.js

# 3. Yerel web sunucusu ile başlatın (Herhangi bir statik sunucu yeterlidir)
# Python ile:
python -m http.server 8080

# veya Node.js npx ile:
npx serve .
```

Tarayıcınızdan `http://localhost:8080` adresine girerek hemen kullanmaya başlayabilirsiniz.

---

## 🔒 Gizlilik & KVKK Güvencesi
- **%100 Çevrimdışı (Offline):** İnternet bağlantınızı kapatsanız dahi eksiksiz çalışır.
- Açtığınız dilekçeler ve UDF dosyaları **hiçbir uzak sunucuya veya buluta yüklenmez**.
- PIN kodları ve tüm kriptografik karma/zarflama işlemleri bilgisayarınızın kendi belleğinde (RAM) yapılır.

---

## ⌨️ Kısayol Tuşları

| Kısayol | İşlev |
|---------|-------|
| `Ctrl + S` | UDF Dosyası Olarak İndir |
| `Ctrl + O` | Dosya Aç (UDF, XML, PDF, DOCX, TIFF) |
| `Ctrl + P` | Yazdır / PDF Olarak Kaydet |
| `Ctrl + Alt + D` | Karanlık / Aydınlık Mod Aç / Kapa |
| `Ctrl + B` | Kalın (Bold) |
| `Ctrl + I` | İtalik (Italic) |
| `Ctrl + U` | Altı Çizili (Underline) |
| `Ctrl + Z` | Geri Al (Undo) |
| `Ctrl + Y` | Yinele (Redo) |

---

## 🛠️ Teknolojiler
- HTML5 & CSS3 (Phosphor Icons + Inter tipografisi)
- Vanilla JavaScript (Hafif ve hızlı, sıfır ağır framework)
- JSZip (UDF formatını oluşturan ZIP arşivini yönetmek için)
- UdfSigner (CAdES-BES ve XML-DSIG E-İmza motoru)
- PDF.js, Mammoth.js, Tesseract.js (İçe aktarma ve OCR)
- UdfMarkdown (Yerleşik `udf2md` isomorphic dönüştürücü)

---

## 🌐 LegalTech & E-Dönüşüm Açık Kaynak Ekosistemi

Bu editör, [@eimza-kep](https://github.com/eimza-kep) açık kaynak ekosisteminin tarayıcı tabanlı LegalTech bileşenidir. İlgili diğer araçlarımız:

* 📄 [udf2md](https://github.com/eimza-kep/udf2md) - UYAP `.udf` dosyalarını Node.js CLI ve RAG boru hatları için Markdown ve JSON formatına dönüştürücü.
* 🛠️ [uyap-editor-hizli-onarim](https://github.com/eimza-kep/uyap-editor-hizli-onarim) - Masaüstü resmi UYAP Editör donma, açılmama, Java bellek ve önbellek onarım asistanı.
* ⚖️ [avukat-hukuk-excel-hesaplamalari](https://github.com/eimza-kep/avukat-hukuk-excel-hesaplamalari) - Avukatlar için AAÜT vekalet ücreti, arabuluculuk ve icra takip şablonları.
* 🤖 [turkiye-yapay-zeka-araclari](https://github.com/eimza-kep/turkiye-yapay-zeka-araclari) - Dava hafızası, içtihat özetleme ve dilekçe mimarı yapay zeka araçları.
* 🌟 [awesome-turkiye-e-donusum](https://github.com/eimza-kep/awesome-turkiye-e-donusum) - Türkiye e-Dönüşüm açık kaynak araçları ve kütüphaneleri kürasyonu.

---

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) kapsamında açık kaynak olarak sunulmaktadır.
