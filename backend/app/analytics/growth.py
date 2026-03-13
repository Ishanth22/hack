from typing import List, Optional
import numpy as np


def safe_growth(current: float, previous: float) -> float:
    """Calculate growth rate safely, handling division by zero."""
    if previous == 0 or previous is None:
        return 0.0
    return (current - previous) / abs(previous)


def calculate_growth_series(values: List[float]) -> List[float]:
    """Calculate growth rates for a list of values."""
    if len(values) < 2:
        return [0.0]
    rates = []
    for i in range(1, len(values)):
        rates.append(safe_growth(values[i], values[i - 1]))
    return rates


def calculate_momentum(values: List[float]) -> float:
    """
    Momentum = recent_growth * 0.6 + previous_growth * 0.4
    Uses last two growth periods.
    """
    if len(values) < 2:
        return 0.0

    growth_rates = calculate_growth_series(values)

    if len(growth_rates) == 1:
        return growth_rates[0]

    recent = growth_rates[-1]
    previous = growth_rates[-2] if len(growth_rates) > 1 else 0.0

    return recent * 0.6 + previous * 0.4


def normalize_growth(growth: float, cap: float = 2.0) -> float:
    """Normalize growth to 0-1 range, capped to avoid extreme spikes."""
    clamped = max(-1.0, min(cap, growth))
    return (clamped + 1.0) / (cap + 1.0)


def exponential_smoothing(values: List[float], alpha: float = 0.3) -> List[float]:
    """Apply exponential smoothing to reduce noise."""
    if not values:
        return []
    smoothed = [values[0]]
    for v in values[1:]:
        smoothed.append(alpha * v + (1 - alpha) * smoothed[-1])
    return smoothed
