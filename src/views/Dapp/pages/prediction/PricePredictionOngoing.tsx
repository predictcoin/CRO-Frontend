import { Dispatch, FC, SetStateAction, useState } from 'react';

import PredictionGraph from '../../Components/PredictionGraph';
import PredictionDetails, {
	RoundStatus,
} from '../../Components/PredictionDetails';

interface PredictionPriceProps {
	graphData: { x: string; y: number }[];
	graphMin: number;
	graphMax: number;
	activeCard: string;
	setActive: Dispatch<SetStateAction<string>>;
}

const PricePredictionOngoing: FC<PredictionPriceProps> = ({
	graphData,
	graphMin,
	graphMax,
	activeCard,
	setActive,
}) => {
	return (
		<div className='price__prediction__ongoing'>
			<div className='prediction__graph'>
				<PredictionGraph
					min={graphMin}
					max={graphMax}
					data={[{ id: 'Prediction Graph', data: graphData }]}
				/>
			</div>
			<div className='prediction__details'>
				<PredictionDetails
					status={RoundStatus.Ongoing}
					activeCard={activeCard}
					setActive={setActive}
				/>
			</div>
		</div>
	);
};

export default PricePredictionOngoing;
