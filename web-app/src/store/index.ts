import type { Task } from '@/types'
import { create } from 'zustand'

interface Store {
    tasks: Task[]
    setTasks: (tasks: Task[]) => void
}


export const useStore = create<Store>((set) => ({
    tasks: [],
    setTasks: (tasks) => set({ tasks }),
}))