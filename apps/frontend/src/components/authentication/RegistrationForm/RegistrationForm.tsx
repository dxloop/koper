import {
  Title,
  Blockquote,
  Stack,
  TextInput,
  PasswordInput,
  Button,
  Checkbox,
} from '@mantine/core';
import { IconAt, IconLock, IconUserShare } from '@tabler/icons-react';
import type { AuthenticationFormProps } from '../Authentication/AuthenticationTypes';
import classes from './RegistrationForm.module.css';

/**
 * RegistrationForm component for user sign up.
 * @param errorMessage - Error message to display if any.
 * @param form - Form object containing input values, errors, and validation functions.
 * @param handleAuthentication - Function to handle authentication on form submission.
 * @param toggle - Function to toggle between login and registration forms.
 * @param submitComponent - Component to display on form submission.
 * @returns JSX element containing the registration form.
 */
export function RegistrationForm({
  errorMessage,
  form,
  handleAuthentication,
  submitComponent,
}: AuthenticationFormProps) {
  return (
    <>
      <Title order={3} mb="xs">
        SignUp
      </Title>
      {errorMessage && (
        <Blockquote my="xs" p="xs" radius="md" color="red">
          {errorMessage}
        </Blockquote>
      )}
      <form className={classes.form} onSubmit={form.onSubmit(() => handleAuthentication())}>
        <Stack gap={0}>
          <TextInput
            label="Display Name"
            placeholder="John Doe"
            className={classes.textInput}
            radius="md"
            leftSection={<IconUserShare size={18} />}
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
          <PasswordInput
            required
            label="Confirm Password"
            placeholder="Confirm your password"
            className={classes.textInput}
            radius="md"
            leftSection={<IconLock size={18} />}
            error={
              form.errors.password !== form.errors.passwordConfirmation && 'Password does not match'
            }
            {...form.getInputProps('passwordConfirmation')}
          />
          <Checkbox
            mt="md"
            label="I accept terms and conditions"
            checked={form.values.terms}
            {...form.getInputProps('terms')}
          />
        </Stack>
        <Stack align="start" justify="space-between" mt="xs" pb={0} gap="xs">
          {submitComponent}
        </Stack>
      </form>
    </>
  );
}
