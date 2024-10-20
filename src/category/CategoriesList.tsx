import {
   Table,
   Modal,
   Input,
   Button,
   Select,
   Popconfirm,
   Skeleton,
} from "antd";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import moment from "moment"; // For formatting dates

interface Data {
   name: string;
   status: number;
}

const fetchCategories = async () => {
   const response = await axios.get(`${import.meta.env.VITE_URL}/categories`);
   return response.data; // Assuming response.data is { status, data } object
};

const CategoriesList: React.FC = () => {
   const queryClient = useQueryClient();
   const {
      data: responseData,
      isLoading,
      error,
   } = useQuery({
      queryKey: ["categories"],
      queryFn: fetchCategories,
   });

   const [isModalVisible, setIsModalVisible] = useState(false);
   const [isEditMode, setIsEditMode] = useState(false);
   const [selectedCategory, setSelectedCategory] = useState<any>(null);
   const [name, setName] = useState("");
   const [status, setStatus] = useState(1); // Default to 'Active'

   const showModal = (category?: any) => {
      setIsModalVisible(true);
      if (category) {
         setIsEditMode(true);
         setSelectedCategory(category);
         setName(category.name);
         setStatus(category.status);
      } else {
         setIsEditMode(false);
         setName("");
         setStatus(1);
      }
   };

   const handleCancel = () => {
      setIsModalVisible(false);
      setName("");
      setStatus(1);
      setSelectedCategory(null);
      setIsEditMode(false);
   };

   const updateCategory = async (id: number, updateData: Data) => {
      const { data } = await axios.put(
         `${import.meta.env.VITE_URL}/categories/${id}`,
         updateData
      );
      return data;
   };

   const addCategory = async (addData: Data) => {
      const { data } = await axios.post(
         `${import.meta.env.VITE_URL}/categories`,
         addData
      );
      return data;
   };

   const updateMutation = useMutation<void, Error, { id: number; data: Data }>({
      mutationFn: ({ id, data }) => updateCategory(id, data),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["categories"] });
      },
      onError: (error) => {
         console.error("Error updating category:", error);
      },
   });

   const addMutation = useMutation<void, Error, Data>({
      mutationFn: (data) => addCategory(data),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["categories"] });
      },
      onError: (error) => {
         console.error("Error adding category", error);
      },
   });

   const handleSubmit = async () => {
      const categoryData: Data = { name, status };

      if (isEditMode && selectedCategory) {
         updateMutation.mutate({ id: selectedCategory.id, data: categoryData });
      } else {
         addMutation.mutate(categoryData);
      }

      handleCancel(); // Close the modal after submitting
   };

   const deleteCategory = async (id: number) => {
      await axios.delete(`${import.meta.env.VITE_URL}/categories/${id}`);
      queryClient.invalidateQueries({
         queryKey: ["categories"],
      });
   };

   const columns = [
      {
         title: "ID",
         dataIndex: "id",
         key: "id",
      },
      {
         title: "Name",
         dataIndex: "name",
         key: "name",
      },
      {
         title: "Status",
         dataIndex: "status",
         key: "status",
         width: 150,
         render: (status: number) =>
            status === 1 ? (
               <div className="text-white bg-green-500 p-2 rounded-md inline font-[500]">
                  Active
               </div>
            ) : (
               <div className="text-white bg-red-500 p-2 rounded-md inline font-[500]">
                  Inactive
               </div>
            ),
      },
      {
         title: "Created At",
         dataIndex: "created_at",
         key: "created_at",
         render: (date: string) => moment(date).format("YYYY-MM-DD HH:mm"),
      },
      {
         title: "Updated At",
         dataIndex: "updated_at",
         key: "updated_at",
         render: (date: string) => moment(date).format("YYYY-MM-DD HH:mm"),
      },
      {
         title: "Action",
         key: "action",
         render: (_: any, record: { id: number }) => (
            <>
               <button
                  className="border border-blue-500 text-blue-500 px-2 py-1 rounded-md"
                  onClick={() => showModal(record)}
               >
                  Edit
               </button>
               <Popconfirm
                  title="Are you sure to delete this category?"
                  onConfirm={() => deleteCategory(record.id)}
                  okText="Yes"
                  cancelText="No"
               >
                  <button className="border border-red-500 text-red-500 px-2 py-1 rounded-md ml-1">
                     Delete
                  </button>
               </Popconfirm>
            </>
         ),
      },
   ];

   const formattedData = responseData?.data?.map((item: any) => ({
      key: item.id,
      id: item.id,
      name: item.name,
      status: item.status,
      created_at: item.created_at,
      updated_at: item.updated_at,
   }));

   if (isLoading)
      return (
         <div className="p-8 border border-gray-300 rounded-lg bg-white">
            <h1 className="font-[500] text-lg mb-4">Categories List</h1>
            <Skeleton active />
         </div>
      );
   if (error) return <p>Error: {(error as Error).message}</p>;

   return (
      <div className="p-8 border border-gray-300 rounded-lg bg-white">
         <h1 className="font-[500] text-lg mb-4 float-start">Categories List</h1>
         <Button
            className="text-white bg-blue-600 px-3 py-5 rounded-md font-[500] mb-2 float-end"
            onClick={() => showModal()}
         >
            Add New Category
         </Button>
         <Table
            columns={columns}
            dataSource={formattedData}
            className="border rounded-t-lg"
         />

         <Modal
            title={isEditMode ? "Edit Category" : "Add New Category"}
            visible={isModalVisible}
            onCancel={handleCancel}
            footer={null}
         >
            <label htmlFor="name">Name *</label>
            <Input
               id="name"
               value={name}
               onChange={(e) => setName(e.target.value)} // Automatically update name when input changes
            />

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

            <Button
               className="p-2 mt-4 rounded-md bg-blue-600 text-white"
               onClick={handleSubmit}
               loading={isEditMode ? updateMutation.isPending : addMutation.isPending}
            >
               {isEditMode ? "Update" : "Add"}
            </Button>
            <Button
               className="p-2 rounded-md bg-red-600 text-white ml-2"
               onClick={handleCancel}
            >
               Cancel
            </Button>
         </Modal>
      </div>
   );
};

export default CategoriesList;
