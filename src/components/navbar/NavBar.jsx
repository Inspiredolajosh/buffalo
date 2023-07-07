// NavBar.jsx
import React from 'react';
import "./NavBar.css";

const NavBar = ({ connectWallet, defaultAccount, isConnected }) => {
  const truncateWalletAddress = (address) => {
    if (address) {
      const truncatedAddress = `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
      return truncatedAddress;
    }
    return null;
  };

  return (
    <div className="nav">
      <div className="container">
        <div className="btns">
          {isConnected ? (
            <button className="btn">{truncateWalletAddress(defaultAccount)}</button>
          ) : (
            <button className="btn" onClick={connectWallet}>Connect Wallet</button>
          )}

          <button className="btn">Disconnect wallet</button>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
