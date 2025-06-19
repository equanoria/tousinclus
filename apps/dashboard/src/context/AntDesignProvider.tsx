import { StyleProvider, px2remTransformer } from '@ant-design/cssinjs';
import { ConfigProvider } from 'antd';
import { type ReactNode, createContext } from 'react';

const AntDesignContext = createContext({});

export const AntDesignProvider = ({ children }: { children: ReactNode }) => {
  return (
    <AntDesignContext.Provider value={{}}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#306EF0',
          },
        }}
      >
        <StyleProvider hashPriority="high" transformers={[px2remTransformer()]}>
          {children}
        </StyleProvider>
      </ConfigProvider>
    </AntDesignContext.Provider>
  );
};
