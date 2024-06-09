import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { ReactNode, useEffect, useState } from 'react';
import { Header } from '../Header/Header';
import { SideBar } from '../Sidebar/Sidebar';
import classes from './Body.module.css';
import { User, useGetSelfUser } from 'openapi';
import { removeJWT } from '@/services/util/Auth';
import { useNavigate } from 'react-router-dom';
import { UserProvider } from '@/context/UserContext';

/**
 * The Body component, which displays the navigation links and the user's information and contains the content of the application.
 * @param param - The children of the AppBody component.
 * @returns The body of the application.
 */
export function AppBody({ children }: { children: ReactNode }) {
    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
    const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

    const nav = useNavigate();
    const queryClient = useQueryClient();

    // Set authenticated user
    const [user, setUser] = useState<User | null>(null);
    const userQuery = useGetSelfUser();

    useEffect(() => {
        if (userQuery.isSuccess) {
            setUser(userQuery.data);
        }
    }, [userQuery.data]);

    // @todo - Add proper loading state
    if (!user) {
        return null;
    }


    const logOut = () => {
        removeJWT();
        // Invalidate the cache, so after logout, it fetches the data fresh from the api
        queryClient.resetQueries();
        nav('/login');
    };

    return (
        <AppShell
            padding={{ base: 20, md: 'md', lg: 'md' }}
            header={{
                height: 60,
            }}
            navbar={{
                width: { base: 200, md: 300, lg: 300 },
                breakpoint: 'sm',
                collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
            }}
        >
            <Header
                mobileOpened={mobileOpened}
                desktopOpened={desktopOpened}
                toggleMobile={toggleMobile}
                toggleDesktop={toggleDesktop}
            />
            <UserProvider userData={user}>
                <SideBar logOut={logOut} />
                <AppShell.Main className={classes.body}>{children}</AppShell.Main>
            </UserProvider>
        </AppShell>
    );
}
