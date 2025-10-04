import React from "react";
import { Page, Text, View, Document } from "@react-pdf/renderer";
import Section from "./Section";
import type { registerSectionType, sectionType,tocType } from "../App";
import { globalStyles } from "../styles/globalStyle";
import { nodeStyles } from "../styles/nodeStyle";
import { TableOfContents } from "./TableOfContents";
type Props = {
  sections: sectionType[];
  tocMap: tocType;
  registerSection: registerSectionType;
  headerText?: string;
  footerText?: string;
}

const FormattedDocument: React.FC<Props> = ({ sections, tocMap, registerSection, headerText, footerText }) => {

  return (
  <Document>
    {/* COVER */}
    <Page size="A4" style={globalStyles.page}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={nodeStyles.heading1}>My Report Title</Text>
        <Text style={nodeStyles.heading2}>Subtitle / Author</Text>
      </View>
    </Page>

    {/* TOC */}
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
