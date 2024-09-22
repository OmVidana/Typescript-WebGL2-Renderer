// Construido utilizando los recursos otorgados por el profesor José Carlos Vargas Del Río,
// en la clase de Gráficas Computacionales en la Universidad de Panamericana,
// y código de https://github.com/yukoba, https://github.com/yukoba/WebGLBook/tree/master/lib.
// el manejo de eventos y dudas respecto a manejar los ObjectGL.ts fue consultado via Copilot y GPT,
// el resto de código fue generado por su servidor, Omar Vidaña Rodríguez.

import { vec3, mat4 } from 'gl-matrix';
import { WebGL2 } from './WebGL2.ts';
import {
    createCircleGL,
    createCubeGL,
    createEquilateralTriangleGL,
    createSquareGL,
    ObjectGL,
} from './ObjectGL.ts';

//Functional Elements
const objectsHierarchyContainer = document.getElementById(
    'objectsHierarchyContainer',
) as HTMLDivElement;
const canvas = document.getElementById('glCanvas') as HTMLCanvasElement;
const scaleX = document.getElementById('scaleX') as HTMLInputElement;
const scaleY = document.getElementById('scaleY') as HTMLInputElement;
const scaleZ = document.getElementById('scaleZ') as HTMLInputElement;
const rotateX = document.getElementById('rotateX') as HTMLInputElement;
const rotateY = document.getElementById('rotateY') as HTMLInputElement;
const rotateZ = document.getElementById('rotateZ') as HTMLInputElement;
const translateX = document.getElementById('translateX') as HTMLInputElement;
const translateY = document.getElementById('translateY') as HTMLInputElement;
const translateZ = document.getElementById('translateZ') as HTMLInputElement;
const colorPicker = document.getElementById('colorPicker') as HTMLInputElement;
const addTriangle = document.getElementById('addTriangle') as HTMLButtonElement;
const addSquare = document.getElementById('addSquare') as HTMLButtonElement;
const addCircle = document.getElementById('addCircle') as HTMLButtonElement;
const addCube = document.getElementById('addCube') as HTMLButtonElement;

//Display Elements
const scaleXText = document.getElementById('scaleXValue') as HTMLSpanElement;
const scaleYText = document.getElementById('scaleYValue') as HTMLSpanElement;
const scaleZText = document.getElementById('scaleZValue') as HTMLSpanElement;
const rotateXText = document.getElementById('rotateXValue') as HTMLSpanElement;
const rotateYText = document.getElementById('rotateYValue') as HTMLSpanElement;
const rotateZText = document.getElementById('rotateZValue') as HTMLSpanElement;
const translateXText = document.getElementById(
    'translateXValue',
) as HTMLSpanElement;
const translateYText = document.getElementById(
    'translateYValue',
) as HTMLSpanElement;
const translateZText = document.getElementById(
    'translateZValue',
) as HTMLSpanElement;

const webgl2: WebGL2 = new WebGL2(canvas);

const VSHADER_SOURCE = `
    attribute vec4 a_Position;
    attribute vec4 a_Color;
    varying vec4 v_FragColor;
    uniform mat4 u_ModelMatrix;
    uniform mat4 u_ViewMatrix;
    uniform mat4 u_ProjMatrix;
    void main() {
        gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
        v_FragColor = a_Color;
        gl_PointSize = 10.0;
    }`;

const FSHADER_SOURCE = `
    precision mediump float;
    varying vec4 v_FragColor;
    void main() {
        gl_FragColor = v_FragColor;
    }`;

if (!webgl2.initShaders(VSHADER_SOURCE, FSHADER_SOURCE)) {
    let message = 'Failed to initialize shaders';
    console.error(message);
    alert(message);
    throw new Error(message);
}

let objectsMap: Map<number, ObjectGL> = new Map<number, ObjectGL>();
let selectedId: number | null = null;
let nextObjectId = 1;

const viewMatrix = mat4.create();
const projMatrix = mat4.create();

mat4.lookAt(viewMatrix, [0, 0, 10], [0, 0, -15], [0, 1, 0]);
mat4.perspective(
    projMatrix,
    Math.PI / 4,
    canvas.width / canvas.height,
    0.1,
    100,
);

setupListeners();

// Function for drawing program:
function draw(): void {
    webgl2.clearCanvas();
    if (webgl2.u_ModelMatrix && webgl2.u_ViewMatrix) {
        webgl2.gl.uniformMatrix4fv(webgl2.u_ViewMatrix, false, viewMatrix);
        webgl2.gl.uniformMatrix4fv(webgl2.u_ProjMatrix, false, projMatrix);
    }

    webgl2.draw(Array.from(objectsMap.values()));
}

//Functions for Objects manipulation:
function addObject(object: ObjectGL): void {
    const id = nextObjectId;
    checkName(object, id);
    objectsMap.set(id, object);

    const objectElement = document.createElement('div') as HTMLDivElement;
    objectElement.id = object.name.toString();
    objectElement.className =
        'flex rounded-md items-center text-secondary h-16 my-2 p-2';
    objectElement.dataset.id = id.toString();

    const span = document.createElement('span') as HTMLSpanElement;
    span.id = object.name.toString();
    span.className =
        'w-[70%] h-full flex items-center justify-center text-lg font-semibold mr-2';
    span.contentEditable = 'true';
    span.textContent = object.name;
    span.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            object.name = span.textContent || object.name;
            span.blur();
        }
    });

    const deleteButton = document.createElement('button') as HTMLButtonElement;
    deleteButton.id = 'delete';
    deleteButton.className =
        'w-[30%] h-full bg-tertiary-900 hover:bg-tertiary-400 text-tertiary hover:text-tertiary-900 font-semibold rounded-lg transition duration-300';
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', (e: MouseEvent) => {
        e.stopPropagation();
        deleteObject(id, objectElement);
    });

    objectElement.appendChild(span);
    objectElement.appendChild(deleteButton);

    objectElement.addEventListener('click', () =>
        selectObject(id, objectElement),
    );

    objectsHierarchyContainer.appendChild(objectElement);
    selectObject(id, objectElement);
    draw();
    nextObjectId++;
}

function selectObject(id: number, objectElement: HTMLDivElement): void {
    if (selectedId === id) {
        deselectObject();
    } else {
        if (selectedId !== null) deselectObject();

        objectElement.classList.add('bg-primary-400', 'text-primary');
        selectedId = id;
        updateTransformInputs(id);
        draw();
    }
}

function deselectObject(): void {
    if (selectedId !== null) {
        const previousElement = objectsHierarchyContainer.querySelector(
            `[data-id="${selectedId}"]`,
        );
        if (previousElement) {
            previousElement.classList.remove('bg-primary-400', 'text-primary');
        }
        selectedId = null;
        resetTransformInputs();
    }
}

function deleteObject(id: number, objectElement: HTMLDivElement): void {
    if (objectsMap.delete(id)) {
        deselectObject();
        objectsHierarchyContainer.removeChild(objectElement);

        if (selectedId === id) {
            deselectObject();
        }

        const remainingIds = Array.from(objectsMap.keys());
        if (remainingIds.length > 0) {
            const newSelectedId = remainingIds[remainingIds.length - 1];
            const newSelectedElement = objectsHierarchyContainer.querySelector(
                `[data-id="${newSelectedId}"]`,
            ) as HTMLDivElement;
            if (newSelectedElement) {
                selectObject(newSelectedId, newSelectedElement);
            }
        }
    }

    draw();
}

function checkName(object: ObjectGL, nextId: number): void {
    let duplicateExists = false;

    for (const container of objectsHierarchyContainer.querySelectorAll(
        '[data-id]',
    )) {
        if (container.id === object.name) {
            duplicateExists = true;
            break;
        }
    }

    object.id = duplicateExists ? nextId + 1 : nextId;
    object.name = `${object.type}_${object.id}`;
}

function updateTransformInputs(id: number): void {
    const object: ObjectGL | undefined = objectsMap.get(id);
    if (object) {
        scaleXText.textContent = scaleX.value = object.scale[0].toFixed(2);
        scaleYText.textContent = scaleY.value = object.scale[1].toFixed(2);
        scaleZText.textContent = scaleZ.value = object.scale[2].toFixed(2);
        rotateXText.textContent = rotateX.value = object.rotation[0].toFixed(2);
        rotateYText.textContent = rotateY.value = object.rotation[1].toFixed(2);
        rotateZText.textContent = rotateZ.value = object.rotation[2].toFixed(2);
        translateXText.textContent = translateX.value =
            object.translation[0].toFixed(2);
        translateYText.textContent = translateY.value =
            object.translation[1].toFixed(2);
        translateZText.textContent = translateZ.value =
            object.translation[2].toFixed(2);

        const colorHex = `#${object.color
            .slice(0, 3)
            .map((c) =>
                Math.round(c * 255)
                    .toString(16)
                    .padStart(2, '0'),
            )
            .join('')}`;
        colorPicker.value = colorHex;
    } else {
        resetTransformInputs();
    }
}

function resetTransformInputs(): void {
    scaleXText.textContent = scaleX.value = '1.00';
    scaleYText.textContent = scaleY.value = '1.00';
    scaleZText.textContent = scaleZ.value = '1.00';
    rotateXText.textContent = rotateX.value = '0.00';
    rotateYText.textContent = rotateY.value = '0.00';
    rotateZText.textContent = rotateZ.value = '0.00';
    translateXText.textContent = translateX.value = '0.00';
    translateYText.textContent = translateY.value = '0,00';
    translateZText.textContent = translateZ.value = '0.00';
    colorPicker.value = '#ffffff';
}

function setupListeners(): void {
    canvas.addEventListener('load', () => {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientWidth;
    });

    canvas.addEventListener('resize', () => {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientWidth;
        mat4.perspective(
            projMatrix,
            Math.PI / 4,
            canvas.width / canvas.height,
            0.1,
            100,
        );
    });

    setupTransformListeners();
    setupShapeListeners();
}

function setupTransformListeners(): void {
    const updateTransform = () => {
        if (selectedId !== null) {
            let object = objectsMap.get(selectedId);
            if (object) {
                object.scale = vec3.fromValues(
                    parseFloat(scaleX.value),
                    parseFloat(scaleY.value),
                    parseFloat(scaleZ.value),
                );
                object.rotation = [
                    parseFloat(rotateX.value),
                    parseFloat(rotateY.value),
                    parseFloat(rotateZ.value),
                ];
                object.translation = vec3.fromValues(
                    parseFloat(translateX.value),
                    parseFloat(translateY.value),
                    parseFloat(translateZ.value),
                );

                const color = colorPicker.value;
                object.color = [
                    parseInt(color.slice(1, 3), 16) / 255,
                    parseInt(color.slice(3, 5), 16) / 255,
                    parseInt(color.slice(5, 7), 16) / 255,
                    1.0,
                ];

                object.vertices.map((vertex) => {
                    vertex.color = object.color;
                    return vertex;
                });

                mat4.identity(object.modelMatrix);
                mat4.translate(
                    object.modelMatrix,
                    object.modelMatrix,
                    object.translation,
                );
                mat4.rotateX(
                    object.modelMatrix,
                    object.modelMatrix,
                    (object.rotation[0] * Math.PI) / 180,
                );
                mat4.rotateY(
                    object.modelMatrix,
                    object.modelMatrix,
                    (object.rotation[1] * Math.PI) / 180,
                );
                mat4.rotateZ(
                    object.modelMatrix,
                    object.modelMatrix,
                    (object.rotation[2] * Math.PI) / 180,
                );
                mat4.scale(
                    object.modelMatrix,
                    object.modelMatrix,
                    object.scale,
                );

                objectsMap.set(selectedId, object);
                draw();
            }
        }
    };

    scaleX.addEventListener('input', updateTransform);
    scaleY.addEventListener('input', updateTransform);
    scaleZ.addEventListener('input', updateTransform);
    rotateX.addEventListener('input', updateTransform);
    rotateY.addEventListener('input', updateTransform);
    rotateZ.addEventListener('input', updateTransform);
    translateX.addEventListener('input', updateTransform);
    translateY.addEventListener('input', updateTransform);
    translateZ.addEventListener('input', updateTransform);
    colorPicker.addEventListener('input', updateTransform);
}

function setupShapeListeners(): void {
    addTriangle.addEventListener('click', () => {
        const color: [number, number, number, number] = [1, 1, 1, 1];
        const triangle = createEquilateralTriangleGL(nextObjectId, color);
        addObject(triangle);
    });
    addSquare.addEventListener('click', () => {
        const color: [number, number, number, number] = [1, 1, 1, 1];
        const square = createSquareGL(nextObjectId, color);
        addObject(square);
    });
    addCircle.addEventListener('click', () => {
        const color: [number, number, number, number] = [1, 1, 1, 1];
        const circle = createCircleGL(nextObjectId, color);
        addObject(circle);
    });
    addCube.addEventListener('click', () => {
        const color: [number, number, number, number] = [1, 1, 1, 1];
        const cube = createCubeGL(nextObjectId, color);
        addObject(cube);
    });
}
