import { useEffect, useState } from "react";
import { rationApi } from "./server";

//type:get,getOne,add,delete,modify
export async function fetchRation(type) {
  const response = await fetch(rationApi());
  const data = await response.json();
  return data;
}

export function useRation(type) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRation(type)
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((e) => {
        console.log(`error:${e}`);
        setLoading(false);
      });
  }, [type]);

  return { data, loading };
}
