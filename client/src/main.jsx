import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import DashboardPage from './pages/DashboardPage';
import CampaignsListPage from './pages/CampaignsListPage';
import CampaignDetailsPage from './pages/CampaignDetailsPage';
import SocialMediaIntegrationsPage from './pages/SocialMediaIntegrationsPage';
import ReportsPage from './pages/ReportsPage';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'campaigns',
        element: <CampaignsListPage />,
      },
      {
        path: 'campaigns/:id',
        element: <CampaignDetailsPage />,
      },
      {
        path: 'reports',
        element: <ReportsPage />,
      },
      {
        path: 'integrations',
        element: <SocialMediaIntegrationsPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
