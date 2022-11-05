import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

const antIcon = <LoadingOutlined style={{ fontSize: 36 }} spin />;

export default function Loading() {
    return <Spin indicator={antIcon} />;
}
