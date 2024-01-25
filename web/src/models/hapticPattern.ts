export interface HapticPattern {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  steps: number;
  bumps: Bump[];
  intensity: number;
}

export interface Bump {
  direction: number;
  t: number;
  strength: number;
  curve: number;
}

export function calculateLinearHapticPattern(
  direction: number,
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
  steps: number
): HapticPattern {
  const min = direction === 0 ? xMin : yMin;
  const max = direction === 0 ? xMax : yMax;
  const bumps: Bump[] = [...Array(steps - 1).keys()].map((i) => ({
    direction,
    t: (min * (steps - 1.5 - i) + max * (i + 0.5)) / (steps - 1),
    strength: 1,
    curve: (max - min) / (steps - 1) / 2
  }));
  return {
    xMin,
    xMax,
    yMin,
    yMax,
    steps,
    bumps,
    intensity: 3
  };
}

function softlin(x: number): number {
  return (Math.tanh(x - 2) + 1) / 2;
}

export function testHaptic(
  direction: number,
  pat: HapticPattern,
  angle: number,
  mouseOffset: number
): number {
  const neg = direction == 0 ? pat.xMin : pat.yMin;
  const pos = direction == 0 ? pat.xMax : pat.yMax;

  const dt = (angle - mouseOffset) * 400; // 400 = sens

  let strength = 0;
  const deadzone = direction == 0 ? -30 : 100;
  if (dt < neg - deadzone) {
    strength = 10 * softlin(-(dt - (neg - deadzone)));
  } else if (dt > pos + deadzone) {
    strength = -10 * softlin(dt - (pos + deadzone));
  } else {
    for (let i = 0; i < pat.bumps.length; i++) {
      const bump = pat.bumps[i];
      if (direction !== bump.direction) continue;

      const curve = bump.curve;
      const t = dt - bump.t;
      let s = 0;
      if (-curve < t && t < 0) {
        s += (bump.strength * (-t - curve)) / curve;
      } else if (0 < t && t < curve) {
        s += (bump.strength * (-t + curve)) / curve;
      }
      s *= pat.intensity;
      strength += s;
    }
  }
  return strength;
}
