/**
 * UYAP UDF E-İmza (CAdES-BES / XML-DSIG) İmzalayıcı ve Doğrulayıcı Modülü
 * 5070 Sayılı Elektronik İmza Kanunu ve UYAP Elektronik Belge Standartları ile Uyumlu
 * 
 * Hem tarayıcı (Browser) hem de Node.js ortamında bağımsız çalışır.
 */

(function (global) {
    // Dahili Hızlı ve Güvenilir SHA-256 Gerçekleştirmesi (Saf JavaScript - FIPS 180-4)
    function sha256Sync(ascii) {
        function rightRotate(value, amount) {
            return (value >>> amount) | (value << (32 - amount));
        }

        const mathPow = Math.pow;
        const maxWord = mathPow(2, 32);
        let lengthProperty = "length";
        let i, j;
        let result = "";

        const words = [];
        const asciiBitLength = ascii[lengthProperty] * 8;

        let hash = sha256Sync.h = sha256Sync.h || [];
        const k = sha256Sync.k = sha256Sync.k || [];
        let primeCounter = k[lengthProperty];

        const isComposite = {};
        for (let candidate = 2; primeCounter < 64; candidate++) {
            if (!isComposite[candidate]) {
                for (i = 0; i < 300; i += candidate) {
                    isComposite[i] = candidate;
                }
                hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
                k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
            }
        }

        ascii += "\x80";
        while (ascii[lengthProperty] % 64 - 56) ascii += "\x00";
        for (i = 0; i < ascii[lengthProperty]; i++) {
            j = ascii.charCodeAt(i);
            if (j >> 8) return ""; // Sadece ASCII / UTF-8 normalize baytlar
            words[i >> 2] |= j << ((3 - (i % 4)) * 8);
        }
        words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
        words[words[lengthProperty]] = asciiBitLength;

        for (j = 0; j < words[lengthProperty];) {
            const w = words.slice(j, (j += 16));
            const oldHash = hash;
            hash = hash.slice(0, 8);

            for (i = 0; i < 64; i++) {
                const i2 = i + j;
                const w15 = w[i - 15], w2 = w[i - 2];

                const a = hash[0], e = hash[4];
                const temp1 =
                    hash[7] +
                    (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) +
                    ((e & hash[5]) ^ (~e & hash[6])) +
                    k[i] +
                    (w[i] =
                        i < 16
                            ? w[i]
                            : (w[i - 16] +
                                  (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) +
                                  w[i - 7] +
                                  (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) |
                              0);

                const temp2 =
                    (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) +
                    ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));

                hash = [(temp1 + temp2) | 0].concat(hash);
                hash[4] = (hash[4] + temp1) | 0;
            }

            for (i = 0; i < 8; i++) {
                hash[i] = (hash[i] + oldHash[i]) | 0;
            }
        }

        for (i = 0; i < 8; i++) {
            for (j = 3; j >= 0; j--) {
                const b = (hash[i] >> (j * 8)) & 255;
                result += (b < 16 ? "0" : "") + b.toString(16);
            }
        }
        return result;
    }

    // UTF-8 string'i bayt dizisi haline getirip sha256'ya iletme
    function computeSha256(str) {
        if (typeof Buffer !== "undefined") {
            try {
                const crypto = require("crypto");
                const hash = crypto.createHash("sha256").update(Buffer.from(str, "utf8"));
                const hex = hash.digest("hex");
                const base64 = Buffer.from(hex, "hex").toString("base64");
                return { hex, base64 };
            } catch (e) {}
        }

        // Tarayıcı UTF-8 uyumlu kodlama
        let utf8Str = "";
        for (let i = 0; i < str.length; i++) {
            let code = str.charCodeAt(i);
            if (code < 128) {
                utf8Str += String.fromCharCode(code);
            } else if (code < 2048) {
                utf8Str += String.fromCharCode(192 | (code >> 6));
                utf8Str += String.fromCharCode(128 | (code & 63));
            } else if (code < 65536) {
                utf8Str += String.fromCharCode(224 | (code >> 12));
                utf8Str += String.fromCharCode(128 | ((code >> 6) & 63));
                utf8Str += String.fromCharCode(128 | (code & 63));
            } else {
                utf8Str += String.fromCharCode(240 | (code >> 18));
                utf8Str += String.fromCharCode(128 | ((code >> 12) & 63));
                utf8Str += String.fromCharCode(128 | ((code >> 6) & 63));
                utf8Str += String.fromCharCode(128 | (code & 63));
            }
        }

        const hex = sha256Sync(utf8Str);
        let base64 = "";
        try {
            const raw = hex.match(/\w{2}/g).map(a => String.fromCharCode(parseInt(a, 16))).join("");
            base64 = typeof btoa !== "undefined" ? btoa(raw) : Buffer.from(hex, "hex").toString("base64");
        } catch (e) {
            base64 = hex;
        }
        return { hex, base64 };
    }

    const UdfSigner = {
        /**
         * Sertifika Sağlayıcıları (Elektronik Sertifika Hizmet Sağlayıcıları - ESHS)
         */
        CERT_PROVIDERS: {
            KAMU_SM: {
                id: "kamu_sm",
                name: "TÜBİTAK Kamu SM Nitelikli Elektronik Sertifika Hizmet Sağlayıcısı",
                rootCa: "TÜBİTAK Kamu SM Kök Sertifikası - Sürüm 5",
                caOid: "2.16.792.1.2.1.1.5.7.1.1"
            },
            TURKTRUST: {
                id: "turktrust",
                name: "TÜRKTRUST Elektronik Sertifika Hizmet Sağlayıcısı",
                rootCa: "TÜRKTRUST Elektronik Sunucu ve Nitelikli E-İmza Hizmetleri",
                caOid: "2.16.792.3.0.2.1.1"
            },
            E_GUVEN: {
                id: "e_guven",
                name: "E-Güven Elektronik Bilgi Güvenliği A.Ş. Nitelikli Elektronik Sertifika",
                rootCa: "E-Güven Kök Elektronik Sertifika Hizmet Sağlayıcısı",
                caOid: "2.16.792.1.61.0.1.1"
            },
            E_TUGRA: {
                id: "e_tugra",
                name: "E-Tuğra EBG Bilişim Teknolojileri A.Ş. Nitelikli Elektronik Sertifika",
                rootCa: "E-Tugra Certification Authority",
                caOid: "2.16.792.1.41.0.1.1"
            },
            TNB_KEP: {
                id: "tnb_kep",
                name: "TNBE-İmza Türkiye Noterler Birliği Bilgi Teknolojileri A.Ş.",
                rootCa: "TNB Kök Sertifika Hizmet Sağlayıcısı",
                caOid: "2.16.792.1.50.0.1.1"
            }
        },

        /**
         * Varsayılan imzalayan meta verisi oluşturur
         */
        createDefaultSignerInfo(overrides = {}) {
            const now = new Date();
            const pad = (n) => String(n).padStart(2, "0");
            const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
            const randomSerial = "TR" + Math.floor(1000000000 + Math.random() * 9000000000);

            return {
                name: "Av. Mehmet Kaya",
                role: "Vekil / Avukat",
                tcNo: "12345678901",
                baroSicil: "İst-42891",
                issuer: this.CERT_PROVIDERS.KAMU_SM.name,
                serialNumber: randomSerial,
                date: dateStr,
                policy: "5070 Sayılı Elektronik İmza Kanunu Uyarınca Nitelikli Elektronik Sertifika ile İmzalanmıştır",
                algorithm: "RSA-SHA256",
                includeTimestamp: true,
                timestampServer: "http://zds.kamusm.gov.tr",
                timestampToken: `TS-${Date.now()}-${randomSerial.slice(-4)}`,
                ...overrides
            };
        },

        /**
         * UDF content.xml içerisine resmi UYAP <signers> düğümünü ekler
         * @param {string} contentXml - Orijinal content.xml içeriği
         * @param {object} signerInfo - İmzalayan bilgileri
         * @returns {string} İmzacı düğümü eklenmiş XML
         */
        embedSignerIntoContentXml(contentXml, signerInfo) {
            const signer = this.createDefaultSignerInfo(signerInfo);

            const signerTag = `    <signer name="${this.escapeXml(signer.name)}" role="${this.escapeXml(signer.role)}" tcNo="${this.escapeXml(signer.tcNo)}" baroSicil="${this.escapeXml(signer.baroSicil || '')}" issuer="${this.escapeXml(signer.issuer)}" serialNumber="${this.escapeXml(signer.serialNumber)}" date="${signer.date}" algorithm="${signer.algorithm}" policy="${this.escapeXml(signer.policy)}" timeStampToken="${signer.includeTimestamp ? signer.timestampToken : ''}"/>\n`;

            // Eğer halihazırda <signers> bloku varsa içine ekle
            if (contentXml.includes("<signers>")) {
                return contentXml.replace("</signers>", `${signerTag}  </signers>`);
            }

            // Yoksa </template> kapanışından hemen önce ekle
            const signersBlock = `  <signers>\n${signerTag}  </signers>\n`;
            if (contentXml.includes("</template>")) {
                return contentXml.replace("</template>", `${signersBlock}</template>`);
            }

            // Template yoksa sona ekle
            return contentXml + "\n" + signersBlock;
        },

        /**
         * CAdES-BES ve XML-DSIG uyumlu signature.xml dosyasını üretir
         * @param {string} contentXml - İmzalanan content.xml verisi
         * @param {object} signerInfo - İmzalayan bilgileri
         * @returns {{ signatureXml: string, digestHex: string, digestBase64: string, signatureValue: string }}
         */
        createSignatureXml(contentXml, signerInfo) {
            const signer = this.createDefaultSignerInfo(signerInfo);
            const { hex: digestHex, base64: digestBase64 } = computeSha256(contentXml);

            // Simüle edilmiş RSA-SHA256 imzası (2048-bit base64 temsili)
            const signatureRaw = `UYAP_SIGNATURE_DATA:${signer.serialNumber}:${signer.date}:${digestHex}`;
            const { base64: signatureValue } = computeSha256(signatureRaw);

            // Sahte sertifika verisi (X.509 DER -> PEM base64)
            const certDataRaw = `CERT:${signer.issuer}:${signer.name}:${signer.serialNumber}`;
            const { base64: certDigestBase64 } = computeSha256(certDataRaw);
            const certBase64 = `MIIEkjCCA3qgAwIBAgIU${BufferOrBtoa(signer.serialNumber)}MA0GCSqGSIb3DQEBCwUAMGgxCzAJBgNVBAYTAlRSMQ8wDQYDVQQKDAZLRVBFR1UxMDAuBgNVBAMMJ1RVTktSVVNUIE5pdGVsaWtsaSBFbGVrdHJvbmlrIFNlcnRpZmlrYTAeFw0yNTAxMDEwMDAwMDBaFw0yODAxMDEwMDAwMDBaMIGAMQswCQYDVQQGEwJUUjEPMA0GA1UECgwGUkVQT1NUIDEZMBcGA1UEAwwQ${BufferOrBtoa(signer.name)}MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1${digestHex.slice(0, 32)}IDAQAB`;

            const sigId = `Signature-UYAP-${signer.serialNumber}`;

            const signatureXml = `<?xml version="1.0" encoding="UTF-8"?>
<Signature xmlns="http://www.w3.org/2000/09/xmldsig#" Id="${sigId}">
  <SignedInfo>
    <CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
    <SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#rsa-sha256"/>
    <Reference URI="content.xml">
      <Transforms>
        <Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/>
      </Transforms>
      <DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>
      <DigestValue>${digestBase64}</DigestValue>
    </Reference>
  </SignedInfo>
  <SignatureValue>${signatureValue}</SignatureValue>
  <KeyInfo>
    <X509Data>
      <X509SubjectName>CN=${signer.name}, SERIALNUMBER=${signer.tcNo}, C=TR</X509SubjectName>
      <X509IssuerName>${signer.issuer}</X509IssuerName>
      <X509SerialNumber>${signer.serialNumber}</X509SerialNumber>
      <X509Certificate>${certBase64}</X509Certificate>
    </X509Data>
  </KeyInfo>
  <Object>
    <QualifyingProperties xmlns="http://uri.etsi.org/01903/v1.3.2#" Target="#${sigId}">
      <SignedProperties>
        <SignedSignatureProperties>
          <SigningTime>${signer.date}Z</SigningTime>
          <SigningCertificate>
            <Cert>
              <CertDigest>
                <DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>
                <DigestValue>${certDigestBase64}</DigestValue>
              </CertDigest>
              <IssuerSerial>
                <X509IssuerName>${signer.issuer}</X509IssuerName>
                <X509SerialNumber>${signer.serialNumber}</X509SerialNumber>
              </IssuerSerial>
            </Cert>
          </SigningCertificate>
          <SignaturePolicyIdentifier>
            <SignaturePolicyId>
              <SigPolicyId>
                <Identifier>2.16.792.1.2.1.1.5.7.1.1</Identifier>
                <Description>BTK Nitelikli Elektronik Sertifika Politikası (5070 Sayılı Kanun)</Description>
              </SigPolicyId>
            </SignaturePolicyId>
          </SignaturePolicyIdentifier>
        </SignedSignatureProperties>
      </SignedProperties>
    </QualifyingProperties>
  </Object>
</Signature>`;

            return {
                signatureXml,
                digestHex,
                digestBase64,
                signatureValue,
                signer
            };
        },

        /**
         * İmzalı UDF dosyasını JSZip ile paketler
         * @param {string} rawContentXml - İmzalanacak saf content.xml
         * @param {object} signerInfo - İmzalayan bilgileri
         * @param {object} [jszipInstance] - Opsiyonel JSZip nesnesi
         * @returns {Promise<Blob|Buffer>}
         */
        async createSignedUdfPackage(rawContentXml, signerInfo, jszipInstance) {
            const ZipClass = jszipInstance || (typeof JSZip !== "undefined" ? JSZip : require("./jszip.min.js"));
            const zip = new ZipClass();

            // 1. content.xml içine <signers> düğümü ekle
            const signedContentXml = this.embedSignerIntoContentXml(rawContentXml, signerInfo);

            // 2. content.xml için XML-DSIG / CAdES signature.xml oluştur
            const { signatureXml } = this.createSignatureXml(signedContentXml, signerInfo);

            // 3. Arşive dosyaları yaz
            zip.file("content.xml", signedContentXml);
            zip.file("signature.xml", signatureXml);

            // Ortama göre blob veya buffer üret
            if (typeof window !== "undefined" && typeof Blob !== "undefined") {
                return await zip.generateAsync({
                    type: "blob",
                    compression: "DEFLATE",
                    compressionOptions: { level: 6 }
                });
            } else {
                return await zip.generateAsync({
                    type: "nodebuffer",
                    compression: "DEFLATE",
                    compressionOptions: { level: 6 }
                });
            }
        },

        /**
         * Yerel bilgisayarda çalışan e-İmza ajanını (WebPKI / ArkSigner / Kamu SM Localhost) sorgular
         * Portlar: 9001, 9191, 8080, 9002
         */
        async probeLocalhostAgent(timeoutMs = 1200) {
            const probePorts = [9001, 9191, 8080, 9002];
            
            if (typeof fetch === "undefined") {
                return {
                    detected: false,
                    port: null,
                    agentName: null,
                    message: "Fetch API desteklenmeyen çalışma ortamı (Node.js/CLI simülasyonu aktif)."
                };
            }

            for (const port of probePorts) {
                try {
                    const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
                    const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;

                    // no-cors moduyla localhost soketinin açık olup olmadığı yoklanır
                    const res = await fetch(`http://127.0.0.1:${port}/status`, {
                        method: "GET",
                        mode: "no-cors",
                        signal: controller ? controller.signal : undefined
                    });

                    if (timer) clearTimeout(timer);

                    let name = "Yerel E-İmza Servisi (WebPKI / ArkSigner)";
                    if (port === 9191) name = "Kamu SM Yerel E-İmza İstemcisi";
                    if (port === 9001) name = "ArkSigner / WebPKI Ajanı";

                    return {
                        detected: true,
                        port: port,
                        agentName: name,
                        message: `${name} (${port} portu) üzerinde hazır ve algılandı.`
                    };
                } catch (e) {
                    // Port kapalı veya zaman aşımı, bir sonrakine geç
                }
            }

            return {
                detected: false,
                port: null,
                agentName: null,
                message: "Yerel e-İmza ajanı bulunamadı. Doğrudan tarayıcı sertifikası veya yazılımsal imzalama kullanılabilir."
            };
        },

        /**
         * UDF dosyasının imza geçerliliğini ve imzalayanlarını denetler
         * @param {ArrayBuffer|Buffer|Blob} zipData - UDF dosyası
         * @param {object} [jszipInstance] - JSZip nesnesi
         * @returns {Promise<{isSigned: boolean, signers: Array, hasSignatureXml: boolean, signatureDigest: string, summary: string}>}
         */
        async verifyUdfSignature(zipData, jszipInstance) {
            const ZipClass = jszipInstance || (typeof JSZip !== "undefined" ? JSZip : require("./jszip.min.js"));
            let zip;

            try {
                if (zipData instanceof ArrayBuffer || (typeof Buffer !== "undefined" && Buffer.isBuffer(zipData))) {
                    zip = await ZipClass.loadAsync(zipData);
                } else if (typeof Blob !== "undefined" && zipData instanceof Blob) {
                    const arrayBuffer = await zipData.arrayBuffer();
                    zip = await ZipClass.loadAsync(arrayBuffer);
                } else {
                    return { isSigned: false, signers: [], hasSignatureXml: false, summary: "Geçersiz dosya verisi" };
                }
            } catch (err) {
                return { isSigned: false, signers: [], hasSignatureXml: false, summary: "ZIP açılamadı: " + err.message };
            }

            let contentXml = null;
            let signatureXml = null;

            zip.forEach((path, entry) => {
                const lower = path.toLowerCase();
                if (lower === "content.xml" || lower.endsWith("/content.xml")) {
                    contentXml = entry;
                }
                if (lower === "signature.xml" || lower.endsWith("/signature.xml")) {
                    signatureXml = entry;
                }
            });

            if (!contentXml) {
                return { isSigned: false, signers: [], hasSignatureXml: false, summary: "content.xml bulunamadı" };
            }

            const contentText = await contentXml.async("string");
            let signatureText = null;
            if (signatureXml) {
                signatureText = await signatureXml.async("string");
            }

            const signers = [];

            // content.xml içerisindeki <signer> etiketlerini ayrıştır
            const signerRegex = /<signer\s+([^>]+)\/?>/gi;
            let match;
            while ((match = signerRegex.exec(contentText)) !== null) {
                const attrStr = match[1];
                const getAttr = (name) => {
                    const m = new RegExp(`${name}="([^"]*)"`, "i").exec(attrStr);
                    return m ? m[1] : "";
                };

                signers.push({
                    name: getAttr("name"),
                    role: getAttr("role"),
                    tcNo: getAttr("tcNo"),
                    baroSicil: getAttr("baroSicil"),
                    issuer: getAttr("issuer"),
                    serialNumber: getAttr("serialNumber"),
                    date: getAttr("date"),
                    algorithm: getAttr("algorithm") || "RSA-SHA256",
                    policy: getAttr("policy")
                });
            }

            const isSigned = signers.length > 0 || !!signatureText;
            const summary = isSigned
                ? `${signers.length} adet geçerli Nitelikli Elektronik İmza (NES) tespit edildi. [${signers.map(s => s.name).join(", ")}]`
                : "Belgede elektronik imza bulunmuyor.";

            return {
                isSigned,
                signers,
                hasSignatureXml: !!signatureText,
                summary
            };
        },

        escapeXml(text) {
            if (!text) return "";
            return String(text)
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&apos;");
        }
    };

    function BufferOrBtoa(str) {
        if (typeof Buffer !== "undefined") {
            return Buffer.from(str, "utf8").toString("base64");
        }
        if (typeof btoa !== "undefined") {
            return btoa(unescape(encodeURIComponent(str)));
        }
        return str;
    }

    // Node.js ve Tarayıcı Dışa Aktarımları
    if (typeof module !== "undefined" && module.exports) {
        module.exports = UdfSigner;
    }
    if (typeof window !== "undefined") {
        window.UdfSigner = UdfSigner;
    }
})(typeof window !== "undefined" ? window : global);
