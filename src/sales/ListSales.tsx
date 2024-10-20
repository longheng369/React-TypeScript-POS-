// import React, { useState } from "react";
// import { Table, Modal, Menu, Dropdown, Button } from "antd";
// import Purchase_Modal from "../purchases/Purchase_modal";
// import { MdOutlineKeyboardArrowDown } from "react-icons/md";
// interface ColumnsInterface {
//   title: string;
//   dataIndex?: string;
//   key: string;
//   width?: number;
//   className?: string;
//   render?: (value: any, record: any, index: number) => React.ReactNode;
// }

// interface PurchaseInterface {
//   id: number;
//   purchase_id: number | string;
//   date: string;
//   supplier_name: string;
//   total_cost: number;
//   purchase_status: 'Received' | 'Ordered' | 'Delivered';
//   payment_method: string;
//   delivery_date: string;
//   notes?: string;
//   paid: number; 
//   balance: number; 
//   payment_status: "Due" | "Partial" | "Paid"; 
//   grand_total: number; 
// }


// const columns: ColumnsInterface[] = [
//   {
//     title: 'Date',
//     dataIndex: 'date',
//     key: 'date',
//     width: 120,
//   },
//   {
//     title: 'Reference No°',
//     dataIndex: 'reference_no',
//     key: 'reference_no',
//     width: 140,
//   },
//   {
//     title: 'Biller',
//     dataIndex: 'biller',
//     key: 'biller',
//     width: 150,
//   },
//   {
//     title: 'Customer',
//     dataIndex: 'customer',
//     key: 'customer',
//     width: 150,
//   },
//   {
//     title: 'Sale Status',
//     dataIndex: 'sale_status',
//     key: 'sale_status',
//     width: 120,
//     render: (value: any) => {
//       return (
//         <div
//           className={`${value === "Completed" ? "bg-green-500" : value === "Pending" ? "bg-orange-500" : ""} text-center text-white p-2 rounded-md`}
//         >
//           {value}
//         </div>
//       );
//     },
//   },
//   {
//     title: 'Grand Total',
//     dataIndex: 'grand_total',
//     key: 'grand_total',
//     width: 100,
//     className: "text-end",
//     render: (value: any) => {
//       return <div>{(value * 1).toFixed(2)}$</div>;
//     },
//   },
//   {
//     title: 'Paid',
//     dataIndex: 'paid',
//     key: 'paid',
//     width: 100,
//     className: "text-end",
//     render: (value: any) => {
//       return <div>{(value * 1).toFixed(2)}$</div>;
//     },
//   },
//   {
//     title: 'Balance',
//     dataIndex: 'balance',
//     key: 'balance',
//     width: 100,
//     className: "text-end",
//     render: (value: any) => {
//       return <div>{(value * 1).toFixed(2)}$</div>;
//     },
//   },
//   {
//     title: 'Payment Status',
//     dataIndex: 'payment_status',
//     key: 'payment_status',
//     width: 120,
//     render: (value: any) => {
//       return (
//         <div
//           className={`${
//             value === "Paid" ? "bg-green-500" : value === "Due" ? "bg-red-500" : value === "Partial" ? "bg-blue-600" : ""
//           } text-center text-white rounded-md p-2`}
//         >
//           {value}
//         </div>
//       );
//     },
//   },
//   {
//     title: 'Payment Method',
//     dataIndex: 'payment_method',
//     key: 'payment_method',
//     width: 120,
//   },
//   {
//     title: 'Action',
//     key: 'action',
//     width: 120,
//     render: (_: any, record: any) => (
//       <Dropdown overlay={actionMenu} trigger={['click']}>
//         <Button className="action-button">
//           Actions <MdOutlineKeyboardArrowDown className='text-xl' />
//         </Button>
//       </Dropdown>
//     ),
//   },
// ];

// const actionMenu = (
//   <Menu>
//     <Menu.Item key='1'>Delete</Menu.Item>
//     <Menu.Item key='3'>View</Menu.Item>
//     <Menu.Item key='4'>Edit</Menu.Item>
//   </Menu>
// );

// const ListSales: React.FC = () => {
//   const { list_sales } = useDataContext();

//   // State for modal visibility and selected purchase
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [selectedRecord, setSelectedRecord] = useState<any>(null);

//   // Function to handle row click
//   const handleRowClick = (record: any, event: React.MouseEvent<HTMLElement>) => {
//     const clickedElement = event.target as HTMLElement;
//     // Check if clicked element is not the action button (which contains a class 'action-button')
//     if (!clickedElement.closest('.action-button')) {
//       setSelectedRecord(record);
//       setIsModalVisible(true);
//     }
//   };

//   // Function to close modal
//   const handleCancel = () => {
//     setIsModalVisible(false); // Close modal
//     selectedRecord(null); // Clear selected purchase
//   };

//   return (
//     <div className="shadow-sm border rounded-md bg-white p-8">
//       <h1 className="text-lg font-bold pb-4">List Sales</h1>
//       <div>
//         <Table
//           className="custom-table-purchases border rounded-t-[0.6rem]"
//           columns={columns}
//           dataSource={list_sales}
//           onRow={(record) => ({
//             onClick: (event) => handleRowClick(record, event),
//           })}
//         />
//       </div>

    
//       <Modal
//         title="Purchase Details"
//         visible={isModalVisible}
//         onCancel={handleCancel}
//         footer={null} 
//       >
//         {selectedRecord && (<Purchase_Modal/>)}
//       </Modal>
//     </div>
//   );
// };

// export default ListSales;

import React, { useState } from 'react'

const ListSales = () => {
  const [color, setColor] = useState('');

  function changeColor() {
    setColor('bg-blue-500 px-4 py-2 rounded-md text-white font-[500]')
  }

  return (
    <div>
      <button onClick={changeColor} className={color ? color : `bg-red-500 px-4 py-2 rounded-md text-white font-[500]`}>Click</button>
      <table>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
        <tr>
          <td>Product 1</td>
          <td>10$</td>
        </tr>
      </table>
    </div>
  )
}

export default ListSales