import styled from "styled-components";

export const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; 
  width: 100vw; 
  background-color:rgb(233, 232, 230); 
`;

export const Box = styled.div`
  background-color: #fff;
  border-radius: 8px;
  padding: 40px;
  width: 400px; 
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

export const Title = styled.h2`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  font-family: lora;
  outline: none;  
  background-color: #fff; /* Ensure not disabled */
  color: #000; 
  &:focus {
    border-color: black; 
  }
`;



export const Button = styled.button`
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
  justify-content: center; 

  &:hover {
    background-color: #000; 
    color: #fff; 
  }

  &:focus {
    outline: none; 
  }
`;

export const LinkContainer = styled.div`
  margin-top: 15px;
  font-size: 12px;
`;

export const StyledLink = styled.a`
  color: black;
  text-decoration: none;
  font-weight: bold;
  margin: 0 10px;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;