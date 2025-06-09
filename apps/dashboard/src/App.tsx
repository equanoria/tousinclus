import { AppContent } from './AppContent';
import { AppStateProvider } from './context/AppStateProvider';
import { AuthProvider } from './context/AuthProvider';

const App = () => {
  return (
    <AppStateProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </AppStateProvider>
  );
};

export default App;
