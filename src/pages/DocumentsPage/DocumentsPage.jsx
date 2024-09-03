import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import documentService from "../../services/documentService";
import DocumentsTable from "./components/DocumentsTable";

function DocumentsPage({ setCurrentDocument }) {
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedEngine, setSelectedEngine] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const data = await documentService.getDocuments();
      if (data) {
        setDocuments(data);
      } else {
        console.error("Error fetching data");
      }
    };
    fetchData();
  }, []);

  const handleRowClick = (document) => {
    setSelectedDocument(document);
    console.log(document.id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedDocument(null);
  };

  const handleEngineChange = (event) => {
    setSelectedEngine(event.target.value);
  };

  const handleConfirm = async () => {
    const response = await documentService.getDocumentById(selectedDocument.id);
    setCurrentDocument(response);

    navigate("/selectskill");
  };

  return (
    <div>
      <DocumentsTable
        documents={documents}
        selectedDocument={selectedDocument}
        selectedEngine={selectedEngine}
        handleRowClick={handleRowClick}
        handleClose={handleClose}
        handleEngineChange={handleEngineChange}
        handleConfirm={handleConfirm}
        open={open}
      />
    </div>
  );
}

export default DocumentsPage;
