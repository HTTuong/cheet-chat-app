import React from 'react';

import { Form, Modal, Input } from 'antd';
import AppContext from '~root/contexts/AppProvider';
import { addDocument } from '~root/firebase/services';
import { IRooms } from '~root/contexts/AppProvider';
import AuthContext from '~root/contexts/AuthProvider';

export function AddRoomModal() {
    const { isAddRoomVisible, setAddRoomVisible } = React.useContext(AppContext);
    const { currentUser } = React.useContext(AuthContext);
    const [form] = Form.useForm();

    const handleOk = () => {
        const newRoom: IRooms = {
            ...form.getFieldsValue(),
            members: [currentUser.uid],
        };
        addDocument('rooms', newRoom);

        // reset form
        form.resetFields();
        setAddRoomVisible(false);
    };

    const handleCancel = () => {
        form.resetFields();
        setAddRoomVisible(false);
    };

    return (
        <div>
            <Modal title="Create a new room" open={isAddRoomVisible} onOk={handleOk} onCancel={handleCancel}>
                <Form form={form} layout="vertical">
                    <Form.Item label="Room's name" name="name">
                        <Input placeholder="Enter a room's name" />
                    </Form.Item>
                    <Form.Item label="Description" name="description">
                        <Input.TextArea placeholder="Enter a room's description" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
