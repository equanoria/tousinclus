import { StyleProvider, px2remTransformer } from '@ant-design/cssinjs';
import { ConfigProvider } from 'antd';
import { type ReactNode, createContext } from 'react';
import { fr_FR_OVERRIDE } from '../locales/fr-FR';

const AntDesignContext = createContext({});

export const AntDesignProvider = ({ children }: { children: ReactNode }) => {
  return (
    <AntDesignContext.Provider value={{}}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#6200FF',
            fontSize: 16,
            fontFamily: 'Gotham',
            colorLink: '#6200FF',
          },
          cssVar: { key: 'app' },
        }}
        locale={fr_FR_OVERRIDE}
      >
        <StyleProvider hashPriority="high" transformers={[px2remTransformer()]}>
          {children}
        </StyleProvider>
      </ConfigProvider>
    </AntDesignContext.Provider>
  );
};
