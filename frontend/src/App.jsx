import React from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import AppRoutes from './routes/AppRoutes';
import { Toaster } from 'react-hot-toast';
import LoadingScreen from './components/Shared/LoadingScreen';

const Layout = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/lkev-admin');

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdmin && <Navbar />}
      <main className="flex-grow">
        <AppRoutes />
      </main>
      {!isAdmin && <Footer />}
      <Toaster position="bottom-right" />
    </div>
  );
};

function App() {
  const [appLoading, setAppLoading] = React.useState(true);

  return (
    <Router>
      <LoadingScreen onComplete={() => setAppLoading(false)} />
      {!appLoading && <Layout />}
    </Router>
  );
}

export default App;
