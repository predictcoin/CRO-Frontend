import { BigNumber } from "ethers";
import { sportApiEndpoint } from "../../../constants/apiEndpoints";
import urlencode from "urlencode";
import axios from "axios";

interface Params {
    endpoint?: string;
    startTime: BigNumber;
    round: string;
    season: Number;
    teamA: string;
    teamB: string;
    league: string;
}
export const getMatchFullDetails = async (param: Params) => {
    const {
        endpoint = "fixtures",
        startTime,
        round,
        season,
        teamA,
        teamB,
        league
    } = param;

    const yy__mm__dd = new Date(startTime.toNumber() * 1000)
        .toISOString()
        .slice(0, 10);

    const link = `${sportApiEndpoint}?url=/${endpoint}&date=${yy__mm__dd}&round=${urlencode(
        round
    )}&season=${season}`;

    const res = await axios.get(link);
    const targetMatch = res.data.response.find(
        (data: any) =>
            data.teams.home.name === teamA &&
            data.teams.away.name === teamB &&
            data.league.name === league
    );
    
    return targetMatch;
};



export const getBallPossessions = async (fixtureId: number): Promise<{teamA:string, teamB: string}> => {
    const res = await axios.get(`${sportApiEndpoint}?url=/fixtures/statistics&fixture=${fixtureId}`);    
    if(res.data.response.length === 0) {
        return {teamA: "-%", teamB: "-%"}
    } else {
        const teamA = res.data.response[0].statistics[9].value;
        const teamB = res.data.response[1].statistics[9].value;

        return {teamA, teamB}
    }
}
