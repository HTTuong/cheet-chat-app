import React from 'react';
import { useFirestore } from '~root/hooks/useFirestore';
import AuthContext from './AuthProvider';

export interface IRooms {
    name: string;
    description: string;
    members: string[];
    id: string;
}

interface IAppContext {
    rooms: IRooms[];
    isAddRoomVisible: boolean;
    setAddRoomVisible: React.Dispatch<React.SetStateAction<boolean>>;
    selectedRoomId: string;
    setSelectedRoomId: React.Dispatch<React.SetStateAction<string>>;
    selectedRoom: any;
    members: any;
    isInviteModalVisible: boolean;
    setIsInviteModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const DEFAULT_VALUE: IAppContext = {
    rooms: [],
    isAddRoomVisible: false,
    setAddRoomVisible: () => {},
    selectedRoomId: '',
    setSelectedRoomId: () => {},
    selectedRoom: {
        name: '',
        description: '',
        members: [],
        id: '',
    },
    members: [],
    isInviteModalVisible: false,
    setIsInviteModalVisible: () => {},
};

const AppContext = React.createContext<IAppContext>(DEFAULT_VALUE);

export const AppContextProvider: React.FC<{ children: any }> = ({ children }) => {
    const { currentUser } = React.useContext(AuthContext);

    const [isAddRoomVisible, setIsAddRoomVisible] = React.useState(false);
    const [isInviteModalVisible, setIsInviteModalVisible] = React.useState(false);
    const [selectedRoomId, setSelectedRoomId] = React.useState('');

    const roomsCondition = React.useMemo(
        () => ({
            fieldName: 'members',
            operator: 'array-contains',
            compareValue: currentUser.uid,
        }),
        [currentUser.uid],
    );

    const rooms = useFirestore('rooms', roomsCondition);

    const selectedRoom = React.useMemo(
        () => rooms!.find((room: { id: string }) => room.id === selectedRoomId) || {},
        [rooms, selectedRoomId],
    );

    const membersCondition = React.useMemo(
        () => ({
            fieldName: 'uid',
            operator: 'in',
            compareValue: selectedRoom?.members,
        }),
        [selectedRoom?.members],
    );
    const members = useFirestore('users', membersCondition);

    const values = {
        rooms,
        isAddRoomVisible,
        setAddRoomVisible: setIsAddRoomVisible,
        selectedRoom,
        selectedRoomId,
        setSelectedRoomId,
        members,
        isInviteModalVisible,
        setIsInviteModalVisible,
    };

    return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};

export default AppContext;
