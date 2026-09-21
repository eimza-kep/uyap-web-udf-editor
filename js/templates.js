/**
 * Hazır Hukuk ve Dilekçe Şablonları
 */

window.LegalTemplates = {
    davaDilekcesi: {
        title: "Hukuk Mahkemesi Dava Dilekçesi",
        filename: "Dava_Dilekcesi.udf",
        html: `
        <p style="text-align: center; margin-bottom: 1.5rem; line-height: 1.6;">
            <strong><span style="font-family: 'Times New Roman'; font-size: 14pt;">NÖBETÇİ ASLİYE HUKUK MAHKEMESİNE</span></strong><br>
            <strong><span style="font-family: 'Times New Roman'; font-size: 12pt;">ANKARA</span></strong>
        </p>
        
        <p style="text-align: justify; margin-bottom: 0.8rem; line-height: 1.5;">
            <strong><span style="font-family: 'Times New Roman'; font-size: 12pt;">DAVACI&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span></strong>
            <span style="font-family: 'Times New Roman'; font-size: 12pt;"> [Ad Soyad], (T.C. Kimlik No: [...........])</span><br>
            <strong><span style="font-family: 'Times New Roman'; font-size: 12pt;">ADRES&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span></strong>
            <span style="font-family: 'Times New Roman'; font-size: 12pt;"> [Adres Bilgisi]</span>
        </p>

        <p style="text-align: justify; margin-bottom: 0.8rem; line-height: 1.5;">
            <strong><span style="font-family: 'Times New Roman'; font-size: 12pt;">VEKİLİ&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span></strong>
            <span style="font-family: 'Times New Roman'; font-size: 12pt;"> Av. [Ad Soyad] - [Baro Sicil No]</span>
        </p>

        <p style="text-align: justify; margin-bottom: 0.8rem; line-height: 1.5;">
            <strong><span style="font-family: 'Times New Roman'; font-size: 12pt;">DAVALI&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span></strong>
            <span style="font-family: 'Times New Roman'; font-size: 12pt;"> [Davalı Gerçek veya Tüzel Kişi Adı / Unvanı]</span><br>
            <strong><span style="font-family: 'Times New Roman'; font-size: 12pt;">ADRES&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span></strong>
            <span style="font-family: 'Times New Roman'; font-size: 12pt;"> [Davalı Adresi]</span>
        </p>

        <p style="text-align: justify; margin-bottom: 0.8rem; line-height: 1.5;">
            <strong><span style="font-family: 'Times New Roman'; font-size: 12pt;">DAVA KONUSU&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span></strong>
            <span style="font-family: 'Times New Roman'; font-size: 12pt;"> [Davanın Konusu ve Talep Özeti (Örn: Alacak, Tazminat, Menfi Tespit vb.)]</span>
        </p>

        <p style="text-align: justify; margin-bottom: 1rem; line-height: 1.5;">
            <strong><span style="font-family: 'Times New Roman'; font-size: 12pt;">DAVA DEĞERİ&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span></strong>
            <span style="font-family: 'Times New Roman'; font-size: 12pt;"> [Dava Değeri Tutarı] TL (Harca Esas Değer)</span>
        </p>

        <p style="text-align: center; margin-bottom: 1rem; margin-top: 1.5rem;">
            <strong><span style="font-family: 'Times New Roman'; font-size: 12pt;">A Ç I K L A M A L A R</span></strong>
        </p>

        <p style="text-align: justify; margin-bottom: 0.8rem; line-height: 1.5; text-indent: 1.5cm;">
            <span style="font-family: 'Times New Roman'; font-size: 12pt;">1. Müvekkil ile davalı taraf arasında [Tarih] tarihinde akdedilen sözleşme uyarınca, müvekkil üzerine düşen tüm edimleri eksiksiz olarak ifa etmiştir.</span>
        </p>

        <p style="text-align: justify; margin-bottom: 0.8rem; line-height: 1.5; text-indent: 1.5cm;">
            <span style="font-family: 'Times New Roman'; font-size: 12pt;">2. Davalı taraf ise sözleşmeden kaynaklanan yükümlülüklerini yerine getirmemiş ve müvekkilin haklı alacağının ödenmesinden kaçınmıştır. Taraflar arasında yapılan şifahi görüşmeler ve [Tarih] tarihli ihtarnameye rağmen herhangi bir ödeme yapılmamıştır.</span>
        </p>

        <p style="text-align: justify; margin-bottom: 0.8rem; line-height: 1.5; text-indent: 1.5cm;">
            <span style="font-family: 'Times New Roman'; font-size: 12pt;">3. 6100 sayılı Hukuk Muhakemeleri Kanunu ve Türk Borçlar Kanunu'nun ilgili hükümleri gereğince huzurdaki davanın ikame edilmesi zarureti hasıl olmuştur.</span>
        </p>

        <p style="text-align: justify; margin-bottom: 0.6rem; margin-top: 1.5rem; line-height: 1.5;">
            <strong><span style="font-family: 'Times New Roman'; font-size: 12pt;">HUKUKİ SEBEPLER :</span></strong>
            <span style="font-family: 'Times New Roman'; font-size: 12pt;"> HMK, TBK, TTK ve ilgili sair mevzuat.</span>
        </p>

        <p style="text-align: justify; margin-bottom: 1rem; line-height: 1.5;">
            <strong><span style="font-family: 'Times New Roman'; font-size: 12pt;">HUKUKİ DELİLLER&nbsp;&nbsp;:</span></strong>
            <span style="font-family: 'Times New Roman'; font-size: 12pt;"> [Tarih] tarihli sözleşme, banka dekontları, ihtarname, bilirkişi incelemesi, tanık beyanları ve her türlü yasal delil.</span>
        </p>

        <p style="text-align: center; margin-bottom: 1rem; margin-top: 1.5rem;">
            <strong><span style="font-family: 'Times New Roman'; font-size: 12pt;">SONUÇ VE İSTEM</span></strong>
        </p>

        <p style="text-align: justify; margin-bottom: 1.5rem; line-height: 1.5; text-indent: 1.5cm;">
            <span style="font-family: 'Times New Roman'; font-size: 12pt;">Yukarıda arz ve izah olunan nedenlerle; haklı davamızın KABULÜ ile [Dava Değeri] TL alacağın temerrüt tarihinden itibaren işleyecek yasal faiziyle birlikte davalıdan tahsiline, yargılama giderleri ile vekalet ücretinin davalı tarafa yükletilmesine karar verilmesini bilvekale saygıyla arz ve talep ederiz. [Tarih]</span>
        </p>

        <p style="text-align: right; margin-top: 2rem; line-height: 1.5;">
            <strong><span style="font-family: 'Times New Roman'; font-size: 12pt;">Davacı Vekili</span></strong><br>
            <span style="font-family: 'Times New Roman'; font-size: 12pt;">Av. [Ad Soyad]</span><br>
            <span style="font-family: 'Times New Roman'; font-size: 11pt; color: #64748b;">(e-İmzalıdır)</span>
        </p>
        `
    },

    itirazDilekcesi: {
        title: "İcra Takibine İtiraz Dilekçesi",
        filename: "Icra_Takibine_Itiraz.udf",
        html: `
        <p style="text-align: center; margin-bottom: 1.5rem; line-height: 1.6;">
            <strong><span style="font-family: 'Times New Roman'; font-size: 14pt;">İSTANBUL [..]. İCRA DAİRESİNE</span></strong>
        </p>
        
        <p style="text-align: justify; margin-bottom: 0.8rem; line-height: 1.5;">
            <strong><span style="font-family: 'Times New Roman'; font-size: 12pt;">DOSYA NO&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span></strong>
            <span style="font-family: 'Times New Roman'; font-size: 12pt;"> 2026 / [....] Esas</span>
        </p>

        <p style="text-align: justify; margin-bottom: 0.8rem; line-height: 1.5;">
            <strong><span style="font-family: 'Times New Roman'; font-size: 12pt;">İTİRAZ EDEN (BORÇLU):</span></strong>
            <span style="font-family: 'Times New Roman'; font-size: 12pt;"> [Ad Soyad], (T.C. Kimlik No: [...........])</span><br>
            <strong><span style="font-family: 'Times New Roman'; font-size: 12pt;">ADRES&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span></strong>
            <span style="font-family: 'Times New Roman'; font-size: 12pt;"> [Adres Bilgisi]</span>
        </p>

        <p style="text-align: justify; margin-bottom: 0.8rem; line-height: 1.5;">
            <strong><span style="font-family: 'Times New Roman'; font-size: 12pt;">ALACAKLI&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span></strong>
            <span style="font-family: 'Times New Roman'; font-size: 12pt;"> [Alacaklı Kişi veya Şirket Adı]</span>
        </p>

        <p style="text-align: justify; margin-bottom: 1rem; line-height: 1.5;">
            <strong><span style="font-family: 'Times New Roman'; font-size: 12pt;">TEBLİĞ TARİHİ&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span></strong>
            <span style="font-family: 'Times New Roman'; font-size: 12pt;"> [Ödeme Emrinin Tebliğ Tarihi]</span>
        </p>

        <p style="text-align: justify; margin-bottom: 1rem; line-height: 1.5;">
            <strong><span style="font-family: 'Times New Roman'; font-size: 12pt;">KONU&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span></strong>
            <span style="font-family: 'Times New Roman'; font-size: 12pt;"> Yasal 7 günlük süre içerisinde yetkiye, borca, faize ve tüm fer'ilerine açıkça itirazlarımızdan ibarettir.</span>
        </p>

        <p style="text-align: center; margin-bottom: 1rem; margin-top: 1.5rem;">
            <strong><span style="font-family: 'Times New Roman'; font-size: 12pt;">A Ç I K L A M A L A R</span></strong>
        </p>

        <p style="text-align: justify; margin-bottom: 0.8rem; line-height: 1.5; text-indent: 1.5cm;">
            <span style="font-family: 'Times New Roman'; font-size: 12pt;">1. Müdürlüğünüzün yukarıda esas numarası yazılı dosyasından tarafıma gönderilen ilamsız ödeme emri [Tebliğ Tarihi] tarihinde tebliğ edilmiştir. Yasal süresi içinde itirazlarımı sunuyorum.</span>
        </p>

        <p style="text-align: justify; margin-bottom: 0.8rem; line-height: 1.5; text-indent: 1.5cm;">
            <span style="font-family: 'Times New Roman'; font-size: 12pt;">2. Alacaklı görünen tarafa herhangi bir borcum bulunmamaktadır. Bu nedenle takibe konu asıl alacağa, işlemiş faize, faiz oranına ve tüm fer'ilerine açıkça itiraz ediyorum.</span>
        </p>

        <p style="text-align: center; margin-bottom: 1rem; margin-top: 1.5rem;">
            <strong><span style="font-family: 'Times New Roman'; font-size: 12pt;">SONUÇ VE İSTEM</span></strong>
        </p>

        <p style="text-align: justify; margin-bottom: 1.5rem; line-height: 1.5; text-indent: 1.5cm;">
            <span style="font-family: 'Times New Roman'; font-size: 12pt;">Açıklanan nedenlerle; takibe, borca, faize ve tüm fer'ilerine itirazımın kabulü ile aleyhime başlatılan İCRA TAKİBİNİN DURDURULMASINA karar verilmesini saygılarımla arz ve talep ederim. [Tarih]</span>
        </p>

        <p style="text-align: right; margin-top: 2rem; line-height: 1.5;">
            <strong><span style="font-family: 'Times New Roman'; font-size: 12pt;">İtiraz Eden Borçlu</span></strong><br>
            <span style="font-family: 'Times New Roman'; font-size: 12pt;">[Ad Soyad]</span><br>
            <span style="font-family: 'Times New Roman'; font-size: 11pt; color: #64748b;">(İmza / e-İmza)</span>
        </p>
        `
    },

    mazeretDilekcesi: {
        title: "Duruşma Mazeret Bildirimi",
        filename: "Durusma_Mazeret_Dilekcesi.udf",
        html: `
        <p style="text-align: center; margin-bottom: 1.5rem; line-height: 1.6;">
            <strong><span style="font-family: 'Times New Roman'; font-size: 14pt;">İSTANBUL ANADOLU [..]. ASLİYE CEZA MAHKEMESİNE</span></strong>
        </p>
        
        <p style="text-align: justify; margin-bottom: 0.8rem; line-height: 1.5;">
            <strong><span style="font-family: 'Times New Roman'; font-size: 12pt;">DOSYA NO&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span></strong>
            <span style="font-family: 'Times New Roman'; font-size: 12pt;"> 2026 / [....] Esas</span>
        </p>

        <p style="text-align: justify; margin-bottom: 0.8rem; line-height: 1.5;">
            <strong><span style="font-family: 'Times New Roman'; font-size: 12pt;">DURUŞMA GÜNÜ&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span></strong>
            <span style="font-family: 'Times New Roman'; font-size: 12pt;"> [Duruşma Tarihi ve Saati]</span>
        </p>

        <p style="text-align: justify; margin-bottom: 0.8rem; line-height: 1.5;">
            <strong><span style="font-family: 'Times New Roman'; font-size: 12pt;">SANIK / MÜŞTEKİ VEKİLİ:</span></strong>
            <span style="font-family: 'Times New Roman'; font-size: 12pt;"> Av. [Ad Soyad]</span>
        </p>

        <p style="text-align: justify; margin-bottom: 1rem; line-height: 1.5;">
            <strong><span style="font-family: 'Times New Roman'; font-size: 12pt;">KONU&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span></strong>
            <span style="font-family: 'Times New Roman'; font-size: 12pt;"> Mesleki mazeretimizin sunulması ve yeni duruşma gününün UYAP'tan öğrenilmesi talebidir.</span>
        </p>

        <p style="text-align: justify; margin-bottom: 1rem; line-height: 1.5; text-indent: 1.5cm;">
            <span style="font-family: 'Times New Roman'; font-size: 12pt;">Mahkemenizin yukarıda esas numarası yazılı dosyasının [Duruşma Tarihi] günü saat [Saat] teki celsesine, aynı saatte [Diğer Mahkeme Adı]'ndaki önceden tayin edilmiş duruşmam/sağlık mazeretim nedeniyle katılamayacağım.</span>
        </p>

        <p style="text-align: justify; margin-bottom: 1.5rem; line-height: 1.5; text-indent: 1.5cm;">
            <span style="font-family: 'Times New Roman'; font-size: 12pt;">Mesleki mazeretimin KABULÜNE, yokluğumda duruşmanın icra edilerek yeni duruşma gün ve saatinin UYAP sistemi üzerinden öğrenilmesine karar verilmesini vekaleten saygıyla arz ve talep ederim. [Tarih]</span>
        </p>

        <p style="text-align: right; margin-top: 2rem; line-height: 1.5;">
            <strong><span style="font-family: 'Times New Roman'; font-size: 12pt;">Sanık / Müşteki Vekili</span></strong><br>
            <span style="font-family: 'Times New Roman'; font-size: 12pt;">Av. [Ad Soyad]</span><br>
            <span style="font-family: 'Times New Roman'; font-size: 11pt; color: #64748b;">(e-İmzalıdır)</span>
        </p>
        `
    }
};
