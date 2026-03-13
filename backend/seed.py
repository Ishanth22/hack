"""
Seed script: Generates 10 Indian startups with 12 months of realistic metrics.
Run: python seed.py
"""
import sys
import os
import random
import requests
from datetime import datetime, timedelta

BASE_URL = os.getenv("API_URL", "http://localhost:8000/api")

STARTUPS = [
    {"name": "Zepto", "sector": "Quick Commerce", "founding_year": 2021, "stage": "Series C", "location": "Mumbai", "website": "https://www.zeptonow.com"},
    {"name": "boAt", "sector": "Consumer Electronics", "founding_year": 2016, "stage": "Series B", "location": "Delhi", "website": "https://www.boat-lifestyle.com"},
    {"name": "Razorpay", "sector": "Fintech", "founding_year": 2014, "stage": "Series D+", "location": "Bangalore", "website": "https://razorpay.com"},
    {"name": "CRED", "sector": "Fintech", "founding_year": 2018, "stage": "Series D+", "location": "Bangalore", "website": "https://www.cred.club"},
    {"name": "Meesho", "sector": "E-Commerce", "founding_year": 2015, "stage": "Series D+", "location": "Bangalore", "website": "https://meesho.com"},
    {"name": "Groww", "sector": "Fintech", "founding_year": 2016, "stage": "Series D+", "location": "Bangalore", "website": "https://groww.in"},
    {"name": "Nykaa", "sector": "Beauty & Fashion", "founding_year": 2012, "stage": "IPO", "location": "Mumbai", "website": "https://www.nykaa.com"},
    {"name": "PharmEasy", "sector": "Healthtech", "founding_year": 2015, "stage": "Series D+", "location": "Mumbai", "website": "https://pharmeasy.in"},
    {"name": "Ola Electric", "sector": "EV & Mobility", "founding_year": 2017, "stage": "IPO", "location": "Bangalore", "website": "https://olaelectric.com"},
    {"name": "Slice", "sector": "Fintech", "founding_year": 2016, "stage": "Series B", "location": "Bangalore", "website": "https://sliceit.com"},
]


def generate_metrics(startup_id: str, profile: str = "growth") -> list:
    """Generate 12 months of realistic metrics for a startup."""
    months = []
    base_date = datetime(2024, 1, 1)

    # Base values per profile
    profiles = {
        "growth": {"users": 50000, "revenue": 500000, "employees": 120, "funding": 10000000, "burn": 500000},
        "aggressive": {"users": 200000, "revenue": 2000000, "employees": 300, "funding": 50000000, "burn": 3000000},
        "struggling": {"users": 10000, "revenue": 100000, "employees": 50, "funding": 2000000, "burn": 400000},
        "mature": {"users": 1000000, "revenue": 10000000, "employees": 1000, "funding": 100000000, "burn": 5000000},
    }

    base = profiles.get(profile, profiles["growth"])
    users = base["users"]
    revenue = base["revenue"]
    employees = base["employees"]
    funding = base["funding"]
    burn = base["burn"]

    for i in range(12):
        month_str = (base_date + timedelta(days=30 * i)).strftime("%Y-%m")

        # Simulate growth with some noise
        growth_factor = 1 + random.uniform(0.02, 0.15) if profile != "struggling" else 1 + random.uniform(-0.05, 0.08)
        users = int(users * growth_factor)
        revenue = revenue * growth_factor * random.uniform(0.9, 1.1)
        employees = max(10, int(employees * random.uniform(1.0, 1.03)))
        burn = burn * random.uniform(0.95, 1.08)

        # Remaining runway
        remaining_funding = max(0, funding - burn * i)

        months.append({
            "startup_id": startup_id,
            "month": month_str,
            "monthly_users": users,
            "monthly_revenue": round(revenue, 2),
            "employee_count": employees,
            "funding_raised": round(remaining_funding, 2),
            "burn_rate": round(burn, 2)
        })

    return months


PROFILES = ["aggressive", "growth", "mature", "growth", "aggressive", "mature", "mature", "growth", "aggressive", "struggling"]


def seed():
    print("🚀 Seeding Startup Progress Monitor...\n")

    for i, startup_data in enumerate(STARTUPS):
        # Register startup
        resp = requests.post(f"{BASE_URL}/startups", json=startup_data)
        if resp.status_code not in [200, 201]:
            print(f"❌ Failed to create {startup_data['name']}: {resp.text}")
            continue

        startup = resp.json()
        startup_id = startup.get("id") or startup.get("_id")
        profile = PROFILES[i]

        print(f"✅ Created: {startup_data['name']} (id={startup_id}, profile={profile})")

        # Submit metrics
        metrics_list = generate_metrics(startup_id, profile)
        for m in metrics_list:
            mresp = requests.post(f"{BASE_URL}/metrics", json=m)
            if mresp.status_code not in [200, 201]:
                print(f"   ⚠️  Metrics error for {m['month']}: {mresp.text}")

        print(f"   📊 Submitted 12 months of metrics\n")

    print("✅ Seeding complete! Visit http://localhost:5173")


if __name__ == "__main__":
    seed()
