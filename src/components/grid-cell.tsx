import styled from 'styled-components';

export const GridCell: React.FC = () => {
  return <Cell />;
};

const Cell = styled.td`
  border: 1px solid black;
  width: 25px;
  height: 25px;
`;
