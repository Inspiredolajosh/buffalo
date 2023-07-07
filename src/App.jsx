import React, { useState, useEffect } from 'react';
import "./App.css";
import buffallo from "../src/assets/img/buffallo.png";
import Navbar from "../src/components/navbar/NavBar.jsx";
import { ethers } from 'ethers';
import abi from './Buffalo.json';

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contractAddress = '0xFDAdADaB4e5f5e7050Ce54d79631D381420E0F20'; // Replace with your deployed contract address
const contract = new ethers.Contract(contractAddress, abi, signer);

function App() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

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
      const price = ethers.utils.parseEther("0.0022");
      const transactionParameters = {
        value: price,
      };
  
      const transaction = await contract.claimAirdrop(transactionParameters);
      await transaction.wait();
  
      console.log("Airdrop claimed successfully!");
    } catch (error) {
      console.error(error);
      if (error.reason === "execution reverted: Already claimed airdrop") {
        setErrorMessage("Airdrop has already been claimed.");
      } else {
        setErrorMessage("Failed to claim airdrop, please check your connection.");
      }
    }
  };
  



  
  useEffect(() => {
    if (isConnected) {
      console.log("Wallet connected");
    } else {
      console.log("Wallet disconnected");
    }
  }, [isConnected]);

  const clearErrorMessage = () => {
    setErrorMessage(null);
  };

  const styles = {
    notification: {
      position: "fixed",
      top: "20px",
      right: "20px",
      backgroundColor: "#ff6961",
      color: "#fff",
      padding: "10px",
      borderRadius: "4px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
      fontFamily: "Poppins, sans-serif",
    },
    networkInfo: {
      backgroundColor: "#f5f5f5",
      color: "#333",
      padding: "10px",
      borderRadius: "4px",
      marginBottom: "10px",
      textAlign: "center",
      fontFamily: "Poppins, sans-serif",
    },
    message: {
      marginBottom: "5px",
    },
    dismissButton: {
      backgroundColor: "#fff",
      color: "#ff6961",
      border: "none",
      padding: "5px 10px",
      borderRadius: "4px",
      cursor: "pointer",
      fontFamily: "Poppins, sans-serif",
    },
  };

 
  return (
    <>
      <Navbar connectWallet={connectWallet} defaultAccount={defaultAccount} isConnected={isConnected} />
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

export default App;









// import React, { useState, useEffect } from 'react';
// import "./App.css";
// import buffallo from "../src/assets/img/buffallo.png";
// import Navbar from "../src/components/navbar/NavBar.jsx";
// import { ethers } from 'ethers';
// import abi from './Buffalo.json';

// const provider = new ethers.providers.Web3Provider(window.ethereum);
// const signer = provider.getSigner();
// const contractAddress = '0xFDAdADaB4e5f5e7050Ce54d79631D381420E0F20'; // Replace with your deployed contract address
// const contract = new ethers.Contract(contractAddress, abi, signer);

// function App() {
//   const [errorMessage, setErrorMessage] = useState(null);
//   const [defaultAccount, setDefaultAccount] = useState(null);
//   const [isConnected, setIsConnected] = useState(false);
//   const [isReloaded, setIsReloaded] = useState(false);
//   const [contractInstance, setContractInstance] = useState(null);

//   useEffect(() => {
//     const connectMetamask = async () => {
//       try {
//         if (window.ethereum) {
//           const chainId = '0x61'; // Binance Smart Chain Testnet chain ID
//           const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });

//           if (currentChainId === chainId) {
//             // Already on the BSC network, connect the wallet
//             const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
//             const account = accounts[0];
//             accountChanged(account);
//             console.log('Connected wallet address:', account); // Log the connected wallet address
//           } else {
//             const params = {
//               chainId,
//               chainName: 'BSC Testnet',
//               nativeCurrency: {
//                 name: 'BNB',
//                 symbol: 'BNB',
//                 decimals: 18,
//               },
//               rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
//               blockExplorerUrls: ['https://testnet.bscscan.com/'],
//             };

//             const pendingRequest = window.ethereum._state?.metamask?.pendingJsonRpcIds?.[0];
//             if (pendingRequest) {
//               await window.ethereum._metamaskApi.request({
//                 method: 'wallet_watchAsset',
//                 params: { type: 'ERC20', options: params },
//               });
//             } else {
//               await window.ethereum.request({
//                 method: 'wallet_addEthereumChain',
//                 params: [params],
//               });
//             }
//           }
//         } else {
//           setErrorMessage('Install MetaMask please');
//         }
//       } catch (error) {
//         console.error('Failed to connect wallet:', error);
//         setErrorMessage('Failed to connect wallet');
//       }
//     };

//     connectMetamask();
//   }, []);

//   const connectWallet = async () => {
//     try {
//       const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
//       const account = accounts[0];
//       accountChanged(account);
//     } catch (error) {
//       console.error('Failed to connect wallet:', error);
//       setErrorMessage('Failed to connect wallet');
//     }
//   };

//   const accountChanged = (accountName) => {
//     setDefaultAccount(accountName);
//     setIsConnected(true);
//     setIsReloaded(true);
//   };

//   useEffect(() => {
//     if (isReloaded) {
//       setIsReloaded(false);
//       setContractInstance(contract);
//       console.log('Contract connected successfully');
//       console.log('Contract address:', contract.address);
//     }
//   }, [isReloaded, contract]);

//   const claimAirdrop = async () => {
//     try {
//       if (!contractInstance) {
//         throw new Error('Contract instance not available');
//       }
  
//       const price = ethers.utils.parseEther("0.0022");
//       const transactionParameters = {
//         value: price,
//       };
  
//       const contractWithSigner = contractInstance.connect(signer);
//       const transaction = await contractWithSigner.claimAirdrop(transactionParameters);
//       await transaction.wait();
  
//       console.log("Airdrop claimed successfully!");
//     } catch (error) {
//       console.error(error);
//       setErrorMessage("Failed to claim airdrop, please check your connection.");
//     }
//   };
  

  // return (
  //   <>
  //     <Navbar connectWallet={connectWallet} defaultAccount={defaultAccount} isConnected={isConnected} />
  //     <div className="app">
  //       <div className="container">
  //         <img src={buffallo} alt="Buffalo" />
  //         <div className="buttons">
  //           <button className="btn" onClick={claimAirdrop}>Claim airdrop</button>
  //         </div>
  //       </div>
  //     </div>
  //   </>
  // );
// }

// export default App;
