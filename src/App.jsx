import React, { useState, useEffect } from 'react';
import "./App.css";
import buffallo from "../src/assets/img/buffallo.png";
import NavBar from "../src/components/navbar/NavBar.jsx";
import { ethers } from 'ethers';
import abi from './Buffalo.json';

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contractAddress = '0xBEcEDb58216A7E1dBe89c8e48d3Bf14960c6FA1a'; 
const contract = new ethers.Contract(contractAddress, abi, signer);

function App() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notification, setNotification] = useState(null);

  const connectWallet = () => {
    if (isConnected) {
      disconnectWallet();
    } else {
      if (window.ethereum) {
        window.ethereum
          .request({ method: "eth_requestAccounts" })
          .then((result) => {
            accountChanged(result[0]);
          })
          .catch((error) => {
            console.error(error);
            setErrorMessage("Failed to connect to the wallet.");
          });
      } else {
        setErrorMessage("Please install Metamask or another Ethereum wallet provider to connect.");
      }
    }
  };

  const disconnectWallet = () => {
    if (window.ethereum && window.ethereum.selectedAddress) {
      window.ethereum.selectedAddress = null;
    }
    setDefaultAccount(null);
    setIsConnected(false);
    setErrorMessage(null);
  };

  const accountChanged = (accountName) => {
    setDefaultAccount(accountName);
    setIsConnected(true);
  };

  const claimAirdrop = async () => {
    try {
      const network = await provider.getNetwork();
      const allowedNetworks = [56]; // Array of allowed network chainIds
  
      if (!allowedNetworks.includes(network.chainId)) {
        setErrorMessage("Please switch to the Binance mainnet to claim the airdrop.");
        return;
      }
  
      const price = ethers.utils.parseEther("0.0022");
      const transactionParameters = {
        value: price,
      };
  
      const signer = provider.getSigner();
      const contractWithSigner = contract.connect(signer);
      const transaction = await contractWithSigner.claimAirdrop(transactionParameters);
      await transaction.wait();
  
      setNotification("Airdrop claimed successfully!");
    } catch (error) {
      console.error(error);
      if (error.reason === "execution reverted: Already claimed airdrop") {
        setNotification("Airdrop has already been claimed.");
      } else {
        setErrorMessage("Failed to claim airdrop, please check your connection.");
      }
    }
  };
  

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const switchNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x38' }],
      });
      window.location.reload(); 
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to switch network. Please switch EVM Network to BSC in your wallet.");
    }
  };

  const closeErrorMessage = () => {
    setErrorMessage(null);
  };

  return (
    <>
      <NavBar
        connectWallet={connectWallet}
        defaultAccount={defaultAccount}
        isConnected={isConnected}
        disconnectWallet={disconnectWallet}
      />
      {notification && (
        <div style={styles.notification}>
          {notification}
        </div>
      )}
      {errorMessage && (
        <div style={styles.notification}>
          <span>{errorMessage}</span>
          <button
            className="close-button"
            style={styles.closeButton}
            onClick={closeErrorMessage}
          >
            X
          </button>
        </div>
      )}
      {!isConnected && (
        <div style={styles.networkInfo}>
          <p style={styles.message}>Connect to Binance mainnet to claim airdrop.</p>
          <button style={styles.switchButton} onClick={switchNetwork}>Switch Network to Binance</button>
          <br />
          <p style={styles.message}>After switching, connect your wallet and claim.</p>
        </div>
      )}
      <div className="app">
        <div className="container">
          <img src={buffallo} alt="Buffalo" />
          <div className="buttons">
            <button className="btn" onClick={claimAirdrop}>Claim airdrop</button>
          </div>
        </div>
      </div>
    </>
  );
}

const styles = {
  notification: {
    position: "fixed",
    top: "20px",
    right: "20px",
    backgroundColor: "#61dafb",
    color: "#333",
    padding: "10px",
    borderRadius: "4px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
    fontFamily: "Arial, sans-serif",
    fontSize: "15px",
  },
  closeButton: {
    marginLeft: "10px",
    backgroundColor: "#333",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: "20px",
    height: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "16px",
    cursor: "pointer",
  },
  networkInfo: {
    backgroundColor: "#f5f5f5",
    color: "#333",
    padding: "10px",
    borderRadius: "4px",
    marginBottom: "10px",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
  },
  message: {
    marginBottom: "5px",
    fontSize: "18px",
  },
  switchButton: {
    backgroundColor: "#000",
    color: "#61dafb",
    border: "none",
    padding: "5px 10px",
    borderRadius: "4px",
    cursor: "pointer",
    fontFamily: "Arial, sans-serif",
  },
};

export default App;
