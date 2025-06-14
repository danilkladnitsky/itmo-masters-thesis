import { useMutation } from "@tanstack/react-query"
import { API_CONFIG } from "./config"
import { useStore } from "@/store"
import type { Task } from "@/types"

export const useGenerateGapTask = () => {
    const { setTasks } = useStore()

    return useMutation<Task[], Error, number[]>({
        onSuccess: (data: Task[]) => {
            setTasks(data)
        },
        mutationFn: (bundleIds: number[]) => {
            return fetch(`${API_CONFIG.BASE_URL}/generate-gap-task`, {
                method: 'POST',
                body: JSON.stringify({ bundles_ids: bundleIds, inference_model_name: 'gpt-4o-mini' }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json() as Promise<Task[]>)
        }
    })
}