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

  try {
    const { step, answer, token } = req.body;
    const now = Date.now();

    // Rate limit sederhana
    if (!global.lastRequest) global.lastRequest = {};
    const clientIp = req.headers['x-forwarded-for'] || 'local';
    if (global.lastRequest[clientIp] && now - global.lastRequest[clientIp] < 3000) {
      return res.status(429).json({ error: 'Rate limit. Tunggu 3 detik.' });
    }
    global.lastRequest[clientIp] = now;

    // Step 1: Tebak gambar - ikan cupang (PNG)
    if (step === 1) {
      if (!answer) {
        return res.status(400).json({ correct: false, message: 'Jawaban tidak boleh kosong' });
      }

      const normalize = (s) => s?.trim().toLowerCase().replace(/\s+/g, ' ');
      if (normalize(answer) === 'anak cupang' || normalize(answer) === 'cupang') {
        const step1Token = Buffer.from(JSON.stringify({
          step: 2,
          exp: now + 300000, // 5 menit
          hash: 'a1b2c3'
        })).toString('base64');

        return res.status(200).json({
          correct: true,
          token: step1Token,
          message: '✅ Benar! Lanjut ke Step 2...'
        });
      }
      return res.status(200).json({ correct: false, message: 'Coba lagi! Hint: ikan hias kecil yang agresif' });
    }

    // Step 2: Hitung huruf vokal
    if (step === 2) {
      if (!token) {
        return res.status(400).json({ correct: false, message: 'Token tidak valid. Ulangi dari Step 1.' });
      }

      try {
        const tokenData = JSON.parse(Buffer.from(token, 'base64').toString());
        if (tokenData.step !== 2 || tokenData.exp < now) {
          return res.status(400).json({ correct: false, message: 'Token expired atau tidak valid.' });
        }
      } catch (e) {
        return res.status(400).json({ correct: false, message: 'Token tidak valid.' });
      }

      if (!answer) {
        return res.status(400).json({ correct: false, message: 'Jawaban tidak boleh kosong' });
      }

      // "kecerdasan buatan" = 7 vokal (e, e, a, a, u, a, a)
      const normalize = (s) => s?.trim().toLowerCase().replace(/\s+/g, '');
      if (normalize(answer) === '7' || normalize(answer) === 'tujuh') {
        return res.status(200).json({
          correct: true,
          flag: "FLAG{anak_cupang}",
          message: "🎉 Selamat! Semua challenge selesai! Ini flag lo!"
        });
      }
      return res.status(200).json({ correct: false, message: 'Coba lagi! Hint: hitung huruf a, e, i, o, u' });
    }

    return res.status(400).json({ error: 'Step tidak valid' });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}
