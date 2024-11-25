import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Input, message, Modal, Select } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { motion } from "framer-motion";

const { Option } = Select;

interface Unit {
   id: number;
   name: string;
   status: boolean;
}

interface Product {
   id: number;
   type: string;
   code: string;
   name: string;
   costing_price: number;
   selling_price: number;
   alert_quantity: number | null;
   status: number;
   image: string;
   barcode_symbology: string;
   unit_id: number;
   category_id: number;
   supplier_id: number | null;
   brand_id: number | null;
   warehouse_id: number | null;
   sale_unit_id: number;
   purchase_unit_id: number;
   tax_rate: number;
   details: string | null;
   promotion: number;
   promotion_price: string | null;
   start_date: string | null;
   end_date: string | null;
   stock: number;
   expiration_date: string | null;
   base_unit: Unit;
   created_at: string;
   updated_at: string;
}

interface PurchaseItem {
   id: number; // Unique identifier for the purchase item
   purchase_id: number; // Identifier for the associated purchase
   quantity: number; // Quantity of the product purchased
   discount: number;
   product: Product; // Price of the product
}

interface PurchaseRecord {
   date: string; // Date of the purchase
   reference_no: number; // Reference number for the purchase
   supplier: string; // Supplier name
   purchase_status: string; // Status of the purchase (e.g., "partial")
   payment_method: string[]; // Array of payment methods
   balance: number; // Remaining balance
   deleted_at: string | null; // Timestamp of deletion (or null if not deleted)
   grand_total: number; // Total amount for the purchase
   paid: number; // Amount paid
   payment_status: string; // Status of the payment (e.g., "Partial")
   purchase_items: PurchaseItem[]; // Array of purchase items
}

interface PurchaseModalProps {
   handleDelete: (id: number) => void; // Changed to void for clarity
   handleEdit: (id: number) => void; // Changed to void for clarity
   handleDeletePermenently: (id: number) => void;
   record: PurchaseRecord; // Updated type here
   isLoadingModal: boolean; // Type is correct
   isLoadingDeletePermenently: boolean;
   isModalOpen: (value: boolean) => void;
   // grand_total: number;
}

interface Payment {
   payment_method: string;
   payment_amount: number;
}

// Interface for the entire data object
interface UpdatePaymentData {
   user_id: number;
   payment: Payment[];
}

const initialData: UpdatePaymentData = {
   user_id: 1,
   payment: [{ payment_amount: 0, payment_method: "Cash" }],
};

const updatePayment = async ({
   purchaseId,
   updatedData,
}: {
   purchaseId: number;
   updatedData: UpdatePaymentData;
}) => {
   const { data } = await axios.put(
      `${import.meta.env.VITE_URL}/purchases/${purchaseId}`,
      updatedData
   );
   return data;
};

const vibrationAnimation = {
   x: [0, -5, 0], // Movement on the x-axis
   transition: {
      duration: 0.15, // Duration of the vibration
      repeat: 2, // Number of times to repeat the vibration
   },
};


const PurchaseModal: React.FC<PurchaseModalProps> = (props) => {
   const queryClient = useQueryClient();

   const [openPaymentModal, setOpenPaymentModal] = useState<boolean>(false);

   const [formPayment, setFormPayment] =
      useState<UpdatePaymentData>(initialData);
   const [formErrors, setFormErrors] = useState<boolean[]>([]);

   const paymentMutation = useMutation({
      mutationFn: (variables: {
         purchaseId: number;
         updatedData: UpdatePaymentData;
      }) => updatePayment(variables),
      onSuccess: () => {
         message.success("Payments Successfully!");
         queryClient.invalidateQueries({ queryKey: ["purchases"] }); // Optionally refetch data
         setOpenPaymentModal(false);
         setFormPayment(initialData);
         props.isModalOpen(false);
      },onError: () => {
         setFormPayment(initialData);
         message.error("You cannot pay more than your debt.")
      }
   });

   const handleSubmit = async (id: number) => {
      // Prepare the new errors array
      const newErrors = formPayment.payment.map(
         (payment: Payment) => payment.payment_amount === 0
      );

      
      setFormErrors(newErrors);

      // Update formErrors state only once
      if(newErrors.some((value) => value === true)){
         return;
         // console.log("has one error")
      }

      if (formPayment.payment.reduce((prev, cur) => prev + cur.payment_amount, 0) <= 0) {
         console.log("Amount field is required!");
         return;
      }
       

      // Log valid payment amounts
      formPayment.payment.forEach((payment: Payment) => {
         if (payment.payment_amount !== 0) {
            // console.log(payment.payment_amount); // Log the payment amount if it's not zero
         }
      });
      paymentMutation.mutate({
         purchaseId: id, // Example purchase ID
         updatedData: formPayment,
      });
   };

   const handleOpenPaymenyModal = () => {
      setOpenPaymentModal(true);
   };

   const handleClosePaymentModal = () => {
      setOpenPaymentModal(false);
   };

   const handleDelete = () => {
      props.handleDelete(props.record.reference_no);
   };

   const handleDeletePermenently = () => {
      props.handleDeletePermenently(props.record.reference_no);
   };

   const handleEdit = () => {
      console.log(props.record);
   };

   const handlePrint = () => {
      window.print(); // Trigger browser print dialog
   };

   const formatNumber = (num: number) => {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
   };

   const handlePaymentMethodChange = (index: number, value: string) => {
      setFormPayment((prev) => ({
         ...prev,
         payment: prev.payment.map((payment, i) =>
            i === index ? { ...payment, payment_method: value } : payment
         ),
      }));
   };

   const handlePaymentAmountChange = (index: number, value: number) => {
      setFormPayment((prev) => ({
         ...prev,
         payment: prev.payment.map((payment: Payment, i) =>
            i === index ? { ...payment, payment_amount: value } : payment
         ),
      }));
   };

   // console.log(props)
   // return;

   return (
      <div className="mt-5">
         <div className="grid grid-cols-2 gap-4">
            <div className="border text-center">logo</div>
            <div className="flex flex-col items-end">
               <span className="font-[600] text-lg">Invoice No.</span>
               <span className="font-bold text-blue-500 italic text-lg tracking-wide">
                  #{props.record.reference_no.toString().padStart(4, "0")}
               </span>
            </div>
            <div className="flex flex-col">
               <div className="text-md">From:</div>
               <div className="font-bold capitalize">
                  {props.record.supplier}
               </div>
               <div>Address st.14 Chroyjongvar Phnom Penh</div>
               <div>
                  <span className="font-[600]">Invoice Date:</span>{" "}
                  {props.record.date}
               </div>
            </div>
            <div className="flex flex-col items-end">
               <div className="flex flex-col items-end">
                  <span>To:</span>
                  <span className="font-bold">Longheng Company</span>
                  <span>1-245 East Russei Road</span>
                  <span></span>
               </div>
            </div>
         </div>

         <table className="min-w-full mt-4 bg-white border border-gray-300">
            <thead>
               <tr className="bg-blue-500 text-white">
                  <th className="border px-4 py-2">Product ( Name - Code )</th>
                  <th className="border px-4 py-2">Unit Price ( Name )</th>
                  <th className="border px-4 py-2">Quantity ( Unit )</th>
                  <th className="border px-4 py-2">Discount ( % )</th>
                  <th className="border px-4 py-2">Sub Total ( $ )</th>
               </tr>
            </thead>
            <tbody>
               {props.record.purchase_items.map((item: PurchaseItem) => {
                  const itemSubtotal =
                     item.product.costing_price * item.quantity -
                     (item.discount / 100) *
                        (item.product.costing_price * item.quantity);
                  return (
                     <tr key={item.id} className="hover:bg-gray-100">
                        <td className="border px-4 py-2">
                           {item.product?.name} -{" "}
                           <span>( {item.product.code} )</span>
                        </td>
                        <td className="border px-4 py-2">
                           ${item.product?.costing_price}{" "}
                           {/* <span>( {item.product.base_unit.name} )</span> */}
                        </td>
                        <td className="border px-4 py-2">{item.quantity}<span>( {item.product.base_unit.name} )</span></td>
                        <td className="border px-4 py-2">%{item.discount}</td>
                        <td className="border px-4 py-2">
                           ${itemSubtotal.toFixed(2)}
                        </td>
                     </tr>
                  );
               })}
            </tbody>
         </table>

         <div className="flex justify-end mt-4">
            <div className="flex flex-col items-end">
               <span className="font-[600]">
                  Grand Total :
                  <span className="text-green-600 text-lg italic tracking-wide">
                     ${formatNumber(props.record.grand_total)}
                  </span>
               </span>
            </div>
         </div>

         <div id="footer-buttons" className="grid grid-cols-5 mt-3 gap-[6px]">
            <button
               onClick={
                  props.record.balance !== 0
                     ? handleOpenPaymenyModal
                     : undefined
               }
               className={`border font-[500] ${
                  props.record.balance === 0
                     ? "bg-gray-200 border-gray-300 cursor-not-allowed"
                     : "bg-green-600 hover:bg-green-700 border-green-700 text-white cursor-pointer"
               } `}
               disabled={props.record.balance === 0}
            >
               Make Payment
            </button>
            <button
               onClick={handleDelete}
               className="p-2 border border-orange-600 text-orange-500 font-[600] hover:bg-orange-100 transition-all duration-150"
            >
               {props.isLoadingModal ? (
                  <div className="flex items-center justify-center opacity-50">
                     Deleting
                     <span className="loading loading-spinner loading-sm"></span>
                  </div>
               ) : (
                  "Delete"
               )}
            </button>
            <button
               onClick={handleDeletePermenently}
               className="border border-red-500 text-red-500 font-[600] hover:bg-red-100 transition-all duration-150"
            >
               {props.isLoadingDeletePermenently ? (
                  <div className="flex items-center justify-center opacity-50">
                     Deleting{" "}
                     <span className="loading loading-spinner loading-sm"></span>
                  </div>
               ) : (
                  "Delete Permenently"
               )}
            </button>
            <button
               onClick={handleEdit}
               className="border border-blue-600 text-blue-500 font-[600] hover:bg-blue-100 transition-all duration-150"
            >
               Edit
            </button>
            <button
               onClick={handlePrint}
               className="border border-gray-500 text-gray-500 font-[600] hover:bg-gray-100 transition-all duration-150"
            >
               Print
            </button>
         </div>

         <Modal
            title="Payments"
            open={openPaymentModal}
            onCancel={handleClosePaymentModal}
            footer={null}
            width={"40vw"}
            className="modal_purchase_payment"
            style={{ top: 200 }}
         >
            {openPaymentModal && (
               <div>
                  {formPayment.payment.map(
                     (payment: Payment, index: number) => {
                        return (
                           <div
                              key={index}
                              className="grid grid-cols-[1fr_1fr_0.62fr] items-center gap-5 mt-3"
                           >
                              <Select
                                 suffixIcon={
                                    <MdKeyboardArrowDown className="text-xl" />
                                 }
                                 value={payment.payment_method} // Bind the value to the select
                                 onChange={(value) => {
                                    handlePaymentMethodChange(index, value);
                                 }}
                              >
                                 <Option key="Cash" value="Cash">
                                    Cash
                                 </Option>
                                 <Option key="ABA" value="ABA">
                                    ABA
                                 </Option>
                              </Select>

                              <motion.div animate={formErrors[index] ? vibrationAnimation : {}}>
                                 <div className="flex items-center whitespace-nowrap">
                                 <Input
                                    type="number"
                                    step="0.01"
                                    required
                                    value={payment.payment_amount}
                                    onChange={(e) => {
                                       const newValue = e.target.value ? parseFloat(e.target.value) : 0;
                                       handlePaymentAmountChange(
                                          index,
                                          newValue
                                       );
                                       setFormErrors((prev) => {
                                          const newForm = [...prev]; // Create a copy of the current state
                                          newForm[index] = false; // Set the error state for the current index to false
                                          return newForm; // Return the new array to update the state
                                       });
                                    }}
                                    className={`${formErrors[index] && "rounded-[0.4rem] shadow-[0_0_5px_rgba(255,0,0,0.8)]"}`}
                                 /><span className="ml-1">( $ )</span></div>

                                 {formErrors[index] && (
                                    <span className="text-red-500">
                                       amount field required
                                    </span>
                                 )}
                              </motion.div>

                              {index == 0 && (
                                 <button
                                    onClick={() =>
                                       setFormPayment((prev) => ({
                                          ...prev,
                                          payment: prev.payment.map(
                                             (pmt, index) =>
                                                index === 0
                                                   ? {
                                                        ...pmt,
                                                        payment_amount: props.record.balance,
                                                     }
                                                   : pmt
                                          ),
                                       }))
                                    }
                                    className="bg-blue-600 text-white p-1 px-2 rounded-md"
                                 >
                                    Repay in full
                                 </button>
                              )}

                              {index >= 1 && (
                                 <button
                                    onClick={() => {
                                       setFormPayment((prev) => ({
                                          ...prev,
                                          payment: prev.payment.filter(
                                             (_, i) => i !== index
                                          ), // Filter out the payment at the specified index
                                       }));
                                    }}
                                    className="text-red-500 text-2xl hover:bg-gray-200 rounded-md p-2 pb-3 leading-3"
                                 >
                                    &times;
                                 </button>
                              )}
                           </div>
                        );
                     }
                  )}

                  <button
                     onClick={() => handleSubmit(props.record.reference_no)}
                     className="p-2 px-4 bg-blue-600 text-white rounded-md mr-3"
                  >
                     Submit Payment
                     {paymentMutation.isPending && (
                        <span className="loading loading-spinner loading-sm"></span>
                     )}
                  </button>
                  <button
                     onClick={() =>
                        setFormPayment((prev) => ({
                           ...prev,
                           payment: [
                              ...prev.payment,
                              {
                                 payment_amount: 0,
                                 payment_method: "cash",
                              },
                           ],
                        }))
                     }
                     className="bg-gray-500 text-white mr-4 p-2 rounded-md mt-3"
                  >
                     Add More Payment +
                  </button>
               </div>

               // console.log(formPayment.payment)
            )}
         </Modal>
      </div>
   );
};

export default PurchaseModal;
