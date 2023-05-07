import { Circle } from "konva/lib/shapes/Circle";
import { Globals } from "./Globals"
import Konva from 'konva';


export class Node {


    public drawCircle() {
        var pos = Globals.stage.getRelativePointerPosition()
        var xMouse = pos.x
        var yMouse = pos.y
        // var circleID = 'M' + Globals.circleCount.toString()
        var circleID=Globals.circleCount;
        var circle = new Konva.Group({
            x: xMouse,
            y: yMouse,
            id:String(circleID)
        })
        circle.add(new Konva.Circle({
            // x: 0,
            // y: 0,
            radius: 20,
            fill: 'black',
            stroke: 'black',
            strokeWidth: 0,
            name:'shape',
            zIndex:1,
        }))
        circle.add(new Konva.Text({
            // x: -18,
            // y: -15,
            text:String( circleID),
            fontSize: 20,
            
            align: 'center',
            fontFamily: 'Calibri',
            fill: 'white',
            stroke:'white',
            // stroke: '2px',
            name: 'label',
            height: circle.height(),
            verticalAlign: 'middle',
        }));
        Globals.graph.set(Globals.circleCount,new Map<number,number[]>)
        Globals.linesIN.set(circleID, [])
        Globals.linesOUT.set(circleID, [])
        Globals.circleCount = Globals.circleCount + 1;
        Globals.layer.add(circle);
        Globals.nodes.push(circleID)

        let clickOnShape = () => {
            var pos = Globals.stage.getRelativePointerPosition()
            if (Globals.firstShape ==-1) {
                Globals.firstShape = circleID
                Globals.x11= pos.x
                Globals.y11 = pos.y
            
            } else {
                Globals.secondShape = circleID
                Globals.x22= pos.x
                Globals.y22 = pos.y
            }
            Globals.deletedShape = circleID
            Globals.isCircle=true;
            console.log("call back");
        console.log(Globals.deletedShape);
        }
        circle.on('click', () => { clickOnShape() })
        Globals.layer.draw();
        Globals.graph.set(circleID,new Map<number,number[]>())
        console.log(Globals.graph);
    }

        initializeStartEndNodes(){
        this.createInitialNodeWithID(0,200)
        this.createInitialNodeWithID(200,window.innerWidth-100)
       
    }




    createInitialNodeWithID(id:number,x:number){
        var xMouse = x - 50
        var yMouse = 300 - 25
        var circleID = id
        var queueCount = 0

        var circle = new Konva.Group({
            x: xMouse,
            y: yMouse,
            id: String(circleID)
        })

        circle.add(new Konva.Circle({
            x: 0,
            y: 0,
            radius:20,
            fill: 'black',
            stroke: 'black',
            strokeWidth: 0,
            name: 'shape',
            zIndex:1,
        }))
        if(circleID==200)
        var tex="E"
        else
        var tex="S"
        circle.add(new Konva.Text({
            x: 0,
            y: 0,
            text:tex ,
            fontSize: 20,
            fontFamily: 'Calibri',
            fill: 'white',
            stroke :'white',
            // stroke: '2px',
            name: 'label',
            align: 'center',
            height: circle.height(),
            verticalAlign: 'middle',
            // width: circle.radius()/50,
            // horizontalAlign:'middle',
            // padding:11,
            cornerRadius: 10,
            centeredScaling: true,
            draggable: true,
        }));
       
        // circle.add(new Konva.Text({
        //     x: 0,
        //     y: 20,
        //     text: queueCount.toString(),
        //     fontSize: 20,
        //     padding: 5,
        //     fontFamily: 'Calibri',
        //     fill: 'black',
        //     stroke: '2px',
        //     name: 'count'
        // }));

        Globals.graph.set(circleID,new Map<number,number[]>())
        console.log(Globals.graph);
        Globals.nodes.push(circleID)
        Globals.linesIN.set(circleID, [])
        Globals.linesOUT.set(circleID, [])
        let clickOnShape = () => {
            var selected = circle.findOne('.shape');
            //(<Shape>selected).fill("white")
            var pos = Globals.stage.getRelativePointerPosition()
            if (Globals.firstShape ==-1) {
                Globals.firstShape = circleID
                Globals.x11= pos.x
                Globals.y11 = pos.y
            } else {

                Globals.secondShape = circleID
                Globals.x22= pos.x
                Globals.y22 = pos.y
            }
            Globals.deletedShape = circleID
            console.log("call back");
            console.log(Globals.deletedShape);
        }
        circle.on('click', () => { clickOnShape() })
        Globals.layer.add(circle);
        Globals.layer.draw();
        
    }

}