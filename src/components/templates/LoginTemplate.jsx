import styled from "styled-components";
import {
  Btn1,
  Footer,
  InputText2,
  Linea,
  Title,
  useAuthStore,
} from "../../index";
import { v } from "../../styles/variables";
import { Device } from "../../styles/breakpoints";
export function LoginTemplate() {
  const { loginGoogle } = useAuthStore();
  return (
    <Container>
      <div className="card">
        <ContentLogo>
          <img src={v.logo} />
          <span>ada369 3.0 - POS VENTAS</span>
        </ContentLogo>
        <Title $paddingbottom="40px">Ingresar</Title>

        <form>
          <InputText2>
            <input className="form__field" placeholder="email" type="text" />
          </InputText2>
          <InputText2>
            <input
              className="form__field"
              placeholder="contraseña"
              type="password"
            />
          </InputText2>
          <Btn1 border="2px"
            titulo="INGRESAR"
            bgcolor="#1CB0F6"
            color="255,255,255"
            width="100%"
          />
        </form>
        <Linea>
          <span>0</span>
        </Linea>
        <Btn1 border="2px"
          funcion={loginGoogle}
          titulo="Google"
          bgcolor="#fff"
          icono={<v.iconogoogle />}
        />
      </div>
      <Footer />
    </Container>
  );
}
const Container = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-direction: column;
  padding: 0 10px;
  color: ${({ theme }) => theme.text};
  .card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    width: 100%;
    margin: 20px;
    @media ${Device.tablet} {
      width: 400px;
    }
    form{
      display:flex;
      flex-direction:column;
      gap:10px;
    }
  }
`;
const ContentLogo = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px;
  span {
    font-weight: 700;
  }
  img {
    width: 10%;
  }
`;
