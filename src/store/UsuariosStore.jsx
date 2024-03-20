import { create } from "zustand";
import { MostrarUsuarios,ObtenerIdAuthSupabase } from "../index";

export const useUsuariosStore = create((set)=>({

datausuarios:[],
mostrarusuarios:async()=>{
    const idauth= await ObtenerIdAuthSupabase()
    const response = await MostrarUsuarios({id_auth:idauth})
    set({datausuarios:response})
    return response;
}
}))