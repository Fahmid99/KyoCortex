import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axios from "axios";

import DocumentViewer from "../../components/AzureComponents/DocumentViewer";
import azureDocumentService from "../../services/azureDocumentService";

function DocIntelPage({ base64, documentData, scanType }) {
  const initialFormValues = {
    title: { label: "Title", value: "" },
    vendorname: { label: "Vendor Name", value: "" },
    commissionfilenumber: { label: "Commission File Number", value: "" },
  };

  const scanTypeValues = {
    default: "prebuilt-document",
    invoice: "prebuilt-invoice",
    receipt: "prebuilt-receipt",
    contract: "prebuilt-contract",
  };

  const formTypeValues = {
    custom: initialFormValues,
    automated: "prebuilt-document",
  };

  const [allDocuments, setAllDocuments] = useState([]);

  const [loading, setLoading] = useState(true); // Initialize loading state to true

  const [formValues, setFormValues] = useState(initialFormValues);

  const [formType, setFormType] = useState(formTypeValues.custom);
  const [autoFormValues, setAutoFormValues] = useState({});
  const [pageNumber, setPageNumber] = useState(0);

  const transformFormValues = (formValues) => {
    const transformed = {};
    for (const key in formValues) {
      if (formValues.hasOwnProperty(key)) {
        transformed[key] = formValues[key].value;
      }
    }
    return transformed;
  };

  const submitData = async (formData) => {
    const transformedData = transformFormValues(formData);

    try {
      await axios.put(`http://localhost:3001/submit`, transformedData);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  return (
    <div>
      <DocumentViewer
        base64={base64}
        documentData={documentData}
        formValues={formValues}
        setFormValues={setFormValues}
        submitData={submitData}
        scanType={scanType}
        autoFormValues={autoFormValues}
        setAutoFormValues={setAutoFormValues}
        setPageNumber={setPageNumber}
        pageNumber={pageNumber}
      />
    </div>
  );
}

export default DocIntelPage;
