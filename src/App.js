
import abi from './utils/BuyMeAChai.json';
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import './App.css';


function App() {

    // Contract Address & ABI
    // const contractAddress = "0x176Baa689D30a95a1b66bDC1d6B47D0ec3992036";
    const contractAddress = "0xBE5C509b24a64AD1c81867E7D9190016523c6827";
    const contractABI = abi.abi;
    const chaiOwnerName = "Pri";

    const[name, setName] = useState("");
    const[message, setMessage] = useState("");
    const[currentAccount, setCurrentAccount] = useState("");
    const [memos, setMemos] = useState([]);

    const onNameChange = (event) => {
       setName(event.target.value);
    };

    const onMessageChange = (event) => {
        setMessage(event.target.value);
    };

    /**
     * @dev Wallet Connection
     */
    const isWalletConnected = async () => { 
        console.log("isWalletConnected called"); 
        try {
            const {ethereum} = window;
            const accounts = await ethereum.request({nethod : "eth_accounts"});
            console.log("accounts: ", accounts);
            if(accounts.length > 0){
                const account = accounts[0];
                alert("Wallet is connected to " + account);
                console.log("wallet is connected! " + account);
            }else{
                alert("Make sure MetaMask is connected");
                console.log("make sure MetaMask is connected");
            }
        } catch (error) {
            console.log(error);
        }
    };
    /**
     * @dev connect the metamask Wallet
     */
    const connectWallet = async () => {
        console.log("connectWallet called");
       try {
         const {ethereum} = window;
         if(!ethereum){
             alert("Please install MetaMask");
             console.log("Please install MetaMask");
         }
 
         const accounts = await ethereum.request({method : "eth_requestAccounts"});
         setCurrentAccount(accounts[0]);
 
       } catch (error) {
            console.log(error);
       }
    };

    const getMemos = async () => {
        console.log("Fetching Memos called...");
        try {
            const {ethereum} = window;
            if(ethereum){
                const provider = new ethers.BrowserProvider(ethereum);
                const signer = provider.getSigner();
                const buyMeAChai = new ethers.Contract(
                    contractAddress,
                    contractABI,
                    signer
                );

                console.log("fetching memos from the blockchain...");
                const memos = await buyMeAChai.getMemos();
                console.log("fetched!");
                setMemos(memos);
            }else{
                console.log("Metamask is not connected");
            }
            
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        let buyMeAChai;
        isWalletConnected();
        getMemos();

        //Create an event handler function for when someone sends a memo
        const onNewMemo = (from, timestamp, name, message) => {
            console.log("Memo received: ", from, timestamp, name, message);
            setMemos((prevState) => [
               ...prevState,
               {
                   address: from,
                   timestamp: new Date(timestamp * 1000),
                   message,
                   name,
                   from,
               },
            ]);
        };

        const {ethereum} = window;
        //Listen for the new memo events
        if(ethereum){
            const provider = new ethers.BrowserProvider(ethereum);
            const signer = provider.getSigner();
            const buyMeAChai = new ethers.Contract(
                contractAddress,
                contractABI,
                signer
            );

            buyMeAChai.on("NewMemo", onNewMemo);
        }

        return () => {
            if(buyMeAChai){
                buyMeAChai.off("NewMemo", onNewMemo);
            }
        };

    }, [] );

    const buyChai = async () => {
        try{
            const {ethereum} = window;
            if(ethereum){
                const provider = new ethers.BrowserProvider(ethereum);
                const signer =  provider.getSigner(); //await provider.getSigner();
                const buyMeAChai = new ethers.Contract(
                    contractAddress, 
                    contractABI, 
                    signer
                );
                console.log("buying Chai..");

                const chaiTxn = await buyMeAChai.buyChai(
                    name ? name : "anon",
                    message ? message : "Enjoy your Chai!",
                    {value: ethers.parseEther("0.001")}
                );

                alert("Buying Chai. Please wait...Your chai is on its way!");
                await chaiTxn.wait();

                console.log("Chai purchased!", chaiTxn.hash);
                alert("Thanks for the chai! ");

                setName("");
                setMessage("");

            }
        }catch(error){
            console.log(error);
        }
    }

    return (
    <div className='App'>
        <title>Buy {chaiOwnerName} A Chai!</title>
        <button >I am here</button>
        <main className='main'>
            {currentAccount ? (
            <div>
            <form>
                <div>
                    <label> Name</label>
                    <br/>
                    <input type="text" id="name" placeholder='anon' onChange={onNameChange}/>
                </div>
                <div>
                    <label> Send {chaiOwnerName} a Message to go with the chai</label>
                    <br/>
                    <textarea rows="3" id="message" placeholder='Enjoy your Chai!' onChange={onMessageChange} required/>
                </div>
                <div>
                    <button type="button" id="button" onClick={buyChai}>
                        Send 1 Chai for 0.001 ETH
                        </button>
                </div>
            </form>
        </div>  
            )
            : (
                <button id="button" onClick={connectWallet}>Connect Wallet</button>
            )}
              
        </main>
        
       
            {currentAccount && <h1>Coffees Received</h1>}
            {currentAccount && memos.map((memo, index) => {
                return (
                    <div key={index} style={{border: "2px solid #eee", borderRadius: "5px", padding: "6px", margin: "6px"}}>
                        <p styles={{fontWeight: "bold"}}> {memo.message} </p>
                        <p> From : {memo.name} at: {memo.timestamp.toString()}
                        <br/>
                            Wallet Address: {memo.from}
                        </p>
                        </div>
                )
            }) }
       

    </div>
    );
}

export default App;