// Construido utilizando los recursos otorgados por el profesor José Carlos Vargas Del Río,
// en la clase de Gráficas Computacionales en la Universidad de Panamericana,
// y código de https://github.com/yukoba, https://github.com/yukoba/WebGLBook/tree/master/lib.
// dudas respecto a TypeScript y manejo de ciertas estructuras fue consultado via Copilot y GPT,
// el resto de código fue generado por su servidor, Omar Vidaña Rodríguez.

import { ObjectGL } from './ObjectGL';

// el resto de código fue generado por su servidor, Omar Vidaña Rodríguez.
export class WebGL2 {
    private _gl: WebGL2RenderingContext;
    private _program: WebGLProgram | null = null;
    private _vertexShader: WebGLShader | null = null;
    private _fragmentShader: WebGLShader | null = null;
    private _a_Position: number = 0;
    private _a_Color: number = 0;
    private _u_ModelMatrix: WebGLUniformLocation | null = null;
    private _u_ViewMatrix: WebGLUniformLocation | null = null;
    private _u_ProjMatrix: WebGLUniformLocation | null = null;
    private _positionBuffer: WebGLBuffer | null = null;
    private _colorBuffer: WebGLBuffer | null = null;

    constructor(canvas: HTMLCanvasElement) {
        this._gl = canvas.getContext('webgl2') as WebGL2RenderingContext;
        if (!this._gl) {
            console.error('WebGL2 Context is not available');
            alert('WebGL2 Context is not available');
            return;
        }

        this._positionBuffer = this._gl.createBuffer();
        this._colorBuffer = this._gl.createBuffer();

        if (!this._positionBuffer || !this._colorBuffer) {
            console.error('Failed to create buffer');
            alert('Failed to create buffer');
            return;
        }
    }

    public get gl(): WebGL2RenderingContext {
        return this._gl;
    }

    public set gl(value: WebGL2RenderingContext) {
        this._gl = value;
    }

    public get program(): WebGLProgram | null {
        return this._program;
    }

    public set program(value: WebGLProgram | null) {
        this._program = value;
    }

    public get vertexShader(): WebGLShader | null {
        return this._vertexShader;
    }

    public set vertexShader(value: WebGLShader | null) {
        this._vertexShader = value;
    }

    public get fragmentShader(): WebGLShader | null {
        return this._fragmentShader;
    }

    public set fragmentShader(value: WebGLShader | null) {
        this._fragmentShader = value;
    }

    public get a_Position(): number {
        return this._a_Position;
    }

    public set a_Position(value: number) {
        this._a_Position = value;
    }

    public get a_Color(): number {
        return this._a_Color;
    }

    public set a_Color(value: number) {
        this._a_Color = value;
    }

    public get u_ModelMatrix(): WebGLUniformLocation | null {
        return this._u_ModelMatrix;
    }

    public set u_ModelMatrix(value: WebGLUniformLocation) {
        this._u_ModelMatrix = value;
    }

    public get u_ViewMatrix(): WebGLUniformLocation | null {
        return this._u_ViewMatrix;
    }

    public set u_ViewMatrix(value: WebGLUniformLocation) {
        this._u_ViewMatrix = value;
    }

    public get u_ProjMatrix(): WebGLUniformLocation | null {
        return this._u_ProjMatrix;
    }

    public set u_ProjMatrix(value: WebGLUniformLocation) {
        this._u_ProjMatrix = value;
    }

    public get positionBuffer(): WebGLBuffer | null {
        return this._positionBuffer;
    }

    public set positionBuffer(value: WebGLBuffer | null) {
        this._positionBuffer = value;
    }

    public get colorBuffer(): WebGLBuffer | null {
        return this._colorBuffer;
    }

    public set colorBuffer(value: WebGLBuffer | null) {
        this._colorBuffer = value;
    }

    public initShaders(vertexShader: string, fragmentShader: string): boolean {
        this.createProgram(vertexShader, fragmentShader);
        if (!this._program) {
            console.error('Failed to create program');
            alert('Failed to create program');
            return false;
        }

        this._a_Position = this._gl.getAttribLocation(this._program, 'a_Position');
        this._a_Color = this._gl.getAttribLocation(this._program, 'a_Color');

        this._u_ModelMatrix = this._gl.getUniformLocation(this._program, 'u_ModelMatrix');
        this._u_ViewMatrix = this._gl.getUniformLocation(this._program, 'u_ViewMatrix');
        this._u_ProjMatrix = this._gl.getUniformLocation(this._program, 'u_ProjMatrix');

        this._gl.useProgram(this._program);
        this._gl.enable(this._gl.DEPTH_TEST);
        this._gl.depthFunc(this._gl.LESS);
        return true;
    }

    private loadShader(type: number, source: string): WebGLShader | null {
        const shader: WebGLShader | null = this._gl.createShader(type);
        if (!shader) {
            console.error('Failed to create shader');
            alert('Failed to create shader');
            return null;
        }

        this._gl.shaderSource(shader, source);
        this._gl.compileShader(shader);
        if (!this._gl.getShaderParameter(shader, this._gl.COMPILE_STATUS)) {
            console.error('Failed to compile shader: ' + this._gl.getShaderInfoLog(shader));
            alert('Failed to compile shader: ' + this._gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }

    private createProgram(v_shader: string, f_shader: string): void {
        this._vertexShader = this.loadShader(this._gl.VERTEX_SHADER, v_shader);
        this._fragmentShader = this.loadShader(this._gl.FRAGMENT_SHADER, f_shader);

        if (!this._vertexShader || !this._fragmentShader) {
            console.error('Failed to load shaders');
            alert('Failed to load shaders');
            return;
        }

        this._program = this._gl.createProgram();
        if (!this._program) {
            console.error('Failed to create WebGL2 program');
            alert('Failed to create WebGL2 program');
            return;
        }

        this._gl.attachShader(this._program, this._vertexShader);
        this._gl.attachShader(this._program, this._fragmentShader);
        this._gl.linkProgram(this._program);

        if (!this._gl.getProgramParameter(this._program, this._gl.LINK_STATUS)) {
            console.error('Failed to link program: ' + this._gl.getProgramInfoLog(this._program));
            alert('Failed to link program: ' + this._gl.getProgramInfoLog(this._program));
            this._gl.deleteProgram(this._program);
            this._gl.deleteShader(this._fragmentShader);
            this._gl.deleteShader(this._vertexShader);
            return;
        }
    }

    private setupBuffer(buffer: WebGLBuffer, attribute: number, data: Float32Array, size: number): void {
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, buffer);
        this._gl.bufferData(this._gl.ARRAY_BUFFER, data, this._gl.STATIC_DRAW);
        this._gl.vertexAttribPointer(attribute, size, this._gl.FLOAT, false, 0, 0);
        this._gl.enableVertexAttribArray(attribute);
    }

    public draw(objects: ObjectGL[]): void {
        objects.forEach((object) => {
            const positions: number[] = [];
            const colors: number[] = [];

            object.vertices.forEach((vertex) => {
                positions.push(...vertex.position);
                colors.push(...vertex.color);
            });

            this.setupBuffer(this._positionBuffer!, this._a_Position, new Float32Array(positions), 3);
            this.setupBuffer(this._colorBuffer!, this._a_Color, new Float32Array(colors), 4);

            this._gl.uniformMatrix4fv(this._u_ModelMatrix, false, object.modelMatrix);

            let drawMode;
            switch (object.type) {
                case 'TRIANGLE':
                    drawMode = this._gl.TRIANGLES;
                    break;
                case 'SQUARE':
                    drawMode = this._gl.TRIANGLE_STRIP;
                    break;
                case 'CIRCLE':
                    drawMode = this._gl.TRIANGLE_FAN;
                    break;
                case 'CUBE':
                    drawMode = this._gl.TRIANGLES;
                    break;
                default:
                    drawMode = this._gl.POINTS;
                    break;
            }
            this._gl.drawArrays(drawMode, 0, object.vertices.length);
        });
    }

    public clearCanvas(): void {
        this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);
    }
}
