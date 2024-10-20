import React, { useEffect, useState } from "react";
import { Dropdown, Menu, Button, DatePicker, Input, MenuProps, Select } from "antd";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { RangePickerProps } from "antd/es/date-picker";
import TextArea from "antd/es/input/TextArea";
import { useSettings } from "../context/SettingsContext";
import { Option } from "antd/es/mentions";

interface FormData {
   type: string;
   name: string;
   code: string;
   unit_id: number;
   costing_price: number;
   selling_price: number;
   image: string;
   category_id: number;
   supplier_id: number;
   warehouse_id: number;
   brand: string;
   sale_unit_id: string;
   purchase_unit_id: string;
   promotion: boolean;
   promotionPrice: number;
}
interface Unit {
   id: number;
   name: string;
}
const Add: React.FC = () => {

   const {settings, isLoading, refetchSettings } = useSettings();

   useEffect(()=> {refetchSettings()}, [])
   // console.log(settings?.units);
   const [formData, setFormData] = useState<FormData>({
      type: "Standard",
      productCode: "",
      productName: "",
      unit: 0,
      costingPrice: 0,
      sellingPrice: 0,
      productImage: "",
      alertQuantity: 0,
      categoryId: "Select Category",
      // subCategory_id: "Select Subcategory",
      barCode: "code128",
      brand: "Select Brand",
      promotionStartDate: null,
      promotionEndDate: null,
      isPromotion: false,
      promotionPrice: 0,
      warehouseId: 0,
   });


   const [dropdownStates, setDropdownStates] = useState({
      productType: false,
      unit: false,
      category: false,
      subcategory: false,
      brand: false,
   });

   const productTypeOptions = ["Standard", "Service", "Combo"];
   // const unitOptions : Unit[] = [{id: 1, name: "Case"}, {id: 2, name:"Kg"}, {id:3, name:"g"}, {id: 4, name: "pcs"}];
   // const unitOptions  = settings?.units;
   const categoryOptions = ["Select Category", "Fruit", "Drink", "Food"];
   const subcategoryOptions = ["Select Subcategory", "Fresh", "Coffee", "Pizza"];
   const brandOptions = ["Select Brand", "Brand 1", "Brand 2", "Brand 3"];

   const handleDropdownClick = (key: string, value: string) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
   };

   const toggleDropdown = (key: string, open: boolean) => {
      setDropdownStates((prev) => ({ ...prev, [key]: open }));
   };

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
   };

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
         setFormData((prev) => ({ ...prev, productImage: file.name }));
      }
   };

   const handlePromotionCheckBox = () => {
      setFormData((prev) => ({ ...prev, isPromotion: !prev.isPromotion }));
   };

   const handleDateChange: RangePickerProps["onChange"] = (dates) => {
      setFormData((prev) => ({
         ...prev,
         promotionStartDate: dates?.[0]?.format("YYYY-MM-DD") || null,
         promotionEndDate: dates?.[1]?.format("YYYY-MM-DD") || null,
      }));
   };

   const generateCode = () => {
      const randomCode = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      const timestampPart = (Date.now() % 10000).toString().padStart(3, '0');
      const generatedCode = `P-${randomCode}${timestampPart}`;
      setFormData((prev) => ({ ...prev, productCode: generatedCode }));
   };

   const handleSubmit = () => {
      
      // if (formData.isPromotion) {
      //    setFormData((prev) => ({...prev, promotionPrice: 0}))
      // }

      console.log(formData); 
   };

   const renderDropdown = (
      key: string,
      selectedItem: string,
      options: string[],
      openKey: keyof typeof dropdownStates,
      label: string
   ) => {
      const isSelected = selectedItem !== options[0]; 
      const borderColor = isSelected ? "border-green-500" : "border-gray-300";
   
      return (
         <>
            <label>{label}</label>
            <Dropdown
               className={`flex justify-between py-[1.1rem] ${borderColor}`}
               overlay={
                  <Menu
                     onClick={(e) => handleDropdownClick(key, e.key)}
                     items={options.map((option) => ({
                        key: option,
                        label: option,
                        className: formData[key as keyof FormData] === option ? "selected-item" : "",
                     }))}
                  />
               }
               trigger={["click"]}
               open={dropdownStates[openKey]}
               onOpenChange={(flag) => toggleDropdown(openKey, flag)}
            >
               <Button>
                  {selectedItem} <MdOutlineKeyboardArrowDown className="text-lg" />
               </Button>
            </Dropdown>
         </>
      );
   };
   
   // const menuType = (
   //    <Menu>
   //      {productTypeOptions.map((type: string, index) => (
   //        <Menu.Item key={index} onClick={() => setFormData((prevFormData) => ({...prevFormData, productType: type, }))}>
   //          {type}
   //        </Menu.Item>
   //      ))}
   //    </Menu>
   //  );
   const handleSelectChange = (key: string, value: string) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
   };

   

   return (
      <div id="add_product" className="shadow-sm border rounded-md bg-white p-8">
         <h1 className="font-bold text-lg pb-4">Add Product</h1>
         <div className="grid grid-cols-2 gap-8">
            <div className="flex flex-col gap-2">
            {/* <Dropdown overlay={menuType} trigger={['click']}>
               <Button className={`flex justify-between py-[1.1rem] border rounded-md ${formData.productType !== "Standard" ? "border-green-500" : "border-gray-300"}`}>
                  {formData.productType} <MdOutlineKeyboardArrowDown className="text-lg" />
               </Button>
            </Dropdown> */}

               <label htmlFor="product_type">Product Type *</label>
               <Select
                  defaultValue={formData.productType}
                  onChange={(value) => handleSelectChange("productType", value)}
                  className="rounded-md custom-select"
                  suffixIcon={<MdOutlineKeyboardArrowDown className="text-xl text-gray-400 hover:text-blue-500"/>}
                 
               >
                  {productTypeOptions.map((type) => (
                     <Option key={type} value={type}>
                        {type}
                     </Option>
                  ))}
               </Select>

           

               <label htmlFor="product_name">Name *</label>
               <Input
                  type="text"
                  id="product_name"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  className={`border rounded-md outline-blue-400 px-3 py-[0.37rem] ${
                     formData.productName && formData.productName.length > 2
                        ? "border-green-500"
                        : "border-gray-300"
                  }`}
               />

               <label htmlFor="product_code">Product Code *</label>
               <div className="flex w-full">
                  <Input
                     type="text"
                     id="product_code"
                     name="productCode"
                     value={formData.productCode}
                     onChange={handleInputChange}
                     style={{ borderRadius: "0.375rem 0 0 0.375rem" }}
                     className={`border rounded-md outline-blue-400 px-3 py-[0.4rem] flex-1 ${
                        formData.productCode ? "border-green-500" : "border-gray-300"
                     }`}
                  />
                  <button
                     type="button"
                     onClick={generateCode}
                     style={{ borderRadius: "0 0.375rem 0.375rem 0" }}
                     className="px-4 py-2 bg-blue-500 rounded-md text-white"
                  >
                     Generate Code
                  </button>
               </div>

               {/* {renderDropdown("productUnit", formData.productUnit, unitOptions, "unit", "Unit *")} */}
               <label htmlFor="unit">Unit *</label>
               <Select
                  onChange={(value) => handleSelectChange("unit", value)}
                  className="rounded-md custom-select"
                  suffixIcon={<MdOutlineKeyboardArrowDown className="text-xl text-gray-400 hover:text-blue-500"/>}
                  placeholder="Select Unit"
               >
                  {settings?.units.map((type: Unit) => (
                     <Option key={type.id} value={type.id}>
                        {type.name}
                     </Option>
                  ))}
               </Select>

               <label htmlFor="costing_price">Costing Price *</label>
               <Input
                  type="number"
                  id="costing_price"
                  name="costingPrice"
                  value={formData.costingPrice <= 0 ? '' : formData.costingPrice}
                  placeholder="0.00"
                  onChange={handleInputChange}
                  className={`border rounded-md outline-blue-400 px-3 py-[0.37rem] ${
                     formData.costingPrice && formData.costingPrice !== 0
                        ? "border-green-500"
                        : "border-gray-300"
                  }`}
               />

               <label htmlFor="selling_price">Selling Price *</label>
               <Input
                  type="number"
                  id="selling_price"
                  name="sellingPrice"
                  value={formData.sellingPrice <= 0 ? '' : formData.sellingPrice}
                  placeholder="0.00"
                  onChange={handleInputChange}
                  className={`border rounded-md outline-blue-400 px-3 py-[0.37rem] ${
                     formData.sellingPrice && formData.sellingPrice !== 0
                        ? "border-green-500"
                        : "border-gray-300"
                  }`}
               />

               <label htmlFor="product_image">Image (optional)</label>
               <div className="flex w-full">
                  <div className="relative w-full">
                     <Input
                        type="file"
                        id="product_image"
                        name="productImage"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                     />
                     <div className="border rounded-md rounded-tr-none rounded-br-none outline-blue-400 px-3 py-[0.5rem] flex-1 border-gray-300">
                        {formData.productImage || "Choose a file"}
                     </div>
                  </div>
                  <label
                     htmlFor="product_image"
                     style={{ borderRadius: "0 0.375rem 0.375rem 0" }}
                     className="flex items-center px-4 py-2 bg-blue-500 rounded-md text-white"
                  >
                     Browse
                  </label>
               </div>

               <div>
                  <button onClick={handleSubmit} className="bg-blue-500 border border-blue-600 p-2 px-4 rounded-md text-white mt-4">
                     Submit
                  </button>
               </div>
            </div>

            <div className="flex flex-col gap-2">
               {/* {renderDropdown("categoryId", formData.categoryId.toString(), categoryOptions, "category", "Category *")} */}
               <label htmlFor="category">Category *</label>
               <Select
                  onChange={(value) => handleSelectChange("categoryId", value)}
                  className="rounded-md custom-select"
                  suffixIcon={<MdOutlineKeyboardArrowDown className="text-xl text-gray-400 hover:text-blue-500"/>}
                  placeholder="Select Category"
               >
                  {settings?.categories.map((type: Unit) => (
                     <Option key={type.id} value={type.id}>
                        {type.name}
                     </Option>
                  ))}
               </Select>
              
               {/* {renderDropdown("brand", formData.brand, brandOptions, "brand", "Brand (optional)")} */}
               <label htmlFor="category">Brand</label>
               <Select
                  onChange={(value) => handleSelectChange("brand", value)}
                  className="rounded-md custom-select"
                  suffixIcon={<MdOutlineKeyboardArrowDown className="text-xl text-gray-400 hover:text-blue-500"/>}
                  placeholder="Select Category"
               >
                  {settings?.brands.map((type: Unit) => (
                     <Option key={type.id} value={type.id}>
                        {type.name}
                     </Option>
                  ))}
               </Select>
               <div className="flex flex-col gap-2">
                  <label htmlFor="product_details">Product Details</label>
                  <TextArea id="product_details" className="border border-gray-300 rounded-md outline-blue-500 p-2 text-md" />
               </div>
               <div className="flex gap-1">
                  <Input onClick={handlePromotionCheckBox} type="checkbox" className="cursor-pointer w-4" />
                  <label>Promotion</label>
               </div>

               {formData.isPromotion && (
                  <>
                     <label>Promotion Price *</label>
                     <Input
                        type="number"
                        name="promotionPrice"
                        value={formData.promotionPrice <= 0 ? "" : formData.promotionPrice}
                        placeholder="0.00"
                        onChange={handleInputChange}
                        className={`border rounded-md outline-blue-400 px-3 py-[0.37rem] ${
                           formData.promotionPrice && formData.promotionPrice !== 0
                              ? "border-green-500"
                              : "border-gray-300"
                        }`}
                     />

                     <label>Promotion Date *</label>
                     <DatePicker.RangePicker onChange={handleDateChange} className="w-full" />
                  </>
               )}
            </div>
         </div>
      </div>
   );
};

export default Add;
