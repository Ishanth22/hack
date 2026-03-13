from typing import Optional


def calculate_runway(funding_raised: float, burn_rate: float) -> Optional[float]:
    """Calculate runway in months."""
    if burn_rate <= 0:
        return None  # Infinite runway or invalid
    return round(funding_raised / burn_rate, 1)


def runway_score(runway_months: Optional[float]) -> float:
    """
    Convert runway months to a 0-1 score.
    >24 months = 1.0
    6-24 months = linear scale
    <6 months = 0.0
    """
    if runway_months is None:
        return 0.5  # Unknown
    if runway_months >= 24:
        return 1.0
    if runway_months <= 0:
        return 0.0
    if runway_months < 6:
        return runway_months / 6 * 0.2  # Very low score for critical runway
    return 0.2 + (runway_months - 6) / 18 * 0.8


def runway_trend(burn_rates: list, funding_raised: float) -> str:
    """Determine if runway trend is improving, stable, or declining."""
    if len(burn_rates) < 2:
        return "stable"
    recent_avg = sum(burn_rates[-3:]) / len(burn_rates[-3:])
    older_avg = sum(burn_rates[-6:-3]) / len(burn_rates[-6:-3]) if len(burn_rates) >= 6 else burn_rates[0]
    
    change = (recent_avg - older_avg) / (abs(older_avg) + 1e-9)
    if change > 0.2:
        return "declining"
    if change < -0.1:
        return "improving"
    return "stable"
