import Header from './Header';

const AppLayout = ({ children }) => {
  return (
    <div className='min-h-screen bg-background'>
      <Header />
      <main className='container mx-auto p-4'>
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
