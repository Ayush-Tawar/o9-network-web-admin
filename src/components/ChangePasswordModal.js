import { LoadingButton } from "@mui/lab";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  Stack,
} from "@mui/material";
import {
  createRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { FormProvider, RHFTextField } from "./hook-form";
import Iconify from "./Iconify";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { appsApi } from "src/api/api";
import { useAlert } from "src/hooks/useNotify";

export const changePasswordRef = createRef();

const formFileds = [
  {
    name: "oldPass",
    label: "Old Password",
  },
  {
    name: "newPass",
    label: "New Password",
  },
  {
    name: "confirmNewPass",
    label: "Confirm Password",
  },
];

const ChangePasswordModal = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false);
  const notify = useAlert();

  const [isLoading, setIsLoading] = useState(false);
  const [visibility, setVisibility] = useState({
    oldPass: false,
    newPass: false,
    confirmNewPass: false,
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useImperativeHandle(ref, () => ({
    show: handleOpen,
    hide: handleClose,
  }));

  const handleConfirm = () => {
    handleClose();
  };

  const FormSchema = Yup.object().shape({
    oldPass: Yup.string().required("Old password is required"),
    newPass: Yup.string()
      .required("New password is required")
      .min(6, "Password must be atleast 6 characters"),
    confirmNewPass: Yup.string()
      .required("Confirm password is required")
      .test(
        "match",
        "Confirm password does not match with new password",
        (v, context) => {
          if (context.parent.newPass === v) return true;
          return false;
        },
      ),
  });

  const defaultValues = {
    oldPass: "",
    newPass: "",
    confirmNewPass: "",
  };

  const methods = useForm({
    resolver: yupResolver(FormSchema),
    defaultValues,
  });
  const { handleSubmit, reset } = methods;

  const onSubmit = async (data) => {
    try {
      const params = { oldPassword: data.oldPass, newPassword: data.newPass };
      setIsLoading(true);

      const res = await appsApi.post("auth/change-password", params);
      if (res.status == 200) {
        notify.toastSuccess(res.data.message);
        handleClose();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!open) reset();
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{ sx: { p: 1, width: "460px", maxWidth: "90vw" } }}
      sx={{
        "& .MuiModal-backdrop": {
          background: "rgba(22,28,36,0.7)",
        },
      }}
    >
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Stack spacing={3} py={1}>
            {formFileds.map((f) => (
              <RHFTextField
                key={f.name}
                name={f.name}
                label={f.label}
                type={visibility[f.name] ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setVisibility((v) => {
                            return { ...v, [f.name]: !v[f.name] };
                          })
                        }
                      >
                        <Iconify
                          icon={
                            visibility[f.name]
                              ? "eva:eye-fill"
                              : "eva:eye-off-fill"
                          }
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            ))}
            <Stack
              direction="row"
              spacing={2}
              display="flex"
              justifyContent="end"
            >
              <LoadingButton
                size="large"
                variant="outlined"
                onClick={handleClose}
              >
                No
              </LoadingButton>
              <LoadingButton
                type="submit"
                size="large"
                variant="contained"
                loading={isLoading}
              >
                Yes
              </LoadingButton>
            </Stack>
          </Stack>
        </DialogContent>
      </FormProvider>
    </Dialog>
  );
});

ChangePasswordModal.displayName = "ChangePasswordModal";
export default ChangePasswordModal;
