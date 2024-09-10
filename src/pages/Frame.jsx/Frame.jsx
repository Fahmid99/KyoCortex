import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ManualReview = ({ token }) => {
  const navigate = useNavigate();
  const manualReviewLink =
    "https://vantage-us.abbyy.com/manual-review/Verification?jobId=eeaf9de3-3a46-417a-a576-94563ea8f968&settings=&transactionId=7d39f50d-bd18-4912-8f27-8fd27de37164";

  useEffect(() => {
    const iframe = document.createElement("iframe");
    iframe.src = getUrl();
    iframe.style.width = "calc(100vw)";
    iframe.style.height = "calc(100vh - 75px)";
    iframe.style.border = "0";
    try {
      document
        .getElementById("main")
        .removeChild(document.querySelector("iframe"));
    } catch (e) {}
    document.getElementById("main").appendChild(iframe);
    window.addEventListener("message", receiveMessage, false);

    return () => {
      window.removeEventListener("message", receiveMessage, false);
    };
  }, [manualReviewLink]);

  const getUrl = () => {
    return `${manualReviewLink}&displayMode=iframe&token=${token}`;
  };

  const receiveMessage = (event) => {
    console.log(event.data);
    if (event.origin !== "https://vantage-us.abbyy.com") return;

    if (event.data.target === "parent") {
      if (event.data.eventName === "ManualReviewWasCompleted") {
        navigate("/dashboard");
      } else if (
        event.data.eventName === "ManualReviewWithdrawn" ||
        event.data.eventName === "ManualReviewWasPaused"
      ) {
        navigate("/dashboard");
      }
    }
  };

  return (
    <div
      id="main"
      style={{
        minHeight: "100%",
        height: `calc(100vh - 70px)`,
        position: "relative",
        boxSizing: "border-box",
      }}
    ></div>
  );
};

export default ManualReview;
