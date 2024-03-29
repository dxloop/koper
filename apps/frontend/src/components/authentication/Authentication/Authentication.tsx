import { Button, Paper, PaperProps } from '@mantine/core';
import { useForm } from '@mantine/form';
import { ServiceError, useLoginUser } from "openapi";

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { LoginForm } from '../LoginForm/LoginForm';
import classes from './Authentication.module.css';
import { setJWT } from '@/services/util/Auth';
import { QueryClient } from '@/services/QueryClient';

/**
 * The Authentication component renders the login and registration forms.
 * @param props - Props for the Authentication component.
 * @returns The Authentication component.
 */
export function AuthenticationForm(props: PaperProps) {
   // Use Login Mutation hook
   const useLogin =  useLoginUser();

   // Navigation
   const nav = useNavigate();

   // Error Message
   const [errorMessage, setErrorMessage] = useState<string | null>(null);

   const form = useForm({
      initialValues: {
         email: '',
         password: '',
      },

      validate: {
         email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
         password: (val) =>
            /^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/.test(
               val,
            )
               ? null
               : 'Password should contain upper, lowercase, number & special character',
      },
   });

   /**
    * Handles authentication for the user based on the type of form (on submit)
    * @returns void
    */
   const handleAuthentication = async () => {
      if (!form.isValid()) return;
      setErrorMessage(null);

      useLogin.mutateAsync({email: form.values.email, password: form.values.password}).then((res) => {
         if (res) {
            setJWT(res.token);
            QueryClient().refetchQueries(); // Refetch queries, since user changed
            nav('/');
         }
      }).catch((err: ServiceError) => {
         setErrorMessage(err.message ?? 'Something went wrong');
      });
   };

   const submitComponent = (
      <>
         <Button
           aria-label="submit form"
           type="submit"
           radius="md"
           fullWidth
         >
            Login
         </Button>
      </>
   );

   const paddingTop = 'xl';

   return (
      <Paper className={classes.body} radius="md" p="xl" pt={paddingTop} withBorder {...props}>
            <LoginForm
              errorMessage={errorMessage}
              form={form}
              handleAuthentication={handleAuthentication}
              submitComponent={submitComponent}
            />
      </Paper>
   );
}
