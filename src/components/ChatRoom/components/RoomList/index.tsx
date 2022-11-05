import { Button, Typography, Collapse } from 'antd';
import { PlusSquareOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import React from 'react';
import AppContext from '~root/contexts/AppProvider';

const SDiv_Panel = styled(Collapse.Panel)`
    &&& {
        .ant-collapse-header,
        p {
            color: #fff;
        }

        .ant-collapse-content-box {
            padding: 0 4rem;
        }

        .add-room {
            color: #fff;
            padding: 0 1.2rem;
        }
    }
`;

const SLink_Room = styled(Typography.Link)<{ active: string }>`
    &&& {
        display: block;
        margin-bottom: 0.6rem;
        color: var(--text-color);
        color: ${(props) => (props.active === 'true' ? 'var(--text-color)' : '#fff')};
        text-shadow: ${(props) =>
            props.active === 'true'
                ? 'none'
                : '3px 0px 7px rgba(81, 67, 21, 0.8), -3px 0px 7px rgba(81, 67, 21, 0.8), 0px 4px 7px rgba(81, 67, 21, 0.8) '};
        padding: 12px 1.2rem;
        box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
        background-color: ${(props) => (props.active === 'true' ? 'rgba(255, 255, 255, 1)' : 'none')};
    }
`;

export default function RoomList() {
    const { rooms, setAddRoomVisible, setSelectedRoomId, selectedRoomId } = React.useContext(AppContext);

    const handleOpenAddRoom = () => {
        setAddRoomVisible(true);
    };

    return (
        <Collapse ghost defaultActiveKey={['1']}>
            <SDiv_Panel header="Rooms chat" key="1">
                {rooms.map((room) => (
                    <SLink_Room
                        key={room.id}
                        onClick={() => {
                            setSelectedRoomId(room.id);
                        }}
                        active={room.id === selectedRoomId ? 'true' : 'false'}
                    >
                        {room.name}
                    </SLink_Room>
                ))}
                <Button type="text" icon={<PlusSquareOutlined />} className="add-room" onClick={handleOpenAddRoom}>
                    Add a new room
                </Button>
            </SDiv_Panel>
        </Collapse>
    );
}
