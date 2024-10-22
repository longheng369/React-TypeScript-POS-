import React, { useState, ChangeEvent } from 'react';
import { Table, Input, Button, Space, Dropdown, Menu, Modal, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { Link } from 'react-router-dom';
import { AiOutlineProduct } from "react-icons/ai";
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';


const ProductList: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [dropdownVisible, setDropdownVisible] = useState(false); // Manage dropdown visibility

  const fetchProducts = async () => {
    const response = await axios.get(`${import.meta.env.VITE_URL}/products`);
    return response.data;
  };

  const { data, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const formattedData = data?.data.map((item: any) => ({
    id: item.id,
    image: item.image,
    code: item.code,
    name: item.name,
    category: item.category.name,
    unit: item.unit.name,
    costing_price: item.costing_price,
    selling_price: item.selling_price,
    stock: item.stock,
    status: item.status,
    alert_quantity: item.alert_quantity,
  }));

  console.log(formattedData)
  const handleSelectChange = (selectedKeys: React.Key[]) => {
    setSelectedRowKeys(selectedKeys);
  };

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const handleDelete = (id: number) => {
    console.log("delete product which has id", id)
  };

  const handleRowClick = (record: any) => {
    setSelectedRecord(record);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: 70,
      render: (text: string,record: any) => (
        record.image ? <img src={`http://localhost:8000/storage/images/${record.image}`} alt="Product" style={{ width: 40, height: 40 }} /> : <img src="https://via.placeholder.com/40" alt="Product" style={{ width: 40, height: 40 }} />
      ),
    },
    { title: 'Code', dataIndex: 'code', key: 'code' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: "Category", dataIndex: "category", key: "category" },
    { title: "Unit", dataIndex: "unit", key: "unit" },
    { title: 'Costing Price', dataIndex: 'costing_price', key: 'costing_price' },
    { title: 'Selling Price', dataIndex: 'selling_price', key: 'selling_price' },
    { title: 'Stock', dataIndex: 'stock', key: 'stock' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (_: any, record: any) => (
        <div>
          {record.status ? <span className='bg-green-500 text-white px-3 py-2 rounded-md'>Available</span> : <span className='bg-red-500 text-white px-3 py-2 rounded-md'>Out Stock</span>}
        </div>
      )
    },
    { title: 'Alert Quantity', dataIndex: 'alert_quantity', key: 'alert_quantity' },
  ];



  const menu = (
    <Menu>
      <Menu.Item key="1">
        <Button
          type="text"
          icon={<DeleteOutlined />}
          disabled={selectedRowKeys.length === 0}
        >
          Delete Selected
        </Button>
      </Menu.Item>
      <Menu.Item key="2">
        <Link to="/products/add" className='flex items-center gap-2 justify-center'>
          <AiOutlineProduct className='text-lg' /> Add Product
        </Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <div>
      <Space style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Input
          placeholder="Search..."
          value={searchText}
          onChange={handleSearch}
          style={{ width: 200 }}
        />
        <Dropdown overlay={menu} trigger={['click']}>
          <Button>
            Actions <MdOutlineKeyboardArrowDown className='text-xl' />
          </Button>
        </Dropdown>
      </Space>
      <Table
      
        columns={columns}
        dataSource={formattedData}
        rowSelection={{
          selectedRowKeys,
          onChange: handleSelectChange,
          columnWidth: 60
        }}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50', '100'],
        }}
        className='border rounded-t-[0.55rem] custom-border-product-table'
      />
      {/* Modal to show row details */}
      <Modal
        title="Product Details"
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        {selectedRecord && (
          <div>
            <p><strong>Code:</strong> {selectedRecord.code}</p>
            <p><strong>Name:</strong> {selectedRecord.name}</p>
            <p><strong>Category:</strong> {selectedRecord.category}</p>
            <p><strong>Costing Price:</strong> {selectedRecord.costing_price}</p>
            <p><strong>Selling Price:</strong> {selectedRecord.selling_price}</p>
            <p><strong>Quantity:</strong> {selectedRecord.quantity}</p>
            <p><strong>Stock Status:</strong> {selectedRecord.stock_status ? 'In Stock' : 'Out of Stock'}</p>
            <p><strong>Alert Quantity:</strong> {selectedRecord.alert_qty}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProductList;
