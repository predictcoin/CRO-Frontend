import { useState } from "react";
import { getCountdown } from "../../utils/time";

const useNextRoundCountdown = (): {countdown: string, width: string} => {
  const [state, setState] = useState({countdown:"00d:00h:00m:00s", width: "0"});
  let interval =1, duration=0, width="0";
  const repeat = () => {
    const originStamp = 1635771600;
    const currentStamp = Math.trunc(Date.now()/1000);
    interval = 604800;
    const elapsed = currentStamp - originStamp;
    const past = Math.floor(elapsed/interval);

    const remainder = elapsed%interval;
    let futureStamp
    if(remainder === 0){
      futureStamp = originStamp + (past*interval);
    }else{
      futureStamp = originStamp + ((past+1)*interval)
    }

    duration = futureStamp - Math.trunc(Date.now()/1000);
    width = `${(interval-duration)/interval*100}%`
    // const duration = (1639400400000 - Date.now())/1000
    const {days, hours, minutes, seconds} = getCountdown(duration);
    setState({countdown: `${days}d:${hours}h:${minutes}m:${seconds}s`, width});
  }
  // if(duration === 0) repeat();
  setInterval(repeat, 2000);
  return state ;
}

export default useNextRoundCountdown;

