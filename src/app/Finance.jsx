import React, { useEffect } from 'react';

function Finance({ userData }) {
  useEffect(() => {
    console.log(userData);
  }, [userData]);

  const renderTransactionRecords = () => {
    if (Object.keys(userData.finance.transactions).length === 0) {
      return <p className="text-gray-600">No transactions found.</p>;
    }

    return (
      <div className="bg-white rounded-lg shadow-md p-6 mt-4">
        {Object.keys(userData.finance.transactions)
          .sort((a, b) => new Date(b) - new Date(a))
          .map((date, index) => {
            const transactionDate = new Date(date);
            const transaction = userData.finance.transactions[date];

            return (
              <div
                key={`transaction-${index}`}
                className="flex justify-between items-center py-2 border-b border-gray-200 last:border-none"
              >
                <div className="text-gray-700">{transactionDate.toLocaleDateString()}</div>
                <div className="text-green-600 font-medium">₱{transaction.amount.toLocaleString()}</div>
              </div>
            );
          })}
      </div>
    );
  };

  return (
    <main className="flex justify-center items-center min-h-screen p-4">
      {userData ? (
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Account Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-100 p-6 rounded-lg shadow-sm text-center">
              <div className="text-sm font-medium text-gray-500">To Pay</div>
              <div className="text-2xl font-bold text-gray-800">₱{userData.finance.toPay.toLocaleString()}</div>
            </div>
            <div className="bg-green-100 p-6 rounded-lg shadow-sm text-center">
              <div className="text-sm font-medium text-gray-500">Total Paid</div>
              <div className="text-2xl font-bold text-gray-800">₱{userData.finance.totalPaid.toLocaleString()}</div>
            </div>
            <div className="bg-yellow-100 p-6 rounded-lg shadow-sm text-center">
              <div className="text-sm font-medium text-gray-500">Tuition</div>
              <div className="text-2xl font-bold text-gray-800">₱{userData.finance.tuition.toLocaleString()}</div>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">Transaction Records</h3>
            {renderTransactionRecords()}
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-600">Loading...</div>
      )}
    </main>
  );
}

export default Finance;
