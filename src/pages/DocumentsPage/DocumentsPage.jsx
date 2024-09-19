import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import documentService from "../../services/documentService";
import DocumentsTable from "../../components/DocumentsTable";

function DocumentsPage({
  setCurrentDocument,
  analyzeDocument,
  getDocumentBase64,
  setScanType,
  scanType,
  selectedDocument,
  setSelectedDocument,
}) {
  const [documents, setDocuments] = useState([]);

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

  const handleRowClick = async (document) => {
    await getDocumentBase64(document.id);
    setSelectedDocument(document);
    console.log(document.id);
    console.log(document);
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
    try {
      const response = await documentService.getDocumentById(
        selectedDocument.id
      );
      setCurrentDocument(response);

      if (selectedEngine === "ABBY") {
        navigate(`/selectskill/${selectedDocument.id}`);
      } else if (selectedEngine === "Azure Document Intelligence") {
        await analyzeDocument();
        navigate(`/docintel/${selectedDocument.id}`);
      } else {
        console.error("Unknown engine selected");
      }
    } catch (error) {
      console.error("Error in handleConfirm:", error);
    }
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
        setScanType={setScanType}
        scanType={scanType}
      />
    </div>
  );
}

export default DocumentsPage;
