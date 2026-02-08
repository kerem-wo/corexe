# Netlify'a Yükleme (Deploy)

---

## 502 / Lambda hatası alıyorsanız

**Sebep:** Terminalden `netlify deploy --prod --dir=.next` ile yapılan manuel deploy, Netlify’da Next.js sunucu tarafını (Lambda) kurmaz. Bu yüzden 502 ve "invalid status code returned from lambda" hataları oluşur.

**Çözüm:** Siteyi **mutlaka GitHub üzerinden** Netlify’a bağlayıp **Git ile deploy** edin (aşağıdaki Yöntem 1). Netlify kendi sunucusunda `npm run build` çalıştırır ve Next.js eklentisi Lambda’yı doğru kurar; 502 ve favicon hataları böyle düzelir.

---

## Yöntem 1: Netlify Dashboard (Önerilen – 502’yi önler)

### 1. Kodu GitHub'a pushlayın

Proje henüz GitHub'da değilse:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADINIZ/corexe.git
git push -u origin main
```

### 2. Netlify'da site oluşturun

1. [app.netlify.com](https://app.netlify.com) adresine gidin ve giriş yapın (veya ücretsiz hesap açın).
2. **"Add new site"** → **"Import an existing project"** tıklayın.
3. **"Connect to Git provider"** → GitHub'ı seçin ve yetki verin.
4. **Repository** olarak `corexe` (veya repo adınızı) seçin.
5. **Branch**: `main` (veya kullandığınız branch).
6. **Build settings** (Netlify genelde Next.js'i otomatik algılar):
   - **Build command:** `npm run build`
   - **Publish directory:** Boş bırakın veya `.next` (Next.js eklentisi kullanılıyorsa otomatik ayarlanır).
7. **"Deploy site"** tıklayın.

### 3. Ortam değişkenleri (isteğe bağlı)

Admin paneli şifresini değiştirmek için:

1. Netlify'da sitenize gidin → **Site configuration** → **Environment variables**.
2. **Add a variable** → **Key:** `ADMIN_PASSWORD`, **Value:** istediğiniz şifre.
3. **Save** → **Trigger deploy** ile yeniden deploy edin.

---

## Yöntem 2: Netlify CLI (Sadece deneme – 502 riski var)

**Uyarı:** Manuel `--dir=.next` deploy 502 hatası verir. Canlı site için Yöntem 1 (Git) kullanın.

Terminalde:

```bash
# Netlify CLI kurulumu (bir kez)
npm install -g netlify-cli

# Netlify'a giriş (tarayıcı açılır)
netlify login

# Proje klasöründe
cd c:\Users\kerem\Desktop\corexe

# Yeni site oluşturup production deploy
netlify deploy --prod
```

İlk seferde “Link to existing project” veya “Create new site” seçmeniz istenir. **Create new site** seçip site adını yazın; ardından build alınır ve yayına alınır.

---

## Notlar

- **Admin paneli:** Netlify’da API route’lar çalışır; ancak `/api/site` için **PUT** (içerik güncelleme) sunucu dosya sistemine yazdığı için **kalıcı olmayabilir**. İçerik güncellemeleri için ileride veritabanı veya Netlify’ın form/backend özellikleri kullanılabilir.
- **Build süresi:** İlk deploy birkaç dakika sürebilir.
- **Domain:** Netlify otomatik bir `*.netlify.app` adresi verir; **Domain settings** üzerinden özel domain ekleyebilirsiniz.
