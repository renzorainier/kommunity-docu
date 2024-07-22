import React, { useEffect } from 'react';

function Finance({ userData }) {
  useEffect(() => {
    console.log(userData);
  }, [userData]);

  return <div>Data has been logged to the console.</div>;
}

export default Finance;
