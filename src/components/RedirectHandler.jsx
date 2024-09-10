import React, { useEffect } from "react";

function RedirectHandler() {
  useEffect(() => {
    // Extract token from URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    // Send token to the parent window
    window.opener.postMessage(
      { token },
      "https://vantage-us.abbyy.com/manual-review/Verification?jobId=eeaf9de3-3a46-417a-a576-94563ea8f968&settings=&transactionId=7d39f50d-bd18-4912-8f27-8fd27de37164"
    );
    window.close();
  }, []);

  return <div>Redirecting...</div>;
}

export default RedirectHandler;
