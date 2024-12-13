// import React, { createContext, useContext, ReactNode } from 'react';

// interface UserContextType {
//   userId: string | null;
//   isAdmin: boolean;
//   setUserData: (userId: string | null, isAdmin: boolean) => void;
// }

// const UserContext = createContext<UserContextType | undefined>(undefined);

// export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [userId, setUserId] = React.useState<string | null>(null);
//   const [isAdmin, setIsAdmin] = React.useState<boolean>(false);

//   const setUserData = (userId: string | null, isAdmin: boolean) => {
//     setUserId(userId);
//     setIsAdmin(isAdmin);
//   };

//   return (
//     <UserContext.Provider value={{ userId, isAdmin, setUserData }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// // Zaktualizowana wersja hooka useUser z odpowiednią obsługą błędów
// export const useUser = (): UserContextType => {
//   const context = useContext(UserContext);
//   if (!context) {
//     throw new Error('useUser must be used within a UserProvider');
//   }
//   return context;
// };
