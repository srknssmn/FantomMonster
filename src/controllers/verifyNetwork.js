export const verifyNetwork = async () => {

    // Sepolia Network Verifying
    const fantomID = await '0xFAA5';
    const chainId = await window.ethereum.request({
        method: 'eth_chainId',
      });
    
    if (chainId === fantomID){
        console.log("Bravo!, you are on the correct network")
        
    } else {
  
        console.log("oulalal, switch to the correct network");
        
        try {
        
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: fantomID}],
            });
            console.log("You have succefully switched to Fantom Sonic Testnet")
        
        } catch (switchError) {
            
            // This error code indicates that the chain has not been added to MetaMask.
            if (switchError.code === 4902) {
                console.log("This network is not available in your metamask, please add it")

                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                        { chainId: '0xFAA5', 
                        chainName:'Fantom Sonic Builders Testnet',
                        rpcUrls:['https://rpc.sonic.fantom.network'],
                        nativeCurrency: {
                        symbol:'FTM', // 2-6 characters long
                    decimals: 18
                    }
                        
                        }],
                    });
                    } catch (addError) {
                        // handle "add" error
                        console.log(addError);
                    }
            }
        }
    }
};