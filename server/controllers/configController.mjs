import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();
const auth =
  "Basic " +
  Buffer.from(`${process.env.KEIMUSERNAME}:${process.env.PASSWORD}`).toString(
    "base64"
  );
export const getMergedData = async (req, res) => {
  try {
    let jsonData = [];

    // Check if the file exists and is not empty
    if (
      fs.existsSync("data.json") &&
      fs.readFileSync("data.json", "utf8").trim()
    ) {
      jsonData = JSON.parse(fs.readFileSync("data.json", "utf8"));
    }

    // Fetch the types from the external API
    const response = await axios.get(
      `http://10.170.193.9/rest-ws/service/system/type/list?elements=false&baseparameter=false&embedcs=false&basetypes=false`,
      {
        headers: { Authorization: auth },
      }
    );

    const types = response.data.map((type) => ({
      technicalName: type.name,
      label: type.label,
      id: type.id,
    }));

    // Merge the data based on matching IDs
    const mergedArray = [...jsonData, ...types].reduce((acc, obj) => {
      const existing = acc.find((item) => item.id === obj.id);
      if (existing) {
        if (!existing.keygeneration) {
          Object.assign(existing, obj);
        }
      } else {
        acc.push(obj);
      }
      return acc;
    }, []);

    // Write the merged array back to the JSON file
    fs.writeFileSync("data.json", JSON.stringify(mergedArray, null, 4));

    // Send the merged data as the response
    res.json(mergedArray);
  } catch (error) {
    console.error("Error processing data:", error);
    res.status(500).send("Error processing data");
  }
};

export const getConfigFormFields = async (req, res) => {
  const { name } = req.query;

  try {
    const response = await axios.get(
      `http://10.170.193.9/rest-ws/service/system/type/name/${name}?elements=true&baseparameter=false&embedcs=false`,
      {
        headers: { Authorization: auth },
      }
    );

    const result = response.data.elements.map((element) => element.name);
    res.json(result);
  } catch (error) {
    console.error("Error getting form fields:", error);
    res.status(500).send("Error getting form fields");
  }
};

export const updateMapping = async (req, res) => {
  const { id } = req.query;
  const { mapping } = req.body;

  try {
    const data = JSON.parse(fs.readFileSync("data.json", "utf8"));
    const index = data.findIndex((item) => item.id === id);
    data[index].mapping = mapping;
    data[index]
    fs.writeFileSync("data.json", JSON.stringify(data, null, 2), "utf8");
    res.json({ message: "Mapping updated successfully" });
  } catch (error) {
    console.error("Error updating mapping:", error);
    res.status(500).send("Error updating mapping");
  }
};



export const convertFileToBase64 = async (req, res) => {
  const file = req.file; // Assuming you're using multer to handle file uploads
  try {
    const base64String = file.buffer.toString("base64");
    return res.json({ base64String });
  } catch (error) {
    console.error("Error converting file to base64:", error);
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
};
