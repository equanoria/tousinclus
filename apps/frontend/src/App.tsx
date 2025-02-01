import { AppStateProvider } from './context/AppStateProvider';
import AppContent from './AppContent';

const App = () => {
  return (
    <AppStateProvider>
      <AppContent />
    </AppStateProvider>
  );
};

export default App;
