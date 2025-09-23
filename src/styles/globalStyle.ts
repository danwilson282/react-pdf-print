import { StyleSheet } from "@react-pdf/renderer";
export const globalStyles = StyleSheet.create({
  page: { padding: 40, fontSize: 12, fontFamily: "Helvetica" },
  header: { fontSize: 18, marginBottom: 20, textAlign: "center" },
  tocItem: { marginBottom: 5 },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 12,
    color: 'grey',
  },
});