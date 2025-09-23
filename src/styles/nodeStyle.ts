import { StyleSheet } from "@react-pdf/renderer";
export const nodeStyles = StyleSheet.create({
  paragraph: { marginBottom: 6 },
  heading1: { fontSize: 18, marginBottom: 6 },
  heading2: { fontSize: 16, marginBottom: 6 },
  heading3: { fontSize: 14, marginBottom: 6 },
  strong: { fontWeight: "bold" },
  em: { fontStyle: "italic" },
  underline: { textDecoration: "underline" },


    table: {
      width: "100%",
      borderWidth: 1,
      borderColor: "#000",
      marginBottom: 8,
    },
    tableRow: {
      flexDirection: "row",
    },
    tableCol: {
      flex: 1, // each cell takes equal space
      borderWidth: 1,
      borderColor: "#000",
      padding: 4,
      justifyContent: "center",
    },
    tableCellText: {
      fontSize: 10,
    },

  inlineImage: { width: 20, height: 20, marginRight: 6 },

  listItem: { flexDirection: "row", marginBottom: 2 },
  listBullet: { width: 10 },
});