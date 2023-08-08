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
import Iconify from "src/components/Iconify";
import { useEffect, useMemo, useState } from "react";
import FormSidebar from "src/layouts/dashboard/FormSidebar";
import { useForm } from "react-hook-form";
import { RHFTextField } from "src/components/hook-form";
import { useAuth } from "src/utils/AuthContext";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "type", label: "Type", alignRight: false },
  { id: "value", label: "Value", alignRight: false },
  { id: null, label: null, alignRight: true },
];

// ----------------------------------------------------------------------

export default function SocialMedia() {
  const [openForm, setOpenForm] = useState(false);
  const isEditMode = typeof openForm == "object";
  const { socialLinksApi } = useAuth();
  const { data, isLoading, onUpdate, isSubmitting } = socialLinksApi;

  const onEdit = (item) => {
    setOpenForm(item);
  };

  return (
    <Page title="Social Media">
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Social Media
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
  const { id, type, value } = row;

  return (
    <TableRow hover key={id}>
      <TableCell align="left">{type}</TableCell>
      <TableCell align="left">{value}</TableCell>
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
      type: vals.type || "",
      value: vals.value || "",
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
        type: openForm.type || "",
        value: openForm.value || "",
      };
    }
    return {
      type: "",
      value: "",
    };
  }, [openForm]);

  const formSchema = useMemo(() => {
    return Yup.object().shape({
      type: Yup.string().required("Type is required!"),
      value: Yup.string(),
    });
  }, []);

  const methods = useForm({
    resolver: yupResolver(formSchema),
    defaultValues,
  });

  const onClear = () => {
    methods.setValue("value", "");
  };

  return (
    <FormSidebar
      onClear={onClear}
      formTitle={mode === "UPDATE" ? "Update" : "Create"}
      isOpenSidebar={openForm}
      onCloseSidebar={() => setOpenForm(false)}
      methods={methods}
      onSubmit={onSubmit}
      onDelete={onDelete}
      isSubmitting={isSubmitting}
    >
      <RHFTextField name="type" label="Type" multiline maxRows={3} disabled />
      <RHFTextField name="value" label="Value" multiline maxRows={8} />
    </FormSidebar>
  );
};
