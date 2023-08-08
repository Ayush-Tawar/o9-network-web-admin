import { useEffect, useMemo, useState } from "react";
import { appsApi } from "./api";
import _ from "lodash";
import { useAlert } from "src/hooks/useNotify";

export default function useSectionsApi(token) {
  const [sectionList, setSectionList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const notify = useAlert();
  const [isSubmittingSection, setIsSubmittingSection] = useState(false);

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const { data } = await appsApi.get("section/getAllsection");
      if (_.has(data, "results") && _.isArray(data.results)) {
        setSectionList(data.results);
      }
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const submitSection = async (params) => {
    const { id, ...rest } = params;
    if (!id) {
      notify.toastError("Id not found!");
    }
    delete params.id;
    try {
      setIsSubmittingSection(true);
      const res = await appsApi.put("section/" + id, rest);
      if (res.data && res.data.message) {
        notify.toastSuccess("Request updated successfully!");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmittingSection(false);
    }
  };

  return {
    sectionList,
    isLoading,
    setIsLoading,
    submitSection,
    isSubmittingSection,
    setIsSubmittingSection,
  };
}
