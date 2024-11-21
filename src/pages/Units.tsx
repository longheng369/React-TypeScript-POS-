import { Table, Modal, Input, Button, Select, Popconfirm, Skeleton } from 'antd';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const fetchUnits = async () => {
  const response = await axios.get(`${import.meta.env.VITE_URL}/units`);
  return response.data;
};

const Units: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: responseData, isLoading, error } = useQuery({
    queryKey: ['units'],
    queryFn: fetchUnits,
  });

  // State for managing modal visibility and form fields
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // To determine if we are editing
  const [selectedCategory, setSelectedCategory] = useState<any>(null); // Store the selected category
  const [name, setName] = useState('');
  const [status, setStatus] = useState<number>(1);
  const [base_unit, setBaseUnit] = useState<number>(0);
  const [nameError, setNameError] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // For form loading state

  // Show modal when button is clicked
  const showModal = (unit?: any) => {
    setIsModalVisible(true);
    if (unit) {
      setIsEditMode(true);
      setSelectedCategory(unit); // Set the selected category for editing
      setName(unit.name);
      setStatus(unit.status);
      setBaseUnit(unit.base_unit)
    } else {
      setIsEditMode(false); // Reset for adding new category
      setName('');
      setStatus(1);
      setBaseUnit(0);
    }
  };

  // Hide modal and reset form fields
  const handleCancel = () => {
    setIsModalVisible(false);
    setStatus(1);
    setSelectedCategory(null);
    setIsEditMode(false); // Reset edit mode
  };

  // Handle the name input change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputName = e.target.value;
    setName(inputName);
  };


  // Handle form submission for adding and editing categories
  const handleSubmit = async () => {
    const unitData = { name, status, base_unit };

    if (!name) {
      setNameError(true);
      return;
    }

    // console.log(unitData)

    setIsSubmitting(true); // Set loading state when submitting

    try {
      if (isEditMode && selectedCategory) {
        // If in edit mode, update the existing unit
        await axios.put(`${import.meta.env.VITE_URL}/units/${selectedCategory.id}`, unitData);
      } else {
        // Otherwise, create a new unit
        await axios.post(`${import.meta.env.VITE_URL}/units`, unitData);
      }

      // Invalidate query to refetch data
      queryClient.invalidateQueries({
        queryKey: ['units'],
      });

      // Close the modal and reset form after successful submission
      handleCancel();
    } catch (error) {
      console.error('Error submitting unit:', error);
    } finally {
      setIsSubmitting(false); // Reset loading state after submission
    }
  };

  const deleteUnit = async (id: number) => {
    await axios.delete(`${import.meta.env.VITE_URL}/units/${id}`);
    queryClient.invalidateQueries({
      queryKey: ['units'],
    });
  };

  // Define the columns for the AntD Table
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 500,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 500,
      render: (status: number) =>
        status === 1 ? (
          <div className="text-white bg-green-500 p-2 rounded-md inline font-[500]">Active</div>
        ) : (
          <div className="text-white bg-red-500 p-2 rounded-md inline font-[500]">Inactive</div>
        ),
    },
    {
      title: 'Base Unit',
      dataIndex: 'base_unit',
      key: 'base_unit',
      width: 300,
      render: (status: number) =>
        status === 1 ? (
          <div className="text-white bg-green-500 p-2 rounded-md inline font-[500]">Yes</div>
        ) : (
          ""
        ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 250,
      render: (_: any, record: { id: number }) => (
        <>
          <button
            className="border border-blue-600 text-white bg-blue-500 px-3 py-1 rounded-md"
            onClick={() => showModal(record)}
          >
            Edit
          </button>
          <Popconfirm
            title="Are you sure to delete this unit?"
            onConfirm={() => deleteUnit(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <button className="border border-red-600 text-white bg-red-500 px-2 py-1 rounded-md ml-1">
              Delete
            </button>
          </Popconfirm>
        </>
      ),
    },
  ];

  // Safely access the 'data' field inside the response object
  const formattedData = responseData?.data?.map((item: any) => ({
    key: item.id, // 'key' is required for AntD tables
    id: item.id,
    name: item.name,
    status: item.status,
    base_unit: item.base_unit
  }));

  // console.log(formattedData);
  
  if (error) return <p>Error: {(error as Error).message}</p>;

  return (
    <div className="p-8 border border-gray-300 rounded-lg bg-white">
      <h1 className="font-[500] text-lg mb-4 float-start">Units List</h1>
      <Button
        className="text-white bg-blue-600 px-3 py-5 rounded-md font-[500] mb-2 float-end"
        onClick={() => showModal()}
      >
        Add New Units
      </Button>
      <Table
        loading={isLoading}
        columns={columns}
        dataSource={formattedData}
        pagination={{
          pageSize: 10,
        }}
        className="border rounded-t-lg"
      />

      {/* Modal for adding/editing category */}
      <Modal
        title={isEditMode ? 'Edit Unit' : 'Add New Unit'}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <label htmlFor="name">Name *</label>
        <Input
          id="name"
          value={name}
          onChange={handleNameChange}
          className={nameError ? 'border-red-500 shadow-[1px_1px_5px] shadow-red-300' : ''}
        />
        {nameError && !name && <div className="text-red-500">Name field is required</div>}

        <div className="flex flex-col">
          <label htmlFor="status">Status</label>
          <Select
            value={status}
            onChange={(value) => setStatus(value)}
            className="inline-block"
          >
            <Select.Option value={1}>Active</Select.Option>
            <Select.Option value={0}>Inactive</Select.Option>
          </Select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="status">Base Unit</label>
          <Select
            value={base_unit}
            onChange={(value) => setBaseUnit(value)}
            className="inline-block"
          >
            <Select.Option value={1}>Yes</Select.Option>
            <Select.Option value={0}>No</Select.Option>
          </Select>
        </div>

        <Button
          className="p-2 mt-4 rounded-md bg-blue-600 text-white"
          onClick={handleSubmit}
          disabled={isSubmitting}
          loading={isSubmitting}
        >
          {isEditMode ? 'Update' : 'Add'}
        </Button>
        <Button className="p-2 rounded-md bg-red-600 text-white ml-2" onClick={handleCancel}>
          Cancel
        </Button>
      </Modal>
    </div>
  );
};

export default Units;
