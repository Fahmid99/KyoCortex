import UploadProcessCard from "../../components/UploadProcessCard";

function AbbySelectSkillPage({ currentDocument }) {
  return (
    <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
      <UploadProcessCard currentDocument={currentDocument} />
    </div>
  );
}

export default AbbySelectSkillPage;
