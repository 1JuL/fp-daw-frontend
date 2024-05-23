import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './Button';
import { AuthContext } from './AuthContext';
import { ROUTES } from '../routes';

const Menu = ({ page }) => {
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);

  const goto_Home = () => {
    navigate(ROUTES.HOME.path, { replace: true });
  }
  const goto_Overview = () => {
    navigate(ROUTES.OVERVIEW.path, { replace: true });
  }
  const goto_Profile = () => {
    navigate(ROUTES.PROFILE.path, { replace: true });
  }
  const goto_Login = () => {
    navigate(ROUTES.OVERVIEW.path, { replace: true });
  }
  const goto_Signup = () => {
    navigate(ROUTES.PROFILE.path, { replace: true });
  }
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('token');
    navigate(ROUTES.LOGIN.path, { replace: true });
  }

  const renderButtons = () => {
    switch (page) {
      case 'home':
        return (
          <>
            <Button callback={goto_Login} label={"Login"} />
            <p>or</p>
            <Button callback={goto_Signup} label={"Signup"} />
          </>
        );
      case 'overview':
        return (
          <>
            <Button callback={goto_Home} label={"Home"} />
            <Button callback={goto_Profile} label={"Profile"} />
            <Button callback={logout} label={"Log Out"} />
          </>
        );
      case 'profile':
        return (
          <>
            <Button callback={goto_Home} label={"Home"} />
            <Button callback={goto_Overview} label={"Overview"} />
            <Button callback={logout} label={"Log Out"} />
          </>
        );
      default:
        return null;
    }
  }

  return (
    <div>
      {renderButtons()}
    </div>
  )
}

export default Menu;