import { forwardRef } from 'react';
import { UnstyledButton, Group, Avatar, Text } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import classes from './LoggedInUser.module.css';

/**
 * Required props for the UserButton component
 */
interface UserButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  /**
   * The display name of the user
   */
  name: string;
  /**
   * The email of the user
   */
  email: string;
  /**
   * The icon for the component displayed on the right
   */
  icon?: React.ReactNode;
}

/**
 * The User Button component, which uses an ref to forward the button element
 * @param props - The props for the User Button component
 * @returns The User Button component ref
 */
export const LoggedInUser = forwardRef<HTMLButtonElement, UserButtonProps>(
  ({ name, email, icon, ...others }: UserButtonProps, ref) => (
    <UnstyledButton ref={ref} {...others} className={classes.user}>
      <Group>
        <Avatar size={32} radius="xl" />
        <div style={{ flex: 1 }}>
          <Text size="sm" fw={500}>
            {name}
          </Text>

          <Text c="dimmed" size="xs">
            {email}
          </Text>
        </div>

        {icon || <IconChevronRight size="1rem" />}
      </Group>
    </UnstyledButton>
  )
);