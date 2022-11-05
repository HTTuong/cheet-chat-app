import { Row, Col } from 'antd';
import ChatWindow from './components/ChatWindow';
import Sidebar from './components/Sidebar';

const ChatRoom = () => {
    return (
        <Row>
            <Col span={6}>
                <Sidebar />
            </Col>
            <Col span={18}>
                <ChatWindow />
            </Col>
        </Row>
    );
};

export default ChatRoom;
