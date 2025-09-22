import { Anchor, Button, Paper, PaperProps } from '@mantine/core';
import { useForm } from '@mantine/form';
import { ServiceError, useLoginUser, useRegisterUser } from 'openapi';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { upperFirst, useToggle } from '@mantine/hooks';
import { LoginForm } from '../LoginForm/LoginForm';
import classes from './Authentication.module.css';
import { setJWT } from '@/services/util/Auth';
import { QueryClient } from '@/services/QueryClient';
import { RegistrationForm } from '../RegistrationForm/RegistrationForm';

/**
 * The Authentication component renders the login and registration forms.
 * @param props - Props for the Authentication component.
 * @returns The Authentication component.
 */
export function AuthenticationForm(props: PaperProps) {
  const [type, toggle] = useToggle(['login', 'register']);

  // Use Login Mutation hook
  const useLogin = useLoginUser();
  const useRegister = useRegisterUser();

  // Navigation
  const nav = useNavigate();

  // Error Message
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      passwordConfirmation: '',
      name: '',
      terms: false,
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) =>
        /^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/.test(
          val
        ) || type === 'login'
          ? null
          : 'Password should contain upper, lowercase, number & special character',
      terms: (val) =>
        val === false && type === 'register' ? 'You have to agree to terms and conditions' : null,
      name: (val) =>
        val.length <= 2 && type === 'register'
          ? 'Display name should be at least 2 characters long'
          : null,
    },
  });

  /**
   * Handles authentication for the user based on the type of form (on submit)
   * @returns void
   */
  const handleAuthentication = async () => {
    if (!form.isValid()) return;
    setErrorMessage(null);

    if (type === 'login') {
      useLogin
        .mutateAsync({ email: form.values.email, password: form.values.password })
        .then((res) => {
          if (res) {
            setJWT(res.token);
            QueryClient().refetchQueries(); // Refetch queries, since user changed
            nav('/');
          }
        })
        .catch((err: ServiceError) => {
          setErrorMessage(err.message ?? 'Something went wrong');
        });
    } else {
      // Check if password and confirm password match
      if (form.values.password !== form.values.passwordConfirmation) {
        setErrorMessage('Passwords do not match');
        return;
      }

      await useRegister
        .mutateAsync({ ...form.values })
        .then((res) => {
          setJWT(res.token);
          QueryClient().refetchQueries(); // Refetch queries, since user changed
          nav('/');
        })
        .catch((err: ServiceError) => {
          setErrorMessage(err.message ?? 'Something went wrong');
        });
    }
  };

  const submitComponent = (
    <>
      <Anchor component="button" type="button" c="dimmed" onClick={() => toggle()} size="xs">
        {type === 'register' ? 'Already have an account? Login' : "Don't have an account? Register"}
      </Anchor>
      <Button
        aria-label="submit form"
        type="submit"
        radius="md"
        fullWidth
        loading={useLogin.isPending || useRegister.isPending}
        disabled={useLogin.isPending || useRegister.isPending}
      >
        {upperFirst(type)}
      </Button>
    </>
  );

  const paddingTop = 'xl';

  return (
    <Paper className={classes.body} radius="md" p="xl" pt={paddingTop} withBorder {...props}>
      {type === 'login' && (
        <LoginForm
          errorMessage={errorMessage}
          form={form}
          handleAuthentication={handleAuthentication}
          submitComponent={submitComponent}
        />
      )}
      {type === 'register' && (
        <RegistrationForm
          errorMessage={errorMessage}
          form={form}
          handleAuthentication={handleAuthentication}
          submitComponent={submitComponent}
        />
      )}
    </Paper>
  );
}
