import { useContext } from 'react';
import { AuthContext } from '../App';

function useAuth() {
  const { user, login, logout } = useContext(AuthContext);
  const isAuthenticated = !!user;

  return {
    user,
    login,
    logout,
    isAuthenticated
  }
}
  
export default useAuth;