import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";

export default function useFetch(url: string) {
  const [responseJSON, setResponseJSON] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect((): any => {
    let shouldCancel = false;

    const callFetch = async () => {
      setIsLoading(true);
      try {
        const response: AxiosResponse = await axios.get(url);
        const newResponseJSON = response.data;
        if (shouldCancel) return;
        setResponseJSON(newResponseJSON);
        setError(null);
      } catch (error: any) {
        if (shouldCancel) return;
        setError(error);
        setResponseJSON(null);
      }

      setIsLoading(false);
    };

    callFetch();

    return () => (shouldCancel = true);
  }, [url]);

  return {
    responseJSON,
    isLoading,
    error,
  };
}
