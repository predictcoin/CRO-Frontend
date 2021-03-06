import { BigNumber } from "ethers";
import { UpcomingMatch } from "../../../domain/sportPrediction/entity";
import { SportPredictionStore } from "../../../domain/sportPrediction/sportPredictionStore";
import * as actionTypes from "../actionTypes/sportPrediction";

const initialState: SportPredictionStore = {
    isLoadingUpcomingMatches: false,
    isLoadingUserPastPredictions: false,
    isLoadingLiveMatches: false,
    predictionAmount: BigNumber.from(0),
    maxPredictions: 0,
    rewardMultiplier: 0,
    predictMatchModal: {id: null, isFilled: false},
    claimModal: {open: false, matchId: ""},
    liveMatches: [],
    upcomingMatches: [],
    userPastPredictions: []
}

export const sportPredictionReducer = (state = initialState, action: {type: string, data?: any}): SportPredictionStore => {
    switch (action.type) {
        case actionTypes.GET_LIVE_MATCHES:
            return {...state, isLoadingLiveMatches: true}
        case actionTypes.SET_LIVE_MATCHES:
            return {...state, liveMatches: action.data?.liveMatches, isLoadingLiveMatches: false}
        case actionTypes.GET_LIVE_MATCHES_FAILED:
            return {...state, isLoadingLiveMatches: false}

        case actionTypes.GET_UPCOMING_MATCHES:
            return {...state, isLoadingUpcomingMatches: true}
        case actionTypes.SET_UPCOMING_MATCHES:
            return {...state, upcomingMatches: action.data?.upcomingMatches, isLoadingUpcomingMatches: false}
        case actionTypes.GET_UPCOMING_MATCHES_FAILED:
            return {...state, isLoadingUpcomingMatches: false}

        case actionTypes.GET_USER_PAST_PREDICTIONS:
            return {...state, isLoadingUserPastPredictions: true}
        case actionTypes.SET_USER_PAST_PREDICTIONS:
            return {...state, userPastPredictions: action.data?.userPastPredictions, isLoadingUserPastPredictions: false}
        case actionTypes.GET_USER_PAST_PREDICTIONS_FAILED:
            return {...state, isLoadingUserPastPredictions: false}
        case actionTypes.SET_SPORT_PREDICTION_DATA:
            return {...state, ...action.data}
        case actionTypes.SET_PREDICT_MATCH_MODAL:
            return {...state, ...action.data}
        case actionTypes.SET_CLAIM_MODAL:
            return {...state, ...action.data}
        case actionTypes.ADD_NEW_UPCOMING_MATCH:
            const data = [action.data as UpcomingMatch, ...state.upcomingMatches]
            const sortedData = data.sort((a,b) => a.startTimestamp - b.startTimestamp);
            return {...state, upcomingMatches: sortedData}
        case actionTypes.INCREMENT_MATCH_PREDICTION_FILLED_SLOT:
            const indexOfMatchTobeUpdated = state.upcomingMatches.findIndex(match => match.id === action.data.id)
            const newUpcomingMatches = state.upcomingMatches;
            newUpcomingMatches[indexOfMatchTobeUpdated].slotsFilled++;
            return {...state, upcomingMatches: newUpcomingMatches};
         default:
            return state;
    }

}

