const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000').replace(/\/$/, '');
const useMock = String(import.meta.env.VITE_USE_MOCK).toLowerCase() === 'true';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function generateCard(photoFile, details) {
  const { name, role, teamName } = details;
  if (useMock) {
    await wait(1200 + Math.random() * 700);
    const imageUrl = photoFile?.type === 'image/heic' || photoFile?.type === 'image/heif'
      ? 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=90'
      : URL.createObjectURL(photoFile);
    return { imageUrl, shareId: `goa-${crypto.randomUUID().slice(0, 8)}` };
  }

  const formData = new FormData();
  formData.append('photo', photoFile);
  formData.append('name', name);
  formData.append('role', role);
  formData.append('teamName', teamName || '');
  const response = await fetch(`${apiBaseUrl}/api/generate`, { method: 'POST', body: formData });
  let data;
  try { data = await response.json(); } catch { data = null; }
  if (!response.ok) {
    const detail = Array.isArray(data?.errors) ? data.errors.join(' ') : data?.detail || data?.error;
    throw new Error(detail || 'The card could not be generated. Please try again.');
  }
  if (!data?.imageUrl || !data?.shareId) throw new Error('The server returned an invalid card.');
  return { imageUrl: data.imageUrl, backImageUrl: data.backImageUrl, shareId: data.shareId, imageType: 'JPEG' };
}

export function getCardShareUrl(shareId) {
  return `${apiBaseUrl}/api/card/${encodeURIComponent(shareId)}`;
}
