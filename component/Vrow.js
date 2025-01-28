import styled from "styled-components/native";

const Vrow = styled.View`
flex-direction:row;
${(props) => props.flexWrap && `flex-wrap : ${props.flexWrap}`};
${(props) => props.justifyContent && `justify-content: ${props.justifyContent}`};
${(props) => props.align && `align-items: ${props.align}`};
${(props) => props.padding && `padding: ${props.padding}`};
${(props) => props.paddingTop && `padding-top: ${props.paddingTop}`};
`;
export default Vrow;
