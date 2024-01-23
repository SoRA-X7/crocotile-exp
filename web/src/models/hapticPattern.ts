export interface HapticPattern {
  xNeg: number;
  xPos: number;
  yNeg: number;
  yPos: number;
  steps: number;
  bumps: Bump[];
  intensityX: number;
  intensityY: number;
}

export interface Bump {
  x: number;
  y: number;
  strength: number;
  curveX: number;
  curveY: number;
}

export function calculateLinearHapticPattern(
  xNeg: number,
  xPos: number,
  yNeg: number,
  yPos: number,
  steps: number
): HapticPattern {
  const bumps: Bump[] = [...Array(steps - 1).keys()].map((i) => ({
    x: (xNeg * (steps - 1.5 - i) + xPos * (i + 0.5)) / (steps - 1),
    y: (yNeg * (steps - 1.5 - i) + yPos * (i + 0.5)) / (steps - 1),
    strength: 1,
    curveX: (xPos - xNeg) / (steps - 1) / 2,
    curveY: (yPos - yNeg) / (steps - 1) / 2
  }));
  return {
    xNeg,
    xPos,
    yNeg,
    yPos,
    steps,
    bumps,
    intensityX: 10,
    intensityY: 0
  };
}

export function testHaptic(pat: HapticPattern, angle: number, mouseOffset: number): number {
  const direction = 0;

  const neg = direction == 0 ? pat.xNeg : pat.yNeg;
  const pos = direction == 0 ? pat.xPos : pat.yPos;

  const dt = (angle - mouseOffset) * 400; // 400 = sens

  let strength = 0;
  const deadzone = 30;
  if (dt < neg - deadzone) {
    strength = 1 * (neg - dt);
  } else if (dt > pos + deadzone) {
    strength = -1 * (dt - pos);
  } else {
    for (let i = 0; i < pat.bumps.length; i++) {
      const bump = pat.bumps[i];
      const curve = direction == 0 ? bump.curveX : bump.curveY;
      const t = dt - (direction == 0 ? bump.x : bump.y);
      let s = 0;
      if (-curve < t && t < 0) {
        s += (bump.strength * (-t - curve)) / curve;
      } else if (0 < t && t < curve) {
        s += (bump.strength * (-t + curve)) / curve;
      }
      s *= direction == 0 ? pat.intensityX : pat.intensityY;
      strength += s;
    }
  }
  return strength;
}
