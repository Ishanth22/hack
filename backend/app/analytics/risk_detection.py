from typing import List, Dict, Any
from app.analytics.runway import calculate_runway
from app.analytics.growth import safe_growth


def detect_risks(metrics_history: List[Dict[str, Any]]) -> List[Dict[str, str]]:
    """
    Detect risk signals from metrics history.
    Returns list of alerts with level and message.
    """
    if not metrics_history:
        return []

    alerts = []
    sorted_metrics = sorted(metrics_history, key=lambda x: x["month"])
    latest = sorted_metrics[-1]

    # 1. Runway check
    runway = calculate_runway(latest["funding_raised"], latest["burn_rate"])
    if runway is not None:
        if runway < 3:
            alerts.append({
                "level": "CRITICAL",
                "type": "runway",
                "message": f"Runway critically low: {runway} months remaining"
            })
        elif runway < 6:
            alerts.append({
                "level": "HIGH",
                "type": "runway",
                "message": f"Runway below 6 months: {runway} months remaining"
            })
        elif runway < 12:
            alerts.append({
                "level": "WARNING",
                "type": "runway",
                "message": f"Runway below 12 months: {runway} months — consider fundraising"
            })

    # 2. Burn rate increase check
    if len(sorted_metrics) >= 2:
        prev_burn = sorted_metrics[-2]["burn_rate"]
        curr_burn = latest["burn_rate"]
        burn_change = safe_growth(curr_burn, prev_burn)
        if burn_change > 0.75:
            alerts.append({
                "level": "CRITICAL",
                "type": "burn_rate",
                "message": f"Burn rate surged {round(burn_change*100)}% in one month"
            })
        elif burn_change > 0.50:
            alerts.append({
                "level": "HIGH",
                "type": "burn_rate",
                "message": f"Burn rate increased {round(burn_change*100)}% — monitor expenses"
            })

    # 3. Revenue decline check
    if len(sorted_metrics) >= 3:
        rev_series = [m["monthly_revenue"] for m in sorted_metrics[-3:]]
        recent_growth = safe_growth(rev_series[2], rev_series[1])
        if recent_growth < -0.30:
            alerts.append({
                "level": "HIGH",
                "type": "revenue",
                "message": f"Revenue declined {round(abs(recent_growth)*100)}% last month"
            })
        elif recent_growth < -0.15:
            alerts.append({
                "level": "WARNING",
                "type": "revenue",
                "message": f"Revenue dropped {round(abs(recent_growth)*100)}% — investigate causes"
            })

    # 4. User growth stagnation
    if len(sorted_metrics) >= 3:
        user_series = [m["monthly_users"] for m in sorted_metrics[-3:]]
        user_growth = safe_growth(user_series[2], user_series[0])
        if user_growth < -0.10:
            alerts.append({
                "level": "WARNING",
                "type": "users",
                "message": "User base declining over past quarter"
            })

    # 5. Employee shrinkage
    if len(sorted_metrics) >= 2:
        prev_emp = sorted_metrics[-2]["employee_count"]
        curr_emp = latest["employee_count"]
        if curr_emp < prev_emp * 0.85:
            reduction = round((1 - curr_emp / prev_emp) * 100)
            alerts.append({
                "level": "WARNING",
                "type": "employees",
                "message": f"Workforce reduced by {reduction}% — possible restructuring"
            })

    return alerts


def estimate_risk_probability(metrics_history: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Simple rule-based risk probability estimation.
    Returns probability and risk_level: Low / Medium / High / Critical
    """
    if not metrics_history:
        return {"probability": 0.5, "risk_level": "Unknown"}

    alerts = detect_risks(metrics_history)
    
    score = 0.0
    weights = {"CRITICAL": 0.4, "HIGH": 0.25, "WARNING": 0.1}
    
    for alert in alerts:
        score += weights.get(alert["level"], 0)

    # Cap at 0.95
    probability = min(0.95, score)

    if probability >= 0.6:
        risk_level = "Critical"
    elif probability >= 0.35:
        risk_level = "High"
    elif probability >= 0.15:
        risk_level = "Medium"
    else:
        risk_level = "Low"

    return {
        "probability": round(probability, 2),
        "risk_level": risk_level,
        "alert_count": len(alerts)
    }
