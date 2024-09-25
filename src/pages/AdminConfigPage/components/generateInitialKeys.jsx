import { useState } from "react";
import Dropzone from "../../../components/Dropzone";


function generateInitialKeys() {
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState();
  const handleUploadSuccess = () => {};
  return (
    <div>
      <Dropzone
        onUploadSuccess={handleUploadSuccess}
        setFileName={setFileName}
        setFile={setFile}
      />
    </div>
  );
}

export default generateInitialKeys;
