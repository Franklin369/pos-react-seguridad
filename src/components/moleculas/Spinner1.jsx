import styled from "styled-components";
import {RingLoader} from "react-spinners"
export function Spinner1() {
  return (<Container>
<RingLoader color="#7f3ceb" size={100}/>
  </Container>);
}
const Container =styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height:100vh;
`