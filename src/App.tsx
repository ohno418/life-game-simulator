import React from 'react';
import styled from 'styled-components';

type CellState = 0 | 1;

class State {
  cells: CellState[][] = [
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
  ];
}

export default class App extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = new State();
  }

  componentDidMount() {
    setInterval(this.goToNextGeneration, 500);
  }

  render() {
    const { cells } = this.state;

    return (
      <Wrapper>
        {cells.map(cellRow => (
          <Row>
            {cellRow.map(cell => (
              <Cell isLiving={cell === 1} />
            ))}
          </Row>
        ))}
      </Wrapper>
    );
  }

  private goToNextGeneration = () => {
    const { cells } = this.state;
    const nextGenerationCells =
      cells.map((cellRow, yAxisIndex) => {
        return cellRow.map((cell, xAxisIndex) => {
          const surroundingLivingCount = this.getSurroundingLivingCount(xAxisIndex, yAxisIndex);
          return this.getNextState(
            cell,
            surroundingLivingCount,
          );
        });
      });
    this.setState({ cells: nextGenerationCells });
  };

  private getSurroundingLivingCount = (
    xAxisIndex: number,
    yAxisIndex: number,
  ): number => {
    const { cells } = this.state;
    const surroundingCells = [
      cells[yAxisIndex - 1]?.[xAxisIndex - 1],
      cells[yAxisIndex - 1]?.[xAxisIndex],
      cells[yAxisIndex - 1]?.[xAxisIndex + 1],
      cells[yAxisIndex][xAxisIndex - 1],
      cells[yAxisIndex][xAxisIndex + 1],
      cells[yAxisIndex + 1]?.[xAxisIndex - 1],
      cells[yAxisIndex + 1]?.[xAxisIndex],
      cells[yAxisIndex + 1]?.[xAxisIndex + 1],
    ];
    return surroundingCells.filter(e => e === 1).length;
  };

  private getNextState = (
    currentState: CellState,
    surroundingLivingCellCount: number,
  ): CellState => {
    switch (currentState) {
      case 0:
        if (surroundingLivingCellCount === 3) {
          return 1;
        } else {
          return 0;
        }
      case 1:
        if (surroundingLivingCellCount <= 1 || surroundingLivingCellCount >= 4) {
          return 0;
        } else if (surroundingLivingCellCount === 2 || surroundingLivingCellCount === 3) {
          return 1;
        }
      default:
        throw new Error('never');
    }
  };
}

const Wrapper = styled.div`
  padding: 10px;
`;

const Row = styled.div`
  display: flex
`;

const Cell = styled.div<{ isLiving: boolean }>`
  width: 20px;
  height: 20px;
  background-color: ${({ isLiving }) => isLiving ? 'black' : 'white' };
  border: solid 1px lightgray;
`;
