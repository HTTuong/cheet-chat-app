import React from 'react';
import { UserAddOutlined } from '@ant-design/icons';
import { Alert, Avatar, Button, Form, Input, Tooltip } from 'antd';
import { SmileOutlined, GifOutlined } from '@ant-design/icons';
import type { InputRef } from 'antd';
import styled from 'styled-components';
import AppContext from '~root/contexts/AppProvider';
import Message from '../Message';
import AuthContext, { ICurrentUser } from '~root/contexts/AuthProvider';
import { addDocument } from '~root/firebase/services';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '~root/firebase/config';
import { formatRelative } from 'date-fns';
import EmojiPicker from '~root/components/ChatRoom/components/EmojiPicker';
import { IGif } from '@giphy/js-types';
import SearchExperience from '../GridGIf';
import Loading from '../Loading';

export interface IMessage {
    date: string;
    id: React.Key | null | undefined;
    text: string;
    displayName: string;
    createdAt: { seconds: string };
    photoUrl: string;
    gif?: IGif | undefined;
}

const formatDate = (seconds: string) => {
    let formattedDate = '';
    const formatSeconds = +seconds;

    if (seconds) {
        formattedDate = formatRelative(new Date(formatSeconds), new Date());
        formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
    }

    return formattedDate;
};

const SDiv_Wrapper = styled.div`
    height: 100vh;
`;

const SDiv_Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 5.6rem;
    padding: 0 2rem;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;

    .header {
        &__info {
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        &__title {
            margin: 0;
            font-weight: bold;
        }

        &__description {
            font-size: 1.2rem;
        }
    }
`;

const SDiv_ButtonGroup = styled.div`
    display: flex;
    align-items: center;
`;

const SDiv_Content = styled.div`
    height: calc(100% - 5.6rem);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 0;
`;

const SDiv_MessageList = styled.div`
    max-height: 100%;
    overflow-y: auto;
    padding-left: 2rem;
    padding-bottom: 0;
`;

const SDiv_Form = styled(Form)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.2rem 0.2rem 0.2rem 0.2rem;
    border: 1px solid rgba(230, 230, 230);
    border-radius: 0.2rem;

    .ant-form-item {
        flex: 1;
        margin: 0;
    }
`;

export default function ChatWindow() {
    const { selectedRoom, members, setIsInviteModalVisible, selectedRoomId } = React.useContext(AppContext);
    const { currentUser } = React.useContext(AuthContext);
    const [messages, setMessages] = React.useState<any>();
    const [showEmoji, setShowEmoji] = React.useState<boolean>(false);
    const [showGif, setShowGif] = React.useState<boolean>(false);
    const inputRef = React.useRef<InputRef | null>(null);
    const messageListRef = React.useRef<any>(null);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [form] = Form.useForm();

    React.useLayoutEffect(() => {
        setIsLoading(true);

        const queryCollection = query(
            collection(db, 'message'),
            where('roomId', '==', selectedRoomId),
            orderBy('createdAt', 'asc'),
        );

        const unsubcribed = onSnapshot(queryCollection, (snapshot) => {
            const documents = snapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));

            setMessages(documents);
            setIsLoading(false);
        });

        return () => {
            unsubcribed();
        };
    }, [selectedRoomId]);

    // Auto scroll down
    React.useEffect(() => {
        if (messageListRef?.current) {
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight + 50;
        }
    }, [messages]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setShowEmoji(false);
        setShowGif(false);
    };

    const handleOnSubmit = () => {
        if (form.getFieldValue('message') === '' || form.getFieldValue('message') === undefined) {
            return;
        }

        addDocument('message', {
            text: form.getFieldValue('message'),
            displayName: currentUser.displayName,
            uid: currentUser.uid,
            photoUrl: currentUser.photoURL,
            roomId: selectedRoomId,
            date: formatDate(new Date().getTime().toString()),
        });

        form.resetFields(['message']);

        // Auto focus on input field after submission
        if (inputRef.current) {
            setTimeout(() => {
                inputRef.current?.focus();
            });
        }
    };

    const handleOnSubmitGif = (gif: IGif) => {
        addDocument('message', {
            gif: gif,
            displayName: currentUser.displayName,
            uid: currentUser.uid,
            photoUrl: currentUser.photoURL,
            roomId: selectedRoomId,
            date: formatDate(new Date().getTime().toString()),
        });

        // Auto focus on input field after submission
        if (inputRef.current) {
            setTimeout(() => {
                inputRef.current?.focus();
            });
        }
    };

    const handleSelect = (e: any) => {
        let value = form.getFieldValue('message');
        if (value) {
            value = value + e.native;
        } else {
            value = e.native;
        }
        form.setFieldValue('message', value);
        setShowEmoji(false);
    };

    return (
        <SDiv_Wrapper>
            {selectedRoom.id ? (
                <>
                    <SDiv_Header>
                        <div className="header__info">
                            <p className="header__title" style={{ wordSpacing: '-0.4rem' }}>
                                {selectedRoom?.name}
                            </p>
                            <span className="header__description">{selectedRoom?.description}</span>
                        </div>
                        <SDiv_ButtonGroup>
                            <Button
                                icon={<UserAddOutlined />}
                                type="text"
                                style={{
                                    marginRight: '1.2rem',
                                    fontSize: '1.6rem',
                                    height: '4rem',
                                    background: 'rgba(0, 0, 0, 0.04)',
                                }}
                                onClick={() => setIsInviteModalVisible(true)}
                            >
                                Add
                            </Button>
                            <Avatar.Group
                                size="large"
                                maxCount={2}
                                maxStyle={{ color: '#fff', backgroundColor: 'var(--primary-color)' }}
                            >
                                {members.map((member: ICurrentUser) => (
                                    <Tooltip key={member.uid} title={member.displayName}>
                                        <Avatar src={member.photoURL}>
                                            {member.photoURL ? '' : member.displayName.charAt(0).toLocaleUpperCase()}
                                        </Avatar>
                                    </Tooltip>
                                ))}
                            </Avatar.Group>
                        </SDiv_ButtonGroup>
                    </SDiv_Header>
                    {!isLoading && (
                        <SDiv_Content>
                            <SDiv_MessageList ref={messageListRef}>
                                {messages &&
                                    messages.map((message: IMessage) => {
                                        return (
                                            <Message
                                                key={message.id}
                                                text={message.text ?? message.text}
                                                displayName={message.displayName}
                                                createdAt={message.date}
                                                photoURL={message.photoUrl}
                                                gif={message.gif ?? message.gif}
                                            />
                                        );
                                    })}
                            </SDiv_MessageList>
                            <div style={{ padding: '2rem ', boxShadow: 'rgb(0 0 0 / 16%) 0px 1px 4px' }}>
                                <SDiv_Form form={form}>
                                    <Form.Item name="message">
                                        <Input
                                            placeholder="Enter a message"
                                            bordered={false}
                                            autoComplete="off"
                                            onChange={handleInputChange}
                                            onPressEnter={handleOnSubmit}
                                            ref={inputRef}
                                        />
                                    </Form.Item>
                                    <Button type="primary" onClick={handleOnSubmit}>
                                        Enter
                                    </Button>
                                </SDiv_Form>
                                <div style={{ padding: '8px 8px 0 4px', width: 'fit-content', display: 'flex' }}>
                                    <div className="emoji">
                                        <SmileOutlined
                                            onClick={() => {
                                                setShowEmoji((prev) => !prev);
                                                setShowGif(false);
                                            }}
                                        ></SmileOutlined>
                                        {showEmoji && (
                                            <div style={{ position: 'absolute', left: '2rem', bottom: '7.4rem' }}>
                                                <EmojiPicker onEmojiSelect={handleSelect} />
                                            </div>
                                        )}
                                    </div>
                                    <div
                                        className="giphy"
                                        style={{
                                            width: 360,
                                            marginLeft: '1.2rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <GifOutlined
                                            style={{ fontSize: '2rem' }}
                                            onClick={() => {
                                                setShowGif((prev) => !prev);
                                                setShowEmoji(false);
                                            }}
                                        />
                                        {showGif && (
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    left: '2rem',
                                                    bottom: '7.4rem',
                                                    backgroundColor: '#fff',
                                                    boxShadow: 'rgb(0 0 0 / 16%) 0px 1px 4px',
                                                    borderRadius: '4px',
                                                }}
                                            >
                                                <SearchExperience
                                                    handleOnSubmitGif={handleOnSubmitGif}
                                                    setShowGif={setShowGif}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </SDiv_Content>
                    )}
                    {isLoading && (
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: 'calc(100% - 5.6rem)',
                            }}
                        >
                            <Loading />
                        </div>
                    )}
                </>
            ) : (
                <Alert message="Please choose a room chat" type="info" showIcon style={{ margin: 5 }} closable />
            )}
        </SDiv_Wrapper>
    );
}
