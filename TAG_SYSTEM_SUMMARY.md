# BrandFlow Tag Sistemi - İşleyiş Özeti

## Genel Bakış

BrandFlow platformu, ürün yönetimini kolaylaştırmak için gelişmiş bir etiketleme (tagging) sistemi sunar. Bu sistem, ürünlerin kategorize edilmesi, filtrelenmesi ve toplu yönetimi için merkezi bir çözüm sağlar.

---

## 1. Tag Görüntüleme (Viewing Tags)

### Ürün Listesinde Tag Görünümü

Ürün tablosunda her ürünün sahip olduğu etiketler **renkli pill şeklinde** görüntülenir:

- **Varsayılan Görünüm**: İlk 3 etiket direkt görünür
- **Genişletilmiş Görünüm**: "+X more" butonuna tıklayarak tüm etiketler açılır
- **Görsel Kimlik**: Her etiket, kendine özgü bir renk koduna sahiptir (Best Seller: Kırmızı, Discounted: Yeşil, vb.)
- **Hızlı Erişim**: Etiketlerin üzerine gelindiğinde düzenleme ve silme aksiyonları görünür

### Tag Veritabanı

Sistem, merkezi bir tag veritabanı tutar:
- Her tag'in benzersiz bir adı ve rengi vardır
- Taglar tüm ürünler arasında paylaşılır
- Tag sayısı ve kullanım istatistikleri takip edilir

---

## 2. Tag Ekleme (Adding Tags)

### Yöntem 1: Ürüne Doğrudan Tag Ekleme

**Akış:**
1. Ürün satırındaki **"+ Add Tag"** butonuna tıklayın
2. Açılan popover'da:
   - Mevcut tagları arayın ve seçin
   - VEYA yeni bir tag adı yazarak oluşturun
3. Seçim yapıldığında tag anında ürüne eklenir

**Özellikler:**
- **Otomatik Tamamlama**: Yazarken mevcut taglar filtrelenir
- **Hızlı Oluşturma**: Yeni tag otomatik olarak varsayılan renk ile oluşturulur
- **Çoklu Seçim**: Popover açık kaldığı sürece birden fazla tag eklenebilir
- **Gerçek Zamanlı Güncelleme**: Değişiklikler anında yansır

### Yöntem 2: Toplu Tag Ekleme

Birden fazla ürüne aynı anda tag eklemek için:
1. Ürün checkbox'larını işaretleyin
2. Toplu aksiyon menüsünden **"Add Tags"** seçin
3. Uygulanacak tag(ları) seçin
4. Seçili tüm ürünlere tag eklenir

---

## 3. Tag Güncelleme (Updating Tags)

### Ürün Düzeyinde Güncelleme

**Tag Kaldırma:**
- Tag pill'in üzerine geldiğinizde **X ikonu** belirir
- X'e tıklayarak tag'i sadece o üründen kaldırabilirsiniz

**Tag Değiştirme:**
- Mevcut tag'i kaldırıp yeni tag ekleyin
- VEYA tag düzenleme modunu kullanın

### Tag Veritabanı Düzeyinde Güncelleme

Tag'in adını veya rengini değiştirmek için:

1. **Erişim**: Herhangi bir tag pill'in üzerindeki **Edit (kalem) ikonuna** tıklayın
2. **Düzenleme Popover'ı Açılır**:
   - **Tag Adı**: Yeni isim girin
   - **Renk Seçimi**: 8 renkli palet sunulur
   - Değişiklikler canlı olarak önizlenir
3. **Kaydetme**: "Save Changes" butonuna tıklayın
4. **Küresel Etki**: Tag adı/rengi değiştirildiğinde:
   - Tüm ürünlerdeki bu tag güncellenir
   - Aktif filtrelerdeki tag referansları otomatik güncellenir
   - UI anında yenilenir

**Önemli Not**: Tag düzenlemesi küreseldir - bir tag'in adını değiştirirseniz, bu değişiklik o tag'i kullanan tüm ürünlere yansır.

---

## 4. Tag Silme (Deleting Tags)

### Ürünlerden Tag Kaldırma

**Tekli Kaldırma:**
- Tag üzerine hover yapın → X ikonuna tıklayın
- Tag sadece o üründen kaldırılır, veritabanından silinmez

**Toplu Kaldırma:**
- Birden fazla ürün seçin
- Toplu aksiyon menüsünden "Remove Tag" seçin
- Kaldırılacak tag'i belirtin

### Tag Veritabanından Tamamen Silme

Tag'i sistemden kalıcı olarak silmek için:

1. Tag düzenleme popover'ını açın
2. Sağ üst köşedeki **Trash (çöp kutusu) ikonuna** tıklayın
3. **Onay Modalı** görünür:
   - Uyarı mesajı: "Bu aksiyon geri alınamaz"
   - Etkilenen ürün sayısı gösterilir
4. "Delete Tag" butonuna tıklayarak onaylayın

**Silme İşleminin Etkileri:**
- Tag veritabanından kalıcı olarak silinir
- Tüm ürünlerden otomatik olarak kaldırılır
- Aktif filtrelerden çıkarılır
- İlişkili raporlama verisi arşivlenir

---

## 5. Tag ile Ürün Arama (Searching Products by Tag)

### Filtre Sistemi

BrandFlow, gelişmiş bir tag filtreleme sistemi sunar:

#### Filtre Ekleme

1. **"+ Add Filter"** butonuna tıklayın
2. Sol panelden **"Tag List"** filtresini seçin
3. Sağ panel açılır:
   - Tüm mevcut taglar listelenir
   - Arama kutusu ile tagları filtreleyebilirsiniz

#### Match Modu Seçimi

Tag filtresinin iki çalışma modu vardır:

**Match Any (Herhangi Biri):**
- Seçili taglerden EN AZ BİRİNE sahip ürünleri gösterir
- VEYA mantığı ile çalışır
- Örnek: "Best Seller" VEYA "Discounted" tag'ine sahip ürünler

**Match All (Hepsi):**
- Seçili taglerin HEPSİNE sahip ürünleri gösterir
- VE mantığı ile çalışır
- Örnek: "Best Seller" VE "Discounted" VE "Organic" tag'lerine sahip ürünler

**Not**: Match modu seçeneği, **2 veya daha fazla tag seçildiğinde** otomatik olarak görünür.

#### Görsel Önizleme

Filtre yapılandırılırken:
- Seçili taglar renkli pill olarak görüntülenir
- Match modu (AND/OR) tag'ler arasında gösterilir
- "+X more" ile fazla tag'ler gösterilir

#### Filtre Uygulama

1. Tag'leri seçin ve match modunu ayarlayın
2. **"Apply"** butonuna tıklayın
3. Filtre, üst çubukta **chip olarak** eklenir:
   - Örnek: "Tag List: Best Seller, Discounted +2 more"
4. Ürün tablosu anında filtrelenir

### Filtre Chip Yönetimi

**Chip Görünümü:**
- Kompakt format: İlk 3 tag + sayaç
- Tooltip: Tüm tag listesi hover ile görünür

**Filtre Düzenleme:**
- Chip'e tıklayarak filtre popover'ı açılır
- Tag seçimlerini değiştirin
- Match modunu güncelleyin
- "Apply" ile kaydedin

**Filtre Kaldırma:**
- Chip'teki **X ikonuna** tıklayın
- Filtre anında kaldırılır, tablo güncellenir

### Çoklu Filtre Kombinasyonu

Birden fazla filtre türü birlikte kullanılabilir:

```
Tag List: Best Seller, Discounted
+ Status: Active
+ Price > $50
```

- Tüm filtreler **VE mantığı** ile birleşir
- Her filtre bağımsız olarak düzenlenebilir veya kaldırılabilir

### Filtre Çubuğu Dinamikleri

**Otomatik Sarma (Wrapping):**
- Filtreler çok yer kapladığında ikinci satıra taşar
- "Show All" / "Show Less" butonları otomatik görünür

**Show Less Modu:**
- İlk satıra sığan filtreler gösterilir
- Gizli filtre sayısı gösterilir

**Show All Modu:**
- Tüm filtreler görünür hale gelir
- Çoklu satır desteği

---

## Teknik Özellikler

### Performans
- Tag değişiklikleri gerçek zamanlı yansır
- Optimized rendering: Sadece etkilenen bileşenler güncellenir
- Debounced arama: Yazarken performans korunur

### Veri Tutarlılığı
- Tag isimleri benzersizdir (case-insensitive)
- Orphan tag'ler otomatik temizlenir
- Tag-ürün ilişkileri senkronize tutulur

### Kullanıcı Deneyimi
- Tüm aksiyonlar geri alınabilir (undo desteği planlanıyor)
- Hata durumlarında açıklayıcı mesajlar
- Loading state'leri ile görsel feedback
- Keyboard navigation desteği (ESC, Enter, Tab)

---

## Kullanım Senaryoları

### Senaryo 1: Yeni Ürün Batch'i İçin Tag Oluşturma

1. Ürün listesini açın
2. İlk ürünün "+ Add Tag" butonuna tıklayın
3. "Seasonal 2024" yazın ve oluşturun
4. Diğer ürünleri seçin (checkbox)
5. Toplu aksiyon → "Add Tag" → "Seasonal 2024"
6. Tüm ürünler etiketlenmiş olur

### Senaryo 2: Promosyon Ürünlerini Bulma ve Güncelleme

1. "+ Add Filter" → "Tag List"
2. "Discounted" tag'ini seçin
3. Apply → İndirimli ürünler listelenir
4. Yeni tag eklemek için: Ürünleri seçin → "Add Tag" → "Black Friday"
5. Promosyon bitince: "Discounted" tag'ini tüm ürünlerden kaldırın

### Senaryo 3: Tag Reorganizasyonu

1. "High Rated" tag'ini "Top Rated" olarak değiştirme:
   - Herhangi bir "High Rated" tag'ine tıklayın
   - Edit ikonuna tıklayın
   - İsmi "Top Rated" yapın, rengi güncelleyin
   - Save → Tüm ürünlerde otomatik güncellenir

2. Eski tag'leri temizleme:
   - Tag düzenleme popover'ı → Trash ikonu
   - Onay modalında "Delete Tag"
   - Sistem tag'i tüm ürünlerden kaldırır

---

## Öneriler ve Best Practices

### Tag Adlandırma
- Açıklayıcı ve kısa isimler kullanın (max 2-3 kelime)
- Tutarlı büyük/küçük harf kullanımı (Title Case önerilir)
- Kategorik düşünün: Kalite (Best Seller), Durum (New Arrival), Özellik (Organic)

### Renk Yönetimi
- İlgili tag'leri benzer renk tonlarında tutun
- Kırmızı: Uyarı/Özel dikkat (Limited Stock)
- Yeşil: Pozitif/Aktif (Best Seller, Organic)
- Mavi: Bilgilendirici (New Arrival)
- Mor: Premium/Özel (Exclusive)

### Filtre Stratejileri
- Sık kullanılan tag kombinasyonlarını not edin
- Raporlama için tag'leri standartlaştırın
- Periyodik olarak kullanılmayan tag'leri temizleyin

### Bakım ve Hijyen
- Aylık tag audit yapın (kullanılmayan tag'leri silin)
- Duplikasyon kontrolü (benzer anlamlı tag'leri birleştirin)
- Tag sayısını yönetilebilir seviyede tutun (önerilen: 15-25 tag)

---

## Gelecek Özellikler (Roadmap)

- **Tag Grupları**: Tag'leri kategorilere ayırma
- **Otomatik Tagging**: Ürün özelliklerine göre otomatik tag atama
- **Tag Analytics**: En çok kullanılan tag'ler, performans metrikleri
- **Toplu Tag İşlemleri**: CSV ile tag import/export
- **Tag Şablonları**: Hızlı tag set'leri (örn: "Yeni Ürün Paketi")
- **Smart Suggestions**: AI destekli tag önerileri

---

## Sonuç

BrandFlow tag sistemi, ürün yönetimini basitleştiren, esnek ve güçlü bir araçtır. Görüntüleme, ekleme, güncelleme, silme ve filtreleme işlemleri sezgisel arayüz ile hızlı ve verimli şekilde gerçekleştirilir. Sistem, hem tekil ürün düzeyinde hassas kontrol, hem de toplu işlemlerle ölçeklenebilir yönetim sağlar.
