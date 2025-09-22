import { IconHome, IconSettings } from '@tabler/icons-react';

/**
 * List of links that will be displayed in the sidebar.
 */
export const RouterLinks = [
  { link: '/', label: 'Home', icon: IconHome },
  { link: '/settings', label: 'Settings', icon: IconSettings },
];

/**
 * Gets the label of the location.
 * @param location -The location which is used to determine the label
 * @returns The label of the location.
 */
export function getLabelFromLocation(location: string) {
  const route = RouterLinks.find((item) => item.link === location);

  return route ? route.label : '';
}
