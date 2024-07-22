import React, { useEffect } from 'react';

function Finance({ userData }) {
  useEffect(() => {
    console.log(userData);
  }, [userData]);

  const renderTransactionRecords = () => {
    if (Object.keys(userData.finance.transactions).length === 0) {
      return <p>No transactions found.</p>;
    }

    return (
      <div>
        {Object.keys(userData.finance.transactions)
          .sort((a, b) => new Date(b) - new Date(a)) // Sort keys in descending order
          .map((date, index) => {
            const transactionDate = new Date(date);
            const transaction = userData.finance.transactions[date];

            return (
              <div key={`transaction-${index}`} className="transaction-item">
                <div>{transactionDate.toLocaleDateString()}</div>
                <div>{transaction.amount.toFixed(2)}</div>
                <div>{transaction.dateAdded}</div>
              </div>
            );
          })}
      </div>
    );
  };

  return (
    <main>
      {userData ? (
        <div>
          <div>
            <h2>Finance Information</h2>
            <div>Balance: ${(userData.finance.totalPaid - userData.finance.toPay).toFixed(2)}</div>
            <div>Tuition: ${userData.finance.tuition.toFixed(2)}</div>
            <div>Total Paid: ${userData.finance.totalPaid.toFixed(2)}</div>
            <div>To Pay: ${userData.finance.toPay.toFixed(2)}</div>
          </div>
          <div>
            <h3>Transaction Records</h3>
            {renderTransactionRecords()}
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </main>
  );
}

export default Finance;
