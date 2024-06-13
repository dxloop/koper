import { Anchor, Button, Group, InputLabel, Paper, PasswordInput, Stack, Text, TextInput, rem } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { IconAt, IconCheck, IconLock, IconUser, IconUserShare, IconX } from '@tabler/icons-react';
import { useContext, useEffect } from 'react';
import { ServiceError, User, useUpdateSelfUser } from 'openapi';
import { UserContext } from '../../../context/UserContext';
import { DeleteAccountModal } from '../DeleteAccountModal/DeleteAccountModal';
import classes from './UserSettings.module.css';

/**
 * UserSettings component displays a form for user settings.
 * @returns  A JSX element that displays a user settings form.
 */
export function UserSettings() {
    const crossIcon = <IconX style={{ width: rem(20), height: rem(20) }} />;
    const checkIcon = <IconCheck style={{ width: rem(20), height: rem(20) }} />;

    // Open and close delete account modal
    const [opened, { open, close }] = useDisclosure(false);

    const { user, updateUser } = useContext(UserContext);

    const userMutation = useUpdateSelfUser();
    // The form which contains all settable user settings
    const form = useForm({
        initialValues: {
            email:user.email,
            password: '',
            name: user.name,
        },

        validate: {
            email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
            password: (val) =>
                /^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/.test(
                    val,
                ) ? null
                    : 'Password should contain upper, lowercase, number & special character',
            name: (val) =>
                val.length <= 2
                    ? 'Display name should be at least 2 characters long'
                    : null,
        },
    });


    const setInitialValuesForm = (newUser: User) => {
        form.setInitialValues({
            email: newUser.email,
            name: newUser.name,
            password: '',
        });
    };

    // Update form values if user values (from context) changes
    useEffect(() => {
        setInitialValuesForm(user);
        form.resetDirty();
    }, [user]);

    // Execute the rest request to update the user settings and shown a notification
    const onSubmit = async () => {
        if (!form.isValid()) return;

        await userMutation
            .mutateAsync({...form.values, id: user.id!})
            .then((res) => {
                updateUser({ ...user, ...res });
                setInitialValuesForm({ ...user, ...res });
                form.reset();
                notifications.show({
                    title: 'User settings updated',
                    message: 'Your user settings have been updated',
                    color: 'green',
                    icon: checkIcon,
                });
            })
            .catch((err: ServiceError) => {
                notifications.show({
                    title: 'User settings update failed',
                    message: err.details ?? err.message ?? 'Something went wrong',
                    color: 'red',
                    icon: crossIcon,
                });
            });
    };

    return (
        <>
            <DeleteAccountModal opened={opened} close={close} userId={user.id!} />
            <Paper className={classes.body} radius="md" withBorder>
                <Text size="xl" mb="xs">
                    User Settings
                </Text>
                <form className={classes.form} onSubmit={form.onSubmit(() => onSubmit())}>
                    <Group gap="xs">
                        <TextInput
                            required
                            label="Name"
                            placeholder="Your user name"
                            className={classes.textInput}
                            radius="md"
                            leftSection={<IconUser size={18} />}
                            {...form.getInputProps('name')}
                        />
                        <TextInput
                            required
                            label="Email"
                            placeholder="test@example.com"
                            className={classes.textInput}
                            radius="md"
                            leftSection={<IconAt size={18} />}
                            {...form.getInputProps('email')}
                        />
                        <PasswordInput
                            required
                            label="Password"
                            placeholder="Your password"
                            className={classes.textInput}
                            radius="md"
                            leftSection={<IconLock size={18} />}
                            {...form.getInputProps('password')}
                        />
                    </Group>
                    <Group className={classes.buttonRow} justify="right" pb="xs" gap="xs">
                        <Anchor
                            className={classes.deleteAccount}
                            component="button"
                            type="button"
                            onClick={open}
                        >
                            Delete Account?
                        </Anchor>
                        <Button
                            aria-label="reset form"
                            variant="light"
                            color="red"
                            radius="md"
                            className={classes.actionButton}
                            onClick={() => form.reset()}
                            disabled={!form.isDirty()}
                        >
                            Reset
                        </Button>
                        <Button
                            aria-label="submit form"
                            type="submit"
                            radius="md"
                            className={classes.actionButton}
                            disabled={!form.isDirty()}
                            loading={userMutation.isPending}
                        >
                            Save
                        </Button>
                    </Group>
                </form>
            </Paper>
        </>
    );
}