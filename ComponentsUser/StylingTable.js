import styled from "styled-components";

const StyledTable = styled.table`
    width: 100%;
    th{
    text-align: left;
    color: #ccc;
    font-weight: normal;
    font-size: 0.9rem;
    }

    td{
    border-top: 1px rgba(0,0,0,0.1) solid;

    }
`;

export default function StylingTable(props) {
    return (
    <StyledTable{...props}/>
  );
}