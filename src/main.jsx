"use client"

import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import "./index.css"

import { BrowserRouter } from "react-router-dom"
import { LoginProvider } from "./components/Context/LoginContext.jsx"
import { LoadingProvider } from "./components/Context/LoadingContext.jsx"

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error("App Error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            fontFamily: "system-ui, sans-serif",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <h1 style={{ color: "#dc2626", marginBottom: "16px" }}>Something went wrong</h1>
          <p style={{ color: "#6b7280", marginBottom: "16px" }}>Please refresh the page or try again later.</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "10px 20px",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Refresh Page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <LoadingProvider>
      <LoginProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </LoginProvider>
    </LoadingProvider>
  </ErrorBoundary>,
)
