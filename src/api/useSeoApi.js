import { useEffect, useState } from "react";
import { appsApi } from "./api";
import _ from "lodash";
import { useAlert } from "src/hooks/useNotify";

export default function useSeoApi(token) {
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
      const { data } = await appsApi.get("seo/getAllSeo");
      if (_.has(data, "results") && _.isArray(data.results)) {
        setData(data.results);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("===>  useCardsApi  error:", error);
    }
  };

  const onUpdate = async (params) => {
    const { id, ...rest } = params;
    try {
      setIsSubmitting(true);
      const res = await appsApi.put("seo/" + id, rest);
      if (res.status === 200) {
        notify.toastSuccess("Record updated successfully!");
        fetchData();
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
    setIsLoading,
    onUpdate,
    isSubmitting,
  };
}
