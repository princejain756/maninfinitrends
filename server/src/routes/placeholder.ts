import { Router } from 'express';

export const placeholderRouter = Router();

// Simple SVG placeholder generator
placeholderRouter.get('/:w/:h', (req, res) => {
  const w = Math.max(1, Math.min(4000, parseInt(String(req.params.w), 10) || 0));
  const h = Math.max(1, Math.min(4000, parseInt(String(req.params.h), 10) || 0));

  const bg = '#f3f4f6'; // gray-100
  const fg = '#9ca3af'; // gray-400
  const text = `${w}×${h}`;

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="100%" height="100%" fill="${bg}" />
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="${fg}"
        font-family="Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont" font-size="${Math.floor(Math.min(w, h) / 7)}">
    ${text}
  </text>
</svg>`;

  res.setHeader('Content-Type', 'image/svg+xml');
  // Cache aggressively — placeholders are deterministic
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  res.status(200).send(svg);
});

