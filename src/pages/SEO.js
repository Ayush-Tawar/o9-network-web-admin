/* eslint-disable no-unreachable */
// import { useMemo, useState } from "react";
// material
import {
  Card,
  Stack,
  Button,
  Container,
  Typography,
  TableRow,
  TableCell,
} from "@mui/material";
// import * as Yup from "yup";
// components
import Page from "../components/Page";
// import Iconify from "../components/Iconify";
import CommonTable from "src/components/CommonTable";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import MoreMenu from "src/components/CommonTable/MoreMenu";
import { useMemo, useState } from "react";
import FormSidebar from "src/layouts/dashboard/FormSidebar";
import { useForm } from "react-hook-form";
import { RHFTextField } from "src/components/hook-form";
import { useAuth } from "src/utils/AuthContext";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "page", label: "Page", alignRight: false },
  { id: null, label: null, alignRight: true },
];

// ----------------------------------------------------------------------

export default function SEO() {
  const [openForm, setOpenForm] = useState(false);
  const isEditMode = typeof openForm == "object";
  const { seoApi } = useAuth();
  const { data, isLoading, onUpdate, isSubmitting } = seoApi;

  const onEdit = (item) => {
    setOpenForm(item);
  };

  return (
    <Page title="SEO">
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            SEO
          </Typography>
        </Stack>
        <Card>
          <CommonTable
            loading={isLoading}
            tableTitle="FAQ"
            tableHead={TABLE_HEAD}
            list={data || []}
            RowItem={(params) => <RowItem {...params} onEdit={onEdit} />}
          />
        </Card>
        {openForm && (
          <Form
            mode={isEditMode ? "UPDATE" : "CREATE"}
            isSubmitting={isSubmitting}
            openForm={openForm}
            setOpenForm={setOpenForm}
            onUpdate={onUpdate}
          />
        )}
      </Container>
    </Page>
  );
}

const RowItem = ({ row, onEdit }) => {
  const { id, page } = row;

  return (
    <TableRow hover key={id}>
      <TableCell align="left">{page}</TableCell>
      <TableCell align="right">
        <MoreMenu onEdit={() => onEdit(row)} />
      </TableCell>
    </TableRow>
  );
};

const Form = (props) => {
  const {
    openForm,
    setOpenForm,
    isSubmitting,
    mode,
    onUpdate,
    onCreate,
    onDelete,
  } = props;

  const onSubmit = async (vals) => {
    let params = {
      page: vals.page || "",
      pageTitle: vals.pageTitle || "",
      seoTitle: vals.seoTitle || "",
      seoDescription: vals.seoDescription || "",
    };
    if (mode == "CREATE") {
      onCreate(params);
    }
    if (mode == "UPDATE") {
      onUpdate({
        ...params,
        id: openForm.id,
      });
    }
    setOpenForm(false);
  };

  let defaultValues = useMemo(() => {
    if (mode === "UPDATE") {
      return {
        page: openForm.page || "",
        pageTitle: openForm.pageTitle || "",
        seoTitle: openForm.seoTitle || "",
        seoDescription: openForm.seoDescription || "",
      };
    }
    return {
      page: "",
      pageTitle: "",
      seoTitle: "",
      seoDescription: "",
    };
  }, [openForm]);

  const formSchema = useMemo(() => {
    return Yup.object().shape({
      page: Yup.string().required("Page is required!"),
      pageTitle: Yup.string().required("Page Title is required!"),
      seoTitle: Yup.string().required("SEO Title is required!"),
      seoDescription: Yup.string().required("SEO Description is required!"),
    });
  }, []);

  const methods = useForm({
    resolver: yupResolver(formSchema),
    defaultValues,
  });

  return (
    <FormSidebar
      formTitle={`Update SEO`}
      isOpenSidebar={openForm}
      onCloseSidebar={() => setOpenForm(false)}
      methods={methods}
      onSubmit={onSubmit}
      onDelete={onDelete}
      isSubmitting={isSubmitting}
    >
      <Typography variant="h5">{openForm.page}</Typography>
      <RHFTextField name="pageTitle" label="Page Title" multiline maxRows={3} />
      <RHFTextField name="seoTitle" label="SEO Title" multiline maxRows={8} />
      <RHFTextField
        name="seoDescription"
        label="SEO Description"
        multiline
        maxRows={8}
      />
    </FormSidebar>
  );
};
