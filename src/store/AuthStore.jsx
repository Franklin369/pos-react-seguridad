import { create } from "zustand";
import { supabase, MostrarUsuarios } from "../index";

export const useAuthStore = create((set) => ({
 
  loginGoogle: async () => {
   
     await supabase.auth.signInWithOAuth({
       provider: "google",
     });
    
  },
  cerrarSesion: async () => {
    await supabase.auth.signOut();
  },
}));
