import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';

import PredictLogoSidebar from '../../../../assets/pics/PredictLogoSidebar.png';
import WalletIcon from '../../../../assets/appSvgs/WalletIcon';
import FarmingCard from '../../Components/FarmingCard';
import ModalConnect from '../../Components/CustomModal/ModalConnect';
import ModalDisconnect from '../../Components/CustomModal/ModalDisconnect';
import { TOKENS } from '../../constants/addresses';
import { useWalletViewModel } from '../../application/controllers/walletViewModel';
import useToken from '../../hooks/useToken';
import { ethers } from 'ethers';
import { displayDecimals } from '../../lib/utils/number';
import Header from '../../Components/Header';
import { useStakingViewModel } from '../../application/controllers/stakingViewModel';
import { WalletStatus } from '../../models/StakingCardModel';

interface FarmingMainContentProps {
	isSidebarExpanded: boolean;
	setIsSidebarExpanded: Dispatch<SetStateAction<boolean>>;
}

const FarmingMainContent: FC<FarmingMainContentProps> = ({
	isSidebarExpanded,
	setIsSidebarExpanded,
}) => {
	const [walletModal, setWalletModal] = useState<boolean>(false);
	const { chainId, active} = useWalletViewModel();
	const { farmingAvailable, isLoadingFarming, initFarming, farmingCardData, harvest } = useStakingViewModel();
	const { balance, decimals,  } = useToken(TOKENS[chainId].CRP)

	useEffect(() => {
		initFarming();
	}, [active])

	const modal = active ? (
		<ModalDisconnect closeModal={() => setWalletModal(false)} CRPBalance={ displayDecimals(ethers.utils.formatUnits(balance, decimals), 5) }/>
	) : (
		<ModalConnect closeModal={() => setWalletModal(false)} />
	);

	return (
		<section className='farming__main__content'>
			{walletModal && modal}

			<div className='container'>
				<Header 
					title="Farming" 
					subtitle="Farm $PRED with USDT" 
					isSidebarExpanded 
					setIsSidebarExpanded={setIsSidebarExpanded}
					setModalOpened={setWalletModal}
				/>
				<main>
					<div className='farming__card__container'>
						{farmingCardData && farmingCardData.map((card) => (
							<FarmingCard
								key={card.id}
								id={card.id}
								tokenName={card.tokenName}
								tokenMultiple={card.tokenMultiple}
								apr={card.apr}
								earned={card.earned}
								tokenPrice = {card.tokenPrice}
								totalUSDStaked={card.totalUSDStaked}
								contractUrl={card.contractUrl}
								USDStaked={card.USDStaked}
								walletUnlockStatus={active ? WalletStatus.unlocked : WalletStatus.locked}
								USDEarned={card.USDEarned}
								staked={card.staked}
								earn={card.earn}
								stake={card.stake}
								harvest={harvest}
								decimals={decimals}
							/>
						))}
					</div>
				</main>
			</div>
		</section>
	);
};

export default FarmingMainContent;
