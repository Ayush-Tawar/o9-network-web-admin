import { useEffect, useState } from "react";
import { appsApi } from "./api";
import _ from "lodash";
import { useAlert } from "src/hooks/useNotify";

export default function useFaqsApi(token) {
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
      const { data } = await appsApi.get("faq/getFaqs?limit=100");
      setData(data.results);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const onCreate = async (params) => {
    try {
      setIsSubmitting(true);
      const res = await appsApi.post("faq/createFaq", params);
      if (res.status === 200 || res.status == 201) {
        notify.toastSuccess("FAQ created successfully!");
        fetchData();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onUpdate = async (params) => {
    const { id, ...rest } = params;
    try {
      setIsSubmitting(true);
      const res = await appsApi.put("faq/" + id, rest);
      if (res.status === 200) {
        notify.toastSuccess("FAQ updated successfully!");
        fetchData();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDelete = async (id) => {
    try {
      setIsSubmitting(true);
      const res = await appsApi.delete("faq/" + id);
      if (res.status === 200) {
        notify.toastSuccess("FAQ deleted successfully!");
        setData((old) => old.filter((o) => o.id !== id));
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
    onUpdate,
    onDelete,
    onCreate,
    isSubmitting,
  };
}
