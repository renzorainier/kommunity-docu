import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import './Finance.css'; // If needed for additional styles

function Finance({ userData }) {
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
      return <p>No transactions found.</p>;
    }

    return (
      <div>
        {Object.keys(financeData.transactions)
          .sort((a, b) => new Date(b) - new Date(a)) // Sort keys in descending order
          .map((date, index) => {
            const transactionDate = new Date(date);
            const transaction = financeData.transactions[date];

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
      {financeData ? (
        <div ref={wrapperRef}>
          <div>
            <div>Finance Information</div>
            <div>Balance: ${(financeData.totalPaid - financeData.toPay).toFixed(2)}</div>
            <div>Tuition: ${financeData.tuition.toFixed(2)}</div>
            <div>Total Paid: ${financeData.totalPaid.toFixed(2)}</div>
            <div>To Pay: ${financeData.toPay.toFixed(2)}</div>
          </div>

          <div>{renderTransactionRecords()}</div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </main>
  );
}

export default Finance;
