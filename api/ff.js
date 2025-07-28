export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  const period = req.query.period === 'today' ? 'today' : 'week';
  const url = `https://www.jblanked.com/news/api/forex-factory/calendar/${period}/`;

  try {
    const r = await fetch(url, {
      headers: {
        'Authorization': `Api-Key ${process.env.JB_API_KEY}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    const text = await r.text();

    // CORS offen, oder setze hier deine Domäne
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Edge-Cache optional
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

    res.status(r.status).send(text);
  } catch (e) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(500).json({ error: String(e) });
  }
}
