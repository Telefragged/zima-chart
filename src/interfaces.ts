
export interface Domain {
    x: [number, number],
    y: [number, number]
};

export interface Point {
    x: number,
    y: number
};

export interface Dims {
    width: number,
    height: number
};

export function pointAdd(lhs : Point, rhs: Point) : Point {
    return {x : lhs.x + rhs.x, y: lhs.y + rhs.y};
}

export function pointSub(lhs : Point, rhs: Point) : Point {
    return {x : lhs.x - rhs.x, y: lhs.y - rhs.y};
}

export function translatePoint(sourceDomain : Domain, targetDomain : Domain, point : Point) : Point {
    const sourceDims = domainDims(sourceDomain);
    const sourceCenter = domainCenter(sourceDomain);
    const targetDims = domainDims(targetDomain);
    const targetCenter = domainCenter(targetDomain);

    const diff = pointSub(point, sourceCenter);

    const wScale = targetDims.width / sourceDims.width;
    const hScale = targetDims.height / sourceDims.height;

    diff.x = diff.x * wScale;
    diff.y = diff.y * hScale;

    return pointAdd(targetCenter, diff);
}

export function domainFromPoints(point1 : Point, point2 : Point) : Domain {
    return {
        x: [
            Math.min(point1.x, point2.x),
            Math.max(point1.x, point2.x)
        ],
        y: [
            Math.min(point1.y, point2.y),
            Math.max(point1.y, point2.y)
        ]
    };
}

export function domainCenter (domain : Domain) : Point {
    return {
        x: domain.x[0] + ((domain.x[1] - domain.x[0]) / 2),
        y: domain.y[0] + ((domain.y[1] - domain.y[0]) / 2)
    };
}

export function domainDims (domain: Domain) : Dims {
    return {
        width: domain.x[1] - domain.x[0],
        height: domain.y[1] - domain.y[0]
    };
}

export function interpolate(start: number, target: number, factor: number): number {
    return start + ((target - start) * factor);
}