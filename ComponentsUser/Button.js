import styled, { css } from "styled-components";

export const ButtonStyle = css`
  background-color: #fff;
  border: 2px solid #000; 
  color: #000;
  padding: 5px 10px; 
  font-size: 12px; 
  font-weight: italic; 
  text-transform: uppercase; 
  border-radius: 8px;
  cursor: pointer; 
  transition: all 0.3s ease; 
  display: inline-flex;
  align-items: center;

  svg {
    height: 14px;
    margin-right: 5px;
  }

  &:hover {
    background-color: #000; 
    color: #fff; 
  }

  &:focus {
    outline: none; 
  }

  
  ${props => props.block && css`
    display: block;
    width: 100%;
  `} 
`;

const StyledButton = styled.button`
  ${ButtonStyle}
`;

export default function Button({ children, ...rest }) {
  return (
    <StyledButton {...rest}>{children}</StyledButton>
  );
}
