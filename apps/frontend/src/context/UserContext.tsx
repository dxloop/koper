import { createContext, useState } from 'react';
import { User } from 'openapi';

/**
 * The context for the user data.
 */
export const UserContext = createContext({
   /** The user data */
   user: {} as User & { id?: string },
   /** Update the user data */
   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   updateUser: (newUser: User) => {},
});

/**
 * The provider for the user data, which stores the user data and provides a function to update it.
 * @param param - The children & props of the provider.
 * @returns The user provider.
 */
export function UserProvider({
   children,
   userData,
}: {
   children: React.ReactNode;
   userData: User & { id?: string };
}) {
   const [user, setUser] = useState(userData);

   // Update the user data
   const updateUser = (newUserData: User) => {
      setUser({ ...user, ...newUserData });
   };

   return <UserContext.Provider value={{ user, updateUser }}>{children}</UserContext.Provider>;
}