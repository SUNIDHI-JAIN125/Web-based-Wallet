import React, { useState, useEffect } from 'react';
import './App.css'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { Keypair, PublicKey, Connection, clusterApiUrl } from '@solana/web3.js';
import { Buffer } from 'buffer';

const TOKEN_REGISTRY_URL = 'https://raw.githubusercontent.com/SUNIDHI-JAIN125/MetaData-Token/main/metadata.json';

const generateWallet = () => {
  const keypair = Keypair.generate();
  const secretKey = Buffer.from(keypair.secretKey).toString('hex');
  const address = keypair.publicKey.toBase58();
  
  return {
    address,
    secretKey
  };
};

const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

const App = () => {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [balance, setBalance] = useState(null);
  const [tokens, setTokens] = useState([]);
  const [tokenMetadata, setTokenMetadata] = useState(null);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch(TOKEN_REGISTRY_URL);
        const data = await response.json();
        setTokenMetadata(data); 
      } catch (error) {
        console.error('Failed to fetch token metadata', error);
      }
    };
    fetchMetadata();
  }, []);

  const createWallet = () => {
    setLoading(true);
    try {
      const data = generateWallet();
      setWallet(data);
      setBalance(null);
      setTokens([]);
      setError('');
    } catch (error) {
      toast.error('Failed to create wallet');
    } finally {
      setLoading(false);
    }
  };

  const fetchBalance = async () => {
    if (!wallet) return;
    try {
      const publicKey = new PublicKey(wallet.address);
      const lamports = await connection.getBalance(publicKey);
      setBalance(lamports / 1e9); 
      setError('');
    } catch (error) {
      toast.error('Failed to fetch balance');
    }
  };

  const fetchTokens = async () => {
    if (!wallet) return;
    try {
      const publicKey = new PublicKey(wallet.address);
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, { programId: new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb") });
      if (tokenAccounts.value.length === 0) {
        setTokens([]);
        setError('No tokens found');
      } else {
        setTokens(tokenAccounts.value.map(account => {
          const accountInfo = account.account.data.parsed.info;
          return {
            mint: accountInfo.mint,
            amount: accountInfo.tokenAmount.uiAmountString,
            symbol: tokenMetadata ? tokenMetadata.symbol : 'Unknown',
            name: tokenMetadata ? tokenMetadata.name : 'Unknown',
            image: tokenMetadata ? tokenMetadata.image : 'Unknown'
          };
        }));
        setError('');
      }
    } catch (error) {
      toast.error('Failed to fetch tokens');
    }
  };

  return (
    <div className="App">
      <h1>Initialize Your Solana Wallet!</h1>

      {!wallet ? (
        <div>
          <button 
            onClick={createWallet} 
            disabled={loading} 
            className="create-wallet-button"
          >
            {loading ? 'Creating wallet...' : 'Create Account'}
          </button>
          {error && <p className="error">{error}</p>}
        </div>
      ) : (
        <div className="wallet-details">
          <h2>Wallet Created</h2>
          <hr/>
          <p><strong>Address:</strong> {wallet.address}</p>
          <p><strong>Secret Key:</strong></p>
          <div className="secret-key">
            {wallet.secretKey}
          </div>

          <div className="fetch-buttons">
            <button 
              onClick={fetchBalance}
              className="fetch-balance-button"
            >
              Fetch Balance
            </button>
            <button 
              onClick={fetchTokens}
              className="fetch-tokens-button"
            >
              Fetch Tokens
            </button>
          </div>
          
          {balance !== null && (
            <div className="balance-info">
              <p><strong>Balance:</strong> {balance} SOL</p>
            </div>
          )}

          {tokens.length > 0 ? (
            <div className="tokens-list">
              <h3>Tokens:</h3>
              {tokens.map((token, index) => (
                <div key={index} className="token-item">
                 
                  <div className="token-info">
                    <p>
                      {/* <strong>Token:</strong>  */}
                      <img src={token.image} alt={token.name} className="token-image" />
                      <br/>
                      <a 
                        href={`https://explorer.solana.com/account/${token.mint}?cluster=devnet`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="token-link"
                      >
                        {token.name} ({token.symbol})
                      </a>
                    </p>
                    <p><strong>Amount:</strong> {token.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            error && <p className="no-tokens-found">{error}</p>
          )}
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default App;
