import React, { useState } from 'react';
import { AutoComplete, Input, Table, Button, InputNumber } from 'antd';
import CategoryBtn from './CategoryBtn';
import apple from '../assets/apple.png';
import banana400x400 from '../assets/banana-400x400.png';
import pineapple from '../assets/pineapple.png';
import grape from '../assets/grape.png';
import papaya from '../assets/papaya.png';
import Card from './Card';

interface DataInterface {
  id: number;
  product_name: string;
  image_url: string;
  category_id: number;
  unit_price: number; // Added unit price for each product
}

interface CustomerInterface {
  id: number;
  customer_name: string;
}

const customers: CustomerInterface[] = [
  { id: 1, customer_name: 'Walk in' },
  { id: 2, customer_name: 'Long Heng' }
];

const data: DataInterface[] = [
  { id: 1, product_name: 'Banana', image_url: banana400x400, category_id: 1, unit_price: 1.0 },
  { id: 2, product_name: 'Apple', image_url: apple, category_id: 1, unit_price: 1.5 },
  { id: 3, product_name: 'Pineapple', image_url: pineapple, category_id: 1, unit_price: 2.0 },
  { id: 4, product_name: 'Grape', image_url: grape, category_id: 1, unit_price: 2.5 },
  { id: 5, product_name: 'Papaya', image_url: papaya, category_id: 1, unit_price: 3.0 },
];

const POS: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [productOptions, setProductOptions] = useState<{ value: string }[]>(data.map((data) => ({value : data.product_name})));
  const [filteredData, setFilteredData] = useState<DataInterface[]>(data);
  const [customerOptions, setCustomerOptions] = useState<{ value: string }[]>(customers.map((customer) => ({ value: customer.customer_name })));
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerInterface | null>(null);
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  const categories = [
    { label: 'Best Selling', key: 1 },
    { label: 'All', key: 2 },
    { label: 'Dessert', key: 3 },
    { label: 'Snacks', key: 4 },
    { label: 'Specials', key: 5 },
    { label: 'Fruits', key: 6, id: 1 },
  ];

  const columns = [
    { title: 'Product Name', dataIndex: 'product_name', key: 'product_name' },
    { title: 'Unit Price', dataIndex: 'unit_price', key: 'unit_price', render: (text: number) => `$${text.toFixed(2)}` },
    {
      title: 'Quantity',
      key: 'quantity',
      render: (_: any, record: DataInterface) => (
        <div className="flex items-center">
          <Button
            size="small"
            onClick={() => handleQuantityChange(record.id, -1)}
            disabled={(quantities[record.id] || 0) <= 0}
          >
            -
          </Button>
          <InputNumber
            min={0}
            value={quantities[record.id] || 0}
            style={{ width: 80, margin: '0 8px' }}
            onChange={(value : any) => handleQuantityChange(record.id, value)}
          />
          <Button
            size="small"
            onClick={() => handleQuantityChange(record.id, 1)}
          >
            +
          </Button>
        </div>
      )
    },
    { title: 'Discount', key: 'discount', render: () => '0%' },
    {
      title: 'Total',
      key: 'total',
      render: (_: any, record: DataInterface) => `$${((quantities[record.id] || 0) * record.unit_price).toFixed(2)}`
    }
  ];

  const handleCategoryClick = (categoryLabel: string) => {
    setActiveCategory(categoryLabel);
  };

  const handleProductSearch = (value: string) => {
    const filteredProductOptions = data
      .filter(product => product.product_name.toLowerCase().startsWith(value.toLowerCase())) 
      .map(product => ({ value: product.product_name }));
  
    setProductOptions(filteredProductOptions);
  
    const filteredProducts = data
      .filter(product => product.product_name.toLowerCase().startsWith(value.toLowerCase())); 
  
    setFilteredData(filteredProducts);
  };
  

  const handleProductSelect = (value: string) => {
    const filteredProducts = data
      .filter(product => product.product_name.toLowerCase() === value.toLowerCase());

    setFilteredData(filteredProducts);
  };

  const handleCustomerSearch = (value: string) => {
    const filteredCustomerOptions = customers
      .filter(customer => customer.customer_name.toLowerCase().includes(value.toLowerCase()))
      .map(customer => ({ value: customer.customer_name }));
    setCustomerOptions(filteredCustomerOptions);
  };

  const handleCustomerSelect = (value: string) => {
    const selectedCustomer = customers
      .find(customer => customer.customer_name.toLowerCase() === value.toLowerCase());

    setSelectedCustomer(selectedCustomer || null);
  };

  const handleQuantityChange = (productId: number, change: number | undefined) => {
    setQuantities(prevQuantities => {
      const currentQuantity = prevQuantities[productId] || 0;
      const newQuantity = Math.max(0, currentQuantity + (change ?? 0));
      return { ...prevQuantities, [productId]: newQuantity };
    });
  };

  return (
    <div className="grid grid-cols-[2fr_1.5fr] h-screen">
      <div className='p-4 pb-0 flex flex-col'>
        <div className='flex'>
          <button className='bg-blue-500 text-white px-2 rounded-l-md'>Select Customer</button>
          <AutoComplete
            options={customerOptions}
            onSearch={handleCustomerSearch}
            onSelect={handleCustomerSelect}
            className="h-full flex-1"
            placeholder="Select Customer"
          >
            <Input id="customer" className='text-[1rem] rounded-l-none' />
          </AutoComplete>
        </div>
        <div className="flex-1 overflow-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="id"
            className='border rounded-t-[0.3rem] mt-2'
            pagination={false}
            scroll={{ y: '66.6vh' }}
          />
        </div>
        <div className='w-full border '>
          <h1 className='text-xl font-bold p-3'>Total: $123.00</h1>
          <div className='grid grid-cols-2'>
            <button className='bg-red-500 text-white font-bold py-5 text-2xl'>Cancel</button>
            <button className='bg-green-600 text-white font-bold text-2xl'>Submit</button>
          </div>
        </div>
      </div>
      <div className="border-l border-gray-300 h-[100vh] p-4 flex flex-col">
        <div className="flex gap-2 overflow-x-auto whitespace-nowrap custom-scrollbar pb-1">
          {categories.map(category => (
            <CategoryBtn
              label={category.label}
              key={category.key}
              active={activeCategory === category.label}
              onClick={() => handleCategoryClick(category.label)}
            />
          ))}
        </div>
        <div className="flex gap-2 mt-2">
          <AutoComplete
            options={productOptions}
            onSearch={handleProductSearch}
            onSelect={handleProductSelect}
            className="w-full"
            placeholder="Searching Product"
          >
            <Input className='text-[1rem]' />
          </AutoComplete>
          <button className="bg-blue-500 text-white px-2 rounded-md">Search</button>
        </div>
        <div className='mt-3 overflow-y-auto flex-1 custom-scroll-product'>
          <div className='grid grid-cols-5 gap-2 mt-2'>
            {filteredData.map(product => (
              <Card
                key={product.id}
                product_name={product.product_name}
                image_url={product.image_url}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default POS;
