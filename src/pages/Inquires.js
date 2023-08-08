import {
  Card,
  Stack,
  Container,
  Typography,
  TableRow,
  TableCell,
  Drawer,
  Box,
  IconButton,
} from "@mui/material";
// components
import Page from "../components/Page";
import CommonTable from "src/components/CommonTable";
import Iconify from "src/components/Iconify";
import { useState } from "react";
import { useAuth } from "src/utils/AuthContext";
import Scrollbar from "src/components/Scrollbar";
import { getFormattedDate } from "src/utils/commons";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "fName", label: "First Name", alignRight: false },
  { id: "lName", label: "Last Name", alignRight: false },
  { id: "contact", label: "Contact", alignRight: false },
  { id: "email", label: "Email", alignRight: false },
  { id: "createdAt", label: "Date Created", alignRight: true },
  // { id: "areYou", label: "Type", alignRight: false },
  // { id: "company", label: "Company", alignRight: false },
  // { id: "message", label: "Message", alignRight: false },
  // { id: "geosInterested", label: "Geo Interested", alignRight: false },
  // { id: "productsInterested", label: "Interested In", alignRight: false },
  // { id: "trafficTypes", label: "Traffic Types", alignRight: false },
];

// ----------------------------------------------------------------------

const FIELD_LABEL_MAP = {
  createdAt: "Date",
  fName: "First Name",
  lName: "Last Name",
  contact: "Contact Name",
  email: "Email",
  areYou: "You are a",
  company: "Company",
  geosInterested: "Geo Interest",
  productsInterested: "Product Interest",
  trafficTypes: "Traffic Type",
  message: "Message",
};

export default function Inquiries() {
  const [openForm, setOpenForm] = useState(false);
  const isEditMode = typeof openForm == "object";
  const { inquiriesApi } = useAuth();
  const { data, isLoading } = inquiriesApi;

  const onEdit = (item) => {
    setOpenForm(item);
  };

  return (
    <Page title="Inquires">
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Typography variant="h4" gutterBottom>
            Inquires
          </Typography>
        </Stack>
        <Card>
          <CommonTable
            loading={isLoading}
            tableTitle="Inquires"
            tableHead={TABLE_HEAD}
            list={data || []}
            RowItem={(params) => <RowItem {...params} onEdit={onEdit} />}
          />
        </Card>
        {openForm && (
          <Form
            mode={isEditMode ? "UPDATE" : "CREATE"}
            openForm={openForm}
            setOpenForm={setOpenForm}
          />
        )}
      </Container>
    </Page>
  );
}

const RowItem = ({ row, onEdit, onDelete }) => {
  const {
    id,
    createdAt,
    fName,
    lName,
    email,
    areYou,
    company,
    contact,
    message,
    geosInterested,
    productsInterested,
    trafficTypes,
  } = row;

  return (
    <TableRow
      hover
      key={id}
      style={{ cursor: "pointer" }}
      onClick={() => onEdit(row)}
    >
      <TableCell align="left">{fName}</TableCell>
      <TableCell align="left">{lName}</TableCell>
      <TableCell align="left">{email}</TableCell>
      <TableCell align="left">{contact}</TableCell>
      <TableCell align="right">{getFormattedDate(createdAt)}</TableCell>
      {/* <TableCell align="left">{areYou}</TableCell>
      <TableCell align="left">{company}</TableCell>
      <TableCell align="left">{message}</TableCell>
      <TableCell align="left">{geosInterested}</TableCell>
      <TableCell align="left">{productsInterested}</TableCell>
      <TableCell align="left">{trafficTypes}</TableCell> */}
    </TableRow>
  );
};

const Form = (props) => {
  const { openForm, setOpenForm } = props;

  return (
    <Drawer
      anchor="right"
      open={openForm}
      onCloseSidebar={() => setOpenForm(false)}
      PaperProps={{
        sx: { width: 500 },
      }}
    >
      <Scrollbar
        sx={{
          height: 1,
          "& .simplebar-content": {
            height: 1,
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <Box sx={{ mb: 5, mx: 4 }}>
          <Stack direction="row" sx={{ mt: 4, mb: 5 }} alignItems="start">
            <Typography variant="h3" flex={1}>
              Inquiry Details
            </Typography>
            <IconButton onClick={() => setOpenForm(false)}>
              <Iconify icon="codicon:chrome-close" width={30} height={30} />
            </IconButton>
          </Stack>
          <Stack spacing={2}>
            {Object.keys(FIELD_LABEL_MAP).map((fieldKey) => {
              return (
                <Stack key={fieldKey}>
                  <Typography variant="caption">
                    {FIELD_LABEL_MAP[fieldKey]}
                  </Typography>
                  <Typography>
                    {fieldKey === "createdAt"
                      ? getFormattedDate(openForm[fieldKey])
                      : openForm[fieldKey]}
                  </Typography>
                </Stack>
              );
            })}
          </Stack>
        </Box>
      </Scrollbar>
    </Drawer>
  );
};
