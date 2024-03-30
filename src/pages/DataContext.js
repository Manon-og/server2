// import React, { createContext, useContext, useState } from 'react';

// const DataContext = createContext();

// export const useDataContext = () => useContext(DataContext);

// export const DataProvider = ({ children }) => {
//   const [employeeData, setEmployeeData] = useState([]);

//   const updateEmployeeData = (newData) => {
//     setEmployeeData(newData);
//   };

//   return (
//     <DataContext.Provider value={{ employeeData, updateEmployeeData }}>
//       {children}
//     </DataContext.Provider>
//   );
// };
