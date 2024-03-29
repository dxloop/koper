import { Blockquote, Stack, TextInput, PasswordInput, Title } from '@mantine/core';
import { IconAt, IconLock } from '@tabler/icons-react';
import { AuthenticationFormProps } from '../Authentication/AuthenticationTypes';
import classes from './LoginForm.module.css';

/**
 * The LoginForm component renders a user authentication form.
 * @param errorMessage - Message to show in case of authentication failure.
 * @param form - Form object with email and password input fields.
 * @param handleAuthentication - Function to manage authentication on form submission.
 * @param submitComponent - Component to appear as the submit button.
 * @returns JSX element representing a login form.
 */
export function LoginForm(
    { errorMessage, form, handleAuthentication, submitComponent,
    }: AuthenticationFormProps) {
    return (
        <>
            <Title order={3} mb="xs">
                Welcome
            </Title>
            {
                errorMessage && <Blockquote my="xs" p="xs" radius="md" color="red">
                    {errorMessage}
                </Blockquote>
            }

            <form className={classes.form} onSubmit={form.onSubmit(() => handleAuthentication())}>
                <Stack gap={0}>
                    <TextInput
                        required
                        label="Email"
                        aria-label="Email"
                        placeholder="test@spendsmart.com"
                        className={classes.textInput}
                        radius="md"
                        leftSection={<IconAt size={18} />}
                        {...form.getInputProps('email')}
                    />

                    <PasswordInput
                        required
                        label="Password"
                        aria-label="Password"
                        placeholder="Your password"
                        className={classes.textInput}
                        radius="md"
                        leftSection={<IconLock size={18} />}
                        {...form.getInputProps('password')}
                    />
                </Stack>
                <Stack align="start" justify="space-between" mt="xs" pb="xl" gap="xs">
                    {submitComponent}
                </Stack>
            </form>
        </>
    );
}
