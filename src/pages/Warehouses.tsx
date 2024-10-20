import { Table, Skeleton } from 'antd';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// Function to fetch categories from the API
const fetchWarehouse = async () => {
  const response = await axios.get(`${import.meta.env.VITE_URL}/warehouses`);
  return response.data.data; 
};



const Warehouses: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['warehouses'],
    queryFn: fetchWarehouse,
  });

  console.log(data);
  
  // // State for managing modal visibility and form fields
  // const [isModalVisible, setIsModalVisible] = useState(false);
  // const [isEditMode, setIsEditMode] = useState(false); // To determine if we are editing
  // const [selectedCategory, setSelectedCategory] = useState<any>(null); // Store the selected category
  // const [name, setName] = useState('');
  // const [slug, setSlug] = useState('');
  // const [status, setStatus] = useState(1); // Default to 'Active'
  // const [image, setImage] = useState('');

  // // Show modal when button is clicked
  // const showModal = (category?: any) => {
  //   setIsModalVisible(true);
  //   if (category) {
  //     setIsEditMode(true);
  //     setSelectedCategory(category); // Set the selected category for editing
  //     setName(category.name);
  //     setSlug(category.slug);
  //     setStatus(category.status);
  //     setImage(category.image); // If you have an image field
  //   } else {
  //     setIsEditMode(false); // Reset for adding new category
  //     setName('');
  //     setSlug('');
  //     setStatus(1);
  //     setImage('');
  //   }
  // };

  // // Hide modal and reset form fields
  // const handleCancel = () => {
  //   setIsModalVisible(false);
  //   setName(''); // Reset fields
  //   setSlug('');
  //   setStatus(1);
  //   setImage('');
  //   setSelectedCategory(null);
  //   setIsEditMode(false); // Reset edit mode
  // };


  // // Handle form submission for adding and editing categories
  // const handleSubmit = async () => {
  //   const categoryData = { name, slug, status, image };

  //   if (isEditMode && selectedCategory) {
  //     // If in edit mode, update the existing category
  //     await axios.put(`${import.meta.env.VITE_URL}/categories/${selectedCategory.id}`, categoryData);
  //   } else {
  //     // Otherwise, create a new category
  //     await axios.post(`${import.meta.env.VITE_URL}/categories`, categoryData);
  //   }

  //   queryClient.invalidateQueries({
  //     queryKey: ['categories']
  //   }); // Refetch categories
  //   handleCancel(); // Close the modal after submitting
  // };

  // // Function to delete a category
  // const deleteCategory = async (id: number) => {
  //   await axios.delete(`${import.meta.env.VITE_URL}/categories/${id}`);
  //   queryClient.invalidateQueries({
  //     queryKey: ['categories']
  //   }); // Refetch categories after deletion
  // };

  // Define the columns for the AntD Table
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Manager',
      dataIndex: 'manager',
      key: 'manager',
    },
    {
      title: 'Contact Number',
      dataIndex: 'contact_number',
      key: 'contact_number',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (_: any, record: any) => (
        <div>
          {record.status ? <span className='bg-green-500 text-white px-3 py-2 rounded-md'>Active</span> : <span className='bg-red-500 text-white  px-3 py-2 rounded-md'>Inactive</span>}
        </div>
      )
      
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
    },
    
  ];

  // Safely access the 'data' field inside the response object
  const formattedData = data?.map((item: any) => ({
    key: item.id, // 'key' is required for AntD tables
    id: item.id,
    name: item.name,
    location: item.location,
    contact_number: item.contact_number,
    status: item.status,
    notes: item.notes,
    manager: item.manager,
    created_at: item.created_at,
    updated_at: item.updated_at,
  }));

  if (isLoading) return (
    <div className='p-8 border border-gray-300 rounded-lg bg-white'>
      <h1 className='font-[500] text-lg mb-4'>Categories List</h1>
      <Skeleton active />
    </div>
  );
  if (error) return <p>Error: {(error as Error).message}</p>;

  return (
    <div className='p-8 border border-gray-300 rounded-lg bg-white'>
      <h1 className='font-[500] text-lg mb-4 float-start'>Warehouses List</h1>
      <Table columns={columns} dataSource={formattedData} className='border rounded-t-lg' /> 
    </div>
  );
};

export default Warehouses;
