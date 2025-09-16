import React from "react";
import { Page, Text, View } from "@react-pdf/renderer";

const Section = ({ title, content, registerSection }) => (
  <Page style={{ padding: 40 }}>
    <Text
      render={({ pageNumber }) => {
        registerSection(title, pageNumber);
        return `${title}`;
      }}
      style={{ fontSize: 16, marginBottom: 10 }}
    />
    <View>
      <Text>{content}</Text>
    </View>
    <Text
      style={{
        position: "absolute",
        bottom: 20,
        left: 0,
        right: 0,
        textAlign: "center",
        fontSize: 10,
      }}
      render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
    />
  </Page>
);

export default Section;
