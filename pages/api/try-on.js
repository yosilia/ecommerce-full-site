export const config = { api: { bodyParser: { sizeLimit: '5mb' } } };

import fetch from 'node-fetch';

const MAX_POLL    = 40;    // allow up to 40s
const POLL_DELAY  = 1000;  // 1s between each poll

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow','POST');
    res.status(405).end('Method Not Allowed');
    return;
  }

  const { model_image_url, garment_image_url, category } = req.body;
  if (!model_image_url || !garment_image_url) {
    res.status(400).json({
      error: 'model_image_url and garment_image_url are required'
    });
    return;
  }

  const apiKey = process.env.FASHN_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'FASHN_API_KEY not set' });
    return;
  }

  try {
    // 1) Kick off the job
    const runResp = await fetch('https://api.fashn.ai/v1/run', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type':  'application/json',
        'Accept':        'application/json',
      },
      body: JSON.stringify({
        model_image:   model_image_url,
        garment_image: garment_image_url,
        category:      category || 'tops',
      }),
    });
    const runData = await runResp.json();
    if (!runResp.ok) {
      return res.status(runResp.status).json(runData);
    }

    const id = runData.prediction_id || runData.id;
    if (!id) {
      return res.status(502).json({ error: 'No prediction_id returned' });
    }

    // 2) Poll /v1/status/:id until completed or timeout
    let outputUrls = null;
    for (let i = 0; i < MAX_POLL; i++) {
      await new Promise(r => setTimeout(r, POLL_DELAY));

      const statusResp = await fetch(
        `https://api.fashn.ai/v1/status/${id}`,
        { headers: { 'Authorization': `Bearer ${apiKey}` } }
      );
      const statusData = await statusResp.json();

      if (!statusResp.ok) {
        return res.status(statusResp.status).json(statusData);
      }

      if (statusData.status === 'completed' && Array.isArray(statusData.output)) {
        outputUrls = statusData.output;
        break;
      }
      if (statusData.status === 'failed') {
        return res.status(500).json({ error: statusData.error || 'FASHN processing failed' });
      }
      // otherwise status is starting|in_queue|processing; loop again
    }

    if (!outputUrls || outputUrls.length === 0) {
      return res.status(504).json({ error: 'FASHN render timed out' });
    }

    // 3) Return the first output URL
    return res.status(200).json({ resultUrl: outputUrls[0] });
  } catch (err) {
    console.error('FASHN proxy exception:', err);
    return res.status(500).json({ error: err.message });
  }
}
