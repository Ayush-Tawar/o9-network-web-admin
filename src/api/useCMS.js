import { useEffect, useState } from "react";
import { appsApi } from "./api";
import _ from "lodash";
import { useAlert } from "src/hooks/useNotify";

export default function useCMS(token) {
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
      const { data } = await appsApi.get("cms/getAllCMS");
      setData(data.results);
      console.log("DATA", data.results);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const onCreate = async (params) => {
    try {
      setIsSubmitting(true);
      const res = await appsApi.post("cms/create", params);
      if (res.status === 200 || res.status == 201) {
        notify.toastSuccess("Conent created successfully!");
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
      const res = await appsApi.put("cms/" + id, rest);
      if (res.status === 200) {
        notify.toastSuccess("Conent updated successfully!");
        fetchData();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onUpdateLink = async (params) => {
    const loginParams = _.clone(params[0]);
    const signUpParams = _.clone(params[1]);
    delete loginParams.id;
    delete signUpParams.id;
    try {
      setIsSubmitting(true);
      const res = await Promise.all([
        appsApi.put("cms/" + params[0].id, loginParams),
        appsApi.put("cms/" + params[1].id, signUpParams),
      ]);
      if (res.every((r) => r.status == 200)) {
        notify.toastSuccess("Conent updated successfully!");
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
    onUpdate,
    onUpdateLink,
    onCreate,
    isSubmitting,
  };
}
