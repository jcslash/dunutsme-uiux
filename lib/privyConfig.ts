/**
 * Privy Configuration
 * 配置 Privy 認證選項和外觀
 */

import type { PrivyClientConfig } from '@privy-io/react-auth';

// Privy App ID
export const PRIVY_APP_ID = 'cmkzsquk8002ljm0c5h3jsk6y';

// Privy 配置選項
export const privyConfig: PrivyClientConfig = {
  // 外觀設定
  appearance: {
    theme: 'light',
    accentColor: '#FF6B9D', // glaze-pink
    logo: 'https://ui-avatars.com/api/?name=Donuts+Me&background=FF6B9D&color=fff&size=128&bold=true',
    showWalletLoginFirst: false,
  },
  // 登入方式
  loginMethods: [
    'email',
    'google',
    'apple',
    'wallet',
  ],
  // 嵌入式錢包設定
  embeddedWallets: {
    createOnLogin: 'users-without-wallets',
  },
  // 外部錢包設定
  externalWallets: {
    coinbaseWallet: {
      connectionOptions: 'smartWalletOnly',
    },
  },
};
