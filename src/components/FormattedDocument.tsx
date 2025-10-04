import React from "react";
import { Page, Document } from "@react-pdf/renderer";
import Section from "./Section";
import type { registerSectionType, sectionType,tocType } from "../App";
import { globalStyles } from "../styles/globalStyle";
import { TableOfContents } from "./TableOfContents";
import { Cover, FrontCoverProps } from "./Cover";
type Props = {
  frontCover: FrontCoverProps;
  sections: sectionType[];
  tocMap: tocType;
  registerSection: registerSectionType;
  headerText?: string;
  footerText?: string;
}

const FormattedDocument: React.FC<Props> = ({ sections, tocMap, registerSection, headerText, footerText, frontCover }) => {

  return (
  <Document>
    {/* COVER */}
    <Cover
       coverImage={frontCover.coverImage}
       logo={frontCover.logo}
       headingContainer={frontCover.headingContainer}
    />
    {/* Blank page */}
    <Page size="A4" style={globalStyles.page}></Page>
    {/* Table of contents */}
    <TableOfContents tocMap={tocMap} />

    {/* SECTIONS */}
    {sections.map((s, i) => (
      <Section
        key={i}
        id={i}
        title={`${i + 1}. ${s.title}`}
        content={s.content}
        registerSection={registerSection}
        headerText={headerText}
        footerText={footerText}
      />
    ))}
  </Document>
)};

export default FormattedDocument;
