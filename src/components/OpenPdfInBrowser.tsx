import React from 'react';
import { pdf, Document, DocumentProps } from '@react-pdf/renderer';

interface OpenPdfInBrowserButtonProps {
  document: React.ReactElement<DocumentProps>;
  buttonText?: string;
}

const OpenPdfInBrowserButton: React.FC<OpenPdfInBrowserButtonProps> = ({
  document,
  buttonText = 'Open PDF in Browser',
}) => {
  const handleOpen = async () => {
    try {
      const blob = await pdf(document).toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    }
  };

  return <button onClick={handleOpen}>{buttonText}</button>;
};

export default OpenPdfInBrowserButton;
