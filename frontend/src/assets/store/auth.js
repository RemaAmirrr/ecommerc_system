import { create } from 'sustand'
import { mountStoreDevtool } from 'simple-sustand-devtools'

const userAuthStore = create((set, get) => ({
    allUserDate: null,
    loading: false,

    user: () => ({
        user_id: get().allUserDate?.user_id || null,
        username: get().allUserDate?.user_id || null,
    
    }),
    
    
    setUser: (user) => set({ allUserDate: user }),
    setLoading: (Loading) => set( { loading }),
    setLoggedIn: () => get().allUserDate !== null, 

}))


if(import.meta.env.DEV){
    mountStoreDevtool('Store', userAuthStore)
}

export { userAuthStore }


