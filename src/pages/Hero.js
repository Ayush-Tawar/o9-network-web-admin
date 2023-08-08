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

export default function Hero() {
  const { cardsApi } = useAuth();
  const { titleCard, isLoading, submitTitleSection, isSubmittingTitle } =
    cardsApi;

  const defaultValues = {
    title: titleCard?.title,
    subTitle: titleCard?.subTitle,
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
            Hero Title
          </Typography>
        </Stack>

        {isLoading ? (
          <CommonSpinner />
        ) : (
          <Card sx={{ p: 5 }}>
            <Form
              defaultValues={defaultValues}
              onSubmit={submitTitleSection}
              isSubmitting={isSubmittingTitle}
            />
          </Card>
        )}
      </Container>
    </Page>
  );
}

const Form = ({ onSubmit, defaultValues, isSubmitting }) => {
  const schema = Yup.object().shape({
    title: Yup.string().required("Heading is required"),
    subTitle: Yup.string().required("Description is required"),
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
          <RHFTextField name="title" label="Heading" />
          <RHFTextField name="subTitle" label="Description" />
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
