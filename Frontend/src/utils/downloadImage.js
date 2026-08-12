export async function downloadImage(imageUrl, filename = 'frame-in-goa-builder-id.png') {
  const response = await fetch(imageUrl); if (!response.ok) throw new Error('Download failed');
  const blob = await response.blob(); const url = URL.createObjectURL(blob); const link = document.createElement('a');
  link.href = url; link.download = filename; link.style.display = 'none'; document.body.appendChild(link); link.click();
  link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
