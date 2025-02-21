import styled from "styled-components";

const SavingButton = styled.button`
  background-color: #fff;
  border: 2px solid #000;
  color: #000;
  padding: 10px 20px; 
  font-family: lora;
  font-size: 14px; 
  font-weight: italic;
  text-transform: uppercase;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex; 
  align-items: center;
  justify-content: center; 
  width: 100%; 

  &:hover {
    background-color: #000;
    color: #fff;
  }

  &:focus {
    outline: none;
  }
`;

export default function SaveButton({ children, ...props }) {
  return <SavingButton {...props}>{children}</SavingButton>;
}
