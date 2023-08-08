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
  { id: "question", label: "Question", alignRight: false },
  { id: "action", label: "Actions", alignRight: true },
];

// ----------------------------------------------------------------------

export default function FAQ() {
  const [openForm, setOpenForm] = useState(false);
  const isEditMode = typeof openForm == "object";
  const { faqsApi } = useAuth();
  const { data, isLoading, onCreate, onUpdate, onDelete, isSubmitting } =
    faqsApi;

  const onEdit = (item) => {
    setOpenForm(item);
  };

  return (
    <Page title="FAQ">
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            FAQ
          </Typography>
          <Button
            onClick={() => setOpenForm(true)}
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            Add FAQ
          </Button>
        </Stack>
        <Card>
          <CommonTable
            loading={isLoading}
            tableTitle="FAQ"
            tableHead={TABLE_HEAD}
            list={data || []}
            RowItem={(params) => (
              <RowItem {...params} onEdit={onEdit} onDelete={onDelete} />
            )}
          />
        </Card>
        {openForm && (
          <Form
            mode={isEditMode ? "UPDATE" : "CREATE"}
            isSubmitting={isSubmitting}
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
  const { id, question, answer } = row;

  return (
    <TableRow hover key={id}>
      <TableCell align="left">{question}</TableCell>
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
      question: vals.question || "",
      answer: vals.answer || "",
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
        question: openForm.question || "",
        answer: openForm.answer || "",
      };
    }
    return {
      question: "",
      answer: "",
    };
  }, [openForm]);

  const formSchema = useMemo(() => {
    return Yup.object().shape({
      question: Yup.string().required("Question is required!"),
      answer: Yup.string().required("Answer is required!"),
    });
  }, []);

  const methods = useForm({
    resolver: yupResolver(formSchema),
    defaultValues,
  });

  return (
    <FormSidebar
      formTitle={mode === "UPDATE" ? "Update FAQ" : "Create FAQ"}
      isOpenSidebar={openForm}
      onCloseSidebar={() => setOpenForm(false)}
      methods={methods}
      onSubmit={onSubmit}
      onDelete={onDelete}
      isSubmitting={isSubmitting}
    >
      <RHFTextField name="question" label="Question" multiline maxRows={3} />
      <RHFTextField name="answer" label="Answer" multiline maxRows={8} />
    </FormSidebar>
  );
};
