!function(t){var e={};function o(n){if(e[n])return e[n].exports;var r=e[n]={i:n,l:!1,exports:{}};return t[n].call(r.exports,r,r.exports,o),r.l=!0,r.exports}o.m=t,o.c=e,o.d=function(t,e,n){o.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},o.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.t=function(t,e){if(1&e&&(t=o(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)o.d(n,r,function(e){return t[e]}.bind(null,r));return n},o.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return o.d(e,"a",e),e},o.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},o.p="docs",o(o.s=1)}([function(t,e,o){"use strict";function n(){return!1}function r(){return!1}function i(){return!1}function s(){return 0}function a(){return 10}function c(){return 16}o.r(e),o.d(e,"IsDASAlwaysCharged",(function(){return n})),o.d(e,"ShouldTransitionEvery10Lines",(function(){return r})),o.d(e,"ShouldTransitionEveryLine",(function(){return i})),o.d(e,"GetDASUnchargedFloor",(function(){return s})),o.d(e,"GetDASChargedFloor",(function(){return a})),o.d(e,"GetDASTriggerThreshold",(function(){return c}))},function(t,e,o){"use strict";o.r(e),o.d(e,"SquareState",(function(){return Z})),o.d(e,"GetCurrentPiece",(function(){return yt})),o.d(e,"GetLevel",(function(){return wt}));const n={Z:[[[[0,0,0,0],[0,1,1,0],[0,0,1,1]],[[0,0,0,1],[0,0,1,1],[0,0,1,0]]],2,"Z"],S:[[[[0,0,0,0],[0,0,1,1],[0,1,1,0]],[[0,0,1,0],[0,0,1,1],[0,0,0,1]]],3,"S"],T:[[[[0,0,0,0],[0,1,1,1],[0,0,1,0]],[[0,0,1,0],[0,1,1,0],[0,0,1,0]],[[0,0,1,0],[0,1,1,1],[0,0,0,0]],[[0,0,1,0],[0,0,1,1],[0,0,1,0]]],1,"T"],O:[[[[0,0,0,0],[0,1,1,0],[0,1,1,0],[0,0,0,0]]],1,"O"],L:[[[[0,0,0,0],[0,1,1,1],[0,1,0,0]],[[0,1,1,0],[0,0,1,0],[0,0,1,0]],[[0,0,0,1],[0,1,1,1],[0,0,0,0]],[[0,0,1,0],[0,0,1,0],[0,0,1,1]]],2,"L"],I:[[[[0,0,0,0],[0,0,0,0],[1,1,1,1],[0,0,0,0]],[[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,0,1,0]]],1,"I"],J:[[[[0,0,0,0],[0,1,1,1],[0,0,0,1]],[[0,0,1,0],[0,0,1,0],[0,1,1,0]],[[0,1,0,0],[0,1,1,1],[0,0,0,0]],[[0,0,1,1],[0,0,1,0],[0,0,1,0]]],3,"J"]},r=Object.values(n),i=document.getElementById("piece-sequence");let s="",a=0,c=!1;function l(){}l.prototype.startReadingPieceSequence=function(){s=i.value.replace(/ /g,""),s.length>0&&(c=!0,a=0)},l.prototype.chooseNextPiece=function(t){return c?this.getPresetPiece():(c=!1,this.getRandomPiece(t))},l.prototype.getStatusDisplay=function(){return c?["Piece ",a+1+" of "+s.length]:["Random","Piece"]},l.prototype.getPresetPiece=function(){const t=s[a],e=n[t];return a+=1,a>=s.length&&(c=!1,a=0),e},l.prototype.getRandomPiece=function(t){let e=Math.floor(Math.random()*(r.length+1));e!=r.length&&t!==r[e][2]||(e=Math.floor(Math.random()*r.length));return r[e]};const u={0:"rgb(0,88,248)",1:"rgb(0,168,0)",2:"rgb(216,0,204)",3:"rgb(0,88,248)",4:"rgb(228,0,88",5:"rgb(88,248,152)",6:"rgb(248,56,0)",7:"rgb(104,68,252)",8:"rgb(0,88,248)",9:"rgb(248,56,0)"},d={1:u,2:{0:"rgb(60,188,252)",1:"rgb(148,248,24)",2:"rgb(248,120,248)",3:"rgb(88,216,84)",4:"rgb(88,248,152)",5:"rgb(104,136,252)",6:"rgb(124,124,124)",7:"rgb(168,0,32)",8:"rgb(248,56,0)",9:"rgb(252,160,68)"},3:Object.assign(u)},h=Object.freeze({LEFT:1,RIGHT:2,DOWN:3,UP:4}),f={1:40,2:100,3:300,4:1200},g={0:48,1:43,2:38,3:33,4:28,5:23,6:18,7:13,8:8,9:6,10:5,11:5,12:5,13:4,14:4,15:4,16:3,17:3,18:3,19:2,29:1};const p="first piece",m="running",y="paused",w="game over",b="start screen",D="are",v="line clear",S=document.getElementById("paste-area"),T=document.getElementById("pasted-image");let L=!1,P=[];function I(t,e){var o;this.board=t,this.canvas=e,o=this,S.onpaste=function(t){for(var e=(t.clipboardData||t.originalEvent.clipboardData).items,n=null,r=0;r<e.length;r++)0===e[r].type.indexOf("image")&&(n=e[r].getAsFile());if(null!==n){var i=new FileReader;i.onload=function(t){T.onload=function(){o.getBoardStateFromImage(T)},T.src=t.target.result},i.readAsDataURL(n)}}}I.prototype.resetBoard=function(){for(let t=0;t<20;t++)for(let e=0;e<10;e++)this.board[t][e]=L?P[t][e]:Z.EMPTY},I.prototype.didLoadBoardStateFromImage=function(){return L},I.prototype.getBoardStateFromImage=function(t){var e=document.getElementById("dummy-canvas"),o=e.getContext("2d");e.width=t.width,e.height=t.height,o.drawImage(t,0,0),this.resetBoard();const n=(t.height/20+t.width/10)/2-.3;for(let t=0;t<10;t++)for(let e=0;e<20;e++){const r=Math.round((t+.5)*n),i=Math.round((e+.5)*n),s=o.getImageData(r,i,1,1).data;Math.max(s[0],s[1],s[2])>60?this.board[e][t]=Z.color1:this.board[e][t]=Z.EMPTY,o.fillStyle="GREEN",o.fillRect(r,i,5,5)}!function(t){let e=!1;for(let o=19;o>=0;o--)if(e)for(let e=0;e<10;e++)t[o][e]=Z.EMPTY;else{let n=!0;for(let e=0;e<10;e++)if(t[o][e]!=Z.EMPTY){n=!1;break}n&&(e=!0)}}(this.board),P=JSON.parse(JSON.stringify(this.board)),this.canvas.drawBoard(),L=!0};const E=document.getElementById("main-canvas"),C=E.getContext("2d");function x(t){this.board=t}function M(t,e){this.rotationList=t[0],this.colorId=t[1],this.id=t[2],this.board=e,this.rotationIndex=0,this.activeTetromino=this.rotationList[this.rotationIndex],this.x=3,this.y="I"==this.id?-2:-1}E.setAttribute("height",480),E.setAttribute("width",408),x.prototype.drawLineClears=function(t,e){if(e>=15)return;const o=5+Math.floor(e/3),n=9-o;for(const e of t)C.fillStyle="black",C.fillRect(24*n,24*e,24,24),C.fillRect(24*o,24*e,24,24)},x.prototype.drawSquare=function(t,e,o,n=!1){if("black"==o)return C.fillStyle="black",void C.fillRect(24*t,24*e,24,24);C.fillStyle=o,C.fillRect(24*t,24*e,21,21),n&&"black"!==o&&(C.fillStyle="white",C.fillRect(24*t+3,24*e+3,15,15)),"black"!==o&&(C.fillStyle="white",C.fillRect(24*t,24*e,3,3),C.fillRect(24*t+3,24*e+3,3,3),C.fillRect(24*t+3+3,24*e+3,3,3),C.fillRect(24*t+3,24*e+3+3,3,3))},x.prototype.drawNextBox=function(t){if(C.fillStyle="BLACK",C.fillRect(264,192,120,108),null!=t){const e="I"===t.id||"O"===t.id?11.5:11,o="I"===t.id?7.75:8.25,n=d[t.colorId][wt()%10];for(let r=0;r<t.activeTetromino.length;r++)for(let i=0;i<t.activeTetromino[r].length;i++)t.activeTetromino[r][i]&&this.drawSquare(e+i,o+r,n,1===t.colorId)}},x.prototype.drawScoreDisplay=function(t){const e=("0".repeat(6)+t).slice(-6);this.drawMultiLineText(["SCORE",e],264,12,120,"center")},x.prototype.drawLinesDisplay=function(t){const e=("0".repeat(3)+t).slice(-3);this.drawMultiLineText(["LINES",e],264,72,120,"center")},x.prototype.drawLevelDisplay=function(t){const e=("0".repeat(2)+t).slice(-2);this.drawMultiLineText(["LEVEL",e],264,336,120,"center")},x.prototype.drawPieceStatusDisplay=function(t){this.drawMultiLineText(t,264,144,120,"center")},x.prototype.drawMultiLineText=function(t,e,o,n,r){C.clearRect(e,o,n,20*t.length),C.textAlign="center",C.font="18px 'Press Start 2P'",C.fillStyle="BLACK";const i="center"==r?n/2:0;let s=0;for(let n of t)C.fillText(n.toUpperCase(),e+i,o+20*(s+1)),s++},x.prototype.drawPiece=function(t){if(null==t)return;const e=wt(),o="T"===t.id||"O"===t.id||"I"===t.id;for(let n=0;n<t.activeTetromino.length;n++)for(let r=0;r<t.activeTetromino[n].length;r++)t.activeTetromino[n][r]&&(0!==t.colorId?this.drawSquare(t.x+r,t.y+n,d[t.colorId][e%10],o):this.drawSquare(t.x+r,t.y+n,"black",o))},x.prototype.unDrawPiece=function(t){if(null!=t)for(let e=0;e<t.activeTetromino.length;e++)for(let o=0;o<t.activeTetromino[e].length;o++)t.activeTetromino[e][o]&&this.drawSquare(t.x+o,t.y+e,"black",!1)},x.prototype.drawCurrentPiece=function(){this.drawPiece(yt())},x.prototype.unDrawCurrentPiece=function(){this.unDrawPiece(yt())},x.prototype.drawBoard=function(){const t=wt();for(let e=0;e<20;e++)for(let o=0;o<10;o++){let n=this.board[e][o];0!==n?this.drawSquare(o,e,d[n][t%10],1===n):this.drawSquare(o,e,"black",1===n)}},M.prototype.equals=function(t){return this.id===t.id},M.prototype.getHeightFromBottom=function(){let t=0;for(let e=0;e<this.activeTetromino.length;e++)for(let o=0;o<this.activeTetromino[e].length;o++)this.activeTetromino[e][o]&&(t=Math.max(t,this.y+e));return 20-t},M.prototype.shouldLock=function(){return this.collision(0,1,this.activeTetromino)},M.prototype.moveDown=function(){this.y++},M.prototype.moveRight=function(){return!this.collision(1,0,this.activeTetromino)&&(this.x++,!0)},M.prototype.moveLeft=function(){return!this.collision(-1,0,this.activeTetromino)&&(this.x--,!0)},M.prototype.rotate=function(t){const e=t?1:-1,o=(this.rotationIndex+e+this.rotationList.length)%this.rotationList.length,n=this.rotationList[o];this.collision(0,0,n)||(this.rotationIndex=o,this.activeTetromino=this.rotationList[this.rotationIndex])},M.prototype.lock=function(){for(let t=0;t<this.activeTetromino.length;t++)for(let e=0;e<this.activeTetromino[t].length;e++){if(!this.activeTetromino[t][e])continue;const o=this.y+t,n=this.x+e;o>=0&&o<20&&n>=0&&n<10&&(this.board[this.y+t][this.x+e]=this.colorId)}},M.prototype.collision=function(t,e,o){for(let n=0;n<o.length;n++)for(let r=0;r<o[n].length;r++){if(!o[n][r])continue;let i=this.x+r+t,s=this.y+n+e;if(i<0||i>=10||s>=20)return!0;if(!(s<0)&&0!=this.board[s][i])return!0}return!1};const B=o(0),k=document.getElementById("debug");function R(t,e,o,n,r,i,s,a){this.resetLocalVariables(),this.togglePauseFunc=i,this.moveDownFunc=t,this.moveLeftFunc=e,this.moveRightFunc=o,this.rotateLeftFunc=n,this.rotateRightFunc=r,this.getGameStateFunc=s,this.getAREFunc=a}function F(t){return t==m||t==p}R.prototype.getIsSoftDropping=function(){return this.isSoftDropping},R.prototype.getCellsSoftDropped=function(){return this.cellSoftDropped},R.prototype.onPieceLock=function(){B.IsDASAlwaysCharged()&&this.setDASCharge(B.GetDASTriggerThreshold())},R.prototype.resetLocalVariables=function(){this.leftHeld=!1,this.rightHeld=!1,this.downHeld=!1,this.isSoftDropping=!1,this.cellSoftDropped=0,this.dasCharge=B.GetDASTriggerThreshold(),this.softDroppedLastFrame=!1},R.prototype.handleInputsThisFrame=function(){if(this.downHeld+this.leftHeld+this.rightHeld>1)return this.isSoftDropping=!1,void(this.cellSoftDropped=0);if(this.isSoftDropping&&!this.softDroppedLastFrame){return this.moveDownFunc()?this.cellSoftDropped+=1:(this.isSoftDropping=!1,this.cellSoftDropped=0),void(this.softDroppedLastFrame=!0)}this.softDroppedLastFrame=!1,this.leftHeld?this.handleHeldDirection(h.LEFT):this.rightHeld&&this.handleHeldDirection(h.RIGHT)},R.prototype.keyDownListener=function(t){if(!t.repeat){switch(t.keyCode){case 37:this.leftHeld=!0;break;case 39:this.rightHeld=!0;break;case 40:this.downHeld=!0}if(F(this.getGameStateFunc()))switch(t.keyCode){case 37:this.handleTappedDirection(h.LEFT);break;case 39:this.handleTappedDirection(h.RIGHT);break;case 90:this.rotateLeftFunc();break;case 88:this.rotateRightFunc();break;case 40:this.isSoftDropping=!0}else switch(t.keyCode){case 90:case 88:console.log("rotate rejected, state: ",this.getGameStateFunc())}80==t.keyCode&&this.togglePauseFunc()}},R.prototype.keyUpListener=function(t){37==t.keyCode?this.leftHeld=!1:39==t.keyCode?this.rightHeld=!1:40==t.keyCode&&(this.downHeld=!1,this.isSoftDropping=!1,this.cellSoftDropped=0)},R.prototype.tryShiftPiece=function(t){const e=t==h.LEFT?this.moveLeftFunc():this.moveRightFunc();return e||this.setDASCharge(B.GetDASTriggerThreshold()),e},R.prototype.handleHeldDirection=function(t){const e=B.GetDASTriggerThreshold();if(this.setDASCharge(Math.min(e,this.dasCharge+1)),this.dasCharge==e){this.tryShiftPiece(t)&&this.setDASCharge(B.GetDASChargedFloor())}},R.prototype.handleTappedDirection=function(t){F(this.getGameStateFunc())&&(this.setDASCharge(B.GetDASUnchargedFloor()),this.tryShiftPiece(t))},R.prototype.setDASCharge=function(t){this.dasCharge=t,this.refreshDebugText()},R.prototype.refreshDebugText=function(){let t="",e="";for(let t=0;t<this.dasCharge;t++)e+="x";0==this.dasCharge&&(e="."),t+="DAS: "+this.dasCharge+"\n"+e,k.innerText=t};const A=document.getElementById("main-canvas");function O(t,e){this.board=t,this.canvas=e,this.mouseIsDown=!1,this.squaresToggled=new Set,this.dragMode=G.NONE}const G=Object.freeze({ADDING:"adding",REMOVING:"removing",NONE:"none"});function H(t){const e=A.getBoundingClientRect(),o=t.clientX-e.left,n=t.clientY-e.top;return[Math.floor(n/24),Math.floor(o/24)]}function N(t,e){return t+","+e}O.prototype.toggleCell=function(t,e){this.squaresToggled.add(N(t,e)),this.board[t][e]=this.board[t][e]==Z.EMPTY?Z.COLOR1:Z.EMPTY,this.canvas.drawBoard(),this.canvas.drawCurrentPiece()},O.prototype.onMouseDown=function(t){let e,o;[e,o]=H(t),this.mouseIsDown=!0,this.dragMode=this.board[e][o]==Z.EMPTY?G.ADDING:G.REMOVING,this.toggleCell(e,o)},O.prototype.onMouseDrag=function(t){if(!this.mouseIsDown)return;let e,o;[e,o]=H(t);(this.dragMode==G.ADDING?this.board[e][o]==Z.EMPTY:this.board[e][o]!=Z.EMPTY)&&!this.squaresToggled.has(N(e,o))&&this.toggleCell(e,o)},O.prototype.onMouseUp=function(t){this.mouseIsDown=!1,this.squaresToggled=new Set};const q=document.getElementById("main-canvas"),Y=document.getElementById("left-panel-toggle-open"),j=document.getElementById("left-panel");document.getElementById("right-panel");let U=!0;j.style.minHeight=540,q.setAttribute("height",480),q.setAttribute("width",384),Y.addEventListener("click",(function(t){U=!U,U?(j.style.marginLeft=0,Y.innerText="<"):(j.style.marginLeft=-260,Y.innerText=">")}));const V=o(0),_=(document.getElementById("score-display"),document.getElementById("lines-display"),document.getElementById("level-display"),document.getElementById("header-text")),J=document.getElementById("stats"),$=document.getElementById("game-options-form"),z=document.getElementById("start-game"),K=(document.getElementById("restart-game"),document.getElementById("level-select")),W=document.getElementById("main-canvas"),Z={EMPTY:0,COLOR1:1,COLOR2:2,COLOR3:3};let X,Q=[];for(let t=0;t<20;t++){Q[t]=[];for(let e=0;e<10;e++)Q[t][e]=Z.EMPTY}let tt,et,ot,nt,rt,it,st,at,ct,lt,ut,dt,ht,ft=new x(Q),gt=new O(Q,ft),pt=new l,mt=new I(Q,ft);const yt=()=>tt,wt=()=>ot;function bt(){let t="";switch(it){case b:t="Welcome to Tetris Trainer!";break;case m:t="";break;case w:t="Game over!";break;case y:t="Paused"}_.innerText=t}function Dt(){const t=function(t,e){let o=0;for(let n=0;n<20;n++)for(let r=t;r<e;r++)if(Q[n][r]!=Z.EMPTY){o+=(n+r)%2==0?1:-1}return Math.abs(o)},e=t(0,5),o=t(3,7),n=t(5,10);J.innerText=`Parity: \nL=${e} \nM=${o} \nR=${n}`}function vt(){tt=et,ft.drawPieceStatusDisplay(pt.getStatusDisplay()),et=new M(pt.chooseNextPiece(tt.id),Q),ft.drawNextBox(et)}function St(){st=0,at=0,ct=0,lt=0,dt=[],ht=0,nt=0,ot=0,it=b,X.resetLocalVariables()}function Tt(){it==p&&0==ut?it=m:it==v&&0==lt?it=D:it==D&&0==ct?(st+=ht,ht=0,Lt(),ft.drawCurrentPiece(),!function(){const t=tt.activeTetromino;for(let e=0;e<t.length;e++)for(let o=0;o<t[e].length;o++)if(t[e][o]&&Q[tt.y+e][tt.x+o])return!0;return!1}()?it=m:(it=w,bt())):it==m&&(lt>0?it=v:ct>0&&(it=D))}function Lt(){console.log("refreshing score display"),ft.drawLevelDisplay(ot),ft.drawScoreDisplay(st),ft.drawLinesDisplay(nt)}function Pt(){if(tt.shouldLock()){const e=tt.getHeightFromBottom();return tt.lock(),X.onPieceLock(),ft.drawBoard(),Dt(),vt(),dt=function(){let t=[];for(let e=0;e<20;e++){let o=!0;for(let t=0;t<10;t++)if(Q[e][t]==Z.EMPTY){o=!1;break}o&&t.push(e)}return t}(),dt.length>0&&(lt=18),ht+=(t=X.getCellsSoftDropped())>=16?t-6:t,ct=10+2*Math.floor((e+2)/4),!1}return ft.unDrawCurrentPiece(),tt.moveDown(),ft.drawCurrentPiece(),!0;var t}X=new R(Pt,(function(){ft.unDrawCurrentPiece();const t=tt.moveLeft();return ft.drawCurrentPiece(),t}),(function(){ft.unDrawCurrentPiece();const t=tt.moveRight();return ft.drawCurrentPiece(),t}),(function(){ft.unDrawCurrentPiece(),tt.rotate(!1),ft.drawCurrentPiece()}),(function(){ft.unDrawCurrentPiece(),tt.rotate(!0),ft.drawCurrentPiece()}),(function(){it==m||it==p?(it=y,bt()):it==y&&(it=m,bt())}),(function(){return it}),(function(){return ct})),W.addEventListener("mousedown",(function(t){gt.onMouseDown(t)})),W.addEventListener("mousemove",(function(t){gt.onMouseDrag(t)})),W.addEventListener("mouseup",(function(t){gt.onMouseUp(t)})),W.addEventListener("mouseleave",(function(t){gt.onMouseUp(t)})),document.addEventListener("keydown",t=>{X.keyDownListener(t)}),document.addEventListener("keyup",t=>{X.keyUpListener(t)}),$.addEventListener("submit",t=>{t.preventDefault(),z.focus(),function(){St(),ut=30,pt.startReadingPieceSequence(),mt.resetBoard(),it=p;const t=parseInt(K.value);var e;ot=Number.isInteger(t)&&t>0?t:0,rt=V.ShouldTransitionEvery10Lines()?10:(e=ot)<10?10*(e+1):e<=15?100:10*(e-5),et=new M(pt.chooseNextPiece(""),Q),vt(),ft.drawBoard(),ft.drawCurrentPiece(),bt(),Lt()}()}),St(),ft.drawBoard(),ft.drawNextBox(null),bt(),Dt(),function t(){switch(it){case p:ut-=1;break;case v:lt-=1,ft.drawLineClears(dt,18-lt),0==lt&&function(){const t=dt.length;for(const t of dt){for(let e=t;e>1;e--)for(let t=0;t<10;t++)Q[e][t]=Q[e-1][t];for(let t=0;t<10;t++)Q[0][t]=Z.EMPTY}dt=[],t>0&&(nt+=t,(V.ShouldTransitionEveryLine()||nt>=rt)&&(ot+=1,rt+=10),ht+=f[t]*(ot+1),ft.drawBoard(),ft.drawNextBox(et))}();break;case D:ct-=1;break;case m:X.handleInputsThisFrame(),X.getIsSoftDropping()?at=0:(at+=1,at>=((e=ot)<=18?g[e]:e<29?2:1)&&(Pt(),at=0))}var e;Tt(),window.setTimeout(t,16.67)}()}]);