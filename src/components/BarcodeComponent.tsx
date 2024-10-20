import React from 'react';
import Barcode from 'react-barcode';

interface BarcodeProps {
  value: string; // The data to encode in the barcode
  format?: 'CODE128' | 'CODE39' | 'EAN13' | 'EAN8' | 'UPC'; // Add all supported formats
  width?: number; // Width of each bar
  height?: number; // Height of the barcode
}

const BarcodeComponent: React.FC<BarcodeProps> = ({
  value,
  format = 'CODE128',
  width = 2,
  height = 100
}) => {
  return (
    <div>
      <Barcode
        value={value}
        format={format}
        width={width}
        height={height}
        displayValue={false} 
      />
    </div>
  );
};

export default BarcodeComponent;
