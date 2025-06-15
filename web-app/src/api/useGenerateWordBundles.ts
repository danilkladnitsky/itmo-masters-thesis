import { useMutation,  } from "@tanstack/react-query"
import { API_CONFIG } from "./config"

export type WordBundle = {
    bundleName: string
    words: string[]
    id: number
}

export const useGenerateWordBundles = () => {
    return useMutation({
        mutationFn: () => {
            return fetch(`${API_CONFIG.BASE_URL}/word-bundles`)
                .then(res => res.json())
                .then((data: WordBundle[]) => data)
        },
    })
}