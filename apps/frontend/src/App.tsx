import AppContent from './AppContent';
import { AppStateProvider } from './context/AppStateProvider';

const App = () => {
  return (
    <AppStateProvider>
      <AppContent />
    </AppStateProvider>
  );
};

export default App;
