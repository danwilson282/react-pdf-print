import React, { useState, useRef } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import MyDoc from "./MyDoc";
import HtmlNodeExample from "./components/Example";
export type tocType = { [key: string]: number };
export type sectionType = { title: string; content: string };
export type registerSectionType = (title: string, pageNumber: number) => void;
const sections: sectionType[] = [
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

const App: React.FC = () => {
  const [tocMap, setTocMap] = useState<tocType>({});
  const tempMap = useRef<tocType>({});

  const registerSection: registerSectionType = (title: string, pageNumber: number): void => {
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
        {({ loading }) => (<span>{loading ? "Generating PDF..." : "Download PDF"}</span>)}
      </PDFDownloadLink>
      <PDFDownloadLink
      
        document={<HtmlNodeExample/>}
        fileName="html-example.pdf"
        >
      {({ loading }) => (<span>{loading ? "Generating PDF..." : "Download parsed PDF"}</span>)}
      </PDFDownloadLink>
    </div>
  );
};

export default App;
