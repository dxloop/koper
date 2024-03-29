import { Link, useLocation } from 'react-router-dom';
import { Stack, AppShell, Text } from '@mantine/core';
import { RouterLinks, getLabelFromLocation } from '../../../shared/Links';
import classes from './Sidebar.module.css';

/**
 * The Sidebar component, which displays the navigation links and the user's information.
 * @param props - The props for the Sidebar component, which contains the logOut function.
 * @returns The sidebar navigation component.
 */
export function SideBar() {
  const location = useLocation();

  const links = RouterLinks.map((item) => (
    <Link
      role="link"
      aria-label={`Go to ${item.label}`}
      className={classes.linkName}
      data-active={item.label === getLabelFromLocation(location.pathname) || undefined}
      to={item.link}
      key={item.label}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </Link>
  ));

  return (
    <AppShell.Navbar className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Stack gap={0}>
          <Text fw={500} size="sm" c="dimmed" mb="xs">
            Navigation
          </Text>
          {links}
        </Stack>
      </div>

   {/*    <div aria-label="User actions" role="contentinfo" className={classes.footer}>
        <Menu shadow="md" width={250}>
          <Menu.Target>
            <UserButton name={user.displayName} image="" email={user.email} />
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              role="button"
              aria-label="Log out"
              onClick={props.logOut}
              leftSection={<IconLogout style={{ width: rem(14), height: rem(14) }} />}
            >
              Log out
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div> */}
    </AppShell.Navbar>
  );
}
