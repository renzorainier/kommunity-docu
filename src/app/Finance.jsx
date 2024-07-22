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
                <div>Date: {transactionDate.toLocaleDateString()}</div>
                <div>Amount: ${transaction.amount}</div>
                <div>Date Added: {transaction.dateAdded}</div>
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
            <div>To Pay: ${userData.finance.toPay}</div>
            <div>Total Paid: ${userData.finance.totalPaid}</div>
            <div>Tuition: ${userData.finance.tuition}</div>
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
