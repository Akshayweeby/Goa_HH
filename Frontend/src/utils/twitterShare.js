import { getCardShareUrl } from '../api/cardService';

export function shareToTwitter(shareId, name) {
  const text = `I just built my Builder ID for Frame in Goa 2026. Meet me there! 🏗️ #FrameInGoa`;
  const url = `https://twitter.com/intent/tweet?${new URLSearchParams({ text, url: getCardShareUrl(shareId) })}`;
  window.open(url, '_blank', 'noopener,noreferrer,width=640,height=520');
}
