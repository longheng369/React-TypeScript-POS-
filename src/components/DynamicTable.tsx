import React, { useState } from 'react';
import { Table, Input, Modal, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

interface DataType {
  key: string;
  [key: string]: any;
}

interface ModalField {
  label: string;
  fieldName: string;
  type: string;
  required?: boolean;
}

interface DynamicTableProps {
  columns: Array<{
    title: string;
    dataIndex: string;
    key: string;
    filters?: any[];
    onFilter?: (value: React.Key | boolean, record: DataType) => boolean;
    sorter?: (a: DataType, b: DataType) => number;
  }>;
  dataSource: DataType[];
  btn_label: string;
  modalFields: ModalField[]; // Dynamic fields for the modal
  onSubmit: (formData: { [key: string]: any }) => void; // Pass form data on submit
}

const DynamicTable: React.FC<DynamicTableProps> = ({ columns, dataSource, btn_label, modalFields, onSubmit }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [filteredData, setFilteredData] = useState<DataType[]>(dataSource);
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // Modal visibility state
  const [formData, setFormData] = useState<{ [key: string]: any }>({}); // Store form data dynamically

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchText(value);

    const filtered = dataSource.filter((item) => {
      return Object.values(item).some((val) =>
        val.toString().toLowerCase().includes(value.toLowerCase())
      );
    });

    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  const showModal = () => {
    setIsModalVisible(true); // Show the modal when button is clicked
  };

  const handleOk = () => {
    // Trigger the onSubmit callback to pass the form data to the parent
    onSubmit(formData);

    setIsModalVisible(false); // Close the modal when 'OK' is clicked
    setFormData({}); // Reset form data
  };

  const handleCancel = () => {
    setIsModalVisible(false); // Close the modal when 'Cancel' is clicked
  };

  // Dynamically handle input change
  const handleInputChange = (field: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search..."
          value={searchText}
          onChange={handleSearch}
          prefix={<SearchOutlined />}
          style={{ marginBottom: 16, width: '300px' }}
        />
        <Button type="primary" onClick={showModal}>
          {btn_label}
        </Button>
      </div>

      {/* Modal */}
      <Modal
        title="Add New Item"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Submit"
        cancelText="Cancel"
      >
        <div className='flex flex-col gap-3'>
          {modalFields.map((field) => (
            <div key={field.fieldName} className='flex flex-col gap-2'>
              <label htmlFor={field.fieldName}>
                {field.label} {field.required && <span className='text-red-500'>*</span>}
              </label>
              <input
                id={field.fieldName}
                type={field.type}
                className='border outline-blue-500 py-2 px-4'
                value={formData[field.fieldName] || ''}
                onChange={(e) => handleInputChange(field.fieldName, e.target.value)} // Update form data dynamically
              />
            </div>
          ))}
        </div>
      </Modal>

      <Table
        className="border border-gray-300 rounded-sm"
        columns={columns}
        dataSource={filteredData}
        rowSelection={rowSelection}
        pagination={{
          className: 'px-4',
          current: currentPage,
          pageSize: pageSize,
          pageSizeOptions: ['10', '20', '50', '100'],
          showSizeChanger: true,
          onShowSizeChange: (_, size) => setPageSize(size),
          total: filteredData.length,
          onChange: (page) => setCurrentPage(page),
        }}
        rowKey="key"
      />
    </div>
  );
};

export default DynamicTable;
