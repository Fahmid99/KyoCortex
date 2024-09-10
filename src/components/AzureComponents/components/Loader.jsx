import HashLoader from "react-spinners/HashLoader";

function Loader() {
  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2 className="breathing-gradient" style={{ padding: "10px" }}>
          Analyzing Document
        </h2>
        <HashLoader color="#DB0D23" />
      </div>
    </div>
  );
}

export default Loader;
