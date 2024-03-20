import { useQuery } from "@tanstack/react-query";
import { ConfiguracionesTemplate, Spinner1, useModulosStore } from "../index";
export function Configuraciones() {
  const { mostrarModulos } = useModulosStore();
  const {  isLoading, error } = useQuery({
    queryKey: "mostrar modulos",
    queryFn: mostrarModulos,
  });
  if (isLoading) {
    return <Spinner1/>;
  }
  if(error){
    return(<span>error...</span>)
  }
  return ( <ConfiguracionesTemplate />);
}
