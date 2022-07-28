let lastkey
let showCursor=true
let cursorCount=0
let running=false
let pointer=0
let test=false
let heart=false
let keepRunning=false
let success=false

function getName()
{
    return 'SUBLEQ()';
}
 
function randRange(min,max){
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function loadLevel(){
    regTable={}
    origRegTable={}
    for(i=0;i<8;i++){
        regTable[i]=0
    }
    for(i=0;i<8;i++){
    if(levelRegValues[curLevel][i][curCase]=="any"){
        regTable[i]=randRange(-9,9)
        origRegTable[i]=regTable[i]
    }else if(levelRegValues[curLevel][i][curCase]=="neg"){
        regTable[i]=randRange(-9,-1)
        origRegTable[i]=regTable[i]
    }else if(levelRegValues[curLevel][i][curCase]=="pos"){
        regTable[i]=randRange(1,9)
        origRegTable[i]=regTable[i]
    }else if(levelRegValues[curLevel][i][curCase]=="same"){
        regTable[curLevel][i][curCase]==regTable[curLevel][i-1][curCase]
    }else{
        regTable[i]=levelRegValues[curLevel][i][curCase]
        origRegTable[i]=regTable[i]
    }
    
    }
}
 
function checkWin(){
    if(curLevel==0){
        if(regTable[0]==origRegTable[0]-origRegTable[1]&&regTable[1]==0){
            return true
        }
    }else if(curLevel==1){
        if(regTable[1]==origRegTable[0]+origRegTable[1]){
            return true
        }
    }else if(curLevel==2||curLevel==4){
        if(regTable[0]==Math.abs(origRegTable[0])){
            return true
        }
    }else if(curLevel==3){
        if(regTable[0]==0&&origRegTable[0]>-1||regTable[0]<0&&origRegTable[0]<0){
            return true
        }
    }else if(curLevel==5){
        if(regTable[0]==origRegTable[0]*origRegTable[1]){
            return true
        }
    }else if(curLevel==7){
        if(origRegTable[0]>=origRegTable[1]&&regTable[0]==origRegTable[0]||origRegTable[1]>=origRegTable[0]&&regTable[0]==origRegTable[1]){
            return true
        }
    }else if(curLevel==6){
        if(origRegTable[0]==origRegTable[1]&&regTable[0]==origRegTable[0]||origRegTable[0]!=origRegTable[1]&&regTable[0]==0){
            return true
        }
    }else if(curLevel==8){
        if(regTable[0]==Math.floor(origRegTable[0]/origRegTable[1])&&regTable[1]==origRegTable[0]%origRegTable[1]){
            return true
        }
    }
    return false
}
function onConnect()
{
    data=loadData()
    if(data==""){
        data="00000000000"
        //------------v
        //1 bit: curLevel, repeat X10{one bit: beaten level?} repeating X10{468 spaces, representing characters in code box (26*18)}
        spaces="                          "
        blankLevel=""
        for (i=0;i<18;i++){
            blankLevel=blankLevel + spaces
        }
        //level0="ab                        b                         WELCOME TO SUBLEQ!        SUBLEQ IS A PROGRAMMING   LANGUAGE WITH ONE         OPERATION: SUBLEQ(). INPUTIS ONE TO THREE LETTERS   LETS IGNORE THIRD FOR NOW.THE FIRST LETTER IS THE   REGISTER YOU WANT TO ALTERTHE SECOND LETTER IS THE  REGISTER WHOSE VALUE WILL BE SUBTRACTED FROM THE    FIRST. A LETTER ON ITS OWNIS SUBTRACTED FROM ITSELF.PRESS TAB TO RUN THIS     CODE (LOWERCASE IS CODE   CAPITALS ARE COMMENTS)    "
        level0="CAPITAL LETTERS ARE NOTES LOWERCASE LETTERS ARE CODE                          ab (REG A ═ A-B)          b  (2ND B IMPLIED.B═B-B═0)                                                                    READ GOAL>                                   CHANGE REGISTERS>                                                                               PRESS -TAB- TO RUN CODE                                                                                 PASS THREE CASES TO WIN >"
        data=data+level0
        for (i=0;i<2;i++){
            data=data + blankLevel
        }
        //levelX="abk                       a                                                                                                                                                           GREAT JOB! LETS TALK ABOUTTHAT THIRD LETTER. IT CAN BE ANY LETTER I-J AND     IT REPRESENTS THE LINE THECODE SHOULD JUMP TO IF THEVALUE OF THE FIRST LETTER MINUS THE SECOND IS LESS  THAN OR EQUAL TO ZERO.    IF A LETTER I-J IS PLACED BY ITSELF THE CODE WILL   JUST JUMP TO THAT LINE.   "
        levelX="LETTERS I-J ═ JUMP TO LINEw (JUMPS TO LINE W)                                                                                                                                                                                                                                                                                                     CONDITIONAL JUMP          abz(IF A - B IS LESS OR   EQUAL TO 0 JUMP TO LINE Z)a (A ═ A - A ═ 0)                                   "
        
        data=data+levelX
        for (i=0;i<5;i++){
            data=data + blankLevel
        }
        //level1="                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    "
        level9="BY GALACTICAL             GALACTICAL.ITCH.IO                                  LEVEL 0: 3 CHARS          LEVEL 1: 4 CHARS          LEVEL 2: 7 CHARS          LEVEL 3: 4 CHARS          LEVEL 4: 10 CHARS         LEVEL 5: 10 CHARS         LEVEL 6: 11 Chars         LEVEL 7: 12 CHARS         LEVEL 8: 24 CHARS                                                                                                                                                                     "
        data=data+level9
    }

    if(data.substring(1,11)=="1111111111"){
        heart=true
    }

    // 56 * 20 character resolution
    lastKey = '';
    qwerty = "q w e r t y u i o p a s d f g h j k l z x c v b n m "
    //screen positions
    codeX=4
    registerX=35
    registerY=11
    registerW=5
    registerH=4
    codeTextX=7
    codeTextY=1
    cursor=0
    regString1="abcd"
    regString2="efgh"
    registers="abcdefgh"
    letters="abcdefghijklmnopqrstuvwxyz"
    lines="ijklmnopqrstuvwxyz"
    regTable={}
    for(i=0;i<8;i++){
        regTable[i]=0
    }

    curCase=0
    curLevel=data.substring(0,1)

    levelComplete={}
    for(i=0;i<10;i++){
        if (data.substring(i+1,i+2)==1){
            levelComplete[i]=true
        } else{
            levelComplete[i]=false
        }

    }
    levelName={}
    levelName[0]="0.INTRO TO SUBLEQ"
    levelName[1]="1.DOESN'T ADD UP..."
    levelName[2]="2.ABSOLUTE AUTHORIT(A)"
    levelName[3]="3.THE THIRD LETTER"
    levelName[4]="4.ABSOLUTE AUTHORI(B)"
    levelName[5]="5.MULTIPLICATION"
    levelName[6]="6.EQUALITY CHECK"
    levelName[7]="7.GREATER THAN THOU"
    levelName[8]="8.EUCLIDIAN DIVIS-IAN"
    levelName[9]="9.THANKS FOR PLAYING!"
    levelGoal={}
    levelRegValues={}
    for(i=0;i<10;i++){
        levelRegValues[i]={}
        for(o=0;o<8;o++){
            levelRegValues[i][o]={}
            for(p=0;p<8;p++){
                levelRegValues[i][o][p]=0
            }
        }
    }
    //Intro
    levelGoal[0]="Registers a and b contain random numbers. Subtract the value of register b from register a. Then set register b to 0."
        levelRegValues[0][0][0]="pos"
        levelRegValues[0][1][0]="pos"
        levelRegValues[0][0][1]="pos"
        levelRegValues[0][1][1]="neg"
        levelRegValues[0][0][2]="neg"
        levelRegValues[0][1][2]="neg"
    //Addition
    levelGoal[1]="Register a and b contain random numbers. Set register b to the sum of registers a and b (a + b)."
        levelRegValues[1][0][0]="any"
        levelRegValues[1][1][0]="any"
        levelRegValues[1][0][1]="any"
        levelRegValues[1][1][1]="any"
        levelRegValues[1][0][2]="any"
        levelRegValues[1][1][2]="any"
    //Absolute A
    levelGoal[2]="Register a contains a random negative number. Change register a to it's absolute (positive) value."
        levelRegValues[2][0][0]="neg"
        levelRegValues[2][0][1]="neg"
        levelRegValues[2][0][2]="neg"
    //NO POSITIVITY
    levelGoal[3]="3.Register a contains a random number. If a is positive set it to zero. If not leave it as is."
        levelRegValues[3][0][0]="any"
        levelRegValues[3][0][1]="pos"
        levelRegValues[3][0][2]="neg"
    //Absolute B
    levelGoal[4]="3.Register a contains a random number. Positive or negative. Set a to it's absolute (positive) value."
        levelRegValues[4][0][0]="any"
        levelRegValues[4][0][1]="neg"
        levelRegValues[4][0][2]="pos"
    //Equality
    levelGoal[6]="Register a and b contain random numbers and c ═ 1. If a and b are equal leave a as is. If not set a to 0."
        levelRegValues[6][0][0]="any"
        levelRegValues[6][1][0]="any"
        levelRegValues[6][2][0]=1
        levelRegValues[6][0][1]=9
        levelRegValues[6][1][1]=8
        levelRegValues[6][2][1]=1
        levelRegValues[6][0][2]=9
        levelRegValues[6][1][2]=9
        levelRegValues[6][2][2]=1
    //Multiply
    levelGoal[5]="Register a and b contain random (non-zero) positive numbers and c ═ 1. Set a to the product of a and b (a * b)."
        levelRegValues[5][0][0]="pos"
        levelRegValues[5][1][0]="pos"
        levelRegValues[5][2][0]=1
        levelRegValues[5][0][1]="pos"
        levelRegValues[5][1][1]="pos"
        levelRegValues[5][2][1]=1
        levelRegValues[5][0][2]="pos"
        levelRegValues[5][1][2]="pos"
        levelRegValues[5][2][2]=1
    //Greater Than Thou
    levelGoal[7]="Register a and b contain random numbers. Set a to the greater of the two."
        levelRegValues[7][0][0]="any"
        levelRegValues[7][1][0]="any"
        levelRegValues[7][0][1]="pos"
        levelRegValues[7][1][1]="neg"
        levelRegValues[7][0][2]="neg"
        levelRegValues[7][1][2]="pos"
    //Division
    levelGoal[8]="Register a and b contain random positive numbers. Divide a by b (a / b). Store the result in a and the remainder in b."
        levelRegValues[8][0][0]="pos"
        levelRegValues[8][1][0]="pos"
        levelRegValues[8][2][0]=1
        levelRegValues[8][0][1]="pos"
        levelRegValues[8][1][1]="pos"
        levelRegValues[8][2][1]=1
        levelRegValues[8][0][2]="pos"
        levelRegValues[8][1][2]="pos"
        levelRegValues[8][2][2]=1
    levelGoal[9]="How many lowercase letters did you take to beat each level? Did you beat my solutions?"
    levelRegValues[9][0][0]="any"
    levelRegValues[9][1][0]="any"
    levelRegValues[9][2][0]=1
    levelRegValues[9][0][1]="any"
    levelRegValues[9][1][1]="any"
    levelRegValues[9][2][1]=1
    levelRegValues[9][0][2]="any"
    levelRegValues[9][1][2]="any"
    levelRegValues[9][2][2]=1
    levelCode={}

    
    loadLevel()

    for(i=0;i<10;i++){
        levelCode[i]={}
        let m=11+i*468
        for(n=0;n<468;n++){
            levelCode[i][n]=data.substring(m+n,m+n+1)
        }
    }

}

function onUpdate()
{
    cursorCount+=1
    if(cursorCount==15&&showCursor){
        showCursor=false
        cursorCount=0
    }else if(cursorCount==15){
        showCursor=true
        cursorCount=0
    }
    if(running||success){
        showCursor=false
    }
    clearScreen();

    //draw code box + line markers
    drawBox(17,codeX,0,30,20)
    drawTextWrapped("i: j: k: l: m: n: o: p: q: r: s: t: u: v: w: x: y: z: ", 17, codeX+1, 1,3);

    //draw registers
    drawText("REGISTERS:",17,registerX+5,registerY-1)
    drawTextWrapped("C A S E   = / 3",17,registerX-1,registerY,1)
    drawTextWrapped("          "+(curCase+1),17,registerX-1,registerY,1)
    let z=0
    for (let i = 0; i < 4; i++) {
        drawBox(17,registerX+i*5,registerY,registerW,registerH)
        drawText(regString1.substring(i,i+1),17,registerX+i*5+2,registerY+1)
        drawText(regTable[z],12,registerX+i*5+1,registerY+2)
        z++
     }
     for (let i = 0; i < 4; i++) {
        drawBox(17,registerX+i*5,registerY+4,registerW,registerH)
        drawText(regString2.substring(i,i+1),17,registerX+i*5+2,registerY+5)
        drawText(regTable[z],12,registerX+i*5+1,registerY+6)
        z++
     }
     drawText("Tap/hold TAB to run",17,registerX+1,19)

     //draw level select
     for (let i=0;i<10;i++){
        let color=17
        if (i!=curLevel){
            color=1
        }
        if(i==0 || levelComplete[i-1]==true){
            drawBox(color,-1,i*2,5,2)
            drawText(i,color,1,i*2)
        }

     }

     //draw level name + instructions
     drawText(levelName[curLevel],17,registerX-1,1)
     drawTextWrapped(levelGoal[curLevel],8,registerX,3,20)
     //drawText(keepRunning,17,0,1)

     let n=0
     for(y=0;y<18;y++){
        for(x=0;x<26;x++){
            drawText(levelCode[curLevel][n],12,codeTextX+x,codeTextY+y)
            if(cursor==n && showCursor){
                drawText("█",4,codeTextX+x,codeTextY+y)
            } 
            n++
        }
     }
     if(running && pointer!=18){
        drawText(">",8,codeTextX-1,codeTextY+pointer)
     }
     if(heart){
        drawText("♥",8,54,0)
     }

     if(success){
        let w=14
        let h=6
        drawBox(4,28-w/2,10-h/2,w,5)
        drawText("            ",12,28-w/2+1,10-h/2+1)
        drawText("  SUCCESS!  ",12,28-w/2+1,10-h/2+2)
        drawText("            ",12,28-w/2+1,10-h/2+3)
     }

}

function shuffleLeft(){
    if(levelCode[curLevel][cursor]==" " && cursor%26!=0){
        let dontShuffle=false
        for(i=cursor;i<cursor+26-cursor%26;i++){
            if(levelCode[curLevel][i]!=" "){
                dontShuffle=true
            }
        }
        if(dontShuffle==false){
            while(cursor%26!=0 && levelCode[curLevel][cursor-1]==" "){
                cursor-=1
            }
            showCursor=true
            cursorCount=0
        }
    }
}

function typeKey(_key){
    for(x=24-cursor%26;x>-1;x--){
        levelCode[curLevel][cursor+x+1]=levelCode[curLevel][cursor+x]
    }
    levelCode[curLevel][cursor]=String.fromCharCode(_key)
    //if((cursor+1)%26!=0){
        cursor+=1
    //}
    showCursor=true
    cursorCount=0
    updateSave()
}

function updateSave(){

    for(i=26;i>0;i--){
        if(levelCode[curLevel][468+i]!=null){
            levelCode[curLevel][468+i]=null
        }
    }

    let updData=""
    updData=updData + curLevel.toString()
    for(i=0;i<10;i++){
        if(levelComplete[i]){
            updData=updData+"1"
        }else{
            updData=updData+"0"
        }
    }
    for(i=0;i<10;i++){
        for(o=0;o<468;o++){
            updData=updData+levelCode[i][o].toString()
        }
    }
    saveData(updData)
}

function onInput(key)
{

    lastKey=key
    if(success==false){
    if(running==false){
        if(key>=48 && key<=57){
            if(levelComplete[key-49]==true||key==48){
                curLevel=key-48
                shuffleLeft()
                updateSave()

                curCase=0
                loadLevel()
            }
        }else if(key>=17 && key<=20){
            if(key==17 && cursor>25){
                //up
                cursor-=26
                showCursor=true
                cursorCount=0
                shuffleLeft()
            }else if(key==18 && cursor<442){
                //down
                cursor+=26
                showCursor=true
                cursorCount=0
                shuffleLeft()
            }else if(key==19 && cursor%26!=0){
                //left
                cursor-=1
                showCursor=true
                cursorCount=0
                shuffleLeft()
            }else if(key==20 && (cursor+1)%26!=0){
                //right
                cursor+=1
                showCursor=true
                cursorCount=0
                shuffleLeft()
            }
        }else if(key==8 && cursor>0){
            if(cursor%26!=0){
                cursor-=1
                showCursor=false
                cursorCount=0
                levelCode[curLevel][cursor]=" "
                for(i=cursor;i<cursor+26-cursor%26;i++){
                    levelCode[curLevel][i]=levelCode[curLevel][i+1]
                    if(i==cursor+25-cursor%26){
                        levelCode[curLevel][i]=" "
                    }
                }
                updateSave()
            }else{
                let curLineContent=false
                let dontBackSpace=false
                for(i=cursor;i<cursor+26;i++){
                    if(levelCode[curLevel][i]!=" "){
                        curLineContent=true
                    }
                }
                if(curLineContent){
                    for(i=cursor-26;i<cursor-cursor%26;i++){
                        if(levelCode[curLevel][i]!=" "){
                            dontBackSpace=true
                        }
                    }
                    if(dontBackSpace==false){
                        for(y=Math.floor(cursor/26);y<18;y++){
                            for(x=0;x<26;x++){
                                levelCode[curLevel][x+y*26-26]=levelCode[curLevel][x+y*26]
                            }
                        }
                        for(i=0;i<26;i++){
                            levelCode[curLevel][i+442]=" "
                        }  
                        cursor-=26
                        updateSave()
                    }  
                }else{
                    for(y=Math.floor(cursor/26)+1;y<18;y++){
                        for(x=0;x<26;x++){
                            levelCode[curLevel][x+y*26-26]=levelCode[curLevel][x+y*26]
                        }
                    }
                    cursor-=1
                    levelCode[curLevel][cursor]=" "
                    shuffleLeft()
                    updateSave()
                } 
            }

        }else if(key==10 && cursor<442){
            if(cursor%26==0){
                for(y=17;y>Math.floor(cursor/26)-1;y--){
                    for(x=0;x<26;x++){
                        levelCode[curLevel][x+y*26+26]=levelCode[curLevel][x+y*26]
                    }
                }
                for(i=0;i<26;i++){
                    levelCode[curLevel][cursor+i]=" "
                }
                cursor+=26
                updateSave()
            }else{
                let dontEnter=false
                for(i=cursor;i<cursor+26-cursor%26;i++){
                    if(levelCode[curLevel][i]!=" "){
                        dontEnter=true
                    }
                }
                if(dontEnter==false){
                    for(y=17;y>Math.floor(cursor/26);y--){
                        for(x=0;x<26;x++){
                            levelCode[curLevel][x+y*26+26]=levelCode[curLevel][x+y*26]
                        }
                    }
                    cursor+=26
                    cursor-=cursor%26
                    for(i=0;i<26;i++){
                        levelCode[curLevel][cursor+i]=" "
                    }
                    updateSave()
                }
            }
        }else if(key==9){
            running=true
            pointer=0
        }else if(key!=10 && key!=8 & key!=9 && key!=27){
            if(key>=97 && key<=122){
                noType=false
                if(key<105){
                    //cancel if there are already two registers on the line
                    regCount=0
                    for(i=0;i<26;i++){
                        for(s=0;s<registers.length;s++){
                            if(levelCode[curLevel][cursor-cursor%26+i]==registers.substring(s,s+1)){
                                regCount+=1
                            }
                        }
                    }
                    if(regCount>1){
                        noType=true
                    }
                }

                //cancel if there is a line character anywhere on the line
                for(i=0;i<26;i++){
                    for(s=0;s<lines.length;s++){
                        if(levelCode[curLevel][cursor-cursor%26+i]==lines.substring(s,s+1)){
                            noType=true
                        }
                    }
                }

                //type letter
                if(noType==false){
                    typeKey(key)
                }
            }else{
                typeKey(key)
            }
        }
    }else{
        //TAB
        if(key==9){

        keepRunning=false
        for(i=pointer*26;i<468;i++){
            for(o=0;o<26;o++){
                if(levelCode[curLevel][i]==letters.substring(o,o+1)){
                    keepRunning=true
                    continue
                }
            }
        }

        if(keepRunning==false){
            if(checkWin()){
                if(curCase<2){
                    curCase+=1
                    loadLevel()
                    pointer=0
                }else{
                    levelComplete[curLevel]=true
                    updateSave()
                    running=false
                    curCase=0
                    loadLevel()
                    success=true
                    if(curLevel==9){
                        heart=true
                    }
                }
            }else{
                running=false
                curCase=0
                cursor=0
                loadLevel()
            }
        }else{

            let regLetter={}
            let lineLetter=-1
            let regCount=0
            for(i=0;i<26;i++){
                for(o=0;o<registers.length;o++){
                    if(levelCode[curLevel][pointer*26+i]==registers.substring(o,o+1)){
                        regLetter[regCount]=o
                        regCount+=1
                    }
                }
                for(o=0;o<lines.length;o++){
                    if(levelCode[curLevel][pointer*26+i]==lines.substring(o,o+1)){
                        lineLetter=o
                    }
                }
            }

            if(regCount==1){
                regTable[regLetter[0]]=0
                if(lineLetter!=-1){
                    pointer=lineLetter-1
                }
            }else if(regCount==2){
                let newVal=regTable[regLetter[0]]-regTable[regLetter[1]]
                regTable[regLetter[0]]=newVal
                if(lineLetter!=-1){
                    if(newVal<=0){
                        pointer=lineLetter-1
                    }
                }
            }else{
                if(lineLetter!=-1){
                    pointer=lineLetter-1
                }
            }
            pointer+=1
            }
        }
        if(key==27 || key==8){
            running=false
            loadLevel()
        }
    }
    }
    
    if(key!=9){
        success=false
    }
}