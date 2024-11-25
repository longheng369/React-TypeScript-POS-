import React, { useEffect, useReducer, useState } from "react";
import {
   DatePicker,
   Input,
   Select,
   Button,
   message,
} from "antd";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import TextArea from "antd/es/input/TextArea";
import { useSettings } from "../context/SettingsContext";
import axios from "axios";
const { Option } = Select;

interface FormData {
  type: string;
  name: string;
  code: string;
  base_unit_id: number;
  costing_price: number;
  selling_price: number;
  alert_quantity: number;
  status: boolean;
  image: File | null;
  category_id: number;
  supplier_id: number | null;
  warehouse_id: number | null;
  brand_id: number | null;
  promotion: boolean;
  promotion_price: number;
  start_date: string;
  end_date: string;
  details: string;
  discount: number | null;
  expiration_date: string;
  tax_rate: number;
  conversion_factor: number;
}

interface Unit {
  id: number;
  name: string;
}

type Action = 
  | { type: "UPDATE_FIELD"; field: keyof FormData; value: any }
  | { type: "RESET" };

const initialFormValues: FormData = {
  type: "standard",
  name: "",
  code: "",
  base_unit_id: 0,
  costing_price: 0,
  selling_price: 0,
  alert_quantity: 0,
  status: true,
  image: null,
  category_id: 0,
  supplier_id: null,
  warehouse_id: null,
  brand_id: null,
  promotion: false,
  promotion_price: 0,
  start_date: "",
  end_date: "",
  details: "",
  discount: null,
  expiration_date: "",
  tax_rate: 0,
  conversion_factor: 0,
}

const formReducer = (state: FormData, action: Action): FormData => {
  switch (action.type) {
    case "UPDATE_FIELD":
      return {
        ...state,
        [action.field]: action.value,
      };
    case "RESET":
      return initialFormValues;
    default:
      return state;
  }
};

const Add: React.FC = () => {
  const [formData, formDispatch] = useReducer(formReducer, initialFormValues);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFieldChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let value: any;
  
    // Handle file input specifically
    if (field === "image" && e.target instanceof HTMLInputElement && e.target.files) {
      value = e.target.files[0] || null;
    } 
    // Handle checkbox inputs
    else if (field === "status" || field === "promotion") {
      value = (e.target as HTMLInputElement).checked;
    } 
    // Handle numeric fields
    else if (
      new Set([
        "base_unit_id", 
        "category_id", 
        "supplier_id", 
        "warehouse_id", 
        "brand_id", 
        "promotion_price", 
        "costing_price", 
        "selling_price", 
        "alert_quantity", 
        "tax_rate", 
        "discount", 
        "conversion_factor"
      ]).has(field)
    ) {
      value = parseFloat(e.target.value) || 0;
    } 
    // Handle all other fields as strings
    else {
      value = e.target.value;
    }
  
    // Dispatch the action
    formDispatch({
      type: "UPDATE_FIELD",
      field,
      value,
    });
  };
  

  const handleSelectChange = (field: keyof FormData) => (value: any) => {
    formDispatch({
      type: "UPDATE_FIELD",
      field,
      value,
    });
  };

  const handleDateChange = (dates: any, dateStrings: [string, string]) => {
    formDispatch({ type: "UPDATE_FIELD", field: "start_date", value: dateStrings[0] });
    formDispatch({ type: "UPDATE_FIELD", field: "end_date", value: dateStrings[1] });
  };


  const { settings, refetchSettings } = useSettings();

  useEffect(() => {
    refetchSettings();
  }, []);

  const generateCode = () => {
    const randomCode = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    const timestampPart = (Date.now() % 10000).toString().padStart(3, "0");
    const generatedCode = `P-${randomCode}${timestampPart}`;
    formDispatch({
      type: "UPDATE_FIELD",
      field: "code",
      value: generatedCode,
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Create FormData object
      const dataToSubmit = new FormData();
  
      // Append fields to FormData
      Object.entries(formData).forEach(([key, value]) => {
        // Convert boolean fields to 1 or 0
        if (key === "status" || key === "promotion") {
          dataToSubmit.append(key, value ? "1" : "0");
        } else if (key === "image" && value instanceof File) {
          // Append image if it exists
          dataToSubmit.append(key, value);
        } else if (value !== null && value !== undefined) {
          // Append other non-null fields
          dataToSubmit.append(key, value.toString());
        }
      });
  
      // Send POST request
      const response = await axios.post(
        `${import.meta.env.VITE_URL}/products`,
        dataToSubmit,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      // Show success message
      message.success("Product added successfully!");
      setIsLoading(false);
      setTimeout(() => {
        formDispatch({type: "RESET"})
      }, 200)
      console.log(response.data);
    } catch (error: any) {
      // Show error message
      message.error("Something went wrong!");
      setIsLoading(false);
      // Debugging the error response, 
      if (error.response?.data?.errors) {
        console.error("Validation Errors:", error.response.data.errors);
      } else {
        console.error(error);
      }
    }
  };
  

  return (
    <div id="add_product" className="shadow-sm border rounded-md bg-white p-8">
      <h1 className="font-bold text-lg pb-4">Add Product</h1>
      <div className="grid grid-cols-2 gap-8">
        <div className="flex flex-col gap-2">
          <label>Product Type *</label>
          <Select
            defaultValue={formData.type}
            onChange={handleSelectChange("type")}
            className="rounded-md custom-select"
            suffixIcon={<MdOutlineKeyboardArrowDown className="text-xl text-gray-400 hover:text-blue-500" />}
          >
            <Option value="standard">Standard</Option>
            {/* <Option value="service">Service</Option> */}
          </Select>

          <label>Name *</label>
          <Input
            type="text"
            value={formData.name}
            onChange={handleFieldChange("name")}
            placeholder="Product name"
            className="border border-gray-400 rounded-md outline-blue-400 px-3 py-[0.37rem]"
          />

          <label>Product Code *</label>
          <div className="flex w-full">
            <Input
              type="text"
              value={formData.code}
              onChange={handleFieldChange("code")}
              placeholder="Product Code"
              style={{ borderRadius: "0.375rem 0 0 0.375rem" }}
              className="border border-gray-400 rounded-md outline-blue-400 px-3 py-[0.4rem] flex-1"
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

          <label>Base Unit *</label>
          <Select
            onChange={handleSelectChange("base_unit_id")}
            className="rounded-md custom-select"
            suffixIcon={<MdOutlineKeyboardArrowDown className="text-xl text-gray-400 hover:text-blue-500" />}
            placeholder="Select Base Unit"
          >
            {settings?.units.map((type: Unit) => (
              <Option key={type.id} value={type.id}>
                {type.name}
              </Option>
            ))}
          </Select>

          <label>Costing Price *</label>
          <Input
            type="number"
            value={formData.costing_price || ""}
            onChange={handleFieldChange("costing_price")}
            placeholder="0.00"
            className="border border-gray-400 rounded-md outline-blue-400 px-3 py-[0.37rem]"
          />

          <label>Selling Price *</label>
          <Input
            type="number"
            value={formData.selling_price || ""}
            onChange={handleFieldChange("selling_price")}
            placeholder="0.00"
            className="border border-gray-400 rounded-md outline-blue-400 px-3 py-[0.37rem]"
          />

          <label>Image (optional)</label>
          <Input
            type="file"
            onChange={handleFieldChange("image")}
            className="border border-gray-400 rounded-md outline-blue-400 px-3 py-[0.37rem]"
          />

        </div>


        <div className="flex flex-col gap-2">
          <label>Alert Quantity</label>
          <Input
            type="number"
            value={formData.alert_quantity || ""}
            onChange={handleFieldChange("alert_quantity")}
            placeholder="0"
            className="border border-gray-400 rounded-md outline-blue-400 px-3 py-[0.37rem]"
          />

          <label>Category *</label>
          <Select
            onChange={handleSelectChange("category_id")}
            className="rounded-md custom-select"
            suffixIcon={<MdOutlineKeyboardArrowDown className="text-xl text-gray-400 hover:text-blue-500" />}
            placeholder="Select Category"
          >
            {settings?.categories.map((type: Unit) => (
              <Option key={type.id} value={type.id}>
                {type.name}
              </Option>
            ))}
          </Select>

          <label>Brand (optional)</label>
          <Select
            onChange={handleSelectChange("brand_id")}
            className="rounded-md custom-select"
            suffixIcon={<MdOutlineKeyboardArrowDown className="text-xl text-gray-400 hover:text-blue-500" />}
            placeholder="Select Brand"
          >
            <Option key="empty" value={0}>
              Empty Brand
            </Option>
            {settings?.brands.map((type: any) => (
              <Option key={type.id} value={type.id}>
                {type.name}
              </Option>
            ))}
          </Select>

          <label>Supplier (optional)</label>
          <Select
            onChange={handleSelectChange("supplier_id")}
            className="rounded-md custom-select"
            suffixIcon={<MdOutlineKeyboardArrowDown className="text-xl text-gray-400 hover:text-blue-500" />}
            placeholder="Select Supplier"
          >
            <Option key="empty" value={0}>
              Empty supplier
            </Option>
            {settings?.suppliers.map((type: any) => (
              <Option key={type.id} value={type.id}>
                {type.name}
              </Option>
            ))}
          </Select>

          <label>Product Details</label>
          <TextArea
            value={formData.details}
            onChange={handleFieldChange("details")}
            className="border border-gray-400 rounded-md outline-blue-400 px-3 py-[0.37rem]"
          />

          <label>Promotion</label>
          <div>
            <input
              type="checkbox"
              checked={formData.promotion}
              onChange={handleFieldChange("promotion")}
              className="cursor-pointer w-5 h-5"
            />
          </div>

          {formData.promotion && (
            <>
              <label>Promotion Price *</label>
              <Input
                type="number"
                value={formData.promotion_price || ""}
                onChange={handleFieldChange("promotion_price")}
                placeholder="0.00"
                className="border border-gray-400 rounded-md outline-blue-400 px-3 py-[0.37rem]"
              />

              <label>Promotion Date *</label>
              <DatePicker.RangePicker
                onChange={handleDateChange}
                className="w-full border-gray-400"
              />
            </>
          )}

          <Button onClick={handleSubmit} className={`bg-blue-500 border border-blue-600 p-4  rounded-md text-white mt-4`}>
            Submit
            {isLoading ? <span className="loading loading-spiner loading-md"></span> : ""}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Add;
