import classNames from 'classnames/bind';
import classes from './Login.module.scss';
import { SmileOutlined } from '@ant-design/icons';
import { Typography, Button } from 'antd';
import { GoogleIcon, FacebookIcon } from '../Icons';
import { auth } from '~root/firebase/config';
import { addDocument, generateKeywords } from '~root/firebase/services';
import styled from 'styled-components';

const cx = classNames.bind(classes);
const fbProvider = new auth.FacebookAuthProvider();
const googleProvider = new auth.GoogleAuthProvider();

const SButton_ButtonLogin = styled(Button)`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 1.8rem 1.6rem;
    font-weight: 700;
    border: 1px solid rgb(207, 217, 222);
    border-radius: 9999px;
    transition: background-color 0.3s ease-in-out;

    & > span {
        margin-left: 0.8rem;
    }

    &:hover {
        color: #1b1c1b;
        cursor: pointer;
        background-color: rgb(230, 230, 230);
        border: 1px solid rgb(207, 217, 222);
    }

    &.logined {
        font-size: 1.2rem;
        font-weight: 600;
    }
`;

export default function Login() {
    const handleLogin = async (provider: any) => {
        const userCredentialData = await auth.signInWithPopup(auth.getAuth(), provider);
        const extraUserData = auth.getAdditionalUserInfo(userCredentialData);

        const newUser = {
            displayName: userCredentialData.user.displayName,
            email: userCredentialData.user.email,
            uid: userCredentialData.user.uid,
            photoURL: userCredentialData.user.photoURL,
            providerId: userCredentialData.providerId,
            keywords: generateKeywords(userCredentialData.user.displayName || ''),
        };

        if (extraUserData?.isNewUser) {
            addDocument('users', newUser);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('image')}>
                <div>
                    <img
                        src="https://i.pinimg.com/564x/8f/a9/3b/8fa93b4eb490a973a915a5d7b3d06301.jpg"
                        alt="bg-login"
                        className={cx('image__img')}
                    />
                </div>
            </div>
            <div className={cx('content')}>
                <div>
                    <SmileOutlined className={cx('content__icon')} style={{ color: 'var(--primary-color)' }} />
                    <Typography.Title
                        className={cx('content__title')}
                        style={{ fontSize: '6.8rem', fontWeight: 700, margin: ' 6.4rem 0', wordSpacing: '-2rem' }}
                    >
                        {"It's time to have fun !"}
                    </Typography.Title>
                    <Typography.Title
                        style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '3.2rem', wordSpacing: '-0.8rem' }}
                    >
                        Join Cheet Chat today
                    </Typography.Title>
                    <div className={cx('login')}>
                        <SButton_ButtonLogin
                            className={cx('login__btn')}
                            style={{ wordSpacing: ' -0.4rem' }}
                            onClick={() => {
                                handleLogin(googleProvider);
                            }}
                        >
                            <GoogleIcon width="2rem" height="2rem" />
                            Log in with Google
                        </SButton_ButtonLogin>
                        <div className={cx('separate')}>
                            <div className={cx('separate-line')}></div>
                            <p className={cx('separate-description')}>Or</p>
                            <div className={cx('separate-line')}></div>
                        </div>
                        <SButton_ButtonLogin
                            className={cx('login__btn')}
                            style={{ wordSpacing: ' -0.4rem' }}
                            onClick={() => {
                                handleLogin(fbProvider);
                            }}
                        >
                            <FacebookIcon width="2rem" height="2rem" />
                            Log in with Facebook
                        </SButton_ButtonLogin>
                        <Typography.Text className={cx('policy')}>
                            By logging in, you agree to the <p className={cx('policy__highlight')}>Terms of Service</p>{' '}
                            and <p className={cx('policy__highlight')}>Privacy Policy</p> , including{' '}
                            <p className={cx('policy__highlight')}>Cookie Use</p>.
                        </Typography.Text>
                    </div>
                    <Typography.Text className={cx('footer')}>© 2022 CheetChat, Inc.</Typography.Text>
                </div>
            </div>
        </div>
    );
}
