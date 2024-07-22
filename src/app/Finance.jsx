import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import './Finance.css'; // If needed for additional styles

function Finance({ financeData }) {
  const { ref: wrapperRef, inView: wrapperInView } = useInView({
    triggerOnce: true,
  });

  const handleScroll = (entries) => {
    entries.forEach((entry) => {
      const listItem = entry.target;
      if (entry.isIntersecting) {
        listItem.classList.add('item-focus');
      } else {
        listItem.classList.remove('item-focus');
      }
    });
  };

  useEffect(() => {
    setTimeout(() => {
      const observer = new IntersectionObserver(handleScroll, {
        threshold: 0.5,
      });

      const items = document.querySelectorAll('.js-scroll-list-item');
      items.forEach((item) => observer.observe(item));

      return () => {
        items.forEach((item) => observer.unobserve(item));
      };
    }, 100); // Adjust the delay if necessary
  }, [financeData]);

  const renderTransactionRecords = () => {
    if (Object.keys(financeData.transactions).length === 0) {
      return <p className="text-center mt-4 text-gray-600">No transactions found.</p>;
    }

    return (
      <div>
        {Object.keys(financeData.transactions)
          .sort((a, b) => new Date(b) - new Date(a)) // Sort keys in descending order
          .map((date, index) => {
            const transactionDate = new Date(date);
            const transaction = financeData.transactions[date];

            return (
              <div key={`transaction-${index}`} className="grid mb-2 bg-white grid-cols-3 gap-2 rounded-lg shadow-md shadow-[#0587be] p-4 js-scroll-list-item transition duration-300 hover:shadow-lg">
                <div className="text-lg text-center py-2">
                  {transactionDate.toLocaleDateString()}
                </div>
                <div className="text-lg text-center py-2">
                  {transaction.amount.toFixed(2)}
                </div>
                <div className="text-lg text-center py-2">
                  {transaction.dateAdded}
                </div>
              </div>
            );
          })}
      </div>
    );
  };

  return (
    <main className="flex min-h-screen bg-[#031525] flex-col items-center justify-center pt-12">
      {financeData ? (
        <div
          className="w-full max-w-4xl text-gray-800 shadow-lg rounded-lg pt-2 overflow-hidden"
          ref={wrapperRef}
        >
          <div className="bg-gradient-to-r from-[#035172] to-[#0587be] p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="relative text-white font-bold text-3xl text-center">Finance Information</div>
            <div className="text-white text-lg text-center">Balance: ${(financeData.totalPaid - financeData.toPay).toFixed(2)}</div>
            <div className="text-white text-lg text-center">Tuition: ${financeData.tuition.toFixed(2)}</div>
            <div className="text-white text-lg text-center">Total Paid: ${financeData.totalPaid.toFixed(2)}</div>
            <div className="text-white text-lg text-center">To Pay: ${financeData.toPay.toFixed(2)}</div>
          </div>

          <div className="px-6 py-4 bg-[#031525]">{renderTransactionRecords()}</div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-16 w-16 mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      )}
    </main>
  );
}

export default Finance;
