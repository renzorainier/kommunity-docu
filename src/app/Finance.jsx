import React, { useEffect } from 'react';
import './Finance.css'; // Ensure you create this CSS file for the styles

function Finance({ userData }) {
  useEffect(() => {
    console.log(userData);
  }, [userData]);

  const renderTransactionRecords = () => {
    if (Object.keys(userData.finance.transactions).length === 0) {
      return <p>No transactions found.</p>;
    }

    return (
      <div className="transactions">
        {Object.keys(userData.finance.transactions)
          .sort((a, b) => new Date(b) - new Date(a)) // Sort keys in descending order
          .map((date, index) => {
            const transactionDate = new Date(date);
            const transaction = userData.finance.transactions[date];

            return (
              <div key={`transaction-${index}`} className="transaction-item">
                <div className="transaction-date">{transactionDate.toLocaleDateString()}</div>
                <div className="transaction-amount">${transaction.amount}</div>
                <div className="transaction-date-added">Added: {transaction.dateAdded}</div>
              </div>
            );
          })}
      </div>
    );
  };

  return (
    <main className="finance-container">
      {userData ? (
        <div className="finance-info">
          <h2 className="finance-heading">Finance Information</h2>
          <div className="finance-details">
            <div className="finance-item">To Pay: ${userData.finance.toPay}</div>
            <div className="finance-item">Total Paid: ${userData.finance.totalPaid}</div>
            <div className="finance-item">Tuition: ${userData.finance.tuition}</div>
          </div>
          <div className="transactions-section">
            <h3 className="transactions-heading">Transaction Records</h3>
            {renderTransactionRecords()}
          </div>
        </div>
      ) : (
        <div className="loading">Loading...</div>
      )}
    </main>
  );
}

export default Finance;
