import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../components/AuthContext';
import { ROUTES } from '../../routes';
import { Button } from '../../components/Button';
import Logo from '../../assets/favicon.svg'
import './home.css'

const Home = () => {
    const { state, dispatch } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (state.isAuthenticated) {
            navigate(ROUTES.START.path, { replace: true });
        }
    }, [state.isAuthenticated, navigate]);

    const goto_Login = () => {
        navigate(ROUTES.LOGIN.path, { replace: true });
    }
    const goto_Signup = () => {
        navigate(ROUTES.SIGNUP.path, { replace: true });
    }

    return (
        <div className='container'>
            <img src={Logo} alt="Description of the image" />
            <div className='buttons-sign-login'>
                <Button callback={goto_Login} label={"Login"} />
                <p>or</p>
                <Button callback={goto_Signup} label={"Signup"} />
            </div>
        </div>
    )
}

export default Home;