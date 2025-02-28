import { create } from 'zustand'

type loadingState = {
    loading: boolean,
    setLoading: (value: boolean) => void
}

export const useLoadingState = create<loadingState>((set, get) => ({
     loading: false,
     setLoading: (value: boolean) => {
        set({ loading: value})
     }
}))