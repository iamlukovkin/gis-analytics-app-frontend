import {useEffect, useRef, useState} from "react";
import * as mapSdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import "./place-recommendation.css";
import config from "../../services/config";
import {getColorRamp, setNewSource} from "../../services";
import type {FeatureCollection} from "geojson";

interface Recommendation {
    coordinates: [number, number];
    score: number;
    address: string;
    reasons: string[];
    population: number;
    avgIncome: number;
    footTraffic: string;
    competitors: number;
}

const cafeLink = "http://localhost:8080/osm/points?category=amenity&propertyIds=270&polygon_osm_id=-1066115";
const emptyMapData: FeatureCollection = {type: "FeatureCollection", features: []};

export function PlaceRecommendationPage() {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<mapSdk.Map | null>(null);

    const [mapReady, setMapReady] = useState(false);
    const [recReady, setRecReady] = useState(false);
    const [recommendation, setRecommendation] = useState<Recommendation | null>(null);

    const [messages, setMessages] = useState<string[]>([
        "Здравствуйте! Опишите, пожалуйста, какой объект вы хотите открыть и какие пожелания к месту расположения?"
    ]);
    const [userInput, setUserInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [interactionFinished, setInteractionFinished] = useState(false);

    // Инициализация карты
    useEffect(() => {
        mapSdk.config.apiKey = config.MAPTILER_API_KEY;
        if (!mapContainer.current) return;

        mapRef.current = new mapSdk.Map({
            container: mapContainer.current,
            center: [39.7132, 54.6269],
            zoom: 12,
            logoPosition: 'bottom-right',
            navigationControl: false,
            scaleControl: false,
            geolocateControl: false,
            style: config.MAP_STYLE
        });
        setMapReady(true);
    }, []);

    const handleSend = () => {
        if (!userInput.trim()) return;

        setMessages(prev => [...prev, `Вы: ${userInput}`]);
        setUserInput("");
        setLoading(true);

        setTimeout(() => {
            setMessages(prev => [
                ...prev,
                "ИИ: Анализирую местность и подбираю оптимальное место..."
            ]);
        }, 300);

        setTimeout(() => {
            const data: Recommendation = {
                coordinates: [39.74261, 54.6325],
                score: 92,
                address: "Советский район, Рязань — ул. Соборная, 3",
                reasons: [
                    "Высокая плотность жилых домов",
                    "Близость Политехнического университета повышает поток студентов",
                    "Туристический поток благодаря Кремлю и музею РИАМЗ",
                    "Дом Молодёжи поблизости обеспечивает регулярные мероприятия",
                    "Низкая конкуренция в радиусе 500 метров"
                ],
                population: 18450,
                avgIncome: 48200,
                footTraffic: "Высокий",
                competitors: 1
            };

            setRecommendation(data);
            setInteractionFinished(true);
            setRecReady(true);
            setLoading(false);

            const map = mapRef.current!;
            new mapSdk.Marker({color: "#ffcc00"})
                .setLngLat(data.coordinates)
                .addTo(map);

            map.flyTo({center: data.coordinates, zoom: 15, speed: 0.8});
        }, 700);
    };

    useEffect(() => {
        if (!mapReady || !recReady) return;

        const {heatmapSourceId} = mapSdk.helpers.addHeatmap(mapRef.current!, {
            data: emptyMapData,
            colorRamp: getColorRamp(config.HEATMAP_COLOR),
            opacity: 0.8
        });

        fetch(cafeLink)
            .then(res => res.json())
            .then(data => {
                setNewSource([heatmapSourceId], mapRef, data || emptyMapData);
            });
    }, [mapReady, recReady]);

    const elements = document.getElementsByClassName(config.MUST_BE_DISABLE_CLASSNAME);
    for (const element of elements) (element as HTMLElement).style.display = 'none';

    return (
        <div className="recommend-wrapper">

            <div className="chat-panel">
                <div className="chat-messages">
                    {messages.map((msg, i) => (
                        <p key={i} className="chat-message">{msg}</p>
                    ))}
                    {loading && <p className="chat-message loading">Загрузка...</p>}
                </div>

                {!interactionFinished && (
                    <div className="chat-input">
    <textarea
        value={userInput}
        onChange={e => setUserInput(e.target.value)}
        placeholder="Опишите интересующее вас место..."
        rows={2}
        style={{resize: "none"}}
    />
                        <button onClick={handleSend}>Отправить</button>
                    </div>
                )}
            </div>

            <div ref={mapContainer} className="recommend-map"/>

            {recommendation && (
                <div className="recommend-panel">
                    <h2>Рекомендованная локация для кафе</h2>
                    <p className="recommend-address">{recommendation.address}</p>
                    <p className="recommend-score">
                        Итоговый балл привлекательности места:
                        <span>{recommendation.score} / 100</span>
                    </p>

                    <div className="recommend-stats">
                        <p><strong>Население района:</strong> {recommendation.population} чел.</p>
                        <p><strong>Средний доход:</strong> {recommendation.avgIncome} ₽</p>
                        <p><strong>Пешеходный трафик:</strong> {recommendation.footTraffic}</p>
                        <p><strong>Конкурирующих кафе поблизости:</strong> {recommendation.competitors}</p>
                    </div>

                    <div className="recommend-reasons">
                        <h3>Почему выбрана эта точка:</h3>
                        <ul>
                            {recommendation.reasons.map((r, i) => (
                                <li key={i}>{r}</li>
                            ))}
                        </ul>
                    </div>

                    <button className="recommend-btn">
                        Перейти к подробной аналитике
                    </button>
                </div>
            )}
        </div>
    );
}
