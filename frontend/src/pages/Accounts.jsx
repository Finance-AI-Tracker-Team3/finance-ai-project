import React, { useEffect, useState } from "react";
import { getAccounts } from "../services/apiService";

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAccounts = async () => {
    try {
      const res = await getAccounts();
      setAccounts(res.data);
    } catch (err) {
      console.error("Failed to load accounts", err);
      alert("Failed to load accounts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  if (loading) return <p>Loading accounts...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>💳 Accounts</h2>

      {accounts.length === 0 ? (
        <p>No accounts found</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Balance</th>
              <th>Currency</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((acc) => (
              <tr key={acc.accountId}>
                <td>{acc.accountName}</td>
                <td>{acc.accountType}</td>
                <td>{acc.balance}</td>
                <td>{acc.currency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Accounts;
