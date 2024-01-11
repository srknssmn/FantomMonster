import { useState, useEffect } from 'react'
import './App.css'
import './css/style.css'
import Connect from './controllers/Connect';
import Buyers from './components/Buyers';
import {Contract} from './contracts/Contract';
import { ethers } from "ethers";
import MonsterPic from './images/Monster.jpg'

function App() {

  const [first, setfirst] = useState(false)
  const [monsterContract, setMonsterContract] = useState(null)
  const [account, setAccount] = useState(null)
  const [buyers, setBuyers] = useState([])
  const [monsterHealth, setMonsterHealth] = useState(null)
  const [monsterFirstHealth, setMonsterFirstHealth] = useState(null)
  const [walletAddress, setWalletAddress] = useState("")
  const [userPower, setUserPower] = useState(null)
  const [userHit, setUserHit] = useState(null)

  const newAccount = (provider) => {
    const contract = Contract();
    setMonsterContract(contract);
    setAccount(provider);
    setfirst(true)
  }

  const handleWalletAddress = (walletAddress) => {
    setWalletAddress(walletAddress)
  }

  const showHitters = async () => {
    const response = await monsterContract?.showCharsArray();
    setBuyers(response);
  }

  const showMonsterHealth = async () => {
    const monsterH = await monsterContract?.monsterHealth();
    const responseValue = await ethers.utils.formatEther(monsterH)
    const monsterHealthValue = await responseValue * 10**18
    setMonsterHealth(monsterHealthValue);
  }

  const showMonsterFirstHealth = async () => {
    const monsterH = await monsterContract?.monsterFirstHealth();
    const responseValue = await ethers.utils.formatEther(monsterH)
    const monsterHealthValue = await responseValue * 10**18
    setMonsterFirstHealth(monsterHealthValue);
  }

  const showUserPower = async () => {
    const signer = await account.getSigner();
    const ticketCount = await monsterContract?.playerPower(signer.getAddress());
    const responseValue = await ethers.utils.formatEther(ticketCount)
    const ticketValue = await responseValue * 10**18
    setUserPower(ticketValue);    
  }

  const showUserHit = async () => {
    const signer = await account.getSigner();
    const ticketCount = await monsterContract?.playerKick(signer.getAddress());
    const responseValue = await ethers.utils.formatEther(ticketCount)
    const ticketValue = await responseValue * 10**18
    setUserHit(ticketValue);    
  }

  const kickMonster = async () => {

    try {
      const txn = await monsterContract.kickMonster();
      await txn.wait();
      await console.log("success")
    } catch(error) {
      if ((error.code === "INSUFFICIENT_FUNDS") || (error.code === -32603) || (error.code === -32000)) {
        window.alert("You Don't Have Enough Money")
      }
    }
  }

  useEffect(() => {
    if (account) {
      showHitters();
      showMonsterHealth();
      showUserPower();
      showUserHit();
      showMonsterFirstHealth();
    }    
  });

  return (
    <>
      <Connect sendProvider={newAccount} sendWallet={handleWalletAddress}/>
      {/* <ShowWinner show={raffleContract} /> */}
        <div>
          <div className='mx-4 lg:mx-32 mt-8 lg:mt-12 mb-2 lg:mb-8 items-center justify-center flex flex-col'>
            <h1 className="text-3xl lg:text-6xl font-bold tracking-wider text-center">
              You Can Hit Monster!
            </h1>
            <img className='monsterPic rounded-lg drop-shadow-xl mt-8' src={MonsterPic} alt="" />
            
            { first ?

              <div>
                <div>
                  {/* Hit Monster Section */}
                  <div className='flex items-center justify-center my-8'>
                    <button className='hover:text-red-800 transition duration-500 tracking-widest rounded-lg border-2 border-red-800 px-10 py-2 text-2xl text-black font-bold' onClick={kickMonster}>KICK</button>
                  </div>

                  {/* Monster Info Section */}
                  <div className='my-6 p-2 lg:p-4 border-2 border-gray-400 rounded-lg'>
                    <h4 className="tracking-wider font-semibold text-xl underline">Monster Info:</h4>
                    <div className='flex flex-row space-x-2 my-3 items-center'>
                      <p className='font-bold tracking-wider'>Monster Health:</p>
                      <p className='text-sm lg:text-md'>{monsterHealth} / {monsterFirstHealth}</p>
                    </div>
                  </div>

                  {/* User Info Section */}
                  <div className='my-6 p-2 lg:p-4 border-2 border-gray-400 rounded-lg'>
                    <h4 className="tracking-wider font-semibold text-xl underline">User Info:</h4>
                    <div className='flex flex-row space-x-2 my-3 items-center'>
                      <p className='font-bold tracking-wider'>Wallet:</p>
                      <p className='text-sm lg:text-md'>{walletAddress}</p>
                    </div>
                    <div className='flex flex-row space-x-2 my-3 items-center'>
                      <p className='font-bold tracking-wider'>User Power:</p>
                      <p className='text-sm lg:text-md'>{userPower}</p>
                    </div>
                    <div className='flex flex-row space-x-2 my-3 items-center'>
                      <p className='font-bold tracking-wider'>User Hit Count:</p>
                      <p className='text-sm lg:text-md'>{userHit}</p>
                    </div>
                  </div>
                </div>
                <h2 className='text-center tracking-wider text-3xl font-bold'>All Players Info</h2>
                <div className='my-4 mx-4'>
                  {buyers.length > 0 ? <p>Total Players: {buyers.length}</p> : ""}
                </div>
                <div className='my-4 mx-4'>
                  <h4 className="tracking-wider font-semibold text-xl underline">Players List:</h4>
                  <Buyers buyersArray={buyers}/>
                </div>
              </div>

            :

              <div className='items-center mt-4 lg:mt-4 place-items-center content-center text-center'>
                <button disabled className='text-md lg:text-xl text-gray-500 border-2 border-blue-500 rounded-xl px-10 py-2 font-bold'>Let's Start with Wallet Connect</button>
              </div>
            }
          </div>
        </div>

    <div className='mt-10'>
      <footer id='contact' className="bg-white rounded-lg shadow dark:bg-gray-900 m-4">
        <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
            <div className="sm:flex sm:items-center sm:justify-between">
                <a href="/" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
                  <p className="text-2xl lg:text-3xl font-bold tracking-widest text-transparent bg-gradient-to-r bg-clip-text from-blue-800 to-gray-200">MONSTER</p>
                </a>
                <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
                    <li>
                        <a href="https://github.com/srknssmn" target="_blank" className="hover:underline me-4 md:me-6">Personal Github</a>
                    </li>
                    <li>
                        <a href="https://coinhunterstr.com/" target="_blank" className="hover:underline me-4 md:me-6">WEB</a>
                    </li>
                    <li>
                        <a href="https://twitter.com/CoinHuntersTR" target="_blank" className="hover:underline me-4 md:me-6">X (Twitter)</a>
                    </li>
                    <li>
                        <a href="https://www.youtube.com/@CoinHuntersTR" target="_blank" className="hover:underline me-4 md:me-6">Youtube</a>
                    </li>
                    <li>
                        <a href="https://twitter.com/CoinHuntersTR" target="_blank" className="hover:underline">Telegram</a>
                    </li>
                </ul>
            </div>
            <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
            <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 <a href="https://coinhunterstr.com/" target="_blank" className="hover:underline">CoinHunters™</a>. All Rights Reserved.</span>
        </div>
      </footer>
    </div>
    </>
  )
}

export default App