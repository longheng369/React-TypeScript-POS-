// Dashboard.tsx
import React, { useState } from 'react';
import { FaMoneyBillWave } from "react-icons/fa";
import Card from '../components/DashboardCard';
import MultiLineChart from '../components/MultiLineChart';
import { Dropdown, MenuProps } from 'antd';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';


type Unit = {id: number, name: string};
const units : Unit[] = [
  {
    id: 1,
    name: "pcs"
  },
  {
    id: 2,
    name: "case"
  }
];


const fetchDashboardData = async () => {
  const {data} = await axios.get(`${import.meta.env.VITE_URL}/dashboard_data`);
  return data;
}
const Dashboard: React.FC = () => {
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const {data, isLoading, error} = useQuery({
    queryKey: ['dashboard_data'],
    queryFn: fetchDashboardData
  });
  // Create the menu items using the items prop
  const menuItems: MenuProps['items'] = units.map((unit) => ({
    key: unit.id,
    label: (
      <a onClick={() => handleUnitSelect(unit)}>
        {unit.name}
      </a>
    ),
  }));

  // Handle unit selection
  const handleUnitSelect = (unit: Unit) => {
    setSelectedUnit(unit);
    console.log(unit.id)
  };


  return (
    <div className='grid grid-cols-2 gap-3'>
      <div className='grid grid-cols-2 gap-3'>
        <Card
          title="Total Sales"
          amount="$189,323"
          increase="Increase 3.69%"
          iconColor="bg-green-500"
          iconColr_right='text-green-500'
          icon={<FaMoneyBillWave />}
          delay={0.1}
        />
        <Card
          title="Total Purchases"
          amount={`$${(data?.purchase_payments * 1).toLocaleString('en-US')}`}
          increase="Increase 3.69%"
          iconColor="bg-teal-500"
          iconColr_right='text-teal-500'
          icon={<FaMoneyBillWave />}
          delay={0.2}
        />
        <Card
          title="Total Customers"
          amount="$189,323"
          increase="Increase 3.69%"
          iconColor="bg-purple-500"
          iconColr_right='text-purple-500'
          icon={<FaMoneyBillWave />}
          delay={0.3}
        />
        <Card
          title="Total Transactions"
          amount="$189,323"
          increase="Increase 3.69%"
          iconColor="bg-pink-500"
          iconColr_right='text-pink-500'
          icon={<FaMoneyBillWave />}
          delay={0.4}
        />
      </div>
      <MultiLineChart name='Best Seller'/>

      <Dropdown
      menu={{ items: menuItems }}
      trigger={['click']}
    >
      <a onClick={(e) => e.preventDefault()}>
        {selectedUnit ? selectedUnit.name : 'Select Unit'} <span>▼</span>
      </a>
    </Dropdown>

    <input type="file" />

    </div>
  );
};

export default Dashboard;
