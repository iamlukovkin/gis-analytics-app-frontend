import {Check, X, Brain, MapPin, BarChart3} from 'lucide-react';
import './subscriptions.css';
import {type JSX} from "react";

interface PlanFeature {
    text: string;
    available: boolean;
}

interface SubscriptionPlan {
    name: string;
    price: string;
    description: string;
    features: PlanFeature[];
    popular?: boolean;
    icon: JSX.Element;
    buttonText: string;
    buttonVariant: 'primary' | 'secondary' | 'outline';
}

export function Subscriptions() {
    const plans: SubscriptionPlan[] = [
        {
            name: "Базовый",
            price: "0 ₽",
            description: "Знакомство с геоаналитикой на основе OSM",
            icon: <MapPin className="icon"/>,
            buttonText: "Начать анализ",
            buttonVariant: "outline",
            features: [
                {text: "Просмотр объектов", available: true},
                {text: "Ручной анализ до 3 точек в месяц", available: true},
                {text: "Базовые метрики посещаемости", available: true},
                {text: "Стандартные шаблоны отчетов", available: true},
                {text: "Персонализированные отчеты", available: false},
                {text: "Базовые фильтры поиска", available: false},
                {text: "ИИ-анализ оптимальных локаций", available: false},
                {text: "Анализ конкурентной среды", available: false},
                {text: "Прогноз окупаемости точек", available: false},
                {text: "Сравнительный анализ районов", available: false},
                {text: "Исторические данные за год", available: false},
                {text: "Командный доступ", available: false},
            ]
        },
        {
            name: "Профессионал",
            price: "1 799 ₽",
            description: "Расширенная аналитика с ИИ-помощником",
            icon: <Brain className="icon"/>,
            buttonText: "Тест 14 дней",
            buttonVariant: "primary",
            popular: true,
            features: [
                {text: "Просмотр объектов", available: true},
                {text: "Ручной анализ до 3 точек в месяц", available: true},
                {text: "Базовые метрики посещаемости", available: true},
                {text: "Стандартные шаблоны отчетов", available: true},
                {text: "Персонализированные отчеты", available: true},
                {text: "Базовые фильтры поиска", available: true},
                {text: "ИИ-анализ оптимальных локаций", available: true},
                {text: "Анализ конкурентной среды", available: true},
                {text: "Прогноз окупаемости точек", available: false},
                {text: "Сравнительный анализ районов", available: false},
                {text: "Исторические данные за год", available: false},
                {text: "Командный доступ", available: false},
            ]
        },
        {
            name: "Бизнес",
            price: "2 990 ₽",
            description: "Полный анализ с API и историческими данными",
            icon: <BarChart3 className="icon"/>,
            buttonText: "Выбрать план",
            buttonVariant: "secondary",
            features: [
                {text: "Просмотр объектов", available: true},
                {text: "Ручной анализ до 3 точек в месяц", available: true},
                {text: "Базовые метрики посещаемости", available: true},
                {text: "Стандартные шаблоны отчетов", available: true},
                {text: "Персонализированные отчеты", available: true},
                {text: "Базовые фильтры поиска", available: true},
                {text: "ИИ-анализ оптимальных локаций", available: true},
                {text: "Анализ конкурентной среды", available: true},
                {text: "Прогноз окупаемости точек", available: true},
                {text: "Сравнительный анализ районов", available: true},
                {text: "Исторические данные за год", available: true},
                {text: "Командный доступ", available: true},
            ]
        }
    ];
    const FeatureIcon = ({available}: { available: boolean }) =>
        available ? <Check className="feature-check"/> : <X className="feature-cross"/>;

    return (
        <div className="subscriptions-page">
            <div className="subscriptions-header">
                <h1>Выберите подписку</h1>
                <p>Найдите идеальный план для ваших потребностей в картографии</p>
            </div>

            <div className="plans-container">
                {plans.map((plan) => (
                    <div
                        key={plan.name}
                        className={`plan-card ${plan.popular ? 'popular' : ''}`}
                    >
                        {plan.popular && <div className="popular-badge">Популярный</div>}

                        <div className="plan-header">
                            <div className="plan-icon">
                                {plan.icon}
                            </div>
                            <h3>{plan.name}</h3>
                            <div className="plan-price">
                                <span className="price">{plan.price}</span>
                                {plan.price !== "0₽" && <span className="period">/месяц</span>}
                            </div>
                            <p className="plan-description">{plan.description}</p>
                        </div>

                        <div className="plan-features">
                            {plan.features.map((feature, featureIndex) => (
                                <div key={featureIndex} className="feature">
                                    <FeatureIcon available={feature.available}/>
                                    <span className={feature.available ? '' : 'feature-disabled'}>
                    {feature.text}
                  </span>
                                </div>
                            ))}
                        </div>

                        <button className={`plan-button ${plan.buttonVariant}`}>
                            {plan.buttonText}
                        </button>
                    </div>
                ))}
            </div>

        </div>
    );
}