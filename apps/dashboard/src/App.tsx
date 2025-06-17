import { AppContent } from './AppContent';
import { AppStateProvider } from './context/AppStateProvider';
import { AuthProvider } from './context/AuthProvider';
import { AntDesignProvider } from './context/AntDesignProvider';

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
