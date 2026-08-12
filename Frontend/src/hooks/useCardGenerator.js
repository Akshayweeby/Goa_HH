import { useState } from 'react';
import { generateCard } from '../api/cardService';

export default function useCardGenerator() {
  const [result, setResult] = useState(null); const [loading, setLoading] = useState(false); const [error, setError] = useState('');
  const generate = async (file, details) => {
    if (loading) return null;
    setLoading(true); setError(''); setResult(null);
    try { const next = await generateCard(file, details); setResult(next); return next; }
    catch (err) { setError(err.message || 'Something went wrong.'); return null; }
    finally { setLoading(false); }
  };
  return { result, loading, error, generate };
}
