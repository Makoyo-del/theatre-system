// frontend/src/reportWebVitals.js
import { onCLS, onFCP, onINP, onLCP, onTTFB } from "web-vitals";

// Accept a callback function to handle metrics
const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && typeof onPerfEntry === "function") {
    onCLS(onPerfEntry);
    onFCP(onPerfEntry);
    onINP(onPerfEntry); // replaced onFID
    onLCP(onPerfEntry);
    onTTFB(onPerfEntry);
  }
};

export default reportWebVitals;
