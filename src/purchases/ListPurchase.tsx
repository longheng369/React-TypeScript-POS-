import React, { useState } from "react";
import { Table, Modal, Button } from "antd";
import Purchase_Modal from "./Purchase_modal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import moment from "moment";

interface ColumnsInterface {
   title: string;
   dataIndex?: string;
   key: string;
   width?: number;
   className?: string;
   render?: (value: any, record: any, index: number) => React.ReactNode;
}

const ListPurchase: React.FC = () => {
   const queryClient = useQueryClient();

   // State for modal visibility and selected purchase
   const [isModalVisible, setIsModalVisible] = useState(false);
   const [selectedRecord, setSelectedRecord] = useState<any>(null);
   // const [loadingRecord, setLoadingRecord] = useState<number | null>(null);
   const [loadingButton, setLoadingButton] = useState<string | null>(null);
   const [purchaseStatusId, setPurchaseStatusId] = useState<number>(0);
   const [isModalPurchaseOpen, setIsModalPurchaseOpen] =
      useState<boolean>(false);
   const [currentPage, setCurrentPage] = useState(1);
   const [perPage, setPerPage] = useState(10);

   // Fetch data Block
   const fetchPurchases = async (page = 1, perPage = 10) => {
      const response = await axios.get(
         `${import.meta.env.VITE_URL}/purchases`,
         {
            params: {
               page: page, // Send the current page as a query parameter
               per_page: perPage, // Send the per_page as a query parameter
            },
         }
      );
      return response.data;
   };

   // Usage in useQuery
   const { data, isLoading } = useQuery({
      queryKey: ["purchases", { page: currentPage, per_page: perPage }],
      queryFn: () => fetchPurchases(currentPage, perPage), // Pass the current page and per_page to the function
      // keepPreviousData: true, // Keep the data from the previous page while fetching the new page
   });

   console.log(data);
   //   return;

   function convertToReadableFormat(input: string) {
      return input
         .split("_") // Split the string by underscores
         .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
         .join(" "); // Join the words back together with a space
   }

   const formattedData = data?.data.map((row: any) => {
      // const sub_total = row.purchase_items?.reduce((total: number, item: any) => total + parseFloat(item.product.costing_price), 0);
      const paid = row.payments?.reduce(
         (total: number, item: any) => total + parseFloat(item.amount),
         0
      );

      return {
         key: row.id,
         date: moment(row.created_at).format("YYYY-MM-DD HH:mm:ss"),
         reference_no: row.id,
         supplier: row.supplier.name,
         purchase_status: row.status,
         payment_method:
            row.payments?.map((payment: any) => payment.payment_method) || [],
         payment_status:
            Number(row.grand_total) - paid === 0
               ? "Paid"
               : paid > 0 && paid < Number(row.grand_total)
               ? "Partial"
               : "Due",
         grand_total: Number(row.grand_total),
         paid: paid,
         balance: Number(row.grand_total) - paid,
         deleted_at: row.deleted_at,
         purchase_items: row.purchase_items,
      };
   });

   const handleRowClick = (
      record: any,
      event: React.MouseEvent<HTMLElement>
   ) => {
      const clickedElement = event.target as HTMLElement;
      if (!clickedElement.closest(".action-button")) {
         setSelectedRecord(record);
         setIsModalVisible(true);
      }

      // console.log(record)
   };

   const handleButtonClick = (status: string) => {
      setLoadingButton(status); // Set the button status as loading

      updatePurchaseStatus.mutate(
         {
            id: purchaseStatusId,
            payment_status: status,
         },
         {
            onSettled: () => {
               setLoadingButton(null); // Reset loading state after mutation
            },
         }
      );
   };

   const handleModalClose = () => {
      setIsModalVisible(false);
   };

   const updatePurchaseStatus = useMutation({
      mutationFn: async (args: { id: number; payment_status: string }) => {
         const { id, payment_status } = args; // Destructure the arguments
         const { data } = await axios.put(
            `${import.meta.env.VITE_URL}/purchases/${id}`,
            { status: payment_status }
         );
         return data;
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["purchases"] });
         setIsModalPurchaseOpen(false);
      },
      onError: (error) => {
         console.log(error);
      },
   });

   // Mutation for deleting a purchase
   const deleteMutation = useMutation({
      mutationFn: async (id: number) => {
         const response = await axios.delete(
            `${import.meta.env.VITE_URL}/purchases/${id}`
         );
         return response.data;
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["purchases"] }); // Refetch the purchases
         setIsModalVisible(false);
         // setLoadingRecord(null);
      },
   });

   const handleDelete = (id: number) => {
      deleteMutation.mutate(id);
      // setLoadingRecord(id);
   };

   const deletePermenentlyMutation = useMutation({
      mutationFn: async (id: number) => {
         const response = await axios.delete(
            `${import.meta.env.VITE_URL}/purchases/force/${id}`
         );
         return response.data;
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["purchases"] }); // Refetch the purchases
         setIsModalVisible(false);
         // setLoadingRecord(null);
      },
   });

   const handleDeletePermenently = (id: number) => {
      deletePermenentlyMutation.mutate(id);
      // setLoadingRecord(id);
   };

   // const restoreMutation = useMutation({
   //    mutationFn: async (id: number) => {
   //       const response = await axios.patch(
   //          `${import.meta.env.VITE_URL}/purchases/restore/${id}`
   //       );
   //       return response.data;
   //    },
   //    onSuccess: () => {
   //       // Invalidate the purchases query to refetch the updated data
   //       queryClient.invalidateQueries({ queryKey: ["purchases"] });
   //       setLoadingRecord(null);
   //    },
   //    onError: (error: any) => {
   //       console.error(
   //          "Error restoring purchase:",
   //          error.response?.data?.message || error.message
   //       );
   //    },
   // });

   // const forceDeleteMutation = useMutation({
   //    mutationFn: async (id: number) => {
   //       const response = await axios.delete(
   //          `${import.meta.env.VITE_URL}/purchases/force/${id}`
   //       );
   //       return response.data;
   //    },
   //    onSuccess: () => {
   //       queryClient.invalidateQueries({ queryKey: ["purchases"] });
   //       setLoadingRecord(null);
   //    },
   //    onError: (error: any) => {
   //       console.error(
   //          "Error permanently deleting purchase:",
   //          error.response?.data?.message || error.message
   //       );
   //    },
   // });

   const handleEdit = (id: number): number => {
      return id;
   };

   const columns: ColumnsInterface[] = [
      {
         title: "Date",
         dataIndex: "date",
         key: "date",
         width: 120,
      },
      {
         title: "Reference No°",
         dataIndex: "reference_no",
         key: "reference_no",
         width: 96,
         render: (values: any) => {
            return <div>00{values}</div>;
         },
      },
      {
         title: "Supplier",
         dataIndex: "supplier",
         key: "supplier",
         width: 100,
      },
      {
         title: "Purchase Status",
         dataIndex: "purchase_status",
         key: "purchase_status",
         width: 80,
         className: "action-button",
         render: (_, record: any) => {
            let statusClass = "";

            // Determine the class based on the purchase status
            switch (record.purchase_status) {
               case "pending":
                  statusClass = "bg-orange-500 text-white";
                  break;
               case "delivered":
                  statusClass = "bg-blue-500 text-white";
                  break;
               case "received":
                  statusClass = "bg-green-500 text-white";
                  break;
               case "canceled":
                  statusClass = "bg-red-500 text-white";
                  break;
               case "returned":
                  statusClass = "bg-purple-500 text-white";
                  break;
               default:
                  statusClass = "bg-gray-300 text-black"; // Default class for unknown statuses
                  break;
            }

            return (
               <div className="flex justify-center">
                  <button
                     onClick={() => {
                        setIsModalPurchaseOpen(!isModalPurchaseOpen);
                        setPurchaseStatusId(record.reference_no);
                     }}
                     className={`${statusClass} action-button p-2 inline rounded-md capitalize font-[500]`}
                  >
                     {record.purchase_status}
                  </button>
               </div>
            );
         },
      },
      {
         title: "Payment Method",
         dataIndex: "payment_method",
         key: "payment_method",
         width: 90,
         render: (values: any) => {
            return (
               <div className="grid gap-1">
                  {values.map((value: any, index: number) => (
                     <div key={index}>
                        <span className="font-bold">-</span>{" "}
                        {convertToReadableFormat(value)}
                     </div>
                  ))}
               </div>
            );
         },
      },
      {
         title: "Payment Status",
         dataIndex: "payment_status",
         key: "payment_status",
         width: 50,
         render: (_, record: any) => {
            let paymentStatusClass = "";

            // Determine the class based on the purchase status
            switch (record.payment_status) {
               case "Due":
                  paymentStatusClass = "bg-yellow-400 text-white";
                  break;
               case "Partial":
                  paymentStatusClass = "bg-orange-500 text-white";
                  break;
               case "Paid":
                  paymentStatusClass = "bg-green-500 text-white";
                  break;
               default:
                  paymentStatusClass = "bg-gray-300 text-black"; // Default class for unknown statuses
                  break;
            }

            return (
               <div className="flex justify-center">
                  <div
                     className={`${paymentStatusClass} p-2 inline rounded-md capitalize font-[500]`}
                  >
                     {record.payment_status}
                  </div>
               </div>
            );
         },
      },
      {
         title: "Grand Total",
         dataIndex: "grand_total",
         key: "grand_total",
         width: 120,
         className: "text-start",
         render: (value: any) => {
            return <div className="font-[500]">{(value * 1).toFixed(2)}$</div>;
         },
      },
      {
         title: "Paid",
         dataIndex: "paid",
         key: "paid",
         width: 100,
         className: "text-end",
         render: (value: any) => {
            return <div className="font-[500]">{(value * 1).toFixed(2)}$</div>;
         },
      },
      {
         title: "Balance",
         dataIndex: "balance",
         key: "balance",
         width: 100,
         className: "text-end",
         render: (value: any) => {
            return <div className="font-[500]">{(value * 1).toFixed(2)}$</div>;
         },
      },
   ];

   return (
      <div className="shadow-sm border rounded-md bg-white p-8">
         <h1 className="text-lg font-bold pb-4">List Purchases</h1>

         <div>
            <Table
               className="custom-table-purchases border rounded-t-[0.6rem]"
               columns={columns}
               loading={isLoading}
               dataSource={formattedData}
               // pagination={false}
               pagination={{
                  current: currentPage,
                  pageSize: perPage,
                  total: data?.total,
                  showSizeChanger: true, // Enables the dropdown to change page size
                  pageSizeOptions: ["10", "20", "50", "100"], // Options for page sizes
                  onChange: (page, pageSize) => {
                     setPerPage(pageSize)
                     setCurrentPage(page);
                     // Update your current page and page size in the state here
                   },
               }}
               onRow={(record) => ({
                  onClick: (event) => handleRowClick(record, event),
               })}
               // footer={}
            />
         </div>

         <Modal
            // title="Purchase Details"
            open={isModalVisible}
            onCancel={handleModalClose}
            footer={null}
            width={"80vw"}
            className="modal_purchase"
         >
            {selectedRecord && (
               <Purchase_Modal
                  handleDelete={handleDelete}
                  handleEdit={handleEdit}
                  record={selectedRecord}
                  isLoadingModal={deleteMutation.isPending}
                  isLoadingDeletePermenently={
                     deletePermenentlyMutation.isPending
                  }
                  handleDeletePermenently={handleDeletePermenently}
                  isModalOpen={setIsModalVisible}
               />
            )}
         </Modal>

         <Modal
            title="Purchase Status"
            open={isModalPurchaseOpen}
            onCancel={() => setIsModalPurchaseOpen(false)}
            footer={null}
         >
            <div className="grid grid-cols-5 gap-3">
               <Button
                  onClick={() => handleButtonClick("pending")}
                  className="bg-orange-500 text-white"
                  loading={loadingButton === "pending"}
               >
                  Pending
               </Button>
               <Button
                  onClick={() => handleButtonClick("received")}
                  className="bg-green-500 text-white"
                  loading={loadingButton === "received"}
               >
                  Received
               </Button>
               <Button
                  onClick={() => handleButtonClick("delivered")}
                  className="bg-blue-500 text-white"
                  loading={loadingButton === "delivered"}
               >
                  Delivery
               </Button>
               <Button
                  onClick={() => handleButtonClick("returned")}
                  className="bg-purple-500 text-white"
                  loading={loadingButton === "returned"}
               >
                  Return
               </Button>
               <Button
                  onClick={() => handleButtonClick("canceled")}
                  className="bg-red-500 text-white"
                  loading={loadingButton === "canceled"}
               >
                  Cancel
               </Button>
            </div>
         </Modal>
      </div>
   );
};

export default ListPurchase;
