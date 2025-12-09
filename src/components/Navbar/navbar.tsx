import { Link, useLocation } from 'react-router-dom';
import './navbar.css';

export function Navbar() {
    const location = useLocation();

    return (
        <nav className="navbar">
            <div className="nav-brand">
                <Link to="/">В точку</Link>
            </div>
            <div className="nav-links">
                <Link
                    to="/map"
                    className={location.pathname === '/' ? 'active' : ''}
                >
                    Карта
                </Link>
                <Link
                    to={"/recommendation"}
                    className={location.pathname === '/recommendation' ? 'active' : ''}
                    >
                    Выбор места
                </Link>
                <Link
                    to="/subscriptions"
                    className={location.pathname === '/subscriptions' ? 'active' : ''}
                >
                    Подписки
                </Link>
            </div>
        </nav>
    );
}