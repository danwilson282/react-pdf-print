import React, { useState, useRef } from "react";
import { PDFDownloadLink, pdf } from "@react-pdf/renderer";
import FormattedDocument from "./components/FormattedDocument";
import { Page, Text, View, Svg, Path, Rect, G } from "@react-pdf/renderer";
// import HtmlNodeExample, {htmlExample} from "./components/Example";
import { renderHtmlToPdfNodes } from "./components/HtmlParser";
import { parseSectionsFromReactNodes } from "./helpers/parseHtmlToSections";
import OpenPdfInBrowserButton from "./components/OpenPdfInBrowser";
import { MathJax } from "./components/MathJax";
import { intro } from "./AQA/Maths/Intro";
import { specAtAGlance } from "./AQA/Maths/specAtAGlance";

export type sectionType = { title: string; content: string | React.ReactNode};
export type registerSectionType = (title: string, pageNumber: number, id: number, type: string) => void;

export type tocEntry = { id: number; title: string; pageNumber: number, type: string };
export type tocType = tocEntry[];

const mathML = `
  <math xmlns="http://www.w3.org/1998/Math/MathML">
    <mrow>
      <mi>y</mi>
      <mo>=</mo>
      <mfrac>
        <mn>1</mn>
        <mi>x</mi>
      </mfrac>
    </mrow>
  </math>
`;





const App: React.FC = () => {
  const [tocMap, setTocMap] = useState<tocType>([]);
  const tempMap = useRef<tocType>([]);
  
  const registerSection: registerSectionType = (title, pageNumber, id, type) => {
    // type is pageNumber_subOrSection_root_0_div_1_div_9_h3
    // Avoid duplicate entries by checking ID
    if (!tempMap.current.some(entry => entry.id === id)) {
      const newEntry = { id, title, pageNumber , type };
      tempMap.current.push(newEntry);
  
      // Optional: sort by ID or page number
      const sortedToc = [...tempMap.current].sort((a, b) => a.id - b.id);
      setTocMap(sortedToc);
    }
  };
  const sections: sectionType[] = [
    {
      title: "Introduction",
      content: renderHtmlToPdfNodes(intro,registerSection),
    },
    {
      title: "Specification at a glance",
      content: renderHtmlToPdfNodes(specAtAGlance,registerSection),
    },
    {
      title: "Pagignation Test",
      content:           
      <Text>
        {Array(200)
          .fill("This is some content that will flow across pages. ")
          .join("")}
      </Text>,
    },
    {
      title: "MathJax",
      content: <MathJax content={mathML} />
  
    },
    { title: "Conclusion", content: "Closing notes." },
  ];


  const content = (
    <>
      <h1>Intro</h1>
      <p>Hello world</p>
      <h1>Details</h1>
      <p>More info here</p>
    </>
  );
  
  const sectionsTest = parseSectionsFromReactNodes(content);



  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>React PDF with TOC</h1>
      <PDFDownloadLink
        document={
          <FormattedDocument
            sections={sections}
            tocMap={tocMap}
            registerSection={registerSection}
          />
        }
        fileName="report.pdf"
      >
        {({ loading }) => (<span>{loading ? "Generating PDF..." : "Download PDF"}</span>)}
      </PDFDownloadLink>
      <OpenPdfInBrowserButton
        document={
          <FormattedDocument
            sections={sections}
            tocMap={tocMap}
            registerSection={registerSection}
            headerText={"GCSE Mathematics (8300). For exams in May/June 2017 onwards. Version 1.0"}
            footerText={"Visit aqa.org.uk/8300 for the most up-to-date specifications, resources, support and administration"}
          />
        }
        buttonText="Open PDF in Browser"
      />

    </div>
  );
};

export default App;
