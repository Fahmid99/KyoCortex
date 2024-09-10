import UploadProcessCard from "../../components/UploadProcessCard";

function AbbySelectSkillPage({ currentDocument }) {
  const handleLogin = () => {
    window.location.href =
      "https://vantage-us.abbyy.com/manual-review/Verification?jobId=eeaf9de3-3a46-417a-a576-94563ea8f968&settings=&transactionId=7d39f50d-bd18-4912-8f27-8fd27de37164";
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <UploadProcessCard currentDocument={currentDocument} />
    </div>
  );
}

export default AbbySelectSkillPage;
