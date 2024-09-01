import React from 'react';

const RefreshButton = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <button onClick={handleRefresh}>Refresh Data</button>
  );
};

export default RefreshButton;
