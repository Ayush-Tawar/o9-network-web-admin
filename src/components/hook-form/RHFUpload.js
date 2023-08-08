import PropTypes from "prop-types";
// form
import { useFormContext, Controller } from "react-hook-form";
// @mui
import { Box, Button, Chip, Stack, TextField, Typography } from "@mui/material";
import { useRef } from "react";
import { MEDIA_URL } from "src/utils/config";
import _ from "lodash";
import { useAlert } from "src/hooks/useNotify";

// ----------------------------------------------------------------------

RHFUpload.propTypes = {
  name: PropTypes.string,
};

export default function RHFUpload({
  name,
  buttonText,
  aspectRatio = 1,
  ...other
}) {
  const { control } = useFormContext();
  const fileInputRef = useRef();
  const notify = useAlert();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        if (_.isEmpty(field.value) && !(field.value instanceof File)) {
          return (
            <Stack>
              <Typography color="textSecondary" variant="caption" mb={0.5}>
                {`Required dimensions are 500 x ${Number(
                  500 / aspectRatio,
                ).toFixed(1)} or aspect ratio of ${aspectRatio}`}
              </Typography>
              <Button
                variant="outlined"
                onClick={() => fileInputRef.current.click()}
              >
                {buttonText || "Upload"}
              </Button>
              <Typography color="error" variant="caption">
                {fieldState?.error?.message || ""}
              </Typography>
              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                ref={fileInputRef}
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    const file = e.target.files[0];
                    if (file) {
                      var _URL = window.URL || window.webkitURL;
                      const img = new Image();
                      var objectUrl = _URL.createObjectURL(file);
                      img.onload = function () {
                        console.log(
                          Number(this.width / this.height),
                          Number(Number(this.width / this.height).toFixed(1)),
                        );
                        if (
                          Number(
                            Number(this.width / this.height).toFixed(1),
                          ) !== aspectRatio
                        ) {
                          notify.toastError(
                            `The image should be of aspect ratio ${aspectRatio} or 500 x ${Number(
                              500 / aspectRatio,
                            ).toFixed(1)}`,
                          );
                        } else {
                          field.onChange(file);
                        }

                        _URL.revokeObjectURL(objectUrl);
                      };
                      img.src = objectUrl;
                    }
                  }
                }}
                style={{ display: "none" }}
              />
            </Stack>
          );
        }
        let fileUrl = "";
        let fileName = "";
        if (typeof field.value === "string") {
          fileUrl = MEDIA_URL + field.value;
          fileName = fileUrl.split("/").pop() ?? "file";
        }
        if (field.value instanceof File) {
          fileUrl = URL.createObjectURL(field.value);
          fileName = field.value.name;
        }
        return (
          <>
            <Box
              component="img"
              src={fileUrl}
              sx={{ width: "100%", height: "auto" }}
            ></Box>
            <Box>
              <Chip
                color="primary"
                variant="outlined"
                label={fileName}
                onDelete={() => {
                  field.onChange("");
                }}
              />
            </Box>
          </>
        );
      }}
    />
  );
}
