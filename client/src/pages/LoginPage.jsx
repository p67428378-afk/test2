import React from 'react';
import LoginForm from '../components/Auth/LoginForm';
import { Shield } from 'lucide-react';

const LoginPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Shield className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-bold text-primary">FinSecure</h1>
        </div>
        <p className="text-sm text-on-surface-variant opacity-70">Institutional Grade Financial Protection</p>
      </div>
      
      <main className="w-full max-w-md bg-surface-container-lowest rounded-lg shadow-md overflow-hidden border border-outline-variant/10">
        <div className="h-2 bg-primary"></div>
        <div className="p-8">
          <header className="mb-6">
            <h2 className="text-xl font-semibold text-on-surface mb-1">Secure Login</h2>
            <p className="text-sm text-on-surface-variant">Enter your credentials to access your secure portal.</p>
          </header>
          <LoginForm />
        </div>
        <footer className="bg-surface-container-low p-4 text-center border-t border-outline-variant/10">
          <p className="text-xs text-on-surface-variant">
            Protected by 256-bit encryption.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default LoginPage;
