import React from 'react';
import styled from 'styled-components';
import { Form, Modal, Select, Spin, Avatar } from 'antd';
import AppContext from '~root/contexts/AppProvider';
import { debounce } from 'lodash';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { db } from '~root/firebase/config';

interface IOption {
    label: string | React.ElementType;
    value: string;
    photoUrl: string;
}

type SearchFn = (value: IOption) => Promise<IOption[]>;

interface IDebounceSelect {
    fetchOptions: SearchFn;
    debounceTimeout: number;
    mode: 'multiple' | 'tags' | undefined;
    label: string;
    value?: string;
    placeholder: string;
    onChange: any;
    style: any;
}

DebounceSelect.defaultProps = {
    debounceTimeout: 300,
};

const SDiv_Select = styled(Select)`
    &&& {
        .ant-select-selection-item {
            height: unset;
            padding: 4px 8px;
        }

        .ant-select-selection-item-content {
            display: flex;
            align-items: center;
        }

        .ant-select-selection-item-remove {
            margin-left: 4px;
        }
    }
`;

// eslint-disable-next-line react/prop-types
function DebounceSelect({ fetchOptions, debounceTimeout = 300, ...props }: IDebounceSelect) {
    const [fetching, setFetching] = React.useState(false);
    const [options, setOptions] = React.useState([]);

    // Clear options when unmount
    React.useEffect(() => {
        return () => {
            setOptions([]);
        };
    }, []);

    const debounceFetcher = React.useMemo(() => {
        const loadOptions = (value: any) => {
            setOptions([]);
            setFetching(true);

            fetchOptions(value).then((newOptions: any) => {
                setOptions(newOptions);
                setFetching(false);
            });
        };

        return debounce(loadOptions, debounceTimeout);
    }, [debounceTimeout, fetchOptions]);

    return (
        <SDiv_Select
            labelInValue
            filterOption={false}
            onSearch={debounceFetcher}
            notFoundContent={fetching ? <Spin /> : null}
            {...props}
        >
            {options &&
                options.map((opt: IOption) => {
                    return (
                        <Select.Option key={opt.value} value={opt.value} title={opt.label}>
                            <Avatar size="small" src={opt.photoUrl} style={{ marginRight: '8px' }}>
                                {opt.photoUrl ? '' : typeof opt.label === 'string' && opt.label.charAt(0).toUpperCase()}
                            </Avatar>
                            {`${opt.label}`}
                        </Select.Option>
                    );
                })}
        </SDiv_Select>
    );
}

export function InviteModal() {
    const { isInviteModalVisible, setIsInviteModalVisible, selectedRoomId, selectedRoom } =
        React.useContext(AppContext);
    const [form] = Form.useForm();
    const [value, setValue] = React.useState<IOption[] & string>();

    const handleOk = () => {
        if (typeof value === 'undefined') {
            form.resetFields();
            setIsInviteModalVisible(false);
            return;
        }

        const newMember = value.map((member: IOption) => member.value);

        const roomRef = doc(db, 'rooms', selectedRoomId);
        setDoc(
            roomRef,
            {
                members: [...selectedRoom.members, ...newMember],
            },
            { merge: true },
        );

        // reset form
        form.resetFields();
        setIsInviteModalVisible(false);
    };

    const handleCancel = () => {
        form.resetFields();
        setIsInviteModalVisible(false);
    };

    const fetchUserList: SearchFn = async (value: IOption) => {
        const findedUser: { label: any; value: any; photoUrl: any }[] = [];
        const queryCollection = query(collection(db, 'users'), where('keywords', 'array-contains', value));

        const querySnapshot = await getDocs(queryCollection);
        querySnapshot.forEach((doc) => {
            if (!selectedRoom.members.includes(doc.data().uid)) {
                findedUser.push({
                    label: doc.data().displayName,
                    value: doc.data().uid,
                    photoUrl: doc.data().photoUrl,
                });
            }
        });

        return findedUser;
    };

    return (
        <div>
            <Modal title="Add member" open={isInviteModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Form form={form} layout="vertical">
                    <DebounceSelect
                        mode="multiple"
                        label="Members' name"
                        value={value}
                        placeholder="Enter member's name"
                        fetchOptions={fetchUserList}
                        onChange={(newValue: any) => setValue(newValue)}
                        style={{ width: '100%' }}
                    />
                </Form>
            </Modal>
        </div>
    );
}
