import { useEffect, useMemo, useState } from "react";
import { appsApi } from "./api";
import _ from "lodash";
import { useAlert } from "src/hooks/useNotify";

export default function useAboutUs(token) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const notify = useAlert();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const { data } = await appsApi.get("aboutus/getAllAboutus");
      if (
        _.has(data, "results") &&
        _.isArray(data.results) &&
        !_.isEmpty(data.results)
      ) {
        setData(data.results[0]);
      }
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const submitAboutUs = async (params) => {
    if (!data.id) {
      notify.toastError("Id not found!");
    }
    const fd = new FormData();
    Object.keys(params).map((key) => {
      fd.append(key, params[key]);
    });
    try {
      setIsSubmitting(true);
      const res = await appsApi.put("aboutus/" + data.id, params, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status === 200) {
        notify.toastSuccess("Request updated successfully!");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    data,
    isLoading,
    submitAboutUs,
    isSubmitting,
  };
}
