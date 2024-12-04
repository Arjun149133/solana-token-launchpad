import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import TokenLaunchpad from "./components/TokenLaunchpad";

const SOLANA_DEVNET_RPC_URL = import.meta.env.VITE_SOLANA_DEVNET_RPC_URL;

function App() {
  return (
    <div>
      <ConnectionProvider endpoint={SOLANA_DEVNET_RPC_URL}>
        <WalletProvider wallets={[]} autoConnect>
          <WalletModalProvider>
            <div className=" px-7">
              <div className="flex py-7 justify-between">
                <WalletMultiButton />
                <WalletDisconnectButton />
              </div>
              <TokenLaunchpad />
            </div>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </div>
  );
}

export default App;
