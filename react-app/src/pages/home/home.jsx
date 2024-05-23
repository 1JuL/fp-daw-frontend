import React from 'react';
import { useNavigate } from 'react-router-dom';
import Menu from '../../components/Menu';
import { ROUTES } from '../../routes';
import { Button } from '../../components/Button';

const Home = () => {
    const navigate = useNavigate();

    const goto_Login = () => {
        navigate(ROUTES.LOGIN.path, { replace: true });
    }
    const goto_Signup = () => {
        navigate(ROUTES.SIGNUP.path, { replace: true });
    }

    return (
        <div>
            <h1>Home</h1>
            <Button callback={goto_Login} label={"Login"} />
            <p>or</p>
            <Button callback={goto_Signup} label={"Signup"} />
        </div>
    )
}

export default Home;
