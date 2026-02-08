import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { store } from "./store/store";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 2500,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 2500,
              theme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 2500,
              theme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
