import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'

import AppLayout from './components/common/AppLayout'
import DashboardPage from './pages/DashboardPage'
import OrderEntryPage from './pages/OrderEntryPage'
import OrderBlotterPage from './pages/OrderBlotterPage'
import PositionsPage from './pages/PositionsPage'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <h2 style={{ padding: '2rem' }}>Something went wrong. Check console.</h2>
    }

    return this.props.children
  }
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "order-entry", element: <OrderEntryPage /> },
      { path: "order-blotter", element: <OrderBlotterPage /> },
      { path: "positions", element: <PositionsPage /> },
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </React.StrictMode>,
)
