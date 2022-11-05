import { Row, Col } from 'antd';

import UserInfo from '../UserInfo';
import RoomList from '../RoomList';
import styled from 'styled-components';

const SDiv_Sidebar = styled.div`
    background-image: url('https://i.pinimg.com/564x/8f/a9/3b/8fa93b4eb490a973a915a5d7b3d06301.jpg');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    color: #fff;
    height: 100vh;
`;

export default function Sidebar() {
    return (
        <SDiv_Sidebar>
            <Row>
                <Col span={24}>
                    <UserInfo />
                </Col>
                <Col span={24}>
                    <RoomList />
                </Col>
            </Row>
        </SDiv_Sidebar>
    );
}
