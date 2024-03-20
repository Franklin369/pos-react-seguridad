import { supabase } from "../index";
const tabla = "tipodocumento";
export async function MostrarTipoDocumentos(p) {
  const { data } = await supabase
    .from(tabla)
    .select()
    .eq("id_empresa", p.id_empresa);
  return data;
}
