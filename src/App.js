import React, { useState, useRef } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import MyDoc from "./MyDoc";

const sections = [
  { title: "Introduction", content: "This is the intro text." },
  {
    title: "Methods",
    content: "I am a fish. ".repeat(500),
  },
  {
    title: "Results",
    content: "I am a fish. ".repeat(500),
  },
  { title: "Conclusion", content: "Closing notes." },
];

const App = () => {
  const [tocMap, setTocMap] = useState({});
  const tempMap = useRef({});

  const registerSection = (title, pageNumber) => {
    if (!tempMap.current[title]) {
      tempMap.current[title] = pageNumber;
      setTocMap({ ...tempMap.current });
    }
  };
  console.log("TOC Map:", tocMap);
  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>React PDF with TOC</h1>
      <PDFDownloadLink
        document={
          <MyDoc
            sections={sections}
            tocMap={tocMap}
            registerSection={registerSection}
          />
        }
        fileName="report.pdf"
      >
        {({ loading }) => (loading ? "Generating PDF..." : "Download PDF")}
      </PDFDownloadLink>
    </div>
  );
};

export default App;
