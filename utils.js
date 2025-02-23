function lerp(A, B, t){
    return A + (B - A) * t;
}

function getIntersection(A, B, C, D) {
    const deltaX = D.x - C.x;
    const deltaY = D.y - C.y;
    const tTop = deltaX * (A.y - C.y) - deltaY * (A.x - C.x);
    const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
    const bottom = deltaY * (B.x - A.x) - deltaX * (B.y - A.y);

    if (bottom === 0) return null; // Lines are parallel

    const t = tTop / bottom;
    const u = uTop / bottom;

    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
        return {
            x: lerp(A.x, B.x, t),
            y: lerp(A.y, B.y, t),
            offset: t
        };
    }

    return null;
}
