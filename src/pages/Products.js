// material
import {
  Card,
  Stack,
  Container,
  Typography,
  Box,
  Grid,
  Button,
  TableRow,
  TableCell,
} from "@mui/material";
// components
import Page from "../components/Page";
import { FormProvider, RHFTextField } from "src/components/hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFieldArray, useForm } from "react-hook-form";
import { useAuth } from "src/utils/AuthContext";
import _ from "lodash";
import { useMemo, useState } from "react";
import Label from "src/components/Label";
import Iconify from "src/components/Iconify";
import CommonTable from "src/components/CommonTable";
import MoreMenu from "src/components/CommonTable/MoreMenu";
import FormSidebar from "src/layouts/dashboard/FormSidebar";

const TABLE_HEAD = [
  { id: "title", label: "Title", alignRight: false },
  { id: "subTitle", label: "Description", alignRight: false },
  { id: null, label: "Actions", alignRight: true },
];

export default function Products() {
  const [openForm, setOpenForm] = useState(false);
  const isEditMode = typeof openForm == "object";
  const { cardsApi } = useAuth();
  const {
    isLoading,
    products,
    onUpdate,
    onCreate,
    onDelete,
    isSubmittingProducts,
  } = cardsApi;

  const onEdit = (item) => {
    setOpenForm(item);
  };

  return (
    <Page title="Products">
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Product
          </Typography>
          <Button
            onClick={() => setOpenForm(true)}
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            Add Product
          </Button>
        </Stack>
        <Card>
          <CommonTable
            loading={isLoading}
            tableTitle="FAQ"
            tableHead={TABLE_HEAD}
            list={products || []}
            RowItem={(params) => (
              <RowItem {...params} onEdit={onEdit} onDelete={onDelete} />
            )}
          />
        </Card>
        {openForm && (
          <Form
            mode={isEditMode ? "UPDATE" : "CREATE"}
            isSubmitting={isSubmittingProducts}
            openForm={openForm}
            setOpenForm={setOpenForm}
            onUpdate={onUpdate}
            onCreate={onCreate}
          />
        )}
      </Container>
    </Page>
  );
}

const RowItem = ({ row, onEdit, onDelete }) => {
  const { id, title, subTitle } = row;

  return (
    <TableRow hover key={id}>
      <TableCell align="left">{title}</TableCell>
      <TableCell align="left">{subTitle}</TableCell>
      <TableCell align="right">
        <MoreMenu onEdit={() => onEdit(row)} onDelete={() => onDelete(id)} />
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
      title: vals.title || "",
      subTitle: vals.subTitle || "",
      type: "sub",
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
        title: openForm.title || "",
        subTitle: openForm.subTitle || "",
      };
    }
    return {
      title: "",
      subTitle: "",
    };
  }, [openForm]);

  const formSchema = Yup.object().shape({
    title: Yup.string().required("Product name is required"),
    subTitle: Yup.string().required("Product description is required"),
  });

  const methods = useForm({
    resolver: yupResolver(formSchema),
    defaultValues,
  });

  return (
    <FormSidebar
      formTitle={mode === "UPDATE" ? "Update Product" : "Create Product"}
      isOpenSidebar={openForm}
      onCloseSidebar={() => setOpenForm(false)}
      methods={methods}
      onSubmit={onSubmit}
      onDelete={onDelete}
      isSubmitting={isSubmitting}
    >
      <RHFTextField name="title" label="Product Name" multiline maxRows={3} />
      <RHFTextField
        name="subTitle"
        label="Product Description"
        multiline
        rows={10}
        maxRows={16}
      />
    </FormSidebar>
  );
};
