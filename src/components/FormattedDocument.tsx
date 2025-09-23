import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import Section from "./Section";
import type { registerSectionType, sectionType,tocType } from "../App";
import { globalStyles } from "../styles/globalStyle";

type Props = {
  sections: sectionType[];
  tocMap: tocType;
  registerSection: registerSectionType;
}

const FormattedDocument: React.FC<Props> = ({ sections, tocMap, registerSection }) => {
  return (
  <Document>
    {/* COVER */}
    <Page size="A4" style={globalStyles.page}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 32 }}>My Report Title</Text>
        <Text style={{ marginTop: 20, fontSize: 16 }}>Subtitle / Author</Text>
      </View>
    </Page>

    {/* TOC */}
    <Page size="A4" style={globalStyles.page}>
      <Text style={globalStyles.header}>Table of Contents</Text>
      <View>
        {sections.map((s, i) => (
          <Text key={i} style={globalStyles.tocItem}>
            {i + 1}. {s.title}{" "}
            {tocMap[`${i+1}. ${s.title}`] ? `..... ${tocMap[`${i+1}. ${s.title}`]}` : ""}
          </Text>
        ))}
      </View>
    </Page>

    {/* SECTIONS */}
    {sections.map((s, i) => (
      <Section
        key={i}
        title={`${i + 1}. ${s.title}`}
        content={s.content}
        registerSection={registerSection}
      />
    ))}
  </Document>
)};

export default FormattedDocument;
