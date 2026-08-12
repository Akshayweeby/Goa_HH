import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import CreateId from './pages/CreateId';
import Result from './pages/Result';
import { useState } from 'react';

export default function App() {
  const [generatedCard, setGeneratedCard] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/create" element={<CreateId setGeneratedCard={setGeneratedCard} />} />
        <Route path="/result" element={<Result generatedCard={generatedCard} />} />
      </Routes>
    </BrowserRouter>
  );
}
