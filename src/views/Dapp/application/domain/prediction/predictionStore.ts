import { BigNumber } from "ethers";
import { Prediction } from "../../../typechain";
import { PREDICTIONSTATE, Round } from "./entity";

export interface PredictionStore{
  available: boolean,
  state: PREDICTIONSTATE,
  betAmount: BigNumber,
  tokenMaxBet: BigNumber,
  intervalSeconds: BigNumber,
  betSeconds: BigNumber,
  bufferSeconds: BigNumber,
  userCurrentRound?: Prediction.BetInfoStructOutput
  currentRound: number;
  prediction: Prediction;
  rounds: {[key: string]: Round};
  isLoadingCurrent: boolean;
  isLoadingPast: boolean;
  pastAvailable: boolean;
  address: string;
};
