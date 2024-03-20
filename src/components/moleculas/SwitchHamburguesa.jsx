import styled from "styled-components";
export function SwitchHamburguesa() {
  return (
    <Container>
      <input type="checkbox" id="checkbox" />
      <label for="checkbox" className="toggle">
        <div className="bars" id="bar1"></div>
        <div className="bars" id="bar2"></div>
        <div className="bars" id="bar3"></div>
      </label>
    </Container>
  );
}
const Container = styled.div`
  position: relative;
  left: 8px;
  top: 8px;
  #checkbox {
    display: none;
  }

  .toggle {
    position: relative;
    width: 40px;
    height: 40px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition-duration: 0.3s;
    transform: scale(0.55);
  }

  .bars {
    width: 100%;
    height: 4px;
    background-color: ${({ theme }) => theme.text};
    border-radius: 5px;
    transition-duration: 0.3s;
  }

  #checkbox:checked + .toggle .bars {
    margin-left: 13px;
  }

  #checkbox:checked + .toggle #bar2 {
    transform: rotate(135deg);
    margin-left: 0;
    transform-origin: center;
    transition-duration: 0.3s;
  }

  #checkbox:checked + .toggle #bar1 {
    transform: rotate(45deg);
    transition-duration: 0.3s;
    transform-origin: left center;
  }

  #checkbox:checked + .toggle #bar3 {
    transform: rotate(-45deg);
    transition-duration: 0.3s;
    transform-origin: left center;
  }
`;
