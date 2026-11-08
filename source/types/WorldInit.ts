export type WorldConfig = {
    world: World;
    move_speed: number;
    robots: Robot[];
};

export type World = {
    w: number;
    h: number;
};

export type Robot = {
    id: string;
    x: number;
    y: number;
    heading: number;
    energy: number;
};

export function isWorld(value: unknown): value is World {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    const world = value as Record<string, unknown>;

    return (
        typeof world.w === "number" &&
        typeof world.h === "number"
    );
}

export function isRobot(value: unknown): value is Robot {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    const robot = value as Record<string, unknown>;

    return (
        typeof robot.id === "string" &&
        typeof robot.x === "number" &&
        typeof robot.y === "number" &&
        typeof robot.heading === "number" &&
        typeof robot.energy === "number"
    );
}

export function isWorldConfig(value: unknown): value is WorldConfig {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    const config = value as Record<string, unknown>;

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