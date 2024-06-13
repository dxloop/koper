import { Button, Group, List, Modal, rem } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useDeleteSelfUser } from 'openapi';
import { removeJWT } from '@/services/util/Auth';

/**
 * Required props for the DeleteAccountModal component
 */
export interface DeleteAccountTypes {
    /**
     * The id of the user to delete
     */
    userId: string;
    /**
     * Whether the modal is opened
     */
    opened: boolean;
    /**
     * The function to call when the modal should be closed
     */
    close: () => void;
}

/**
 * DeleteAccountModal component displays a modal for deleting an account.
 * @param props - The props for the DeleteAccountModal component
 * @returns The DeleteAccountModal component
 */
export function DeleteAccountModal({ opened, close, userId }: DeleteAccountTypes) {
    const crossIcon = <IconX style={{ width: rem(20), height: rem(20) }} />;
    const checkIcon = <IconCheck style={{ width: rem(20), height: rem(20) }} />;

    const nav = useNavigate();
    const queryClient = useQueryClient();


    const onDelete = async () => {
        // @Todo: Implement delete account mutation
        //useDeleteSelfUser();
        notifications.show({
            title: 'Deleted Account',
            message:
                'Your account has been scheduled for deletion. You will receive an email shortly.',
            color: 'green',
            icon: checkIcon,
        });
        queryClient.clear();
        removeJWT();
        nav('/login');
        close();
        /*   .catch((err: ServiceError) => {
             notifications.show({
                title: 'Could not delete account',
                message:
                   err.details ?? err.message ?? 'Something went wrong while deleting your account',
                color: 'red',
                icon: crossIcon,
             });
          }); */
    };

    return (
        <Modal size="auto" opened={opened} onClose={close} title="Delete Account?">
            <Group px="md" w="100%">
                <List size="sm" aria-label="action warnings" style={{ wordBreak: 'break-word' }}>
                    <List.Item>Deletes all todos your account is connected to</List.Item>
                    <List.Item style={{ wordBreak: 'break-word' }}>
                        Confirmation is sent via email and delete will be scheduled in 14 days
                    </List.Item>
                    <List.Item>
                        Action is irreversible and you will not be able to recover your account
                    </List.Item>
                </List>
                <Group gap="xs" w="100%" grow>
                    <Button
                        aria-label="cancel delete"
                        variant="light"
                        onClick={close}
                    >
                        Cancel
                    </Button>
                    <Button
                        aria-label="delete account"
                        color="red"
                        onClick={onDelete}
                    >
                        Delete Account
                    </Button>
                </Group>
            </Group>
        </Modal>
    );
}