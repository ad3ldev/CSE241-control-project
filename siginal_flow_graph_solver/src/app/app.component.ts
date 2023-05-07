
import { Component } from '@angular/core';
import Konva from 'konva';
import { Globals } from './Globals';
import { Drawer } from './Drawer';
import { Node } from './Node';
import { Shape } from 'konva/lib/Shape';
import { Line } from 'konva/lib/shapes/Line';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'SFG';
  modes: number = 0
  
  gain:number=0


  /**
   * mode 0:None
   * mode 2:adding nodes
   * Mode 3:adding Line 
   * Mode 4:deleting 
 
   *  
   */
  ngAfterViewInit() {
    console.log("hello world")
    Globals.stage = new Konva.Stage({
      container: 'container',   // id of container <div>
      width: window.innerWidth
      , height: 700
    });
    Globals.layer = new Konva.Layer();
    Globals.stage.add(Globals.layer);
    var intials: Node=new Node();
    intials.initializeStartEndNodes()

  }

  onMclick() {
    if (this.modes === 2) {
      this.modes = 0;
      Globals.secondShape=-1
      Globals.firstShape=-1
      Globals.deletedShape=-1

    }
    else
      this.modes = 2;
  }


  onLclick() {
    if (this.modes === 3) {
      this.modes = 0;
      Globals.secondShape=-1
      Globals.firstShape=-1
      Globals.deletedShape=-1
    }
    else
    {
      this.modes = 3;
      this.gain=parseInt( (document.getElementById("gainn") as HTMLInputElement).value);
      Globals.LineGain=this.gain;
      console.log(this.gain);
      if(isNaN(this.gain))
      {
        window.alert("Please insert gain value before clicking on add line :");
      }
    }
  }



  onDelete() {
    if (this.modes === 4) {
      this.modes = 0;
      Globals.secondShape=-1
      Globals.firstShape=-1
      Globals.deletedShape=-1
    }
    else
      this.modes = 4;
  }



  clickScreen() {
    switch (this.modes) {
      case 0:
        Globals.firstShape = -1
        Globals.secondShape = -1
        Globals.deletedShape = -1
        break;
      case 1:
        Globals.firstShape = -1
        Globals.secondShape = -1
        Globals.deletedShape = -1
  
        this.modes = 0
        break;
      case 2:
        Globals.firstShape = -1
        Globals.secondShape = -1
        Globals.deletedShape = -1
        var node: Node = new Node();
        node.drawCircle();
        this.modes = 0
        break;
      case 3:
        if (!(Globals.firstShape === -1 || Globals.secondShape === -1)) {
          
          var line: Drawer = new Drawer()
          line.prepareLine()
          var shape1 = Globals.stage.findOne('#' + Globals.firstShape);
          var shape2 = Globals.stage.findOne('#' + Globals.secondShape);
          shape1.moveToTop()
          shape2.moveToTop()
          Globals.layer.draw()
          this.modes = 0
          Globals.firstShape = -1
          Globals.secondShape = -1
          Globals.deletedShape = -1
          this.refresh()
        }
        

        break;

      case 4:
       
        if (Globals.deletedShape != -1) {
          if (Globals.deletedShape === 0 || Globals.deletedShape === 200) {
            alert("Can't Delete start and end points!")
            Globals.deletedShape =-1
            Globals.firstShape=-1
            Globals.secondShape=-1
            return
          }
           if(Globals.isCircle){
                //  this.deleteElementFromArray(Globals.nodes, Globals.deletedShape);
                Globals.stage.findOne('#' + String(Globals.deletedShape)).destroy()
                 this.deleteConnectionsOfShape(Globals.deletedShape)
              
               }
          else{
            this.deleteElementFromArray(Globals.lines, Globals.deletedShape);
            this.deleteConnectionsOfaLine(Globals.deletedShape);
          }
        }
        this.modes = 0
        Globals.deletedShape = -1
        break

      case 5:
        this.modes = 0
        Globals.secondShape=-1
        Globals.firstShape=-1
        Globals.deletedShape=-1
        break;
      case 6:
        this.modes = 0
        Globals.secondShape=-1
        Globals.firstShape=-1
        Globals.deletedShape=-1
        break;
      
      case 7:
        if (!(Globals.firstShape === -1 || Globals.secondShape === -1)) {
        var line: Drawer = new Drawer()
        line.prepareArc()
        var shape1 = Globals.stage.findOne('#' + Globals.firstShape);
        var shape2 = Globals.stage.findOne('#' + Globals.secondShape);
        shape1.moveToTop()
        shape2.moveToTop()
        Globals.layer.draw()
        this.modes = 0
        Globals.firstShape = -1
        Globals.secondShape = -1
        Globals.deletedShape = -1
        this.refresh()
        }
        break;
    }
  }
  onCclick() {
    if (this.modes === 3) {
      this.modes = 0;
      Globals.secondShape=-1
      Globals.firstShape=-1
      Globals.deletedShape=-1
    }
    else
    {
      this.modes = 7;
      this.gain=parseInt( (document.getElementById("gainn") as HTMLInputElement).value);
      Globals.LineGain=this.gain;
      console.log(this.gain);
      if(isNaN(this.gain))
      {
        window.alert("Please insert gain value before clicking on add line :");
      }
    }
  }

  refresh() {
    Globals.layer.draw();
  }

  getMousePosition(): any {
    return Globals.stage.getRelativePointerPosition()
  }



  deleteConnectionsOfShape(shapeId: number) {
   
  var neighbourArray=Globals.graph.get(shapeId)
  if(neighbourArray!=undefined)
  {
  for(let nbr of neighbourArray.keys())
  {
    var neighbours=neighbourArray.get(nbr)
    if((neighbours!==undefined))
     {
      var del=neighbours[1];
     Globals.stage.findOne('#' + String(neighbours[1])).destroy();
     }
    Globals.stage.findOne('#' + String(neighbourArray.keys)).destroy()
  }
}
   Globals.graph.delete(shapeId);

   for(let node of Globals.graph.keys())
   {
     var delline=Globals.graph.get(node)?.get(shapeId);

     if((delline!==undefined))
     {
        var dell =delline[1];
     Globals.graph.get(node)?.delete(shapeId);
     Globals.stage.findOne('#' + String(dell)).destroy()
     }

   }
  }



  deleteConnectionsOfaLine(lineID: number) {
    var connectionArray = Globals.fromTo.get(lineID)!
    var from = connectionArray[0]
    //now go to the other end and delete the line id
    var firstEndArray = Globals.linesOUT.get(from)!
    this.deleteElementFromArray(firstEndArray, lineID)
    var connectionArray = Globals.fromTo.get(lineID)!
    var to = connectionArray[1]
    //now go to the other end of the line and delete the line id
    var otherEndArray = Globals.linesIN.get(to)!
    this.deleteElementFromArray(otherEndArray, lineID)

    Globals.stage.findOne('#' + lineID).destroy()
    this.deleteElementFromArray(Globals.lines, lineID)

    Globals.fromTo.delete(lineID)
  }

  deleteElementFromArray(arr: number[], target: number) {
    console.log(arr);
    var index = arr.indexOf(target, 0);
    if (index > -1) {
      arr.splice(index, 1);
    }
  }



  onClear(){
    Globals.layer.destroy()
    Globals.layer=new Konva.Layer()
    Globals.stage.add(Globals.layer)

    Globals.linesCount=1
    Globals.rectCount=1
    Globals.circleCount=1

    Globals.firstShape=-1
    Globals.secondShape=-1
    Globals.deletedShape=-1

    Globals.linesIN=new Map<number, number[]>()
    Globals.linesOUT=new Map<number, number[]>()
    Globals.fromTo=new Map<number, number[]>()

    Globals.lines=[]
    Globals.points=[]
    //Globals.queues=[]
    Globals.nodes=[]
    
   Globals.graph= new Map<number,Map<number,number[]>>()

    this.modes=0;
    var initials: Node = new Node()
    initials.initializeStartEndNodes()

    this.allListsEmpty()
  }
  allListsEmpty(){
    Globals.ForwardPaths=[]
    Globals.ForwardPathsGains=[]
    Globals.loops=[]
    Globals.loopGains=[]
    Globals.loopGainsUtil=[]
    Globals.loopsGainMap=new Map<string,number>()
  }
 
  GetForwardPaths(s:number,d:number){
    let isVisited:boolean[]=[];
    for(let i=0;i<Globals.circleCount+2;i++){
         isVisited[i]=false;
      
    }
    isVisited[200]=false;
    let path :string="";
    let gain:number=1;
    path=path+"S";
    this.GetForwardPathsUtil(s, d, isVisited, path,gain);
  }
  //////////////////////////////////////////////////////////////////////////////////////
  GetForwardPathsUtil(u:number,d:number,isVisited:boolean[],path:string,gain:number)
  {  
  isVisited[u] = true;
  let neighbourMap=Globals.graph.get(u);
  if(neighbourMap!=undefined)
  {
      for (let nbr of neighbourMap.keys()) {
        let x:string=String(nbr);
        if(nbr==0)
          x='S';
        else if(nbr==200)
          x='E';
        if(!isVisited[nbr])
        {
        path=path+","+x;
        var len=String(x).length;
        var newGain=neighbourMap.get(nbr);
        if(newGain!=undefined){
           gain=gain*newGain[0];
           Globals.loopGainsUtil.push(newGain[0]);
        }
        this.GetForwardPathsUtil(nbr,d,isVisited,path,gain);
        path=path.substring(0,path.length-len-1);
        if(newGain!=undefined)
           gain=gain/newGain[0];
        }
        else 
        {
          var ind=path.indexOf(String(x));
          var loop:string=path.substring(ind,path.length)+","+String(x);
          var commas=path.substring(0,ind+1).split(",").length - 1
          Globals.loops.push(loop);
          console.log(loop);
          console.log(ind);
          console.log(path);
          console.log(Globals.loopGainsUtil);
          console.log(x);
          var loopGain:number=1;
          for(let i=commas;i<Globals.loopGainsUtil.length;i++){
            loopGain*=Globals.loopGainsUtil[i]
            console.log("hhhh"+Globals.loopGainsUtil[i])
            console.log(gain)
          }
          var newGain=neighbourMap.get(nbr);
          if(newGain!=undefined){
            loopGain=loopGain*newGain[0];
          //  Globals.loopGainsUtil.push(newGain[0]);
          }
          Globals.loopGains.push(loopGain);
          Globals.loopsGainMap.set(loop,loopGain)
          console.log("elseeeeee")
          console.log("path: "+path)
          console.log("loop: "+loop)
          console.log("util: ")
          console.log(Globals.loopGainsUtil)
          console.log("commas: "+commas)
          console.log("gain : "+gain)
        }
      }
      Globals.loopGainsUtil.pop();
      isVisited[u] = false;
  }
  if (u == (d)) 
    {
      Globals.ForwardPaths.push(path);
      Globals.ForwardPathsGains.push(gain);
      return;
    }//el d et7tat wla la2?
 }

removeDoublicates (){
  let loops2D:string[][] = Globals.loops.map(sentence => sentence.split(','))
  //let bbb:String[]=[]
  for(let i=0;i<loops2D.length;i++){
    loops2D[i]=loops2D[i].filter((value,index)=>loops2D[i].indexOf(value)==index).sort((n1,n2) => {
      if (n1 > n2) {
          return 1;
      }
      if (n1 < n2) {
          return -1;
      }
      return 0;
    });
    
  }
  for(let i=0;i<Globals.loops.length;i++){
    for(let j=i+1;j<Globals.loops.length;j++){
  
      if(loops2D[i].toString()==loops2D[j].toString()){
        Globals.loops.splice(j,1);
        loops2D.splice(j,1);
        j--;
        
      }
    }
  //   let mySet: Set<string> = new Set(loops2D[i]);
  }

}

isTwoNonTouching(cycle1:string[],cycle2:string[]) {
  for (var i = 0; i < cycle1.length; i++){
      for (var j = 0; j < cycle2.length; j++){
          if(cycle1[i] == cycle2[j]){
              return false;
          }
      }
  }
  return true;
}
isNonTouching(cycles:string[]){ //give it array of arrays 2 or 3 or .........
  for(var i = 0; i < cycles.length; i++){
      for (var j = i+1; j < cycles.length; j++){
          if(!this.isTwoNonTouching(cycles[i].split(","),cycles[j].split(","))){
              return false;
          }
      }
  }
  return true;
}

k_combinations(this:any,array:string[], k:number){
  var i, j, combs, head, tailcombs;
  if (k > array.length || k <= 0) {
      return [];
  }
  if (k == array.length) {
      return [array];
  }
  if (k == 1) {
      combs = [];
      for (i = 0; i < array.length; i++) {
          combs.push([array[i]]);
      }
      return combs;
  }
  combs = [];
  for (i = 0; i < array.length - k + 1; i++) {
      head = array.slice(i, i + 1);
      tailcombs = this.k_combinations(array.slice(i + 1), k -1);
      for (j = 0; j < tailcombs.length; j++) {
          combs.push(head.concat(tailcombs[j]));
      }
  }
  return combs;
}
 getNonTouchingLoops(cycles:string[]){
  var i = 1;
  var nonTouchingLoops = [];
  while(true){
      var allICompinations = this.k_combinations(cycles,i);
      var nontouchingICompination = []
      for(var j = 0; j < allICompinations.length; j++){
          if(this.isNonTouching(allICompinations[j])){
              nontouchingICompination.push(allICompinations[j]);
          }
      }
      if(nontouchingICompination.length == 0){
          break;
      }
      nonTouchingLoops.push(nontouchingICompination);
      i++
  }
  console.log(nontouchingICompination);
  console.log(allICompinations);

  return nonTouchingLoops;
}
getLoopGainsOfNonTouchingLoops(arr:string[][]){
  let sum=0
  
  for (let currNonTouching of arr){
    let product=1
    for (let loop of currNonTouching){
      let gain=Globals.loopsGainMap.get(loop)
      if (gain!=undefined)
      {
        product*=gain
      }
    }
    sum+=product;
  }
  console.log("map")
  console.log(Globals.loopsGainMap)
  console.log("calculate gain")
  console.log(arr)
  console.log("sum="+sum)
  return sum;
}
calculateDelta(arr:string[][][]){
  let x=0;
  let delta=1
  for (let i=0;i<arr.length;i++){
    if(x%2==0)
      delta-=this.getLoopGainsOfNonTouchingLoops(arr[i]);
    else
      delta+=this.getLoopGainsOfNonTouchingLoops(arr[i]);
    x++;
  }
  return delta;
}
calculateDeltaI(path:string){
  //eleminate all loops that is touching with this path
  var newLoops:string[]=[];
  var loopsGainMap:Map<string,number>=new Map<string,number>();
  for (let i=0 ;i<Globals.loops.length;i++){
      if(this.isTwoNonTouching(path.split(","),Globals.loops[i].split(","))){
        newLoops.push(Globals.loops[i])
      }
  }
  console.log("non touchint with"+path+"path")
  console.log(newLoops);
  return this.calculateDelta(this.getNonTouchingLoops(newLoops));
}
calculateTransferFunction(){
  let numerator:number=0
  for(let i=0;i<Globals.ForwardPaths.length;i++){
      numerator+=Globals.ForwardPathsGains[i]*this.calculateDeltaI(Globals.ForwardPaths[i]);
  }
  return numerator/this.calculateDelta(this.getNonTouchingLoops(Globals.loops))
}
onSolve(){
  this.GetForwardPaths(0,200);
  this.removeDoublicates();
 
  var resultText = document.getElementById('result');
  if(resultText!=null)
    resultText.innerHTML = "overall gain = " + this.calculateTransferFunction();

  var forwardPathsText = document.getElementById('forwardPaths');
  if(forwardPathsText!=null){
  forwardPathsText.innerHTML = "";
  for (let i = 1; i <=Globals.ForwardPaths.length; i++) {
        forwardPathsText.innerHTML += "P" + i + " : {" + Globals.ForwardPaths[i-1] + "}<br>";
    }
  }


  //loops
  var cyclesText = document.getElementById('cycles');
  if(cyclesText!=null){
    cyclesText.innerHTML = "";
    for (let i = 1; i <= Globals.loops.length; i++) {
        cyclesText.innerHTML += "L" + i + " : {" + Globals.loops[i - 1]+ "}<br>";
    }
  }

      //non touching loops
    let nonTouchingLoopsResultForAll=this.getNonTouchingLoops(Globals.loops)
    let nonTouchingLoopsResult=nonTouchingLoopsResultForAll.slice(1,nonTouchingLoopsResultForAll.length) 
    var nonTouchingLoopsText = document.getElementById('nonTouchingLoops');
    if(nonTouchingLoopsText!=null){
      nonTouchingLoopsText.innerHTML = "";
      //nonTouchingLoopsText.innerHTML = joinSubArrays(nonTouchingLoops, '<br> ');
      for (let i = 1; i <= nonTouchingLoopsResult.length; i++) {
          nonTouchingLoopsText.innerHTML += i + 1 + "-non touching : <br>";
          for (let j = 1; j <= nonTouchingLoopsResult[i -1].length; j++) {
              for (let k = 1; k <= nonTouchingLoopsResult[i - 1][j - 1].length; k++) {
                  nonTouchingLoopsText.innerHTML += "{" + nonTouchingLoopsResult[i - 1][j - 1][k - 1] + "}  &nbsp;";
              }
              nonTouchingLoopsText.innerHTML += "<br>";
          }
      }
    }

    //deltas
    var deltasText = document.getElementById('deltas');
    if(deltasText !=null){
    deltasText.innerHTML = "";
    deltasText.innerHTML += "&Delta; = " + this.calculateDelta(nonTouchingLoopsResultForAll) + "<br>";
    console.log(Globals.ForwardPaths.length);
    for (let i = 1; i <= Globals.ForwardPaths.length; i++) {
        deltasText.innerHTML += "&Delta;" + i + " = " + this.calculateDeltaI(Globals.ForwardPaths[i - 1]).toString() + "<br>";
    }
    }
  this.allListsEmpty()
}

onSave(){
 window.prompt("enter the ful path")

}
onLoad(){
  window.prompt("enter the ful path")
}


}
