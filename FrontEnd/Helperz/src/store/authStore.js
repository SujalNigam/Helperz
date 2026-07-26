import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,
  role: localStorage.getItem("role") || null,
  token: localStorage.getItem("token") || null,
  login: (user, token) => {
    console.log('storing role:', user.role); // add this
    localStorage.setItem('token',token);
    localStorage.setItem('role',user.role);
    set({ user, token,role:user.role });
},
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    set({ user: null, role: null, token:null });
},
setUser: (user) => set({ user }),
}));

export default useAuthStore;
