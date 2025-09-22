import { AppShell } from '@mantine/core';
import { ReactNode } from 'react';

import classes from './Background.module.css';

/**
 * The Background component, which is used for other pages outside of the dashboard.
 * @param param - The children of the Background component.
 * @returns The background of the application.
 */
export function Background({ children }: { children: ReactNode }) {
  return (
    <AppShell padding={{ base: 0, md: 'md', lg: 'md' }}>
      <AppShell.Main className={classes.body}>{children}</AppShell.Main>
    </AppShell>
  );
}
