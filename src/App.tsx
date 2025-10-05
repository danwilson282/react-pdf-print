import React, { useState, useRef } from "react";
import { PDFDownloadLink, BlobProvider } from "@react-pdf/renderer";
import FormattedDocument from "./components/FormattedDocument";
// import HtmlNodeExample, {htmlExample} from "./components/Example";
import { renderHtmlToPdfNodes } from "./components/HtmlParser";
import OpenPdfInBrowserButton from "./components/OpenPdfInBrowser";
// import { MathJax } from "./components/MathJax";
import { intro } from "./AQA/Maths/Introduction";
import { specAtAGlance } from "./AQA/Maths/specificationAtAGlance";
import { subjectContent } from "./AQA/Maths/subjectContent";
import { schemeOfAssessment } from "./AQA/Maths/schemeOfAssessment";
import { generalAdministration } from "./AQA/Maths/generalAdministration";
import { appendix } from "./AQA/Maths/appendix";
import backgroundImage from "./AQA/SampleBackground.png";
import logo from "./AQA/AQAlogo.png";
import { FrontCoverProps } from "./components/Cover";
export type sectionType = { title: string; content: string | React.ReactNode};
export type registerSectionType = (title: string, pageNumber: number, id: number, type: string) => void;

export type tocEntry = { id: number; title: string; pageNumber: number, type: string };
export type tocType = tocEntry[];

// const mathML = `
//   <math xmlns="http://www.w3.org/1998/Math/MathML">
//     <mrow>
//       <mi>y</mi>
//       <mo>=</mo>
//       <mfrac>
//         <mn>1</mn>
//         <mi>x</mi>
//       </mfrac>
//     </mrow>
//   </math>
// `;





const App: React.FC = () => {
  const [tocMap, setTocMap] = useState<tocType>([]);
  const tempMap = useRef<tocType>([]);
  const [ready, setReady] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const registerSection: registerSectionType = React.useCallback((title, pageNumber, id, type) => {
    if (!ready){
      const existingIndex = tempMap.current.findIndex(entry => entry.id === id);
  
      const newEntry = { id, title, pageNumber, type };
    
      if (existingIndex !== -1) {
        // ✅ Overwrite existing entry
        tempMap.current[existingIndex] = newEntry;
      } else {
        // ✅ Add new entry
        tempMap.current.push(newEntry);
      }
    
      // Sort updated TOC and update state
      const sortedToc = [...tempMap.current].sort((a, b) => a.id - b.id);
      setTocMap(sortedToc);
    }

  },[tocMap]);
  const cover: FrontCoverProps = React.useMemo(()=>({
    coverImage: backgroundImage,
    logo: logo,
    headingContainer: {
      heading1: "GCSE",
      heading2: "MATHEMATICS",
      subheading: "(8300)",
      title: "Specification",
      description1: "For teaching from September 2015 onwards",
      description2: "For exams in May/June 2017 onwards",
      subText: "Version 1.0 12 September 2014"
    }
  }),[])
  const sections: sectionType[] = React.useMemo(()=>([
    {
      title: "Introduction",
      content: renderHtmlToPdfNodes(intro,registerSection),
    },
    {
      title: "Specification at a glance",
      content: renderHtmlToPdfNodes(specAtAGlance,registerSection),
    },
    // {
    //   title: "Subject content",
    //   content: renderHtmlToPdfNodes(subjectContent,registerSection),
    // },
    {
      title: "Scheme of assessment",
      content: renderHtmlToPdfNodes(schemeOfAssessment,registerSection),
    },
    {
      title: "General administration",
      content: renderHtmlToPdfNodes(generalAdministration,registerSection),
    },
    {
      title: "Appendix",
      content: renderHtmlToPdfNodes(appendix,registerSection),
    }
  ]),[tocMap]);

  const memoizedDocument = React.useMemo(() => (
    <FormattedDocument
      frontCover={cover}
      sections={sections}
      tocMap={tocMap}
      registerSection={registerSection}
      headerText="GCSE Mathematics (8300). For exams in May/June 2017 onwards. Version 1.0"
      footerText="Visit aqa.org.uk/8300 for the most up-to-date specifications, resources, support and administration"
    />
  ), [cover, sections, tocMap]); 


  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>React PDF with TOC</h1>

      <BlobProvider document={memoizedDocument}>
        {({ blob, url, loading, error }) => {
          if (loading) return <span>Generating PDF...</span>;
          if (error) return <span>Error: {error.message}</span>;
          if (url) {
            setReady(true)
            return (
              <a href={url} target="_blank" rel="noopener noreferrer">
                Download PDF
              </a>
            );
          }
          
          return null;
        }}
      </BlobProvider>
    </div>
  );
};

export default App;
