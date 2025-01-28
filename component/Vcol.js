import styled from "styled-components/native";

const Vcol = styled.View`
flex-direction:column;
${(props) => props.padding && `padding: ${props.padding}`}
${(props) => props.justifyContent && `justify-content: ${props.justifyContent}`};
${(props) => props.align && `align-items: ${props.align}`};
`;
export default Vcol;
