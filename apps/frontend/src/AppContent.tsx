import { Routes, Route } from 'react-router-dom';
import { Contact } from './views/Contact/Contact';
import { Legal } from './views/Legal/Legal';
import { GameApp } from './GameApp';
import { Layout } from './layouts/Layout/Layout';

export const AppContent = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<GameApp />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/legal" element={<Legal />} />
      </Routes>
    </Layout>
  );
};
