import { render, fireEvent, within } from "@testing-library/react";
import { InitialGameState, GameState, Team } from "../../state/GameState";
import { JoinTeam } from "./JoinTeam";
import { TestContext } from "./TestContext";

jest.useFakeTimers();

test("Assigns player to the selected team", () => {
  const gameState: GameState = {
    ...InitialGameState(),
    players: {
      playerId: {
        name: "Player",
        team: Team.Unset,
      },
    },
  };

  const setState = jest.fn();
  const component = render(
    <TestContext gameState={gameState} playerId="player1">
      <JoinTeam />
    </TestContext>
  );

  const button = component
    .getByText("LEFT BRAIN")
    .parentNode?.querySelector("input")!;
  expect(button.value).toEqual("Join");
  fireEvent.click(button);

  expect(setState).toHaveBeenCalledWith({
    players: {
      playerId: {
        id: "playerId",
        name: "Player",
        team: Team.Left,
      },
    },
  });
});

test("Shows current team members", () => {
  const gameState: GameState = {
    ...InitialGameState(),
    players: {
      playerId: {
        name: "Player",
        team: Team.Unset,
      },
      leftTeam1: {
        name: "Left Team 1",
        team: Team.Left,
      },
      leftTeam2: {
        name: "Left Team 2",
        team: Team.Left,
      },
      rightTeam1: {
        name: "Right Team 1",
        team: Team.Right,
      },
      rightTeam2: {
        name: "Right Team 2",
        team: Team.Right,
      },
    },
  };

  const component = render(
    <TestContext gameState={gameState} playerId="player1">
      <JoinTeam />
    </TestContext>
  );

  const leftBrain = within(component.getByText("LEFT BRAIN").parentElement!);
  expect(leftBrain.getByText("Left Team 1")).toBeInTheDocument();
  expect(leftBrain.getByText("Left Team 2")).toBeInTheDocument();

  const rightBrain = within(component.getByText("RIGHT BRAIN").parentElement!);
  expect(rightBrain.getByText("Right Team 1")).toBeInTheDocument();
  expect(rightBrain.getByText("Right Team 2")).toBeInTheDocument();
});
