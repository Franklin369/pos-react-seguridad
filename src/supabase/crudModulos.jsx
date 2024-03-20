import Swal from "sweetalert2";
import { supabase } from "../index";
const tabla = "modulos";
export async function MostrarModulos() {

  const { data,error } = await supabase
    .from(tabla)
    .select()
    if (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: error.message,
    });
    return;
  }
  return data;
}
