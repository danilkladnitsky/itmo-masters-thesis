import { useQuery } from "@tanstack/react-query"
import { API_CONFIG } from "./config";

export const usePing = () => {
    return useQuery({
        queryKey: ["ping"],
        queryFn: () => fetch(API_CONFIG.BASE_URL + "/health").then((res) => res.json()),
    });
}