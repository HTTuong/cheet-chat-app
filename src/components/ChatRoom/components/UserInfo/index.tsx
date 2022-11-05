import React from 'react';
import { Button, Avatar, Typography } from 'antd';
import { auth } from '~root/firebase/config';
import styled from 'styled-components';
import AuthContext from '~root/contexts/AuthProvider';

const SDiv_Wrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.2rem 1.6rem;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;

    .username {
        color: #fff;
        margin-left: 8px;
    }

    @media (max-width: 1000px) {
        .username {
            display: none;
        }
    }
`;

const handleSignOut = () => {
    auth.signOut(auth.getAuth());
};

export default function UserInfo() {
    const { currentUser } = React.useContext(AuthContext);

    return (
        <SDiv_Wrapper>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar src={currentUser.photoURL}>
                    {currentUser.photoURL ? '' : currentUser?.displayName?.charAt(0).toUpperCase()}
                </Avatar>
                <Typography.Text className="username">{currentUser.displayName}</Typography.Text>
            </div>
            <Button ghost onClick={handleSignOut}>
                Sign out
            </Button>
        </SDiv_Wrapper>
    );
}
