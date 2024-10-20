import React from 'react';
import Barcode from 'react-barcode';

interface Product {
  id: number;
  name: string;
  code: string;
  barcode: string; // The barcode value
}

const products: Product[] = [
  { id: 1, name: 'Product 1', barcode: '123456789012', code: 'P-74695078' },
  { id: 2, name: 'Product 2', barcode: '234567890123' , code: 'P-87285776'},
  { id: 3, name: 'Product 3', barcode: '345678901234' , code: 'P-00307291'},
  { id: 4, name: 'Product 4', barcode: '456789012345' , code: 'P-83125072'},
  { id: 5, name: 'Product 5', barcode: '567890123456' , code: 'P-66352833'},
  { id: 6, name: 'Product 6', barcode: '234567899876' , code: 'P-6186053'},
  { id: 6, name: 'Product 6', barcode: '234567899876' , code: 'P-6186053'},
  { id: 6, name: 'Product 6', barcode: '234567899876' , code: 'P-6186053'},
  { id: 6, name: 'Product 6', barcode: '234567899876' , code: 'P-6186053'},
  { id: 6, name: 'Product 6', barcode: '234567899876' , code: 'P-6186053'},
  { id: 6, name: 'Product 6', barcode: '234567899876' , code: 'P-6186053'},
];

const CreateBarcode: React.FC = () => {
  return (
    <div>
      <h1 className='text-xl font-bold mb-3'>List Product's Barcode</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Name</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Product's Code</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Barcode</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.name}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{product.code}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <Barcode
                  value={product.code}
                  format="CODE128"
                  width={1}
                  height={40}
                  displayValue={false} // Hide the text representation of the barcode
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CreateBarcode;
