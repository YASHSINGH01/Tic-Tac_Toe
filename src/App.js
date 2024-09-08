import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  Animated,
  Button,
} from "react-native";

const EMPTY = "";
const PLAYER_X = "X";
const PLAYER_O = "O";
const WINNING_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

export default function SimpleTicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(EMPTY));
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [winningCombo, setWinningCombo] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [playerSelectionModalVisible, setPlayerSelectionModalVisible] =
    useState(true);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = (index) => {
    if (board[index] === EMPTY && !gameOver) {
      const newBoard = [...board];
      newBoard[index] = currentPlayer;
      setBoard(newBoard);

      if (checkWinner(newBoard)) {
        setWinner(currentPlayer);
        updateLeaderboard(currentPlayer);
        setGameOver(true);
        setModalVisible(true);
      } else if (newBoard.every((cell) => cell !== EMPTY)) {
        setWinner("Draw");
        updateLeaderboard("Draw");
        setGameOver(true);
        setModalVisible(true);
      } else {
        setCurrentPlayer(currentPlayer === PLAYER_X ? PLAYER_O : PLAYER_X);
      }
    }
  };

  const checkWinner = (newBoard) => {
    for (let combo of WINNING_COMBOS) {
      const [a, b, c] = combo;
      console.log("cond", combo);
      if (
        newBoard[a] &&
        newBoard[a] === newBoard[b] &&
        newBoard[a] === newBoard[c]
      ) {
        setWinningCombo(combo);
        return true;
      }
    }
    return false;
  };

  const resetGame = () => {
    setBoard(Array(9).fill(EMPTY));
    setGameOver(false);
    setWinner(null);
    setModalVisible(false);
    setWinningCombo([]);
    setPlayerSelectionModalVisible(true);
  };

  const updateLeaderboard = (winner) => {
    if (winner !== "Draw") {
      const newLeaderboard = [
        ...leaderboard,
        { id: leaderboard.length + 1, winner },
      ];
      console.log;
      setLeaderboard(newLeaderboard);
    }
  };

  const handlePlayerSelection = (player) => {
    setCurrentPlayer(player);
    setPlayerSelectionModalVisible(false);
  };

  const renderSquare = (index) => {
    const isWinningSquare = winningCombo.includes(index);
    return (
      <TouchableOpacity
        key={index}
        style={[styles.square, isWinningSquare ? styles.winningSquare : null]}
        onPress={() => handlePress(index)}
      >
        <Animated.Text style={[styles.squareText]}>
          {board[index]}
        </Animated.Text>
      </TouchableOpacity>
    );
  };

  const renderLeaderboardItem = ({ item }) => (
    <View style={styles.leaderboardItem}>
      <Text style={styles.leaderboardText}>Game {item.id}: </Text>
      <Text style={styles.leaderboardText}>Winner: {item.winner}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tic-Tac-Toe</Text>
      <View style={styles.board}>
        {board.map((_, index) => renderSquare(index))}
      </View>
      <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
        <Text style={styles.resetButtonText}>Reset Game</Text>
      </TouchableOpacity>
      <View style={styles.leaderboardListWrapper}>
        <Text style={styles.leaderboardTitle}>Leaderboard</Text>
        <FlatList
          data={leaderboard}
          renderItem={renderLeaderboardItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <Modal transparent={true} visible={playerSelectionModalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.resultText}>Choose Starting Player</Text>
            <View style={styles.buttonContainer}>
              <View style={styles.buttonWrapper}>
                <Button
                  title="Start as X"
                  onPress={() => handlePlayerSelection(PLAYER_X)}
                />
              </View>
              <View style={styles.buttonWrapper}>
                <Button
                  title="Start as O"
                  onPress={() => handlePlayerSelection(PLAYER_O)}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <Modal transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.resultText}>
              {winner === "Draw" ? "It's a Draw!" : `${winner} Wins!`}
            </Text>
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fffaf0",
    paddingHorizontal: 20,
  },
  button: {
    margin: 10,
    padding: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 10,
  },
  board: {
    width: 300,
    height: 300,
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  square: {
    width: "30%",
    height: "30%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f8ff",
    borderWidth: 2,
    borderColor: "#4682b4",
    borderRadius: 10,
    margin: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  squareText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#4682b4",
  },
  resetButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  winningSquare: {
    backgroundColor: "#90ee90",
  },
  resetButtonText: {
    color: "#fff",
    fontSize: 20,
  },
  leaderboardText: {
    fontSize: 18,
    marginVertical: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  resultText: {
    fontSize: 24,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row", // Align buttons horizontally
    justifyContent: "space-between", // Add space between buttons
  },
  buttonWrapper: {
    marginHorizontal: 10, // Add horizontal space around each button
  },
  leaderboardListWrapper: {
    flex: 1,
    width: "100%",
    maxHeight: 150,
    paddingHorizontal: 10,
  },
  leaderboardItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  leaderboardTitle: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
  },
  scoreContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  scoreText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e90ff",
  },
});
