export class Globals{
    static stage: any
    static layer: any
    static points: number[] = []
    static nodes: number []=[]
    static lines: number[] = []
    static LineGain:number
    static graph:Map<number,Map<number,number[]>>= new Map<number,Map<number,number[]>>()
    //static nonTouchingLoopsGain:number[];
    static isCircle:boolean=false;
    static x11:number=0;
    static y11:number=0;
    static x22:number=0;
    static y22:number=0;

    static ForwardPaths:string[]=[];
    static ForwardPathsGains:number[]=[];
    static loops:string[]=[];
    static loopGains:number[]=[];
    static loopGainsUtil:number[]=[];
    static loopsGainMap: Map<string, number> = new Map<string, number>();
    //static nonTouchingLoops:string[][][];
    //lines entering each shape
    static linesIN: Map<number, number[]> = new Map<number, number[]>();
    //lines exiting each shape
    static linesOUT: Map<number, number[]> = new Map<number, number[]>();
    //map to link line to ids of the objects it connects to reach them when deleting
    static fromTo: Map<number, number[]> = new Map<number,number[]>();
//////////////////////////////////////////////////////////////////////////////////kol el first shapes yb2o f numbers 
    static firstShape: number 
    static secondShape: number 
    static deletedShape: number 

    static circleCount: number = 1;
    static rectCount: number = 1;
    static linesCount: number = 1;

}