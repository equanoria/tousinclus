import { AppContent } from './AppContent';
import { AntDesignProvider } from './context/AntDesignProvider';
import { AppStateProvider } from './context/AppStateProvider';
import { AuthProvider } from './context/AuthProvider';

const App = () => {
  return (
    <AppStateProvider>
      <AuthProvider>
        <AntDesignProvider>
          <AppContent />
        </AntDesignProvider>
      </AuthProvider>
    </AppStateProvider>
  );
};

export default App;
