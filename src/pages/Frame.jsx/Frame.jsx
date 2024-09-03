import { useEffect } from "react";

const ManualReview = () => {
  const manualReviewLink =
    "https://vantage-us.abbyy.com/manual-review?transactionId=b04f6326-33e3-4b90-82a9-f593b1118fc4&documentIds=dc80e312-319e-4418-a799-0586821b4f01&jobId=585191d8-6fee-494f-b6af-ae6f9b51542b&accessToken=eyJhbGciOiJSUzI1NiIsImtpZCI6IjNDNERGMDRCQzMzQ0FFQjVGOUE2NzJCRkQ0MUVFN0ZDNzhCRDc4RUZSUzI1NiIsInR5cCI6ImF0K2p3dCIsIng1dCI6IlBFM3dTOE04cnJYNXBuS18xQjduX0hpOWVPOCJ9.eyJuYmYiOjE3MjUzMjc0OTksImV4cCI6MTcyNTkzMjI5OSwiaXNzIjoiaHR0cHM6Ly92YW50YWdlLXVzLmFiYnl5LmNvbS9hdXRoMi8iLCJhdWQiOiJwdWJsaWNhcGkiLCJzdWIiOiJiYTdhMjU5ZS1iMjVhLTQ3YzUtODM0Ny1kMzhhM2E4ZDY4NDAiLCJhdXRoX3RpbWUiOjE3MjUzMjc0OTksImlkcCI6ImxvY2FsIiwidGVuYW50IjoiNzk2NGJjN2UtMjg3My00YzE1LTlkNzgtNzdiNDMyNGE1ZmI5IiwicGVybWlzc2lvbiI6WyJza2lsbC5jcmVhdGUiLCJza2lsbC5pbXBvcnQiLCJza2lsbC5jYXRhbG9ncyIsInNraWxsLmRpc2NvdmVyIiwic2tpbGwuZXhlY3V0ZSIsInNraWxsLm1hbnVhbC1yZXZpZXciLCJza2lsbC5tb25pdG9yIiwic2tpbGwudHJ5Iiwic2tpbGwuZWRpdC1wdWJsaXNoIiwic2tpbGwuYWQiLCJza2lsbC5kZWxldGUiLCJza2lsbC5leHBvcnQiLCJza2lsbC5jb3B5Iiwic2tpbGwuc3VwZXJ2aXNvciIsImF1dGhfYWRtaW5fYXBpLnRlbmFudF9hZG1pbiIsInNraWxsLnZlcmlmeSJdLCJyZXNvdXJjZSI6ImIwNGY2MzI2LTMzZTMtNGI5MC04MmE5LWY1OTNiMTExOGZjNCIsImp0aSI6Ijg1QTlGNEVENTU5QjdCRDcyOTY2RUFDQkVFRkE2MDEyIiwiaWF0IjoxNzI1MzI3NDk5LCJzY29wZSI6WyJvcGVuaWQiLCJwZXJtaXNzaW9ucyIsInZlcmlmaWNhdGlvbi5tYW51YWxfcmV2aWV3Il0sImFtciI6WyJvdHQiXX0.gLpH2sLcglzaW_CQ5tanhUuhglmzfldobThlEIBaoUhElszDNcxM-KeL3tiDyMsJE6pjaSa920OoIJMirIZXas25ztFkL4pCtjdYQXP2Y7VcwJmm14zShFTEA9-haPg22_JCK8HcF6b-e5AqOCsVIRr8A3ixk3QZJXLueW-vknWDHuuEFPCTqSFCNbiKIF3u0TUqhCuHOe4bKHlyp8SQhoTKLhl92qHTZaSRAq-lE3nXi8fH4zL1FE_yXU4im2xrXG-7GPJkSUENlow2ydGZJHpeTQN_w0iDC-rHTdfXrcS1aWl9NlJXTyAqq9eQ5U8D2Sj_v5mYL6UtRru_V7eSgQ";
  useEffect(() => {
    const iframe = document.createElement("iframe");
    iframe.src = getUrl();
    iframe.style.width = "100%";
    iframe.style.height = "100%";
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
    return manualReviewLink + "&displayMode=iframe";
  };

  const receiveMessage = (event) => {
    console.log(event.data);
    if (event.data.target === "parent") {
      if (event.data.eventName === "ManualReviewWasCompleted") {
        window.location.href = "home.html";
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
        margin: 0,
        padding: 0,

        padding: "20px",
        boxSizing: "border-box",
      }}
    ></div>
  );
};

export default ManualReview;
