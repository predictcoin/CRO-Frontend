import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import CoinGecko from "coingecko-api";
import { format } from "date-fns";

import coinTabData, { coinMinMax } from "../../data/coinTabData";
import CoinTab from "../../Components/CoinTab";
import PricePredictionPast from "./PricePredictionPast";
import PricePredictionOngoing from "./PricePredictionOngoing";
import ModalConnect from "../../Components/CustomModal/ModalConnect";
import ModalDisconnect from "../../Components/CustomModal/ModalDisconnect";
import { useWalletViewModel } from "../../application/controllers/walletViewModel";
import { displayDecimals } from "../../lib/utils/number";
import { ethers } from "ethers";
import useToken from "../../hooks/useToken";
import { TOKENS } from "../../constants/addresses";
import Header from "../../Components/Header";

interface PricePredictionMainContentProps {
    isSidebarExpanded: boolean;
    setIsSidebarExpanded: Dispatch<SetStateAction<boolean>>;
}

const PricePredictionMainContent: FC<PricePredictionMainContentProps> = ({
    isSidebarExpanded,
    setIsSidebarExpanded
}) => {
    const { pathname } = useLocation();
    const [loadingChart, setLoadingChart] = useState<boolean>(false);
    const [loadingChartValues, setLoadingChartValues] =
        useState<boolean>(false);
    const [activeCard, setActiveCard] = useState<string>(coinTabData[0].id);
    const [minMax, setMinMax] =
        useState<{ id: string; min: number; max: number }[]>(coinMinMax);
    const [graphMin, setGraphMin] = useState<number>(5000);
    const [graphMax, setGraphMax] = useState<number>(65000);
    const [graphData, setGraphData] = useState<{ x: string; y: number }[]>([]);
    const [modalOpened, setModalOpened] = useState<boolean>(false);
    const { active, chainId } = useWalletViewModel();
    const { balance, decimals } = useToken(TOKENS[chainId].CRP);
    const modal = active ? (
        <ModalDisconnect
            closeModal={() => setModalOpened(false)}
            CRPBalance={displayDecimals(
                ethers.utils.formatUnits(balance, decimals),
                5
            )}
        />
    ) : (
        <ModalConnect closeModal={() => setModalOpened(false)} />
    );
    const client = new CoinGecko();

    const searchCoin = async (id: string) => {
        try {
            const coin = await client.coins.fetch(id, {});
            const coinData = coin.data;
            return coinData;
        } catch (error) {
            console.log(error);
        }
    };

    const getAllCoinPrices = async () => {
        setLoadingChartValues(true);
        const promises: any[] = [];
        coinTabData.map((coin) => promises.push(searchCoin(coin.id)));
        const data: any = await Promise.all(promises);
        setMinMax([
            {
                id: "bitcoin",
                min: data[0].market_data.atl.usd,
                max: data[0].market_data.ath.usd
            },
            {
                id: "ethereum",
                min: data[1].market_data.atl.usd,
                max: data[1].market_data.ath.usd
            },
            {
                id: "crypto-com-chain",
                min: data[2].market_data.atl.usd,
                max: data[2].market_data.ath.usd
            },
            {
                id: "litecoin",
                min: data[3].market_data.atl.usd,
                max: data[3].market_data.ath.usd
            },
            {
                id: "dogecoin",
                min: data[4].market_data.atl.usd,
                max: data[4].market_data.ath.usd
            }
        ]);
        setLoadingChartValues(false);
    };

    const searchCoinChart = async () => {
        setLoadingChart(true);
        try {
            const response = await fetch(
                `https://api.coingecko.com/api/v3/coins/${activeCard}/market_chart?vs_currency=usd&days=180&interval=monthly`
            );
            const coin = await response.json();
            const marketPriceData = coin.prices;
            const truncatedMarketPriceData = marketPriceData;
            const newGraphData: { x: string; y: number }[] = [];
            truncatedMarketPriceData.forEach((data: any) => {
                newGraphData.push({
                    x: format(new Date(data[0]), "yyyy-MM-dd"),
                    y: data[1]
                });
            });
            setGraphData(newGraphData);
        } catch (error) {
            console.log(error);
        }
        setLoadingChart(false);
    };

    useEffect(() => {
        getAllCoinPrices();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const selectedId = minMax.filter((coin) => coin.id === activeCard)[0];
        setGraphMin(selectedId.min);
        setGraphMax(selectedId.max);
        searchCoinChart();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeCard]);

    return (
        <section className="price__prediction__main__content">
            {modalOpened && modal}

            <div className="container">
                <Header
                    title="Price Prediction"
                    subtitle="Predict with $CRP, earn in $CRP"
                    isSidebarExpanded
                    setIsSidebarExpanded={setIsSidebarExpanded}
                    setModalOpened={setModalOpened}
                />

                {/* <div
                    className="livecoinwatch-widget-6"
                    lcw-coin="__CRP"
                    lcw-base="USD"
                    lcw-period="d"
                    lcw-color-tx="#ffffff"
                    lcw-color-bg="#0a3058"
                    lcw-border-w="1"
                    style={{ marginBottom: "10px" }}
                ></div> */}

                <main>
                    <div className="coins__to__predict">
                        <h1 className="title">Coins to predict</h1>
                        <div className="coins__to__predict__container">
                            {coinTabData.map((coin) => (
                                <CoinTab
                                    key={coin.id}
                                    id={coin.id}
                                    coinName={coin.coinName}
                                    active={activeCard === coin.id}
                                    setActive={setActiveCard}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="tab">
                        <Link
                            to="ongoing-round"
                            className={`${
                                pathname === "/prediction" ||
                                pathname === "/prediction/ongoing-round"
                                    ? "active"
                                    : ""
                            }`}
                        >
                            ONGOING ROUND
                        </Link>
                        <Link
                            to="my-predictions"
                            className={`${
                                pathname === "/prediction/my-predictions"
                                    ? "active"
                                    : ""
                            }`}
                        >
                            MY PREDICTIONS
                        </Link>
                    </div>

                    <Routes>
                        {["/", "/ongoing-round"].map((path, index) => {
                            return (
                                <Route
                                    key={index}
                                    path={path}
                                    element={
                                        <PricePredictionOngoing
                                            graphData={graphData}
                                            graphMin={graphMin}
                                            graphMax={graphMax}
                                            activeCard={activeCard}
                                            setActive={setActiveCard}
                                            loadingChart={loadingChart}
                                            loadingChartValues={
                                                loadingChartValues
                                            }
                                        />
                                    }
                                />
                            );
                        })}
                        <Route
                            path="/my-predictions"
                            element={<PricePredictionPast />}
                        />
                    </Routes>
                </main>
            </div>
        </section>
    );
};

export default PricePredictionMainContent;
