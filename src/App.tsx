import React, { useState, useRef } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
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
  const cover: FrontCoverProps = {
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
  }
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
      title: "Subject content",
      content: renderHtmlToPdfNodes(subjectContent,registerSection),
    },
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
  ];

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>React PDF with TOC</h1>
      <PDFDownloadLink
        document={
          <FormattedDocument
            frontCover={cover}
            sections={sections}
            tocMap={tocMap}
            registerSection={registerSection}
            headerText={"GCSE Mathematics (8300). For exams in May/June 2017 onwards. Version 1.0"}
            footerText={"Visit aqa.org.uk/8300 for the most up-to-date specifications, resources, support and administration"}
          />
        }
        fileName="report.pdf"
      >
        {({ loading }) => (<span>{loading ? "Generating PDF..." : "Download PDF"}</span>)}
      </PDFDownloadLink>
      <OpenPdfInBrowserButton
        document={
          <FormattedDocument
            frontCover={cover}
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
