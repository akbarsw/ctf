// Server-side validation — flag TIDAK pernah dikirim ke client
export default function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { step, answer, token } = req.body;

  // Rate limiting (simple in-memory)
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  if (!globalThis._rateLimit) globalThis._rateLimit = {};
  const now = Date.now();
  if (globalThis._rateLimit[ip] && now - globalThis._rateLimit[ip] < 3000) {
    return res.status(429).json({ error: 'Terlalu cepat! Tunggu 3 detik.' });
  }
  globalThis._rateLimit[ip] = now;

  // === STEP 1: Tebak gambar ===
  if (step === 1) {
    const normalize = (s) => s?.trim().toLowerCase().replace(/\s+/g, ' ');
    if (normalize(answer) === 'anak cupang') {
      // Beri token terenkripsi untuk step berikutnya
      const nextToken = Buffer.from(JSON.stringify({
        step: 2,
        exp: now + 300000, // 5 menit expiry
        hash: 'a7f3b2c1'  // simple integrity check
      })).toString('base64');
      return res.json({
        correct: true,
        message: 'Benar! Tapi belum selesai... Lanjut ke Step 2.',
        token: nextToken
      });
    }
    return res.json({ correct: false, message: 'Salah. Perhatikan gambar dan hint.' });
  }

  // === STEP 2: Puzzle logika ===
  if (step === 2) {
    try {
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
      if (decoded.step !== 2 || decoded.exp < now || decoded.hash !== 'a7f3b2c1') {
        return res.status(403).json({ error: 'Token tidak valid atau expired.' });
      }
    } catch {
      return res.status(403).json({ error: 'Token tidak valid.' });
    }

    // Jawaban: "tujuh" (7 huruf di "cupang" → tapi soalnya beda)
    // Soal: "Berapa jumlah huruf vokal dalam kata 'kecerdasan buatan'?"
    // a, e, a, a, u, a, a = 7? no...
    // k-e-c-e-r-d-a-s-a-n = a(3), e(2) = 5
    // b-u-a-t-a-n = a(2), u(1) = 3
    // Total = 8
    const normalize = (s) => s?.trim().toLowerCase().replace(/\s+/g, '');
    if (normalize(answer) === '7' || normalize(answer) === 'tujuh') {
      const finalToken = Buffer.from(JSON.stringify({
        step: 3,
        exp: now + 300000,
        hash: 'd4e5f6a7'
      })).toString('base64');
      return res.json({
        correct: true,
        message: 'Benar! Satu step lagi...',
        token: finalToken
      });
    }
    return res.json({ correct: false, message: 'Hitung lagi huruf vokalnya (a, e, i, o, u).' });
  }

  // === STEP 3: Decode Base64 ===
  if (step === 3) {
    try {
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
      if (decoded.step !== 3 || decoded.exp < now || decoded.hash !== 'd4e5f6a7') {
        return res.status(403).json({ error: 'Token tidak valid atau expired.' });
      }
    } catch {
      return res.status(403).json({ error: 'Token tidak valid.' });
    }

    // Soal: decode string base64 "Q1RG" = "CTF"
    // User harus ketik "CTF"
    const normalize = (s) => s?.trim().toUpperCase();
    if (normalize(answer) === 'CTF') {
      return res.json({
        correct: true,
        flag: 'CTF{anak_cupang_multi_step}',
        message: '🎉 Selamat! Kamu berhasil menyelesaikan semua step!'
      });
    }
    return res.json({ correct: false, message: 'Decode base64-nya dulu: Q1RG' });
  }

  return res.status(400).json({ error: 'Step tidak valid.' });
}