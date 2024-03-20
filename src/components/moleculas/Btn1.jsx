import styled from "styled-components";
import { Icono } from "../../index";
export function Btn1({
  funcion,
  titulo,
  bgcolor,
  icono,
  url,
  color,
  disabled,
  width,border,height,decorador
}) {
  return (
    <Container
      $width={width}
      disabled={disabled}
      $color={color}
      type="submit"
      $bgcolor={bgcolor}
      onClick={funcion}
      $border={border}
      $decorador={decorador}
      $height={height}
    >
      <section className="content">
        <Icono $color={color}>{icono}</Icono>
        {titulo && (
          <span className="btn">
            <a href={url} target="_blank">
              {titulo}
            </a>
          </span>
        )}
      </section>
    </Container>
  );
}
const Container = styled.button`
  font-weight: 700;
  display: flex;
  font-size: 15px;
  padding: 10px 25px;
  border-radius: 16px;
  background-color: ${(props) => props.$bgcolor};
  border: ${(props) => props.$border} solid rgba(50, 50, 50, 0.2);
  border-bottom: 5px solid rgba(50, 50, 50, 0.2);
  transform: translate(0, -3px);
  cursor: pointer;
  transition: 0.2s;
  transition-timing-function: linear;
  color: ${(props) => props.$color};
  align-items: center;
  justify-content: center;
  width: ${(props) => props.$width};
  height: ${(props) => props.$height};
  overflow:hidden;
  
  &::before {
    content: "";
    display: ${(props) => props.$decorador};
    width: 40px;
    height: 40px;
    background-color: rgba(251, 251, 251, 0.25);
    position: absolute;
    border-radius: 50%;
    bottom: -15px;
    right: -15px;
  }

  .content {
    display: flex;
    gap: 12px;
  }
  &:active {
    transform: translate(0, 0);
    border-bottom: ${(props) => props.$border} solid rgba(50, 50, 50, 0.2);
  }
  &[disabled] {
    background-color: #646464;
    cursor: no-drop;
    box-shadow: none;
  }
`;
