import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import ChatRoom from './components/ChatRoom';
import 'antd/dist/antd.css';
import { AddRoomModal } from './components/Modals/AddRoomModal';
import { InviteModal } from './components/Modals/InviteModal';

export default function App() {
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/chatroom" element={<ChatRoom />} />
            </Routes>
            <AddRoomModal />
            <InviteModal />
        </div>
    );
}
