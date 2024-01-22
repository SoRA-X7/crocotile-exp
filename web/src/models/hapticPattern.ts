export interface HapticPattern {
  xNeg: number;
  xPos: number;
  yNeg: number;
  yPos: number;
  steps: number;
  bumps: Bump[];
  intensity: number;
}

export interface Bump {
  x: number;
  y: number;
  strength: number;
  curve: number;
}

export function calculateLinearHapticPattern(
  xNeg: number,
  xPos: number,
  yNeg: number,
  yPos: number,
  steps: number
): HapticPattern {
  const bumps: Bump[] = [...Array(steps - 1).keys()].map((i) => ({
    x: (-xNeg * (steps - 1.5 - i) + xPos * (i + 0.5)) / (steps - 1),
    y: (-yNeg * (steps - 1.5 - i) + yPos * (i + 0.5)) / (steps - 1),
    strength: 1,
    curve: (xPos + xNeg) / (steps - 1) / 2
  }));
  return {
    xNeg,
    xPos,
    yNeg,
    yPos,
    steps,
    bumps,
    intensity: 1
  };
}
