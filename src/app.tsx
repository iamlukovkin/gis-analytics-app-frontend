import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {Map} from "./components/Map";
import {Home} from "./components/Home";
import {Navbar} from "./components/Navbar/navbar.tsx";
import {Subscriptions} from "./components/Subscriptions/Subscriptions";
import {PlaceRecommendationPage} from "./pages/PlaceRecommendationPage/PlaceRecommendationPage.tsx";

export function App() {
    return (
        <Router>
            <div className="App">
                <Navbar/>
                <Routes>
                    <Route path={"/"} element={<Home/>}/>
                    <Route path="/map" element={<Map/>}/>
                    <Route path={"/recommendation"} element={<PlaceRecommendationPage/>}/>
                    <Route path="/subscriptions" element={<Subscriptions/>}/>
                </Routes>
            </div>
        </Router>
    );
}