import styled from "styled-components";

interface GridContainerProps {
  $isMobile: boolean;
  $navbarHeight: number;
}
interface GridItemProps {
  $isMobile: boolean;
  $row: string;
  $col: string;
  $rowSpan?: string;
  $colSpan?: string;
}

export const GridContainer = styled.div<GridContainerProps>`
  display: grid;
  gap: 20px;
  padding: ${({ $navbarHeight }) => `${$navbarHeight + 20}px 20px 40px`};
  margin: 0 auto;
  max-width: 1200px;

  grid-template-columns: ${({ $isMobile }) =>
    $isMobile ? "1fr" : "repeat(3, 1fr)"};
  grid-template-rows: repeat(auto-fit, auto);
`;

export const ProfileContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

export const GridItem = styled.div<GridItemProps>`
  display: flex;
  flex-direction: column;
  background: white;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 20px;

  min-height: 160px;

  grid-row: ${({ $row, $isMobile, $rowSpan }) =>
    $isMobile ? "auto" : `${$row} / span ${$rowSpan || 1}`};

  grid-column: ${({ $col, $isMobile, $colSpan }) =>
    $isMobile ? "auto" : `${$col} / span ${$colSpan || 1}`};
`;

export const ItemTitle = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 1.1rem;
  font-weight: bold;
  color: #00256c;
  border-bottom: 1px solid #00256c;
  padding-bottom: 8px;
`;

export const ItemContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
