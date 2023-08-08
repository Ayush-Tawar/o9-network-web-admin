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
import { useEffect, useState } from "react";

export default function Section({ type }) {
  const { sectionApi } = useAuth();
  const { isLoading, sectionList, submitSection, isSubmittingSection } =
    sectionApi;

  const [reload, setReload] = useState(false);

  useEffect(() => {
    setReload(true);
    setTimeout(() => setReload(false), 50);
  }, [type]);
  if (reload) return <></>;

  const defaultValues =
    sectionList.find((s) =>
      s.name.toLowerCase().includes(type.toLowerCase()),
    ) ?? {};

  return (
    <Page title={type}>
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            {type}
          </Typography>
        </Stack>

        {isLoading ? (
          <CommonSpinner />
        ) : (
          <Card sx={{ p: 5 }}>
            <Form
              defaultValues={defaultValues}
              onUpdate={submitSection}
              isSubmitting={isSubmittingSection}
            />
          </Card>
        )}
      </Container>
    </Page>
  );
}

const Form = ({ onUpdate, defaultValues, isSubmitting }) => {
  const schema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    subDescription: Yup.string().required("Sub Description is required"),
  });

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });
  const { handleSubmit } = methods;
  const onSubmit = async (vals) => {
    let params = {
      ...vals,
      id: defaultValues.id,
    };
    onUpdate(params);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Box maxWidth={500}>
        <Stack spacing={3}>
          <RHFTextField name="title" label="Title" />
          <RHFTextField
            multiline
            maxRows={8}
            name="description"
            label="Subtitle"
          />
          <RHFTextField
            multiline
            maxRows={8}
            name="subDescription"
            label="Sub Description"
          />
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
