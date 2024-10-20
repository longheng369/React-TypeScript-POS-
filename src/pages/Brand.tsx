import { Table, Modal, Input, Button, Select, Popconfirm, Skeleton } from 'antd';
import { ChangeEvent, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { AiOutlineUpload } from "react-icons/ai";
import TextArea from 'antd/es/input/TextArea';


const fetchBrands = async () => {
  const response = await axios.get(`${import.meta.env.VITE_URL}/brands`);
  return response.data.data;
};

const Brand: React.FC = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ['brands'],
    queryFn: fetchBrands,
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<any>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState<File | null>(null);
  const [website, setWebsite] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [status, setStatus] = useState(1);
  const [fileName, setFileName] = useState<string | undefined>('');
  const [nameError, setNameError] = useState<boolean>(false);
  const [logoUrl, setLogoUrl] = useState('');
  const [delete_logo, setDelete_Logo] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState<string>('');

  const showModal = (brand?: any) => {
    setIsModalVisible(true);
    setFileName('');
    if (brand) {
      setIsEditMode(true);
      setSelectedBrand(brand);
      setName(brand.name);
      setDescription(brand.description);
      setLogo(brand.logo); // Reset file input
      setWebsite(brand.website);
      setCountry(brand.country);
      setStatus(brand.status);
    } else {
      setIsEditMode(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setLogo(null);
    setWebsite('');
    setCountry('');
    setStatus(1);
    setSelectedBrand(null);
    setIsEditMode(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    resetForm();
  };

  const handleSubmit = async () => {
    if (!name) {
      setNameError(true);
      return;
    }


    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('website', website);
    formData.append('country', country);
    formData.append('status', status.toString());
    formData.append('delete_logo', delete_logo.toString());
    
    if(logoUrl) {if(logo){formData.append('logo', logo)}}

   
    try {
      if (isEditMode && selectedBrand) {
        formData.append('_method', 'PUT');
        console.log('Editing brand with ID:', selectedBrand.id); // Debugging line
        console.log('FormData contents:');
        for (const [key, value] of formData.entries()) {
          console.log(`${key}:`, value);
        }
        
        // Update existing brand
        await axios.post(
          `${import.meta.env.VITE_URL}/brands/${selectedBrand.id}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      } else {
        // Create new brand
        console.log('Adding new brand'); // Debugging line
        await axios.post(`${import.meta.env.VITE_URL}/brands`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      queryClient.invalidateQueries({ queryKey: ['brands'] });
      handleCancel();
    } catch (error) {
      console.error('Error submitting brand:', error);
    }
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Safely access the file
    if (file) {
      setFileName(file.name); // Set the file name
      const logoURL = URL.createObjectURL(file); // Create a URL for the file
      setLogoUrl(logoURL); // Set the preview URL
      setLogo(file); // Set the file to be uploaded
    }
  };

  const handleClearFile = () => {
    setFileName(''); // Clear the filename state
    setLogoUrl('');
    setLogo(null);
    setDelete_Logo(1)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Clear the file input value
    }
  };

  

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    {
      title: 'Logo',
      dataIndex: 'logo',
      key: 'logo',
      render: (logo: string) => (
        <div>
          {logo ? (
            <img className="w-16 mx-auto" src={`http://localhost:8000/storage/images/${logo}`} alt="" />
          ) : (
            <div>No Image</div>
          )}
        </div>
      ),
    },
    { title: 'Website', dataIndex: 'website', key: 'website',
      render: (website: string) => (
        <div>
          {website === 'null' ? "no" : <a target='blank' href={website}>{website}</a>}
        </div>
      )
     },
    { title: 'Country', dataIndex: 'country', key: 'country' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) =>
        status === 1 ? (
          <div className="text-white bg-green-500 p-2 rounded-md inline font-[500]">Active</div>
        ) : (
          <div className="text-white bg-red-500 p-2 rounded-md inline font-[500]">Inactive</div>
        ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: { id: number }) => (
        <>
          <button className="border border-blue-500 text-blue-500 px-2 py-1 rounded-md" onClick={() => showModal(record)}>
            Edit
          </button>
          <Popconfirm title="Are you sure to delete this brand?" onConfirm={() => deleteBrand(record.id)} okText="Yes" cancelText="No">
            <button className="border border-red-500 text-red-500 px-2 py-1 rounded-md ml-1">Delete</button>
          </Popconfirm>
        </>
      ),
    },
  ];

  // const formattedData = data?.map((item: any) => ({
  //   key: item.id,
  //   id: item.id,
  //   name: item.name,
  //   description: item.description,
  //   logo: item.logo,
  //   website: item.website,
  //   country: item.country,
  //   status: item.status,
  // }));

  const filteredData = data?.filter((item: any) =>
    item.name.toLowerCase().startsWith(search.toLowerCase())
    // item.description.toLowerCase().includes(search.toLowerCase()) ||
    // item.website.toLowerCase().includes(search.toLowerCase()) ||
    // item.country.toLowerCase().includes(search.toLowerCase())
  );

  const formattedData = filteredData?.map((item: any) => ({
    key: item.id,
    id: item.id,
    name: item.name,
    description: item.description,
    logo: item.logo,
    website: item.website,
    country: item.country,
    status: item.status,
  }));

  const deleteBrand = async (id: number) => {
    await axios.delete(`${import.meta.env.VITE_URL}/brands/${id}`);
    queryClient.invalidateQueries({ queryKey: ['brands'] });
  };

  if (isLoading) return <Skeleton active />;
  if (error) return <p>Error: {(error as Error).message}</p>;

  return (
    <div>
      <div className='flex justify-between mb-2'>
        <Input onChange={(e : ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)} placeholder='Searching Brand' className='w-4/12'/>
        <Button className=' bg-blue-600 text-white' onClick={() => showModal()}>Add New Brand</Button>
      </div>
      <Table columns={columns} dataSource={formattedData} className='border border-gray-300 rounded-t-[0.5rem]'/>
      <Modal title={isEditMode ? 'Edit Brand' : 'Add New Brand'} visible={isModalVisible} onCancel={handleCancel} footer={null} >
        <label htmlFor="name">Name *</label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        {nameError && !name && <div className="text-red-500">Name field is required</div>}

        <div className='mt-1'>
          <label htmlFor="description">Description</label>
          <TextArea id="description" value={description === 'null' ? '': description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div className='flex flex-col mt-1 mb-1'>
          <label htmlFor="logo">Logo</label>
          {isEditMode ? (
            fileName ? (
              <label className='border border-gray-300 rounded-md cursor-pointer p-[0.3rem] px-2' htmlFor="logo">
                {fileName ? 
                  // display the image after user selected image
                  <div className='flex flex-col gap-1'>
                    {fileName}
                    <img src={logoUrl} alt="" />
                  </div>
                  // end
                 : 
                  // if user not pick image yet
                  <div className='flex items-center gap-1'>
                    <AiOutlineUpload className='text-lg hover:text-blue-500' />
                    <span>Upload Image</span>
                  </div>
                  // end
                }
              </label>
            ) : (
              logo ? 
              // if have logo in row which selected to edit
              <div className='border border-gray-300 rounded-md'>
                <button onClick={handleClearFile} className='text-[2rem] float-end inline text-gray-400  transition-all hover:text-gray-500 rounded-md pb-2 px-2 leading-7 m-1 hover:bg-gray-100'>&times;</button>
                <label className='rounded-md' htmlFor="logo">
                  <img className='mx-auto' src={`${import.meta.env.VITE_IMAGE_URL}/storage/images/${logo}`} alt="" />
                </label>
              </div>
              // end
              : 
              // if no logo in row which selected to edit
              <label className='border border-gray-300 rounded-md cursor-pointer p-[0.3rem] px-2 hover:text-blue-500 hover:border-blue-500 ' htmlFor="logo">
                <div className='flex items-center gap-1'>
                  <AiOutlineUpload className='text-lg' />
                  <span>Upload Image</span>
                </div>
              </label>
              // end
            )
          ) : (
            <label className='border border-gray-300 rounded-md cursor-pointer p-[0.3rem] px-2' htmlFor="logo">
              {fileName ? (
                <div className='flex flex-col gap-1'>
                  {fileName}
                  <img src={logoUrl} alt="" />
                </div>
              ) : (
                <div className='flex items-center gap-1'>
                  <AiOutlineUpload className='text-lg' />
                  <span>Upload Image</span>
                </div>
              )}
            </label>
          )}
          <input ref={fileInputRef} hidden id="logo" type="file" onChange={handleFileChange} />
        </div>


        <label htmlFor="website">Website</label>
        <Input id="website" value={website} onChange={(e) => setWebsite(e.target.value)} className='mb-1'/>

        <label htmlFor="country">Country</label>
        <Input id="country" value={country === 'null' ? '' : country} onChange={(e) => setCountry(e.target.value)} className='mb-1'/>

        <label htmlFor="status">Status</label>
        <Select value={status} onChange={(value) => setStatus(value)} className="w-full mb-2">
          <Select.Option value={1}>Active</Select.Option>
          <Select.Option value={0}>Inactive</Select.Option>
        </Select>

        <Button className='mr-2 bg-blue-600 text-white'  onClick={handleSubmit}>{isEditMode ? 'Update' : 'Add'}</Button>
        <button className='p-1 px-3 rounded-md bg-red-500 text-white hover:bg-red-600' onClick={handleCancel}>Cancel</button>
      </Modal>
    </div>
  );
};

export default Brand;
