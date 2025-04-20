import { useEffect, useState } from "react";
import axios from "axios";

const useFetch = (url) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(url);
        // ✅ Vérifie que c'est bien un tableau
        if (Array.isArray(res.data)) {
          setData(res.data);
        } else {
          console.error("API ne retourne pas un tableau:", res.data);
          setData([]);
        }
      } catch (err) {
        setError(err);
      }
      setLoading(false);
    };
    fetchData();
  }, [url]);

  const reFetch = async () => {
    setLoading(true);
    try {
      const res = await axios.get(url);
      if (Array.isArray(res.data)) {
        setData(res.data);
      } else {
        console.error("API ne retourne pas un tableau:", res.data);
        setData([]);
      }
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  };

  return { data, loading, error, reFetch };
};

export default useFetch;
