import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import ai from "./images/ai.png";
import {PrivyProvider} from '@privy-io/react-auth';

import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <PrivyProvider
      appId="cme9ur99i00cajs0bajrfes5c"
      clientId="client-WY6Pexr7DUxbwpkFn2DPi4mnigdfAM15hVUWshpi3Cjdd"
      config={{

        //Display methods
        loginMethods: ["email", "wallet", "google", "tiktok", "github", "linkedin"],

        appearance: {
          theme: "light",
          accentColor: "#676FFF",
          logo: ai,
        },
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          ethereum: {
            createOnLogin: 'users-without-wallets'
          }
        }
      }}
    >
      <App />
    </PrivyProvider>
  </React.StrictMode>
);