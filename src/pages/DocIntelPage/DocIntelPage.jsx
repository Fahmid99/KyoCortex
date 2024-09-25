import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import axios from "axios";

import DocumentViewer from "../../components/AzureComponents/DocumentViewer";
import azureDocumentService from "../../services/azureDocumentService";
import { ToastContainer, toast } from "react-toastify";
import keimService from "../../services/keimService";

function DocIntelPage({
  base64,
  documentData,
  scanType,
  selectedDocument,
  docId,
  docFormFields,
  processId,
}) {
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

  const stringToDate = (string) => {
    const localDate = new Date(string);
    const utcDate = new Date(
      Date.UTC(
        localDate.getFullYear(),
        localDate.getMonth(),
        localDate.getDate(),
        localDate.getHours(),
        localDate.getMinutes(),
        localDate.getSeconds(),
        localDate.getMilliseconds()
      )
    );
    console.log("UTC Date:", utcDate);
    return utcDate;
  };

  console.log(docFormFields);
  console.log(processId);
  const submitData = async (docId, formData) => {
    console.log(formData, "testing here");
    const filteredFormData = Object.fromEntries(
      Object.entries(formData).filter(
        ([key, value]) => key in docFormFields && value !== "<undefined>"
      )
    );

    console.log(filteredFormData);
    try {
      await keimService.submitData(docId, filteredFormData);
      console.log("Success: Data sent");
      toast.success("Data submitted successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (err) {
      console.error("Error submitting data with KeimService:", err);
      throw err;
    }

    try {
      await keimService.endProcess(processId);
    } catch (err) {
      console.error("Error ending process:", err);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const itemsArray = [];
    console.log(autoFormValues);
    const formValues = Object.entries(autoFormValues).reduce(
      (acc, [key, { value }]) => {
        // Remove spaces and special characters from keys
        const lowerKey = key
          .toLowerCase()
          .replace(/\s+/g, "")
          .replace(/[^a-z0-9]/gi, "");

        if (lowerKey === "invoicedate") {
          acc[lowerKey] = stringToDate(value);
        } else if (lowerKey === "items" && Array.isArray(value)) {
          // Iterate over the items array and transform each item dynamically
          value.forEach((item) => {
            const transformedItem = {};
            const properties = item.properties;

            // Get the keys of the properties object
            const propertyKeys = Object.keys(properties);
            propertyKeys.forEach((propKey) => {
              transformedItem[propKey.toLowerCase()] =
                properties[propKey].value;
            });

            itemsArray.push(transformedItem);
          });
          acc[lowerKey] = itemsArray;
        } else {
          acc[lowerKey] = value;
        }

        return acc;
      },
      {}
    );
    await submitData(docId, formValues);

   // window.location.replace(`http://10.170.193.9/app/kyocera/object/${docId}`);

    console.log("Form submitted:", formValues);
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
        handleSubmit={handleSubmit}
      />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default DocIntelPage;
