import React from 'react';
import { auth } from '~root/firebase/config';
import { Spin } from 'antd';
import { useNavigate } from 'react-router-dom';

export interface ICurrentUser {
    displayName: string;
    email: string;
    uid?: string;
    photoURL?: string;
}

interface IAuthContext {
    currentUser: ICurrentUser;
}

const DEFAULT_VALUE: IAuthContext = {
    currentUser: {
        displayName: '',
        email: '',
        uid: '',
        photoURL: '',
    },
};

const AuthContext = React.createContext<IAuthContext>(DEFAULT_VALUE);

export const AuthContextProvider: React.FC<{ children: any }> = ({ children }) => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = React.useState<ICurrentUser>({
        displayName: '',
        email: '',
        uid: '',
        photoURL: '',
    });
    const [isLoading, setIsLoading] = React.useState<boolean>(true);

    React.useLayoutEffect(() => {
        const unsubscribed = auth.onAuthStateChanged(auth.getAuth(), (user) => {
            if (user) {
                setCurrentUser({
                    displayName: user.displayName || '',
                    email: user.email || '',
                    uid: user.uid,
                    photoURL: user.photoURL || '',
                });
                navigate('/chatroom');
            } else {
                navigate('/');
            }
        });
        setIsLoading(false);

        return () => {
            unsubscribed();
        };
    }, [setCurrentUser, navigate]);

    const values = {
        currentUser,
    };
    return <AuthContext.Provider value={values}>{isLoading ? <Spin /> : children}</AuthContext.Provider>;
};

export default AuthContext;
