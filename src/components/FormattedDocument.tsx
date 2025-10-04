import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import Section from "./Section";
import type { registerSectionType, sectionType,tocType } from "../App";
import { globalStyles } from "../styles/globalStyle";
import { nodeStyles } from "../styles/nodeStyle";

type Props = {
  sections: sectionType[];
  tocMap: tocType;
  registerSection: registerSectionType;
  headerText?: string;
  footerText?: string;
}

const FormattedDocument: React.FC<Props> = ({ sections, tocMap, registerSection, headerText, footerText }) => {
  const parseType = (type: string) => {
    const parts = type.split("_");
    const num1 = Number(parts[0]) || 0;
    const num2 = Number(parts[1]) || 0;
    const letter = parts[2] || "";
    return { num1, num2, letter };
  };
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
    <Page size="A4" style={globalStyles.page}>
      <Text style={globalStyles.heading}>Contents</Text>
      <Text></Text>
      <View>
      {[...tocMap]
        .sort((a, b) => {
          const aParsed = parseType(a.type);
          const bParsed = parseType(b.type);
          if (aParsed.num1 !== bParsed.num1) return aParsed.num1 - bParsed.num1;
          if (aParsed.num2 !== bParsed.num2) return aParsed.num2 - bParsed.num2;
          return aParsed.letter.localeCompare(bParsed.letter);
        })
        .map((contentItem, i) => {
          const sectionType = parseType(contentItem.type).letter;
          const sectionStyle = () => {
            switch (sectionType) {
              case 'a':
                return globalStyles.tocSectionA;
              case 'b':
                return globalStyles.tocSectionB;
              case 'c':
                return globalStyles.tocSectionC;
              default:
                return {};
            }
          }
          return (
            <View style={globalStyles.tocItem} key={i}>
              <Text style={sectionStyle()}>
                {contentItem.title}
              </Text>
              <Text>{contentItem.pageNumber}</Text>
            </View>

          )
        })}
      </View>
    </Page>

    {/* SECTIONS */}
    {sections.map((s, i) => (
      <Section
        key={i}
        // id={`main_${i}`}
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
