import AppContent from './AppContent';
import { AppStateProvider } from './context/AppStateProvider';
import { Layout } from './layouts/Layout';

const App = () => {
  return (
    <AppStateProvider>
     <Layout>
      <AppContent />
     </Layout>
    </AppStateProvider>
  );
};

export default App;
