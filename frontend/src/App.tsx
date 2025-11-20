import React from "react";
import WalletConnectForm from "./components/WalletConnectForm";
import MessageSigner from "./components/MessageSigner";
import SignatureResult from "./components/SignatureResult";
import HistoryList from "./components/HistoryList";
import { WalletProvider } from "./hooks/useWallet";

function App() {
  return (
    <WalletProvider children={undefined}>
      <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
        <header className="text-3xl font-bold text-indigo-600 mb-6">Web3 Message Signer</header>
        <WalletConnectForm />
        <MessageSigner />
        <SignatureResult />
        <HistoryList />
      </div>
    </WalletProvider>
  );
}

export default App;
