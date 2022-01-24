import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';

import coinTabData from '../../data/coinTabData';
import CoinTab from '../../Components/CoinTab';
import WalletIcon from '../../../../assets/appSvgs/WalletIcon';
import PredictLogoSidebar from '../../../../assets/pics/PredictLogoSidebar.png';
import PricePredictionPast from './PricePredictionPast';
import PricePredictionOngoing from './PricePredictionOngoing';
import ModalConnect from '../../Components/CustomModal/ModalConnect';
import ModalDisconnect from '../../Components/CustomModal/ModalDisconnect';
import { walletViewModel } from "../../application/controllers/walletViewModel";
import { useWalletStore } from "../../models/infrastructure/redux/stores/wallet";
import { shortenAddress } from "../../lib/utils/address";
import { toast } from 'react-toastify';
import { ToastBody, STATUS, TYPE } from "../../Components/Toast";

interface PricePredictionMainContentProps {
	isSidebarExpanded: boolean;
	setIsSidebarExpanded: Dispatch<SetStateAction<boolean>>;
}

const PricePredictionMainContent: FC<PricePredictionMainContentProps> = ({
	isSidebarExpanded,
	setIsSidebarExpanded,
}) => {
	const { pathname } = useLocation();
	const [activeCard, setActiveCard] = useState<string>(coinTabData[0].id);
	const [modalOpened, setModalOpened] = useState<boolean>(false);
	const store = useWalletStore();
	const { active, address } = walletViewModel(store);
	const modal = active 
		? <ModalDisconnect closeModal={() => setModalOpened(false)}/>
		: <ModalConnect closeModal={() => setModalOpened(false)}/>;
	// active && setModalOpened(false);

	useEffect(() => {
		
	}, [activeCard]);

	const Body = ToastBody("Moving slowly", STATUS.PENDING, TYPE.SUCCESSFULL);

	return (
		<section className='price__prediction__main__content'>
			{modalOpened && modal}

			<div className='container'>
				<header>
					<button
						className='hamburger'
						onClick={() =>
							setIsSidebarExpanded((isSidebarExpanded) => !isSidebarExpanded)
						}
					>
						<div id='nav-icon1' className={isSidebarExpanded ? 'open' : ''}>
							<span></span>
							<span></span>
							<span></span>
						</div>
					</button>

					<div className='header__text'>
						<h1 onClick={() => toast(Body)}>Price prediction</h1>
						<p>Predict with $PRED, earn in $PRED or $BNB</p>
					</div>

					<div className='header__ctas'>
						<div className='wallet__price'>
							<img src={PredictLogoSidebar} alt='predict-coin-logo' />
							<p>25.08 PRED</p>
						</div>
						{/* add 'not__connected class if wallet is not connected' */}
						<button className={`address ${ !active && "not__connected" }`} onClick={() => setModalOpened(true)}>
							<WalletIcon />
							{active ? <span>{shortenAddress(address)}</span> : <span>Connect Wallet</span>}
						</button>
					</div>
				</header>

				<main>
					<div className='coins__to__predict'>
						<h1 className='title'>Coins to predict</h1>
						<div className='coins__to__predict__container'>
							{coinTabData.map((coin) => (
								<CoinTab
									key={coin.id}
									id={coin.id}
									coinName={coin.coinName}
									data={coin.data}
									active={activeCard === coin.id}
									setActive={setActiveCard}
								/>
							))}
						</div>
					</div>
					<div className='tab'>
						<Link
							to='ongoing-round'
							className={`${
								pathname === '/app/price-prediction' ||
								pathname === '/app/price-prediction/ongoing-round'
									? 'active'
									: ''
							}`}
						>
							ONGOING ROUND
						</Link>
						<Link
							to='past-rounds'
							className={`${
								pathname === '/app/price-prediction/past-rounds' ? 'active' : ''
							}`}
						>
							PAST ROUNDS
						</Link>
					</div>

					<Routes>
						{['/', '/ongoing-round'].map((path, index) => {
							return (
								<Route
									key={index}
									path={path}
									element={<PricePredictionOngoing />}
								/>
							);
						})}
						<Route path='/past-rounds' element={<PricePredictionPast />} />
					</Routes>
				</main>
			</div>
		</section>
	);
};

export default PricePredictionMainContent;
