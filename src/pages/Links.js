// material
import { Card, Stack, Container, Typography, Box } from "@mui/material";
// components
import Page from "../components/Page";
import { FormProvider, RHFTextField } from "src/components/hook-form";
import { LoadingButton } from "@mui/lab";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useAuth } from "src/utils/AuthContext";
import CommonSpinner from "src/components/CommonSpinner";

export default function Links() {
  const { cmsApi } = useAuth();
  const { data, isLoading, isSubmitting, onUpdateLink } = cmsApi;

  const loginLinkData = data?.find((d) => d.title === "Login Redirect Link");
  const signUpLinkData = data?.find((d) => d.title === "Signup Redirect Link");

  const defaultValues = {
    loginLink: loginLinkData?.content,
    signUpLinkData: signUpLinkData?.content,
  };

  const preSubmit = (data) => {
    onUpdateLink([
      { ...loginLinkData, content: data.loginLink },
      { ...signUpLinkData, content: data.signUpLinkData },
    ]);
  };

  return (
    <Page title="Hero">
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Links
          </Typography>
        </Stack>

        {isLoading ? (
          <CommonSpinner />
        ) : (
          <Card sx={{ p: 5 }}>
            <Form
              defaultValues={defaultValues}
              onSubmit={preSubmit}
              isSubmitting={isSubmitting}
            />
          </Card>
        )}
      </Container>
    </Page>
  );
}

const Form = ({ onSubmit, defaultValues, isSubmitting }) => {
  const schema = Yup.object().shape({
    loginLink: Yup.string().required("Login Redirect Link is required"),
    signUpLinkData: Yup.string().required("Signup Redirect Link is required"),
  });

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });
  const { handleSubmit } = methods;

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Box maxWidth={500}>
        <Stack spacing={3}>
          <RHFTextField name="loginLink" label="Login Redirect Link" />
          <RHFTextField name="signUpLinkData" label="Signup Redirect Link" />
          <Stack direction="row" sx={{ mt: 4 }} justifyContent="start">
            <LoadingButton
              size="large"
              variant="contained"
              color="primary"
              type="submit"
              loading={isSubmitting}
            >
              Save
            </LoadingButton>
          </Stack>
        </Stack>
      </Box>
    </FormProvider>
  );
};
