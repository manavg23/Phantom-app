import { useEffect, useState } from "react";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import './App.css'
import { useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import * as anchor from '@project-serum/anchor'


const Connect2Phantom = () => {
    const [walletAvail, setWalletAvail] = useState(false);
    const [provider, setProvider] = useState(null);
    const [connected, setConnected] = useState(false);
    const [pubKey, setPubKey] = useState(null);
    const [balance, setBalance] = useState(null);

    useEffect(() => {
        if ("solana" in window) {
            const solWindow = window;
            if (solWindow?.solana?.isPhantom) {
                setProvider(solWindow.solana);
                setWalletAvail(true);
                // Attempt an eager connection
                solWindow.solana.connect({ onlyIfTrusted: true });
            }
        }
    }, []);

    useEffect(() => {
        provider?.on("connect", (publicKey) => {
            console.log(`connect event: ${publicKey}`);
            setConnected(true);
            setPubKey(publicKey);
             fetchBalance(publicKey);
        });
        provider?.on("disconnect", () => {
            console.log("disconnect event");
            setConnected(false);
            setPubKey(null);
        });
    }, [provider]);

    const connectHandler = (event) => {
        console.log(`connect handler`);
        console.log(pubKey)
        provider?.connect()
            .catch((err) => { console.error("connect ERROR:", err); });
    }
    const fetchBalance = async (publicKey) => {
        try {
            const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
            const balance = await connection.getBalance(new PublicKey(publicKey));
            setBalance(balance / LAMPORTS_PER_SOL); // Convert lamports to SOL
        } catch (error) {
            console.error("Error fetching balance:", error);
        }
    };


    const disconnectHandler = (event) => {
        console.log("disconnect handler");
        provider?.disconnect()
            .catch((err) => { console.error("disconnect ERROR:", err); });
            
    }

    return (
        <div className="connect-div">
            {walletAvail ?
                <>
                    <button className="connect-button btn btn-success" disabled={connected} onClick={connectHandler}>Connect to Phantom</button>
                    <button className="disconnect-button btn btn-error" disabled={!connected} onClick={disconnectHandler}>Disconnect from Phantom</button>
                    {connected ? <p>Your public key is : {pubKey?.toBase58()}</p> : null}
                    {balance !== null && <p>Balance: {balance} SOL</p>} {/* Display balance */}
                </>
                :
                <>
                    <p>Opps!!! Phantom is not available. Go get it <a href="https://phantom.app/">here</a>.</p>
                </>
            }
        </div>
    );
}

export default Connect2Phantom;
