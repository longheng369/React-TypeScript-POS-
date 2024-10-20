interface CategoryBtnInterface {
   label: string;
   active?: boolean;
   onClick?: () => void; // Added onClick prop
 }
 
 const CategoryBtn: React.FC<CategoryBtnInterface> = ({ label, active, onClick }) => {
   return (
     <div
       onClick={onClick} // Added onClick handler
       className={`inline-block px-3 py-2 rounded-md cursor-pointer transition-all duration-200 border font-[500]
         ${active 
           ? 'bg-blue-500 text-white border-blue-500 shadow-md' 
           : 'bg-blue-50 text-blue-500 border-blue-500 hover:bg-blue-100 hover:text-blue-700 hover:shadow-md'}
         ${active ? 'active:bg-blue-600 active:border-blue-700 active:text-white' : 'active:bg-blue-200 active:border-blue-600 active:text-blue-800'}
       `}
     >
       {label}
     </div>
   );
 };
 
 export default CategoryBtn;
 