export function fibonacciSphere(count: number, radius: number): [number, number, number][] {
  const points: [number, number, number][] = [];
  const offset = 2 / count;
  const increment = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i++) {
    const y = i * offset - 1 + offset / 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const phi = i * increment;
    const x = Math.cos(phi) * r;
    const z = Math.sin(phi) * r;
    points.push([x * radius, y * radius, z * radius]);
  }
  return points;
}

/** Arranges labels into horizontal tiers (rows) stacked along Y — a 3D
 * organigram: each row's items spread along X, tiers connected by a
 * vertical spine. */
export function tieredLayout(
  tierSizes: number[],
  spreadX: number,
  gapY: number
): [number, number, number][] {
  const points: [number, number, number][] = [];
  const startY = ((tierSizes.length - 1) * gapY) / 2;

  tierSizes.forEach((size, tierIndex) => {
    const y = startY - tierIndex * gapY;
    const rowWidth = (size - 1) * spreadX;
    for (let i = 0; i < size; i++) {
      const x = size === 1 ? 0 : -rowWidth / 2 + i * spreadX;
      points.push([x, y, 0]);
    }
  });

  return points;
}
