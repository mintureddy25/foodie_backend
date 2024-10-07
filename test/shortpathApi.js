const express = require("express");
const router = express.Router();

function shortestPath(start, end) {
  const grid = Array.from({ length: 20 }, () => Array(20).fill(0));

  const [startX, startY] = start;
  const [endX, endY] = end;

  if (
    !grid ||
    grid.length === 0 ||
    startX < 0 ||
    startX >= grid[0].length ||
    startY < 0 ||
    startY >= grid.length ||
    endX < 0 ||
    endX >= grid[0].length ||
    endY < 0 ||
    endY >= grid.length
  ) {
    return { count: -1, path: [] };
  }

  const m = grid.length,
    n = grid[0].length;
  const q = [[startY, startX]];
  const seen = new Set();
  seen.add(`${startY},${startX}`);
  const parent = {};
  let steps = 0;

  const moves = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
  ];

  while (q.length > 0) {
    const size = q.length;
    for (let k = 0; k < size; k++) {
      const [i, j] = q.shift();

      if (i === endY && j === endX) {
        const path = [];
        let current = `${i},${j}`;
        while (current) {
          const [y, x] = current.split(",").map(Number);
          path.push([y, x]);
          current = parent[current];
        }
        path.reverse();
        return { count: steps, path };
      }

      for (const move of moves) {
        const y = i + move[0],
          x = j + move[1];

        if (y >= 0 && y < m && x >= 0 && x < n && !seen.has(`${y},${x}`)) {
          q.push([y, x]);
          seen.add(`${y},${x}`);
          parent[`${y},${x}`] = `${i},${j}`;
        }
      }
    }
    steps += 1;
  }

  return { count: -1, path: [] };
}

router.get("/shortest-path", (req, res) => {
  const start = JSON.parse(req.query.start);
  const end = JSON.parse(req.query.end);

  // Validate input
  if (
    !Array.isArray(start) ||
    !Array.isArray(end) ||
    start.length !== 2 ||
    end.length !== 2
  ) {
    return res.status(400).json({ message: "Invalid start or end position" });
  }

  const [startX, startY] = start;
  const [endX, endY] = end;

  // Ensure start and end are within bounds
  if (
    startX < 0 ||
    startX >= 20 ||
    startY < 0 ||
    startY >= 20 ||
    endX < 0 ||
    endX >= 20 ||
    endY < 0 ||
    endY >= 20
  ) {
    return res
      .status(400)
      .json({ message: "Start or end position out of bounds" });
  }

  // Find the straight path
  const path = shortestPath(start, end);

  // Debugging: Log the path found
  console.log("Calculated Path:", path.count);

  // Send the response
  if (path.path.length > 0) {
    res.json(path);
  } else {
    res.status(404).json({ message: "No path found" });
  }
});

module.exports = router;
