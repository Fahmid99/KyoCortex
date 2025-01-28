import { useState } from "react";

import DocumentViewer from "../../components/AzureComponents/DocumentViewer";
import { ToastContainer, toast } from "react-toastify";
import keimService from "../../services/keimService";
import dcpService from "../../services/dcpService";
import { AutofpsSelect } from "@mui/icons-material";

function DocIntelPage({
  base64,
  documentData,
  scanType,
  docId,
  docFormFields,
  processId,
  docType,
  folderId,
  documentClassId,
  parentId,
  file,
  dcpFields,
  setDcpFields,
}) {
  const initialFormValues = {
    title: { label: "Title", value: "" },
    vendorname: { label: "Vendor Name", value: "" },
    commissionfilenumber: { label: "Commission File Number", value: "" },
  };

  const [formValues, setFormValues] = useState(initialFormValues);
  const [autoFormValues, setAutoFormValues] = useState({});
  const [pageNumber, setPageNumber] = useState(0);

  const notify = () =>
    toast.success("Data has been successfully submitted!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      color: "blue",
    });

  const nortifyError = () =>
    toast.error("There was an error in submitting the data!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      color: "red",
    });

  console.log(documentData);
  console.log(docFormFields);
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

  console.log(autoFormValues);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const itemsArray = [];

    const formValues = Object.entries(autoFormValues).reduce(
      (acc, [key, { value, technicalName, kind }]) => {
        // Use technicalName instead of lowerKey
        const keyName = technicalName || key;

        if (kind === "date") {
          acc[keyName] = stringToDate(value);
          console.log("date worked");
        } else if (keyName === "items" && Array.isArray(value)) {
          // Iterate over the items array and transform each item dynamically
          value.forEach((item) => {
            const transformedItem = {};
            const properties = item.properties;

            // Get the keys of the properties object
            const propertyKeys = Object.keys(properties);
            propertyKeys.forEach((propKey) => {
              if (typeof properties[propKey].value === "object") {
                transformedItem[propKey] = properties[propKey].value.amount;
              } else {
                transformedItem[propKey] = properties[propKey].value;
              }
            });

            itemsArray.push(transformedItem);
          });
          acc[keyName] = itemsArray;
        } else {
          acc[keyName] = value;
        }

        return acc;
      },
      {}
    );

    await submitData(docId, formValues);

    window.location.replace(`http://10.170.193.9/app/kyocera/object/${docId}`);

    console.log("Form submitted:", formValues);
  };

  console.log(formValues);

  console.log(folderId);
  console.log(documentClassId + "----------------------");

  const obj = {
    "appLdms:ldmsTemplateAttribute1": { value: "Huon IT" },
    "appLdms:ldmsTemplateAttribute2": { value: "Huon IT Pty Ltd" },
    "appLdms:ldmsTemplateAttribute3": {
      value: "Quarter One, Level 3 / 1 Epping Rd",
    },
    "appLdms:ldmsTemplateAttribute4": { value: "" },
    "appLdms:ldmsTemplateAttribute5": { value: "" },
    "appLdms:ldmsTemplateAttribute6": { value: "1300 486 648" },
    "appLdms:ldmsTemplateAttribute7": { value: "<undefined>" },
    "appLdms:ldmsTemplateAttribute8": {
      value: "Quarter One, Level 3 / 1 Epping Rd",
    },
    "appLdms:ldmsTemplateAttribute9": { value: "" },
    "appLdms:ldmsTemplateAttribute10": { value: "" },
    "appLdms:ldmsTemplateAttribute191": { value: "" },
    "appLdms:ldmsTemplateAttribute192": { value: "" },
  };

  const handleDCPSubmit = async () => {
    console.log(file);
    try {
      const response = await dcpService.uploadFile(
        file,
        documentClassId,
        folderId,
        dcpFields
      );
      console.log("File uploaded successfully:", response);
      console.log(documentClassId);

      notify();
      window.location.href =
        "https://kdaucustomer1.cim-pre4.kdcbslab.dev/litedms/dashboard";
    } catch (error) {
      console.error("Error uploading file:", error);
      nortifyError();
    }
  };

  const handleTestClick = async () => {
    const newObj = {};
    Object.keys(autoFormValues).forEach((key) => {
      newObj[key] = autoFormValues[key].value;
    });

    Object.keys(dcpFields).forEach((key) => {
      if (dcpFields[key].name in newObj) {
        dcpFields[key].value = newObj[dcpFields[key].name];
      }
    });

    const updatedDcpFields = { ...dcpFields };

    Object.keys(updatedDcpFields).forEach((key) => {
      delete updatedDcpFields[key].name;
    });

    setDcpFields(updatedDcpFields);
    console.log("Updated dcpFields:", updatedDcpFields);

    console.log(dcpFields);
    console.log(newObj);
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
        handleDCPSubmit={handleDCPSubmit}
        docType={docType}
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
      <button onClick={handleTestClick}>test</button>
    </div>
  );
}

export default DocIntelPage;
