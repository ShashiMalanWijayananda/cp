import React from 'react';
import {Navigate, Outlet, useLocation} from 'react-router-dom';
import {useLogin} from '../../context/login.context';
import {ProgressSpinner} from "primereact/progressspinner";

const AuthenticatedRoutes = () => {
    const {loading, isAuthenticated} = useLogin();
    const location = useLocation();

    if (loading) {
        return (
            <div
                className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
                <ProgressSpinner
                    style={{width: '50px', height: '50px'}}
                    strokeWidth="2"
                    fill="var(--surface-ground)"
                    animationDuration=".5s"
                />
            </div>
        );
    }


    if (!isAuthenticated) {
        return <Navigate to="/login" state={{from: location}} replace/>;
    }


    return <Outlet/>;
};

export default AuthenticatedRoutes;
