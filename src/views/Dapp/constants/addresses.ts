import { supportedChainIds } from "./chainIds"

export const SPORT_PREDICTION_ADDRESSES = {
  "mainnet": "0xC66091ba91A6Ae0Bfb1c21c422E8ebD95a131007", // to be replace with the final address
  "staging": "0xC66091ba91A6Ae0Bfb1c21c422E8ebD95a131007",
  "testnet": "",
}

export const SPORT_ORACLE_ADDRESSES = {
  "mainnet": "0x58EEbc2960ed8E7Ce86888FB4F78BC572eB70d36", // to be replace with the final address
  "staging": "0x58EEbc2960ed8E7Ce86888FB4F78BC572eB70d36",
  "testnet": "",
}

export const PREDICTION_ADDRESSES = {
  "mainnet" : "0xC80c40C49a66a930ef42652FFCcBE37b5ed43D67",
  "staging": "0x3b4BA9C354376e16a36535Be332CED5a03cE1256",
  "testnet" : "0xB09A1F4ee02a803A6c618aBd7e5F791ca8D9b936"
}

export const MMFROUTER_ADDRESSES = {
  [supportedChainIds.Mainnet]: "0x145677FC4d9b8F19B5D56d1820c48e0443049a30",
  [supportedChainIds.Testnet]: ""
}

export const STAKING_ADDRESSES = {
  "mainnet": "0x59cd2E492FF59dE3D99C0E034E85c7E51d420643",
  "staging": "0x690E60F6a0e4742bEa673299380FF883Bf23CD77",
  "testnet": ""
}

export const LOSER_PREDICTION_POOL_ADDRESSES = {
  "mainnet": "0xd9b4dD2b4dB9af58298593ef0709CE89fD8c154d",
  "staging": "0x08Fd84D1f574Fe8d4b0425940DE40B844a679D7A"
}

export const WINNER_PREDICTION_POOL_ADDRESSES = {
  "mainnet": "0xE91769d9bc4af9301d186b8834ea59f54BA41dE2",
  "staging": "0x1eE1e446851609E535f0081904238356b03f72A4"
}

export const PREDICTION_TOKEN_ADDRESSES = {
  CRO: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
  BTC: "0x062E66477Faf219F25D27dCED647BF57C3107d52",
  ETH: "0xe44Fd7fCb2b1581822D0c862B68222998a0c299a",
  DOGE:"0x1a8E39ae59e5556B56b76fCBA98d22c9ae557396",
  LTC: "0xC14103C2141E842e228FBaC594579e798616ce7A"
}

export const TOKENS = {
  [supportedChainIds.Mainnet]: {
    CRP: "0x7b8aD6d7560FAcd1959cfb4b4163D7d297c4bFc0",
    USDT: "0x66e428c3f67a68878562e79a0234c1f83c208770",
    MMF: "0x97749c9B61F878a880DfE312d2594AE07AEd7656",
    "MMF-CRP LP": "0x1338D3C3Cc56f71B45f95F9988e762e4a1EF228D"
  },
  [supportedChainIds.Testnet]: {
    CRP: "",
    USDT: "",
    MMF: "",
    "MMF-CRP LP": ""
  }
}
