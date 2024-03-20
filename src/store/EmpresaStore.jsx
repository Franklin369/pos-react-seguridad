import { create } from "zustand";
import { InsertarEmpresa, MostrarEmpresaXidsuario } from "../index";
export const useEmpresaStore = create((set) => ({
  dataempresa: [],
  mostrarempresa: async (p) => {
    const response = await MostrarEmpresaXidsuario(p);
    set({ dataempresa: response });
    return response;
  },
  insertarempresa: async (p) => {
    const response = await InsertarEmpresa(p);
    console.log("respuesta empresa", response);
  },
}));
