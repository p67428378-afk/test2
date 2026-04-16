import React from 'react';
import CardComparison from './pages/CardComparison';
import SecureApplication from './pages/SecureApplication';

function App() {
  const [page, setPage] = React.useState('comparison');

  const navigateTo = (pageName) => {
    setPage(pageName);
  };

  return (
    <div>
      {page === 'comparison' && <CardComparison navigateTo={navigateTo} />}
      {page === 'application' && <SecureApplication navigateTo={navigateTo} />}
    </div>
  );
}

export default App;
