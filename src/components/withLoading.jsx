// src/components/withLoading.js
import React, { useState, useEffect } from "react";
import Spinner from "./Spinner";

const withLoading = (WrappedComponent) => {
  return (props) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const timer = setTimeout(() => setLoading(false), 1000); // Simulate loading delay
      return () => clearTimeout(timer);
    }, []);

    return loading ? (
      <Spinner loading={loading} />
    ) : (
      <WrappedComponent {...props} />
    );
  };
};

export default withLoading;
