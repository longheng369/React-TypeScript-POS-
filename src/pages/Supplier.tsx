import {
  Table,
  Skeleton,
  Button,
  Popconfirm,
  Modal,
  Form,
  Input,
  Select,
} from "antd";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// Function to fetch suppliers from the API
const fetchSuppliers = async () => {
  const response = await axios.get(`${import.meta.env.VITE_URL}/suppliers`);
  return response.data.data;
};

const Supplier: React.FC = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
     queryKey: ["suppliers"],
     queryFn: fetchSuppliers,
  });

  // Modal visibility and form states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  const [status, setStatus] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form] = Form.useForm(); // AntD form instance

  // Function to show the modal for adding/editing a supplier
  const showModal = (record?: any) => {
     if (record) {
        setIsEditMode(true); // Edit mode
        setCurrentRecord(record);
        form.setFieldsValue(record); // Populate form with current record data
     } else {
        setIsEditMode(false); // Add mode
        form.resetFields(); // Reset form fields for adding a new supplier
     }
     setIsModalVisible(true); // Show modal
  };

  const handleCancel = () => {
     setIsModalVisible(false);
     form.resetFields();
  };

  const handleOk = () => {
     form
        .validateFields()
        .then((values) => {
           setIsSubmitting(true);
           if (isEditMode) {
              editSupplier(values);
           } else {
              addSupplier(values);
           }
        })
        .catch((errorInfo) => {
           console.log("Validation Failed:", errorInfo);
        });
  };

  const addSupplier = async (values: any) => {
     try {
        await axios.post(`${import.meta.env.VITE_URL}/suppliers`, values);
        queryClient.invalidateQueries({ queryKey: ["suppliers"] });
        setIsModalVisible(false);
     } catch (error) {
        console.error("Error adding supplier:", error);
     } finally {
        setIsSubmitting(false);
     }
  };

  const editSupplier = async (values: any) => {
     try {
        await axios.put(`${import.meta.env.VITE_URL}/suppliers/${currentRecord.id}`, values);
        queryClient.invalidateQueries({ queryKey: ["suppliers"] });
        setIsModalVisible(false);
     } catch (error) {
        console.error("Error editing supplier:", error);
     } finally {
        setIsSubmitting(false);
     }
  };

  const deleteSupplier = async (id: number) => {
     try {
        await axios.delete(`${import.meta.env.VITE_URL}/suppliers/${id}`);
        queryClient.invalidateQueries({ queryKey: ["suppliers"] });
     } catch (error) {
        console.error("Error deleting supplier:", error);
     }
  };

  // Define the columns for the AntD Table
  const columns = [
     {
        title: "Supplier Name",
        dataIndex: "name",
        key: "name",
     },
     {
        title: "Company Name",
        dataIndex: "company_name",
        key: "company_name",
        render: (text: string) => (text ? text : ""),
     },
     {
        title: "Contact Person",
        dataIndex: "contact_person",
        key: "contact_person",
        render: (text: string) => (text ? text : "N/A"),
     },
     {
        title: "Phone Number",
        dataIndex: "phone_number",
        key: "phone_number",
     },
     {
        title: "Email",
        dataIndex: "email",
        key: "email",
        render: (text: string) => (text ? text : "N/A"),
     },
     {
        title: "Address",
        dataIndex: "address",
        key: "address",
        render: (text: string) => (text ? text : "N/A"),
     },
     {
        title: "Status",
        dataIndex: "status",
        key: "status",
        width: 120,
        render: (status: number) => (
           <div>
              {status ? (
                 <span className="bg-green-500 text-white px-3 py-2 rounded-md">
                    Active
                 </span>
              ) : (
                 <span className="bg-red-500 text-white px-3 py-2 rounded-md">
                    Inactive
                 </span>
              )}
           </div>
        ),
     },
     {
        title: "Action",
        key: "action",
        width: 150,
        render: (_: any, record: any) => (
           <div className="flex space-x-2">
              <Button
                 className="border-blue-500 text-blue-500"
                 onClick={() => showModal(record)}
              >
                 Edit
              </Button>
              <Popconfirm
                 title="Are you sure you want to delete this supplier?"
                 onConfirm={() => deleteSupplier(record.id)}
                 okText="Yes"
                 cancelText="No"
              >
                 <Button danger>Delete</Button>
              </Popconfirm>
           </div>
        ),
     },
  ];

  const formattedData = data?.map((item: any) => ({
     key: item.id,
     id: item.id,
     name: item.name,
     company_name: item.company_name,
     contact_person: item.contact_person,
     phone_number: item.phone_number,
     email: item.email,
     address: item.address,
     status: item.status,
  }));

  if (isLoading)
     return (
        <div className="p-8 border border-gray-300 rounded-lg bg-white">
           <h1 className="font-[500] text-lg mb-4">Suppliers List</h1>
           <Skeleton active />
        </div>
     );

  if (error) return <p>Error: {(error as Error).message}</p>;

  return (
     <div className="p-8 border border-gray-300 rounded-lg bg-white">
        <div className="flex justify-between items-center mb-4">
           <h1 className="font-[500] text-lg">Suppliers List</h1>
           {/* Add Button */}
           <Button type="primary" onClick={() => showModal()}>
              Add Supplier
           </Button>
        </div>
        {/* Suppliers Table */}
        <Table
           columns={columns}
           dataSource={formattedData}
           className="border rounded-t-lg"
        />

        {/* Modal for Add/Edit Supplier */}
        <Modal
           title={isEditMode ? "Edit Supplier" : "Add Supplier"}
           visible={isModalVisible}
           onCancel={handleCancel}
           footer={[
              <Button key="cancel" onClick={handleCancel}>
                 Cancel
              </Button>,
              <Button
                 key="submit"
                 type="primary"
                 onClick={handleOk}
                 disabled={isSubmitting}
                 loading={isSubmitting}
              >
                 {isEditMode ? "Update" : "Add"}
              </Button>,
           ]}
        >
           <Form form={form} layout="vertical">
              <Form.Item
                 name="name"
                 label="Supplier Name"
                 rules={[{ required: true, message: "Please enter the supplier name" }]}
                 className="mb-1"
              >
                 <Input />
              </Form.Item>
              <Form.Item
                 name="company_name"
                 label="Company Name"
                 className="mb-1"
              >
                 <Input />
              </Form.Item>
              <Form.Item
                 name="contact_person"
                 label="Contact Person"
                 className="mb-1"
              >
                 <Input />
              </Form.Item>
              <Form.Item
                 name="phone_number"
                 label="Phone Number"
                 rules={[{ required: true, message: "Phone number field is required" }]}
                 className="mb-1"
              >
                 <Input />
              </Form.Item>
              <Form.Item name="email" label="Email" className="mb-1">
                 <Input />
              </Form.Item>
              <Form.Item name="address" label="Address" className="mb-1">
                 <Input />
              </Form.Item>
              <Form.Item name="status" label="Status" initialValue={status}>
                 <Select
                    value={status}
                    onChange={(value) => setStatus(value)}
                    className="inline-block"
                 >
                    <Select.Option value={1}>Active</Select.Option>
                    <Select.Option value={0}>Inactive</Select.Option>
                 </Select>
              </Form.Item>
           </Form>
        </Modal>
     </div>
  );
};

export default Supplier;
