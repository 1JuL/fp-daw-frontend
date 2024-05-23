import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { ROUTES } from '../routes';
import { Button } from './Button';

const Menu = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(AuthContext);

  const gotoProfile = () => {
    navigate(ROUTES.PROFILE.path, { replace: true });
  };

  const gotoNewTweet = () => {
    navigate(ROUTES.NEW_TWEET.path, { replace: true });
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('token');
    navigate(ROUTES.LOGIN.path, { replace: true });
  };

  return (
    <div className="menu">
      <div className="menu-container">
        <span>{state.user ? `Logged in as: ${state.user.userName}` : 'Not logged in'}</span>
        <Button callback={gotoProfile} label="Profile" />
        <Button callback={gotoNewTweet} label="New Tweet" />
        <Button callback={logout} label="Logout" />
      </div>
    </div>
  );
};

export default Menu;
