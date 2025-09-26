import React, { useState, useRef } from "react";
import { PDFDownloadLink, pdf } from "@react-pdf/renderer";
import FormattedDocument from "./components/FormattedDocument";
import { Page, Text, View, Svg, Path, Rect, G } from "@react-pdf/renderer";
import HtmlNodeExample, {htmlExample} from "./components/Example";
import { renderHtmlToPdfNodes } from "./components/HtmlParser";
import { parseSectionsFromReactNodes } from "./helpers/parseHtmlToSections";
import OpenPdfInBrowserButton from "./components/OpenPdfInBrowser";
import { MathJax } from "./components/MathJax";
import { intro } from "./AQA/Maths/Intro";
import { specAtAGlance } from "./AQA/Maths/specAtAGlance";

export type tocType = { [key: string]: number };
export type sectionType = { title: string; content: string | React.ReactNode};
export type registerSectionType = (title: string, pageNumber: number) => void;


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


const sections: sectionType[] = [
  {
    title: "Introduction",
    content: renderHtmlToPdfNodes(intro),
  },
  {
    title: "Specification at a glance",
    content: renderHtmlToPdfNodes(specAtAGlance),
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
    title: "Results",
    content: renderHtmlToPdfNodes(htmlExample),
  },
  {
    title: "MathJax",
    content: <MathJax content={mathML} />

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
  // console.log("TOC Map:", tocMap);


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
      <PDFDownloadLink
      
        document={<HtmlNodeExample/>}
        fileName="html-example.pdf"
        >
      {({ loading }) => (<span>{loading ? "Generating PDF..." : "Download parsed PDF"}</span>)}
      </PDFDownloadLink>
      <OpenPdfInBrowserButton
        document={
          <FormattedDocument
            sections={sections}
            tocMap={tocMap}
            registerSection={registerSection}
          />
        }
        buttonText="Open PDF in Browser"
      />

    </div>
  );
};

export default App;
