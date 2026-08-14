import { ConfigProvider } from 'antd';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from '@/auth/providers/JWTProvider';
import { LayoutProvider, LoadersProvider, MenusProvider, SettingsProvider, TranslationProvider } from '@/providers';
import { HelmetProvider } from 'react-helmet-async';

const queryClient = new QueryClient();

const antdTheme = {
  token: {
    colorPrimary: '#9C2249',
    colorPrimaryHover: '#81334C',
    colorPrimaryActive: '#81334C',
    borderRadius: 8,
  },
  components: {
    Button: {
      borderRadius: 2, // pill buttons everywhere, no need for shape="round" per-instance
    },
    Input: {
      borderRadius: 8,
    },
    Select: {
      borderRadius: 8,
    },
    Modal: {
      borderRadius: 16,
    },
  },
};

const ProvidersWrapper = ({ children }) => {
  return (
    <ConfigProvider theme={antdTheme}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SettingsProvider>
            <TranslationProvider>
              <HelmetProvider>
                <LayoutProvider>
                  <LoadersProvider>
                    <MenusProvider>{children}</MenusProvider>
                  </LoadersProvider>
                </LayoutProvider>
              </HelmetProvider>
            </TranslationProvider>
          </SettingsProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ConfigProvider>
  );
};

export { ProvidersWrapper };