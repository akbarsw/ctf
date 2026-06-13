# Mini CTF — Multi Step Challenge

Beginner web CTF dengan 3 step:
1. **Tebak Gambar** — identifikasi objek pada gambar
2. **Hitung Vokal** — hitung huruf vokal dalam kalimat
3. **Decode Base64** — decode string yang di-encode

## Fitur Anti-Agent

- ✅ **Server-side validation** — flag tidak pernah ada di client code
- ✅ **Multi-step** — harus selesai step 1 dulu untuk lanjut
- ✅ **Token berexpiry** — token step sebelumnya expired dalam 5 menit
- ✅ **Rate limiting** — 3 detik antara setiap submit
- ✅ **State management** — agent harus maintain state antar step

## Deploy

```bash
# Deploy ke Vercel
vercel --prod
```

## Struktur

```
/
├── api/
│   └── check.js      # Serverless function (validasi jawaban)
├── index.html         # UI challenge
├── script.js          # Client-side logic
├── style.css          # Styling
├── betta.svg          # Gambar cupang
└── README.md
```

## Flag

Flag hanya dikirim oleh server jika semua step berhasil diselesaikan. Tidak ada di source code client.

## Credits

Dibuat sebagai latihan CTF untuk belajar web security.
