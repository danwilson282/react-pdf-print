import React from "react";
import { Page, Text, View } from "@react-pdf/renderer";
import type { registerSectionType } from "../App";
import { globalStyles } from "../styles/globalStyle";
import { nodeStyles } from "../styles/nodeStyle";
type Props = {
  title: string;
  content: string | React.ReactNode;
  registerSection: registerSectionType
}

const Section: React.FC<Props> = ({ title, content, registerSection }) => (
  <Page size="A4" style={globalStyles.page}>
    <View>
      <Text
        render={({ pageNumber }) => {
          registerSection(title, pageNumber);
          return `${title}`;
        }}
        style={nodeStyles.heading2}
      />

      {typeof content === "string" ? <Text>{content}</Text> : content}
    </View>
    <Text
      style={globalStyles.footer}
      render={({ pageNumber, totalPages }) =>
        `Page ${pageNumber} of ${totalPages}`
      }
      fixed
    />
  </Page>
);

export default Section;
