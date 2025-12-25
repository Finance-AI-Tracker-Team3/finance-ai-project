import pandas as pd


def preprocess_monthly(df):
    if df.empty:
        return pd.DataFrame(columns=["ds", "y"])

    df = df.copy()
    df["date"] = pd.to_datetime(df["date"])
    df["amount"] = df["amount"].astype(float)

    monthly = (
        df.sort_values("date")
          .resample("M", on="date")["amount"]
          .sum()
          .reset_index()
    )

    monthly.columns = ["ds", "y"]
    return monthly


def preprocess_daily(df):
    if df.empty:
        return pd.DataFrame(columns=["daily_total", "tx_count"])

    df = df.copy()
    df["date"] = pd.to_datetime(df["date"])
    df["amount"] = df["amount"].astype(float)

    daily = (
        df.groupby(df["date"].dt.date)
          .agg(
              daily_total=("amount", "sum"),
              tx_count=("amount", "count")
          )
          .reset_index(drop=True)
    )

    return daily


def preprocess_weekday(df):
    if df.empty:
        return df

    df = df.copy()
    df["date"] = pd.to_datetime(df["date"])
    df["weekday"] = df["date"].dt.day_name()
    return df
