import { PredictionPoolStore } from "../../../domain/predictionPools/predictionPoolsStore";
import * as actionType from "../actionTypes/predictionPools";

const initial: Pick<PredictionPoolStore, "available" | "isLoading" | "pools" | "isLoadingPastPools"> & {currentPool: number}  = {
  available: false,
  isLoading: false,
  isLoadingPastPools: false,
  pools: {},
  currentPool: 0,
}

export const loserPoolReducer = (state = initial, action: {type: string, data?: any}) => {
   switch(action.type){
    case(actionType.GET_PAST_LOSER_POOLS):
      return {...state, isLoadingPastPools: true}
    case(actionType.GET_PAST_LOSER_POOLS_FAILED):
      return {...state, isLoadingPastPools: false}
    case(actionType.GET_PAST_LOSER_POOLS_SUCCESS):
      return {...state, isLoadingPastPools: false, pastAvailable: true}
    case(actionType.SET_LOSER_POOL):
      if(state.pools[action.data.pool.pId]?.userStaked && !action.data.pool?.userStaked){
        return {...state, pools: {...state.pools}}
      }
      return {...state, pools:{...state.pools, [action.data.pool.pId] : action.data.pool, } }
    case(actionType.INIT_LOSER_POOL):
      return {...state, isLoading: true}
    case(actionType.INIT_LOSER_POOL_FAILED):
      return {...state, isLoading: false}
    case(actionType.INIT_LOSER_POOL_SUCCESS):
      if(state.pools[state.currentPool]?.userStaked && !action.data?.pools[state.currentPool]?.userStaked){
        return {...state, available: true, isLoading: false, ...action.data, pools: {...state.pools}}
      }
      return {...state, available: true, isLoading: false, ...action.data, pools: {...state.pools, ...action.data?.pools}}
    default:
      return state
  }
}

export const winnerPoolReducer = (state = initial, action: {type: string, data?: any}) => {
   switch(action.type){
    case(actionType.GET_PAST_WINNER_POOLS):
      return {...state, isLoadingPastPools: true}
    case(actionType.GET_PAST_WINNER_POOLS_FAILED):
      return {...state, isLoadingPastPools: false}
    case(actionType.GET_PAST_WINNER_POOLS_SUCCESS):
      return {...state, isLoadingPastPools: false, pastAvailable: true}
    case(actionType.SET_WINNER_POOL):
      if(state.pools[action.data.pool.pId]?.userStaked && !action.data.pool?.userStaked){
        return {...state, pools: {...state.pools}}
      }
      return {...state, pools:{...state.pools, [action.data.pool.pId] : action.data.pool, },  }
    case(actionType.INIT_WINNER_POOL):
      return {...state, isLoading: true}
    case(actionType.INIT_WINNER_POOL_FAILED):
      return {...state, isLoading: false}
    case(actionType.INIT_WINNER_POOL_SUCCESS):
      if(state.pools[state.currentPool]?.userStaked && !action.data?.pools[state.currentPool]?.userStaked){
        return {...state, available: true, isLoading: false, ...action.data, pools: {...state.pools}}
      }
      return {...state, available: true, isLoading: false, ...action.data, pools: {...state.pools, ...action.data?.pools}}
    default:
      return state
  }
}
