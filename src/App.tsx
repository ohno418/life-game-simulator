import React from 'react';
import styled from 'styled-components';

type CellState = 0 | 1;

class State {
  cells: CellState[][] = new Array(50).fill(new Array(50).fill(0));
  isStarted: boolean = false;
}

export default class App extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = new State();
  }

  render() {
    const { cells, isStarted } = this.state;

    return (
      <Wrapper>
        {isStarted || (
          <Starter>
            <div>Push cells to build initial state!</div>
            <StartButton onClick={this.start}>
              Start
            </StartButton>
          </Starter>
        )}

        {cells.map((cellRow, y) => (
          <Row key={y}>
            {cellRow.map((cell, x) => (
              <Cell
                key={`${x},${y}`}
                isLiving={cell === 1}
                onClick={() => this.changeState(x, y)}
              />
            ))}
          </Row>
        ))}
      </Wrapper>
    );
  }

  private start = () => {
    setInterval(this.goToNextGeneration, 500);
    this.setState({ isStarted: true });
  };

  private changeState = (
    x: number,
    y: number,
  ) => {
    const { cells, isStarted } = this.state;
    if (isStarted) {
      return;
    }

    const newCells = cells.map((cs, yIndex) => {
      return cs.map((c, xIndex) => {
        return (xIndex === x && yIndex === y) ? ((c ^ 1) as CellState) : c;
      });
    });
    this.setState({ cells: newCells });
  };

  private goToNextGeneration = () => {
    const { cells } = this.state;
    const nextGenerationCells =
      cells.map((cellRow, y) => {
        return cellRow.map((cell, x) => {
          const surroundingLivingCount = this.getSurroundingLivingCount(x, y);
          return this.getNextState(
            cell,
            surroundingLivingCount,
          );
        });
      });
    this.setState({ cells: nextGenerationCells });
  };

  private getSurroundingLivingCount = (
    x: number,
    y: number,
  ): number => {
    const { cells } = this.state;
    const surroundingCells = [
      cells[y - 1]?.[x - 1],
      cells[y - 1]?.[x],
      cells[y - 1]?.[x + 1],
      cells[y][x - 1],
      cells[y][x + 1],
      cells[y + 1]?.[x - 1],
      cells[y + 1]?.[x],
      cells[y + 1]?.[x + 1],
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
        if (
          surroundingLivingCellCount <= 1 ||
          surroundingLivingCellCount >= 4
        ) {
          return 0;
        } else if (
          surroundingLivingCellCount === 2 ||
          surroundingLivingCellCount === 3
        ) {
          return 1;
        }
      default:
        throw new Error('never');
    }
  };
}

const Wrapper = styled.div`
  padding: 20px;
`;

const Starter = styled.div`
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const StartButton = styled.button`
  background-color: green;
  color: white;
  font-size: 14px;
  font-weight: bold;
  line-height: 25px;
  border: none;
  border-radius: 5px;
  margin-left: 12px;
  cursor: pointer;
`;

const Row = styled.div`
  display: flex
`;

const Cell = styled.div<{ isLiving: boolean }>`
  width: 20px;
  height: 20px;
  background-color: ${({ isLiving }) => isLiving ? 'black' : 'white' };
  border: solid 1px lightgray;
  flex-shrink: 0;
`;
