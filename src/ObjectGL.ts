// Construido utilizando los recursos otorgados por el profesor José Carlos Vargas Del Río,
// en la clase de Gráficas Computacionales en la Universidad de Panamericana,
// y código de https://github.com/yukoba, https://github.com/yukoba/WebGLBook/tree/master/lib.
// dudas respecto a TypeScript y manejo de circulos, cubos y transformaciones en WebGL2, fue consultado via Copilot y GPT,
// el resto de código fue generado por su servidor, Omar Vidaña Rodríguez.

import { vec3, mat4 } from 'gl-matrix';

export type ObjectGL = {
    id: number;
    name: string;
    type: string;
    vertices: { position: vec3; color: [number, number, number, number] }[];
    modelMatrix: mat4;
    scale: vec3;
    rotation: vec3;
    translation: vec3;
    color: [number, number, number, number];
};

export function createEquilateralTriangleGL(id: number, color: [number, number, number, number]): ObjectGL {
    const vertices: { position: vec3; color: [number, number, number, number] }[] = [
        { position: vec3.fromValues(-0.5, 0, 0), color: color },
        { position: vec3.fromValues(0.5, 0, 0), color: color },
        { position: vec3.fromValues(0, Math.sqrt(3) * 0.5, 0), color: color },
    ];

    return {
        id: id,
        name: 'TRIANGLE_' + id,
        type: 'TRIANGLE',
        vertices: vertices,
        modelMatrix: mat4.create(),
        scale: vec3.fromValues(1, 1, 1),
        rotation: vec3.fromValues(0, 0, 0),
        translation: vec3.fromValues(0, 0, 0),
        color: color,
    };
}

export function createSquareGL(id: number, color: [number, number, number, number]): ObjectGL {
    const vertices: { position: vec3; color: [number, number, number, number] }[] = [
        { position: vec3.fromValues(-0.5, -0.5, 0), color: color },
        { position: vec3.fromValues(0.5, -0.5, 0), color: color },
        { position: vec3.fromValues(-0.5, 0.5, 0), color: color },
        { position: vec3.fromValues(0.5, 0.5, 0), color: color },
    ];

    return {
        id: id,
        name: 'SQUARE_' + id,
        type: 'SQUARE',
        vertices: vertices,
        modelMatrix: mat4.create(),
        scale: vec3.fromValues(1, 1, 1),
        rotation: vec3.fromValues(0, 0, 0),
        translation: vec3.fromValues(0, 0, 0),
        color: color,
    };
}

export function createCircleGL(id: number, color: [number, number, number, number]): ObjectGL {
    const radius = 1;
    const vertices: { position: vec3; color: [number, number, number, number] }[] = [];

    vertices.push({ position: vec3.create(), color: color });

    for (let i = 0; i < 17; i++) {
        const theta = (2 * Math.PI * i) / 16;
        const x = radius * Math.cos(theta);
        const y = radius * Math.sin(theta);
        vertices.push({ position: vec3.fromValues(x, y, 0), color: color });
    }

    return {
        id: id,
        name: 'CIRCLE_' + id,
        type: 'CIRCLE',
        vertices: vertices,
        modelMatrix: mat4.create(),
        scale: vec3.fromValues(1, 1, 1),
        rotation: vec3.fromValues(0, 0, 0),
        translation: vec3.fromValues(0, 0, 0),
        color: color,
    };
}

export function createCubeGL(id: number, color: [number, number, number, number]): ObjectGL {
    const vertices: { position: vec3; color: [number, number, number, number] }[] = [
        // Front face
        { position: vec3.fromValues(-0.5, -0.5, 0.5), color },
        { position: vec3.fromValues(0.5, -0.5, 0.5), color },
        { position: vec3.fromValues(0.5, 0.5, 0.5), color },
        { position: vec3.fromValues(-0.5, -0.5, 0.5), color },
        { position: vec3.fromValues(0.5, 0.5, 0.5), color },
        { position: vec3.fromValues(-0.5, 0.5, 0.5), color },

        // Back face
        { position: vec3.fromValues(-0.5, -0.5, -0.5), color },
        { position: vec3.fromValues(-0.5, 0.5, -0.5), color },
        { position: vec3.fromValues(0.5, 0.5, -0.5), color },
        { position: vec3.fromValues(-0.5, -0.5, -0.5), color },
        { position: vec3.fromValues(0.5, 0.5, -0.5), color },
        { position: vec3.fromValues(0.5, -0.5, -0.5), color },

        // Top face
        { position: vec3.fromValues(-0.5, 0.5, -0.5), color },
        { position: vec3.fromValues(-0.5, 0.5, 0.5), color },
        { position: vec3.fromValues(0.5, 0.5, 0.5), color },
        { position: vec3.fromValues(-0.5, 0.5, -0.5), color },
        { position: vec3.fromValues(0.5, 0.5, 0.5), color },
        { position: vec3.fromValues(0.5, 0.5, -0.5), color },

        // Bottom face
        { position: vec3.fromValues(-0.5, -0.5, -0.5), color },
        { position: vec3.fromValues(0.5, -0.5, -0.5), color },
        { position: vec3.fromValues(0.5, -0.5, 0.5), color },
        { position: vec3.fromValues(-0.5, -0.5, -0.5), color },
        { position: vec3.fromValues(0.5, -0.5, 0.5), color },
        { position: vec3.fromValues(-0.5, -0.5, 0.5), color },

        // Right face
        { position: vec3.fromValues(0.5, -0.5, -0.5), color },
        { position: vec3.fromValues(0.5, 0.5, -0.5), color },
        { position: vec3.fromValues(0.5, 0.5, 0.5), color },
        { position: vec3.fromValues(0.5, -0.5, -0.5), color },
        { position: vec3.fromValues(0.5, 0.5, 0.5), color },
        { position: vec3.fromValues(0.5, -0.5, 0.5), color },

        // Left
        { position: vec3.fromValues(-0.5, -0.5, -0.5), color },
        { position: vec3.fromValues(-0.5, -0.5, 0.5), color },
        { position: vec3.fromValues(-0.5, 0.5, 0.5), color },
        { position: vec3.fromValues(-0.5, -0.5, -0.5), color },
        { position: vec3.fromValues(-0.5, 0.5, 0.5), color },
        { position: vec3.fromValues(-0.5, 0.5, -0.5), color },
    ];

    return {
        id: id,
        name: 'CUBE_' + id,
        type: 'CUBE',
        vertices: vertices,
        modelMatrix: mat4.create(),
        scale: vec3.fromValues(1, 1, 1),
        rotation: vec3.fromValues(0, 0, 0),
        translation: vec3.fromValues(0, 0, 0),
        color: color,
    };
}
