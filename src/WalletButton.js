import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import './App.css'

const WalletButton = () => {
  const { connected, connect, disconnect } = useWallet();

  return (
    <WalletMultiButton
      onClick={() => {
        if (connected) {
          disconnect();
        } else {
          connect();
        }
      }}
    >
      {connected ? 'Disconnect Wallet' : 'Connect Wallet'}
    </WalletMultiButton>
  );
};

export default WalletButton;
