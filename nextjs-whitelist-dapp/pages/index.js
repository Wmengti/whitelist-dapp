import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Web3Modal from 'web3modal';
import { providers, Contract } from 'ethers';
import { useState, useRef, useEffect } from 'react';

import whitelistABI from '../constants/WLabi.json';
import whitelistAddress from '../constants/WLaddress.json';

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);

  const [joinedWhitelist, setJoinedWhitelist] = useState(false);

  const [loading, setLoading] = useState(false);

  const [numberOfWhitelisted, setNumberOfWhitelisted] = useState(0);

  const web3ModalRef = useRef();
  if (typeof window !== 'undefined') {
    web3ModalRef.current = new Web3Modal({
      network: 'rinkeby',
      providerOptions: {},
      disableInjectedProvider: false,
    });
  }

  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 4) {
      window.alert('Change the network to Rinkeby');
      throw new Error('Change network to Rinkeby');
    }
    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  const addAddressToWhitelist = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(
        whitelistAddress,
        whitelistABI,
        signer
      );
      const tx = await whitelistContract.addAddressToWhitelist();
      setLoading(true);
      await tx.wait();
      setLoading(false);
      await getNumberOfWhitelisted();
      setJoinedWhitelist(true);
    } catch (e) {
      console.error(e);
    }
  };

  const getNumberOfWhitelisted = async () => {
    try {
      const provider = await getProviderOrSigner();
      const whitelistContract = new Contract(
        whitelistAddress,
        whitelistABI,
        provider
      );
      const _numberOfWhitelisted =
        await whitelistContract.numAddressesWhitelisted();
      setNumberOfWhitelisted(_numberOfWhitelisted);
    } catch (e) {
      console.error(e);
    }
  };
  const checkIfAddressInWhitelist = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(
        whitelistAddress,
        whitelistABI,
        signer
      );
      const address = await signer.getAddress();
      const _joinedWhitelist = await whitelistContract.whitelistedAddresses(
        address
      );

      setJoinedWhitelist(_joinedWhitelist);
      console.log(_joinedWhitelist);
    } catch (e) {
      console.error(e);
    }
  };
  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
      checkIfAddressInWhitelist();
      getNumberOfWhitelisted();
    } catch (e) {
      console.error(e);
    }
  };

  const renderButton = () => {
    if (walletConnected) {
      console.log('connect!');
      if (joinedWhitelist) {
        return (
          <div className={styles.description}>
            <strong>Thanks for Joined!</strong>
          </div>
        );
      } else if (loading) {
        return <button className={styles.button}>Loading...</button>;
      } else {
        return (
          <button onClick={addAddressToWhitelist} className={styles.button}>
            Join the Whitelist
          </button>
        );
      }
    } else {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connect your wallet
        </button>
      );
    }
  };

  useEffect(() => {
    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    if (!walletConnected) {
      connectWallet();
    }
  }, [walletConnected]);
  console.log(numberOfWhitelisted);
  return (
    <div>
      <Head>
        <title>WhiteList Dapp</title>
        <meta name='description' content='WhiteList-Dapp' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className={styles.container}>
        <div className={styles.main}>
          <h1 className={styles.title}>Welcome to Crypto Devs!</h1>
          <div className={styles.description}>
            It&apos;s an NFT collection for developers in Crypto.
          </div>
          <div className={styles.description}>
            <strong>{numberOfWhitelisted}</strong> have already joined the
            Whitelist.
          </div>
          {renderButton()}
        </div>
        <img
          className={styles.image}
          src='./crypto-devs.svg'
          alt='people have an NFT collection'
        />
        <footer className={styles.footer}>
          Made with&#10084; by Crypto Devs
        </footer>
      </div>
    </div>
  );
}
