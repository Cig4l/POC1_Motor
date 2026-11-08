export function isWorld(value) {
    if (typeof value !== "object" || value === null) {
        return false;
    }
    const world = value;
    return (typeof world.w === "number" &&
        typeof world.h === "number");
}
export function isRobot(value) {
    if (typeof value !== "object" || value === null) {
        return false;
    }
    const robot = value;
    return (typeof robot.id === "string" &&
        typeof robot.x === "number" &&
        typeof robot.y === "number" &&
        typeof robot.heading === "number" &&
        typeof robot.energy === "number");
}
export function isWorldConfig(value) {
    if (typeof value !== "object" || value === null) {
        return false;
    }
    const config = value;
    if (typeof config.move_speed !== "number") {
        return false;
    }
    if (!isWorld(config.world)) {
        return false;
    }
    if (!Array.isArray(config.robots)) {
        return false;
    }
    return config.robots.every(isRobot);
}
