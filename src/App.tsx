import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppstoreOutlined } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme, Tooltip } from 'antd';
import AppRoutes from './AppRoutes';
import { LuUser2 } from "react-icons/lu";
import { MdProductionQuantityLimits } from "react-icons/md";
import { TfiDropbox } from "react-icons/tfi";
import { LiaClipboardListSolid } from "react-icons/lia";
import { AiOutlineProduct } from "react-icons/ai";
import { BiBarcodeReader } from "react-icons/bi";
import { PiShoppingCartLight } from "react-icons/pi";
import { IoPricetagsOutline, IoSettingsSharp } from "react-icons/io5";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
import { MdOutlineCategory } from "react-icons/md";
import { MdOutlineAddShoppingCart } from "react-icons/md";
import { MdFormatListBulletedAdd } from "react-icons/md";
import { PiWarehouse } from "react-icons/pi";
import { MdOutlineScale } from "react-icons/md";
import { LiaPeopleCarrySolid } from "react-icons/lia";
import { SiBrandfolder } from "react-icons/si";
const { Content, Footer, Sider } = Layout;

interface MenuItem {
  key: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
  label: React.ReactNode;
}

function getItem(label: React.ReactNode, key: string, icon?: React.ReactNode, children?: MenuItem[], link?: string): MenuItem {
  return {
    key,
    icon,
    children: children || undefined,
    label: link ? <Link to={link}>{label}</Link> : label,
  };
}

const items: MenuItem[] = [
  getItem('Dashboard', '/', <AppstoreOutlined style={{ fontSize: "16px" }} />, undefined, '/'),
  getItem('Product', '/products', <TfiDropbox style={{ fontSize: "18px" }} />, [
    getItem('List Products', '/products/list_product', <LiaClipboardListSolid style={{ fontSize: "18px" }} />, undefined, '/products/list_product'),
    getItem('Add Products', '/products/add', <AiOutlineProduct style={{ fontSize: "18px" }} />, undefined, '/products/add'),
    getItem('Create Barcode', '/products/create-barcode', <BiBarcodeReader style={{ fontSize: "18px" }} />, undefined, '/products/create-barcode'),
  ]),
  getItem('Purchase', '/purchase', <PiShoppingCartLight style={{ fontSize: "18px" }} />, [
    getItem("List Purchases", '/purchases/list_purchases', <LiaClipboardListSolid style={{ fontSize: "18px" }} />, undefined, '/purchases/list_purchases'),
    getItem("Add Purchases", '/purchases/add', <MdOutlineAddShoppingCart style={{ fontSize: "18px" }}/>, undefined, '/purchases/add'),
  ]),
  getItem('Sales', '/sales', <IoPricetagsOutline style={{ fontSize: "16px" }} />, [
    getItem('List Sales', '/sales/list_sales', <LiaClipboardListSolid style={{ fontSize: "18px" }} />, undefined, '/sales/list_sales'),
    getItem("Add Sales", "/sales/add_sale", <MdFormatListBulletedAdd style={{ fontSize: "18px" }}/>, undefined, "/sales/add_sale"),
  ]),
  getItem('Settings', '/settings', <IoSettingsSharp style={{ fontSize: "18px" }} />, [
    getItem('Brand', '/settings/brands', <SiBrandfolder style={{ fontSize: "16px" }} />, undefined, '/settings/brands'),
    getItem('Categories', '/settings/categories', <MdOutlineCategory style={{ fontSize: "18px" }} />, undefined, '/settings/categories'),
    getItem('System Adjustment', '/settings/system_adjustment', <HiOutlineAdjustmentsHorizontal style={{ fontSize: "18px" }} />, undefined, '/settings/system_adjustment'),
    getItem('Suppliers', '/settings/suppliers', <LiaPeopleCarrySolid style={{ fontSize: "18px" }} />, undefined, '/settings/suppliers'),
    getItem('Units', '/settings/units', <MdOutlineScale style={{ fontSize: "16px" }} />, undefined, '/settings/units'),
    getItem('Warehouses', '/settings/warehouses', <PiWarehouse style={{ fontSize: "18px" }} />, undefined, '/settings/warehouses'),
  ]),
];

const App: React.FC = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const { token: { colorBgContainer } } = theme.useToken();

  // Check if the current path is for POS or Auth pages
  const isPosPage = location.pathname === '/pos';
  const isAuthPage = location.pathname === '/login';

  const activeSubmenu = items.find(item =>
    item.children && item.children.some(subItem => subItem.key === location.pathname)
  );

  const defaultOpenKeys = activeSubmenu ? [activeSubmenu.key] : [];

  const pathnames = location.pathname.split('/').filter((x) => x);
  const breadcrumbItems = pathnames.map((name, index) => {
    const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
    return { title: <Link to={routeTo}>{name}</Link>, key: routeTo };
  });

  breadcrumbItems.unshift({ title: <Link to="/">Dashboard</Link>, key: '/' });

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Conditionally render the Sider only when NOT on the POS or Auth pages */}
      {!isPosPage && !isAuthPage && (
        <Sider width={250} collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} theme='light' className='border-r'>
          <Menu
            style={{ fontSize: '15px', borderRight: "none" }}
            theme="light"
            selectedKeys={[location.pathname]} 
            defaultOpenKeys={defaultOpenKeys}
            mode="inline"
            items={items}
          />
        </Sider>
      )}

      <Layout>
        {/* Conditionally render the header for pages other than POS and Auth */}
        {!isPosPage && !isAuthPage && (
          <div id="header" className='border-b' style={{ background: colorBgContainer, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.5rem 1rem" }}>
            <div></div>
            <div className='flex items-center gap-2'>
              <div className='flex gap-2'>
                <Tooltip title="POS Page" overlayInnerStyle={{ fontSize: '12px' }} mouseEnterDelay={0.6} mouseLeaveDelay={0}>
                  <Link to="/pos" className='text-md py-2 px-3 bg-gray-100 rounded-sm hover:bg-gray-300 cursor-pointer'>POS</Link>
                </Tooltip>

                <Tooltip title="Alert Quantity" overlayInnerStyle={{ fontSize: '12px' }} mouseEnterDelay={0.6} mouseLeaveDelay={0}>
                  <div className='flex items-center gap-1 text-xl p-2 bg-gray-100 rounded-sm hover:bg-gray-300 cursor-pointer relative'>
                    <MdProductionQuantityLimits />
                    <div className='absolute top-[-6px] right-[-6px] bg-red-500 text-white text-sm px-[0.38rem] rounded-full flex items-center'>3</div>
                  </div>
                </Tooltip>
              </div>
              <div className='flex items-center gap-1 text-lg'>
                profile
                <div className='bg-gray-100 p-3 rounded-full'>
                  <LuUser2 />
                </div>
              </div>
            </div>
          </div>
        )}

        <Content style={{ margin: isPosPage || isAuthPage ? '0' : '0 16px' }}>
          {/* Conditionally render breadcrumb and AppRoutes */}
          {!isPosPage && !isAuthPage && (
            <Breadcrumb items={breadcrumbItems} style={{ margin: '16px 0' }} />
          )}
          <AppRoutes />
        </Content>

        {/* Conditionally render the footer for pages other than POS and Auth */}
        {!isPosPage && !isAuthPage && (
          <Footer style={{ textAlign: 'center' }}>
            Products and Service Management System ©2024 Created by Longheng
          </Footer>
        )}
      </Layout>
    </Layout>
  );
};

export default App;
