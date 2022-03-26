import { useCallback } from "react"
import { useDispatch } from "react-redux"
import { LOSER_PREDICTION_POOL_ADDRESSES, WINNER_PREDICTION_POOL_ADDRESSES } from "../../constants/addresses";
import { Explorers } from "../../constants/explorers";
import { getChainId } from "../../lib/utils/chain";
import {stake as stakeUsecase, unstake as unstakeUsecase, harvest as harvestUsecase} from "../usecases/predictionPools/others";
import PredictionPoolCardModel from "../../models/PredictionPoolCardModel";
import { LoserPrediction__factory, WinnerPrediction__factory } from "../../typechain";
import { initLoserPool as initLoserPoolAction,
  initWinnerPool as initWinnerPoolAction } from "../infrastructure/redux/actions/predictionPools"
import { useLoserPredictionStore, useWinnerPredictionStore } from "../infrastructure/redux/stores/predictionPools";
import { useWalletViewModel } from "./walletViewModel";
import useTransaction from "../../hooks/useTransaction";
import {
  getPastLoserPools as getPastLoserPoolsAction,
  getPastWinnerPools as getPastWinnerPoolsAction
} from "../infrastructure/redux/actions/predictionPools"
import stakingTableData from "../../data/stakingTableData";
import StakingDataModel from "../../models/StakingDataModel";

type addressType = keyof typeof LOSER_PREDICTION_POOL_ADDRESSES;
const env: addressType = (process.env.REACT_APP_ENVIRONMENT || "") as addressType;

export const useWinnerPredictionPoolViewModel = () => {
  const dispatch = useDispatch();
  const {address, provider, signer, active} = useWalletViewModel();
  const {send} = useTransaction();


  const store = useWinnerPredictionStore();
  const {currentPool, pools, rewardTokenPrice, pastPools} = store;

  const winnerContract = WinnerPrediction__factory.connect( 
    WINNER_PREDICTION_POOL_ADDRESSES[env], 
    signer || provider
  );

  const initWinnerPool = useCallback(
    () => initWinnerPoolAction(winnerContract, address, active)(dispatch), 
    [active, address, dispatch, winnerContract]
  );

  let pool = pools[currentPool];
  pool = pool || {}

  const stake = useCallback((tokenName:string, amount: string, humanAmount: string, pId?: number,  callbacks?: {[key: string]: () => void}) => {
    stakeUsecase({contract: winnerContract, pId: currentPool, tokenName, send, callbacks, amount, humanAmount})
  }, [currentPool, send, winnerContract] )
  const unStake = useCallback((tokenName:string, amount: string, humanAmount: string, pId?: number, callbacks?: {[key: string]: () => void}) => {
    unstakeUsecase({contract: winnerContract, pId: pId || currentPool, tokenName, send, callbacks, amount, humanAmount}, )
  },[currentPool, send, winnerContract])
  const harvest = useCallback((tokenName: string, pId?: number, callbacks?: {[key: string]: () => void}) => 
    harvestUsecase({contract: winnerContract, pId: pId || currentPool, tokenName, send, callbacks}), [currentPool, send, winnerContract]);
  const getPastWinnerPools = useCallback(() => 
    getPastWinnerPoolsAction(winnerContract, address, active)(dispatch), [active, address, dispatch, winnerContract]);

  const winnerCardData: PredictionPoolCardModel = {
    id: currentPool || 0,
    apr: pool.apr?.toFixed() || "0",
    contractUrl: `${Explorers[getChainId()]}address/${winnerContract.address}`,
    wonRound: pool.wonRound,
    round: pool.round,

    stakeToken: "CRP",
    stakeTokenPrice: pool.lpTokenPrice ? pool.lpTokenPrice.toFixed() : "0",
    USDStaked: pool.user$Staked ? pool.user$Staked.toFixed() : "0",
    staked: pool.userStaked ? pool.userStaked.toFixed() : "0",
    total$Staked:pool.total$Staked ? pool.total$Staked?.toFixed() : "0",
    totalStaked:pool.totalStaked ? pool.totalStaked?.toFixed() : "0",
    
    earnToken: "CRP",
    earned: pool.earned?.toFixed() || "0",
    USDEarned:pool.$Earned ? pool.$Earned?.toFixed() : "0",
    earnTokenPrice: rewardTokenPrice?.toFixed() || "0",
  };

  const pastWinnerPoolData: StakingDataModel[] = pastPools.map((no): StakingDataModel => {
    const pool = pools[no]
    return {
      stakingRound: pool.round.toString(),
      coinStaked: "CRP"
      coinStakedIcon: string;
      balance: number;
      earned: number;
      withdrawn: boolean | null;
    } 
  })  
    
  return{
    ...store,
    initWinnerPool,
    contract: winnerContract,
    cardData: winnerCardData,
    stake,
    unStake,
    harvest,
    getPastWinnerPools,
  }
}

export const useLoserPredictionPoolViewModel = () => {
  const dispatch = useDispatch();
  const {address, provider, signer, active} = useWalletViewModel();
  const store = useLoserPredictionStore();
  const {currentPool, pools, rewardTokenPrice} = store;
  const {send} = useTransaction();

  const loserContract = LoserPrediction__factory.connect( 
    LOSER_PREDICTION_POOL_ADDRESSES[env], 
    signer || provider
  );

  const initLoserPool = useCallback(
    () => initLoserPoolAction(loserContract, address, active)(dispatch), 
    [active, address, dispatch, loserContract]
  );

  let pool = pools[currentPool];
  pool = pool || {};

  const stake = (tokenName:string, amount: string, humanAmount: string, callbacks?: {[key: string]: () => void}) => {
    stakeUsecase({contract: loserContract, pId: currentPool, tokenName, send, callbacks, amount, humanAmount})
  }
  const unStake = (tokenName:string, amount: string, humanAmount: string, pId?: number, callbacks?: {[key: string]: () => void}) => {
    unstakeUsecase({contract: loserContract, pId: pId || currentPool, tokenName, send, callbacks, amount, humanAmount})
  }
  const harvest = (tokenName: string, pId?: number, callbacks?: {[key: string]: () => void}) => 
    harvestUsecase({contract: loserContract, pId: pId || currentPool, tokenName, send, callbacks});
  const getPastLoserPools = () => 
    getPastLoserPoolsAction(loserContract, address, active)(dispatch);

  const loserCardData: PredictionPoolCardModel = {
    id: currentPool,
    apr: pool.apr?.toFixed() || "",
    contractUrl: `${Explorers[getChainId()]}address/${loserContract.address}`,
    lostRound: pool.lostRound,
    round: pool.round,

    stakeToken: "CRP",
    stakeTokenPrice: pool.lpTokenPrice ? pool.lpTokenPrice.toFixed() : "0",
    USDStaked: pool.user$Staked ? pool.user$Staked.toFixed() : "0",
    staked: pool.userStaked ? pool.userStaked.toFixed() : "0",
    total$Staked:pool.total$Staked ? pool.total$Staked?.toFixed() : "0",
    totalStaked:pool.totalStaked ? pool.totalStaked?.toFixed() : "0",
    
    earnToken: "MMF",
    earned: pool.earned ?pool.earned?.toFixed() : "0",
    USDEarned:pool.$Earned ? pool.$Earned?.toFixed() : "0",
    earnTokenPrice: rewardTokenPrice?.toFixed() || "0",
  };

  return{
    initLoserPool,
    ...store,
    contract: loserContract,
    cardData: loserCardData,
    stake,
    unStake,
    harvest,
    getPastLoserPools
  }
}
