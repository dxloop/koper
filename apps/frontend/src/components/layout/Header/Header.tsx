import { useLocation } from 'react-router-dom';
import { Group, AppShell, ActionIcon, rem, useMantineColorScheme, Burger } from '@mantine/core';
import { IconMoon, IconSun } from '@tabler/icons-react';
import classes from './Header.module.css';
import { getLabelFromLocation } from '../../../shared/Links';

/**
 * Header props for toggling the sidebar and changing the view.
 */
type HeaderProps = {
  /** Whether the mobile sidebar is opened */
  mobileOpened: boolean;
  /** Whether the desktop sidebar is opened */
  desktopOpened: boolean;
  /** Toggles the mobile sidebar */
  toggleMobile(): void;
  /** Toggles the desktop sidebar */
  toggleDesktop(): void;
};

/**
 * The Header component, which displays the navigation links and the user's information.
 * @param props - The props for the Header component, which contains the logOut function.
 * @returns The header component.
 */
export function Header(props: HeaderProps) {
  const { setColorScheme, colorScheme } = useMantineColorScheme();

  // Get current location
  const location = useLocation();
  const locationName = getLabelFromLocation(location.pathname);

  return (
    <AppShell.Header>
      <div className={classes.header}>
        <Group justify="space-between" h="100%">
          <Group h="100%" grow gap={0}>
            <Burger
              aria-label="Open Sidebar on Desktop"
              opened={props.mobileOpened}
              onClick={props.toggleMobile}
              hiddenFrom="sm"
              size="sm"
            />
            <Burger
              aria-label="Open Sidebar on Mobile"
              opened={props.desktopOpened}
              onClick={props.toggleDesktop}
              visibleFrom="sm"
              size="sm"
            />
            <Group>
              <a className={classes.locationName}>{locationName}</a>
            </Group>
          </Group>
          <ActionIcon
            variant="default"
            size="lg"
            aria-label="Switch theme"
            onClick={() => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')}
          >
            {colorScheme === 'dark' && <IconSun style={{ width: rem(22), height: rem(22) }} />}
            {colorScheme === 'light' && <IconMoon style={{ width: rem(22), height: rem(22) }} />}
          </ActionIcon>
        </Group>
      </div>
    </AppShell.Header>
  );
}
