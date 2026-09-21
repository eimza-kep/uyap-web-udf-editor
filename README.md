# UYAP Web UDF Editörü (Java'sız & Çevrimdışı)

UYAP Doküman Editörü (.udf) dosyalarını bilgisayarınıza herhangi bir Java (JRE) kurulumu, eklenti veya harici sunucuya ihtiyaç duymadan **doğrudan web tarayıcınızda açan, düzenleyen, PDF ve UDF olarak kaydeden** %100 istemci taraflı (client-side) açık kaynaklı editördür.

## 🌟 Neden Bu Proje?
Mevcut UYAP Editörü Java gerektirir ve bu durum özellikle güncel macOS / Windows işletim sistemlerinde güvenlik uyarılarına, sürüm çakışmalarına ve yavaşlıklara neden olmaktadır. Bu proje, tüm UDF paketleme ve ayrıştırma işlemlerini `JSZip` ve `DOMParser` kullanarak **doğrudan tarayıcınızda (offline) yapar**.

## 🔒 Gizlilik (KVKK) Güvencesi
- İnternet bağlantısı olmadan da çalışır.
- Açtığınız dilekçeler ve UDF dosyaları **hiçbir uzak sunucuya veya buluta yüklenmez**.
- İşlemler, bilgisayarınızın kendi belleğinde (RAM) şifrelenir ve çözülür.

## 🚀 Kullanım
Projeyi bilgisayarınıza indirin ve `index.html` dosyasına çift tıklayın:
1. Sürükle - Bırak yöntemiyle `belge.udf` dosyanızı açın.
2. Dilekçenizi düzenleyin.
3. **UDF İndir** veya **PDF / Yazdır** butonuyla kaydedin.

## 🛠️ Teknolojiler
- HTML5 & CSS3 (Modern ve duyarlı arayüz)
- Vanilla JavaScript (Ek framework kullanılmadı)
- JSZip (UDF formatını oluşturan ZIP arşivini yönetmek için)
- Phosphor Icons & Inter (Modern web tipografisi ve ikonlar)

## 📄 Lisans
MIT License - Açık kaynaklı ve ücretsizdir. Adalet Bakanlığı ile resmi bir bağı yoktur, bağımsız geliştirilmiştir.
