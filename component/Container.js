import { View } from "react-native";
import styled from "styled-components/native";

const Container = styled(View)`
  flex: 1;
  padding: 10px;
  gap: 15px;
  padding-bottom:20%;
  ${(props) => props.bgImage && `background-image: ${props.bgImage}`};
  ${(props) => props.bgColor && `background-color: ${props.bgColor}`};
  ${(props) => props.justifyContent && `justify-content: ${props.justifyContent}`};
  ${(props) => props.alignItems && `align-items: ${props.alignItems}`};
`;
export default Container;
