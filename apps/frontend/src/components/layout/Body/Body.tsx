import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ReactNode } from 'react';
import { Header } from '../Header/Header';
import { SideBar } from '../Sidebar/Sidebar';
import classes from './Body.module.css';

/**
 * The Body component, which displays the navigation links and the user's information and contains the content of the application.
 * @param param - The children of the AppBody component.
 * @returns The body of the application.
 */
export function AppBody({ children }: { children: ReactNode }) {
    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
    const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

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

            <SideBar />
            <AppShell.Main className={classes.body}>{children}</AppShell.Main>
        </AppShell>
    );
}
