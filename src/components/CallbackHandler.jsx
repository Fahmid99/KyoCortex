import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dcpService from '../services/dcpService';

const CallbackHandler = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const { isAuthenticated } = await dcpService.isAuthenticated();
        if (isAuthenticated) {
          setIsLoggedIn(true);
          navigate('/dashboard');
        } else {
          console.error('Authentication failed');
          navigate('/');
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        navigate('/');
      }
    };

    checkAuthentication();
  }, [navigate, setIsLoggedIn]);

  return <div>Loading...</div>;
};

export default CallbackHandler;