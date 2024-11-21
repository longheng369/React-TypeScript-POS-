import React, { useState } from "react";
import {
   AutoComplete,
   Input,
   Select,
   // DatePicker,
   Button,
   Table,
   Checkbox,
   message,
} from "antd";
import { RiBarcodeFill } from "react-icons/ri";
import { useSettings } from "../context/SettingsContext";
import { useProducts } from "../context/ProductProvider";
import TextArea from "antd/es/input/TextArea";
import { MdKeyboardArrowDown } from "react-icons/md";
import { motion } from "framer-motion";
// import moment from "moment";
import axios from "axios";
// import { useNavigate } from "react-router-dom";

const { Option } = Select;

interface Item {
   product_id: number;
   quantity: number;
   name?: string;
   code?: string;
   unit_price?: number;
   unit_name?: string;
   discount: number;
   subtotal: number;
}

interface Payment {
   payment_amount: number;
   payment_method: string;
   payment_date: string;
}

interface Purchase {
   supplier_id: number;
   user_id: number;
   tax: number;
   discount: number;
   status: string;
   notes: string | null;
   items: Item[];
   payment?: Payment[];
}

interface Suggestion {
   value: string;
   product_id: number;
}

const initialFormData: Purchase = {
   supplier_id: 0,
   user_id: 1,
   tax: 0,
   discount: 0,
   status: "pending",
   notes: null,
   items: [],
   payment: [{ payment_amount: 0, payment_method: "cash", payment_date: "" }],
};

const vibrationAnimation = {
   x: [0, -5, 0], // Movement on the x-axis
   transition: {
      duration: 0.15, // Duration of the vibration
      repeat: 2, // Number of times to repeat the vibration
   },
};

const AddPurchase: React.FC = () => {
   const { settings, isLoading: isLoadingSettings } = useSettings();
   const { products, isLoading: isLoadingProducts } = useProducts();
   console.log(products);

   const [formData, setFormData] = useState<Purchase>(initialFormData);
   const [inputValue, setInputValue] = useState<string>("");
   const [options, setOptions] = useState<Suggestion[]>([]);
   const [errorSupplier, setErrorSupplier] = useState<boolean>(false);
   const [errorItems, setErrorItems] = useState<boolean>(false);
   const [isPayment, setIsPayment] = useState<boolean>(false);
   const [isLoading, setIsLoading] = useState<boolean>(false);

   // const navigate = useNavigate();

   const addMorePayment = () => {
      setFormData((prev) => ({
         ...prev,
         payment: [
            ...(prev.payment ?? []),
            { payment_amount: 0, payment_method: "cash", payment_date: "" },
         ],
      }));
   };

   // const handleDateChange = (date: any, index: number) => {
   //    // Format the date and time properly
   //    const formattedDate = date
   //       ? moment(date).format("YYYY-MM-DD HH:mm:ss")
   //       : null;

   //    setFormData((prev) => ({
   //       ...prev,
   //       payment: prev.payment?.map((payment: any, i) =>
   //          i === index ? { ...payment, payment_date: formattedDate } : payment
   //       ),
   //    }));
   // };

   // Handle adding a selected item to the table
   const handleAddItem = (selectedProduct: Suggestion) => {
      const product = products.data.find(
         (product: any) => product.id === selectedProduct.product_id
      );

      if (product) {
         const newItem: Item = {
            product_id: product.id,
            quantity: 1, // Default to 1 when adding the item
            name: product.name,
            code: product.code,
            unit_price: product.costing_price,
            unit_name: product.unit.name,
            discount: 0,
            subtotal: product.costing_price,
         };

         setFormData((prev) => ({
            ...prev,
            items: [...prev.items, newItem],
         }));

         setErrorItems(false);

         // Remove the selected product from the suggestions
         setOptions((prevOptions) =>
            prevOptions.filter((option) => option.product_id !== product.id)
         );
      }
   };

   const handleSelect = (value: string) => {
      const selectedProduct = options.find(
         (product) => product.value === value
      );
      if (selectedProduct) {
         handleAddItem(selectedProduct);
         setInputValue(""); // Clear input after selection
      }
   };

   const handleSearch = (value: string) => {
      setInputValue(value);

      const filteredSuggestions = products?.data
         .filter(
            (product: any) =>
               !formData.items.some((item) => item.product_id === product.id) && // Exclude already added items
               product.name.toLowerCase().startsWith(value.toLowerCase())
         )
         .map((product: any) => ({
            value: product.name,
            product_id: product.id,
         }));

      setOptions(filteredSuggestions || []);
   };

   const handleClear = () => {
      setInputValue("");
      const initialSuggestions = products?.data
         .filter(
            (product: any) =>
               !formData.items.some((item) => item.product_id === product.id)
         )
         .map((product: any) => ({
            value: product.name,
            product_id: product.id,
         }));

      setOptions(initialSuggestions || []);
   };

   const handleQuantityChange = (productId: number, change: number) => {
      setFormData((prev) => ({
         ...prev,
         items: prev.items.map((item) =>
            item.product_id === productId
               ? {
                    ...item,
                    quantity: Math.max(item.quantity + change, 1), // Ensure quantity doesn't go below 1
                    subtotal:
                       Math.max(item.quantity + change, 1) * item.unit_price! -
                       Math.max(item.quantity + change, 1) *
                          item.unit_price! *
                          (item.discount / 100),
                 }
               : item
         ),
      }));
   };

   const handleDiscountChange = (productId: number, change: number) => {
      setFormData((prev) => ({
         ...prev,
         items: prev.items.map((item) =>
            item.product_id === productId
               ? {
                    ...item,
                    discount: Math.max(item.discount + change, 0), // Ensure discount doesn't go below 0
                    subtotal:
                       item.unit_price! *
                       item.quantity *
                       (1 - Math.max(item.discount + change, 0) / 100), // Recalculate subtotal
                 }
               : item
         ),
      }));
   };

   const addPurchase = async (formData: any) => {
      try {
         const response = await axios.post(
            `${import.meta.env.VITE_URL}/purchases`,
            formData
         );
         return response.data;
      } catch (error) {
         console.error("Error submitting purchase", error);
         throw error;
      }
   };

   const handleRemoveItem = (productIdToRemove: number) => {
      setFormData((prev) => ({
         ...prev,
         items: prev.items.filter(
            (item) => item.product_id !== productIdToRemove
         ),
      }));
   };

   const handleSubmit = async () => {
      if (formData.supplier_id === 0) {
         setErrorSupplier(true);
         return;
      }

      if (formData.items.length === 0) {
         setErrorItems(true);
         return;
      }

      // Create a copy of formData
      const dataToSubmit = {
         ...formData,
         items: formData.items.map(({ product_id, quantity, discount }) => ({
            product_id,
            quantity,
            discount,
         })),
      };

      // Conditionally include or exclude payments
      if (!isPayment) {
         delete dataToSubmit.payment; // Remove payments if isPayment is false
      }

      // console.log(dataToSubmit)

      setIsLoading(true);

      try {
         await addPurchase(dataToSubmit); // Await the result
         // console.log("Purchase submitted successfully", result);

         // Display success message
         message.success("Purchase submitted successfully!");

         setIsLoading(false);
         // navigate("/purchases"); // Redirect or perform another action on success
         setFormData(initialFormData);
      } catch (error) {
         console.error("Failed to submit purchase", error);

         // Display error message
         message.error("Failed to submit purchase. Please try again.");

         setIsLoading(false);
      }
   };

   const columns = [
      {
         title: "Product (Name - Code)",
         dataIndex: "name",
         key: "name",
         width: 350,
         render: (_: any, record: any) => {
            return (
               <div>
                  {record.name} - ( {record.code} )
               </div>
            );
         },
      },
      {
         title: "Unit Name",
         dataIndex: "unit_name",
         key: "unit_name",
         width: 200,
         render: (_: any, record: any) => {
            return (
               <div className="w-full">
                  <Select className="w-full">
                     <Option key={1} value="1">{record.unit_name}</Option>
                  </Select>
               </div>
            );
         },
      },
      {
         title: <div>Unit Price ( $ )</div>,
         dataIndex: "unit_price",
         key: "unit_price",
         width: 150,
         render: (_: any, record: Item) => `${record.unit_price}$`,
      },
      {
         title: <div className="text-center">Quantity ( Unit )</div>,
         dataIndex: "quantity",
         key: "quantity",
         render: (_: any, record: Item) => (
            <div className="flex gap-2 items-center">
               <button
                  className="border px-2"
                  onClick={() => handleQuantityChange(record.product_id, -1)}
               >
                  -
               </button>
               <Input
                  value={record.quantity}
                  onChange={(e) => {
                     const newQuantity = parseInt(e.target.value) || 0; // Ensure valid number input
                     setFormData((prev) => ({
                        ...prev,
                        items: prev.items.map((item) =>
                           item.product_id === record.product_id
                              ? {
                                   ...item,
                                   quantity: newQuantity,
                                   subtotal:
                                      newQuantity *
                                      item.unit_price! *
                                      (1 - item.discount / 100),
                                }
                              : item
                        ),
                     }));
                  }}
                  className="text-center w-16"
               />
               <button
                  className="border px-2"
                  onClick={() => handleQuantityChange(record.product_id, 1)}
               >
                  +
               </button>
            </div>
         ),
      },
      {
         title: <div className="text-center">Discount ( % )</div>,
         dataIndex: "discount",
         key: "discount",
         render: (_: any, record: Item) => (
            <div className="flex gap-2 items-center">
               <button
                  className="border px-2"
                  onClick={() => handleDiscountChange(record.product_id, -1)}
               >
                  -
               </button>
               <Input
                  value={record.discount}
                  onChange={(e) => {
                     const newDiscount = parseInt(e.target.value) || 0; // Ensure valid number input
                     setFormData((prev) => ({
                        ...prev,
                        items: prev.items.map((item) =>
                           item.product_id === record.product_id
                              ? {
                                   ...item,
                                   discount: newDiscount,
                                   subtotal:
                                      item.unit_price! *
                                      item.quantity *
                                      (1 - newDiscount / 100),
                                }
                              : item
                        ),
                     }));
                  }}
                  className="text-center w-16"
               />
               <button
                  className="border px-2"
                  onClick={() => handleDiscountChange(record.product_id, 1)}
               >
                  +
               </button>
            </div>
         ),
      },
      {
         title: <div className="text-center">Sub Total ( $ )</div>,
         dataIndex: "subtotal",
         key: "subtotal",
         width: 180,
         render: (_: any, record: Item) => (
            <div className="font-bold text-center">
               {(record.subtotal * 1).toFixed(2)}$
            </div>
         ),
      },
      {
         title: "",
         dataIndex: "",
         key: "",
         width: 10,
         render: (_: any, record: Item) => (
            <div>
               <button
                  onClick={() => handleRemoveItem(record.product_id)}
                  className=" text-red-500 text-xl px-2 pb-1 rounded-md text-end hover:bg-gray-200"
               >
                  &times;
               </button>
            </div>
         ),
      },
   ];

   if (isLoadingSettings) return <div>Loading settings...</div>;
   if (isLoadingProducts) return <div>Loading products...</div>;

   return (
      <div className="border border-gray-300 p-8 rounded-md bg-white transition-all duration-300">
         <div className="grid grid-cols-[1fr_1fr_1fr_1.25fr] gap-4">
            <div>
               <label htmlFor="">
                  Supplier
                  <span className="text-red-500 text-lg leading-3">*</span>
               </label>
               <motion.div animate={errorSupplier ? vibrationAnimation : {}}>
                  <Select
                     value={
                        formData.supplier_id === 0
                           ? undefined
                           : formData.supplier_id
                     }
                     className={`mt-1 ${
                        errorSupplier &&
                        "rounded-[0.4rem] shadow-[0_0_5px_rgba(255,0,0,0.8)]"
                     }`}
                     suffixIcon={<MdKeyboardArrowDown className="text-xl" />}
                     placeholder="Select Supplier"
                     style={{ width: "100%" }}
                     onChange={(value) => {
                        setFormData((prev) => ({
                           ...prev,
                           supplier_id: value,
                        })),
                           setErrorSupplier(false);
                     }}
                  >
                     {settings.suppliers.map((supplier: any) => {
                        return (
                           <Option key={supplier.id} value={supplier.id}>
                              {supplier.name}
                           </Option>
                        );
                     })}
                  </Select>
                  {errorSupplier && (
                     <span className="text-red-500">
                        supplier field is require
                     </span>
                  )}
               </motion.div>
            </div>

            <div>
               <label htmlFor="">Status</label>
               <Select
                  defaultValue={"pending"}
                  className="mt-1"
                  suffixIcon={<MdKeyboardArrowDown className="text-xl" />}
                  placeholder="Select Status"
                  style={{ width: "100%" }}
                  onChange={(value) => {
                     setFormData((prev) => ({ ...prev, status: value }));
                  }}
               >
                  <Option key={"pending"} value="pending">
                     Pending
                  </Option>
                  <Option key={"delivered"} value="delivered">
                     Delivered
                  </Option>
                  <Option key={"received"} value="received">
                     Received
                  </Option>
                  <Option key={"canceled"} value="canceled">
                     Canceled
                  </Option>
                  <Option key={"returned"} value="returned">
                     Returned
                  </Option>
               </Select>
            </div>

            <div>
               <label htmlFor="">Tax ( optional )</label>
               <Input
                  onChange={(e) =>
                     setFormData((prev) => ({
                        ...prev,
                        tax: Number(e.target.value),
                     }))
                  }
                  className="mt-1 border-[#c1c1c1]"
                  defaultValue={0}
               />
            </div>

            <div>
               <label htmlFor="">Discount ( optional )</label>
               <Input
                  onChange={(e) =>
                     setFormData((prev) => ({
                        ...prev,
                        discount: Number(e.target.value),
                     }))
                  }
                  className="mt-1 border-[#c1c1c1]"
                  defaultValue={0}
               />
            </div>
         </div>

         <div className="mt-4 flex items-center rounded-md overflow-hidden">
            <div className="border p-1 px-2 border-gray-300 border-r-0 rounded-l-md">
               <RiBarcodeFill className="text-[1.65rem] " />
            </div>
            <AutoComplete
               options={options}
               style={{ width: "100%" }}
               onSearch={handleSearch}
               onSelect={handleSelect}
               placeholder="Search for product"
               value={inputValue}
               className="flex items-center"
            >
               <Input
                  className="rounded-none text-[1.05rem] border-[#c1c1c1] rounded-r-md"
                  onClick={handleClear}
               />
            </AutoComplete>
         </div>

         <motion.div
            className="mt-4"
            animate={errorItems ? vibrationAnimation : {}} // Apply animation when errorItems is true
         >
            <Table
               className={`border border-[#c1c1c1] ${
                  errorItems && "shadow-[0_0_5px_rgba(255,0,0,0.8)] border-none"
               } rounded-t-[0.5rem]`}
               columns={columns}
               dataSource={formData.items}
               rowKey="product_id"
            />
            {errorItems && (
               <div className="text-red-500 mt-2">Table field is required</div>
            )}
         </motion.div>

         <div>
            <div className="text-end text-[1rem] mt-2 font-[500]">
               Grand Total:{" "}
               <span>
                  {formData.items.reduce((prev, cur) => {
                     return prev + Number(cur.subtotal);
                  }, 0)}
               </span>
               $
            </div>
         </div>

         <div>
            <Checkbox
               onChange={() => setIsPayment(!isPayment)}
               id="isPayment"
            />
            <label
               htmlFor="isPayment"
               className="font-[500] whitespace-nowrap ml-2"
            >
               Payments
            </label>
         </div>

         {isPayment && (
            <div className="flex flex-col gap-4 mt-3">
               {formData.payment?.map((payment: Payment, index: number) => {
                  return (
                     <div key={index}>
                        <motion.div
                           className="grid grid-cols-[1fr_1fr_0.1fr] gap-4 mt-2"
                           initial={{ opacity: 0, y: -15 }} // Starting state
                           animate={{ opacity: 1, y: 0 }} // End state
                           exit={{ opacity: 0, y: 20 }} // Exit state
                           transition={{ duration: 0.2 }} // Transition duration
                        >
                           {/* <motion.div className="flex flex-col">
                              <label htmlFor="" className="mb-1">
                                 Date
                              </label>
                              <DatePicker
                                 showTime
                                 format="YYYY-MM-DD HH:mm:ss"
                                 placeholder="Date"
                                 // value={
                                 //    payment.payment_date
                                 //       ? moment(
                                 //            payment.payment_date,
                                 //            "YYYY-MM-DD HH:mm:ss"
                                 //         )
                                 //       : null
                                 // } // Ensure proper moment object
                                 onChange={(date) =>
                                    handleDateChange(date, index)
                                 } // Pass the index
                              />
                           </motion.div> */}

                           <motion.div>
                              <label htmlFor="">Amounts</label>
                              <Input
                                 className="mt-1"
                                 placeholder="Amount"
                                 onChange={(e) =>
                                    setFormData((prev) => ({
                                       ...prev,
                                       payment: prev.payment?.map(
                                          (p: Payment, i) =>
                                             i === index
                                                ? {
                                                     ...p,
                                                     payment_amount: Number(
                                                        e.target.value
                                                     ),
                                                  }
                                                : p
                                       ),
                                    }))
                                 }
                              />
                           </motion.div>

                           <motion.div>
                              <label htmlFor="">
                                 Payment Method
                                 <span className="text-red-500 text-lg leading-3">
                                    *
                                 </span>
                              </label>
                              <Select
                                 value={payment.payment_method}
                                 className="mt-1"
                                 suffixIcon={
                                    <MdKeyboardArrowDown className="text-xl" />
                                 }
                                 placeholder="Select Payment Method"
                                 style={{ width: "100%" }}
                                 onChange={(value) =>
                                    setFormData((prev) => ({
                                       ...prev,
                                       payment: prev.payment?.map((p, i) =>
                                          i === index
                                             ? { ...p, payment_method: value }
                                             : p
                                       ),
                                    }))
                                 }
                              >
                                 <Option key="Cash" value="Cash">
                                    Cash
                                 </Option>
                                 <Option key="ABA" value="ABA">
                                    ABA
                                 </Option>
                              </Select>
                           </motion.div>

                           {index >= 1 && (
                              <div className="flex items-end justify-center text-2xl text-red-500">
                                 <button
                                    className="hover:bg-gray-100 px-2 pb-1 rounded-md"
                                    onClick={() =>
                                       setFormData((prev) => ({
                                          ...prev,
                                          payment: prev.payment?.filter(
                                             (_, i) => i !== index
                                          ),
                                       }))
                                    }
                                 >
                                    &times;
                                 </button>
                              </div>
                           )}
                        </motion.div>
                     </div>
                  );
               })}
               <div>
                  <button
                     onClick={addMorePayment}
                     className="border-[1.6px] border-dashed border-gray-300 mt-3 inline p-2 rounded-md hover:bg-gray-100 transition-all duration-150"
                  >
                     Add More Payment +
                  </button>
               </div>
            </div>
         )}

         <div className="mt-4">
            <label htmlFor="notes" className="font-[500]">
               Notes ( Optional )
            </label>
            <TextArea
               id="notes"
               className="mt-1"
               onChange={(e) =>
                  setFormData((prev) => ({ ...prev, notes: e.target.value }))
               }
            />
         </div>

         <Button
            type="primary"
            onClick={handleSubmit}
            style={{ marginTop: "16px" }}
         >
            Submit
            {isLoading && (
               <span className="loading loading-spinner loading-sm"></span>
            )}
         </Button>
      </div>
   );
};

export default AddPurchase;
