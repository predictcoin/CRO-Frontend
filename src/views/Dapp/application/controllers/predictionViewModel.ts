import { predict as predictUsecase } from "../usecases/prediction/predict";
import { withdraw as withdrawUsecase } from "../usecases/prediction/withdraw";
import { DIRECTION } from "../domain/prediction/entity";
import { PREDICTION_ADDRESSES, PREDICTION_TOKEN_ADDRESSES } from "../../constants/addresses";
import { SendParams } from "../../hooks/useTransaction";
import { usePredictionStore } from "../infrastructure/redux/stores/prediction";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { 
  getPastRounds as getPastRoundsAction, 
  initPrediction as initPredictionAction 
} from "../../application/infrastructure/redux/actions/prediction";
import { useWalletViewModel } from "./walletViewModel";
import { Prediction__factory } from "../../typechain";

export const usePredictionViewModel = () => {
  const predictionStore = usePredictionStore()
  const {available, currentRound} = predictionStore;
 	const { provider, active, address, signer} = useWalletViewModel();
  const dispatch = useDispatch();

  
  const contract = Prediction__factory.connect( PREDICTION_ADDRESSES[process.env.REACT_APP_ENVIRONMENT as keyof typeof PREDICTION_ADDRESSES], signer ? signer : provider );
  const predict = useCallback((
    token: keyof typeof PREDICTION_TOKEN_ADDRESSES, 
    direction: DIRECTION, 
    send: (params:SendParams) => Promise<void>,
    callbacks?: {[key: string]: () => void}
  ) => 
    predictUsecase({ active, token, direction, send, contract, available, currentRound: currentRound.epoch, callbacks }), 
    [active, contract, available, currentRound]);
    
  
  const withdraw = () => { withdrawUsecase() }
  
  const getPastRounds = useCallback(() => getPastRoundsAction( contract, address, active )(dispatch), [dispatch, contract, address, active]);

  const initPrediction = useCallback(() => initPredictionAction( contract, address, active )(dispatch), [dispatch, contract, address, active]);

  return{
    ...predictionStore,
    initPrediction,
    getPastRounds,
    predict,
    withdraw
  }
}
