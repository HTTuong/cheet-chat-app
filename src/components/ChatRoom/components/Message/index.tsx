import { Avatar, Typography } from 'antd';
import { IGif } from '@giphy/js-types';
import styled from 'styled-components';
import { Gif } from '@giphy/react-components';

interface IMessageProps {
    text: string;
    displayName: string;
    createdAt: string;
    photoURL: string;
    gif?: IGif;
}

Message.defaultProps = {};

const SDiv_Wrapper = styled.div`
    margin-bottom: 1rem;

    .author {
        margin-left: 0.5rem;
        font-weigh: bold;
    }

    .date {
        margin-left: 1rem;
        font-size: 1.1rem;
        color: #7a7a7a;
    }

    .content {
    }
`;

export default function Message(props: IMessageProps) {
    const Content = () => {
        if (props.gif) {
            return <Gif gif={props.gif} width={200} />;
        } else {
            return <Typography.Text className="content">{props.text}</Typography.Text>;
        }
    };

    return (
        <SDiv_Wrapper>
            <div>
                <Avatar src={props.photoURL ? props.photoURL : undefined}>
                    {props.photoURL ? '' : props.displayName?.charAt(0).toUpperCase()}
                </Avatar>
                <Typography.Text className="author">{props.displayName}</Typography.Text>
                <Typography.Text className="date">{props.createdAt}</Typography.Text>
            </div>
            <div style={{ marginLeft: '3.6rem', paddingRight: '3.6rem' }}>
                <Content />
            </div>
        </SDiv_Wrapper>
    );
}
