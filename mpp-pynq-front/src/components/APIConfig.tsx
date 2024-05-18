import React, { useState } from 'react';
import { Collapse, Divider, Input, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { getStoredValue, setStoredValue } from '../lib/storage';
import { SettingDefaultValue, SettingType } from '../pages/CPUTable/components/Settings';



function APIUrlConfig() {

    const [apiUrl, setApiUrl] = useState<string>(
        getStoredValue(
            SettingType.API_CONFIG_URL,
            SettingDefaultValue.API_CONFIG_URL
        )
    );

    const handleApiUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStoredValue(
            SettingType.API_CONFIG_URL,
            e.target.value,
            setApiUrl
        );
    }

    return (
        <Input value={apiUrl} onChange={handleApiUrlChange} />
    )
}

function ReloadButton() {
    return (
        <Button
            icon={<ReloadOutlined />}
            onClick={() => window.location.reload()}
        >
            Reload
        </Button>
    )
}

export default function APIConfig() {
    return (
        <Collapse items={[{
            key: '1', label: 'API config', children: <>
                <Divider orientation="left" style={{ margin: 0 }}>API URL</Divider>
                <APIUrlConfig />
                <div style={{ height: 5 }} />
                <ReloadButton />
            </>
        }]} />
    )
}