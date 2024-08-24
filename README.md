# Solana Web-Based Wallet

## Overview

This project is a web-based wallet application built using React and Solana's Web3 library. The wallet allows users to create a new Solana wallet, view their SOL balance, and display SPL tokens associated with their wallet. The application fetches and shows token metadata, including images if available, or provides a link to the Solana Explorer for tokens with missing metadata.

## Features

- **Create Wallet**: Generate a new Solana wallet with a unique address and secret key.
- **View Balance**: Check the SOL balance of the created wallet.
- **Fetch Tokens**: Retrieve and display SPL tokens held by the wallet.
- **Metadata Display**: Show token details, including name, symbol, and image if metadata is available.
- **Fallback Link**: Provide a Solana Explorer link for tokens without available metadata.

## Lifecoin Token

In addition to general SPL tokens, this application features a custom token called **Lifecoin**. Lifecoin (symbol: LFC) has metadata associated with it, including a custom image. If you hold Lifecoin tokens, their details will be displayed with the image.

### Lifecoin Metadata Example

- **Name**: Lifecoin
- **Symbol**: LFC
- **Image**: ![Lifecoin Image](https://raw.githubusercontent.com/SUNIDHI-JAIN125/MetaData-Token/main/lifecoin%20.png)

## Installation and Running the Application

To get started with the application, follow these steps:

1. **Clone the Repository**

   ```bash
   git clone [repo link]

2. **Install Dependencies and run the prohect**

   ```bash
   npm install
   npm start

 ### Configuration
 If the metadata format for your tokens is different from Lifecoin's, you can try  updating the metadata URL in the App.js file:
 
   ```bash
   const TOKEN_REGISTRY_URL = 'https://your-metadata-url.json';
    
