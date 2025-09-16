import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import Section from "./Section";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 12, fontFamily: "Helvetica" },
  header: { fontSize: 18, marginBottom: 20, textAlign: "center" },
  tocItem: { marginBottom: 5 },
});

const MyDoc = ({ sections, tocMap, registerSection }) => {
  console.log(tocMap)
  return (
  <Document>
    {/* COVER */}
    <Page style={styles.page}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 32 }}>My Report Title</Text>
        <Text style={{ marginTop: 20, fontSize: 16 }}>Subtitle / Author</Text>
      </View>
    </Page>

    {/* TOC */}
    <Page style={styles.page}>
      <Text style={styles.header}>Table of Contents</Text>
      <View>
        {sections.map((s, i) => (
          <Text key={i} style={styles.tocItem}>
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

export default MyDoc;
