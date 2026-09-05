import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";

export default function useMe() {
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const authed = await base44.auth.isAuthenticated();
    setMe(authed ? await base44.auth.me() : null);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  return { me, loading, reload: load };
}