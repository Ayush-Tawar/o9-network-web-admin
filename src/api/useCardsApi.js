import { useEffect, useMemo, useState } from "react";
import { appsApi } from "./api";
import _ from "lodash";
import { useAlert } from "src/hooks/useNotify";

export default function useCardsApi(token) {
  const [cardsList, setCardsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const notify = useAlert();
  const [isSubmittingTitle, setIsSubmittingTitle] = useState(false);
  const [isSubmittingProducts, setIsSubmittingProducts] = useState(false);

  const titleCard = useMemo(
    () => cardsList.find((c) => c.type === "main"),
    [cardsList],
  );

  const products = useMemo(
    () => cardsList.filter((c) => c.type === "sub"),
    [cardsList],
  );

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const { data } = await appsApi.get("card/getAllcard");
      if (_.has(data, "results") && _.isArray(data.results)) {
        setCardsList(data.results);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("===>  useCardsApi  error:", error);
    }
  };

  const submitTitleSection = async (params) => {
    const id = titleCard?.id || "";
    if (!id) {
      notify.toastError("Id not found!");
    }

    try {
      setIsSubmittingTitle(true);
      const res = await appsApi.put("card/" + id, {
        ...params,
        type: "main",
      });
      if (res.data && res.data.message) {
        notify.toastSuccess("Request updated successfully!");
      }
    } catch (error) {
      console.error("===>  submitTitleSection  error:", error);
    } finally {
      setIsSubmittingTitle(false);
    }
  };

  const onCreate = async (params) => {
    console.log("🚀 ~ file: useCardsApi.js:63 ~ params:", params);
    try {
      setIsSubmittingProducts(true);
      const res = await appsApi.post("card/create", params);
      if (res.status === 200 || res.status == 201) {
        notify.toastSuccess("Product created successfully!");
        fetchData();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmittingProducts(false);
    }
  };

  const onUpdate = async (params) => {
    const { id, ...rest } = params;
    try {
      setIsSubmittingProducts(true);
      const res = await appsApi.put("card/" + id, rest);
      if (res.status === 200) {
        notify.toastSuccess("Product updated successfully!");
        fetchData();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmittingProducts(false);
    }
  };

  const onDelete = async (id) => {
    try {
      setIsSubmittingProducts(true);
      const res = await appsApi.delete("card/" + id);
      if (res.status === 200) {
        notify.toastSuccess("Product deleted successfully!");
        setCardsList((old) => old.filter((o) => o.id !== id));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmittingProducts(false);
    }
  };

  return {
    //common initial Loading
    isLoading,
    setIsLoading,
    //Hero Section
    titleCard,
    submitTitleSection,
    isSubmittingTitle,
    // Products
    products,
    onUpdate,
    onCreate,
    onDelete,
    isSubmittingProducts,
  };
}
