import React from "react";

import { intro } from "./AQA/Maths/Introduction";
import { specAtAGlance } from "./AQA/Maths/specificationAtAGlance";
// import { subjectContent } from "./AQA/Maths/subjectContent";
import { schemeOfAssessment } from "./AQA/Maths/schemeOfAssessment";
import { generalAdministration } from "./AQA/Maths/generalAdministration";
import { appendix } from "./AQA/Maths/appendix";
import backgroundImage from "./AQA/SampleBackground.png";
import logo from "./AQA/AQAlogo.png";

import RenderPdf, { DocumentMeta } from "./components/RenderPdf";
import ServePdf from "./components/ServePdf";


import { renderMathMLToSVG } from "./helpers/mathjaxToSvg";
import { parseSvgToPrimitives } from "./helpers/parseSvgToPrimitives";
const Math = `
<math><msup><mrow><mi mathvariant="italic">a</mi></mrow><mrow><mn mathvariant="sans-serif">2</mn></mrow></msup><mo mathvariant="sans-serif">+</mo><msup><mrow><mi mathvariant="italic">b</mi></mrow><mrow><mn mathvariant="sans-serif">2</mn></mrow></msup><mo mathvariant="sans-serif">=</mo><msup><mrow><mi mathvariant="italic">c</mi></mrow><mrow><mn mathvariant="sans-serif">2</mn></mrow></msup></math>
`

const App: React.FC = () => {

  const documentMetadata: DocumentMeta = {
    cover: {
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
    },
    pageTemplate: {
      headerText: "GCSE Mathematics (8300). For exams in May/June 2017 onwards. Version 1.0",
      footerText: "Visit aqa.org.uk/8300 for the most up-to-date specifications, resources, support and administration"
    }

  }
  const svg = renderMathMLToSVG(Math);
  // const prim = parseSvgToPrimitives(svg);

  console.log(svg)
  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>React PDF with TOC</h1>
      <ServePdf
      sections={[
        { title: "Introduction", content: intro },
        { title: "Specification at a glance", content: specAtAGlance },
        { title: "Scheme of assessment", content: schemeOfAssessment },
        { title: "General administration", content: generalAdministration },
        { title: "Appendix", content: appendix },
      //  { title: "Subject content", content: subjectContent },
    ]}
      meta={documentMetadata}
      ></ServePdf>
    </div>
  );
};

export default App;
