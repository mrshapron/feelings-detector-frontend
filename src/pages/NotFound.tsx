
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 page-transition">
      <div className="max-w-md w-full glass-card rounded-lg p-8 text-center animate-scale-in">
        <div className="h-16 w-16 bg-black rounded-full mx-auto mb-6"></div>
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">Oops! Page not found</p>
        <Button 
          onClick={() => navigate('/')}
          className="bg-black text-white hover:bg-black/90"
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
