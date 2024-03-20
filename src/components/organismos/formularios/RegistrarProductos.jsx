import styled from "styled-components";
import { v } from "../../../styles/variables";
import {
  InputText,
  Btn1,
  ConvertirCapitalize,
  useProductosStore,
  ContainerSelector,
  Switch1,
  Selector,
  useSucursalesStore,
  ListaDesplegable,
  useCategoriasStore,
  Btngenerarcodigo,
  useAlmacenesStore,
} from "../../../index";
import { useForm } from "react-hook-form";
import { useEmpresaStore } from "../../../store/EmpresaStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Device } from "../../../styles/breakpoints";
import { useEffect, useRef, useState } from "react";
import { Checkbox1 } from "../Checkbox1";
import Swal from "sweetalert2";

export function RegistrarProductos({
  onClose,
  dataSelect,
  accion,
  setIsExploding,
  state,
}) {
  if (!state) return;
  //validar checkboxs
  const [isChecked1, setIsChecked1] = useState(true);
  const [isChecked2, setIsChecked2] = useState(false);
  const [sevendepor, setSevendepor] = useState("UNIDAD");
  const handleCheckboxChange = (checkboxNumber) => {
    if (checkboxNumber === 1) {
      setIsChecked1(true);
      setIsChecked2(false);
      setSevendepor("UNIDAD");
    } else {
      setIsChecked1(false);
      setIsChecked2(true);
      setSevendepor("GRANEL");
    }
  };
  //

  const {
    insertarProductos,
    editarProductos,
    generarCodigo,
    codigogenerado,
    refetchs,
  } = useProductosStore();
  const { dataempresa } = useEmpresaStore();
  const {
    insertarStockAlmacenes,
    mostrarAlmacen,
    dataalmacen,
    eliminarAlmacen,
  } = useAlmacenesStore();
  const [stateInventarios, setStateInventarios] = useState(false);
  const [stateEnabledStock, setStateEnabledStock] = useState(false);
  const [stateSucursalesLista, setStateSucursalesLista] = useState(false);
  const [stateCategoriasLista, setStateCategoriasLista] = useState(false);
  const inputcodigointerno = useRef();
  const { sucursalesItemSelect, dataSucursales, selectSucursal } =
    useSucursalesStore();
  const { datacategorias, selectCategoria, categoriaItemSelect } =
    useCategoriasStore();
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [
      "mostrar stock almacen x sucursal",
      { id_producto: dataSelect.id, id_sucursal: sucursalesItemSelect.id },
    ],
    queryFn: () =>
      mostrarAlmacen({
        id_sucursal: sucursalesItemSelect.id,
        id_producto: dataSelect.id,
      }),
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const { isPending, mutate: doInsertar } = useMutation({
    mutationFn: insertar,
    mutationKey: "insertar marca",
    onError: (err) => console.log("El error", err.message),
    onSuccess: () => cerrarFormulario(),
  });
  const handlesub = (data) => {
    doInsertar(data);
  };
  const cerrarFormulario = () => {
    onClose();
    setIsExploding(true);
  };
  async function insertar(data) {
    validarVacios(data);
    if (accion === "Editar") {
      const p = {
        _id: dataSelect.id,
        _nombre: data.nombre,
        _precio_venta: parseFloat(data.precio_venta),
        _precio_compra: parseFloat(data.precio_compra),
        _id_categoria: categoriaItemSelect.id,
        _codigo_barras: randomCodebarras ? randomCodebarras : codigogenerado,
        _codigo_interno: randomCodeinterno ? randomCodeinterno : codigogenerado,
        _id_empresa: dataempresa.id,
        _sevende_por: sevendepor,
        _maneja_inventarios: stateInventarios,
      };
      console.log(p);
      await editarProductos(p);
      if (stateInventarios) {
        if (dataalmacen == null) {
          const palmacenes = {
            id_sucursal: sucursalesItemSelect.id,
            id_producto: dataSelect.id,
            stock: parseFloat(data.stock),
            stock_minimo: parseFloat(data.stock_minimo),
          };
          await insertarStockAlmacenes(palmacenes);
        }
      }
    } else {
      const p = {
        _nombre: data.nombre,
        _precio_venta: parseFloat(data.precio_venta),
        _precio_compra: parseFloat(data.precio_compra),
        _id_categoria: categoriaItemSelect.id,
        _codigo_barras: randomCodebarras ? randomCodebarras : codigogenerado,
        _codigo_interno: randomCodeinterno ? randomCodeinterno : codigogenerado,
        _id_empresa: dataempresa.id,
        _sevende_por: sevendepor,
        _maneja_inventarios: stateInventarios,
        _maneja_multiprecios: false,
      };

      const id_producto_nuevo = await insertarProductos(p);
      if (stateInventarios) {
        const palmacenes = {
          id_sucursal: sucursalesItemSelect.id,
          id_producto: id_producto_nuevo,
          stock: parseFloat(data.stock),
          stock_minimo: parseFloat(data.stock_minimo),
        };

        await insertarStockAlmacenes(palmacenes);
      }
    }
  }

  //#region validar check inventarios
  function checkUseInventarios() {
    if (accion === "Editar") {
      if (dataalmacen) {
        if (stateInventarios) {
          Swal.fire({
            title: "¿Estás seguro(a)?",
            text: "Si desactiva esta opción se eliminara el stock!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, eliminar",
          }).then(async (result) => {
            if (result.isConfirmed) {
              setStateInventarios(false);
              await eliminarAlmacen({ id: dataalmacen.id });
            }
          });
        } else {
          setStateInventarios(true);
        }
      } else {
        setStateInventarios(!stateInventarios);
      }
    } else {
      setStateInventarios(!stateInventarios);
    }
  }
  //#endregion
  //#region validar vacios
  function validarVacios(data) {
    if (!randomCodeinterno) {
      generarCodigoInterno();
    }
    if (!randomCodebarras) {
      generarCodigoBarras();
    }
    if (data.precio_venta.trim() === "") {
      data.precio_venta = 0;
    }
    if (data.precio_compra.trim() === "") {
      data.precio_compra = 0;
    }
    if (stateInventarios) {
      if (!dataalmacen) {
        if (data.stock.trim() === "") {
          data.stock = 0;
        }
        if (data.stock_minimo.trim() === "") {
          data.stock_minimo = 0;
        }
      }
    }
  }
  //#endregion
  //#region generar codigo automatico
  const [randomCodeinterno, setRandomCodeinterno] = useState("");
  const [randomCodebarras, setRandomCodebarras] = useState("");
  function generarCodigoBarras() {
    generarCodigo();
    setRandomCodebarras(codigogenerado);
  }
  function generarCodigoInterno() {
    generarCodigo();
    setRandomCodeinterno(codigogenerado);
  }
  const handleChangeinterno = (event) => {
    setRandomCodeinterno(event.target.value);
  };
  const handleChangebarras = (event) => {
    setRandomCodebarras(event.target.value);
  };
  //#endregion

  //#region validar_accion

  useEffect(() => {
    if (accion != "Editar") {
      generarCodigoInterno();
    } else {
      setRandomCodeinterno(dataSelect.codigo_interno);
      setRandomCodebarras(dataSelect.codigo_barras);
      dataSelect.sevende_por === "UNIDAD"
        ? handleCheckboxChange(1)
        : handleCheckboxChange(0);
      dataSelect.maneja_inventarios
        ? setStateInventarios(true)
        : setStateInventarios(false);
      dataSelect.maneja_inventarios
        ? setStateEnabledStock(true)
        : setStateEnabledStock(false);
    }
  }, []);
  //#endregion validar_accion

  return (
    <Container>
      {isPending ? (
        <span>...🔼</span>
      ) : (
        <div className="sub-contenedor">
          <div className="headers">
            <section>
              <h1>
                {accion == "Editar"
                  ? "Editar productos"
                  : "REGISTRAR NUEVO PRODUCTO"}
              </h1>
            </section>

            <section>
              <span
                onClick={() => {
                  refetchs();
                  onClose();
                }}
              >
                x
              </span>
            </section>
          </div>

          <form className="formulario" onSubmit={handleSubmit(handlesub)}>
            <section className="seccion1">
              <article>
                <InputText icono={<v.iconoflechaderecha />}>
                  <input
                    className="form__field"
                    defaultValue={dataSelect.nombre}
                    type="text"
                    placeholder="nombre"
                    {...register("nombre", {
                      required: true,
                    })}
                  />
                  <label className="form__label">nombre</label>
                  {errors.nombre?.type === "required" && <p>Campo requerido</p>}
                </InputText>
              </article>
              <article>
                <InputText icono={<v.iconoflechaderecha />}>
                  <input
                    step="0.01"
                    className="form__field"
                    defaultValue={dataSelect.precio_venta}
                    type="number"
                    placeholder="precio venta"
                    {...register("precio_venta")}
                  />
                  <label className="form__label">precio venta</label>
                </InputText>
              </article>
              <article>
                <InputText icono={<v.iconoflechaderecha />}>
                  <input
                    step="0.01"
                    className="form__field"
                    defaultValue={dataSelect.precio_compra}
                    type="number"
                    placeholder="precio compra"
                    {...register("precio_compra")}
                  />
                  <label className="form__label">precio compra</label>
                </InputText>
              </article>
              <article className="contentPadregenerar">
                <InputText icono={<v.iconoflechaderecha />}>
                  <input
                    className="form__field"
                    value={randomCodebarras}
                    onChange={handleChangebarras}
                    type="text"
                    placeholder="codigo de barras"
                  />
                  <label className="form__label">codigo de barras</label>
                </InputText>
                <ContainerBtngenerar>
                  <Btngenerarcodigo
                    titulo="Generar"
                    funcion={generarCodigoBarras}
                  />
                </ContainerBtngenerar>
              </article>
              <article className="contentPadregenerar">
                <InputText icono={<v.iconoflechaderecha />}>
                  <input
                    className="form__field"
                    value={randomCodeinterno}
                    onChange={handleChangeinterno}
                    type="text"
                    placeholder="codigo interno"
                    // {...register("codigo_interno")}
                  />
                  <label className="form__label">codigo interno</label>
                </InputText>
                <ContainerBtngenerar>
                  <Btngenerarcodigo
                    titulo="Generar"
                    funcion={generarCodigoInterno}
                  />
                </ContainerBtngenerar>
              </article>
            </section>
            <section className="seccion2">
              <label>Se vende por: </label>
              <ContainerSelector>
                <label>UNIDAD </label>
                <Checkbox1
                  isChecked={isChecked1}
                  onChange={() => handleCheckboxChange(1)}
                />
                <label>GRANEL(decimales) </label>
                <Checkbox1
                  isChecked={isChecked2}
                  onChange={() => handleCheckboxChange(2)}
                />
              </ContainerSelector>

              <ContainerSelector>
                <label>Categoria: </label>
                <Selector
                  state={stateCategoriasLista}
                  funcion={() => setStateCategoriasLista(!stateCategoriasLista)}
                  texto1="🏬"
                  texto2={categoriaItemSelect?.nombre}
                  color="#fc6027"
                />
                <ListaDesplegable
                  funcion={selectCategoria}
                  state={stateCategoriasLista}
                  data={datacategorias}
                  top="4rem"
                  setState={() =>
                    setStateCategoriasLista(!stateCategoriasLista)
                  }
                />
              </ContainerSelector>
              <ContainerSelector>
                <label>Controlar stock: </label>
                <Switch1
                  state={stateInventarios}
                  setState={checkUseInventarios}
                />
              </ContainerSelector>
              {stateInventarios && (
                <ContainerStock>
                  <ContainerSelector>
                    <label>Sucursal: </label>
                    <Selector
                      state={stateSucursalesLista}
                      funcion={() =>
                        setStateSucursalesLista(!stateSucursalesLista)
                      }
                      texto1="🏬"
                      texto2={sucursalesItemSelect?.nombre}
                      color="#fc6027"
                    />

                    <ListaDesplegable
                      refetch={refetch}
                      funcion={selectSucursal}
                      state={stateSucursalesLista}
                      data={dataSucursales}
                      top="4rem"
                      setState={() =>
                        setStateSucursalesLista(!stateSucursalesLista)
                      }
                    />
                  </ContainerSelector>
                  {stateEnabledStock && (
                    <ContainerMensajeStock>
                      <span>
                        💀 para editar el stock vaya al módulo de kardex
                      </span>
                    </ContainerMensajeStock>
                  )}

                  <article>
                    <InputText icono={<v.iconoflechaderecha />}>
                      <input
                        disabled={stateEnabledStock}
                        className="form__field"
                        defaultValue={dataalmacen?.stock}
                        step="0.01"
                        type="number"
                        placeholder="stock"
                        {...register("stock")}
                      />
                      <label className="form__label">stock</label>
                    </InputText>
                  </article>
                  <article>
                    <InputText icono={<v.iconoflechaderecha />}>
                      <input
                        disabled={stateEnabledStock}
                        className="form__field"
                        defaultValue={dataalmacen?.stock_minimo}
                        step="0.01"
                        type="number"
                        placeholder="stock minimo"
                        {...register("stock_minimo")}
                      />
                      <label className="form__label">stock minimo</label>
                    </InputText>
                  </article>
                </ContainerStock>
              )}
            </section>

            <Btn1
              icono={<v.iconoguardar />}
              titulo="Guardar"
              bgcolor="#F9D70B"
            />
          </form>
        </div>
      )}
    </Container>
  );
}
const Container = styled.div`
  transition: 0.5s;
  top: 0;
  left: 0;
  position: fixed;
  background-color: rgba(10, 9, 9, 0.5);
  display: flex;
  width: 100%;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  .sub-contenedor {
    position: relative;
    width: 100%;

    background: ${({ theme }) => theme.bgtotal};
    box-shadow: -10px 15px 30px rgba(10, 9, 9, 0.4);
    padding: 13px 36px 13px 36px;
    z-index: 100;
    height: calc(100vh - 20px);
    overflow-y: auto;

    .headers {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      h1 {
        font-size: 20px;
        font-weight: 500;
      }
      span {
        font-size: 20px;
        cursor: pointer;
      }
    }
    .formulario {
      display: grid;
      grid-template-columns: 1fr;
      gap: 15px;
      @media ${Device.tablet} {
        grid-template-columns: repeat(2, 1fr);
      }
      .seccion1,
      .seccion2 {
        gap: 20px;
        display: flex;
        flex-direction: column;
      }
      .contentPadregenerar {
        position: relative;
      }
    }
  }
`;
const ContainerStock = styled.div`
  border: 1px solid rgba(240, 104, 46, 0.9);
  display: flex;
  border-radius: 15px;
  padding: 12px;
  flex-direction: column;
  background-color: rgba(240, 127, 46, 0.05);
`;
const ContainerBtngenerar = styled.div`
  position: absolute;
  right: 0;
  top: 10%;
`;
const ContainerMensajeStock = styled.div`
  text-align: center;
  color: #f9184c;
  background-color: rgba(249, 24, 61, 0.2);
  border-radius: 10px;
  padding: 5px;
  margin: 10px;
  font-weight: 600;
`;
