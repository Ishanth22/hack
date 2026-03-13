from typing import List, Dict, Any
from app.analytics.growth import (
    calculate_growth_series,
    normalize_growth,
    calculate_momentum
)
from app.analytics.runway import calculate_runway, runway_score


def calculate_health_score(metrics_history: List[Dict[str, Any]]) -> float:
    """
    Health Score (0-100):
    0.35 * revenue_growth +
    0.30 * user_growth +
    0.20 * employee_growth +
    0.15 * runway_score
    """
    if not metrics_history or len(metrics_history) < 2:
        return 0.0

    # Sort by month
    sorted_metrics = sorted(metrics_history, key=lambda x: x["month"])

    revenues = [m["monthly_revenue"] for m in sorted_metrics]
    users = [m["monthly_users"] for m in sorted_metrics]
    employees = [m["employee_count"] for m in sorted_metrics]
    burn_rates = [m["burn_rate"] for m in sorted_metrics]
    funding = sorted_metrics[-1]["funding_raised"]

    # Growth rates (last vs first, normalized)
    rev_growth = _overall_growth(revenues)
    user_growth = _overall_growth(users)
    emp_growth = _overall_growth(employees)

    # Runway
    latest_burn = burn_rates[-1]
    runway_months = calculate_runway(funding, latest_burn)
    r_score = runway_score(runway_months)

    # Weighted score
    score = (
        0.35 * normalize_growth(rev_growth) +
        0.30 * normalize_growth(user_growth) +
        0.20 * normalize_growth(emp_growth) +
        0.15 * r_score
    )

    return round(min(100, max(0, score * 100)), 1)


def _overall_growth(values: List[float]) -> float:
    """Calculate overall growth from first to last value."""
    if len(values) < 2 or values[0] == 0:
        return 0.0
    return (values[-1] - values[0]) / abs(values[0])


def calculate_startup_momentum(metrics_history: List[Dict[str, Any]]) -> float:
    """Calculate momentum score from -100 to 100."""
    if len(metrics_history) < 2:
        return 0.0

    sorted_metrics = sorted(metrics_history, key=lambda x: x["month"])
    revenues = [m["monthly_revenue"] for m in sorted_metrics]
    users = [m["monthly_users"] for m in sorted_metrics]

    rev_momentum = calculate_momentum(revenues)
    user_momentum = calculate_momentum(users)

    combined = (rev_momentum * 0.6 + user_momentum * 0.4) * 100
    return round(max(-100, min(100, combined)), 1)
