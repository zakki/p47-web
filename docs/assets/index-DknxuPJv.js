var Xe=Object.defineProperty;var je=(c,e,t)=>e in c?Xe(c,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):c[e]=t;var s=(c,e,t)=>je(c,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const a of n.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function t(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function r(i){if(i.ep)return;i.ep=!0;const n=t(i);fetch(i.href,n)}})();class Rt{static info(e,t=!0){t?console.info(e):process.stderr.write(e)}static infoNumber(e,t=!0){t?console.info(String(e)):process.stderr.write(`${e} `)}static error(e){if(typeof e=="string"){console.error(`Error: ${e}`);return}console.error(`Error: ${e.toString()}`)}}class J extends Error{constructor(e){super(e),this.name="SDLInitFailedException"}}class pe extends Error{constructor(e){super(e),this.name="SDLException"}}var $;let z=($=class{static init(){if(!$.noSound&&!(typeof AudioContext>"u"))try{$.audioContext||($.audioContext=new AudioContext),$.bindUnlockHandlers()}catch{throw $.noSound=!0,new J("Unable to initialize audio")}}static close(){$.noSound||$.audioContext&&$.audioContext.suspend()}static getContext(){return $.audioContext}static unlock(){!$.audioContext||$.unlocked||($.audioContext.resume(),$.unlocked=$.audioContext.state==="running")}static bindUnlockHandlers(){if($.unlockHandlersBound||typeof window>"u")return;$.unlockHandlersBound=!0;const e=()=>{$.unlock(),$.unlocked&&(window.removeEventListener("pointerdown",e),window.removeEventListener("keydown",e))};window.addEventListener("pointerdown",e),window.addEventListener("keydown",e)}},s($,"noSound",!1),s($,"audioContext",null),s($,"unlocked",!1),s($,"unlockHandlersBound",!1),$);const et=class et{constructor(){s(this,"audio",null);s(this,"gain",null);s(this,"source",null);s(this,"music",null)}load(e){if(z.noSound)return;const t=`${et.dir}/${e}`;if(this.music=t,typeof Audio<"u"){this.audio=new Audio(t),this.audio.preload="auto",this.audio.loop=!0;const r=z.getContext();r&&(this.source=r.createMediaElementSource(this.audio),this.gain=r.createGain(),this.gain.gain.value=1,this.source.connect(this.gain),this.gain.connect(r.destination))}else if(!this.music)throw new pe(`Couldn't load: ${t}`)}free(){var e,t;this.halt(),(e=this.source)==null||e.disconnect(),(t=this.gain)==null||t.disconnect(),this.source=null,this.gain=null,this.audio=null,this.music=null}play(){z.noSound||(z.unlock(),this.audio&&(this.audio.loop=!0,this.audio.currentTime=0,this.audio.play().catch(()=>{}),et.active.add(this)))}playOnce(){z.noSound||(z.unlock(),this.audio&&(this.audio.loop=!1,this.audio.currentTime=0,this.audio.play().catch(()=>{}),et.active.add(this)))}fade(){et.fadeMusic()}halt(){et.haltMusic()}static fadeMusic(){if(z.noSound)return;const e=z.getContext();if(e){const t=e.currentTime;for(const r of et.active)r.gain&&(r.gain.gain.cancelScheduledValues(t),r.gain.gain.setValueAtTime(r.gain.gain.value,t),r.gain.gain.linearRampToValueAtTime(0,t+.4));return}for(const t of et.active)t.audio&&(t.audio.volume=Math.max(0,t.audio.volume-.3))}static haltMusic(){if(!z.noSound){for(const e of et.active)e.audio&&(e.audio.pause(),e.audio.currentTime=0,e.audio.volume=1,e.gain&&(e.gain.gain.value=1));et.active.clear()}}};s(et,"fadeOutSpeed",1280),s(et,"dir","sounds/musics"),s(et,"active",new Set);let gt=et;const Zt=class Zt{constructor(){s(this,"chunk",null);s(this,"players",[]);s(this,"nextPlayerIdx",0);s(this,"maxPlayers",8);s(this,"chunkChannel",0)}load(e,t=0){if(z.noSound)return;const r=`${Zt.dir}/${e}`;if(this.chunk=r,this.players=[],this.nextPlayerIdx=0,typeof Audio>"u"&&!this.chunk)throw new pe(`Couldn't load: ${r}`);this.chunkChannel=t}free(){this.chunk&&(this.halt(),this.chunk=null,this.players=[])}play(){if(z.noSound||(z.unlock(),!this.chunk||typeof Audio>"u"))return;const e=this.acquirePlayer();e&&(e.currentTime=0,e.play().catch(()=>{}),this.chunkChannel)}halt(){if(!z.noSound)for(const e of this.players)e.pause(),e.currentTime=0}fade(){this.halt()}acquirePlayer(){for(let t=0;t<this.players.length;t++){const r=this.players[t];if(r.ended||r.paused)return r}if(this.players.length<this.maxPlayers){const t=new Audio(this.chunk);return t.preload="auto",this.players.push(t),t}const e=this.players[this.nextPlayerIdx];return this.nextPlayerIdx=(this.nextPlayerIdx+1)%this.players.length,e.pause(),e}};s(Zt,"dir","sounds/chunks");let zt=Zt;class We{constructor(){s(this,"frameCount",0);s(this,"updateCount",0);s(this,"droppedFrameCount",0);s(this,"totalFrameMs",0);s(this,"worstFrameMs",0);s(this,"lastUpdatedMs",0)}reset(e){this.frameCount=0,this.updateCount=0,this.droppedFrameCount=0,this.totalFrameMs=0,this.worstFrameMs=0,this.lastUpdatedMs=e}recordFrame(e,t,r){const i=Number.isFinite(e)?Math.max(0,e):0,n=Math.max(0,t|0);this.frameCount++,this.updateCount+=n,n>1&&(this.droppedFrameCount+=n-1),this.totalFrameMs+=i,i>this.worstFrameMs&&(this.worstFrameMs=i),this.lastUpdatedMs=r}getSnapshot(){const e=this.frameCount>0?this.totalFrameMs/this.frameCount:0,t=e>0?1e3/e:0;return{frames:this.frameCount,updates:this.updateCount,droppedFrames:this.droppedFrameCount,avgFrameMs:e,worstFrameMs:this.worstFrameMs,avgFps:t,updatedAtMs:this.lastUpdatedMs}}}class me{constructor(e){s(this,"gl");s(this,"program");s(this,"posBuffer");s(this,"texCoordBuffer");s(this,"colorBuffer");s(this,"posLoc");s(this,"texCoordLoc");s(this,"colorAttrLoc");s(this,"matrixMode",5888);s(this,"modelView",dt());s(this,"projection",dt());s(this,"mvp",dt());s(this,"mvpDirty",!0);s(this,"modelViewStack",[]);s(this,"projectionStack",[]);s(this,"drawColor",[1,1,1,1]);s(this,"clearColor",[0,0,0,1]);s(this,"width",1);s(this,"height",1);s(this,"immediateMode",null);s(this,"immediateVertices",[]);s(this,"blendMode","alpha");s(this,"pointSize",1);s(this,"pointSizeLoc");s(this,"mvpLoc");s(this,"useTextureLoc");s(this,"samplerLoc");s(this,"textureEnabled",!1);s(this,"boundTexture",null);s(this,"currentTexU",0);s(this,"currentTexV",0);s(this,"immediateTexCoords",[]);s(this,"immediateColors",[]);s(this,"drawVerticesBuffer",new Float32Array(0));s(this,"drawTexCoordsBuffer",new Float32Array(0));s(this,"drawColorsBuffer",new Float32Array(0));s(this,"activeRenderTarget",null);this.gl=e,this.program=this.createProgram();const t=e.createBuffer(),r=e.createBuffer(),i=e.createBuffer();if(!t)throw new J("Unable to create WebGL vertex buffer");if(!r)throw new J("Unable to create WebGL texture coord buffer");if(!i)throw new J("Unable to create WebGL color buffer");this.posBuffer=t,this.texCoordBuffer=r,this.colorBuffer=i;const n=e.getAttribLocation(this.program,"aPosition"),a=e.getAttribLocation(this.program,"aTexCoord"),o=e.getAttribLocation(this.program,"aColor");if(n<0)throw new J("Unable to resolve shader attribute aPosition");if(a<0)throw new J("Unable to resolve shader attribute aTexCoord");if(o<0)throw new J("Unable to resolve shader attribute aColor");this.posLoc=n,this.texCoordLoc=a,this.colorAttrLoc=o;const h=e.getUniformLocation(this.program,"uPointSize"),u=e.getUniformLocation(this.program,"uMvp"),d=e.getUniformLocation(this.program,"uUseTexture"),m=e.getUniformLocation(this.program,"uSampler");if(!h||!u||!d||!m)throw new J("Unable to resolve shader uniforms");this.pointSizeLoc=h,this.mvpLoc=u,this.useTextureLoc=d,this.samplerLoc=m,e.useProgram(this.program),e.enableVertexAttribArray(this.posLoc),e.enableVertexAttribArray(this.texCoordLoc),e.enableVertexAttribArray(this.colorAttrLoc),e.bindBuffer(e.ARRAY_BUFFER,this.posBuffer),e.vertexAttribPointer(this.posLoc,4,e.FLOAT,!1,0,0),e.bindBuffer(e.ARRAY_BUFFER,this.texCoordBuffer),e.vertexAttribPointer(this.texCoordLoc,2,e.FLOAT,!1,0,0),e.bindBuffer(e.ARRAY_BUFFER,this.colorBuffer),e.vertexAttribPointer(this.colorAttrLoc,4,e.FLOAT,!1,0,0),e.uniform1i(this.samplerLoc,0),e.enable(e.BLEND),this.applyBlendMode(),e.clearColor(this.clearColor[0],this.clearColor[1],this.clearColor[2],this.clearColor[3])}static create(e){const t=e.getContext("webgl",{alpha:!1,antialias:!1,depth:!0,stencil:!1,preserveDrawingBuffer:!1});if(!t)throw new J("Unable to initialize WebGL context");return new me(t)}resize(e,t){this.width=Math.max(1,e),this.height=Math.max(1,t),this.gl.viewport(0,0,this.width,this.height)}setViewport(e,t){this.gl.viewport(0,0,Math.max(1,e),Math.max(1,t))}clear(){this.gl.clearColor(this.clearColor[0],this.clearColor[1],this.clearColor[2],this.clearColor[3]),this.gl.clear(this.gl.COLOR_BUFFER_BIT|this.gl.DEPTH_BUFFER_BIT)}flush(){this.gl.flush()}setDrawColor(e,t,r,i){this.drawColor=[mt(e),mt(t),mt(r),mt(i)]}setClearColor(e,t,r,i){this.clearColor=[mt(e),mt(t),mt(r),mt(i)]}setBlendMode(e){this.blendMode=e,this.applyBlendMode()}translate(e){this.translateXYZ(e.x,e.y,e.z)}setMatrixMode(e){(e===5888||e===5889)&&(this.matrixMode=e)}loadIdentity(){this.setCurrentMatrix(dt())}pushMatrix(){if(this.matrixMode===5889){this.projectionStack.push(Ee(this.projection));return}this.modelViewStack.push(Ee(this.modelView))}popMatrix(){if(this.matrixMode===5889){const t=this.projectionStack.pop();if(!t)return;this.projection=t,this.mvpDirty=!0;return}const e=this.modelViewStack.pop();e&&(this.modelView=e,this.mvpDirty=!0)}translateXYZ(e,t,r=0){this.mulCurrentMatrix(ke(e,t,r))}scaleXYZ(e,t,r=1){this.mulCurrentMatrix(qe(e,t,r))}rotateDeg(e,t=0,r=0,i=1){this.mulCurrentMatrix(Ze(e,t,r,i))}frustum(e,t,r,i,n,a){this.mulCurrentMatrix(Ke(e,t,r,i,n,a))}ortho(e,t,r,i,n,a){this.mulCurrentMatrix(Je(e,t,r,i,n,a))}lookAt(e,t,r,i,n,a,o,h,u){this.mulCurrentMatrix(Qe(e,t,r,i,n,a,o,h,u))}begin(e){this.immediateMode=e,this.immediateVertices.length=0,this.immediateTexCoords.length=0,this.immediateColors.length=0}vertex(e){this.vertexXYZ(e.x,e.y,e.z)}vertexXYZ(e,t,r=0){if(!this.immediateMode){this.drawVertex(e,t,r);return}this.immediateVertices.push(e,t,r,1),this.immediateTexCoords.push(this.currentTexU,this.currentTexV),this.immediateColors.push(this.drawColor[0],this.drawColor[1],this.drawColor[2],this.drawColor[3])}end(){if(!this.immediateMode||this.immediateVertices.length===0){this.immediateMode=null,this.immediateVertices.length=0,this.immediateTexCoords.length=0,this.immediateColors.length=0;return}this.drawImmediate(this.immediateMode,this.immediateVertices,this.immediateTexCoords,this.immediateColors),this.immediateMode=null,this.immediateVertices.length=0,this.immediateTexCoords.length=0,this.immediateColors.length=0}drawArraysXYZC(e,t,r){const i=this.createPackedDrawCall(e,t,r);i&&this.drawPacked(i.mode,i.count,i.vertices,i.texCoords,i.colors)}createStaticMeshXYZC(e,t,r){const i=this.createPackedDrawCall(e,t,r);if(!i)return null;const n=this.gl,a=n.createBuffer(),o=n.createBuffer(),h=n.createBuffer();return!a||!o||!h?(a&&n.deleteBuffer(a),o&&n.deleteBuffer(o),h&&n.deleteBuffer(h),null):(n.bindBuffer(n.ARRAY_BUFFER,a),n.bufferData(n.ARRAY_BUFFER,i.vertices,n.STATIC_DRAW),n.bindBuffer(n.ARRAY_BUFFER,o),n.bufferData(n.ARRAY_BUFFER,i.texCoords,n.STATIC_DRAW),n.bindBuffer(n.ARRAY_BUFFER,h),n.bufferData(n.ARRAY_BUFFER,i.colors,n.STATIC_DRAW),{mode:i.mode,count:i.count,posBuffer:a,texCoordBuffer:o,colorBuffer:h})}drawStaticMesh(e){if(e.count<=0)return;const t=this.gl;this.prepareDraw(),t.bindBuffer(t.ARRAY_BUFFER,e.posBuffer),t.vertexAttribPointer(this.posLoc,4,t.FLOAT,!1,0,0),t.bindBuffer(t.ARRAY_BUFFER,e.texCoordBuffer),t.vertexAttribPointer(this.texCoordLoc,2,t.FLOAT,!1,0,0),t.bindBuffer(t.ARRAY_BUFFER,e.colorBuffer),t.vertexAttribPointer(this.colorAttrLoc,4,t.FLOAT,!1,0,0),t.drawArrays(e.mode,0,e.count)}deleteStaticMesh(e){const t=this.gl;t.deleteBuffer(e.posBuffer),t.deleteBuffer(e.texCoordBuffer),t.deleteBuffer(e.colorBuffer)}drawVertex(e,t,r=0){this.begin("points"),this.vertexXYZ(e,t,r),this.end()}setPointSize(e){this.pointSize=Math.max(1,e)}enable(e){const t=this.gl;if(e===t.BLEND){t.enable(t.BLEND);return}if(e===t.DEPTH_TEST){t.enable(t.DEPTH_TEST);return}if(e===t.TEXTURE_2D){this.textureEnabled=!0;return}}disable(e){const t=this.gl;if(e===t.BLEND){t.disable(t.BLEND);return}if(e===t.DEPTH_TEST){t.disable(t.DEPTH_TEST);return}if(e===t.TEXTURE_2D){this.textureEnabled=!1;return}}createTextureFromImage(e){const t=this.gl,r=t.createTexture();return r?(t.bindTexture(t.TEXTURE_2D,r),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,1),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,t.RGBA,t.UNSIGNED_BYTE,e),t.bindTexture(t.TEXTURE_2D,null),r):null}bindTexture(e){this.boundTexture=e,this.gl.bindTexture(this.gl.TEXTURE_2D,e)}texCoord2f(e,t){this.currentTexU=e,this.currentTexV=t}deleteTexture(e){this.boundTexture===e&&(this.boundTexture=null),this.gl.deleteTexture(e)}close(){const e=this.gl;e.deleteBuffer(this.posBuffer),e.deleteBuffer(this.texCoordBuffer),e.deleteBuffer(this.colorBuffer),e.deleteProgram(this.program)}createRenderTarget(e,t){const r=this.gl,i=Math.max(1,e),n=Math.max(1,t),a=r.createTexture(),o=r.createFramebuffer();if(!a||!o)return a&&r.deleteTexture(a),o&&r.deleteFramebuffer(o),null;r.bindTexture(r.TEXTURE_2D,a),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MAG_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE),r.texImage2D(r.TEXTURE_2D,0,r.RGBA,i,n,0,r.RGBA,r.UNSIGNED_BYTE,null),r.bindFramebuffer(r.FRAMEBUFFER,o),r.framebufferTexture2D(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,a,0);const h=r.checkFramebufferStatus(r.FRAMEBUFFER);return r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindTexture(r.TEXTURE_2D,null),h!==r.FRAMEBUFFER_COMPLETE?(r.deleteFramebuffer(o),r.deleteTexture(a),null):{texture:a,framebuffer:o,width:i,height:n}}beginRenderTarget(e){const t=this.gl;this.activeRenderTarget=e,t.bindFramebuffer(t.FRAMEBUFFER,e.framebuffer),t.viewport(0,0,e.width,e.height)}endRenderTarget(){const e=this.gl;this.activeRenderTarget=null,e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,this.width,this.height)}deleteRenderTarget(e){const t=this.gl;this.activeRenderTarget===e&&this.endRenderTarget(),this.boundTexture===e.texture&&(this.boundTexture=null),t.deleteFramebuffer(e.framebuffer),t.deleteTexture(e.texture)}createProgram(){const e=this.gl,t=`
attribute vec4 aPosition;
attribute vec2 aTexCoord;
attribute vec4 aColor;
uniform float uPointSize;
uniform mat4 uMvp;
varying vec2 vTexCoord;
varying vec4 vColor;
void main() {
  gl_Position = uMvp * aPosition;
  gl_PointSize = uPointSize;
  vTexCoord = aTexCoord;
  vColor = aColor;
}`,r=`
precision mediump float;
uniform bool uUseTexture;
uniform sampler2D uSampler;
varying vec2 vTexCoord;
varying vec4 vColor;
void main() {
  vec4 color = vColor;
  if (uUseTexture) {
    color *= texture2D(uSampler, vTexCoord);
  }
  gl_FragColor = color;
}`,i=this.compileShader(e.VERTEX_SHADER,t),n=this.compileShader(e.FRAGMENT_SHADER,r),a=e.createProgram();if(!a)throw new J("Unable to create WebGL program");if(e.attachShader(a,i),e.attachShader(a,n),e.linkProgram(a),!e.getProgramParameter(a,e.LINK_STATUS)){const o=e.getProgramInfoLog(a)??"unknown link error";throw e.deleteProgram(a),new J(`Unable to link WebGL program: ${o}`)}return e.deleteShader(i),e.deleteShader(n),a}compileShader(e,t){const r=this.gl,i=r.createShader(e);if(!i)throw new J("Unable to create shader");if(r.shaderSource(i,t),r.compileShader(i),!r.getShaderParameter(i,r.COMPILE_STATUS)){const n=r.getShaderInfoLog(i)??"unknown compile error";throw r.deleteShader(i),new J(`Unable to compile shader: ${n}`)}return i}drawImmediate(e,t,r,i){const n=this.gl,a=this.getDrawCall(e,t,r,i);a&&(this.prepareDraw(),n.bindBuffer(n.ARRAY_BUFFER,this.posBuffer),n.bufferData(n.ARRAY_BUFFER,a.vertices,n.STREAM_DRAW),n.vertexAttribPointer(this.posLoc,4,n.FLOAT,!1,0,0),n.bindBuffer(n.ARRAY_BUFFER,this.texCoordBuffer),n.bufferData(n.ARRAY_BUFFER,a.texCoords,n.STREAM_DRAW),n.vertexAttribPointer(this.texCoordLoc,2,n.FLOAT,!1,0,0),n.bindBuffer(n.ARRAY_BUFFER,this.colorBuffer),n.bufferData(n.ARRAY_BUFFER,a.colors,n.STREAM_DRAW),n.vertexAttribPointer(this.colorAttrLoc,4,n.FLOAT,!1,0,0),n.drawArrays(a.mode,0,a.count))}drawPacked(e,t,r,i,n){if(t<=0)return;const a=this.gl;this.prepareDraw(),a.bindBuffer(a.ARRAY_BUFFER,this.posBuffer),a.bufferData(a.ARRAY_BUFFER,r,a.STREAM_DRAW),a.vertexAttribPointer(this.posLoc,4,a.FLOAT,!1,0,0),a.bindBuffer(a.ARRAY_BUFFER,this.texCoordBuffer),a.bufferData(a.ARRAY_BUFFER,i,a.STREAM_DRAW),a.vertexAttribPointer(this.texCoordLoc,2,a.FLOAT,!1,0,0),a.bindBuffer(a.ARRAY_BUFFER,this.colorBuffer),a.bufferData(a.ARRAY_BUFFER,n,a.STREAM_DRAW),a.vertexAttribPointer(this.colorAttrLoc,4,a.FLOAT,!1,0,0),a.drawArrays(e,0,t)}ensureDrawBuffers(e){const t=e*4;this.drawVerticesBuffer.length<t&&(this.drawVerticesBuffer=new Float32Array(te(t)));const r=e*2;this.drawTexCoordsBuffer.length<r&&(this.drawTexCoordsBuffer=new Float32Array(te(r)));const i=e*4;this.drawColorsBuffer.length<i&&(this.drawColorsBuffer=new Float32Array(te(i)))}createPackedDrawCall(e,t,r){const i=Math.floor(t.length/3);if(i<=0)return null;this.ensureDrawBuffers(i);const n=r.length>=i*4;let a=0,o=0,h=0;for(let L=0;L<i;L++){const S=L*3;if(this.drawVerticesBuffer[a++]=t[S],this.drawVerticesBuffer[a++]=t[S+1],this.drawVerticesBuffer[a++]=t[S+2],this.drawVerticesBuffer[a++]=1,this.drawTexCoordsBuffer[o++]=0,this.drawTexCoordsBuffer[o++]=0,n){const v=L*4;this.drawColorsBuffer[h++]=r[v],this.drawColorsBuffer[h++]=r[v+1],this.drawColorsBuffer[h++]=r[v+2],this.drawColorsBuffer[h++]=r[v+3]}else this.drawColorsBuffer[h++]=this.drawColor[0],this.drawColorsBuffer[h++]=this.drawColor[1],this.drawColorsBuffer[h++]=this.drawColor[2],this.drawColorsBuffer[h++]=this.drawColor[3]}const u=this.mapPrimitiveToDrawMode(e);if(u!==null)return{mode:u,count:i,vertices:this.drawVerticesBuffer.subarray(0,i*4),texCoords:this.drawTexCoordsBuffer.subarray(0,i*2),colors:this.drawColorsBuffer.subarray(0,i*4)};const d=Array.from(this.drawVerticesBuffer.subarray(0,i*4)),m=Array.from(this.drawTexCoordsBuffer.subarray(0,i*2)),b=Array.from(this.drawColorsBuffer.subarray(0,i*4)),g=this.getDrawCall(e,d,m,b);return g||null}mapPrimitiveToDrawMode(e){const t=this.gl;switch(e){case"points":return t.POINTS;case"lines":return t.LINES;case"lineStrip":return t.LINE_STRIP;case"lineLoop":return t.LINE_LOOP;case"triangles":return t.TRIANGLES;case"triangleStrip":return t.TRIANGLE_STRIP;case"triangleFan":return t.TRIANGLE_FAN;default:return null}}applyBlendMode(){const e=this.gl;if(this.blendMode==="additive"){e.blendFunc(e.SRC_ALPHA,e.ONE);return}e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA)}prepareDraw(){const e=this.gl;e.useProgram(this.program),e.uniform1f(this.pointSizeLoc,this.pointSize),e.uniformMatrix4fv(this.mvpLoc,!1,this.getCurrentMvp());const t=this.textureEnabled&&this.boundTexture!==null;e.uniform1i(this.useTextureLoc,t?1:0),e.activeTexture(e.TEXTURE0),t&&this.boundTexture&&e.bindTexture(e.TEXTURE_2D,this.boundTexture)}getDrawCall(e,t,r,i){const n=this.gl;if(t.length<4||r.length<2||i.length<4)return null;const a=Math.floor(t.length/4),o=Math.floor(r.length/2),h=Math.floor(i.length/4),u=Math.min(a,o,h);if(u<=0)return null;const d=t.slice(0,u*4),m=r.slice(0,u*2),b=i.slice(0,u*4);switch(e){case"points":return{mode:n.POINTS,vertices:new Float32Array(d),texCoords:new Float32Array(m),colors:new Float32Array(b),count:u};case"lines":return{mode:n.LINES,vertices:new Float32Array(d),texCoords:new Float32Array(m),colors:new Float32Array(b),count:u-u%2};case"lineStrip":return{mode:n.LINE_STRIP,vertices:new Float32Array(d),texCoords:new Float32Array(m),colors:new Float32Array(b),count:u};case"lineLoop":{if(u<2)return null;const g=d.slice(),L=m.slice(),S=b.slice();return g.push(d[0],d[1],d[2],d[3]),L.push(m[0],m[1]),S.push(b[0],b[1],b[2],b[3]),{mode:n.LINE_STRIP,vertices:new Float32Array(g),texCoords:new Float32Array(L),colors:new Float32Array(S),count:u+1}}case"triangles":return{mode:n.TRIANGLES,vertices:new Float32Array(d),texCoords:new Float32Array(m),colors:new Float32Array(b),count:u-u%3};case"triangleStrip":return{mode:n.TRIANGLE_STRIP,vertices:new Float32Array(d),texCoords:new Float32Array(m),colors:new Float32Array(b),count:u};case"triangleFan":return{mode:n.TRIANGLE_FAN,vertices:new Float32Array(d),texCoords:new Float32Array(m),colors:new Float32Array(b),count:u};case"quads":{if(u<4)return null;const g=[],L=[],S=[];for(let v=0;v+3<u;v+=4){const N=v*4,O=(v+1)*4,G=(v+2)*4,U=(v+3)*4,Q=v*2,we=(v+1)*2,Dt=(v+2)*2,ye=(v+3)*2,ut=v*4,Bt=(v+1)*4,pt=(v+2)*4,Ot=(v+3)*4;g.push(d[N],d[N+1],d[N+2],d[N+3],d[O],d[O+1],d[O+2],d[O+3],d[G],d[G+1],d[G+2],d[G+3],d[N],d[N+1],d[N+2],d[N+3],d[G],d[G+1],d[G+2],d[G+3],d[U],d[U+1],d[U+2],d[U+3]),L.push(m[Q],m[Q+1],m[we],m[we+1],m[Dt],m[Dt+1],m[Q],m[Q+1],m[Dt],m[Dt+1],m[ye],m[ye+1]),S.push(b[ut],b[ut+1],b[ut+2],b[ut+3],b[Bt],b[Bt+1],b[Bt+2],b[Bt+3],b[pt],b[pt+1],b[pt+2],b[pt+3],b[ut],b[ut+1],b[ut+2],b[ut+3],b[pt],b[pt+1],b[pt+2],b[pt+3],b[Ot],b[Ot+1],b[Ot+2],b[Ot+3])}return{mode:n.TRIANGLES,vertices:new Float32Array(g),texCoords:new Float32Array(L),colors:new Float32Array(S),count:g.length/4}}default:return null}}getCurrentMatrix(){return this.matrixMode===5889?this.projection:this.modelView}setCurrentMatrix(e){this.matrixMode===5889?this.projection=e:this.modelView=e,this.mvpDirty=!0}mulCurrentMatrix(e){const t=this.getCurrentMatrix();this.setCurrentMatrix(le(t,e))}getCurrentMvp(){return this.mvpDirty&&(this.mvp=le(this.projection,this.modelView),this.mvpDirty=!1),this.mvp}}function mt(c){return Math.max(0,Math.min(1,c))}function te(c){let e=1;for(;e<c;)e<<=1;return e}function dt(){return new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])}function Ee(c){return new Float32Array(c)}function le(c,e){const t=new Float32Array(16);for(let r=0;r<4;r++){const i=e[r*4],n=e[r*4+1],a=e[r*4+2],o=e[r*4+3];t[r*4]=c[0]*i+c[4]*n+c[8]*a+c[12]*o,t[r*4+1]=c[1]*i+c[5]*n+c[9]*a+c[13]*o,t[r*4+2]=c[2]*i+c[6]*n+c[10]*a+c[14]*o,t[r*4+3]=c[3]*i+c[7]*n+c[11]*a+c[15]*o}return t}function ke(c,e,t){return new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,c,e,t,1])}function qe(c,e,t){return new Float32Array([c,0,0,0,0,e,0,0,0,0,t,0,0,0,0,1])}function Ze(c,e,t,r){const i=Math.hypot(e,t,r);if(i<=0)return dt();const n=e/i,a=t/i,o=r/i,h=c*Math.PI/180,u=Math.cos(h),d=Math.sin(h),m=1-u;return new Float32Array([n*n*m+u,a*n*m+o*d,o*n*m-a*d,0,n*a*m-o*d,a*a*m+u,o*a*m+n*d,0,n*o*m+a*d,a*o*m-n*d,o*o*m+u,0,0,0,0,1])}function Ke(c,e,t,r,i,n){const a=e-c,o=r-t,h=n-i;return a===0||o===0||h===0||i===0?dt():new Float32Array([2*i/a,0,0,0,0,2*i/o,0,0,(e+c)/a,(r+t)/o,-(n+i)/h,-1,0,0,-2*n*i/h,0])}function Je(c,e,t,r,i,n){const a=e-c,o=r-t,h=n-i;return a===0||o===0||h===0?dt():new Float32Array([2/a,0,0,0,0,2/o,0,0,0,0,-2/h,0,-(e+c)/a,-(r+t)/o,-(n+i)/h,1])}function Qe(c,e,t,r,i,n,a,o,h){let u=r-c,d=i-e,m=n-t;const b=Math.hypot(u,d,m);if(b===0)return dt();u/=b,d/=b,m/=b;let g=d*h-m*o,L=m*a-u*h,S=u*o-d*a;const v=Math.hypot(g,L,S);if(v===0)return dt();g/=v,L/=v,S/=v;const N=L*m-S*d,O=S*u-g*m,G=g*d-L*u,U=new Float32Array([g,N,-u,0,L,O,-d,0,S,G,-m,0,0,0,0,1]);return le(U,ke(-c,-e,-t))}const p=class p{constructor(){s(this,"onWindowResize",null);s(this,"onVisualViewportResize",null)}initSDL(){if(typeof document<"u"){let e=document.getElementById("tt-screen-root");e||(e=document.createElement("div"),e.id="tt-screen-root",e.style.position="relative",e.style.display="inline-block",document.body.appendChild(e)),document.body.style.margin="0",document.body.style.overflow="hidden";let t=document.getElementById("tt-screen");t||(t=document.createElement("canvas"),t.id="tt-screen",t.style.display="block",e.appendChild(t)),t.width=p.width,t.height=p.height,t.style.width=`${p.width}px`,t.style.height=`${p.height}px`,p.canvas=t,p.gl=me.create(t);let r=document.getElementById("tt-screen-overlay");r||(r=document.createElement("canvas"),r.id="tt-screen-overlay",r.style.position="absolute",r.style.left="0",r.style.top="0",r.style.pointerEvents="none",e.appendChild(r)),r.width=p.width,r.height=p.height,r.style.width=`${p.width}px`,r.style.height=`${p.height}px`,p.overlayCanvas=r,p.ctx2d=r.getContext("2d")}typeof window<"u"&&p.autoResizeToWindow?(this.onWindowResize=()=>{const e=this.getViewportSize();this.resized(e.width,e.height)},window.addEventListener("resize",this.onWindowResize),window.visualViewport&&(this.onVisualViewportResize=()=>{const e=this.getViewportSize();this.resized(e.width,e.height)},window.visualViewport.addEventListener("resize",this.onVisualViewportResize),window.visualViewport.addEventListener("scroll",this.onVisualViewportResize)),this.onWindowResize()):this.resized(p.width,p.height),this.init()}screenResized(){}resized(e,t){var r;p.width=e,p.height=t,p.canvas&&(p.canvas.width=e,p.canvas.height=t,p.canvas.style.width=`${e}px`,p.canvas.style.height=`${t}px`),p.overlayCanvas&&(p.overlayCanvas.width=e,p.overlayCanvas.height=t,p.overlayCanvas.style.width=`${e}px`,p.overlayCanvas.style.height=`${t}px`),(r=p.gl)==null||r.resize(e,t),this.resetProjectionForResize(),this.screenResized()}resetProjectionForResize(){const e=p.nearPlane,t=p.farPlane,r=Math.max(1,p.width),i=Math.max(1,p.height),n=e*i/r,a=-n,o=-e,h=e;p.glMatrixMode(p.GL_PROJECTION),p.glLoadIdentity(),p.glFrustum(o,h,a,n,.1,t),p.glMatrixMode(p.GL_MODELVIEW)}closeSDL(){var e;typeof window<"u"&&this.onWindowResize&&(window.removeEventListener("resize",this.onWindowResize),this.onWindowResize=null),typeof window<"u"&&window.visualViewport&&this.onVisualViewportResize&&(window.visualViewport.removeEventListener("resize",this.onVisualViewportResize),window.visualViewport.removeEventListener("scroll",this.onVisualViewportResize),this.onVisualViewportResize=null),this.close(),(e=p.gl)==null||e.close(),p.gl=null,p.ctx2d=null,p.overlayCanvas=null,p.canvas=null}flip(){var e;(e=p.gl)==null||e.flush(),this.handleError()}clear(){var e;(e=p.gl)==null||e.clear(),p.ctx2d&&p.ctx2d.clearRect(0,0,p.width,p.height)}handleError(){}setCaption(e){typeof document<"u"&&(document.title=e)}getViewportSize(){if(typeof window>"u")return{width:p.width,height:p.height};const e=window.visualViewport;return e?{width:Math.max(1,Math.round(e.width)),height:Math.max(1,Math.round(e.height))}:{width:Math.max(1,window.innerWidth),height:Math.max(1,window.innerHeight)}}static setColor(e,t,r,i=1){p.drawColor=xe(e,t,r,i),p.captureOrRun(()=>{var n;(n=p.gl)==null||n.setDrawColor(e,t,r,i)})}static setClearColor(e,t,r,i=1){p.clearColor=xe(e,t,r,i),p.captureOrRun(()=>{var n;(n=p.gl)==null||n.setClearColor(e,t,r,i)})}static glVertex(e){p.glVertexXYZ(e.x,e.y,e.z)}static glVertexXYZ(e,t,r=0){p.captureOrRun(()=>{var i;(i=p.gl)==null||i.vertexXYZ(e,t,r)})}static glVertex3f(e,t,r){p.glVertexXYZ(e,t,r)}static glTranslate(e){p.glTranslatef(e.x,e.y,e.z)}static glTranslatef(e,t,r){p.captureOrRun(()=>{var i;(i=p.gl)==null||i.translateXYZ(e,t,r)})}static glScalef(e,t,r){p.captureOrRun(()=>{var i;(i=p.gl)==null||i.scaleXYZ(e,t,r)})}static glRotatef(e,t,r,i){p.captureOrRun(()=>{var n;(n=p.gl)==null||n.rotateDeg(e,t,r,i)})}static glBegin(e){const t=ee(e);p.captureOrRun(()=>{var r;(r=p.gl)==null||r.begin(t)})}static glEnd(){p.captureOrRun(()=>{var e;(e=p.gl)==null||e.end()})}static glDrawArrays(e,t,r){const i=ee(e);p.captureOrRun(()=>{var n;(n=p.gl)==null||n.drawArraysXYZC(i,t,r)})}static glCreateStaticMesh(e,t,r){var n;const i=ee(e);return((n=p.gl)==null?void 0:n.createStaticMeshXYZC(i,t,r))??null}static glDrawStaticMesh(e){p.captureOrRun(()=>{var t;(t=p.gl)==null||t.drawStaticMesh(e)})}static glDeleteStaticMesh(e){p.captureOrRun(()=>{var t;(t=p.gl)==null||t.deleteStaticMesh(e)})}static glLoadIdentity(){p.captureOrRun(()=>{var e;(e=p.gl)==null||e.loadIdentity()})}static glPushMatrix(){p.captureOrRun(()=>{var e;(e=p.gl)==null||e.pushMatrix()})}static glPopMatrix(){p.captureOrRun(()=>{var e;(e=p.gl)==null||e.popMatrix()})}static glBlendAdditive(){p.captureOrRun(()=>{var e;(e=p.gl)==null||e.setBlendMode("additive")})}static glBlendAlpha(){p.captureOrRun(()=>{var e;(e=p.gl)==null||e.setBlendMode("alpha")})}static glPointSize(e){p.captureOrRun(()=>{var t;(t=p.gl)==null||t.setPointSize(e)})}static glEnable(e){p.captureOrRun(()=>{var t;(t=p.gl)==null||t.enable(e)})}static glDisable(e){p.captureOrRun(()=>{var t;(t=p.gl)==null||t.disable(e)})}static glBlendFunc(e,t){p.captureOrRun(()=>{var r,i;if(e===p.GL_SRC_ALPHA&&t===p.GL_ONE){(r=p.gl)==null||r.setBlendMode("additive");return}e===p.GL_SRC_ALPHA&&t===p.GL_ONE_MINUS_SRC_ALPHA&&((i=p.gl)==null||i.setBlendMode("alpha"))})}static glMatrixMode(e){p.captureOrRun(()=>{var t;(t=p.gl)==null||t.setMatrixMode(e)})}static glViewport(e,t,r,i){var n;(n=p.gl)==null||n.setViewport(r,i)}static glFrustum(e,t,r,i,n,a){p.captureOrRun(()=>{var o;(o=p.gl)==null||o.frustum(e,t,r,i,n,a)})}static glClear(e){var t;(e&p.GL_COLOR_BUFFER_BIT)!==0&&((t=p.gl)==null||t.clear())}static glLineWidth(e){}static glOrtho(e,t,r,i,n,a){p.captureOrRun(()=>{var o;(o=p.gl)==null||o.ortho(e,t,r,i,n,a)})}static glTexCoord2f(e,t){p.captureOrRun(()=>{var r;(r=p.gl)==null||r.texCoord2f(e,t)})}static gluLookAt(e,t,r,i,n,a,o,h,u){p.captureOrRun(()=>{var d;(d=p.gl)==null||d.lookAt(e,t,r,i,n,a,o,h,u)})}static beginDisplayListCapture(e){p.captureCommands=[],p.captureCommit=e}static endDisplayListCapture(){if(!p.captureCommands||!p.captureCommit){p.captureCommands=null,p.captureCommit=null;return}const e=p.captureCommands.slice();p.captureCommands=null;const t=p.captureCommit;p.captureCommit=null,t(e)}static captureOrRun(e){if(p.captureCommands){p.captureCommands.push(e);return}e()}};s(p,"GL_POINTS",0),s(p,"GL_LINES",1),s(p,"GL_LINE_LOOP",2),s(p,"GL_LINE_STRIP",3),s(p,"GL_TRIANGLES",4),s(p,"GL_TRIANGLE_STRIP",5),s(p,"GL_TRIANGLE_FAN",6),s(p,"GL_QUADS",7),s(p,"GL_BLEND",3042),s(p,"GL_DEPTH_TEST",2929),s(p,"GL_SRC_ALPHA",770),s(p,"GL_ONE",1),s(p,"GL_ONE_MINUS_SRC_ALPHA",771),s(p,"GL_LINE_SMOOTH",2848),s(p,"GL_COLOR_MATERIAL",2903),s(p,"GL_CULL_FACE",2884),s(p,"GL_LIGHTING",2896),s(p,"GL_TEXTURE_2D",3553),s(p,"GL_MODELVIEW",5888),s(p,"GL_PROJECTION",5889),s(p,"GL_COLOR_BUFFER_BIT",16384),s(p,"brightness",1),s(p,"width",640),s(p,"height",480),s(p,"windowMode",!1),s(p,"autoResizeToWindow",!0),s(p,"nearPlane",.1),s(p,"farPlane",1e3),s(p,"canvas",null),s(p,"overlayCanvas",null),s(p,"ctx2d",null),s(p,"gl",null),s(p,"clearColor","rgba(0, 0, 0, 1)"),s(p,"drawColor","rgba(255, 255, 255, 1)"),s(p,"captureCommands",null),s(p,"captureCommit",null);let l=p;function xe(c,e,t,r){const i=Math.max(0,Math.min(1,c)),n=Math.max(0,Math.min(1,e)),a=Math.max(0,Math.min(1,t)),o=Math.max(0,Math.min(1,r));return`rgba(${Math.round(i*255)}, ${Math.round(n*255)}, ${Math.round(a*255)}, ${o})`}function ee(c){if(typeof c=="string")return c;switch(c){case l.GL_POINTS:return"points";case l.GL_LINES:return"lines";case l.GL_LINE_LOOP:return"lineLoop";case l.GL_LINE_STRIP:return"lineStrip";case l.GL_TRIANGLES:return"triangles";case l.GL_TRIANGLE_STRIP:return"triangleStrip";case l.GL_TRIANGLE_FAN:return"triangleFan";case l.GL_QUADS:return"quads";default:return"triangles"}}const Se=24;class tr{constructor(e,t,r,i){s(this,"INTERVAL_BASE",16);s(this,"interval",this.INTERVAL_BASE);s(this,"accframe",0);s(this,"maxSkipFrame",5);s(this,"event",{type:0});s(this,"screen");s(this,"input");s(this,"gameManager");s(this,"prefManager");s(this,"done",!1);s(this,"rafId",null);s(this,"running",!1);s(this,"finalized",!1);s(this,"lastTickMs",0);s(this,"accumulatorMs",0);s(this,"frameStats",new We);s(this,"lastStatsPublishMs",0);s(this,"lastStatsSnapshot",null);this.screen=e,this.input=t,r.setMainLoop(this),r.setUIs(e,t),r.setPrefManager(i),this.gameManager=r,this.prefManager=i}initFirst(){this.prefManager.load();try{z.init()}catch(e){if(e instanceof J)Rt.error(e);else throw e}this.gameManager.init()}quitLast(){this.gameManager.close(),z.close(),this.prefManager.save(),this.screen.closeSDL()}breakLoop(){this.done=!0,this.rafId!==null&&typeof cancelAnimationFrame=="function"&&(cancelAnimationFrame(this.rafId),this.rafId=null),this.running&&this.finalizeOnce(),this.running=!1}loop(){this.done=!1,this.running=!0,this.finalized=!1;const e=this.nowMs();if(this.frameStats.reset(e),this.lastStatsPublishMs=e,this.screen.initSDL(),this.initFirst(),this.gameManager.start(),typeof requestAnimationFrame=="function"){this.startBrowserLoop();return}this.startFallbackLoop()}startBrowserLoop(){this.accumulatorMs=0,this.lastTickMs=this.nowMs();const e=t=>{if(this.done)return;const r=t-this.lastTickMs;this.lastTickMs=t,this.accumulatorMs+=Math.max(0,r),this.input.handleEvent({type:Se});let i=0;for(;this.accumulatorMs>=this.interval&&i<this.maxSkipFrame;)this.gameManager.move(),this.accumulatorMs-=this.interval,i++;i>=this.maxSkipFrame&&this.accumulatorMs>=this.interval&&(this.accumulatorMs=0),this.screen.clear(),this.gameManager.draw(),this.drawOverlay(),this.screen.flip(),this.frameStats.recordFrame(r,i,t),this.publishStats(t),this.rafId=requestAnimationFrame(e)};this.rafId=requestAnimationFrame(e)}startFallbackLoop(){let e=0,t,r;for(;!this.done;){const i=this.nowMs();this.input.handleEvent({type:Se}),t=this.nowMs(),r=(t-e)/this.interval|0,r<=0?(r=1,e+this.interval-t,this.accframe?e=this.nowMs():e+=this.interval):r>this.maxSkipFrame?(r=this.maxSkipFrame,e=t):e+=r*this.interval;for(let a=0;a<r;a++)this.gameManager.move();this.screen.clear(),this.gameManager.draw(),this.drawOverlay(),this.screen.flip();const n=this.nowMs();this.frameStats.recordFrame(n-i,r,n),this.publishStats(n)}this.running=!1,this.finalizeOnce()}nowMs(){return typeof performance<"u"&&typeof performance.now=="function"?performance.now():Date.now()}finalizeOnce(){this.finalized||(this.finalized=!0,this.quitLast())}publishStats(e){if(typeof globalThis>"u"||(this.lastStatsSnapshot||(this.lastStatsSnapshot=this.frameStats.getSnapshot()),e-this.lastStatsPublishMs<1e3))return;this.lastStatsPublishMs=e;const t=globalThis;this.lastStatsSnapshot=this.frameStats.getSnapshot(),t.__ttFrameStats=this.lastStatsSnapshot}drawOverlay(){var r;const e=l.ctx2d;if(!e)return;e.clearRect(0,0,l.width,l.height);const t=this.input;(r=t.drawTouchGuide)==null||r.call(t,e,l.width,l.height),this.lastStatsSnapshot&&this.drawStatsOverlay(this.lastStatsSnapshot)}drawStatsOverlay(e){if(!globalThis.__ttShowFrameStats)return;const r=l.ctx2d;if(!r)return;const i=`FPS ${e.avgFps.toFixed(1)} / AVG ${e.avgFrameMs.toFixed(2)}ms / WORST ${e.worstFrameMs.toFixed(2)}ms / DROP ${e.droppedFrames}`;r.save(),r.globalCompositeOperation="source-over",r.fillStyle="rgba(0,0,0,0.55)",r.fillRect(8,8,Math.min(l.width-16,520),20),r.fillStyle="rgba(180,255,180,0.95)",r.font="12px monospace",r.textBaseline="top",r.fillText(i,12,12),r.restore()}}const V=1,_t=39,Ft=37,Yt=40,Gt=38,er=102,rr=100,ir=98,sr=104,nr=68,ar=65,lr=83,or=87,Ut=90,hr=190,cr=17,Vt=88,dr=191,ur=18,pr=16,re=80,nt=class nt{constructor(){s(this,"keys",{});s(this,"buttonReversed",!1);s(this,"lastDirState",0);s(this,"lastButtonState",0);s(this,"stickIndex",-1);s(this,"JOYSTICK_AXIS",16384);s(this,"listenersBound",!1);s(this,"touchRoles",new Map);s(this,"touchMovePointerId",null);s(this,"touchMoveOriginX",0);s(this,"touchMoveOriginY",0);s(this,"touchMoveCurrentX",0);s(this,"touchMoveCurrentY",0);s(this,"touchGuideEnabled",!1)}openJoystick(){typeof window>"u"||(this.bindKeyboardListeners(),this.bindGamepadListeners(),this.bindTouchListeners(),this.touchGuideEnabled=this.detectTouchScreen())}handleEvent(e){this.refreshGamepad()}getDirState(){let e=0,t=0,r=0;const i=this.getActiveGamepad();return i&&(e=(i.axes[0]??0)*32767|0,t=(i.axes[1]??0)*32767|0),(this.keys[_t]===V||this.keys[er]===V||this.keys[nr]===V||e>this.JOYSTICK_AXIS)&&(r|=nt.Dir.RIGHT),(this.keys[Ft]===V||this.keys[rr]===V||this.keys[ar]===V||e<-this.JOYSTICK_AXIS)&&(r|=nt.Dir.LEFT),(this.keys[Yt]===V||this.keys[ir]===V||this.keys[lr]===V||t>this.JOYSTICK_AXIS)&&(r|=nt.Dir.DOWN),(this.keys[Gt]===V||this.keys[sr]===V||this.keys[or]===V||t<-this.JOYSTICK_AXIS)&&(r|=nt.Dir.UP),this.lastDirState=r,r}getButtonState(){var m,b,g,L,S,v,N,O;let e=0;const t=this.getActiveGamepad(),r=(m=t==null?void 0:t.buttons[0])!=null&&m.pressed?1:0,i=(b=t==null?void 0:t.buttons[1])!=null&&b.pressed?1:0,n=(g=t==null?void 0:t.buttons[2])!=null&&g.pressed?1:0,a=(L=t==null?void 0:t.buttons[3])!=null&&L.pressed?1:0,o=(S=t==null?void 0:t.buttons[4])!=null&&S.pressed?1:0,h=(v=t==null?void 0:t.buttons[5])!=null&&v.pressed?1:0,u=(N=t==null?void 0:t.buttons[6])!=null&&N.pressed?1:0,d=(O=t==null?void 0:t.buttons[7])!=null&&O.pressed?1:0;return(this.keys[Ut]===V||this.keys[hr]===V||this.keys[cr]===V||r||a||o||d)&&(this.buttonReversed?e|=nt.Button.B:e|=nt.Button.A),(this.keys[Vt]===V||this.keys[dr]===V||this.keys[ur]===V||this.keys[pr]===V||i||n||h||u)&&(this.buttonReversed?e|=nt.Button.A:e|=nt.Button.B),this.lastButtonState=e,e}drawTouchGuide(e,t,r){if(!this.touchGuideEnabled)return;const i=this.getTouchGuideLayout(t,r);this.drawTouchCircle(e,i.move.x,i.move.y,i.move.radius,"MOVE"),this.drawTouchCircle(e,i.fire.x,i.fire.y,i.fire.radius,"SHOT"),this.drawTouchCircle(e,i.charge.x,i.charge.y,i.charge.radius,"CHARGE"),this.drawTouchCircle(e,i.pause.x,i.pause.y,i.pause.radius,"II")}bindKeyboardListeners(){this.listenersBound||typeof window>"u"||(this.listenersBound=!0,window.addEventListener("keydown",e=>{this.keys[e.keyCode]=V}),window.addEventListener("keyup",e=>{this.keys[e.keyCode]=0}),window.addEventListener("blur",()=>{this.keys={},this.clearTouchState()}))}bindGamepadListeners(){typeof window>"u"||(window.addEventListener("gamepadconnected",e=>{const t=e.gamepad;this.stickIndex<0&&(this.stickIndex=t.index)}),window.addEventListener("gamepaddisconnected",e=>{e.gamepad.index===this.stickIndex&&(this.stickIndex=-1)}),this.refreshGamepad())}bindTouchListeners(){if(typeof window>"u")return;const e=i=>{if(i.pointerType==="mouse")return;i.preventDefault();const n=this.resolveTouchRole(i.clientX,i.clientY);this.touchRoles.set(i.pointerId,n),n==="move"&&(this.touchMovePointerId=i.pointerId,this.touchMoveOriginX=i.clientX,this.touchMoveOriginY=i.clientY,this.touchMoveCurrentX=i.clientX,this.touchMoveCurrentY=i.clientY,this.updateTouchMoveKeys()),n==="fire"&&(this.keys[Ut]=V),n==="charge"&&(this.keys[Vt]=V),n==="pause"&&(this.keys[re]=V)},t=i=>{i.pointerType==="mouse"||this.touchRoles.get(i.pointerId)!=="move"||this.touchMovePointerId!==i.pointerId||(i.preventDefault(),this.touchMoveCurrentX=i.clientX,this.touchMoveCurrentY=i.clientY,this.updateTouchMoveKeys())},r=i=>{i.pointerType!=="mouse"&&(i.preventDefault(),this.releaseTouchPointer(i.pointerId))};window.addEventListener("pointerdown",e,{passive:!1}),window.addEventListener("pointermove",t,{passive:!1}),window.addEventListener("pointerup",r,{passive:!1}),window.addEventListener("pointercancel",r,{passive:!1}),window.addEventListener("visibilitychange",()=>{document.visibilityState!=="visible"&&this.clearTouchState()})}detectTouchScreen(){return typeof window>"u"||typeof navigator>"u"?!1:!!(navigator.maxTouchPoints>0||"ontouchstart"in window||typeof window.matchMedia=="function"&&window.matchMedia("(pointer: coarse)").matches)}resolveTouchRole(e,t){if(typeof window>"u")return"fire";const r=Math.max(1,window.innerWidth),i=Math.max(1,window.innerHeight),n=this.getTouchGuideLayout(r,i);return this.isInsideCircle(e,t,n.pause.x,n.pause.y,n.pause.radius)?"pause":this.isInsideCircle(e,t,n.fire.x,n.fire.y,n.fire.radius)?"fire":this.isInsideCircle(e,t,n.charge.x,n.charge.y,n.charge.radius)?"charge":this.isInsideCircle(e,t,n.move.x,n.move.y,n.move.radius*1.35)||e<r*.5?"move":t<i*.5?"fire":"charge"}updateTouchMoveKeys(){const t=this.touchMoveCurrentX-this.touchMoveOriginX,r=this.touchMoveCurrentY-this.touchMoveOriginY;this.keys[Ft]=t<-24?V:0,this.keys[_t]=t>24?V:0,this.keys[Gt]=r<-24?V:0,this.keys[Yt]=r>24?V:0}releaseTouchPointer(e){const t=this.touchRoles.get(e);t&&(this.touchRoles.delete(e),t==="move"&&this.touchMovePointerId===e&&(this.touchMovePointerId=null,this.keys[Ft]=0,this.keys[_t]=0,this.keys[Gt]=0,this.keys[Yt]=0),t==="fire"&&!this.hasTouchRole("fire")&&(this.keys[Ut]=0),t==="charge"&&!this.hasTouchRole("charge")&&(this.keys[Vt]=0),t==="pause"&&!this.hasTouchRole("pause")&&(this.keys[re]=0))}hasTouchRole(e){for(const t of this.touchRoles.values())if(t===e)return!0;return!1}clearTouchState(){this.touchRoles.clear(),this.touchMovePointerId=null,this.keys[Ft]=0,this.keys[_t]=0,this.keys[Gt]=0,this.keys[Yt]=0,this.keys[Ut]=0,this.keys[Vt]=0,this.keys[re]=0}getTouchGuideLayout(e,t){const r=Math.min(e,t),i=Math.max(36,r*.11),n=Math.max(30,r*.085),a=Math.max(20,r*.05);return{move:{x:e*.2,y:t*.64,radius:i},fire:{x:e*.86,y:t*.64,radius:n},charge:{x:e*.8,y:t*.82,radius:n},pause:{x:e*.92,y:t*.1,radius:a}}}isInsideCircle(e,t,r,i,n){const a=e-r,o=t-i;return a*a+o*o<=n*n}drawTouchCircle(e,t,r,i,n){e.save(),e.globalCompositeOperation="source-over",e.fillStyle="rgba(200, 245, 255, 0.09)",e.strokeStyle="rgba(210, 245, 255, 0.34)",e.lineWidth=Math.max(1.5,i*.06),e.beginPath(),e.arc(t,r,i,0,Math.PI*2),e.fill(),e.stroke(),e.fillStyle="rgba(210, 245, 255, 0.5)",e.font=`${Math.max(10,Math.round(i*.38))}px monospace`,e.textAlign="center",e.textBaseline="middle",e.fillText(n,t,r),e.restore()}refreshGamepad(){if(typeof navigator>"u"||typeof navigator.getGamepads!="function")return;const e=navigator.getGamepads();if(!(this.stickIndex>=0&&e[this.stickIndex])){this.stickIndex=-1;for(const t of e)if(t){this.stickIndex=t.index;break}}}getActiveGamepad(){if(typeof navigator>"u"||typeof navigator.getGamepads!="function")return null;const e=navigator.getGamepads();if(this.stickIndex>=0)return e[this.stickIndex]??null;for(const t of e)if(t)return t;return null}};s(nt,"Dir",{UP:1,DOWN:2,LEFT:4,RIGHT:8}),s(nt,"Button",{A:16,B:32,ANY:48});let tt=nt;class yt{constructor(){s(this,"_exists",!1)}get exists(){return this._exists}set exists(e){this._exists=e}}class Et{constructor(e,t=null,r){s(this,"actor",[]);s(this,"actorIdx",0);s(this,"factory");this.factory=r??(()=>{throw new Error("ActorPool factory is required in TypeScript port")}),typeof e=="number"&&this.createActors(e,t)}createActors(e,t=null){this.actor=[];for(let r=0;r<e;r++){const i=this.factory();i.exists=!1,i.init(t),this.actor.push(i)}this.actorIdx=0}getInstance(){for(let e=0;e<this.actor.length;e++)if(this.actorIdx--,this.actorIdx<0&&(this.actorIdx=this.actor.length-1),!this.actor[this.actorIdx].exists)return this.actor[this.actorIdx];return null}getInstanceForced(){return this.actorIdx--,this.actorIdx<0&&(this.actorIdx=this.actor.length-1),this.actor[this.actorIdx]}getMultipleInstances(e){const t=[];for(let r=0;r<e;r++){const i=this.getInstance();if(!i){for(const n of t)n.exists=!1;return null}i.exists=!0,t.push(i)}for(const r of t)r.exists=!1;return t}move(){for(const e of this.actor)e.exists&&e.move()}draw(){for(const e of this.actor)e.exists&&e.draw()}clear(){for(const e of this.actor)e.exists=!1;this.actorIdx=0}}class it{constructor(){oe(Date.now())}setSeed(e){oe(e)}nextInt32(){return Ht()}nextInt(e){return e===0?0:Ht()%e}nextSignedInt(e){return e===0?0:Ht()%(e*2)-e}nextFloat(e){return Te()*e}nextSignedFloat(e){return Te()*(e*2)-e}}const ot=624,ft=397,mr=2567483615,fr=2147483648,br=2147483647;function gr(c,e){return(c&fr|e&br)>>>0}function ie(c,e){return(gr(c,e)>>>1^((e&1)!==0?mr:0))>>>0}const Z=new Uint32Array(ot);let fe=1,Ne=0,De=0;function oe(c){Z[0]=c>>>0;for(let e=1;e<ot;e++)Z[e]=Math.imul(1812433253,Z[e-1]^Z[e-1]>>>30)+e>>>0;fe=1,Ne=1}function wr(){Ne===0&&oe(5489),fe=ot,De=0;for(let e=ot-ft+1;e>0;e--){const t=ot-ft+1-e;Z[t]=(Z[t+ft]^ie(Z[t],Z[t+1]))>>>0}for(let e=ft;e>0;e--){const t=ot-ft+1+(ft-e);Z[t]=(Z[t+ft-ot]^ie(Z[t],Z[t+1]))>>>0}const c=ot-1;Z[c]=(Z[c+ft-ot]^ie(Z[c],Z[0]))>>>0}function Ht(){--fe===0&&wr();let c=Z[De++];return c^=c>>>11,c^=c<<7&2636928640,c^=c<<15&4022730752,c^=c>>>18,c>>>0}function Te(){return Ht()*(1/4294967295)}class yr{constructor(){s(this,"mainLoop");s(this,"abstScreen");s(this,"input");s(this,"abstPrefManager")}setMainLoop(e){this.mainLoop=e}setUIs(e,t){this.abstScreen=e,this.input=t}setPrefManager(e){this.abstPrefManager=e}}const Er=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="top5">\r
  <fire>\r
   <direction>-100</direction>\r
   <bulletRef label="nrm1"/>\r
  </fire>\r
  <repeat> <times>4</times>\r
  <action>\r
   <fire>\r
    <direction type="sequence">50</direction>\r
    <bulletRef label="nrm1"/>\r
   </fire>\r
  </action>\r
  </repeat>\r
 <wait>62-$rank*32</wait>\r
</action>\r
\r
<action label="top7">\r
 <wait>26-$rank*8</wait>\r
  <fire>\r
   <direction>-120</direction>\r
   <bulletRef label="nrm2"/>\r
  </fire>\r
  <repeat> <times>6</times>\r
  <action>\r
   <fire>\r
    <direction type="sequence">40</direction>\r
    <bulletRef label="nrm2"/>\r
   </fire>\r
  </action>\r
  </repeat>\r
  <wait>40-$rank*30</wait>\r
</action>\r
\r
<bullet label="nrm1">\r
 <speed>0.7</speed>\r
</bullet>\r
\r
<bullet label="nrm2">\r
 <speed>1</speed>\r
</bullet>\r
\r
</bulletml>\r
`,xr=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="top">\r
 <repeat> <times>1+$rank*4.7</times>\r
 <action>\r
  <fire>\r
   <direction type="sequence">360/(1+$rank*4.7)</direction>\r
   <bulletRef label="6way"/>\r
  </fire>\r
  <wait>150/(1+$rank*4.7)</wait>\r
 </action>\r
 </repeat>\r
</action>\r
\r
<bullet label="6way">\r
<speed>$rand*0.5+0.5</speed>\r
<action>\r
 <wait>10+$rand*10</wait>\r
 <repeat> <times>6</times>\r
 <action>\r
  <fire>\r
   <direction type="sequence">60</direction>\r
   <bullet>\r
    <speed>0.9</speed>\r
   </bullet>\r
  </fire>\r
 </action>\r
 </repeat>\r
 <vanish/>\r
 </action>\r
</bullet>\r
\r
</bulletml>\r
`,Sr=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="top">\r
	<repeat><times>2+$rank*7.6</times>\r
	<action>\r
		<fire>\r
			<direction type="sequence">360/(2+$rank*7.6)</direction>\r
			<speed>1</speed>\r
			<bullet/>\r
		</fire>\r
		<wait>1</wait>\r
	</action>\r
	</repeat>\r
	<wait>42</wait>\r
</action>\r
\r
</bulletml>\r
`,Tr=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="top">\r
  <wait>90/(2+3*$rank)</wait>\r
  <actionRef label="four">\r
   <param>$rand*90-45</param>\r
  </actionRef>\r
</action>\r
\r
<action label="four">\r
 <fire>\r
  <direction type="absolute">90</direction>\r
  <speed>6</speed>\r
  <bulletRef label="rb">\r
   <param>$1</param>\r
  </bulletRef>\r
 </fire>\r
 <repeat> <times>3</times>\r
 <action>\r
  <fire>\r
   <direction type="sequence">60</direction>\r
   <speed>6</speed>\r
   <bulletRef label="rb">\r
    <param>$1</param>\r
   </bulletRef>\r
  </fire>\r
 </action>\r
 </repeat>\r
</action>\r
\r
<bullet label="rb">\r
 <actionRef label="red">\r
  <param>$1+$rand*20-10</param>\r
 </actionRef>\r
</bullet>\r
\r
<action label="red">\r
 <wait>1</wait>\r
 <fire>\r
  <direction>$1</direction>\r
  <speed>1</speed>\r
  <bullet/>\r
 </fire>\r
 <vanish/>\r
</action>\r
\r
</bulletml>\r
`,vr=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="top">\r
 <fire>\r
  <direction type="aim">-30</direction>\r
  <speed type="absolute">0.5</speed>\r
  <bullet/>\r
 </fire>\r
 <repeat> <times>2</times>\r
 <action>\r
  <fire>\r
   <direction type="sequence">30</direction>\r
   <speed type="sequence">0</speed>\r
   <bullet/>\r
  </fire>\r
 </action>\r
 </repeat>\r
 <wait>4</wait>\r
 <repeat> <times>1+$rank*6.9</times>\r
  <action>\r
  <fire>\r
   <direction type="aim">-30</direction>\r
   <speed type="sequence">0.2</speed>\r
   <bullet/>\r
  </fire>\r
  <repeat> <times>2</times>\r
  <action>\r
   <fire>\r
    <direction type="sequence">30</direction>\r
    <speed type="sequence">0</speed>\r
    <bullet/>\r
   </fire>\r
  </action>\r
  </repeat>\r
  <wait>4</wait>\r
 </action>\r
 </repeat>\r
 <wait>45</wait>\r
</action>\r
\r
</bulletml>\r
`,Rr=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="top">\r
	<fire>\r
		<direction>90-$rand*180</direction>\r
		<bulletRef label="3way"/>\r
	</fire>\r
	<wait>54</wait>\r
</action>\r
\r
<bullet label="3way">\r
	<speed>0.4</speed>\r
	<action>\r
		<fire>\r
			<direction type="absolute">$rand*360</direction>\r
			<speed>1</speed>\r
			<bullet/>\r
		</fire>\r
		<repeat><times>2</times>\r
		<action>\r
			<fire>\r
				<direction type="sequence">118</direction>\r
				<speed>1</speed>\r
				<bullet/>\r
			</fire>\r
		</action>\r
		</repeat>\r
		<repeat><times>2+$rank*7.2</times>\r
		<action>\r
			<wait>10-$rank*5</wait>\r
			<repeat><times>3</times>\r
			<action>\r
				<fire>\r
					<direction type="sequence">115</direction>\r
					<speed>1</speed>\r
					<bullet/>\r
				</fire>\r
			</action>\r
			</repeat>\r
		</action>\r
		</repeat>\r
		<vanish/>\r
	</action>\r
</bullet>\r
\r
</bulletml>\r
`,Lr=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="top">\r
  <fire>\r
   <direction>30-$rand*60</direction>\r
   <speed>0.4</speed>\r
   <bullet/>\r
  </fire>\r
  <actionRef label="grw">\r
  	<param>5-$rand*10</param>\r
  </actionRef>\r
  <wait>86</wait>\r
</action>\r
\r
<action label="grw">\r
  <repeat> <times>3+$rank*12.6</times>\r
  <action>\r
   <fire>\r
    <direction type="sequence">$1</direction>\r
    <speed type="sequence">0.05</speed>\r
    <bullet/>\r
   </fire>\r
   <wait>5</wait>\r
  </action>\r
  </repeat>\r
</action>\r
\r
</bulletml>\r
`,Ar=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="topshot1">\r
 <fire>\r
  <bulletRef label="acseed"/>\r
 </fire>\r
 <repeat> <times>1+$rank*6.2</times>\r
  <action> \r
   <wait>16</wait>\r
   <fire>\r
    <direction type="sequence">-20+$rank*10</direction>\r
    <bulletRef label="acseed"/>\r
   </fire>\r
  </action>\r
 </repeat>\r
 <wait>56</wait>\r
</action>\r
\r
<action label="topshot2">\r
 <fire>\r
  <bulletRef label="acseed"/>\r
 </fire>\r
 <repeat> <times>1+$rank*6.2</times>\r
  <action> \r
   <wait>16</wait>\r
   <fire>\r
    <direction type="sequence">20-$rank*10</direction>\r
    <bulletRef label="acseed"/>\r
   </fire>\r
  </action>\r
 </repeat>\r
</action>\r
\r
<bullet label="acseed">\r
 <speed>1</speed>\r
</bullet>\r
\r
</bulletml>\r
`,Mr=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="top">\r
	<actionRef label="shot">\r
		<param>20+$rand*10</param>\r
		<param>40-$rand*80</param>\r
	</actionRef>\r
	<wait>72-$rank*24</wait>\r
</action>\r
\r
\r
<action label="shot">\r
	<fire>\r
		<direction>$2</direction>\r
		<bulletRef label="seed">\r
			<param>$1</param>\r
		</bulletRef>\r
	</fire>\r
	<fire>\r
		<direction>$2</direction>\r
		<bulletRef label="seed">\r
			<param>$1*(-1)</param>\r
		</bulletRef>\r
	</fire>\r
</action>\r
\r
<bullet label="seed">\r
	<speed>1.5</speed>\r
	<action>\r
		<fire>\r
			<direction type="relative">$1</direction>\r
			<bulletRef label="nrm"/>\r
		</fire>\r
		<repeat><times>1+$rank*1.7</times>\r
		<action>\r
			<wait>4</wait>\r
			<fire>\r
				<direction type="sequence">$1</direction>\r
				<bulletRef label="nrm"/>\r
			</fire>\r
		</action>\r
		</repeat>\r
		<vanish/>\r
	</action>\r
</bullet>\r
\r
<bullet label="nrm">\r
	<speed>0.8</speed>\r
</bullet>\r
\r
</bulletml>\r
`,Cr=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="top">\r
 <actionRef label="mnway">\r
  <param>1+$rank*2.9</param>\r
  <param>90/(1+$rank*2.9)</param>\r
 </actionRef>\r
 <wait>36</wait>\r
 <actionRef label="mnway">\r
  <param>1+$rank*2.9</param>\r
  <param>90/(-1-$rank*2.9)</param>\r
 </actionRef>\r
 <wait>36</wait>\r
</action>\r
\r
<action label="mnway">\r
  <fire>\r
   <direction>$2*3</direction>\r
   <bulletRef label="nrm"/>\r
  </fire>\r
  <repeat> <times>$1</times>\r
  <action>\r
   <fire>\r
    <direction type="sequence">$2</direction>\r
    <bulletRef label="nrm"/>\r
   </fire>\r
  </action>\r
  </repeat>\r
</action>\r
\r
<bullet label="nrm">\r
 <speed>1</speed>\r
</bullet>\r
\r
</bulletml>\r
`,Pr=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="top">\r
  <fire>\r
   <direction>0</direction>\r
   <bulletRef label="nrm"/>\r
  </fire>\r
  <repeat> <times>1+$rank*5.2</times>\r
  <action>\r
   <fire>\r
    <direction type="sequence">25</direction>\r
    <bulletRef label="nrm"/>\r
   </fire>\r
  </action>\r
  </repeat>\r
  <fire>\r
   <direction>-25</direction>\r
   <bulletRef label="nrm"/>\r
  </fire>\r
  <repeat> <times>1+$rank*5.2-1</times>\r
  <action>\r
   <fire>\r
    <direction type="sequence">-25</direction>\r
    <bulletRef label="nrm"/>\r
   </fire>\r
  </action>\r
  </repeat>\r
  <wait>50</wait>\r
</action>\r
\r
<bullet label="nrm">\r
 <speed>1</speed>\r
</bullet>\r
\r
</bulletml>\r
`,Ir=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="top">\r
 <fire>\r
  <direction>-45+$rand*90</direction>\r
  <speed>0.4+$rand*0.8</speed>\r
  <bullet/>\r
 </fire>\r
 <wait>200/(10+$rank*20)</wait>\r
</action>\r
\r
</bulletml>\r
`,kr=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="topshot">\r
 <fire>\r
  <direction type="absolute">120</direction>\r
  <bulletRef label="seed"/>\r
 </fire>\r
 <wait>50</wait>\r
 <fire>\r
  <direction type="absolute">240</direction>\r
  <bulletRef label="seed"/>\r
 </fire>\r
 <wait>50</wait>\r
</action>\r
\r
<bullet label="seed">\r
 <speed>1</speed>\r
 <action>\r
  <changeSpeed>\r
   <speed>0.2</speed>\r
   <term>40</term>\r
  </changeSpeed>\r
  <wait>20</wait>\r
  <repeat> <times>2+$rank*8.2</times>\r
  <action>\r
   <fire>\r
    <bullet>\r
     <direction type="absolute">$rand*360</direction>\r
     <speed>0.7+$rand*0.5</speed>\r
    </bullet>\r
   </fire>\r
  </action>\r
  </repeat>\r
  <vanish/>\r
 </action>\r
</bullet>\r
\r
</bulletml>\r
`,Nr=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="top">\r
 <fire>\r
  <direction>$rand*150-75</direction>\r
  <bulletRef label="arc"/>\r
 </fire>\r
 <wait>32</wait>\r
</action>\r
\r
<bullet label="arc">\r
 <action>\r
  <fire>\r
   <direction type="relative">-5-$rank*8</direction>\r
   <bulletRef label="nml"/>\r
  </fire>\r
  <repeat> <times>2+$rank*4.5</times>\r
  <action>\r
   <fire>\r
    <direction type="sequence">2.5</direction>\r
    <bulletRef label="nml"/>\r
   </fire>\r
  </action>\r
  </repeat>\r
 <vanish/>\r
 </action>\r
</bullet>\r
\r
<bullet label="nml">\r
 <speed>1</speed>\r
</bullet>\r
\r
</bulletml>\r
`,Dr=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="topmove">\r
<changeSpeed>\r
 <speed>0.3</speed>\r
 <term>1</term>\r
</changeSpeed>\r
</action>\r
\r
</bulletml>\r
`,Br=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="topmove">\r
<changeSpeed>\r
 <speed>0.2</speed>\r
 <term>1</term>\r
</changeSpeed>\r
</action>\r
\r
</bulletml>\r
`,Or=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="top">\r
  <fire>\r
   <bulletRef label="nrm"/>\r
  </fire>\r
   <repeat> <times>5</times>\r
   <action>\r
    <fire>\r
     <direction type="sequence">59</direction>\r
     <bulletRef label="nrm"/>\r
    </fire>\r
   </action>\r
   </repeat>\r
  <repeat> <times>$rank*4.4</times>\r
  <action>\r
   <wait>10+$rank*10</wait>\r
   <repeat> <times>6</times>\r
   <action>\r
    <fire>\r
     <direction type="sequence">59</direction>\r
     <bulletRef label="nrm"/>\r
    </fire>\r
   </action>\r
   </repeat>\r
  </action>\r
  </repeat>\r
  <wait>40</wait>\r
</action>\r
\r
<bullet label="nrm">\r
 <speed>1.2</speed>\r
</bullet>\r
\r
</bulletml>\r
`,_r=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="top">\r
 <repeat> <times>99</times>\r
 <action>\r
  <fire>\r
   <direction type="sequence">-32</direction>\r
   <bulletRef label="nrm"/>\r
  </fire>\r
  <repeat> <times>3</times>\r
  <action>\r
   <fire>\r
    <direction type="sequence">20</direction>\r
    <bulletRef label="nrm"/>\r
   </fire>\r
  </action>\r
  </repeat>\r
  <wait>50-$rank*25</wait>\r
 </action>\r
 </repeat>\r
</action>\r
\r
<bullet label="nrm">\r
 <speed>1</speed>\r
</bullet>\r
\r
</bulletml>\r
`,Fr=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="top1">\r
	<actionRef label="seed">\r
		<param>1</param>\r
	</actionRef>\r
</action>\r
\r
<action label="top2">\r
	<actionRef label="seed">\r
		<param>-1</param>\r
	</actionRef>\r
</action>\r
\r
<action label="seed">\r
	<fire>\r
		<direction type="absolute">0</direction>\r
		<bulletRef label="aim90"/>\r
	</fire>\r
	<fire>\r
		<direction type="absolute">180</direction>\r
		<bulletRef label="aim90"/>\r
	</fire>\r
	<repeat><times>99</times>\r
	<action>\r
		<wait>32-16*$rank</wait>\r
		<fire>\r
			<direction type="sequence">(15-$rank*8)*$1</direction>\r
			<bulletRef label="aim90"/>\r
		</fire>\r
		<fire>\r
			<direction type="sequence">180</direction>\r
			<bulletRef label="aim90"/>\r
		</fire>\r
	</action>\r
	</repeat>\r
</action>\r
\r
<bullet label="aim90">\r
	<speed>1.2</speed>\r
</bullet>\r
\r
</bulletml>\r
`,Yr=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="top">\r
 <fire>\r
  <bulletRef label="round">\r
   <param>1.1</param>\r
   <param>0</param>\r
  </bulletRef>\r
 </fire>\r
<!--\r
 <fire>\r
  <bulletRef label="round">\r
   <param>0.9</param>\r
   <param>7</param>\r
  </bulletRef>\r
 </fire>\r
-->\r
 <fire>\r
  <bulletRef label="round">\r
   <param>0.7</param>\r
   <param>14</param>\r
  </bulletRef>\r
 </fire>\r
 <wait>52</wait>\r
</action>\r
 \r
<bullet label="round">\r
<speed>0</speed>\r
<action>\r
 <fire>\r
  <direction type="absolute">$2</direction>\r
  <speed>$1</speed>\r
  <bullet/>\r
 </fire>\r
 <repeat> <times>2+$rank*3.2</times>\r
 <action>\r
  <wait>16</wait>\r
  <fire>\r
   <direction type="sequence">360/(2+$rank*3.2)</direction>\r
   <speed>$1</speed>\r
   <bullet/>\r
  </fire>\r
 </action>\r
 </repeat>\r
 <vanish/>\r
</action>\r
</bullet>\r
\r
</bulletml>\r
`,Gr=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="top">\r
	<actionRef label="spr">\r
		<param>1</param>\r
	</actionRef>\r
	<wait>45</wait>\r
	<actionRef label="spr">\r
		<param>-1</param>\r
	</actionRef>\r
	<wait>45</wait>\r
</action>\r
\r
<action label="spr">\r
	<fire>\r
		<direction>(-10)*$1</direction>\r
		<speed>1.0</speed>\r
		<bullet/>\r
	</fire>\r
	<repeat><times>2+$rank*5.2</times>\r
	<action>\r
		<fire>\r
			<direction type="sequence">(36-$rank*12)*$1</direction>	\r
			<speed type="sequence">-0.06</speed>\r
			<bullet/>\r
		</fire>\r
	</action>\r
	</repeat>\r
</action>\r
\r
</bulletml>\r
`,Ur=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="top">\r
 <repeat> <times>99</times>\r
 <action>\r
  <fire>\r
   <direction type="sequence">112</direction>\r
   <bulletRef label="seed"/>\r
  </fire>\r
  <wait>42</wait>\r
 </action>\r
 </repeat>\r
</action>\r
\r
<bullet label="seed">\r
<action>\r
 <fire>\r
  <direction type="relative">0</direction>\r
  <bulletRef label="nrm"/>\r
 </fire>\r
 <repeat> <times>1+$rank*4.2</times>\r
 <action>\r
  <fire>\r
   <direction type="sequence">5</direction>\r
   <bulletRef label="nrm"/>\r
  </fire>\r
 </action>\r
 </repeat>\r
 <vanish/>\r
</action>\r
</bullet>\r
\r
<bullet label="nrm">\r
 <speed>0.8</speed>\r
</bullet>\r
\r
</bulletml>\r
`,Vr=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="top">\r
 <repeat> <times>99</times>\r
 <action>\r
  <fire>\r
   <direction type="sequence">180-10</direction>\r
   <bullet/>\r
  </fire>\r
  <fire>\r
   <direction type="sequence">180</direction>\r
   <bullet/>\r
  </fire>\r
  <wait>24-$rank*13</wait>\r
 </action>\r
 </repeat>\r
</action>\r
\r
</bulletml>\r
`,$r=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="top">\r
<fire>\r
 <direction type="relative">0</direction>\r
 <bulletRef label="round"/>\r
</fire>\r
<repeat> <times>3</times>\r
<action>\r
 <fire>\r
  <direction type="sequence">90</direction>\r
 <bulletRef label="round"/>\r
 </fire>\r
</action>\r
</repeat> \r
<repeat> <times>99</times>\r
<action>\r
 <wait>42-$rank*21</wait>\r
 <fire>\r
  <direction type="sequence">90+(2+20*$rank)</direction>\r
  <bulletRef label="round"/>\r
 </fire>\r
 <repeat> <times>3</times>\r
 <action>\r
  <fire>\r
   <direction type="sequence">90</direction>\r
  <bulletRef label="round"/>\r
  </fire>\r
 </action>\r
 </repeat> \r
</action>\r
</repeat>\r
</action>\r
\r
<bullet label="round">\r
 <speed>1</speed>\r
</bullet>\r
\r
</bulletml>\r
`,Hr=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="top">\r
	<fire>\r
		<direction>180</direction>\r
		<bulletRef label="seed"/>\r
	</fire>\r
	<wait>90</wait>\r
</action>\r
\r
<bullet label="seed">\r
	<speed>0.5</speed>\r
	<action>\r
		<fire>\r
			<direction>-50</direction>\r
			<speed>1</speed>\r
			<bullet/>\r
		</fire>\r
		<repeat>\r
		<times>2+$rank*4.7</times>\r
		<action>\r
			<wait>5-$rank*2</wait>\r
			<fire>\r
				<direction type="sequence">25-$rank*3</direction>\r
				<speed>1</speed>\r
				<bullet/>\r
			</fire>\r
		</action>\r
		</repeat>\r
	</action>\r
</bullet>\r
\r
</bulletml>\r
`,zr=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="top">\r
 <actionRef label="spread">\r
  <param>4+$rank*9.5</param>\r
  <param>120/(4+$rank*10.2)</param>\r
  <param>120/(-4-$rank*10.2)</param>\r
 </actionRef>\r
</action>\r
\r
<action label="spread">\r
 <fire>\r
  <direction type="absolute">120</direction>\r
  <bulletRef label="nrm"/>\r
 </fire>\r
 <repeat> <times>99</times>\r
 <action>\r
  <repeat> <times>$1</times>\r
  <action>\r
   <wait>20-$rank*9.5</wait>\r
   <fire>\r
    <direction type="sequence">$2</direction>\r
    <bulletRef label="nrm"/>\r
   </fire>\r
  </action>\r
  </repeat>\r
  <repeat> <times>$1</times>\r
  <action>\r
   <wait>20-$rank*9.5</wait>\r
   <fire>\r
    <direction type="sequence">$3</direction>\r
    <bulletRef label="nrm"/>\r
   </fire>\r
  </action>\r
  </repeat>\r
 </action>\r
 </repeat> \r
</action>\r
\r
<bullet label="nrm">\r
 <speed>1</speed>\r
</bullet>\r
\r
</bulletml>\r
`,Xr=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="topmove">\r
<changeSpeed>\r
 <speed>0.3</speed>\r
 <term>1</term>\r
</changeSpeed>\r
</action>\r
\r
</bulletml>\r
`,jr=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="topmove">\r
<changeSpeed>\r
 <speed>0.4+$rand*0.3</speed>\r
 <term>1</term>\r
</changeSpeed>\r
<wait>50+$rand*30</wait>\r
<changeSpeed>\r
 <speed>0</speed>\r
 <term>60</term>\r
</changeSpeed>\r
<wait>120+$rand*30</wait>\r
<changeSpeed>\r
 <speed>-0.3</speed>\r
 <term>60</term>\r
</changeSpeed>\r
</action>\r
\r
</bulletml>\r
`,Wr=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="topmove">\r
	<changeDirection>\r
		<direction type="aim">50-$rand*100</direction>\r
		<term>20</term>\r
	</changeDirection>\r
	<changeSpeed>\r
		<speed>0.3</speed>\r
		<term>1</term>\r
	</changeSpeed>\r
</action>\r
\r
</bulletml>\r
`,qr=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="topmove">\r
<changeSpeed>\r
 <speed>0.3</speed>\r
 <term>1</term>\r
</changeSpeed>\r
</action>\r
\r
</bulletml>\r
`,Zr=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="topmove">\r
<changeSpeed>\r
 <speed>0.4</speed>\r
 <term>1</term>\r
</changeSpeed>\r
</action>\r
\r
</bulletml>\r
`,Kr=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="topmove">\r
<changeSpeed>\r
 <speed>0.2</speed>\r
 <term>1</term>\r
</changeSpeed>\r
</action>\r
\r
</bulletml>\r
`,Jr=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="top">\r
  <repeat> <times>1+$rank*3.4</times>\r
  <action>\r
    <fire>\r
     <speed>1</speed>\r
     <bullet/>\r
   </fire>\r
   <wait>20</wait>\r
  </action>\r
  </repeat>\r
  <wait>999</wait>\r
</action>\r
\r
</bulletml>\r
`,Qr=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="top">\r
  <repeat> <times>1+$rank*4.4</times>\r
  <action>\r
    <fire>\r
     <speed>1</speed>\r
     <bullet/>\r
   </fire>\r
   <wait>24-$rank*8</wait>\r
  </action>\r
  </repeat>\r
  <wait>999</wait>\r
</action>\r
\r
</bulletml>\r
`,ti=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="topshot">\r
  <fire>\r
   <direction type="relative">30</direction>\r
   <speed type="relative">0</speed>\r
   <bullet/>\r
  </fire>\r
  <repeat> <times>$rank*2.2</times>\r
  <action>\r
   <fire>\r
    <direction type="sequence">60</direction>\r
	<speed type="sequence">-0.1</speed>\r
    <bullet/>\r
   </fire>\r
  </action>\r
  </repeat>\r
  <fire>\r
   <direction type="relative">-30</direction>\r
   <speed type="relative">0</speed>\r
   <bullet/>\r
  </fire>\r
  <repeat> <times>$rank*2.2</times>\r
  <action>\r
   <fire>\r
    <direction type="sequence">-60</direction>\r
	<speed type="sequence">-0.1</speed>\r
    <bullet/>\r
   </fire>\r
  </action>\r
  </repeat>\r
  <vanish/>\r
</action>\r
\r
</bulletml>\r
`,ei=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="topshot">\r
  <fire>\r
   <direction type="relative">-36</direction>\r
   <speed type="relative">$rank*0.3</speed>\r
   <bullet/>\r
  </fire>\r
  <fire>\r
   <direction type="relative">36</direction>\r
   <speed type="relative">$rank*0.3</speed>\r
   <bullet/>\r
  </fire>\r
</action>\r
\r
</bulletml>\r
`,ri=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
 <action label="top">\r
  <wait>1</wait>\r
  <fire>\r
   <bullet>\r
   	<direction type="relative">0</direction>\r
	<speed type="relative">$rank</speed>\r
    <actionRef label="ofs">\r
     <param>120</param>\r
     <param>0.1</param>\r
    </actionRef>\r
   </bullet>\r
  </fire>\r
  <fire>\r
   <bullet>\r
   	<direction type="relative">0</direction>\r
	<speed type="relative">$rank</speed>\r
    <actionRef label="ofs">\r
     <param>0</param>\r
     <param>-0.2</param>\r
    </actionRef>\r
   </bullet>\r
  </fire>\r
  <fire>\r
   <bullet>\r
   	<direction type="relative">0</direction>\r
	<speed type="relative">$rank</speed>\r
    <actionRef label="ofs">\r
     <param>-120</param>\r
     <param>0.1</param>\r
    </actionRef>\r
   </bullet>\r
  </fire>\r
  <vanish/>\r
 </action>\r
\r
<action label="ofs">\r
<!--\r
  <changeSpeed>\r
   <speed>1+$rank</speed>\r
   <term>1</term>\r
  </changeSpeed>\r
-->\r
  <changeDirection>\r
   <direction type="relative">$1</direction>\r
   <term>1</term>\r
  </changeDirection>\r
  <wait>2</wait>\r
  <changeDirection>\r
   <direction type="relative">0-$1</direction>\r
   <term>1</term>\r
  </changeDirection>\r
  <wait>1</wait>\r
  <fire>\r
  	<direction type="relative">0</direction>\r
	<speed type="relative">$2-$rank</speed>\r
	<bullet/>\r
  </fire>\r
  <vanish/>\r
</action>\r
\r
</bulletml>\r
`,ii=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="topshot">\r
  <fire>\r
   <direction type="relative">0</direction>\r
   <speed type="relative">0</speed>\r
   <bullet/>\r
  </fire>\r
  <repeat> <times>$rank*2.8+1</times>\r
  <action>\r
   <fire>\r
    <direction type="relative">0</direction>\r
    <speed type="sequence">0.12</speed>\r
    <bullet/>\r
   </fire>\r
   <wait>4</wait>\r
  </action>\r
  </repeat>\r
  <vanish/>\r
</action>\r
\r
</bulletml>\r
`,si=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="top">\r
	<fire>\r
		<direction type="relative">0</direction>\r
		<speed type="relative">0</speed>\r
		<bullet/>\r
	</fire>\r
	<repeat><times>1+$rank*1.7</times>\r
	<action>\r
		<fire>\r
			<direction type="relative">0</direction>\r
			<speed type="sequence">0.1+$rank*0.05</speed>\r
			<bullet/>\r
		</fire>\r
	</action>\r
	</repeat>\r
	<vanish/>\r
</action>\r
\r
</bulletml>\r
`,ni=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="top">\r
	<fire>\r
		<direction type="relative">8+$rank*12</direction>\r
		<speed type="relative">0</speed>\r
		<bullet/>\r
	</fire>\r
	<fire>\r
		<direction type="relative">-8-$rank*12</direction>\r
		<speed type="relative">0</speed>\r
		<bullet/>\r
	</fire>\r
	<vanish/>\r
</action>\r
\r
</bulletml>\r
`,ai=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="top">\r
	<wait>4</wait>\r
	<fire>\r
		<direction type="relative">($rank*10+5)*$rand</direction>\r
		<speed type="relative">-0.4</speed>\r
		<bullet/>\r
	</fire>\r
</action>\r
\r
</bulletml>\r
`,li=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="top">\r
	<fire>\r
		<direction type="relative">0</direction>\r
		<speed type="relative">-0.9</speed>\r
		<bulletRef label="accel"/>\r
	</fire>\r
	<repeat><times>$rank*2.7</times>\r
	<action>\r
		<wait>2</wait>\r
		<fire>\r
			<direction type="relative">0</direction>\r
			<speed type="sequence">0.3</speed>\r
			<bulletRef label="accel"/>\r
		</fire>\r
	</action>\r
	</repeat>\r
	<vanish/>\r
</action>\r
\r
<bullet label="accel">\r
	<action>\r
		<wait>8</wait>\r
		<changeSpeed>\r
			<speed>1</speed>\r
			<term>60</term>\r
		</changeSpeed>\r
	</action>\r
</bullet>\r
\r
</bulletml>\r
`,oi=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="topshot">\r
  <fire>\r
   <direction type="relative">0</direction>\r
   <speed type="relative">0</speed>\r
   <bullet/>\r
  </fire>\r
  <repeat> <times>$rank*3.2</times>\r
  <action>\r
   <fire>\r
    <direction type="sequence">60</direction>\r
    <speed type="sequence">-0.1</speed>\r
    <bullet/>\r
   </fire>\r
  </action>\r
  </repeat>\r
  <fire>\r
   <direction type="relative">-60</direction>\r
   <speed type="relative">-0.1</speed>\r
   <bullet/>\r
  </fire>\r
  <repeat> <times>$rank*3.2-1</times>\r
  <action>\r
   <fire>\r
    <direction type="sequence">-60</direction>\r
    <speed type="sequence">-0.1</speed>\r
    <bullet/>\r
   </fire>\r
  </action>\r
  </repeat>\r
  <vanish/>\r
</action>\r
\r
</bulletml>\r
`,hi=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="top">\r
	<wait>10+$rank*5</wait>\r
	<fire>\r
		<direction type="relative">135</direction>\r
		<speed type="relative">0</speed>\r
		<bullet/>\r
	</fire>\r
	<fire>\r
		<direction type="relative">-135</direction>\r
		<speed type="relative">0</speed>\r
		<bullet/>\r
	</fire>\r
</action>\r
\r
</bulletml>\r
`,ci=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="topshot">\r
  <fire>\r
   <direction type="relative">0</direction>\r
   <speed type="relative">0</speed>\r
   <bullet/>\r
  </fire>\r
  <actionRef label="spr">\r
   <param>3.3</param>\r
  </actionRef>\r
  <vanish/>\r
</action>\r
\r
<action label="spr">\r
 <repeat> <times>1+$rank*1.7</times>\r
 <action>\r
  <fire>\r
   <direction type="sequence">$1</direction>\r
   <speed type="sequence">-0.08</speed>\r
   <bullet/>\r
  </fire>\r
 </action>\r
 </repeat>\r
</action>\r
\r
</bulletml>\r
`,di=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="top">\r
	<changeSpeed>\r
		<speed type="relative">-0.7</speed>\r
		<term>6+$rank*4</term>\r
	</changeSpeed>\r
	<wait>6+$rank*4</wait>\r
	<changeSpeed>\r
		<speed type="relative">0.7+$rank*0.3</speed>\r
		<term>7</term>\r
	</changeSpeed>\r
	<wait>7</wait>\r
    <fire>\r
		<direction type="relative">0</direction>\r
		<speed type="relative">0</speed>\r
		<bullet/>\r
	</fire>\r
	<vanish/>\r
</action>\r
\r
</bulletml>\r
`,ui=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="topshot">\r
 <fire>\r
  <direction type="relative">0</direction>\r
  <speed type="relative">-0.2</speed>\r
  <bullet/>\r
 </fire>\r
 <repeat> <times>1+$rank*1.6</times>\r
 <action>\r
  <fire>\r
   <direction type="sequence">76-$rank*26</direction>\r
   <speed type="sequence">0.2</speed>\r
   <bullet/>\r
  </fire>\r
 </action>\r
 </repeat>\r
 <fire>\r
  <direction type="relative">-76+$rank*26</direction>\r
  <speed type="relative">0</speed>\r
  <bullet/>\r
 </fire>\r
 <repeat> <times>$rank*1.6</times>\r
 <action>\r
  <fire>\r
   <direction type="sequence">-76+$rank*26</direction>\r
   <speed type="sequence">0.2</speed>\r
   <bullet/>\r
  </fire>\r
 </action>\r
 </repeat>\r
 <vanish/>\r
</action>\r
\r
</bulletml>\r
`,pi=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
\r
 <action label="top">\r
  <wait>1</wait>\r
  <fire>\r
   <bullet>\r
   	<direction type="relative">0</direction>\r
	<speed type="relative">$rank</speed>\r
    <actionRef label="ofs">\r
     <param>90</param>\r
    </actionRef>\r
   </bullet>\r
  </fire>\r
  <fire>\r
   <bullet>\r
   	<direction type="relative">0</direction>\r
	<speed type="relative">$rank</speed>\r
    <actionRef label="ofs">\r
     <param>-90</param>\r
    </actionRef>\r
   </bullet>\r
  </fire>\r
  <vanish/>\r
 </action>\r
\r
<action label="ofs">\r
<!--\r
  <changeSpeed>\r
   <speed>1+$rank</speed>\r
   <term>1</term>\r
  </changeSpeed>\r
-->\r
  <changeDirection>\r
   <direction type="relative">$1</direction>\r
   <term>1</term>\r
  </changeDirection>\r
  <wait>2</wait>\r
  <changeDirection>\r
   <direction type="relative">0-$1</direction>\r
   <term>1</term>\r
  </changeDirection>\r
  <wait>1</wait>\r
  <fire>\r
  	<direction type="relative">0</direction>\r
	<speed type="relative">-$rank</speed>\r
	<bullet/>\r
  </fire>\r
  <vanish/>\r
</action>\r
\r
</bulletml>\r
`,mi=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="top">\r
	<fire>\r
		<direction type="relative">0</direction>\r
		<speed type="relative">0</speed>\r
		<bullet/>\r
	</fire>\r
	<fire>\r
		<direction type="relative">1+$rank</direction>\r
		<speed type="relative">0</speed>\r
		<bullet/>\r
	</fire>\r
	<fire>\r
		<direction type="relative">-1-$rank</direction>\r
		<speed type="relative">0</speed>\r
		<bullet/>\r
	</fire>\r
	<vanish/>\r
</action>\r
\r
</bulletml>\r
`,fi=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="topshot">\r
  <fire>\r
   <direction type="relative">0</direction>\r
   <speed type="relative">0</speed>\r
   <bullet/>\r
  </fire>\r
  <repeat> <times>1+$rank*1.7</times>\r
  <action>\r
   <fire>\r
    <direction type="sequence">90</direction>\r
	<speed type="sequence">-0.1</speed>\r
    <bullet/>\r
   </fire>\r
  </action>\r
  </repeat>\r
  <vanish/>\r
</action>\r
\r
</bulletml>\r
`,bi=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="topshot">\r
  <fire>\r
   <direction type="relative">-90+$rank*20</direction>\r
   <speed type="relative">$rank*0.3</speed>\r
   <bullet/>\r
  </fire>\r
  <fire>\r
   <direction type="relative">90-$rank*20</direction>\r
   <speed type="relative">$rank*0.3</speed>\r
   <bullet/>\r
  </fire>\r
</action>\r
\r
</bulletml>\r
`,gi=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
 <action label="top">\r
  <wait>1</wait>\r
  <fire>\r
   <bullet>\r
   	<direction type="relative">0</direction>\r
	<speed type="relative">$rank</speed>\r
    <actionRef label="ofs">\r
     <param>120</param>\r
     <param>0.08</param>\r
    </actionRef>\r
   </bullet>\r
  </fire>\r
  <fire>\r
   <bullet>\r
   	<direction type="relative">0</direction>\r
	<speed type="relative">$rank</speed>\r
    <actionRef label="ofs">\r
     <param>0</param>\r
     <param>-0.08</param>\r
    </actionRef>\r
   </bullet>\r
  </fire>\r
  <fire>\r
   <bullet>\r
   	<direction type="relative">0</direction>\r
	<speed type="relative">$rank</speed>\r
    <actionRef label="ofs">\r
     <param>-120</param>\r
     <param>0.08</param>\r
    </actionRef>\r
   </bullet>\r
  </fire>\r
  <vanish/>\r
 </action>\r
\r
<action label="ofs">\r
<!--\r
  <changeSpeed>\r
   <speed>1+$rank</speed>\r
   <term>1</term>\r
  </changeSpeed>\r
-->\r
  <changeDirection>\r
   <direction type="relative">$1</direction>\r
   <term>1</term>\r
  </changeDirection>\r
  <wait>1</wait>\r
  <changeDirection>\r
   <direction type="relative">0-$1</direction>\r
   <term>1</term>\r
  </changeDirection>\r
  <wait>1</wait>\r
  <fire>\r
  	<direction type="relative">0</direction>\r
	<speed type="relative">$2-$rank</speed>\r
	<bullet/>\r
  </fire>\r
  <vanish/>\r
</action>\r
\r
</bulletml>\r
`,wi=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="topshot">\r
  <fire>\r
   <direction type="relative">0</direction>\r
   <speed type="relative">0</speed>\r
   <bullet/>\r
  </fire>\r
  <repeat> <times>$rank*1.8+1</times>\r
  <action>\r
   <fire>\r
    <direction type="relative">0</direction>\r
    <speed type="sequence">0.11</speed>\r
    <bullet/>\r
   </fire>\r
   <wait>4</wait>\r
  </action>\r
  </repeat>\r
  <vanish/>\r
</action>\r
\r
</bulletml>\r
`,yi=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="top">\r
	<fire>\r
		<direction type="relative">0</direction>\r
		<speed type="relative">0</speed>\r
		<bullet/>\r
	</fire>\r
	<repeat><times>$rank*1.7</times>\r
	<action>\r
		<fire>\r
			<direction type="relative">0</direction>\r
			<speed type="sequence">0.08+$rank*0.05</speed>\r
			<bullet/>\r
		</fire>\r
	</action>\r
	</repeat>\r
	<vanish/>\r
</action>\r
\r
</bulletml>\r
`,Ei=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="top">\r
	<fire>\r
		<direction type="relative">64-$rank*10</direction>\r
		<speed type="relative">-0.1</speed>\r
		<bullet/>\r
	</fire>\r
	<fire>\r
		<direction type="relative">-64+$rank*10</direction>\r
		<speed type="relative">-0.1</speed>\r
		<bullet/>\r
	</fire>\r
<!--\r
	<vanish/>\r
-->\r
</action>\r
\r
</bulletml>\r
`,xi=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="top">\r
	<wait>4</wait>\r
	<fire>\r
		<direction type="relative">($rank*4+2)*$rand</direction>\r
		<speed type="relative">-0.3</speed>\r
		<bullet/>\r
	</fire>\r
</action>\r
\r
</bulletml>\r
`,Si=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="top">\r
	<fire>\r
		<direction type="relative">0</direction>\r
		<speed type="relative">-0.9</speed>\r
		<bulletRef label="accel"/>\r
	</fire>\r
	<repeat><times>$rank*1.7</times>\r
	<action>\r
		<wait>2</wait>\r
		<fire>\r
			<direction type="relative">0</direction>\r
			<speed type="sequence">0.3</speed>\r
			<bulletRef label="accel"/>\r
		</fire>\r
	</action>\r
	</repeat>\r
	<vanish/>\r
</action>\r
\r
<bullet label="accel">\r
	<action>\r
		<wait>8</wait>\r
		<changeSpeed>\r
			<speed>1</speed>\r
			<term>60</term>\r
		</changeSpeed>\r
	</action>\r
</bullet>\r
\r
</bulletml>\r
`,Ti=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="topshot">\r
  <fire>\r
   <direction type="relative">0</direction>\r
   <speed type="relative">0</speed>\r
   <bullet/>\r
  </fire>\r
  <repeat> <times>$rank*3.2</times>\r
  <action>\r
   <fire>\r
    <direction type="sequence">60</direction>\r
    <speed type="sequence">-0.1</speed>\r
    <bullet/>\r
   </fire>\r
  </action>\r
  </repeat>\r
  <fire>\r
   <direction type="relative">-60</direction>\r
   <speed type="relative">-0.1</speed>\r
   <bullet/>\r
  </fire>\r
  <repeat> <times>$rank*3.2-1</times>\r
  <action>\r
   <fire>\r
    <direction type="sequence">-60</direction>\r
    <speed type="sequence">-0.1</speed>\r
    <bullet/>\r
   </fire>\r
  </action>\r
  </repeat>\r
  <vanish/>\r
</action>\r
\r
</bulletml>\r
`,vi=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="top">\r
	<wait>10+$rank*5</wait>\r
	<fire>\r
		<direction type="relative">135</direction>\r
		<speed type="relative">0</speed>\r
		<bullet/>\r
	</fire>\r
	<fire>\r
		<direction type="relative">-135</direction>\r
		<speed type="relative">0</speed>\r
		<bullet/>\r
	</fire>\r
</action>\r
\r
</bulletml>\r
`,Ri=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="topshot">\r
  <fire>\r
   <direction type="relative">0</direction>\r
   <speed type="relative">0</speed>\r
   <bullet/>\r
  </fire>\r
  <actionRef label="spr">\r
   <param>1</param>\r
  </actionRef>\r
  <vanish/>\r
</action>\r
\r
<action label="spr">\r
 <repeat> <times>1+$rank*1.7</times>\r
 <action>\r
  <fire>\r
   <direction type="sequence">$1</direction>\r
   <speed type="sequence">-0.08</speed>\r
   <bullet/>\r
  </fire>\r
 </action>\r
 </repeat>\r
</action>\r
\r
</bulletml>\r
`,Li=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="top">\r
	<changeSpeed>\r
		<speed type="relative">-0.7</speed>\r
		<term>7+$rank*5</term>\r
	</changeSpeed>\r
	<wait>7+$rank*5</wait>\r
	<changeSpeed>\r
		<speed type="relative">0.7+$rank*0.3</speed>\r
		<term>8</term>\r
	</changeSpeed>\r
	<wait>8</wait>\r
    <fire>\r
		<direction type="relative">0</direction>\r
		<speed type="relative">0</speed>\r
		<bullet/>\r
	</fire>\r
	<vanish/>\r
</action>\r
\r
</bulletml>\r
`,Ai=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="topshot">\r
 <fire>\r
  <direction type="relative">0</direction>\r
  <speed type="relative">-0.2</speed>\r
  <bullet/>\r
 </fire>\r
 <repeat> <times>1+$rank*1.6</times>\r
 <action>\r
  <fire>\r
   <direction type="sequence">90-$rank*26</direction>\r
   <speed type="sequence">0.2</speed>\r
   <bullet/>\r
  </fire>\r
 </action>\r
 </repeat>\r
 <fire>\r
  <direction type="relative">-90+$rank*26</direction>\r
  <speed type="relative">0</speed>\r
  <bullet/>\r
 </fire>\r
 <repeat> <times>$rank*1.6</times>\r
 <action>\r
  <fire>\r
   <direction type="sequence">-90+$rank*26</direction>\r
   <speed type="sequence">0.2</speed>\r
   <bullet/>\r
  </fire>\r
 </action>\r
 </repeat>\r
 <vanish/>\r
</action>\r
\r
</bulletml>\r
`,Mi=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
\r
 <action label="top">\r
  <wait>1</wait>\r
  <fire>\r
   <bullet>\r
   	<direction type="relative">0</direction>\r
	<speed type="relative">$rank</speed>\r
    <actionRef label="ofs">\r
     <param>90</param>\r
    </actionRef>\r
   </bullet>\r
  </fire>\r
  <fire>\r
   <bullet>\r
   	<direction type="relative">0</direction>\r
	<speed type="relative">$rank</speed>\r
    <actionRef label="ofs">\r
     <param>-90</param>\r
    </actionRef>\r
   </bullet>\r
  </fire>\r
  <vanish/>\r
 </action>\r
\r
<action label="ofs">\r
<!--\r
  <changeSpeed>\r
   <speed>1+$rank</speed>\r
   <term>1</term>\r
  </changeSpeed>\r
-->\r
  <changeDirection>\r
   <direction type="relative">$1</direction>\r
   <term>1</term>\r
  </changeDirection>\r
  <wait>1</wait>\r
  <changeDirection>\r
   <direction type="relative">0-$1</direction>\r
   <term>1</term>\r
  </changeDirection>\r
  <wait>1</wait>\r
  <fire>\r
  	<direction type="relative">0</direction>\r
	<speed type="relative">-$rank</speed>\r
	<bullet/>\r
  </fire>\r
  <vanish/>\r
</action>\r
\r
</bulletml>\r
`,Ci=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="top">\r
	<fire>\r
		<direction type="relative">0</direction>\r
		<speed type="relative">0</speed>\r
		<bullet/>\r
	</fire>\r
	<fire>\r
		<direction type="relative">1+$rank*0.6</direction>\r
		<speed type="relative">0</speed>\r
		<bullet/>\r
	</fire>\r
	<fire>\r
		<direction type="relative">-1-$rank*0.6</direction>\r
		<speed type="relative">0</speed>\r
		<bullet/>\r
	</fire>\r
	<vanish/>\r
</action>\r
\r
</bulletml>\r
`,Pi=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="top">\r
<!--\r
 <wait>30/($rank*30+1)</wait>\r
  <fire>\r
   <speed>1</speed>\r
   <bullet/>\r
 </fire>\r
 <wait>120-$rank*80</wait>\r
-->\r
 <wait>60-$rank*60</wait>\r
  <fire>\r
   <speed>1</speed>\r
   <bullet/>\r
 </fire>\r
 <wait>120-$rank*80</wait>\r
</action>\r
\r
</bulletml>\r
`,Ii=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="top">\r
 <wait>30-$rank*30</wait>\r
  <fire>\r
   <speed>1</speed>\r
   <bullet/>\r
 </fire>\r
 <wait>40-$rank*26</wait>\r
</action>\r
\r
</bulletml>\r
`,ki=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="topmove">\r
 <actionRef label="curve">\r
  <param>$rand*1.0-0.5</param>\r
 </actionRef>\r
</action>\r
\r
<action label="curve">\r
  <accel>\r
   <horizontal>$1</horizontal>\r
   <vertical>2.0</vertical>\r
   <term>20</term>\r
  </accel>\r
  <wait>40</wait>\r
  <accel>\r
   <vertical>-2.0</vertical>\r
   <term>50</term>\r
  </accel>\r
  <wait>10</wait>\r
  <accel>\r
   <horizontal>0-$1*2</horizontal>\r
   <term>60</term>\r
  </accel>\r
</action>\r
\r
</bulletml>\r
`,Ni=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="topmove">\r
 <changeSpeed>\r
  <speed>0.5</speed>\r
  <term>1</term>\r
 </changeSpeed>\r
 <wait>8</wait>\r
 <changeDirection>\r
  <direction>0</direction>\r
  <term>32</term>\r
 </changeDirection>\r
</action>\r
\r
</bulletml>\r
`,Di=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="topmove">\r
 <changeDirection>\r
  <direction type="absolute">$rand*40+160</direction>\r
  <term>1</term>\r
 </changeDirection>\r
 <changeSpeed>\r
  <speed>0.8</speed>\r
  <term>1</term>\r
 </changeSpeed>\r
 <wait>30+$rand*10</wait>\r
 <changeSpeed>\r
  <speed>0</speed>\r
  <term>80</term>\r
 </changeSpeed>\r
 <wait>180</wait>\r
 <changeSpeed>\r
  <speed>-1.5</speed>\r
  <term>90</term>\r
 </changeSpeed>\r
</action>\r
\r
</bulletml>\r
`,Bi=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="topmove">\r
 <changeSpeed>\r
  <speed>0.5</speed>\r
  <term>1</term>\r
 </changeSpeed>\r
 <wait>32</wait>\r
 <changeSpeed>\r
  <speed>0</speed>\r
  <term>32</term>\r
 </changeSpeed>\r
 <wait>32</wait>\r
 <changeDirection>\r
  <direction>0</direction>\r
  <term>48</term>\r
 </changeDirection>\r
 <wait>32</wait>\r
 <changeSpeed>\r
  <speed>0.7</speed>\r
  <term>32</term>\r
 </changeSpeed>\r
</action>\r
\r
</bulletml>\r
`,Oi=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="topmove">\r
 <changeSpeed>\r
  <speed>1.2</speed>\r
  <term>1</term>\r
 </changeSpeed>\r
 <wait>60</wait>\r
 <changeDirection>\r
  <direction type="absolute">80-$rand*160</direction>\r
  <term>30</term>\r
 </changeDirection>\r
</action>\r
\r
</bulletml>\r
`,_i=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="topmove">\r
 <changeSpeed>\r
  <speed>0.5</speed>\r
  <term>1</term>\r
 </changeSpeed>\r
 <wait>8</wait>\r
 <accel>\r
  <horizontal>$rand*0.2-0.1</horizontal>\r
  <term>8</term>\r
 </accel>\r
</action>\r
\r
</bulletml>\r
`,Fi=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="top">\r
<changeDirection>\r
 <direction type="absolute">180</direction>\r
 <term>1</term>\r
</changeDirection>\r
<changeSpeed>\r
<speed>1.5</speed>\r
<term>1</term>\r
</changeSpeed>\r
<wait>30</wait>\r
<repeat>\r
<times>4</times>\r
<action>\r
<changeDirection>\r
<direction type="absolute">$rand*360</direction>\r
<term>10</term>\r
</changeDirection>\r
<changeSpeed>\r
<speed>1</speed>\r
<term>15</term>\r
</changeSpeed>\r
<wait>10+$rand*30</wait>\r
<changeSpeed>\r
<speed>0</speed>\r
<term>10</term>\r
</changeSpeed>\r
<wait>20+$rand*40</wait>\r
</action>\r
</repeat>\r
<changeDirection>\r
 <direction type="absolute">0</direction>\r
 <term>32</term>\r
</changeDirection>\r
<changeSpeed>\r
<speed>1</speed>\r
<term>15</term>\r
</changeSpeed>\r
</action>\r
\r
</bulletml>\r
`,Yi=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
 <action label="top">\r
  <accel>\r
   <horizontal>$rand*1.0-0.5</horizontal>\r
   <vertical>2+$rand</vertical>\r
   <term>1</term>\r
  </accel>\r
  <wait>30</wait>\r
  <accel>\r
   <vertical>-2</vertical>\r
   <term>80</term>\r
  </accel>\r
 </action>\r
\r
</bulletml>\r
`,Gi=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="topmove">\r
	<changeSpeed>\r
		<speed>1</speed>\r
		<term>60</term>\r
	</changeSpeed>	\r
	<changeDirection>\r
		<direction>0</direction>\r
		<term>120</term>\r
	</changeDirection>\r
</action>\r
\r
</bulletml>\r
`,Ui=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="topmove">\r
 <changeSpeed>\r
  <speed>1.5</speed>\r
  <term>1</term>\r
 </changeSpeed>\r
 <wait>1</wait>\r
 <changeSpeed>\r
  <speed>0</speed>\r
  <term>120</term>\r
 </changeSpeed>\r
 <wait>180</wait>\r
 <changeSpeed>\r
  <speed>-0.8</speed>\r
  <term>90</term>\r
 </changeSpeed>\r
</action>\r
\r
</bulletml>\r
`,Vi=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="topmove">\r
 <changeSpeed>\r
  <speed>0.7</speed>\r
  <term>1</term>\r
 </changeSpeed>\r
 <wait>24</wait>\r
 <changeDirection>\r
  <direction>$rand*90-45</direction>\r
  <term>24</term>\r
 </changeDirection>\r
</action>\r
\r
</bulletml>\r
`,$i=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="topmove">\r
 <changeSpeed>\r
  <speed>3</speed>\r
  <term>1</term>\r
 </changeSpeed>\r
 <changeDirection>\r
  <direction type="absolute">165+$rand*30</direction>\r
  <term>1</term>\r
 </changeDirection>\r
 <wait>1</wait>\r
 <changeSpeed>\r
  <speed>0</speed>\r
  <term>50</term>\r
 </changeSpeed>\r
 <wait>100</wait>\r
 <changeSpeed>\r
  <speed>-0.5</speed>\r
  <term>90</term>\r
 </changeSpeed>\r
</action>\r
\r
</bulletml>\r
`,Hi=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="topmove">\r
 <changeSpeed>\r
  <speed>1.2+$rand*0.5</speed>\r
  <term>1</term>\r
 </changeSpeed>\r
 <wait>20</wait>\r
 <changeSpeed>\r
  <speed>-0.3</speed>\r
  <term>48</term>\r
 </changeSpeed>\r
</action>\r
\r
</bulletml>\r
`,zi=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="topmove">\r
 <changeDirection>\r
  <direction type="absolute">120+$rand*120</direction>\r
  <term>1</term>\r
 </changeDirection>\r
 <changeSpeed>\r
  <speed>0.8</speed>\r
  <term>1</term>\r
 </changeSpeed>\r
 <wait>1</wait>\r
</action>\r
\r
</bulletml>\r
`,Xi=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="topmove">\r
<changeDirection>\r
<direction type="absolute">120+$rand*120</direction>\r
<term>90</term>\r
</changeDirection>\r
<changeSpeed>\r
<speed>0.8</speed>\r
<term>1</term>\r
</changeSpeed>\r
<wait>1</wait>\r
</action>\r
\r
</bulletml>\r
`,ji=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="topmove">\r
 <changeSpeed>\r
  <speed>0.5</speed>\r
  <term>1</term>\r
 </changeSpeed>\r
 <wait>8</wait>\r
 <changeDirection>\r
  <direction>0</direction>\r
  <term>32</term>\r
 </changeDirection>\r
</action>\r
\r
</bulletml>\r
`,Wi=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="topmove">\r
 <changeSpeed>\r
  <speed>0.3+$rand*0.4</speed>\r
  <term>1</term>\r
 </changeSpeed>\r
 <wait>30</wait>\r
 <accel>\r
  <vertical>2</vertical>\r
  <term>60</term>\r
 </accel>\r
</action>\r
\r
</bulletml>\r
`,qi=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="topmove">\r
 <changeSpeed>\r
  <speed>0.5</speed>\r
  <term>1</term>\r
 </changeSpeed>\r
</action>\r
\r
</bulletml>\r
`,Zi=`<?xml version="1.0" ?>\r
<!DOCTYPE bulletml SYSTEM "http://www.asahi-net.or.jp/~cs8k-cyu/bulletml/bulletml.dtd">\r
\r
<bulletml type="vertical"\r
          xmlns="http://www.asahi-net.or.jp/~cs8k-cyu/bulletml">\r
\r
<action label="topmove">\r
 <changeSpeed>\r
  <speed>0.6+$rand*1.2</speed>\r
  <term>1</term>\r
 </changeSpeed>\r
 <wait>5</wait>\r
 <changeSpeed>\r
  <speed>0.1</speed>\r
  <term>40</term>\r
 </changeSpeed>\r
 <wait>60</wait>\r
 <accel>\r
  <vertical>-2</vertical>\r
  <term>60</term>\r
 </accel>\r
</action>\r
\r
</bulletml>\r
`,Ki={bullet:0,action:1,fire:2,changeDirection:3,changeSpeed:4,accel:5,wait:6,repeat:7,bulletRef:8,actionRef:9,fireRef:10,vanish:11,horizontal:12,vertical:13,term:14,times:15,direction:16,speed:17,param:18,bulletml:19};function Ji(c){switch(c){case"aim":return 1;case"absolute":return 2;case"relative":return 3;case"sequence":return 4;case null:case"":return 0;default:throw new Error(`BulletML parser: unknown type ${c}.`)}}class Qi{constructor(e){s(this,"name");s(this,"type",0);s(this,"refID",-1);s(this,"parent",null);s(this,"children",[]);s(this,"formula",null);const t=Ki[e];if(t===void 0)throw new Error(`BulletML parser: unknown tag ${e}.`);this.name=t}setParent(e){this.parent=e}getParent(){return this.parent}addChild(e){e.setParent(this),this.children.push(e)}childSize(){return this.children.length}childBegin(){return this.children.length>0?this.children[0]:null}childList(){return this.children}setValue(e){this.formula=ns(e.trim())}getValue(e){return this.formula?this.formula(e):0}getChild(e){for(const t of this.children)if(t.name===e)return t;return null}getAllChildrenVec(e,t){for(const r of this.children)r.name===e&&t.push(r)}next(){const e=this.parent;if(!e)return null;const t=e.children.indexOf(this);return t<0||t+1>=e.children.length?null:e.children[t+1]}}class ts{constructor(e){s(this,"bulletml",null);s(this,"topActions",[]);s(this,"bulletMap",[]);s(this,"actionMap",[]);s(this,"fireMap",[]);s(this,"horizontal",!1);s(this,"name");this.name=e}parse(e){this.bulletml=null,this.topActions.length=0,this.bulletMap.length=0,this.actionMap.length=0,this.fireMap.length=0,this.horizontal=!1;const t={bullet:new Map,action:new Map,fire:new Map,bulletMax:0,actionMax:0,fireMax:0},r=new DOMParser().parseFromString(e,"application/xml"),i=r.querySelector("parsererror");if(i)throw new Error(`${this.name}: ${i.textContent??"xml parse error"}`);const n=r.documentElement;if(!n)throw new Error(`${this.name}: empty xml`);const a=(h,u)=>{const d=new Qi(es(h));if(d.name===19)this.bulletml=d,se(h,"type")==="horizontal"&&(this.horizontal=!0);else if(u)u.addChild(d);else throw new Error("<bulletml> doesn't come.");if(d.name!==19){const g=se(h,"type");d.type=Ji(g)}const m=se(h,"label");if(m){const g=rs(d.name),L=is(t,g,m);if(d.name===0)this.bulletMap[L]=d;else if(d.name===1)this.actionMap[L]=d;else if(d.name===2)this.fireMap[L]=d;else if(d.name===8||d.name===9||d.name===10)d.refID=L;else throw new Error(`he can't have attribute "label".`);d.name===1&&m.startsWith("top")&&this.topActions.push(d)}let b="";for(const g of Array.from(h.childNodes))g.nodeType===Node.ELEMENT_NODE?a(g,d):(g.nodeType===Node.TEXT_NODE||g.nodeType===Node.CDATA_SECTION_NODE)&&(b+=g.nodeValue??"");return b.trim().length>0&&d.setValue(b),d},o=a(n,null);if(o.name!==19)throw new Error("<bulletml> doesn't come.");if(this.bulletml=o,this.topActions.length===0)for(const h of o.childList())h.name===1&&this.topActions.push(h)}getTopActions(){return this.topActions}getBulletRef(e){const t=this.bulletMap[e]??null;if(!t)throw new Error("bulletRef key doesn't exist.");return t}getActionRef(e){const t=this.actionMap[e]??null;if(!t)throw new Error("actionRef key doesn't exist.");return t}getFireRef(e){const t=this.fireMap[e]??null;if(!t)throw new Error("fireRef key doesn't exist.");return t}isHorizontal(){return this.horizontal}}function es(c){const e=(c.localName&&c.localName.length>0?c.localName:c.tagName).trim(),t=e.indexOf(":");return t>=0?e.slice(t+1):e}function se(c,e){const t=c.getAttribute(e);if(t!==null)return t;for(const r of Array.from(c.attributes)){const i=(r.localName&&r.localName.length>0?r.localName:r.name).trim();if(i===e)return r.value;const n=i.indexOf(":");if(n>=0&&i.slice(n+1)===e)return r.value}return null}function rs(c){if(c===0||c===8)return"bullet";if(c===1||c===9)return"action";if(c===2||c===10)return"fire";throw new Error("invalid label domain")}function is(c,e,t){const r=c[e],i=r.get(t);if(i!==void 0)return i;const n=`${e}Max`,a=c[n];return c[n]++,r.set(t,a),a}class he{constructor(e,t,r){s(this,"bulletml");s(this,"node");s(this,"para");this.bulletml=e,this.node=t,this.para=r}createRunner(){return new Be(this)}}class At{constructor(e,t,r,i){s(this,"gradient");this.firstX=e,this.lastX=t,this.firstY=r,this.lastY=i;const n=this.lastX-this.firstX;this.gradient=n!==0?(this.lastY-this.firstY)/n:0}getValue(e){return this.firstY+this.gradient*(e-this.firstX)}isLast(e){return e>=this.lastX}getLast(){return this.lastY}}class ve{constructor(e,t){s(this,"act");s(this,"node");s(this,"actTurn",-1);s(this,"endTurn",0);s(this,"actIte",0);s(this,"end",!1);s(this,"spd",null);s(this,"dir",null);s(this,"prevSpd",null);s(this,"prevDir",null);s(this,"changeDir",null);s(this,"changeSpeed",null);s(this,"accelX",null);s(this,"accelY",null);s(this,"parameters");s(this,"repeatStack",[]);s(this,"refStack",[]);this.state=e,this.runner=t,this.node=[...e.node],this.parameters=e.para,this.act=this.node[0]??null;for(const r of this.node)r.setParent(null)}isEnd(){return this.end}run(){if(!this.isEnd()){if(this.applyChanges(),this.endTurn=this.runner.getTurn(),!this.act){this.isTurnEnd()||!this.changeDir&&!this.changeSpeed&&!this.accelX&&!this.accelY&&(this.end=!0);return}this.act=this.node[this.actIte]??null,this.actTurn===-1&&(this.actTurn=this.runner.getTurn()),this.runSub(),this.act?this.node[this.actIte]=this.act:(this.actIte++,this.act=this.node[this.actIte]??null)}}runSub(){var e,t;for(;this.act&&!this.isTurnEnd();){let r=this.act;if(this.dispatch(r),!this.act&&((e=r.getParent())==null?void 0:e.name)===19){const i=this.refStack.pop();if(!i)throw new Error("ref stack underflow");r=i.act,this.parameters=i.para}for(this.act||(this.act=r.next());!this.act;){const i=r.getParent();if((i==null?void 0:i.name)===7){const n=this.repeatStack[this.repeatStack.length-1];if(!n)throw new Error("repeat stack underflow");if(n.ite++,n.ite<n.end){this.act=n.act;break}this.repeatStack.pop()}if(this.act=r.getParent(),!this.act)break;if(r=this.act,((t=this.act.getParent())==null?void 0:t.name)===19){const n=this.refStack.pop();if(!n)throw new Error("ref stack underflow");r=n.act,this.act=n.act,this.parameters=n.para}this.act=this.act.next()}}}dispatch(e){switch(e.name){case 0:this.runBullet();return;case 1:this.runAction();return;case 2:this.runFire();return;case 3:this.runChangeDirection();return;case 4:this.runChangeSpeed();return;case 5:this.runAccel();return;case 6:this.runWait();return;case 7:this.runRepeat();return;case 8:this.runBulletRef();return;case 9:this.runActionRef();return;case 10:this.runFireRef();return;case 11:this.runVanish();return;default:this.act=null}}runBullet(){if(this.act){if(this.setSpeed(),this.setDirection(),this.spd==null&&(this.prevSpd=this.spd=this.runner.getDefaultSpeed()),this.dir==null&&(this.prevDir=this.dir=this.runner.getAimDirection()),!this.act.getChild(1)&&!this.act.getChild(9))this.runner.createSimpleBullet(this.dir,this.spd);else{const e=[];this.act.getAllChildrenVec(1,e),this.act.getAllChildrenVec(9,e),this.runner.createBullet(new he(this.state.bulletml,e,this.parameters),this.dir,this.spd)}this.act=null}}runFire(){if(!this.act)return;this.shotInit(),this.setSpeed(),this.setDirection();let e=this.act.getChild(0);if(e||(e=this.act.getChild(8)),!e)throw new Error("<fire> must have contents bullet or bulletRef");this.act=e}runAction(){this.act&&(this.act=this.act.childBegin())}runWait(){this.act&&(this.doWait(Math.trunc(this.getNumberContents(this.act))),this.act=null)}runRepeat(){if(!this.act)return;const e=this.act.getChild(15);if(!e)return;const t=Math.trunc(this.getNumberContents(e));let r=this.act.getChild(1);if(r||(r=this.act.getChild(9)),!r)throw new Error("repeat elem must have contents action or actionRef");this.repeatStack.push({ite:0,end:t,act:r}),this.act=r}runFireRef(){if(!this.act)return;const e=this.act,t=this.parameters;this.parameters=this.getParameters(),this.refStack.push({act:e,para:t}),this.act=this.state.bulletml.getFireRef(e.refID)}runActionRef(){if(!this.act)return;const e=this.act,t=this.parameters;this.parameters=this.getParameters(),this.refStack.push({act:e,para:t}),this.act=this.state.bulletml.getActionRef(e.refID)}runBulletRef(){if(!this.act)return;const e=this.act,t=this.parameters;this.parameters=this.getParameters(),this.refStack.push({act:e,para:t}),this.act=this.state.bulletml.getBulletRef(e.refID)}runChangeDirection(){if(!this.act)return;const e=this.act.getChild(14),t=this.act.getChild(16);if(!e||!t){this.act=null;return}const r=Math.trunc(this.getNumberContents(e)),i=t.type,n=i!==4?this.getDirection(t,!1):this.getNumberContents(t);this.calcChangeDirection(n,r,i===4),this.act=null}runChangeSpeed(){if(!this.act)return;const e=this.act.getChild(14),t=this.act.getChild(17);if(!e||!t){this.act=null;return}const r=Math.trunc(this.getNumberContents(e));let i;t.type!==4?i=this.getSpeed(t):i=this.getNumberContents(t)*r+this.runner.getBulletSpeed(),this.calcChangeSpeed(i,r),this.act=null}runAccel(){if(!this.act)return;const e=this.act.getChild(14);if(!e){this.act=null;return}const t=Math.trunc(this.getNumberContents(e)),r=this.act.getChild(12),i=this.act.getChild(13);this.state.bulletml.isHorizontal()?(i&&this.calcAccelX(this.getNumberContents(i),t,i.type),r&&this.calcAccelY(-this.getNumberContents(r),t,r.type)):(r&&this.calcAccelX(this.getNumberContents(r),t,r.type),i&&this.calcAccelY(this.getNumberContents(i),t,i.type)),this.act=null}runVanish(){this.runner.doVanish(),this.act=null}applyChanges(){const e=this.runner.getTurn();this.changeDir&&(this.changeDir.isLast(e)?(this.runner.doChangeDirection(this.changeDir.getLast()),this.changeDir=null):this.runner.doChangeDirection(this.changeDir.getValue(e))),this.changeSpeed&&(this.changeSpeed.isLast(e)?(this.runner.doChangeSpeed(this.changeSpeed.getLast()),this.changeSpeed=null):this.runner.doChangeSpeed(this.changeSpeed.getValue(e))),this.accelX&&(this.accelX.isLast(e)?(this.runner.doAccelX(this.accelX.getLast()),this.accelX=null):this.runner.doAccelX(this.accelX.getValue(e))),this.accelY&&(this.accelY.isLast(e)?(this.runner.doAccelY(this.accelY.getLast()),this.accelY=null):this.runner.doAccelY(this.accelY.getValue(e)))}isTurnEnd(){return this.end||this.actTurn>this.endTurn}doWait(e){e<=0||(this.actTurn+=e)}shotInit(){this.spd=null,this.dir=null}setSpeed(){if(!this.act)return;const e=this.act.getChild(17);e&&(this.spd=this.getSpeed(e))}setDirection(){if(!this.act)return;const e=this.act.getChild(16);e&&(this.dir=this.getDirection(e,!0))}getNumberContents(e){return e.getValue({rank:this.runner.getRank(),parameters:this.parameters,runner:this.runner})}getSpeed(e){let t=this.getNumberContents(e);return e.type===3?t+=this.runner.getBulletSpeed():e.type===4&&(this.prevSpd==null?t=1:t+=this.prevSpd),this.prevSpd=t,t}getDirection(e,t){let r=this.getNumberContents(e),i=!0;for(e.type!==0&&(i=!1,e.type===2?this.state.bulletml.isHorizontal()&&(r-=90):e.type===3?r+=this.runner.getBulletDirection():e.type===4?this.prevDir==null?(r=0,i=!0):r+=this.prevDir:i=!0),i&&(r+=this.runner.getAimDirection());r>360;)r-=360;for(;r<0;)r+=360;return t&&(this.prevDir=r),r}calcChangeDirection(e,t,r){const i=this.actTurn+t,n=this.runner.getBulletDirection();if(r){this.changeDir=new At(this.actTurn,i,n,n+e*t);return}const a=e-n,o=a>0?a-360:a+360,h=Math.abs(a)<Math.abs(o)?a:o;this.changeDir=new At(this.actTurn,i,n,n+h)}calcChangeSpeed(e,t){const r=this.actTurn+t,i=this.runner.getBulletSpeed();this.changeSpeed=new At(this.actTurn,r,i,e)}calcAccelX(e,t,r){const i=this.actTurn+t,n=this.runner.getBulletSpeedX();let a;r===4?a=n+e*t:r===3?a=n+e:a=e,this.accelX=new At(this.actTurn,i,n,a)}calcAccelY(e,t,r){const i=this.actTurn+t,n=this.runner.getBulletSpeedY();let a;r===4?a=n+e*t:r===3?a=n+e:a=e,this.accelY=new At(this.actTurn,i,n,a)}getParameters(){if(!this.act)return null;let e=null;for(const t of this.act.childList())t.name===18&&(e||(e=[0]),e.push(this.getNumberContents(t)));return e}}class Be{constructor(e){s(this,"callbacks",{});s(this,"end",!1);s(this,"impl",[]);if(e instanceof he){this.impl.push(new ve(e,this));return}for(const t of e.getTopActions())this.impl.push(new ve(new he(e,[t],null),this))}run(){if(!this.end)for(const e of this.impl)e.run()}isEnd(){if(this.end)return!0;for(const e of this.impl)if(!e.isEnd())return!1;return this.impl.length>0}getBulletDirection(){return this.callNumber("getBulletDirection",0)}getAimDirection(){return this.callNumber("getAimDirection",0)}getBulletSpeed(){return this.callNumber("getBulletSpeed",0)}getDefaultSpeed(){return this.callNumber("getDefaultSpeed",1)}getRank(){return this.callNumber("getRank",0)}createSimpleBullet(e,t){this.callVoid("createSimpleBullet",e,t)}createBullet(e,t,r){this.callVoid("createBullet",e,t,r)}getTurn(){return Math.trunc(this.callNumber("getTurn",0))}doVanish(){this.callVoid("doVanish")}doChangeDirection(e){this.callVoid("doChangeDirection",e)}doChangeSpeed(e){this.callVoid("doChangeSpeed",e)}doAccelX(e){this.callVoid("doAccelX",e)}doAccelY(e){this.callVoid("doAccelY",e)}getBulletSpeedX(){return this.callNumber("getBulletSpeedX",0)}getBulletSpeedY(){return this.callNumber("getBulletSpeedY",0)}getRand(){return this.callNumber("getRand",Math.random())}callNumber(e,t){const r=this.callbacks[e];if(!r)return t;const i=r(this);return typeof i=="number"&&Number.isFinite(i)?i:t}callVoid(e,...t){const r=this.callbacks[e];r&&r(this,...t)}}class ss{constructor(e,t,r=null){s(this,"name");s(this,"url");s(this,"inlineXmlText");s(this,"parser",null);s(this,"preloadPromise",null);this.name=e,this.url=t,this.inlineXmlText=r}async preload(){this.parser||(this.preloadPromise||(this.preloadPromise=(async()=>{let e=this.inlineXmlText;if(e==null){const r=await fetch(this.url);if(!r.ok)throw new Error(`Unable to load BulletML: ${this.url}`);e=await r.text()}const t=new ts(this.name);t.parse(e),this.parser=t})()),await this.preloadPromise)}createRunner(){if(!this.parser)throw new Error(`BulletML parser is not loaded yet: ${this.name}`);return new Be(this.parser)}}function ns(c){const e=as(c);let t=0;function r(){const o=e[t++];if(!o)return()=>0;if(o.type==="num"){const h=o.value;return()=>h}if(o.type==="var"){if(o.value==="rand")return u=>u.runner.getRand();if(o.value==="rank")return u=>u.rank;const h=Number.parseInt(o.value,10);return u=>!Number.isFinite(h)||!u.parameters||h<0||h>=u.parameters.length?1:u.parameters[h]}if(o.type==="op"&&o.value==="("){const h=n(),u=e[t++];if(!u||u.type!=="op"||u.value!==")")throw new Error("formula: missing ')' ");return h}if(o.type==="op"&&o.value==="-"){const h=r();return u=>-h(u)}throw new Error(`formula: invalid token ${o.value}`)}function i(){let o=r();for(;t<e.length;){const h=e[t];if(!h||h.type!=="op"||h.value!=="*"&&h.value!=="/")break;t++;const u=r(),d=o;h.value==="*"?o=m=>d(m)*u(m):o=m=>d(m)/u(m)}return o}function n(){let o=i();for(;t<e.length;){const h=e[t];if(!h||h.type!=="op"||h.value!=="+"&&h.value!=="-")break;t++;const u=i(),d=o;h.value==="+"?o=m=>d(m)+u(m):o=m=>d(m)-u(m)}return o}if(e.length===0)return()=>0;const a=n();if(t<e.length)throw new Error(`formula: trailing token ${e[t].value}`);return a}function as(c){const e=[];let t=0;for(;t<c.length;){const r=c[t];if(r===" "||r==="	"||r===`
`||r==="\r"){t++;continue}if(r>="0"&&r<="9"||r==="."){let i=t+1;for(;i<c.length;){const n=c[i];if(n>="0"&&n<="9"||n===".")i++;else break}e.push({type:"num",value:Number.parseFloat(c.slice(t,i))}),t=i;continue}if(r==="$"){let i=t+1;for(;i<c.length;){const a=c[i];if(a>="a"&&a<="z"||a>="A"&&a<="Z"||a>="0"&&a<="9"||a==="_")i++;else break}const n=c.slice(t+1,i);e.push({type:"var",value:n}),t=i;continue}if("+-*/()".includes(r)){e.push({type:"op",value:r}),t++;continue}throw new Error(`formula: unsupported character '${r}'`)}return e}class F{constructor(){s(this,"BARRAGE_TYPE",13);s(this,"BARRAGE_MAX",64);s(this,"parser");s(this,"parserNum");s(this,"dirName",["morph","small","smallmove","smallsidemove","middle","middlesub","middlemove","middlebackmove","large","largemove","morph_lock","small_lock","middlesub_lock"]);this.parser=Array.from({length:this.BARRAGE_TYPE},()=>Array(this.BARRAGE_MAX).fill(null)),this.parserNum=Array(this.BARRAGE_TYPE).fill(0)}async loadBulletMLs(){const e=this.collectXmlTextByDir();for(let t=0;t<this.BARRAGE_TYPE;t++){const r=this.dirName[t],i=e.get(r)??[];let n=0;for(const a of i){if(n>=this.BARRAGE_MAX)break;const o=`${r}/${a.name}`;Rt.info(`Load BulletML: ${o}`);const h=new ss(o,"",a.xmlText);try{await h.preload(),this.parser[t][n]=h,n++}catch(u){const d=u instanceof Error?u.message:String(u);Rt.error(`Failed to load BulletML: ${o} (${d})`)}}this.parserNum[t]=n}}unloadBulletMLs(){for(let e=0;e<this.BARRAGE_TYPE;e++){for(let t=0;t<this.parserNum[e];t++)this.parser[e][t]=null;this.parserNum[e]=0}}collectXmlTextByDir(){const e=Object.assign({"../../../large/57way.xml":Er,"../../../large/88way.xml":xr,"../../../large/allround.xml":Sr,"../../../large/dr1_boss_1.xml":Tr,"../../../large/dr1_boss_2.xml":vr,"../../../large/forward_3way.xml":Rr,"../../../large/grow.xml":Lr,"../../../large/growround.xml":Ar,"../../../large/kr4_boss_rb_rockets.xml":Mr,"../../../large/mnway.xml":Cr,"../../../large/nway.xml":Pr,"../../../large/pxa_boss_opening.xml":Ir,"../../../large/spread2blt.xml":kr,"../../../large/wide_spread.xml":Nr,"../../../largemove/down.xml":Dr,"../../../largemove/down_slow.xml":Br,"../../../middle/2round.xml":Or,"../../../middle/4way.xml":_r,"../../../middle/double_roll_seeds.xml":Fr,"../../../middle/dr1_boss_3.xml":Yr,"../../../middle/kr3_boss_fastspread.xml":Gr,"../../../middle/nwroll.xml":Ur,"../../../middle/roll2way.xml":Vr,"../../../middle/roll4way.xml":$r,"../../../middle/shotgun.xml":Hr,"../../../middle/spread_bf.xml":zr,"../../../middlebackmove/up.xml":Xr,"../../../middlemove/back.xml":jr,"../../../middlemove/curve.xml":Wr,"../../../middlemove/down.xml":qr,"../../../middlemove/down_fast.xml":Zr,"../../../middlemove/down_slow.xml":Kr,"../../../middlesub/shot.xml":Jr,"../../../middlesub_lock/shot.xml":Qr,"../../../morph/248shot.xml":ti,"../../../morph/3way.xml":ei,"../../../morph/6gt.xml":ri,"../../../morph/accel.xml":ii,"../../../morph/bar.xml":si,"../../../morph/divide.xml":ni,"../../../morph/fire_slowshot.xml":ai,"../../../morph/kr1b_bit_shot.xml":li,"../../../morph/nway.xml":oi,"../../../morph/side_back_shot.xml":hi,"../../../morph/sideway.xml":ci,"../../../morph/slowdown.xml":di,"../../../morph/spread.xml":ui,"../../../morph/twin.xml":pi,"../../../morph/wide.xml":mi,"../../../morph_lock/248shot.xml":fi,"../../../morph_lock/3way.xml":bi,"../../../morph_lock/6gt.xml":gi,"../../../morph_lock/accel.xml":wi,"../../../morph_lock/bar.xml":yi,"../../../morph_lock/divide.xml":Ei,"../../../morph_lock/fire_slowshot.xml":xi,"../../../morph_lock/kr1b_bit_shot.xml":Si,"../../../morph_lock/nway.xml":Ti,"../../../morph_lock/side_back_shot.xml":vi,"../../../morph_lock/sideway.xml":Ri,"../../../morph_lock/slowdown.xml":Li,"../../../morph_lock/spread.xml":Ai,"../../../morph_lock/twin.xml":Mi,"../../../morph_lock/wide.xml":Ci,"../../../small/shot.xml":Pi,"../../../small_lock/shot.xml":Ii,"../../../smallmove/248shot.xml":ki,"../../../smallmove/3waychase.xml":Ni,"../../../smallmove/6gt.xml":Di,"../../../smallmove/accel.xml":Bi,"../../../smallmove/accum.xml":Oi,"../../../smallmove/bar.xml":_i,"../../../smallmove/bit_move.xml":Fi,"../../../smallmove/ikr5_vrp.xml":Yi,"../../../smallmove/kr1_boss_bit.xml":Gi,"../../../smallmove/nway.xml":Ui,"../../../smallmove/rndway.xml":Vi,"../../../smallmove/slowdown.xml":$i,"../../../smallmove/spread.xml":Hi,"../../../smallmove/twin.xml":zi,"../../../smallmove/twin_extend.xml":Xi,"../../../smallsidemove/3waychase.xml":ji,"../../../smallsidemove/downaccel.xml":Wi,"../../../smallsidemove/straight.xml":qi,"../../../smallsidemove/upaccel.xml":Zi}),t=new Map;for(const[r,i]of Object.entries(e)){const n=r.match(/\/([^/]+)\/([^/]+\.xml)$/);if(!n)continue;const a=n[1],o=n[2],h=t.get(a);h?h.push({name:o,xmlText:i}):t.set(a,[{name:o,xmlText:i}])}for(const r of t.values())r.sort((i,n)=>i.name.localeCompare(n.name));return t}}s(F,"MORPH",0),s(F,"SMALL",1),s(F,"SMALLMOVE",2),s(F,"SMALLSIDEMOVE",3),s(F,"MIDDLE",4),s(F,"MIDDLESUB",5),s(F,"MIDDLEMOVE",6),s(F,"MIDDLEBACKMOVE",7),s(F,"LARGE",8),s(F,"LARGEMOVE",9),s(F,"MORPH_LOCK",10),s(F,"SMALL_LOCK",11),s(F,"MIDDLESUB_LOCK",12);class T{constructor(e=0,t=0){s(this,"x");s(this,"y");this.x=e,this.y=t}opMul(e){return this.x*e.x+this.y*e.y}getElement(e){const t=new T,r=e.opMul(e);if(r!==0){const i=this.opMul(e);t.x=i*e.x/r,t.y=i*e.y/r}else t.x=0,t.y=0;return t}opAddAssign(e){this.x+=e.x,this.y+=e.y}opSubAssign(e){this.x-=e.x,this.y-=e.y}opMulAssign(e){this.x*=e,this.y*=e}opDivAssign(e){this.x/=e,this.y/=e}checkSide(e,t,r){const i=t.x-e.x,n=t.y-e.y,a=r?this.x+r.x:this.x,o=r?this.y+r.y:this.y;return i===0?n===0?0:n>0?a-e.x:e.x-a:n===0?i>0?e.y-o:o-e.y:i*n>0?(a-e.x)/i-(o-e.y)/n:-(a-e.x)/i+(o-e.y)/n}checkCross(e,t,r,i){let n,a,o,h;this.x<e.x?(n=this.x-i,o=e.x+i):(n=e.x-i,o=this.x+i),this.y<e.y?(a=this.y-i,h=e.y+i):(a=e.y-i,h=this.y+i);let u,d,m,b;if(r.y<t.y?(d=r.y-i,b=t.y+i):(d=t.y-i,b=r.y+i),h>=d&&b>=a&&(r.x<t.x?(u=r.x-i,m=t.x+i):(u=t.x-i,m=r.x+i),o>=u&&m>=n)){const g=this.y-e.y,L=e.x-this.x,S=e.x*this.y-e.y*this.x,v=r.y-t.y,N=t.x-r.x,O=t.x*r.y-t.y*r.x,G=L*v-g*N;if(G!==0){const U=(L*O-S*N)/G,Q=(S*v-g*O)/G;if(n<=U&&U<=o&&a<=Q&&Q<=h&&u<=U&&U<=m&&d<=Q&&Q<=b)return!0}}return!1}checkHitDist(e,t,r){let i=t.x-e.x,n=t.y-e.y;const a=i*i+n*n;if(a>1e-5){const o=this.x-e.x,h=this.y-e.y,u=i*o+n*h;if(u>=0&&u<=a){const d=o*o+h*h-u*u/a;if(d>=0&&d<=r)return!0}}return!1}size(){return Math.sqrt(this.x*this.x+this.y*this.y)}dist(e){const t=Math.abs(this.x-e.x),r=Math.abs(this.y-e.y);return t>r?t+r/2:r+t/2}toString(){return`(${this.x}, ${this.y})`}}const q=class q{constructor(e){s(this,"pos");s(this,"acc");s(this,"deg",0);s(this,"speed",0);s(this,"id");s(this,"runner",null);s(this,"_rank",0);this.pos=new T,this.acc=new T,this.id=e}static setRandSeed(e){q.rand.setSeed(e)}static setBulletsManager(e){q.manager=e,q.target=new T,q.target.x=0,q.target.y=0}static getRand(){return q.rand.nextFloat(1)}static addBullet(e,t,r){if(typeof e=="number"){q.manager.addBullet(e,t);return}q.manager.addBullet(e,t,r??0)}static getTurn(){return q.manager.getTurn()}set(e,t,r,i,n){this.pos.x=e,this.pos.y=t,this.acc.x=0,this.acc.y=0,this.deg=r,this.speed=i,this.rank=n,this.runner=null}setRunner(e){this.runner=e}setWithRunner(e,t,r,i,n,a){this.set(t,r,i,n,a),this.setRunner(e)}move(){q.now=this,this.runner&&!Re(this.runner)&&Ts(this.runner)}isEnd(){return this.runner?Re(this.runner):!0}kill(){q.manager.killMe(this)}remove(){this.runner&&(vs(this.runner),this.runner=null)}get rank(){return this._rank}set rank(e){this._rank=e}};s(q,"now"),s(q,"target"),s(q,"rand",new it),s(q,"manager");let _=q;const ls=62/10,Nt=10/62;function Oe(c){return c*180/Math.PI}function be(c){return c*Math.PI/180}function os(c){return Oe(_.now.deg)}function hs(c){return _.now.speed*ls}function cs(c){return 1}function ds(c){return _.now.rank}function us(c,e,t){_.addBullet(be(e),t*Nt)}function ps(c,e,t,r){_.addBullet(e,be(t),r*Nt)}function ms(c){return _.getTurn()}function fs(c){_.now.kill()}function bs(c,e){_.now.deg=be(e)}function gs(c,e){_.now.speed=e*Nt}function ws(c,e){_.now.acc.x=e*Nt}function ys(c,e){_.now.acc.y=e*Nt}function Es(c){return _.now.acc.x}function xs(c){return _.now.acc.y}function Ss(c){return _.getRand()}function Re(c){return c?typeof c.isEnd=="function"?c.isEnd():!!c.end||!!c.finished:!0}function Ts(c){if(typeof c.run=="function"){c.run();return}typeof c.update=="function"&&c.update()}function vs(c){typeof c.dispose=="function"&&c.dispose(),typeof c.close=="function"&&c.close(),c.end=!0}class Jt{constructor(e){s(this,"num");s(this,"idx");s(this,"enumIdx");s(this,"lists");s(this,"draft",null);this.num=e,this.idx=0,this.enumIdx=this.idx,this.lists=Array.from({length:e},()=>null)}beginNewList(){this.resetList(),this.newList()}nextNewList(){if(this.endList(),this.enumIdx>=this.idx+this.num||this.enumIdx<this.idx)throw new pe("Can't create new list. Index out of bound.");this.newList()}endNewList(){this.endList()}resetList(){this.enumIdx=this.idx}newList(){this.draft=null,l.beginDisplayListCapture(e=>{this.setCurrentCommands(e)})}endList(){l.endDisplayListCapture();const e=this.enumIdx-this.idx;e>=0&&e<this.lists.length&&(this.lists[e]=this.draft),this.enumIdx++}call(e){const t=this.lists[e];t&&t()}setCurrentList(e){this.draft=e}setCurrentCommands(e){this.draft=()=>{for(let t=0;t<e.length;t++)e[t]()}}close(){this.lists.fill(null),this.draft=null}}class Rs{constructor(){s(this,"renderTarget",null);s(this,"LUMINOUS_TEXTURE_WIDTH_MAX",64);s(this,"LUMINOUS_TEXTURE_HEIGHT_MAX",64);s(this,"luminousTextureWidth",64);s(this,"luminousTextureHeight",64);s(this,"screenWidth",0);s(this,"screenHeight",0);s(this,"luminous",0);s(this,"renderingToTexture",!1);s(this,"lmOfs",[[0,0],[1,0],[-1,0],[0,1],[0,-1]]);s(this,"lmOfsBs",5)}makeLuminousTexture(){const e=l.gl;if(!e){this.renderTarget=null;return}this.renderTarget&&(e.deleteRenderTarget(this.renderTarget),this.renderTarget=null),this.renderTarget=e.createRenderTarget(this.luminousTextureWidth,this.luminousTextureHeight)}init(e,t,r){this.makeLuminousTexture(),this.luminous=e,this.resized(t,r)}resized(e,t){this.screenWidth=e,this.screenHeight=t}close(){var e;this.renderTarget&&((e=l.gl)==null||e.deleteRenderTarget(this.renderTarget),this.renderTarget=null),this.renderingToTexture=!1}startRenderToTexture(){var e;this.renderTarget&&((e=l.gl)==null||e.beginRenderTarget(this.renderTarget),this.renderingToTexture=!0,l.glClear(l.GL_COLOR_BUFFER_BIT))}endRenderToTexture(){var e;this.renderingToTexture&&((e=l.gl)==null||e.endRenderTarget(),this.renderingToTexture=!1)}startRender(){this.startRenderToTexture()}endRender(){this.endRenderToTexture()}viewOrtho(){l.glMatrixMode(l.GL_PROJECTION),l.glPushMatrix(),l.glLoadIdentity(),l.glOrtho(0,this.screenWidth,this.screenHeight,0,-1,1),l.glMatrixMode(l.GL_MODELVIEW),l.glPushMatrix(),l.glLoadIdentity()}viewPerspective(){l.glMatrixMode(l.GL_PROJECTION),l.glPopMatrix(),l.glMatrixMode(l.GL_MODELVIEW),l.glPopMatrix()}draw(){var e;if(this.renderTarget){l.glEnable(l.GL_TEXTURE_2D),(e=l.gl)==null||e.bindTexture(this.renderTarget.texture),this.viewOrtho(),l.setColor(1,.8,.9,this.luminous),l.glBegin(l.GL_QUADS);for(let t=0;t<5;t++)l.glTexCoord2f(0,1),l.glVertex3f(0+this.lmOfs[t][0]*this.lmOfsBs,0+this.lmOfs[t][1]*this.lmOfsBs,0),l.glTexCoord2f(0,0),l.glVertex3f(0+this.lmOfs[t][0]*this.lmOfsBs,this.screenHeight+this.lmOfs[t][1]*this.lmOfsBs,0),l.glTexCoord2f(1,0),l.glVertex3f(this.screenWidth+this.lmOfs[t][0]*this.lmOfsBs,this.screenHeight+this.lmOfs[t][0]*this.lmOfsBs,0),l.glTexCoord2f(1,1),l.glVertex3f(this.screenWidth+this.lmOfs[t][0]*this.lmOfsBs,0+this.lmOfs[t][0]*this.lmOfsBs,0);l.glEnd(),this.viewPerspective(),l.glDisable(l.GL_TEXTURE_2D)}}}const C=class C extends l{constructor(){super(...arguments);s(this,"luminousScreen",null)}init(){this.setCaption(C.CAPTION),l.glEnable(l.GL_LINE_SMOOTH),l.glBlendFunc(l.GL_SRC_ALPHA,l.GL_ONE),l.glEnable(l.GL_BLEND),l.glDisable(l.GL_LIGHTING),l.glDisable(l.GL_CULL_FACE),l.glDisable(l.GL_DEPTH_TEST),l.glDisable(l.GL_TEXTURE_2D),l.glDisable(l.GL_COLOR_MATERIAL),C.rand=new it,C.luminous>0?(this.luminousScreen=new Rs,this.luminousScreen.init(C.luminous,l.width,l.height)):this.luminousScreen=null}close(){var t;(t=this.luminousScreen)==null||t.close()}startRenderToTexture(){var t;(t=this.luminousScreen)==null||t.startRenderToTexture()}endRenderToTexture(){var t;(t=this.luminousScreen)==null||t.endRenderToTexture()}drawLuminous(){var t;(t=this.luminousScreen)==null||t.draw()}resized(t,r){var i;(i=this.luminousScreen)==null||i.resized(t,r),super.resized(t,r)}viewOrthoFixed(){l.glMatrixMode(l.GL_PROJECTION),l.glPushMatrix(),l.glLoadIdentity(),l.glOrtho(0,640,480,0,-1,1),l.glMatrixMode(l.GL_MODELVIEW),l.glPushMatrix(),l.glLoadIdentity()}viewPerspective(){l.glMatrixMode(l.GL_PROJECTION),l.glPopMatrix(),l.glMatrixMode(l.GL_MODELVIEW),l.glPopMatrix()}static setRetroParam(t,r){C.retro=t,C.retroSize=r}static setRetroColor(t,r,i,n){C.retroR=t,C.retroG=r,C.retroB=i,C.retroA=n}static setRetroZ(t){C.retroZ=t}static drawLineRetro(t,r,i,n){if(!Number.isFinite(t)||!Number.isFinite(r)||!Number.isFinite(i)||!Number.isFinite(n))return;const a=(1-C.retro)*.5;let o=C.retroR+(1-C.retroR)*a,h=C.retroG+(1-C.retroG)*a,u=C.retroB+(1-C.retroB)*a,d=C.retroA*(a+.5);if(C.rand.nextInt(7)===0&&(o=Math.min(o*1.5,1),h=Math.min(h*1.5,1),u=Math.min(u*1.5,1),d=Math.min(d*1.5,1)),l.setColor(o,h,u,d),C.retro<.2){l.glBegin(l.GL_LINES),l.glVertex3f(t,r,C.retroZ),l.glVertex3f(i,n,C.retroZ),l.glEnd();return}const m=C.retroSize*C.retro;if(!Number.isFinite(m)||m<=1e-4){l.glBegin(l.GL_LINES),l.glVertex3f(t,r,C.retroZ),l.glVertex3f(i,n,C.retroZ),l.glEnd();return}const b=m/2,g=Math.abs(i-t),L=Math.abs(n-r);if(l.glBegin(l.GL_QUADS),g<L){const S=Math.min(Math.floor(L/m),C.RETRO_SEGMENT_MAX);if(S>0){const v=(i-t)/S;let N=0;const O=n<r?-m:m;let G=t,U=r;for(let Q=0;Q<=S;Q++,N+=v,U+=O)N>=m?(G+=m,N-=m):N<=-m&&(G-=m,N+=m),l.glVertex3f(G-b,U-b,C.retroZ),l.glVertex3f(G+b,U-b,C.retroZ),l.glVertex3f(G+b,U+b,C.retroZ),l.glVertex3f(G-b,U+b,C.retroZ)}}else{const S=Math.min(Math.floor(g/m),C.RETRO_SEGMENT_MAX);if(S>0){const v=(n-r)/S;let N=0;const O=i<t?-m:m;let G=t,U=r;for(let Q=0;Q<=S;Q++,G+=O,N+=v)N>=m?(U+=m,N-=m):N<=-m&&(U-=m,N+=m),l.glVertex3f(G-b,U-b,C.retroZ),l.glVertex3f(G+b,U-b,C.retroZ),l.glVertex3f(G+b,U+b,C.retroZ),l.glVertex3f(G-b,U+b,C.retroZ)}}l.glEnd()}static drawBoxRetro(t,r,i,n,a){const o=i*Math.cos(a)-n*Math.sin(a),h=i*Math.sin(a)+n*Math.cos(a),u=-i*Math.cos(a)-n*Math.sin(a),d=-i*Math.sin(a)+n*Math.cos(a);C.drawLineRetro(t+u,r-d,t+o,r-h),C.drawLineRetro(t+o,r-h,t-u,r+d),C.drawLineRetro(t-u,r+d,t-o,r+h),C.drawLineRetro(t-o,r+h,t+u,r-d)}static drawBoxLine(t,r,i,n){l.glBegin(l.GL_LINE_LOOP),l.glVertex3f(t,r,0),l.glVertex3f(t+i,r,0),l.glVertex3f(t+i,r+n,0),l.glVertex3f(t,r+n,0),l.glEnd()}static drawBoxSolid(t,r,i,n){l.glBegin(l.GL_TRIANGLE_FAN),l.glVertex3f(t,r,0),l.glVertex3f(t+i,r,0),l.glVertex3f(t+i,r+n,0),l.glVertex3f(t,r+n,0),l.glEnd()}};s(C,"CAPTION","PARSEC47"),s(C,"luminous",0),s(C,"rand"),s(C,"retro",0),s(C,"retroSize",.2),s(C,"retroR",1),s(C,"retroG",1),s(C,"retroB",1),s(C,"retroA",1),s(C,"retroZ",0),s(C,"RETRO_SEGMENT_MAX",256);let w=C;class P{static init(e){if(this.manager=e,!z.noSound){gt.dir="sounds",zt.dir="sounds",this.bgm=[];for(let t=0;t<this.BGM_NUM;t++){const r=new gt;r.load(this.bgmFileName[t]),this.bgm.push(r)}this.se=[];for(let t=0;t<this.SE_NUM;t++){const r=new zt;r.load(this.seFileName[t],this.seChannel[t]),this.se.push(r)}}}static close(){if(!z.noSound){for(let e=0;e<this.bgm.length;e++)this.bgm[e].free();for(let e=0;e<this.se.length;e++)this.se[e].free()}}static playBgm(e){z.noSound||this.manager.state!==wt.IN_GAME||this.bgm[e].play()}static playSe(e){z.noSound||this.manager.state!==wt.IN_GAME||this.se[e].play()}static stopSe(e){z.noSound||this.se[e].halt()}}s(P,"SHOT",0),s(P,"ROLL_CHARGE",1),s(P,"ROLL_RELEASE",2),s(P,"SHIP_DESTROYED",3),s(P,"GET_BONUS",4),s(P,"EXTEND",5),s(P,"ENEMY_DESTROYED",6),s(P,"LARGE_ENEMY_DESTROYED",7),s(P,"BOSS_DESTROYED",8),s(P,"LOCK",9),s(P,"LASER",10),s(P,"BGM_NUM",4),s(P,"SE_NUM",11),s(P,"manager"),s(P,"bgm",[]),s(P,"se",[]),s(P,"bgmFileName",["ptn0.ogg","ptn1.ogg","ptn2.ogg","ptn3.ogg"]),s(P,"seFileName",["shot.wav","rollchg.wav","rollrls.wav","shipdst.wav","getbonus.wav","extend.wav","enemydst.wav","largedst.wav","bossdst.wav","lock.wav","laser.wav"]),s(P,"seChannel",[0,1,2,1,3,4,5,6,7,1,2]);const k=class k{constructor(){s(this,"restart",!1);s(this,"RESTART_CNT",300);s(this,"pos",new T);s(this,"cnt",0);s(this,"pad");s(this,"field");s(this,"manager");s(this,"ppos",new T);s(this,"baseSpeed",k.BASE_SPEED);s(this,"slowSpeed",k.SLOW_BASE_SPEED);s(this,"speed",k.BASE_SPEED);s(this,"vel",new T);s(this,"bank",0);s(this,"firePos",new T);s(this,"fireWideDeg",k.FIRE_WIDE_BASE_DEG);s(this,"fireCnt",0);s(this,"ttlCnt",0);s(this,"fieldLimitX",0);s(this,"fieldLimitY",0);s(this,"rollLockCnt",0);s(this,"rollCharged",!1)}static createDisplayLists(){k.deleteDisplayLists();const e=new Jt(3);e.beginNewList(),l.setColor(.5,1,.5,.2),w.drawBoxSolid(-.1,-.5,.2,1),l.setColor(.5,1,.5,.4),w.drawBoxLine(-.1,-.5,.2,1),e.nextNewList(),l.setColor(1,.2,.2,1),w.drawBoxSolid(-.2,-.2,.4,.4),l.setColor(1,.5,.5,1),w.drawBoxLine(-.2,-.2,.4,.4),e.nextNewList(),l.setColor(.7,1,.5,.3),w.drawBoxSolid(-.15,-.3,.3,.6),l.setColor(.7,1,.5,.6),w.drawBoxLine(-.15,-.3,.3,.6),e.endNewList(),k.displayList=e}static deleteDisplayLists(){var e;(e=k.displayList)==null||e.close(),k.displayList=null}init(e,t,r){this.pad=e,this.field=t,this.manager=r,this.pos=new T,this.ppos=new T,this.vel=new T,this.firePos=new T,this.ttlCnt=0,this.fieldLimitX=t.size.x-k.FIELD_SPACE,this.fieldLimitY=t.size.y-k.FIELD_SPACE}start(){this.ppos.x=this.pos.x=0,this.ppos.y=this.pos.y=-this.field.size.y/2,this.vel.x=0,this.vel.y=0,this.speed=k.BASE_SPEED,this.fireWideDeg=k.FIRE_WIDE_BASE_DEG,this.restart=!0,this.cnt=-228,this.fireCnt=0,this.rollLockCnt=0,this.bank=0,this.rollCharged=!1,at.resetBonusScore()}close(){}setSpeedRate(e){k.isSlow?this.baseSpeed=k.BASE_SPEED*.7:this.baseSpeed=k.BASE_SPEED*e,this.slowSpeed=k.SLOW_BASE_SPEED*e}destroyed(){if(!(this.cnt<=0)){P.playSe(P.SHIP_DESTROYED),this.manager.shipDestroyed(),this.manager.addFragments(30,this.pos.x,this.pos.y,this.pos.x,this.pos.y,0,.08,Math.PI);for(let e=0;e<45;e++)this.manager.addParticle(this.pos,k.rand.nextFloat(Math.PI*2),0,.6);this.start(),this.cnt=-this.RESTART_CNT}}move(){if(this.cnt++,this.cnt<-228)return;this.cnt===0&&(this.restart=!1);const e=this.pad.getButtonState();e&tt.Button.B?(this.speed+=(this.slowSpeed-this.speed)*.2,this.fireWideDeg+=(k.FIRE_NARROW_BASE_DEG-this.fireWideDeg)*.1,this.rollLockCnt++,this.manager.mode===wt.ROLL?this.rollLockCnt%15===0&&(this.manager.addRoll(),P.playSe(P.ROLL_CHARGE),this.rollCharged=!0):this.rollLockCnt%10===0&&this.manager.addLock()):(this.speed+=(this.baseSpeed-this.speed)*.2,this.fireWideDeg+=(k.FIRE_WIDE_BASE_DEG-this.fireWideDeg)*.1,this.manager.mode===wt.ROLL?this.rollCharged&&(this.rollLockCnt=0,this.manager.releaseRoll(),P.playSe(P.ROLL_RELEASE),this.rollCharged=!1):(this.rollLockCnt=0,this.manager.releaseLock()));const t=this.pad.getDirState();if(this.vel.x=0,this.vel.y=0,t&tt.Dir.UP?this.vel.y=this.speed:t&tt.Dir.DOWN&&(this.vel.y=-this.speed),t&tt.Dir.RIGHT?this.vel.x=this.speed:t&tt.Dir.LEFT&&(this.vel.x=-this.speed),this.vel.x!==0&&this.vel.y!==0&&(this.vel.x*=.707,this.vel.y*=.707),this.ppos.x=this.pos.x,this.ppos.y=this.pos.y,this.pos.x+=this.vel.x,this.pos.y+=this.vel.y,this.bank+=(this.vel.x*k.BANK_BASE-this.bank)*.1,this.pos.x<-this.fieldLimitX?this.pos.x=-this.fieldLimitX:this.pos.x>this.fieldLimitX&&(this.pos.x=this.fieldLimitX),this.pos.y<-this.fieldLimitY?this.pos.y=-this.fieldLimitY:this.pos.y>this.fieldLimitY&&(this.pos.y=this.fieldLimitY),e&tt.Button.A){let r=0;switch(this.fireCnt%4){case 0:this.firePos.x=this.pos.x+k.TURRET_INTERVAL_LENGTH,this.firePos.y=this.pos.y,r=0;break;case 1:this.firePos.x=this.pos.x+k.TURRET_INTERVAL_LENGTH,this.firePos.y=this.pos.y,r=this.fireWideDeg*((this.fireCnt/4|0)%5)*.2;break;case 2:this.firePos.x=this.pos.x-k.TURRET_INTERVAL_LENGTH,this.firePos.y=this.pos.y,r=0;break;case 3:this.firePos.x=this.pos.x-k.TURRET_INTERVAL_LENGTH,this.firePos.y=this.pos.y,r=-this.fireWideDeg*((this.fireCnt/4|0)%5)*.2;break}this.manager.addShot(this.firePos,r),P.playSe(P.SHOT),this.fireCnt++}_.target&&(_.target.x=this.pos.x,_.target.y=this.pos.y),this.ttlCnt++}draw(){var e,t,r,i,n,a,o,h,u;if(!(this.cnt<-228||this.cnt<0&&-this.cnt%32<16)){l.glPushMatrix(),l.glTranslatef(this.pos.x,this.pos.y,0),(e=k.displayList)==null||e.call(1),l.glRotatef(this.bank,0,1,0),l.glTranslatef(-.5,0,0),(t=k.displayList)==null||t.call(0),l.glTranslatef(.2,.3,.2),(r=k.displayList)==null||r.call(0),l.glTranslatef(0,0,-.4),(i=k.displayList)==null||i.call(0),l.glPopMatrix(),l.glPushMatrix(),l.glTranslatef(this.pos.x,this.pos.y,0),l.glRotatef(this.bank,0,1,0),l.glTranslatef(.5,0,0),(n=k.displayList)==null||n.call(0),l.glTranslatef(-.2,.3,.2),(a=k.displayList)==null||a.call(0),l.glTranslatef(0,0,-.4),(o=k.displayList)==null||o.call(0),l.glPopMatrix();for(let d=0;d<6;d++)l.glPushMatrix(),l.glTranslatef(this.pos.x-.7,this.pos.y-.3,0),l.glRotatef(this.bank,0,1,0),l.glRotatef(180/2-this.fireWideDeg*100,0,0,1),l.glRotatef(d*180/3-this.ttlCnt*4,1,0,0),l.glTranslatef(0,0,.7),(h=k.displayList)==null||h.call(2),l.glPopMatrix(),l.glPushMatrix(),l.glTranslatef(this.pos.x+.7,this.pos.y-.3,0),l.glRotatef(this.bank,0,1,0),l.glRotatef(-180/2+this.fireWideDeg*100,0,0,1),l.glRotatef(d*180/3-this.ttlCnt*4,1,0,0),l.glTranslatef(0,0,.7),(u=k.displayList)==null||u.call(2),l.glPopMatrix()}}};s(k,"isSlow",!1),s(k,"INVINCIBLE_CNT",228),s(k,"rand",new it),s(k,"displayList",null),s(k,"SIZE",.3),s(k,"BASE_SPEED",.6),s(k,"SLOW_BASE_SPEED",.3),s(k,"BANK_BASE",50),s(k,"FIRE_WIDE_BASE_DEG",.7),s(k,"FIRE_NARROW_BASE_DEG",.5),s(k,"TURRET_INTERVAL_LENGTH",.2),s(k,"FIELD_SPACE",1.5);let Tt=k;const A=class A extends yt{constructor(){super(...arguments);s(this,"fieldLimitX",0);s(this,"fieldLimitY",0);s(this,"field");s(this,"ship");s(this,"manager");s(this,"pos",new T);s(this,"vel",new T);s(this,"cnt",0);s(this,"isDown",!0);s(this,"isInhaled",!1);s(this,"inhaleCnt",0)}static init(){A.rand=new it}static resetBonusScore(){A.bonusScore=10}static setSpeedRate(t){A.rate=t,A.speed=A.BASE_SPEED*A.rate}init(t){const r=Array.isArray(t)?t[0]:t;if(!(r instanceof _e))throw new Error("Bonus.init requires BonusInitializer");this.field=r.field,this.ship=r.ship,this.manager=r.manager,this.pos=new T,this.vel=new T,this.fieldLimitX=this.field.size.x/6*5,this.fieldLimitY=this.field.size.y/10*9}set(t,r=null){this.pos.x=t.x,this.pos.y=t.y,r!==null&&(this.pos.x+=r.x,this.pos.y+=r.y),this.vel.x=A.rand.nextSignedFloat(.07),this.vel.y=A.rand.nextSignedFloat(.07),this.cnt=0,this.inhaleCnt=0,this.isDown=!0,this.isInhaled=!1,this.exists=!0}missBonus(){A.resetBonusScore()}getBonus(){P.playSe(P.GET_BONUS),this.manager.addScore(A.bonusScore),A.bonusScore<1e3&&(A.bonusScore+=10)}move(){if(this.pos.x+=this.vel.x,this.pos.y+=this.vel.y,this.vel.x-=this.vel.x/50,this.pos.x>this.fieldLimitX?(this.pos.x=this.fieldLimitX,this.vel.x>0&&(this.vel.x=-this.vel.x)):this.pos.x<-this.fieldLimitX&&(this.pos.x=-this.fieldLimitX,this.vel.x<0&&(this.vel.x=-this.vel.x)),this.isDown)this.vel.y+=(-A.speed-this.vel.y)/50,this.pos.y<-this.fieldLimitY&&(this.isDown=!1,this.pos.y=-this.fieldLimitY,this.vel.y=A.speed);else if(this.vel.y+=(A.speed-this.vel.y)/50,this.pos.y>this.fieldLimitY){this.missBonus(),this.exists=!1;return}if(this.cnt++,this.cnt<A.RETRO_CNT)return;const t=this.pos.dist(this.ship.pos);if(t<A.ACQUIRE_WIDTH*(1+this.inhaleCnt*.2)&&this.ship.cnt>=-228){this.getBonus(),this.exists=!1;return}if(this.isInhaled){this.inhaleCnt++;let r=(A.INHALE_WIDTH-t)/48;r<.025&&(r=.025),this.vel.x+=(this.ship.pos.x-this.pos.x)*r,this.vel.y+=(this.ship.pos.y-this.pos.y)*r,this.ship.cnt<-228&&(this.isInhaled=!1,this.inhaleCnt=0)}else t<A.INHALE_WIDTH&&this.ship.cnt>=-228&&(this.isInhaled=!0)}draw(){const t=this.cnt<A.RETRO_CNT?1-this.cnt/A.RETRO_CNT:0,r=this.cnt*.1,i=Math.sin(r)*.3,n=Math.cos(r)*.3;t>0?(w.setRetroParam(t,.2),w.drawBoxRetro(this.pos.x-i,this.pos.y-n,A.BOX_SIZE/2,A.BOX_SIZE/2,0),w.drawBoxRetro(this.pos.x+i,this.pos.y+n,A.BOX_SIZE/2,A.BOX_SIZE/2,0),w.drawBoxRetro(this.pos.x-n,this.pos.y+i,A.BOX_SIZE/2,A.BOX_SIZE/2,0),w.drawBoxRetro(this.pos.x+n,this.pos.y-i,A.BOX_SIZE/2,A.BOX_SIZE/2,0)):(this.isInhaled?l.setColor(.8,.6,.4,.7):this.isDown?l.setColor(.4,.9,.6,.7):l.setColor(.8,.9,.5,.7),w.drawBoxLine(this.pos.x-i-A.BOX_SIZE/2,this.pos.y-n-A.BOX_SIZE/2,A.BOX_SIZE,A.BOX_SIZE),w.drawBoxLine(this.pos.x+i-A.BOX_SIZE/2,this.pos.y+n-A.BOX_SIZE/2,A.BOX_SIZE,A.BOX_SIZE),w.drawBoxLine(this.pos.x-n-A.BOX_SIZE/2,this.pos.y+i-A.BOX_SIZE/2,A.BOX_SIZE,A.BOX_SIZE),w.drawBoxLine(this.pos.x+n-A.BOX_SIZE/2,this.pos.y-i-A.BOX_SIZE/2,A.BOX_SIZE,A.BOX_SIZE))}};s(A,"rate",1),s(A,"bonusScore",10),s(A,"BASE_SPEED",.1),s(A,"speed",A.BASE_SPEED),s(A,"INHALE_WIDTH",3),s(A,"ACQUIRE_WIDTH",1),s(A,"RETRO_CNT",20),s(A,"BOX_SIZE",.4),s(A,"rand",new it);let at=A;class _e{constructor(e,t,r){this.field=e,this.ship=t,this.manager=r}}class Lt extends Et{constructor(t,r){super(t,[r],()=>new ct);s(this,"cnt",0);_.setBulletsManager(this),ct.init(),this.cnt=0}addBullet(...t){if(t.length===2&&typeof t[0]=="number"&&typeof t[1]=="number"){this.addSimpleBullet(t[0],t[1]);return}if(t.length===3&&typeof t[1]=="number"&&typeof t[2]=="number"){this.addStateBullet(t[0],t[1],t[2]);return}if(t.length===11)return this.addManagedBullet(t);if(t.length===12){const r=this.addManagedBullet(t.slice(1));return r?(r.setTop(t[0]),r):null}if(t.length===15){const r=this.acquireActor();if(!r)return null;const i=t[0],n=t[1];return r.set(n,t[2],t[3],t[4],t[5],t[6],t[7],t[8],t[9],t[10],t[11],t[12],t[13],0,t[14]),r.setTop(i),r}throw new Error("BulletActorPool.addBullet: invalid argument pattern")}move(){super.move(),this.cnt++}getTurn(){return this.cnt}killMe(t){const r=this.actor[t.id];if(r&&r.bullet.id===t.id){r.remove();return}for(let i=0;i<this.actor.length;i++){const n=this.actor[i];if(!n.exists)continue;const a=n.bullet;if(a===t||a.id===t.id){n.remove();return}}}clear(){for(let t=0;t<this.actor.length;t++)this.actor[t].exists&&this.actor[t].remove()}static registFunctions(t){const r=t.callbacks??(t.callbacks={});r.getBulletDirection=os,r.getAimDirection=Ls,r.getBulletSpeed=hs,r.getDefaultSpeed=cs,r.getRank=ds,r.createSimpleBullet=us,r.createBullet=ps,r.getTurn=ms,r.doVanish=fs,r.doChangeDirection=bs,r.doChangeSpeed=gs,r.doAccelX=ws,r.doAccelY=ys,r.getBulletSpeedX=Es,r.getBulletSpeedY=xs,r.getRand=Ss}acquireActor(){return this.getInstance()}addSimpleBullet(t,r){const i=this.acquireActor();if(!i)return;const n=_.now,a=n.morphParser??[],o=n.morphNum??0,h=n.morphIdx??0,u=n.morphCnt??0;if(n.isMorph){const d=a[h];if(!d)return;const m=d.createRunner();Lt.registFunctions(m),i.set(m,_.now.pos.x,_.now.pos.y,t,r,_.now.rank,n.speedRank??1,n.shape??0,n.color??0,n.bulletSize??1,n.xReverse??1,a,o,h+1,u-1);return}i.setSimple(_.now.pos.x,_.now.pos.y,t,r,_.now.rank,n.speedRank??1,n.shape??0,n.color??0,n.bulletSize??1,n.xReverse??1)}addStateBullet(t,r,i){const n=this.acquireActor();if(!n)return;const a=this.createRunnerFromState(t);Lt.registFunctions(a);const o=_.now;if(o.isMorph){n.set(a,_.now.pos.x,_.now.pos.y,r,i,_.now.rank,o.speedRank??1,o.shape??0,o.color??0,o.bulletSize??1,o.xReverse??1,o.morphParser??[],o.morphNum??0,o.morphIdx??0,o.morphCnt??0);return}n.set(a,_.now.pos.x,_.now.pos.y,r,i,_.now.rank,o.speedRank??1,o.shape??0,o.color??0,o.bulletSize??1,o.xReverse??1)}addManagedBullet(t){const r=this.acquireActor();return r?(r.set(...t),r.setInvisible(),r):null}createRunnerFromState(t){return t.createRunner()}}function Ls(c){const e=_.now.pos,t=_.target,r=_.now.xReverse??1;return Math.atan2(t.x-e.x,t.y-e.y)*r*180/Math.PI}class Qt extends _{constructor(t){super(t);s(this,"morphParser",[]);s(this,"morphNum",0);s(this,"morphIdx",0);s(this,"morphCnt",0);s(this,"baseMorphIdx",0);s(this,"baseMorphCnt",0);s(this,"isMorph",!1)}setMorph(t,r,i,n){if(n<=0){this.isMorph=!1;return}this.isMorph=!0,this.baseMorphCnt=this.morphCnt=n,this.morphNum=r;for(let a=0;a<r;a++)this.morphParser[a]=t[a];this.morphIdx=i,this.morphIdx>=this.morphNum&&(this.morphIdx=0),this.baseMorphIdx=this.morphIdx}resetMorph(){this.morphIdx=this.baseMorphIdx,this.morphCnt=this.baseMorphCnt}}s(Qt,"MORPH_MAX",8);class As extends Qt{constructor(t){super(t);s(this,"speedRank",0);s(this,"shape",0);s(this,"color",0);s(this,"bulletSize",0);s(this,"xReverse",0)}setParam(t,r,i,n,a){this.speedRank=t,this.shape=r,this.color=i,this.bulletSize=n,this.xReverse=a}}const y=class y extends yt{constructor(){super();s(this,"bullet");s(this,"field");s(this,"ship");s(this,"isSimple",!1);s(this,"isTop",!1);s(this,"isVisible",!0);s(this,"parser",null);s(this,"ppos",new T);s(this,"cnt",0);s(this,"rtCnt",0);s(this,"shouldBeRemoved",!1);s(this,"backToRetro",!1)}static init(){y.nextId=0}static resetTotalBulletsSpeed(){y.totalBulletsSpeed=0}init(t){const r=Array.isArray(t)?t[0]:t;if(!(r instanceof Fe))throw new Error("BulletActor.init requires BulletActorInitializer");this.field=r.field,this.ship=r.ship,this.bullet=this.createBullet(y.nextId++),this.ppos=new T,this.exists=!1}createBullet(t){const r=As,i=new r(t);return i.pos??(i.pos=new T),i.acc??(i.acc=new T),i.deg??(i.deg=0),i.speed??(i.speed=0),i.rank??(i.rank=0),i.id??(i.id=t),i.isMorph??(i.isMorph=!1),i.speedRank??(i.speedRank=1),i.shape??(i.shape=0),i.color??(i.color=0),i.bulletSize??(i.bulletSize=1),i.xReverse??(i.xReverse=1),i.morphParser??(i.morphParser=[]),i.morphNum??(i.morphNum=0),i.morphIdx??(i.morphIdx=0),i.morphCnt??(i.morphCnt=0),i.set??(i.set=(n,a,o,h,u)=>{i.pos.x=n,i.pos.y=a,i.acc.x=0,i.acc.y=0,i.deg=o,i.speed=h,i.rank=u}),i.move??(i.move=()=>{}),i.isEnd??(i.isEnd=()=>!0),i.remove??(i.remove=()=>{}),i.setRunner??(i.setRunner=()=>{}),i.setMorph??(i.setMorph=(n,a,o,h)=>{i.isMorph=h>0,i.morphParser=n.slice(0,a),i.morphNum=a,i.morphIdx=o,i.morphCnt=h}),i.resetMorph??(i.resetMorph=()=>{}),i.setParam??(i.setParam=(n,a,o,h,u)=>{i.speedRank=n,i.shape=a,i.color=o,i.bulletSize=h,i.xReverse=u}),i}start(t,r,i,n,a){this.exists=!0,this.isTop=!1,this.isVisible=!0,this.ppos.x=this.bullet.pos.x,this.ppos.y=this.bullet.pos.y,this.bullet.setParam(t,r,i,n,a),this.cnt=0,this.rtCnt=0,this.shouldBeRemoved=!1,this.backToRetro=!1}set(t,r,i,n,a,o,h,u,d,m,b,g,L=0,S=0,v=0){this.bullet.set(r,i,n,a,o),this.bullet.setRunner(t),g&&L>0?(this.bullet.setMorph(g,L,S,v),this.bullet.isMorph=!0):this.bullet.isMorph=!1,this.isSimple=!1,this.start(h,u,d,m,b)}setSimple(t,r,i,n,a,o,h,u,d,m){this.bullet.set(t,r,i,n,a),this.bullet.isMorph=!1,this.isSimple=!0,this.start(o,h,u,d,m)}setInvisible(){this.isVisible=!1}setTop(t){this.parser=t,this.isTop=!0,this.setInvisible()}rewind(){if(this.bullet.remove(),!this.parser)return;const t=this.parser.createRunner();Lt.registFunctions(t),this.bullet.setRunner(t),this.bullet.resetMorph()}remove(){this.shouldBeRemoved=!0}removeForced(){this.isSimple||this.bullet.remove(),this.exists=!1}toRetro(){!this.isVisible||this.backToRetro||(this.backToRetro=!0,this.rtCnt>=y.RETRO_CNT&&(this.rtCnt=y.RETRO_CNT-.1))}checkShipHit(){let t=this.ppos.x-this.bullet.pos.x,r=this.ppos.y-this.bullet.pos.y;const i=t*t+r*r;if(i<=1e-5)return;const n=this.ship.pos.x-this.bullet.pos.x,a=this.ship.pos.y-this.bullet.pos.y,o=t*n+r*a;if(o<0||o>i)return;const h=n*n+a*a-o*o/i;h>=0&&h<=y.SHIP_HIT_WIDTH&&this.ship.destroyed()}move(){if(this.ppos.x=this.bullet.pos.x,this.ppos.y=this.bullet.pos.y,this.isSimple||(this.bullet.move(),this.isTop&&this.bullet.isEnd()&&this.rewind()),this.shouldBeRemoved){this.removeForced();return}let t;if(this.rtCnt<y.RETRO_CNT){if(t=this.bullet.speedRank*(.3+this.rtCnt/y.RETRO_CNT*.7),this.backToRetro){if(this.rtCnt-=t,this.rtCnt<=0){this.removeForced();return}}else this.rtCnt+=t;if(this.ship.cnt<-228/2&&this.isVisible&&this.rtCnt>=y.RETRO_CNT){this.removeForced();return}}else t=this.bullet.speedRank,this.cnt>y.BULLET_DISAPPEAR_CNT&&this.toRetro();this.bullet.pos.x+=(Math.sin(this.bullet.deg)*this.bullet.speed+this.bullet.acc.x)*t*this.bullet.xReverse,this.bullet.pos.y+=(Math.cos(this.bullet.deg)*this.bullet.speed-this.bullet.acc.y)*t,this.isVisible&&(y.totalBulletsSpeed+=this.bullet.speed*t,this.rtCnt>y.RETRO_CNT&&this.checkShipHit(),this.checkFieldHit(this.bullet.pos,y.FIELD_SPACE)&&this.removeForced()),this.cnt++}checkFieldHit(t,r){const i=this.field;return typeof i.checkHit=="function"?i.checkHit(t,r):t.x<-i.size.x+r||t.x>i.size.x-r||t.y<-i.size.y+r||t.y>i.size.y-r}drawRetro(t){const r=1-this.rtCnt/y.RETRO_CNT;w.setRetroParam(r,.4*this.bullet.bulletSize);const i=y.bulletColor[this.clampColor(this.bullet.color)];w.setRetroColor(i[0],i[1],i[2],1);let n=0,a=0,o=0,h=0;const u=y.shapePos[this.clampShape(this.bullet.shape)];for(let d=0;d<u.length;d++){const m=n,b=a,g=u[d][0]*this.bullet.bulletSize;a=u[d][1]*this.bullet.bulletSize,n=g*Math.cos(t)-a*Math.sin(t),a=g*Math.sin(t)+a*Math.cos(t),d>0?w.drawLineRetro(m,b,n,a):(o=n,h=a)}w.drawLineRetro(n,a,o,h)}draw(){if(!this.isVisible)return;let t=0;switch(this.bullet.shape){case 0:case 2:case 5:t=-this.bullet.deg*this.bullet.xReverse;break;case 1:t=this.cnt*.14;break;case 3:t=this.cnt*.23;break;case 4:t=this.cnt*.33;break;case 6:t=this.cnt*.08;break;default:t=-this.bullet.deg*this.bullet.xReverse;break}if(l.glPushMatrix(),l.glTranslatef(this.bullet.pos.x,this.bullet.pos.y,0),this.rtCnt>=y.RETRO_CNT&&y.displayList){const r=this.clampColor(this.bullet.color)*(y.BULLET_SHAPE_NUM+1);y.displayList.call(r),l.glRotatef(Oe(t),0,0,1),l.glScalef(this.bullet.bulletSize,this.bullet.bulletSize,1),y.displayList.call(r+1+this.clampShape(this.bullet.shape))}else this.drawRetro(t);l.glPopMatrix()}clampShape(t){return t<0?0:t>=y.BULLET_SHAPE_NUM?y.BULLET_SHAPE_NUM-1:t}clampColor(t){return t<0?0:t>=y.BULLET_COLOR_NUM?y.BULLET_COLOR_NUM-1:t}static createDisplayLists(){y.deleteDisplayLists();const t=y.BULLET_COLOR_NUM*(y.BULLET_SHAPE_NUM+1),r=new Jt(t);let i=0,n=!1;for(let a=0;a<y.BULLET_COLOR_NUM;a++){let o=y.bulletColor[a][0],h=y.bulletColor[a][1],u=y.bulletColor[a][2];o+=(1-o)*.5,h+=(1-h)*.5,u+=(1-u)*.5;for(let d=0;d<y.BULLET_SHAPE_NUM+1;d++)n?r.nextNewList():(r.beginNewList(),n=!0),l.setColor(o,h,u,1),y.drawDisplayListShape(d,o,h,u),i++}n&&i>0&&r.endNewList(),y.displayList=r}static drawDisplayListShape(t,r,i,n){let o=0,h=0;switch(t){case 0:l.glBegin(l.GL_TRIANGLE_FAN),l.glVertex3f(-.1,-.1,0),l.glVertex3f(y.SHAPE_POINT_SIZE,-.1,0),l.glVertex3f(y.SHAPE_POINT_SIZE,y.SHAPE_POINT_SIZE,0),l.glVertex3f(-.1,y.SHAPE_POINT_SIZE,0),l.glEnd();break;case 1:o=1/2,l.glDisable(l.GL_BLEND),l.glBegin(l.GL_LINE_LOOP),l.glVertex3f(-o,-o,0),l.glVertex3f(o,-o,0),l.glVertex3f(0,1,0),l.glEnd(),l.glEnable(l.GL_BLEND),l.setColor(r,i,n,.55),l.glBegin(l.GL_TRIANGLE_FAN),l.glVertex3f(-o,-o,0),l.glVertex3f(o,-o,0),l.setColor(y.SHAPE_BASE_COLOR_R,y.SHAPE_BASE_COLOR_G,y.SHAPE_BASE_COLOR_B,.55),l.glVertex3f(0,1,0),l.glEnd();break;case 2:o=1/2,l.glDisable(l.GL_BLEND),l.glBegin(l.GL_LINE_LOOP),l.glVertex3f(0,-1,0),l.glVertex3f(o,0,0),l.glVertex3f(0,1,0),l.glVertex3f(-o,0,0),l.glEnd(),l.glEnable(l.GL_BLEND),l.setColor(r,i,n,.7),l.glBegin(l.GL_TRIANGLE_FAN),l.glVertex3f(0,-1,0),l.glVertex3f(o,0,0),l.setColor(y.SHAPE_BASE_COLOR_R,y.SHAPE_BASE_COLOR_G,y.SHAPE_BASE_COLOR_B,.55),l.glVertex3f(0,1,0),l.glVertex3f(-o,0,0),l.glEnd();break;case 3:o=1/4,h=1/3*2,l.glDisable(l.GL_BLEND),l.glBegin(l.GL_LINE_LOOP),l.glVertex3f(-o,-h,0),l.glVertex3f(o,-h,0),l.glVertex3f(o,h,0),l.glVertex3f(-o,h,0),l.glEnd(),l.glEnable(l.GL_BLEND),l.setColor(r,i,n,.45),l.glBegin(l.GL_TRIANGLE_FAN),l.glVertex3f(-o,-h,0),l.glVertex3f(o,-h,0),l.setColor(y.SHAPE_BASE_COLOR_R,y.SHAPE_BASE_COLOR_G,y.SHAPE_BASE_COLOR_B,.55),l.glVertex3f(o,h,0),l.glVertex3f(-o,h,0),l.glEnd();break;case 4:o=1/2,l.glDisable(l.GL_BLEND),l.glBegin(l.GL_LINE_LOOP),l.glVertex3f(-o,-o,0),l.glVertex3f(o,-o,0),l.glVertex3f(o,o,0),l.glVertex3f(-o,o,0),l.glEnd(),l.glEnable(l.GL_BLEND),l.setColor(r,i,n,.7),l.glBegin(l.GL_TRIANGLE_FAN),l.glVertex3f(-o,-o,0),l.glVertex3f(o,-o,0),l.setColor(y.SHAPE_BASE_COLOR_R,y.SHAPE_BASE_COLOR_G,y.SHAPE_BASE_COLOR_B,.55),l.glVertex3f(o,o,0),l.glVertex3f(-o,o,0),l.glEnd();break;case 5:o=1/2,l.glDisable(l.GL_BLEND),l.glBegin(l.GL_LINE_LOOP),l.glVertex3f(-o/2,-o,0),l.glVertex3f(o/2,-o,0),l.glVertex3f(o,-o/2,0),l.glVertex3f(o,o/2,0),l.glVertex3f(o/2,o,0),l.glVertex3f(-o/2,o,0),l.glVertex3f(-o,o/2,0),l.glVertex3f(-o,-o/2,0),l.glEnd(),l.glEnable(l.GL_BLEND),l.setColor(r,i,n,.85),l.glBegin(l.GL_TRIANGLE_FAN),l.glVertex3f(-o/2,-o,0),l.glVertex3f(o/2,-o,0),l.glVertex3f(o,-o/2,0),l.glVertex3f(o,o/2,0),l.setColor(y.SHAPE_BASE_COLOR_R,y.SHAPE_BASE_COLOR_G,y.SHAPE_BASE_COLOR_B,.55),l.glVertex3f(o/2,o,0),l.glVertex3f(-o/2,o,0),l.glVertex3f(-o,o/2,0),l.glVertex3f(-o,-o/2,0),l.glEnd();break;case 6:o=2/3,h=1/5,l.glDisable(l.GL_BLEND),l.glBegin(l.GL_LINE_STRIP),l.glVertex3f(-o,-o+h,0),l.glVertex3f(0,o+h,0),l.glVertex3f(o,-o+h,0),l.glEnd(),l.glEnable(l.GL_BLEND),l.setColor(r,i,n,.55),l.glBegin(l.GL_TRIANGLE_FAN),l.glVertex3f(-o,-o+h,0),l.glVertex3f(o,-o+h,0),l.setColor(y.SHAPE_BASE_COLOR_R,y.SHAPE_BASE_COLOR_G,y.SHAPE_BASE_COLOR_B,.55),l.glVertex3f(0,o+h,0),l.glEnd();break;case 7:o=1/2,l.glDisable(l.GL_BLEND),l.glBegin(l.GL_LINE_LOOP),l.glVertex3f(-o,-o,0),l.glVertex3f(0,-o,0),l.glVertex3f(o,0,0),l.glVertex3f(o,o,0),l.glVertex3f(0,o,0),l.glVertex3f(-o,0,0),l.glEnd(),l.glEnable(l.GL_BLEND),l.setColor(r,i,n,.85),l.glBegin(l.GL_TRIANGLE_FAN),l.glVertex3f(-o,-o,0),l.glVertex3f(0,-o,0),l.glVertex3f(o,0,0),l.setColor(y.SHAPE_BASE_COLOR_R,y.SHAPE_BASE_COLOR_G,y.SHAPE_BASE_COLOR_B,.55),l.glVertex3f(o,o,0),l.glVertex3f(0,o,0),l.glVertex3f(-o,0,0),l.glEnd();break}}static deleteDisplayLists(){y.displayList&&(y.displayList.close(),y.displayList=null)}};s(y,"totalBulletsSpeed",0),s(y,"BULLET_SHAPE_NUM",7),s(y,"BULLET_COLOR_NUM",4),s(y,"FIELD_SPACE",.5),s(y,"BULLET_DISAPPEAR_CNT",180),s(y,"nextId",0),s(y,"displayList",null),s(y,"SHIP_HIT_WIDTH",.2),s(y,"RETRO_CNT",24),s(y,"SHAPE_POINT_SIZE",.1),s(y,"SHAPE_BASE_COLOR_R",1),s(y,"SHAPE_BASE_COLOR_G",.9),s(y,"SHAPE_BASE_COLOR_B",.7),s(y,"bulletColor",[[1,0,0],[.2,1,.4],[.3,.3,1],[1,1,0]]),s(y,"shapePos",[[[-.5,-.5],[.5,-.5],[0,1]],[[0,-1],[.5,0],[0,1],[-.5,0]],[[-.25,-.66],[.25,-.66],[.25,.66],[-.25,.66]],[[-.5,-.5],[.5,-.5],[.5,.5],[-.5,.5]],[[-.25,-.5],[.25,-.5],[.5,-.25],[.5,.25],[.25,.5],[-.25,.5],[-.5,.25],[-.5,-.25]],[[-.66,-.46],[0,.86],[.66,-.46]],[[-.5,-.5],[0,-.5],[.5,0],[.5,.5],[0,.5],[-.5,0]]]);let ct=y;class Fe{constructor(e,t){this.field=e,this.ship=t}}function st(c){return c<0?Math.ceil(c):Math.floor(c)}class Ye{constructor(){s(this,"parser",null);s(this,"morphParser");s(this,"morphNum",0);s(this,"morphCnt",0);s(this,"rank",0);s(this,"speedRank",0);s(this,"morphRank",0);s(this,"shape",0);s(this,"color",0);s(this,"bulletSize",0);s(this,"xReverse",1);this.morphParser=Array.from({length:Qt.MORPH_MAX},()=>null)}}const bt=class bt{constructor(){s(this,"wingShapePos");s(this,"collisionPos");s(this,"collisionSize");s(this,"batteryPos");s(this,"batteryNum",0);s(this,"r",0);s(this,"g",0);s(this,"b",0);s(this,"barrage");s(this,"xReverseAlternate",!1);s(this,"shield",0);this.barrage=Array.from({length:bt.BARRAGE_PATTERN_MAX},()=>new Ye),this.wingShapePos=Array.from({length:bt.WING_SHAPE_POINT_NUM},()=>new T),this.collisionPos=new T,this.collisionSize=new T,this.batteryPos=Array.from({length:bt.WING_BATTERY_MAX},()=>new T)}};s(bt,"WING_SHAPE_POINT_NUM",3),s(bt,"WING_BATTERY_MAX",3),s(bt,"BARRAGE_PATTERN_MAX",8);let Xt=bt;const f=class f{constructor(){s(this,"barrage");s(this,"bodyShapePos");s(this,"collisionSize");s(this,"wingCollision",!1);s(this,"r",0);s(this,"g",0);s(this,"b",0);s(this,"retroSize",0);s(this,"batteryType");s(this,"batteryNum",0);s(this,"shield",0);s(this,"fireInterval",0);s(this,"firePeriod",0);s(this,"barragePatternNum",0);s(this,"id");s(this,"type",f.SMALL);s(this,"er",1);s(this,"eg",1);s(this,"eb",1);s(this,"ect",0);if(this.bodyShapePos=Array.from({length:f.BODY_SHAPE_POINT_NUM},()=>new T),this.collisionSize=new T,this.barrage=Array.from({length:f.BARRAGE_PATTERN_MAX},()=>new Ye),this.batteryType=Array.from({length:f.BATTERY_MAX},()=>new Xt),f.idCnt>=f.ENEMY_TYPE_MAX)throw new Error("EnemyType id overflow");this.id=f.idCnt,f.idCnt++}static init(e){f.rand=new it,f.barrageManager=e,f.idCnt=0,f.usedMorphParser=Array.from({length:e.BARRAGE_MAX},()=>!1)}static clearIsExistList(){for(let e=0;e<f.idCnt;e++)f.isExist[e]=!1}static requireRand(){if(!f.rand)throw new Error("EnemyType.init() must be called before creating enemy types.");return f.rand}static requireBarrageManager(){if(!f.barrageManager)throw new Error("EnemyType.init() must be called before creating enemy types.");return f.barrageManager}getParser(e,t){var n;const i=((n=f.requireBarrageManager().parser[e])==null?void 0:n[t])??null;if(!i)throw new Error(`Missing barrage parser type=${e} idx=${t}`);return i}setBarrageType(e,t,r){const i=f.requireRand(),n=f.requireBarrageManager();e.parser=this.getParser(t,i.nextInt(n.parserNum[t])),f.usedMorphParser.fill(!1);const a=r===f.ROLL?n.parserNum[F.MORPH]:n.parserNum[F.MORPH_LOCK];for(let o=0;o<e.morphParser.length;o++){let h=i.nextInt(a);for(let u=0;u<a&&f.usedMorphParser[h];u++)h++,h>=a&&(h=0);e.morphParser[o]=r===f.ROLL?this.getParser(F.MORPH,h):this.getParser(F.MORPH_LOCK,h),f.usedMorphParser[h]=!0}e.morphNum=e.morphParser.length}setBarrageRank(e,t,r,i){const n=f.requireRand();if(t<=0){e.rank=0;return}for(e.rank=Math.sqrt(t)/(8-n.nextInt(3)),e.rank>.8&&(e.rank=n.nextFloat(.2)+.8),t/=e.rank+2,r===f.WEAK&&(e.rank/=2),i===f.ROLL?e.speedRank=Math.sqrt(t)*(n.nextFloat(.2)+1):e.speedRank=Math.sqrt(t*.66)*(n.nextFloat(.2)+.8),e.speedRank<1&&(e.speedRank=1),e.speedRank>2&&(e.speedRank=Math.sqrt(e.speedRank)+.27),e.morphRank=t/e.speedRank,e.morphCnt=0;e.morphRank>1;)e.morphCnt++,e.morphRank/=3;r===f.VERYWEAK?(e.morphRank/=2,e.morphCnt=st(e.morphCnt/1.7)):r===f.MORPHWEAK?e.morphRank/=2:r===f.WEAK&&(e.morphRank/=1.5)}setBarrageRankSlow(e,t,r,i,n){this.setBarrageRank(e,t,r,i),e.speedRank*=n}setBarrageShape(e,t){const r=f.requireRand();e.shape=r.nextInt(f.BULLET_SHAPE_NUM),e.color=r.nextInt(f.BULLET_COLOR_NUM),e.bulletSize=(1+r.nextSignedFloat(.1))*t}setEnemyColorType(){const e=f.requireRand();this.ect=e.nextInt(3)}createEnemyColor(){const e=f.requireRand();switch(this.ect){case 0:this.er=1,this.eg=e.nextFloat(.7)+.3,this.eb=e.nextFloat(.7)+.3;break;case 1:this.er=e.nextFloat(.7)+.3,this.eg=1,this.eb=e.nextFloat(.7)+.3;break;case 2:this.er=e.nextFloat(.7)+.3,this.eg=e.nextFloat(.7)+.3,this.eb=1;break}}setEnemyShapeAndWings(e){const t=f.requireRand();this.createEnemyColor(),this.r=this.er,this.g=this.eg,this.b=this.eb;const r=f.enemySize[e][0]+t.nextSignedFloat(f.enemySize[e][1]),i=f.enemySize[e][2]+t.nextSignedFloat(f.enemySize[e][3]),n=f.enemySize[e][0]+t.nextSignedFloat(f.enemySize[e][1]),a=f.enemySize[e][2]+t.nextSignedFloat(f.enemySize[e][3]);switch(this.bodyShapePos[0].x=-r,this.bodyShapePos[0].y=i,this.bodyShapePos[1].x=r,this.bodyShapePos[1].y=i,this.bodyShapePos[2].x=n,this.bodyShapePos[2].y=-a,this.bodyShapePos[3].x=-n,this.bodyShapePos[3].y=-a,this.retroSize=f.enemySize[e][4],e){case f.SMALL:case f.MIDDLE:case f.MIDDLEBOSS:this.batteryNum=2;break;case f.LARGE:case f.LARGEBOSS:this.batteryNum=4;break}let o=0,h=0,u=0,d=0,m=0;this.collisionSize.x=r>n?r:n,this.collisionSize.y=i>a?i:a;for(let b=0;b<this.batteryNum;b++){const g=this.batteryType[b];let L=1;if(b%2===0){o=f.enemySize[e][5]+t.nextFloat(f.enemySize[e][6]),this.batteryNum<=2?h=t.nextSignedFloat(f.enemySize[e][7]):b<2?h=t.nextFloat(f.enemySize[e][7]/2)+f.enemySize[e][7]/2:h=-t.nextFloat(f.enemySize[e][7]/2)-f.enemySize[e][7]/2;let N=0;switch(t.nextInt(2)===0?N=t.nextFloat(Math.PI/2)-Math.PI/4:N=t.nextFloat(Math.PI/2)+Math.PI/4*3,u=o/2+Math.sin(N)*(f.enemySize[e][8]/2+t.nextFloat(f.enemySize[e][8]/2)),d=h/2+Math.cos(N)*(f.enemySize[e][8]/2+t.nextFloat(f.enemySize[e][8]/2)),e){case f.SMALL:case f.MIDDLE:case f.LARGE:m=1;break;case f.MIDDLEBOSS:m=150+t.nextInt(30);break;case f.LARGEBOSS:m=200+t.nextInt(50);break}if(this.createEnemyColor(),L=-1,!this.wingCollision){o>this.collisionSize.x&&(this.collisionSize.x=o);let O=Math.abs(h);O>this.collisionSize.y&&(this.collisionSize.y=O),O=Math.abs(d),O>this.collisionSize.y&&(this.collisionSize.y=O)}}g.wingShapePos[0].x=o/4*L,g.wingShapePos[0].y=h/4,g.wingShapePos[1].x=o*L,g.wingShapePos[1].y=h,g.wingShapePos[2].x=u*L,g.wingShapePos[2].y=d,g.collisionPos.x=(o+o/4)/2*L,g.collisionPos.y=(h+d+h/4)/3,g.collisionSize.x=o/4*3/2*1;const S=Math.abs(h-d)/2,v=Math.abs(h-h/4)/2;g.collisionSize.y=S>v?S:v,g.r=this.er,g.g=this.eg,g.b=this.eb,g.shield=m}}setBattery(e,t,r,i,n,a,o,h){const u=f.requireRand(),d=this.batteryType[n],m=this.batteryType[n+1],b=d.barrage[a],g=m.barrage[a];this.setBarrageType(b,r,h),this.setBarrageRankSlow(b,e/t,i,h,o),this.setBarrageShape(b,.8),b.xReverse=u.nextInt(2)*2-1,g.parser=b.parser;for(let O=0;O<Qt.MORPH_MAX;O++)g.morphParser[O]=b.morphParser[O];g.morphNum=b.morphNum,g.morphCnt=b.morphCnt,g.rank=b.rank,g.speedRank=b.speedRank,g.morphRank=b.morphRank,g.shape=b.shape,g.color=b.color,g.bulletSize=b.bulletSize,g.xReverse=-b.xReverse,u.nextInt(4)===0?(d.xReverseAlternate=!0,m.xReverseAlternate=!0):(d.xReverseAlternate=!1,m.xReverseAlternate=!1);let L=d.wingShapePos[1].x,S=d.wingShapePos[1].y;const v=d.wingShapePos[2].x,N=d.wingShapePos[2].y;for(let O=0;O<t;O++)d.batteryPos[O].x=L,d.batteryPos[O].y=S,m.batteryPos[O].x=-L,m.batteryPos[O].y=S,L+=(v-L)/(t-1),S+=(N-S)/(t-1);d.batteryNum=t,m.batteryNum=t}setSmallEnemyType(e,t){const r=f.requireRand();this.type=f.SMALL,this.barragePatternNum=1,this.wingCollision=!1,this.setEnemyColorType();const i=this.barrage[0];t===f.ROLL?this.setBarrageType(i,F.SMALL,t):this.setBarrageType(i,F.SMALL_LOCK,t),this.setBarrageRank(i,e,f.VERYWEAK,t),this.setBarrageShape(i,.7),i.xReverse=r.nextInt(2)*2-1,this.setEnemyShapeAndWings(f.SMALL),this.setBattery(0,0,0,f.NORMAL,0,0,1,t),this.shield=1,this.fireInterval=99999,this.firePeriod=150+r.nextInt(40),e<10&&(this.firePeriod=st(this.firePeriod/(2-e*.1)))}setMiddleEnemyType(e,t){const r=f.requireRand();this.type=f.MIDDLE,this.barragePatternNum=1,this.wingCollision=!1,this.setEnemyColorType();const i=this.barrage[0];this.setBarrageType(i,F.MIDDLE,t);let n=0,a=0;if(t===f.ROLL)switch(r.nextInt(6)){case 0:case 1:n=e/3*2,a=0;break;case 2:n=e/4,a=e/4;break;case 3:case 4:case 5:n=0,a=e/2;break}else switch(r.nextInt(6)){case 0:case 1:n=e/5,a=e/4;break;case 2:case 3:case 4:case 5:n=0,a=e/2;break}this.setBarrageRank(i,n,f.MORPHWEAK,t),this.setBarrageShape(i,.75),i.xReverse=r.nextInt(2)*2-1,this.setEnemyShapeAndWings(f.MIDDLE),t===f.ROLL?(this.shield=40+r.nextInt(10),this.setBattery(a,1,F.MIDDLESUB,f.NORMAL,0,0,1,t),this.fireInterval=100+r.nextInt(60),this.firePeriod=st(this.fireInterval/(1.8+r.nextFloat(.7)))):(this.shield=30+r.nextInt(8),this.setBattery(a,1,F.MIDDLESUB_LOCK,f.NORMAL,0,0,1,t),this.fireInterval=72+r.nextInt(30),this.firePeriod=st(this.fireInterval/(1.2+r.nextFloat(.2)))),e<10&&(this.firePeriod=st(this.firePeriod/(2-e*.1)))}setLargeEnemyType(e,t){const r=f.requireRand();this.type=f.LARGE,this.barragePatternNum=1,this.wingCollision=!1,this.setEnemyColorType();const i=this.barrage[0];this.setBarrageType(i,F.LARGE,t);let n=0,a=0,o=0;if(t===f.ROLL)switch(r.nextInt(9)){case 0:case 1:case 2:case 3:n=e,a=0,o=0;break;case 4:n=e/3*2,a=e/3*2,o=0;break;case 5:n=e/3*2,a=0,o=e/3*2;break;case 6:case 7:case 8:n=0,a=e/3*2,o=e/3*2;break}else switch(r.nextInt(9)){case 0:n=e/4*3,a=0,o=0;break;case 1:case 2:n=e/4*2,a=e/3*2,o=0;break;case 3:case 4:n=e/4*2,a=0,o=e/3*2;break;case 5:case 6:case 7:case 8:n=0,a=e/3*2,o=e/3*2;break}this.setBarrageRank(i,n,f.WEAK,t),this.setBarrageShape(i,.8),i.xReverse=r.nextInt(2)*2-1,this.setEnemyShapeAndWings(f.LARGE),t===f.ROLL?(this.shield=60+r.nextInt(10),this.setBattery(a,1,F.MIDDLESUB,f.NORMAL,0,0,1,t),this.setBattery(o,1,F.MIDDLESUB,f.NORMAL,2,0,1,t),this.fireInterval=150+r.nextInt(60),this.firePeriod=st(this.fireInterval/(1.3+r.nextFloat(.8)))):(this.shield=45+r.nextInt(8),this.setBattery(a,1,F.MIDDLESUB_LOCK,f.NORMAL,0,0,1,t),this.setBattery(o,1,F.MIDDLESUB_LOCK,f.NORMAL,2,0,1,t),this.fireInterval=100+r.nextInt(50),this.firePeriod=st(this.fireInterval/(1.2+r.nextFloat(.2)))),e<10&&(this.firePeriod=st(this.firePeriod/(2-e*.1)))}setMiddleBossEnemyType(e,t){const r=f.requireRand();this.type=f.MIDDLEBOSS,this.barragePatternNum=2+r.nextInt(2),this.wingCollision=!0,this.setEnemyColorType();const i=1+r.nextInt(2);for(let n=0;n<this.barragePatternNum;n++){const a=this.barrage[n];this.setBarrageType(a,F.LARGE,t);let o=0,h=0;switch(r.nextInt(3)){case 0:o=e,h=0;break;case 1:o=e/3,h=e/3;break;case 2:o=0,h=e;break}this.setBarrageRankSlow(a,o,f.NORMAL,t,.9),this.setBarrageShape(a,.9),a.xReverse=r.nextInt(2)*2-1,this.setEnemyShapeAndWings(f.MIDDLEBOSS),this.setBattery(h,i,F.MIDDLE,f.WEAK,0,n,.9,t)}this.shield=300+r.nextInt(50),this.fireInterval=200+r.nextInt(40),this.firePeriod=st(this.fireInterval/(1.2+r.nextFloat(.4))),e<10&&(this.firePeriod=st(this.firePeriod/(2-e*.1)))}setLargeBossEnemyType(e,t){const r=f.requireRand();this.type=f.LARGEBOSS,this.barragePatternNum=2+r.nextInt(3),this.wingCollision=!0,this.setEnemyColorType();const i=1+r.nextInt(3),n=1+r.nextInt(3);for(let a=0;a<this.barragePatternNum;a++){const o=this.barrage[a];this.setBarrageType(o,F.LARGE,t);let h=0,u=0,d=0;switch(r.nextInt(3)){case 0:h=e,u=0,d=0;break;case 1:h=e/3,u=e/3,d=0;break;case 2:h=e/3,u=0,d=e/3;break}this.setBarrageRankSlow(o,h,f.NORMAL,t,.9),this.setBarrageShape(o,1),o.xReverse=r.nextInt(2)*2-1,this.setEnemyShapeAndWings(f.LARGEBOSS),this.setBattery(u,i,F.MIDDLE,f.NORMAL,0,a,.9,t),this.setBattery(d,n,F.MIDDLE,f.NORMAL,2,a,.9,t)}this.shield=400+r.nextInt(50),this.fireInterval=220+r.nextInt(60),this.firePeriod=st(this.fireInterval/(1.2+r.nextFloat(.3))),e<10&&(this.firePeriod=st(this.firePeriod/(2-e*.1)))}};s(f,"BARRAGE_PATTERN_MAX",Xt.BARRAGE_PATTERN_MAX),s(f,"BODY_SHAPE_POINT_NUM",4),s(f,"BATTERY_MAX",4),s(f,"ENEMY_TYPE_MAX",32),s(f,"BULLET_SHAPE_NUM",7),s(f,"BULLET_COLOR_NUM",4),s(f,"SMALL",0),s(f,"MIDDLE",1),s(f,"LARGE",2),s(f,"MIDDLEBOSS",3),s(f,"LARGEBOSS",4),s(f,"ROLL",0),s(f,"LOCK",1),s(f,"isExist",Array.from({length:f.ENEMY_TYPE_MAX},()=>!1)),s(f,"rand",null),s(f,"barrageManager",null),s(f,"idCnt",0),s(f,"usedMorphParser",[]),s(f,"NORMAL",0),s(f,"WEAK",1),s(f,"VERYWEAK",2),s(f,"MORPHWEAK",3),s(f,"enemySize",[[.3,.3,.3,.1,.1,1,.4,.6,.9],[.4,.2,.4,.1,.15,2.2,.2,1.6,1],[.6,.3,.5,.1,.2,3,.3,1.4,1.2],[.9,.3,.7,.2,.25,5,.6,3,1.5],[1.2,.2,.9,.1,.3,7,.8,4.5,1.5]]);let j=f;const R=class R extends yt{constructor(){super(...arguments);s(this,"state",R.SEARCH);s(this,"pos",Array.from({length:R.LENGTH},()=>new T));s(this,"cnt",0);s(this,"lockMinY",0);s(this,"lockedEnemy");s(this,"lockedPart",-1);s(this,"lockedPos",new T);s(this,"released",!1);s(this,"vel",new T);s(this,"ship");s(this,"field");s(this,"manager")}static init(){R.rand=new it}init(t){const r=Array.isArray(t)?t[0]:t;if(!(r instanceof Ge))throw new Error("Lock.init requires LockInitializer");this.ship=r.ship,this.field=r.field,this.manager=r.manager,this.pos=Array.from({length:R.LENGTH},()=>new T),this.vel=new T,this.lockedPos=new T}reset(){for(let t=0;t<R.LENGTH;t++)this.pos[t].x=this.ship.pos.x,this.pos[t].y=this.ship.pos.y;this.vel.x=R.rand.nextSignedFloat(1.5),this.vel.y=-2,this.cnt=0}set(){this.reset(),this.state=R.SEARCH,this.lockMinY=this.field.size.y*2,this.released=!1,this.exists=!0}hit(){this.state=R.HIT,this.cnt=0}move(){var t,r;if(this.state===R.SEARCH){this.exists=!1;return}else this.state===R.SEARCHED&&(this.state=R.LOCKING,P.playSe(P.LOCK));switch(this.state!==R.HIT&&this.state!==R.CANCELED&&(this.lockedPart<0?(this.lockedPos.x=this.lockedEnemy.pos.x,this.lockedPos.y=this.lockedEnemy.pos.y):(this.lockedPos.x=this.lockedEnemy.pos.x+this.lockedEnemy.type.batteryType[this.lockedPart].collisionPos.x,this.lockedPos.y=this.lockedEnemy.pos.y+this.lockedEnemy.type.batteryType[this.lockedPart].collisionPos.y)),this.state){case R.LOCKING:this.cnt>=R.LOCK_CNT&&(this.state=R.LOCKED,P.playSe(P.LASER),this.cnt=0);break;case R.LOCKED:this.cnt>=R.NO_COLLISION_CNT&&(this.state=R.FIRED);case R.FIRED:case R.CANCELED:this.state!==R.CANCELED?(!this.lockedEnemy.exists||this.lockedEnemy.shield<=0||this.lockedPart>=0&&this.lockedEnemy.battery[this.lockedPart].shield<=0?this.state=R.CANCELED:(this.vel.x+=(this.lockedPos.x-this.pos[0].x)*R.SPEED,this.vel.y+=(this.lockedPos.y-this.pos[0].y)*R.SPEED),this.vel.x*=.9,this.vel.y*=.9,this.pos[0].x+=(this.lockedPos.x-this.pos[0].x)*.002*this.cnt,this.pos[0].y+=(this.lockedPos.y-this.pos[0].y)*.002*this.cnt):this.vel.y+=(this.field.size.y*2-this.pos[0].y)*R.SPEED;for(let i=R.LENGTH-1;i>0;i--)this.pos[i].x=this.pos[i-1].x,this.pos[i].y=this.pos[i-1].y;if(this.pos[0].x+=this.vel.x,this.pos[0].y+=this.vel.y,this.pos[0].y>this.field.size.y+5){if(this.state===R.CANCELED){this.exists=!1;return}this.state=R.LOCKED,P.playSe(P.LASER),this.reset()}{const i=Math.atan2(this.pos[1].x-this.pos[0].x,this.pos[1].y-this.pos[0].y);(r=(t=this.manager).addParticle)==null||r.call(t,this.pos[0],i,0,R.SPEED*32)}break;case R.HIT:for(let i=1;i<R.LENGTH;i++)this.pos[i].x=this.pos[i-1].x,this.pos[i].y=this.pos[i-1].y;if(this.cnt>5)if(!this.released)this.state=R.LOCKED,P.playSe(P.LASER),this.reset();else{this.exists=!1;return}break}this.cnt++}draw(){switch(this.state){case R.LOCKING:{const t=this.lockedPos.y-(R.LOCK_CNT-this.cnt)*.5;let r=(R.LOCK_CNT-this.cnt)*.1;const i=(R.LOCK_CNT-this.cnt)*.5+.8;w.setRetroParam((R.LOCK_CNT-this.cnt)/R.LOCK_CNT,.2);for(let n=0;n<3;n++,r+=Math.PI*2/3)w.drawBoxRetro(this.lockedPos.x+Math.sin(r)*i,t+Math.cos(r)*i,.2,1,r+Math.PI/2);break}case R.LOCKED:case R.FIRED:case R.CANCELED:case R.HIT:{let t=0,r=.8;w.setRetroParam(0,.2);for(let i=0;i<3;i++,t+=Math.PI*2/3)w.drawBoxRetro(this.lockedPos.x+Math.sin(t)*r,this.lockedPos.y+Math.cos(t)*r,.2,1,t+Math.PI/2);r=this.cnt*.1;for(let i=0;i<R.LENGTH-1;i++,r-=.1){let n=r;n<0?n=0:n>1&&(n=1),w.setRetroParam(n,.33),w.drawLineRetro(this.pos[i].x,this.pos[i].y,this.pos[i+1].x,this.pos[i+1].y)}break}}}};s(R,"SEARCH",0),s(R,"SEARCHED",1),s(R,"LOCKING",2),s(R,"LOCKED",3),s(R,"FIRED",4),s(R,"HIT",5),s(R,"CANCELED",6),s(R,"LENGTH",12),s(R,"NO_COLLISION_CNT",8),s(R,"SPEED",.01),s(R,"LOCK_CNT",8),s(R,"rand",new it);let Pt=R;class Ge{constructor(e,t,r){s(this,"ship");s(this,"field");s(this,"manager");this.ship=e,this.field=t,this.manager=r}}const Y=class Y extends yt{constructor(){super(...arguments);s(this,"released",!1);s(this,"pos",Array.from({length:Y.LENGTH},()=>new T));s(this,"cnt",0);s(this,"vel",Array.from({length:Y.LENGTH},()=>new T));s(this,"ship");s(this,"field");s(this,"manager");s(this,"dist",0)}init(t){const r=Array.isArray(t)?t[0]:t;if(!(r instanceof Ue))throw new Error("Roll.init requires RollInitializer");this.ship=r.ship,this.field=r.field,this.manager=r.manager,this.pos=Array.from({length:Y.LENGTH},()=>new T),this.vel=Array.from({length:Y.LENGTH},()=>new T)}set(){for(let t=0;t<Y.LENGTH;t++)this.pos[t].x=this.ship.pos.x,this.pos[t].y=this.ship.pos.y,this.vel[t].x=0,this.vel[t].y=0;this.cnt=0,this.dist=0,this.released=!1,this.exists=!0}move(){var t,r;if(this.released){if(this.pos[0].y+=Y.SPEED,this.pos[0].y>this.field.size.y){this.exists=!1;return}(r=(t=this.manager).addParticle)==null||r.call(t,this.pos[0],Math.PI,Y.BASE_SIZE*Y.LENGTH,Y.SPEED/8)}else this.dist<Y.BASE_DIST&&(this.dist+=Y.BASE_DIST/90),this.pos[0].x=this.ship.pos.x+Math.sin(this.cnt*.1)*this.dist,this.pos[0].y=this.ship.pos.y+Math.cos(this.cnt*.1)*this.dist;for(let i=1;i<Y.LENGTH;i++){this.pos[i].x+=this.vel[i].x,this.pos[i].y+=this.vel[i].y,this.vel[i].x*=Y.BASE_RESISTANCE,this.vel[i].y*=Y.BASE_RESISTANCE;const n=this.pos[i].dist(this.pos[i-1]);if(n<=Y.BASE_LENGTH)continue;const a=(n-Y.BASE_LENGTH)*Y.BASE_SPRING,o=Math.atan2(this.pos[i-1].x-this.pos[i].x,this.pos[i-1].y-this.pos[i].y);this.vel[i].x+=Math.sin(o)*a,this.vel[i].y+=Math.cos(o)*a}this.cnt++}draw(){this.released?w.setRetroParam(1,.2):w.setRetroParam(.5,.2);for(let t=0;t<Y.LENGTH;t++)w.drawBoxRetro(this.pos[t].x,this.pos[t].y,Y.BASE_SIZE*(Y.LENGTH-t),Y.BASE_SIZE*(Y.LENGTH-t),this.cnt*.1)}};s(Y,"LENGTH",4),s(Y,"NO_COLLISION_CNT",45),s(Y,"BASE_LENGTH",1),s(Y,"BASE_RESISTANCE",.8),s(Y,"BASE_SPRING",.2),s(Y,"BASE_SIZE",.2),s(Y,"BASE_DIST",3),s(Y,"SPEED",.75);let It=Y;class Ue{constructor(e,t,r){this.ship=e,this.field=t,this.manager=r}}const lt=class lt extends yt{constructor(){super(...arguments);s(this,"pos",new T);s(this,"field");s(this,"vel",new T);s(this,"deg",0);s(this,"cnt",0)}init(t){const r=Array.isArray(t)?t[0]:t;if(!(r instanceof Ve))throw new Error("Shot.init requires ShotInitializer");this.field=r.field,this.pos=new T,this.vel=new T}set(t,r){this.pos.x=t.x,this.pos.y=t.y,this.deg=r,this.vel.x=Math.sin(this.deg)*lt.SPEED,this.vel.y=Math.cos(this.deg)*lt.SPEED,this.cnt=0,this.exists=!0}move(){this.pos.x+=this.vel.x,this.pos.y+=this.vel.y,this.field.checkHit(this.pos,lt.FIELD_SPACE)&&(this.exists=!1),this.cnt++}draw(){let t;this.cnt>lt.RETRO_CNT?t=1:t=this.cnt/lt.RETRO_CNT,w.setRetroParam(t,.2),w.drawBoxRetro(this.pos.x,this.pos.y,.2,1,this.deg)}};s(lt,"SPEED",1),s(lt,"FIELD_SPACE",1),s(lt,"RETRO_CNT",4);let kt=lt;class Ve{constructor(e){this.field=e}}class Ms{constructor(e){s(this,"topBullet");s(this,"shield",0);s(this,"damaged",!1);this.topBullet=Array.from({length:e},()=>null)}}const E=class E extends yt{constructor(){super();s(this,"pos",new T);s(this,"type");s(this,"battery",[]);s(this,"shield",0);s(this,"field");s(this,"bullets");s(this,"shots");s(this,"rolls");s(this,"locks");s(this,"ship");s(this,"manager");s(this,"cnt",0);s(this,"topBullet",null);s(this,"moveBullet",null);s(this,"movePoint",[]);s(this,"movePointNum",0);s(this,"movePointIdx",0);s(this,"speed",0);s(this,"deg",0);s(this,"onRoute",!1);s(this,"baseDeg",0);s(this,"fireCnt",0);s(this,"barragePatternIdx",0);s(this,"fieldLimitX",0);s(this,"fieldLimitY",0);s(this,"appCnt",0);s(this,"dstCnt",0);s(this,"timeoutCnt",0);s(this,"z",0);s(this,"isBoss",!1);s(this,"vel",new T);s(this,"velCnt",0);s(this,"damaged",!1);s(this,"bossTimer",0);const t=this.getBatteryTypeConst("WING_BATTERY_MAX",3),r=this.getEnemyTypeConst("BATTERY_MAX",4);this.battery=Array.from({length:r},()=>new Ms(t)),this.movePoint=Array.from({length:E.MOVE_POINT_MAX},()=>new T)}init(t){const r=Array.isArray(t)?t[0]:t;if(!(r instanceof $e))throw new Error("Enemy.init requires EnemyInitializer");this.field=r.field,this.bullets=r.bullets,this.shots=r.shots,this.rolls=r.rolls,this.locks=r.locks,this.ship=r.ship,this.manager=r.manager,this.pos=new T,this.movePoint=Array.from({length:E.MOVE_POINT_MAX},()=>new T),this.vel=new T,this.velCnt=0,this.fieldLimitX=this.field.size.x/4*3,this.fieldLimitY=this.field.size.y/4*3}set(t,r,i,n){this.pos.x=t.x,this.pos.y=t.y,this.type=i;const a=n.createRunner();if(this.registFunctions(a),this.moveBullet=this.bullets.addBullet(a,this.pos.x,this.pos.y,r,0,.5,1,0,0,1,1)??null,!!this.moveBullet){this.cnt=0,this.shield=this.type.shield;for(let o=0;o<this.type.batteryNum;o++)this.battery[o].shield=this.type.batteryType[o].shield;this.fireCnt=0,this.barragePatternIdx=0,this.baseDeg=r,this.appCnt=0,this.dstCnt=0,this.timeoutCnt=0,this.z=0,this.isBoss=!1,this.exists=!0}}setBoss(t,r,i){this.pos.x=t.x,this.pos.y=t.y,this.type=i,this.moveBullet=null;const n=E.rand.nextFloat(this.field.size.x/4)+this.field.size.x/4,a=E.rand.nextFloat(this.field.size.y/9)+this.field.size.y/7,o=this.field.size.y/7*4;this.movePointNum=E.rand.nextInt(3)+2;for(let u=0;u<Math.floor(this.movePointNum/2);u++)this.movePoint[u*2].x=E.rand.nextFloat(n/2)+n/2,this.movePoint[u*2+1].x=-this.movePoint[u*2].x,this.movePoint[u*2].y=this.movePoint[u*2+1].y=E.rand.nextSignedFloat(a)+o;this.movePointNum===3&&(this.movePoint[2].x=0,this.movePoint[2].y=E.rand.nextSignedFloat(a)+o);for(let u=0;u<8;u++){const d=E.rand.nextInt(this.movePointNum);let m=E.rand.nextInt(this.movePointNum);d===m&&(m++,m>=this.movePointNum&&(m=0));const b=this.movePoint[d];this.movePoint[d]=this.movePoint[m],this.movePoint[m]=b}this.speed=.03+E.rand.nextFloat(.02),this.movePointIdx=0,this.deg=Math.PI,this.onRoute=!1,this.cnt=0,this.shield=this.type.shield;for(let u=0;u<this.type.batteryNum;u++)this.battery[u].shield=this.type.batteryType[u].shield;const h=this.getEnemyTypeConst("BATTERY_MAX",4);for(let u=this.type.batteryNum;u<h;u++)this.battery[u].shield=0;this.fireCnt=0,this.barragePatternIdx=0,this.baseDeg=r,this.appCnt=E.APPEARANCE_CNT,this.z=E.APPEARANCE_Z,this.dstCnt=0,this.timeoutCnt=0,this.isBoss=!0,this.bossTimer=0,this.exists=!0}setBullet(t,r,i=1){if(t.rank<=0)return null;const n=t.parser.createRunner();this.registFunctions(n);let a=this.pos.x,o=this.pos.y;return r&&(a+=r.x,o+=r.y),t.morphCnt>0?this.bullets.addBullet(t.parser,n,a,o,this.baseDeg,0,t.rank,t.speedRank,t.shape,t.color,t.bulletSize,t.xReverse*i,t.morphParser,t.morphNum,t.morphCnt)??null:this.bullets.addBullet(t.parser,n,a,o,this.baseDeg,0,t.rank,t.speedRank,t.shape,t.color,t.bulletSize,t.xReverse*i)??null}setTopBullets(){this.topBullet=this.setBullet(this.type.barrage[this.barragePatternIdx],null);for(let t=0;t<this.type.batteryNum;t++){const r=this.battery[t];if(r.shield<=0)continue;const i=this.type.batteryType[t];let n=1;for(let a=0;a<i.batteryNum;a++)r.topBullet[a]=this.setBullet(i.barrage[this.barragePatternIdx],i.batteryPos[a],n),i.xReverseAlternate&&(n*=-1)}}addBonuses(t,r){var n,a;const i=Math.floor((r*3/(this.cnt/30+1)*at.rate||0)+.9);(a=(n=this.manager).addBonus)==null||a.call(n,this.pos,t,i)}addBonusesByTypeShield(){this.addBonuses(null,this.type.shield)}addWingFragments(t,r,i,n,a){var u,d;const o=this.getBatteryTypeConst("WING_SHAPE_POINT_NUM",3);let h=1;for(let m=0;m<o;m++,h++)h>=o&&(h=0),(d=(u=this.manager).addFragments)==null||d.call(u,r,this.pos.x+t.wingShapePos[m].x,this.pos.y+t.wingShapePos[m].y,this.pos.x+t.wingShapePos[h].x,this.pos.y+t.wingShapePos[h].y,i,n,a)}addFragments(t,r,i,n){var h,u;const a=this.getEnemyTypeConst("BODY_SHAPE_POINT_NUM",4);let o=1;for(let d=0;d<a;d++,o++)o>=a&&(o=0),(u=(h=this.manager).addFragments)==null||u.call(h,t,this.pos.x+this.type.bodyShapePos[d].x,this.pos.y+this.type.bodyShapePos[d].y,this.pos.x+this.type.bodyShapePos[o].x,this.pos.y+this.type.bodyShapePos[o].y,r,i,n);for(let d=0;d<this.type.batteryNum;d++)this.battery[d].shield>0&&this.addWingFragments(this.type.batteryType[d],t,r,i,n)}addDamage(t){var r,i,n,a,o,h,u;if(this.shield-=t,this.shield<=0)if(this.addBonusesByTypeShield(),(i=(r=this.manager).addScore)==null||i.call(r,this.getEnemyTypeScore(this.type.type)),this.isBoss)this.addFragments(15,0,.1,E.rand.nextSignedFloat(1)),P.playSe(P.BOSS_DESTROYED),(a=(n=this.manager).setScreenShake)==null||a.call(n,20,.05),(h=(o=this.manager).clearBullets)==null||h.call(o),this.removeTopBullets(),this.dstCnt=E.DESTROYED_CNT;else{let d=E.rand.nextSignedFloat(1);this.type.type===this.getEnemyTypeConst("SMALL",0)?(d=((u=this.moveBullet)==null?void 0:u.bullet.deg)??0,P.playSe(P.ENEMY_DESTROYED)):P.playSe(P.LARGE_ENEMY_DESTROYED),this.addFragments(this.type.type*4+2,0,.04,d),this.remove()}this.damaged=!0}removeBattery(t,r){var i;for(let n=0;n<r.batteryNum;n++)t.topBullet[n]&&((i=t.topBullet[n])==null||i.remove(),t.topBullet[n]=null);t.damaged=!0}addDamageBattery(t,r){var i,n,a,o;if(this.battery[t].shield-=r,this.battery[t].shield<=0){const h=this.type.batteryType[t].collisionPos;this.addBonuses(h,this.type.batteryType[t].shield),(n=(i=this.manager).addScore)==null||n.call(i,E.ENEMY_WING_SCORE),this.addWingFragments(this.type.batteryType[t],10,0,.1,E.rand.nextSignedFloat(1)),P.playSe(P.LARGE_ENEMY_DESTROYED),(o=(a=this.manager).setScreenShake)==null||o.call(a,10,.03),this.removeBattery(this.battery[t],this.type.batteryType[t]),this.vel.x=-h.x/10,this.vel.y=-h.y/10,this.velCnt=60,this.removeTopBullets(),this.fireCnt=this.velCnt+10}}checkHit(t,r,i){if(Math.abs(t.x-this.pos.x)<this.type.collisionSize.x+r&&Math.abs(t.y-this.pos.y)<this.type.collisionSize.y+i)return E.HIT;if(this.type.wingCollision)for(let n=0;n<this.type.batteryNum;n++){if(this.battery[n].shield<=0)continue;const a=this.type.batteryType[n];if(Math.abs(t.x-this.pos.x-a.collisionPos.x)<a.collisionSize.x+r&&Math.abs(t.y-this.pos.y-a.collisionPos.y)<a.collisionSize.y+i)return n}return E.NOHIT}checkLocked(t,r,i){if(Math.abs(t.x-this.pos.x)<this.type.collisionSize.x+r&&this.pos.y<i.lockMinY&&this.pos.y>t.y)return i.lockMinY=this.pos.y,E.HIT;if(this.type.wingCollision){let n=E.NOHIT;for(let a=0;a<this.type.batteryNum;a++){if(this.battery[a].shield<=0)continue;const o=this.type.batteryType[a],h=this.pos.y+o.collisionPos.y;Math.abs(t.x-this.pos.x-o.collisionPos.x)<o.collisionSize.x+r&&h<i.lockMinY&&h>t.y&&(i.lockMinY=h,n=a)}if(n!==E.NOHIT)return n}return E.NOHIT}checkDamage(){var r,i,n,a,o,h,u,d,m,b;const t=this.getShotSpeed();for(let g=0;g<this.shots.actor.length;g++){const L=this.shots.actor[g];if(!L.exists)continue;const S=L,v=this.checkHit(S.pos,.7,0);v>=E.HIT&&((i=(r=this.manager).addParticle)==null||i.call(r,S.pos,E.rand.nextSignedFloat(.3),0,t/4),(a=(n=this.manager).addParticle)==null||a.call(n,S.pos,E.rand.nextSignedFloat(.3),0,t/4),(h=(o=this.manager).addParticle)==null||h.call(o,S.pos,Math.PI+E.rand.nextSignedFloat(.3),0,t/7),L.exists=!1,v===E.HIT?this.addDamage(E.SHOT_DAMAGE):this.addDamageBattery(v,E.SHOT_DAMAGE))}if(this.manager.mode===this.getManagerModeRoll())for(let g=0;g<this.rolls.actor.length;g++){const L=this.rolls.actor[g];if(!L.exists)continue;const S=L,v=this.checkHit(S.pos[0],1,1);if(v>=E.HIT){for(let O=0;O<4;O++)(d=(u=this.manager).addParticle)==null||d.call(u,S.pos[0],E.rand.nextFloat(Math.PI*2),0,t/10);let N=E.ROLL_DAMAGE;if(S.released)N+=N;else if(S.cnt<this.getRollNoCollisionCnt())continue;v===E.HIT?this.addDamage(N):this.addDamageBattery(v,N)}}else if(this.type.type!==this.getEnemyTypeConst("SMALL",0))for(let g=0;g<this.locks.actor.length;g++){const L=this.locks.actor[g];if(!L.exists)continue;const S=L;if(S.state===this.getLockState("SEARCH",0)||S.state===this.getLockState("SEARCHED",1)){const v=this.checkLocked(S.pos[0],2.5,S);v>=E.HIT&&(S.state=this.getLockState("SEARCHED",1),S.lockedEnemy=this,S.lockedPart=v);return}if(S.state===this.getLockState("FIRED",4)&&S.lockedEnemy===this){const v=this.checkHit(S.pos[0],1.5,1.5);if(v>=E.HIT&&v===S.lockedPart){for(let N=0;N<4;N++)(b=(m=this.manager).addParticle)==null||b.call(m,S.pos[0],E.rand.nextFloat(Math.PI*2),0,t/10);v===E.HIT?this.addDamage(E.LOCK_DAMAGE):this.addDamageBattery(v,E.LOCK_DAMAGE),S.hit()}}}}removeTopBullets(){var t;this.topBullet&&(this.topBullet.remove(),this.topBullet=null);for(let r=0;r<this.type.batteryNum;r++){const i=this.type.batteryType[r],n=this.battery[r];for(let a=0;a<i.batteryNum;a++)n.topBullet[a]&&((t=n.topBullet[a])==null||t.remove(),n.topBullet[a]=null)}}remove(){this.removeTopBullets(),this.moveBullet&&this.moveBullet.remove(),this.exists=!1}gotoNextPoint(){this.onRoute=!1,this.movePointIdx++,this.movePointIdx>=this.movePointNum&&(this.movePointIdx=0)}moveBoss(){const t=this.movePoint[this.movePointIdx],r=Math.atan2(t.x-this.pos.x,t.y-this.pos.y);let i=r-this.deg;i>Math.PI?i-=Math.PI*2:i<-Math.PI&&(i+=Math.PI*2);const n=Math.abs(i);n<E.BOSS_MOVE_DEG?this.deg=r:i>0?(this.deg+=E.BOSS_MOVE_DEG,this.deg>=Math.PI*2&&(this.deg-=Math.PI*2)):(this.deg-=E.BOSS_MOVE_DEG,this.deg<0&&(this.deg+=Math.PI*2)),this.pos.x+=Math.sin(this.deg)*this.speed,this.pos.y+=Math.cos(this.deg)*this.speed,this.velCnt>0&&(this.velCnt--,this.pos.x+=this.vel.x,this.pos.y+=this.vel.y,this.vel.x*=.92,this.vel.y*=.92),this.onRoute?n>Math.PI/2&&this.gotoNextPoint():n<Math.PI/2&&(this.onRoute=!0),this.pos.x>this.fieldLimitX?(this.pos.x=this.fieldLimitX,this.gotoNextPoint()):this.pos.x<-this.fieldLimitX&&(this.pos.x=-this.fieldLimitX,this.gotoNextPoint()),this.pos.y>this.fieldLimitY?(this.pos.y=this.fieldLimitY,this.gotoNextPoint()):this.pos.y<this.fieldLimitY/4&&(this.pos.y=this.fieldLimitY/4,this.gotoNextPoint())}controlFireCnt(){this.fireCnt<=0?(this.setTopBullets(),this.fireCnt=this.type.fireInterval,this.barragePatternIdx++,this.barragePatternIdx>=this.type.barragePatternNum&&(this.barragePatternIdx=0)):this.fireCnt<this.type.fireInterval-this.type.firePeriod&&this.removeTopBullets(),this.fireCnt--}move(){var t,r,i,n,a,o,h,u;if(this.setEnemyTypeExist(this.type.id,!0),this.isBoss)this.moveBoss();else{if(!this.moveBullet){this.remove();return}this.pos.x=this.moveBullet.bullet.pos.x,this.pos.y=this.moveBullet.bullet.pos.y}this.topBullet&&(this.topBullet.bullet.pos.x=this.pos.x,this.topBullet.bullet.pos.y=this.pos.y),this.damaged=!1;for(let d=0;d<this.type.batteryNum;d++){const m=this.type.batteryType[d],b=this.battery[d];b.damaged=!1;for(let g=0;g<m.batteryNum;g++)b.topBullet[g]&&(b.topBullet[g].bullet.pos.x=this.pos.x+m.batteryPos[g].x,b.topBullet[g].bullet.pos.y=this.pos.y+m.batteryPos[g].y)}if(this.isBoss){let d=1;if(this.appCnt>0)this.z<0&&(this.z-=E.APPEARANCE_Z/60),this.appCnt--,d=1-this.appCnt/E.APPEARANCE_CNT;else if(this.dstCnt>0){if(this.addFragments(1,this.z,.05,E.rand.nextSignedFloat(Math.PI)),(r=(t=this.manager).clearBullets)==null||r.call(t),this.z+=E.DESTROYED_Z/60,this.dstCnt--,this.dstCnt<=0){this.addFragments(25,this.z,.4,E.rand.nextSignedFloat(Math.PI)),P.playSe(P.BOSS_DESTROYED),(n=(i=this.manager).setScreenShake)==null||n.call(i,60,.01),this.remove(),(o=(a=this.manager).setBossShieldMeter)==null||o.call(a,0,0,0,0,0,0);return}d=this.dstCnt/E.DESTROYED_CNT}else if(this.timeoutCnt>0){if(this.z+=E.DESTROYED_Z/60,this.timeoutCnt--,this.timeoutCnt<=0){this.remove();return}d=0}else this.controlFireCnt(),d=1,this.bossTimer++,this.bossTimer>E.BOSS_TIMEOUT&&(this.timeoutCnt=E.TIMEOUT_CNT,this.shield=0,this.removeTopBullets());(u=(h=this.manager).setBossShieldMeter)==null||u.call(h,this.shield,this.battery[0].shield,this.battery[1].shield,this.battery[2].shield,this.battery[3].shield,d)}else{if(this.checkFieldHit(this.pos)){this.remove();return}this.pos.y<-this.field.size.y/4?this.removeTopBullets():this.controlFireCnt()}this.cnt++,this.appCnt<=0&&this.dstCnt<=0&&this.timeoutCnt<=0&&this.checkDamage()}draw(){let t=1;this.appCnt>0?(w.setRetroZ(this.z),t=this.appCnt/E.APPEARANCE_CNT,w.setRetroParam(1,this.type.retroSize*(1+t*10)),w.setRetroColor(this.type.r,this.type.g,this.type.b,1-t)):this.dstCnt>0?(w.setRetroZ(this.z),t=this.dstCnt/E.DESTROYED_CNT/2+.5,w.setRetroColor(this.type.r,this.type.g,this.type.b,t)):this.timeoutCnt>0?(w.setRetroZ(this.z),t=this.timeoutCnt/E.TIMEOUT_CNT,w.setRetroColor(this.type.r,this.type.g,this.type.b,t)):(w.setRetroParam(1,this.type.retroSize),this.damaged?w.setRetroColor(1,1,this.type.b,1):w.setRetroColor(this.type.r,this.type.g,this.type.b,1));const r=this.getEnemyTypeConst("BODY_SHAPE_POINT_NUM",4);let i=1;for(let a=0;a<r;a++,i++)i>=r&&(i=0),w.drawLineRetro(this.pos.x+this.type.bodyShapePos[a].x,this.pos.y+this.type.bodyShapePos[a].y,this.pos.x+this.type.bodyShapePos[i].x,this.pos.y+this.type.bodyShapePos[i].y);if(this.type.type!==this.getEnemyTypeConst("SMALL",0)){l.glBegin(l.GL_TRIANGLE_FAN),l.setColor(w.retroR,w.retroG,w.retroB,0);for(let a=0;a<r;a++)a===2&&l.setColor(w.retroR,w.retroG,w.retroB,w.retroA),l.glVertex3f(this.pos.x+this.type.bodyShapePos[a].x,this.pos.y+this.type.bodyShapePos[a].y,this.z);l.glEnd()}const n=this.getBatteryTypeConst("WING_SHAPE_POINT_NUM",3);for(let a=0;a<this.type.batteryNum;a++){const o=this.type.batteryType[a];if(this.appCnt>0?w.setRetroColor(o.r,o.g,o.b,1-t):this.dstCnt>0||this.timeoutCnt>0?w.setRetroColor(o.r,o.g,o.b,t):this.battery[a].damaged?w.setRetroColor(1,1,o.b,1):w.setRetroColor(o.r,o.g,o.b,1),i=1,this.battery[a].shield<=0)w.drawLineRetro(this.pos.x+o.wingShapePos[0].x,this.pos.y+o.wingShapePos[0].y,this.pos.x+o.wingShapePos[1].x,this.pos.y+o.wingShapePos[1].y);else{for(let h=0;h<n;h++,i++)i>=n&&(i=0),w.drawLineRetro(this.pos.x+o.wingShapePos[h].x,this.pos.y+o.wingShapePos[h].y,this.pos.x+o.wingShapePos[i].x,this.pos.y+o.wingShapePos[i].y);if(this.type.type!==this.getEnemyTypeConst("SMALL",0)){l.glBegin(l.GL_TRIANGLE_FAN),l.setColor(w.retroR,w.retroG,w.retroB,w.retroA);for(let h=0;h<n;h++)h===2&&l.setColor(w.retroR,w.retroG,w.retroB,0),l.glVertex3f(this.pos.x+o.wingShapePos[h].x,this.pos.y+o.wingShapePos[h].y,this.z);l.glEnd()}}}w.setRetroZ(0)}registFunctions(t){Lt.registFunctions(t)}checkFieldHit(t){return typeof this.field.checkHit=="function"?this.field.checkHit(t):t.x<-this.field.size.x||t.x>this.field.size.x||t.y<-this.field.size.y||t.y>this.field.size.y}getEnemyTypeConst(t,r){const i=j[t];return typeof i=="number"?i:r}getBatteryTypeConst(t,r){var a,o,h;const i=(h=(o=(a=this.type)==null?void 0:a.batteryType)==null?void 0:o[0])==null?void 0:h.constructor,n=i==null?void 0:i[t];return typeof n=="number"?n:r}getManagerModeRoll(){var r;const t=(r=this.manager.constructor)==null?void 0:r.ROLL;return typeof t=="number"?t:0}getRollNoCollisionCnt(){const t=It.NO_COLLISION_CNT;return typeof t=="number"?t:45}getShotSpeed(){const t=kt.SPEED;return typeof t=="number"?t:1}getLockState(t,r){const i=Pt[t];return typeof i=="number"?i:r}setEnemyTypeExist(t,r){const i=j;i.isExist||(i.isExist=[]),i.isExist[t]=r}getEnemyTypeScore(t){return t<0?E.ENEMY_TYPE_SCORE[0]:t>=E.ENEMY_TYPE_SCORE.length?E.ENEMY_TYPE_SCORE[E.ENEMY_TYPE_SCORE.length-1]:E.ENEMY_TYPE_SCORE[t]}};s(E,"FIELD_SPACE",.5),s(E,"MOVE_POINT_MAX",8),s(E,"APPEARANCE_CNT",90),s(E,"APPEARANCE_Z",-15),s(E,"DESTROYED_CNT",90),s(E,"DESTROYED_Z",-10),s(E,"TIMEOUT_CNT",90),s(E,"BOSS_TIMEOUT",1800),s(E,"SHOT_DAMAGE",1),s(E,"ROLL_DAMAGE",1),s(E,"LOCK_DAMAGE",7),s(E,"ENEMY_TYPE_SCORE",[100,500,1e3,5e3,1e4]),s(E,"ENEMY_WING_SCORE",1e3),s(E,"BOSS_MOVE_DEG",.02),s(E,"NOHIT",-2),s(E,"HIT",-1),s(E,"rand",new it);let xt=E;class $e{constructor(e,t,r,i,n,a,o){this.field=e,this.bullets=t,this.shots=r,this.rolls=i,this.locks=n,this.ship=a,this.manager=o}}const x=class x{constructor(){s(this,"size",new T);s(this,"eyeZ",20);s(this,"aimZ",10);s(this,"aimSpeed",.1);s(this,"roll",0);s(this,"yaw",0);s(this,"z",10);s(this,"speed",.1);s(this,"yawYBase",0);s(this,"yawZBase",0);s(this,"aimYawYBase",0);s(this,"aimYawZBase",0);s(this,"r",0);s(this,"g",0);s(this,"b",0)}init(){this.size.x=11,this.size.y=16,this.eyeZ=20,this.roll=0,this.yaw=0,this.z=10,this.aimZ=10,this.speed=.1,this.aimSpeed=.1,this.yawYBase=0,this.yawZBase=0,this.aimYawYBase=0,this.aimYawZBase=0,this.r=0,this.g=0,this.b=0}setColor(e){const t=wt,r=t.ROLL,i=t.LOCK;switch(e){case r:this.r=.2,this.g=.2,this.b=.7;break;case i:this.r=.5,this.g=.3,this.b=.6;break}}move(){this.roll+=this.speed,this.roll>=x.RING_ANGLE_INT&&(this.roll-=x.RING_ANGLE_INT),this.yaw+=this.speed,this.z+=(this.aimZ-this.z)*.003,this.speed+=(this.aimSpeed-this.speed)*.004,this.yawYBase+=(this.aimYawYBase-this.yawYBase)*.002,this.yawZBase+=(this.aimYawZBase-this.yawZBase)*.002}setType(e){switch(e){case 0:this.aimYawYBase=30,this.aimYawZBase=0;break;case 1:this.aimYawYBase=0,this.aimYawZBase=20;break;case 2:this.aimYawYBase=50,this.aimYawZBase=10;break;case 3:this.aimYawYBase=10,this.aimYawZBase=30;break}}draw(){var t;l.setColor(this.r,this.g,this.b,.7);let e=-16*x.RING_ANGLE_INT/2+this.roll;for(let r=0;r<x.RING_NUM;r++){for(let i=1;i<8;i++){const n=i/16+.5;l.glPushMatrix(),l.glTranslatef(0,0,this.z),l.glRotatef(e,1,0,0);const a=Math.sin(this.yaw/180*Math.PI);l.glRotatef(a*this.yawYBase,0,1,0),l.glRotatef(a*this.yawZBase,0,0,1),l.glScalef(1,1,n),(t=x.displayList)==null||t.call(0),l.glPopMatrix()}e+=x.RING_ANGLE_INT}}checkHit(e,t=0){return e.x<-this.size.x+t||e.x>this.size.x-t||e.y<-this.size.y+t||e.y>this.size.y-t}static writeOneRing(){l.glBegin(l.GL_LINE_STRIP);for(let e=0;e<=x.RING_POS_NUM/2-2;e++)l.glVertex3f(x.ringPos[e].x,x.RING_SIZE,x.ringPos[e].y);for(let e=x.RING_POS_NUM/2-2;e>=0;e--)l.glVertex3f(x.ringPos[e].x,-.5,x.ringPos[e].y);l.glVertex3f(x.ringPos[0].x,x.RING_SIZE,x.ringPos[0].y),l.glEnd(),l.glBegin(l.GL_LINE_STRIP),l.glVertex3f(x.ringPos[x.RING_POS_NUM/2-1].x,x.RING_SIZE,x.ringPos[x.RING_POS_NUM/2-1].y),l.glVertex3f(x.ringPos[x.RING_POS_NUM/2].x,x.RING_SIZE,x.ringPos[x.RING_POS_NUM/2].y),l.glVertex3f(x.ringPos[x.RING_POS_NUM/2].x,-.5,x.ringPos[x.RING_POS_NUM/2].y),l.glVertex3f(x.ringPos[x.RING_POS_NUM/2-1].x,-.5,x.ringPos[x.RING_POS_NUM/2-1].y),l.glVertex3f(x.ringPos[x.RING_POS_NUM/2-1].x,x.RING_SIZE,x.ringPos[x.RING_POS_NUM/2-1].y),l.glEnd(),l.glBegin(l.GL_LINE_STRIP);for(let e=x.RING_POS_NUM/2+1;e<=x.RING_POS_NUM-1;e++)l.glVertex3f(x.ringPos[e].x,x.RING_SIZE,x.ringPos[e].y);for(let e=x.RING_POS_NUM-1;e>=x.RING_POS_NUM/2+1;e--)l.glVertex3f(x.ringPos[e].x,-.5,x.ringPos[e].y);l.glVertex3f(x.ringPos[x.RING_POS_NUM/2+1].x,x.RING_SIZE,x.ringPos[x.RING_POS_NUM/2+1].y),l.glEnd()}static createDisplayLists(){x.deleteDisplayLists();let e=-x.RING_DEG*(x.RING_POS_NUM/2-.5);for(let r=0;r<x.RING_POS_NUM;r++,e+=x.RING_DEG)x.ringPos[r].x=Math.sin(e)*x.RING_RADIUS,x.ringPos[r].y=Math.cos(e)*x.RING_RADIUS;const t=new Jt(1);t.beginNewList(),x.writeOneRing(),t.endNewList(),x.displayList=t}static deleteDisplayLists(){var e;(e=x.displayList)==null||e.close(),x.displayList=null}};s(x,"TYPE_NUM",4),s(x,"displayList",null),s(x,"RING_NUM",16),s(x,"RING_ANGLE_INT",10),s(x,"RING_POS_NUM",16),s(x,"ringPos",Array.from({length:x.RING_POS_NUM},()=>new T)),s(x,"RING_DEG",Math.PI/3/(x.RING_POS_NUM/2+.5)),s(x,"RING_RADIUS",10),s(x,"RING_SIZE",.5);let vt=x;class ge extends yt{}const X=class X extends ge{constructor(){super(...arguments);s(this,"pos",[]);s(this,"vel",[]);s(this,"impact",new T);s(this,"z",0);s(this,"lumAlp",0);s(this,"retro",0);s(this,"cnt",0)}init(t){if(!((Array.isArray(t)?t[0]:t)instanceof He))throw new Error("Fragment.init requires FragmentInitializer");this.pos=Array.from({length:X.POINT_NUM},()=>new T),this.vel=Array.from({length:X.POINT_NUM},()=>new T),this.impact=new T}set(t,r,i,n,a,o,h){const u=X.rand.nextFloat(1),d=X.rand.nextFloat(1);this.pos[0].x=t*u+i*(1-u),this.pos[0].y=r*u+n*(1-u),this.pos[1].x=t*d+i*(1-d),this.pos[1].y=r*d+n*(1-d);for(let m=0;m<X.POINT_NUM;m++)this.vel[m].x=X.rand.nextSignedFloat(1)*o,this.vel[m].y=X.rand.nextSignedFloat(1)*o;this.impact.x=Math.sin(h)*o*4,this.impact.y=Math.cos(h)*o*4,this.z=a,this.cnt=32+X.rand.nextInt(24),this.lumAlp=.8+X.rand.nextFloat(.2),this.retro=1,this.exists=!0}move(){if(this.cnt--,this.cnt<0){this.exists=!1;return}for(let t=0;t<X.POINT_NUM;t++)this.pos[t].opAddAssign(this.vel[t]),this.pos[t].opAddAssign(this.impact),this.vel[t].opMulAssign(.98);this.impact.opMulAssign(.95),this.lumAlp*=.98,this.retro*=.97}draw(){w.setRetroZ(this.z),w.setRetroParam(this.retro,.2),w.drawLineRetro(this.pos[0].x,this.pos[0].y,this.pos[1].x,this.pos[1].y)}drawLuminous(){this.lumAlp<.2||(l.setColor(X.R,X.G,X.B,this.lumAlp),l.glVertex3f(this.pos[0].x,this.pos[0].y,this.z),l.glVertex3f(this.pos[1].x,this.pos[1].y,this.z))}};s(X,"R",1),s(X,"G",.8),s(X,"B",.6),s(X,"POINT_NUM",2),s(X,"rand",new it);let ht=X;class He{}const I=class I{static changeColor(e){I.colorIdx=e*I.LETTER_NUM}static drawLetter(e,t,r,i,n){I.displayList&&(l.glPushMatrix(),l.glTranslatef(t,r,0),l.glScalef(i,i,i),l.glRotatef(n,0,0,1),I.displayList.call(e+I.colorIdx),l.glPopMatrix())}static drawString(e,t,r,i,n){let a=t,o=0;switch(n){case I.TO_RIGHT:o=0;break;case I.TO_DOWN:o=90;break;case I.TO_LEFT:o=180;break;case I.TO_UP:o=270;break}for(let h=0;h<e.length;h++){const u=e[h];if(u!==" "){const d=u.charCodeAt(0);let m;d>=48&&d<=57?m=d-48:d>=65&&d<=90?m=d-65+10:d>=97&&d<=122?m=d-97+10:u==="."?m=36:u==="-"?m=38:u==="+"?m=39:m=37,I.drawLetter(m,a,r,i,o)}switch(n){case I.TO_RIGHT:a+=i*1.7;break;case I.TO_DOWN:r+=i*1.7;break;case I.TO_LEFT:a-=i*1.7;break;case I.TO_UP:r-=i*1.7;break}}}static drawNum(e,t,r,i,n){let a=Math.trunc(e),o=t,h=0;switch(n){case I.TO_RIGHT:h=0;break;case I.TO_DOWN:h=90;break;case I.TO_LEFT:h=180;break;case I.TO_UP:h=270;break}for(;;){switch(I.drawLetter(a%10,o,r,i,h),n){case I.TO_RIGHT:o-=i*1.7;break;case I.TO_DOWN:r-=i*1.7;break;case I.TO_LEFT:o+=i*1.7;break;case I.TO_UP:r+=i*1.7;break}if(a=Math.trunc(a/10),a<=0)break}}static drawBox(e,t,r,i,n,a,o){l.setColor(n,a,o,.5),w.drawBoxSolid(e-r,t-i,r*2,i*2),l.setColor(n,a,o,1),w.drawBoxLine(e-r,t-i,r*2,i*2)}static drawGlyph(e,t,r,i){for(let n=0;;n++){let a=I.spData[e][n][4]|0;if(a>99990)break;let o=-I.spData[e][n][0];const h=-I.spData[e][n][1];let u=I.spData[e][n][2],d=I.spData[e][n][3];u*=.66,d*=.6,o=-o,a%=180,a<=45||a>135?I.drawBox(o,h,u,d,t,r,i):I.drawBox(o,h,d,u,t,r,i)}}static createDisplayLists(){const e=new Jt(I.LETTER_NUM*2);let t=!1,r=0;for(let i=0;i<I.LETTER_NUM;i++)t?e.nextNewList():(e.beginNewList(),t=!0),I.drawGlyph(i,1,1,1),r++;for(let i=0;i<I.LETTER_NUM;i++)e.nextNewList(),I.drawGlyph(i,1,.7,.7),r++;t&&r>0&&e.endNewList(),I.displayList=e,I.colorIdx=0}static deleteDisplayLists(){var e;(e=I.displayList)==null||e.close(),I.displayList=null}};s(I,"displayList",null),s(I,"colorIdx",0),s(I,"WHITE",0),s(I,"RED",1),s(I,"TO_RIGHT",0),s(I,"TO_DOWN",1),s(I,"TO_LEFT",2),s(I,"TO_UP",3),s(I,"LETTER_NUM",42),s(I,"spData",[[[0,1.15,.65,.3,0],[-.6,.55,.65,.3,90],[.6,.55,.65,.3,90],[-.6,-.55,.65,.3,90],[.6,-.55,.65,.3,90],[0,-1.15,.65,.3,0],[0,0,0,0,99999]],[[0,.55,.65,.3,90],[0,-.55,.65,.3,90],[0,0,0,0,99999]],[[0,1.15,.65,.3,0],[.65,.55,.65,.3,90],[0,0,.65,.3,0],[-.65,-.55,.65,.3,90],[0,-1.15,.65,.3,0],[0,0,0,0,99999]],[[0,1.15,.65,.3,0],[.65,.55,.65,.3,90],[0,0,.65,.3,0],[.65,-.55,.65,.3,90],[0,-1.15,.65,.3,0],[0,0,0,0,99999]],[[-.65,.55,.65,.3,90],[.65,.55,.65,.3,90],[0,0,.65,.3,0],[.65,-.55,.65,.3,90],[0,0,0,0,99999]],[[0,1.15,.65,.3,0],[-.65,.55,.65,.3,90],[0,0,.65,.3,0],[.65,-.55,.65,.3,90],[0,-1.15,.65,.3,0],[0,0,0,0,99999]],[[0,1.15,.65,.3,0],[-.65,.55,.65,.3,90],[0,0,.65,.3,0],[-.65,-.55,.65,.3,90],[.65,-.55,.65,.3,90],[0,-1.15,.65,.3,0],[0,0,0,0,99999]],[[0,1.15,.65,.3,0],[.65,.55,.65,.3,90],[.65,-.55,.65,.3,90],[0,0,0,0,99999]],[[0,1.15,.65,.3,0],[-.65,.55,.65,.3,90],[.65,.55,.65,.3,90],[0,0,.65,.3,0],[-.65,-.55,.65,.3,90],[.65,-.55,.65,.3,90],[0,-1.15,.65,.3,0],[0,0,0,0,99999]],[[0,1.15,.65,.3,0],[-.65,.55,.65,.3,90],[.65,.55,.65,.3,90],[0,0,.65,.3,0],[.65,-.55,.65,.3,90],[0,-1.15,.65,.3,0],[0,0,0,0,99999]],[[0,1.15,.65,.3,0],[-.65,.55,.65,.3,90],[.65,.55,.65,.3,90],[0,0,.65,.3,0],[-.65,-.55,.65,.3,90],[.65,-.55,.65,.3,90],[0,0,0,0,99999]],[[-.1,1.15,.45,.3,0],[-.65,.55,.65,.3,90],[.45,.55,.65,.3,90],[-.1,0,.45,.3,0],[-.65,-.55,.65,.3,90],[.65,-.55,.65,.3,90],[0,-1.15,.65,.3,0],[0,0,0,0,99999]],[[0,1.15,.65,.3,0],[-.65,.55,.65,.3,90],[-.65,-.55,.65,.3,90],[0,-1.15,.65,.3,0],[0,0,0,0,99999]],[[-.1,1.15,.45,.3,0],[-.65,.55,.65,.3,90],[.45,.4,.65,.3,90],[-.65,-.55,.65,.3,90],[.65,-.55,.65,.3,90],[0,-1.15,.65,.3,0],[0,0,0,0,99999]],[[0,1.15,.65,.3,0],[-.65,.55,.65,.3,90],[0,0,.65,.3,0],[-.65,-.55,.65,.3,90],[0,-1.15,.65,.3,0],[0,0,0,0,99999]],[[0,1.15,.65,.3,0],[-.65,.55,.65,.3,90],[0,0,.65,.3,0],[-.65,-.55,.65,.3,90],[0,0,0,0,99999]],[[0,1.15,.65,.3,0],[-.65,.55,.65,.3,90],[.25,0,.25,.3,0],[-.65,-.55,.65,.3,90],[.65,-.55,.65,.3,90],[0,-1.15,.65,.3,0],[0,0,0,0,99999]],[[-.65,.55,.65,.3,90],[.65,.55,.65,.3,90],[0,0,.65,.3,0],[-.65,-.55,.65,.3,90],[.65,-.55,.65,.3,90],[0,0,0,0,99999]],[[0,.55,.65,.3,90],[0,-.55,.65,.3,90],[0,0,0,0,99999]],[[-.65,.55,.65,.3,90],[-.65,-.55,.65,.3,90],[.65,-.75,.25,.3,90],[0,-1.15,.65,.3,0],[0,0,0,0,99999]],[[-.65,.55,.65,.3,90],[.45,.55,.65,.3,90],[-.1,0,.45,.3,0],[-.65,-.55,.65,.3,90],[.65,-.55,.65,.3,90],[0,0,0,0,99999]],[[-.65,.55,.65,.3,90],[-.65,-.55,.65,.3,90],[0,-1.15,.65,.3,0],[0,0,0,0,99999]],[[-.3,1.15,.25,.3,0],[.3,1.15,.25,.3,0],[-.65,.55,.65,.3,90],[.65,.55,.65,.3,90],[-.65,-.55,.65,.3,90],[.65,-.55,.65,.3,90],[0,.55,.65,.3,90],[0,-.55,.65,.3,90],[0,0,0,0,99999]],[[0,1.15,.65,.3,0],[-.65,.55,.65,.3,90],[.65,.55,.65,.3,90],[-.65,-.55,.65,.3,90],[.65,-.55,.65,.3,90],[0,0,0,0,99999]],[[0,1.15,.65,.3,0],[-.65,.55,.65,.3,90],[.65,.55,.65,.3,90],[-.65,-.55,.65,.3,90],[.65,-.55,.65,.3,90],[0,-1.15,.65,.3,0],[0,0,0,0,99999]],[[0,1.15,.65,.3,0],[-.65,.55,.65,.3,90],[.65,.55,.65,.3,90],[0,0,.65,.3,0],[-.65,-.55,.65,.3,90],[0,0,0,0,99999]],[[0,1.15,.65,.3,0],[-.65,.55,.65,.3,90],[.65,.55,.65,.3,90],[-.65,-.55,.65,.3,90],[.65,-.55,.65,.3,90],[0,-1.15,.65,.3,0],[.2,-.6,.45,.3,60],[0,0,0,0,99999]],[[0,1.15,.65,.3,0],[-.65,.55,.65,.3,90],[.65,.55,.65,.3,90],[-.1,0,.45,.3,0],[-.65,-.55,.65,.3,90],[.45,-.55,.65,.3,90],[0,0,0,0,99999]],[[0,1.15,.65,.3,0],[-.65,.55,.65,.3,90],[0,0,.65,.3,0],[.65,-.55,.65,.3,90],[0,-1.15,.65,.3,0],[0,0,0,0,99999]],[[-.4,1.15,.45,.3,0],[.4,1.15,.45,.3,0],[0,.55,.65,.3,90],[0,-.55,.65,.3,90],[0,0,0,0,99999]],[[-.65,.55,.65,.3,90],[.65,.55,.65,.3,90],[-.65,-.55,.65,.3,90],[.65,-.55,.65,.3,90],[0,-1.15,.65,.3,0],[0,0,0,0,99999]],[[-.65,.55,.65,.3,90],[.65,.55,.65,.3,90],[-.5,-.55,.65,.3,90],[.5,-.55,.65,.3,90],[0,-1.15,.45,.3,0],[0,0,0,0,99999]],[[-.65,.55,.65,.3,90],[.65,.55,.65,.3,90],[-.65,-.55,.65,.3,90],[.65,-.55,.65,.3,90],[-.3,-1.15,.25,.3,0],[.3,-1.15,.25,.3,0],[0,.55,.65,.3,90],[0,-.55,.65,.3,90],[0,0,0,0,99999]],[[-.4,.6,.85,.3,240],[.4,.6,.85,.3,300],[-.4,-.6,.85,.3,120],[.4,-.6,.85,.3,60],[0,0,0,0,99999]],[[-.4,.6,.85,.3,240],[.4,.6,.85,.3,300],[0,-.55,.65,.3,90],[0,0,0,0,99999]],[[0,1.15,.65,.3,0],[.35,.5,.65,.3,300],[-.35,-.5,.65,.3,120],[0,-1.15,.65,.3,0],[0,0,0,0,99999]],[[0,-1.15,.05,.3,0],[0,0,0,0,99999]],[[0,-1.15,.65,.3,0],[0,0,0,0,99999]],[[0,0,.65,.3,0],[0,0,0,0,99999]],[[-.4,0,.45,.3,0],[.4,0,.45,.3,0],[0,.55,.65,.3,90],[0,-.55,.65,.3,90],[0,0,0,0,99999]],[[0,1,.4,.2,90],[0,0,0,0,99999]],[[-.19,1,.4,.2,90],[.2,1,.4,.2,90],[0,0,0,0,99999]]]);let M=I;class Le extends Et{constructor(e,t,r){super(e,t,r)}drawLuminous(){for(let e=0;e<this.actor.length;e++)this.actor[e].exists&&this.actor[e].drawLuminous()}}function ne(c){return c<0?Math.ceil(c):Math.floor(c)}const B=class B{constructor(){s(this,"parsec",0);s(this,"bossSection",!1);s(this,"gameManager");s(this,"barrageManager");s(this,"field");s(this,"rand");s(this,"SIMULTANEOUS_APPEARNCE_MAX",4);s(this,"appearance",[]);s(this,"SMALL_ENEMY_TYPE_MAX",3);s(this,"smallType",[]);s(this,"MIDDLE_ENEMY_TYPE_MAX",4);s(this,"middleType",[]);s(this,"LARGE_ENEMY_TYPE_MAX",2);s(this,"largeType",[]);s(this,"middleBossType");s(this,"largeBossType");s(this,"apNum",0);s(this,"apos");s(this,"sectionCnt",0);s(this,"sectionIntervalCnt",0);s(this,"section",0);s(this,"rank",0);s(this,"rankInc",0);s(this,"middleRushSectionNum",0);s(this,"middleRushSection",!1);s(this,"stageType",0);s(this,"MIDDLE_RUSH_SECTION_PATTERN",6);s(this,"apparancePattern",[[[1,0,0],[2,0,0],[1,1,0],[1,0,1],[2,1,0],[2,0,1],[0,1,1]],[[1,0,0],[1,1,0],[1,1,0],[1,0,1],[2,1,0],[1,1,1],[0,1,1]]])}init(e,t,r){this.gameManager=e,this.barrageManager=t,this.field=r,this.rand=new it,this.apos=new T,this.smallType=Array.from({length:this.SMALL_ENEMY_TYPE_MAX},()=>new j),this.middleType=Array.from({length:this.MIDDLE_ENEMY_TYPE_MAX},()=>new j),this.largeType=Array.from({length:this.LARGE_ENEMY_TYPE_MAX},()=>new j),this.middleBossType=new j,this.largeBossType=new j,this.appearance=Array.from({length:this.SIMULTANEOUS_APPEARNCE_MAX},()=>({type:this.smallType[0],moveParser:null,point:B.TOP,pattern:B.ALTERNATE,sequence:B.RANDOM,pos:0,num:0,interval:0,groupInterval:0,cnt:0,left:0,side:1}))}close(){}setRank(e,t,r,i){this.rank=e,this.rankInc=t,this.rank+=this.rankInc*ne(r/10),this.section=-1,this.parsec=r-1,this.stageType=i,this.createStage(),this.gotoNextSection()}move(){for(let e=0;e<this.apNum;e++){const t=this.appearance[e];if(t.cnt--,t.cnt>0){this.middleRushSection?t.type.type===j.MIDDLE&&!j.isExist[t.type.id]&&(t.cnt=0,j.isExist[t.type.id]=!0):t.type.type===j.SMALL&&!j.isExist[t.type.id]&&(t.cnt=0,j.isExist[t.type.id]=!0);continue}let r=0;switch(t.sequence){case B.RANDOM:r=this.rand.nextFloat(1);break;case B.FIXED:r=t.pos;break}let i=0;switch(t.point){case B.TOP:switch(t.pattern){case B.BOTH_SIDES:this.apos.x=(r-.5)*this.field.size.x*1.8;break;default:this.apos.x=(r*.6+.2)*this.field.size.x*t.side;break}this.apos.y=this.field.size.y-xt.FIELD_SPACE,i=Math.PI;break;case B.BACK:switch(t.pattern){case B.BOTH_SIDES:this.apos.x=(r-.5)*this.field.size.x*1.8;break;default:this.apos.x=(r*.6+.2)*this.field.size.x*t.side;break}this.apos.y=-this.field.size.y+xt.FIELD_SPACE,i=0;break;case B.SIDE:switch(t.pattern){case B.BOTH_SIDES:this.apos.x=(this.field.size.x-xt.FIELD_SPACE)*(this.rand.nextInt(2)*2-1);break;default:this.apos.x=(this.field.size.x-xt.FIELD_SPACE)*t.side;break}this.apos.y=(r*.4+.4)*this.field.size.y,this.apos.x<0?i=Math.PI/2:i=Math.PI/2*3;break}this.apos.x*=.88,t.moveParser&&this.gameManager.addEnemy(this.apos,i,t.type,t.moveParser),t.left--,t.left<=0?(t.cnt=t.groupInterval,t.left=t.num,t.pattern!==B.ONE_SIDE&&(t.side*=-1),t.pos=this.rand.nextFloat(1)):t.cnt=t.interval}(!this.bossSection||!j.isExist[this.middleBossType.id]&&!j.isExist[this.largeBossType.id])&&this.sectionCnt--,this.sectionCnt<this.sectionIntervalCnt&&(this.section===9&&this.sectionCnt===this.sectionIntervalCnt-1&&gt.fadeMusic(),this.apNum=0,this.sectionCnt<=0&&this.gotoNextSection()),j.clearIsExistList()}createEnemyData(){for(let e=0;e<this.smallType.length;e++)this.smallType[e].setSmallEnemyType(this.rank,this.gameManager.mode);for(let e=0;e<this.middleType.length;e++)this.middleType[e].setMiddleEnemyType(this.rank,this.gameManager.mode);for(let e=0;e<this.largeType.length;e++)this.largeType[e].setLargeEnemyType(this.rank,this.gameManager.mode);this.middleBossType.setMiddleBossEnemyType(this.rank,this.gameManager.mode),this.largeBossType.setLargeBossEnemyType(this.rank,this.gameManager.mode)}setAppearancePattern(e){switch(this.rand.nextInt(5)){case 0:e.pattern=B.ONE_SIDE;break;case 1:case 2:e.pattern=B.ALTERNATE;break;case 3:case 4:e.pattern=B.BOTH_SIDES;break}switch(this.rand.nextInt(3)){case 0:e.sequence=B.RANDOM;break;case 1:case 2:e.sequence=B.FIXED;break}}getParser(e){const t=this.barrageManager.parserNum[e]??0;return t<=0?null:this.barrageManager.parser[e][this.rand.nextInt(t)]??null}setSmallAppearance(e){e.type=this.smallType[this.rand.nextInt(this.smallType.length)];let t=0;switch(this.rand.nextFloat(1)>.2?(e.point=B.TOP,t=F.SMALLMOVE):(e.point=B.SIDE,t=F.SMALLSIDEMOVE),e.moveParser=this.getParser(t),this.setAppearancePattern(e),e.pattern===B.ONE_SIDE&&(e.pattern=B.ALTERNATE),this.rand.nextInt(4)){case 0:e.num=7+this.rand.nextInt(5),e.groupInterval=72+this.rand.nextInt(15),e.interval=15+this.rand.nextInt(5);break;case 1:e.num=5+this.rand.nextInt(3),e.groupInterval=56+this.rand.nextInt(10),e.interval=20+this.rand.nextInt(5);break;case 2:case 3:e.num=2+this.rand.nextInt(2),e.groupInterval=45+this.rand.nextInt(20),e.interval=25+this.rand.nextInt(5);break}}setMiddleAppearance(e){e.type=this.middleType[this.rand.nextInt(this.middleType.length)];const t=F.MIDDLEMOVE;switch(e.point=B.TOP,e.moveParser=this.getParser(t),this.setAppearancePattern(e),this.rand.nextInt(3)){case 0:e.num=4,e.groupInterval=240+this.rand.nextInt(150),e.interval=80+this.rand.nextInt(30);break;case 1:e.num=2,e.groupInterval=180+this.rand.nextInt(60),e.interval=180+this.rand.nextInt(20);break;case 2:e.num=1,e.groupInterval=150+this.rand.nextInt(50),e.interval=100;break}}setLargeAppearance(e){e.type=this.largeType[this.rand.nextInt(this.largeType.length)];const t=F.LARGEMOVE;switch(e.point=B.TOP,e.moveParser=this.getParser(t),this.setAppearancePattern(e),this.rand.nextInt(3)){case 0:e.num=3,e.groupInterval=400+this.rand.nextInt(100),e.interval=240+this.rand.nextInt(40);break;case 1:e.num=2,e.groupInterval=400+this.rand.nextInt(60),e.interval=300+this.rand.nextInt(20);break;case 2:e.num=1,e.groupInterval=270+this.rand.nextInt(50),e.interval=200;break}}setAppearance(e,t){switch(t){case B.SMALL:this.setSmallAppearance(e);break;case B.MIDDLE:this.setMiddleAppearance(e);break;case B.LARGE:this.setLargeAppearance(e);break}e.cnt=0,e.left=e.num,e.side=this.rand.nextInt(2)*2-1,e.pos=this.rand.nextFloat(1)}createSectionData(){if(this.apNum=0,this.rank<=0)return;if(this.field.aimSpeed=.1+this.section*.02,this.section===4){const a=new T;a.x=0,a.y=this.field.size.y/4*3,this.gameManager.addBoss(a,Math.PI,this.middleBossType),this.bossSection=!0,this.sectionIntervalCnt=this.sectionCnt=120,this.field.aimZ=11;return}if(this.section===9){const a=new T;a.x=0,a.y=this.field.size.y/4*3,this.gameManager.addBoss(a,Math.PI,this.largeBossType),this.bossSection=!0,this.sectionIntervalCnt=this.sectionCnt=180,this.field.aimZ=12;return}this.section===this.middleRushSectionNum?(this.middleRushSection=!0,this.field.aimZ=9):(this.middleRushSection=!1,this.field.aimZ=10+this.rand.nextSignedFloat(.3)),this.bossSection=!1,this.section===3?this.sectionIntervalCnt=120:this.section===3?this.sectionIntervalCnt=240:this.sectionIntervalCnt=60,this.sectionCnt=this.sectionIntervalCnt+600;const e=ne(this.section*3/7)+1,t=3+ne(this.section*3/10);let r=e+this.rand.nextInt(t-e+1);this.section===0?r=0:this.middleRushSection&&(r=this.MIDDLE_RUSH_SECTION_PATTERN);const i=this.apparancePattern[this.gameManager.mode]??this.apparancePattern[0],n=i[r]??i[0];for(let a=0;a<n[0];a++,this.apNum++)this.setAppearance(this.appearance[this.apNum],B.SMALL);for(let a=0;a<n[1];a++,this.apNum++)this.setAppearance(this.appearance[this.apNum],B.MIDDLE);for(let a=0;a<n[2];a++,this.apNum++)this.setAppearance(this.appearance[this.apNum],B.LARGE)}createStage(){this.createEnemyData(),this.middleRushSectionNum=2+this.rand.nextInt(6),this.middleRushSectionNum<=4&&this.middleRushSectionNum++,this.field.setType(this.stageType%vt.TYPE_NUM),P.playBgm(this.stageType%P.BGM_NUM),this.stageType++}gotoNextSection(){this.section++,this.parsec++;const t=this.gameManager.constructor.TITLE??0;this.gameManager.state===t&&this.section>=4&&(this.section=0,this.parsec-=4),this.section>=10&&(this.section=0,this.rank+=this.rankInc,this.createStage()),this.createSectionData()}};s(B,"TOP",0),s(B,"SIDE",1),s(B,"BACK",2),s(B,"ONE_SIDE",0),s(B,"ALTERNATE",1),s(B,"BOTH_SIDES",2),s(B,"RANDOM",0),s(B,"FIXED",1),s(B,"SMALL",0),s(B,"MIDDLE",1),s(B,"LARGE",2),s(B,"STAGE_TYPE_NUM",4);let ce=B;const Kt=class Kt{constructor(e){s(this,"num",0);s(this,"fileName");s(this,"image",null);s(this,"texture",null);s(this,"loaded",!1);s(this,"failed",!1);s(this,"loadPromise");s(this,"settleLoadPromise",null);s(this,"loadPromiseSettled",!1);if(this.fileName=`${Kt.imagesDir}${e}`,!this.fileName)throw new J(`Unable to load: ${this.fileName}`);this.loadPromise=new Promise(t=>{this.settleLoadPromise=t}),this.loadImage()}deleteTexture(){var e;this.texture&&((e=l.gl)==null||e.deleteTexture(this.texture)),this.texture=null,this.image=null,this.loaded=!1,this.failed=!1,this.num=0}bind(){var e,t;if(this.failed)throw new J(`Unable to load: ${this.fileName}`);this.loaded&&(!this.texture&&this.image&&(this.texture=((e=l.gl)==null?void 0:e.createTextureFromImage(this.image))??null),this.texture&&((t=l.gl)==null||t.bindTexture(this.texture),this.num=1))}get src(){return this.fileName}get isLoaded(){return this.loaded}get isFailed(){return this.failed}getImage(){return this.image}waitForLoad(){return this.loadPromise}loadImage(){if(typeof Image>"u"){this.failed=!0,this.loaded=!1,this.resolveLoadPromise(!1);return}const e=new Image;e.onload=()=>{this.image=e,this.loaded=!0,this.failed=!1,this.num=1,this.resolveLoadPromise(!0)},e.onerror=()=>{this.failed=!0,this.loaded=!1,this.image=null,this.num=0,this.resolveLoadPromise(!1)},e.src=this.fileName}resolveLoadPromise(e){var t;this.loadPromiseSettled||(this.loadPromiseSettled=!0,(t=this.settleLoadPromise)==null||t.call(this,e))}};s(Kt,"imagesDir","images/");let de=Kt;const H=class H{constructor(){s(this,"hiScore",[]);s(this,"reachedParsec",[]);s(this,"selectedDifficulty",1);s(this,"selectedParsecSlot",0);s(this,"selectedMode",0);this.init()}init(){this.reachedParsec=[],this.hiScore=[];for(let e=0;e<H.MODE_NUM;e++){const t=[],r=[];for(let i=0;i<H.DIFFICULTY_NUM;i++){t.push(0);const n=[];for(let a=0;a<H.REACHED_PARSEC_SLOT_NUM;a++)n.push(0);r.push(n)}this.reachedParsec.push(t),this.hiScore.push(r)}this.selectedDifficulty=1,this.selectedParsecSlot=0,this.selectedMode=0}loadPrevVersionData(e){const t=Ae(e);for(let r=0;r<H.DIFFICULTY_NUM;r++){this.reachedParsec[0][r]=$t(t,["reachedParsec",r]);for(let i=0;i<H.REACHED_PARSEC_SLOT_NUM;i++)this.hiScore[0][r][i]=$t(t,["hiScore",r,i])}this.selectedDifficulty=St(t,"selectedDifficulty"),this.selectedParsecSlot=St(t,"selectedParsecSlot")}load(){try{const e=Cs(H.PREF_FILE);if(!e)throw new Error("No pref data");const t=JSON.parse(e),r=Ae(t),i=St(r,"version");if(i===H.PREV_VERSION_NUM){this.init(),this.loadPrevVersionData(r);return}if(i!==H.VERSION_NUM)throw new Error("Wrong version num");for(let n=0;n<H.MODE_NUM;n++)for(let a=0;a<H.DIFFICULTY_NUM;a++){this.reachedParsec[n][a]=$t(r,["reachedParsec",n,a]);for(let o=0;o<H.REACHED_PARSEC_SLOT_NUM;o++)this.hiScore[n][a][o]=$t(r,["hiScore",n,a,o])}this.selectedDifficulty=St(r,"selectedDifficulty"),this.selectedParsecSlot=St(r,"selectedParsecSlot"),this.selectedMode=St(r,"selectedMode")}catch{this.init()}}save(){const e={version:H.VERSION_NUM,reachedParsec:this.reachedParsec,hiScore:this.hiScore,selectedDifficulty:this.selectedDifficulty,selectedParsecSlot:this.selectedParsecSlot,selectedMode:this.selectedMode};Ps(H.PREF_FILE,JSON.stringify(e))}};s(H,"PREV_VERSION_NUM",10),s(H,"VERSION_NUM",20),s(H,"PREF_FILE","p47.prf"),s(H,"MODE_NUM",2),s(H,"DIFFICULTY_NUM",4),s(H,"REACHED_PARSEC_SLOT_NUM",10);let K=H;function Ae(c){if(typeof c!="object"||c===null||Array.isArray(c))throw new Error("Invalid pref data");return c}function St(c,e){const t=c[e];if(typeof t!="number"||!Number.isFinite(t))throw new Error(`Invalid integer value: ${e}`);return t|0}function $t(c,e){let t=c[e[0]];for(let r=1;r<e.length;r++){const i=e[r];if(!Array.isArray(t))throw new Error(`Invalid array path: ${e.join(".")}`);t=t[i]}if(typeof t!="number"||!Number.isFinite(t))throw new Error(`Invalid integer value: ${e.join(".")}`);return t|0}function Cs(c){return typeof localStorage>"u"?null:localStorage.getItem(c)}function Ps(c,e){typeof localStorage>"u"||localStorage.setItem(c,e)}const W=class W{constructor(){s(this,"pad");s(this,"gameManager");s(this,"prefManager");s(this,"field");s(this,"slotNum",[]);s(this,"startReachedParsec",[]);s(this,"curX",0);s(this,"curY",0);s(this,"mode",0);s(this,"boxCnt",0);s(this,"titleTexture",null);s(this,"padPrsd",!0)}init(e,t,r,i){this.pad=e,this.gameManager=t,this.prefManager=r,this.field=i,this.gameManager.difficulty=r.selectedDifficulty,this.gameManager.parsecSlot=r.selectedParsecSlot,this.gameManager.mode=r.selectedMode,this.titleTexture=new de("title.bmp"),this.slotNum.length=0,this.startReachedParsec.length=0;for(let n=0;n<K.MODE_NUM;n++)this.slotNum.push(Array(K.DIFFICULTY_NUM+1).fill(0)),this.startReachedParsec.push(Array(K.DIFFICULTY_NUM).fill(0))}close(){var e;(e=this.titleTexture)==null||e.deleteTexture(),this.titleTexture=null}async waitForAssets(){return this.titleTexture?this.titleTexture.waitForLoad():!0}start(){for(let e=0;e<K.MODE_NUM;e++){for(let t=0;t<K.DIFFICULTY_NUM;t++)this.slotNum[e][t]=((this.prefManager.reachedParsec[e][t]-1)/10|0)+1,this.startReachedParsec[e][t]=this.slotNum[e][t]*10+1,this.slotNum[e][t]>10&&(this.slotNum[e][t]=10);this.slotNum[e][K.DIFFICULTY_NUM]=1}this.curX=this.gameManager.parsecSlot,this.curY=this.gameManager.difficulty,this.mode=this.gameManager.mode,this.boxCnt=W.BOX_COUNT,this.field.setColor(this.mode)}getStartParsec(e,t){if(t<K.REACHED_PARSEC_SLOT_NUM-1)return t*10+1;let r=this.prefManager.reachedParsec[this.mode][e];return r--,r=(r/10|0)*10,r++,r}move(){const e=this.pad.getDirState();this.padPrsd?e===0&&(this.padPrsd=!1):(e&tt.Dir.DOWN?(this.curY++,this.curY>=this.slotNum[this.mode].length&&(this.curY=0),this.curX>=this.slotNum[this.mode][this.curY]&&(this.curX=this.slotNum[this.mode][this.curY]-1)):e&tt.Dir.UP?(this.curY--,this.curY<0&&(this.curY=this.slotNum[this.mode].length-1),this.curX>=this.slotNum[this.mode][this.curY]&&(this.curX=this.slotNum[this.mode][this.curY]-1)):e&tt.Dir.RIGHT?(this.curX++,this.curX>=this.slotNum[this.mode][this.curY]&&(this.curX=0)):e&tt.Dir.LEFT&&(this.curX--,this.curX<0&&(this.curX=this.slotNum[this.mode][this.curY]-1)),e!==0&&(this.boxCnt=W.BOX_COUNT,this.padPrsd=!0,this.gameManager.startStage(this.curY,this.curX,this.getStartParsec(this.curY,this.curX),this.mode))),this.boxCnt>=0&&this.boxCnt--}setStatus(){this.gameManager.difficulty=this.curY,this.gameManager.parsecSlot=this.curX,this.gameManager.mode=this.mode,this.curY<K.DIFFICULTY_NUM&&(this.prefManager.selectedDifficulty=this.curY,this.prefManager.selectedParsecSlot=this.curX,this.prefManager.selectedMode=this.mode)}changeMode(){this.mode++,this.mode>=K.MODE_NUM&&(this.mode=0),this.curX>=this.slotNum[this.mode][this.curY]&&(this.curX=this.slotNum[this.mode][this.curY]-1),this.field.setColor(this.mode),this.gameManager.startStage(this.curY,this.curX,this.getStartParsec(this.curY,this.curX),this.mode)}drawBox(e,t,r,i){l.setColor(1,1,1,1),w.drawBoxLine(e,t,r,i),l.setColor(1,1,1,.5),w.drawBoxSolid(e,t,r,i)}drawBoxLight(e,t,r,i){l.setColor(1,1,1,.7),w.drawBoxLine(e,t,r,i),l.setColor(1,1,1,.3),w.drawBoxSolid(e,t,r,i)}drawTitleBoard(){var e;(e=this.titleTexture)!=null&&e.isLoaded&&(l.glEnable(l.GL_TEXTURE_2D),this.titleTexture.bind(),w.setColor(1,1,1,1),l.glBegin(l.GL_TRIANGLE_FAN),l.glTexCoord2f(0,0),l.glVertex3f(180,20,0),l.glTexCoord2f(1,0),l.glVertex3f(308,20,0),l.glTexCoord2f(1,1),l.glVertex3f(308,148,0),l.glTexCoord2f(0,1),l.glVertex3f(180,148,0),l.glEnd(),l.glDisable(l.GL_TEXTURE_2D))}draw(){let e,t;const r=W.DIFFICULTY_STR[this.curY];M.drawString(r,470-r.length*14,150,10,M.TO_RIGHT);const i=W.MODE_STR[this.mode];M.drawString(i,470-i.length*14,450,10,M.TO_RIGHT),this.curX>0&&(M.drawString("START AT PARSEC",290,180,6,M.TO_RIGHT),M.drawNum(this.getStartParsec(this.curY,this.curX),470,180,6,M.TO_RIGHT)),this.curY<K.DIFFICULTY_NUM&&M.drawNum(this.prefManager.hiScore[this.mode][this.curY][this.curX],470,210,10,M.TO_RIGHT),t=260;for(let n=0;n<K.DIFFICULTY_NUM+1;n++){e=180;for(let a=0;a<this.slotNum[this.mode][n];a++){if(a===this.curX&&n===this.curY){const o=(W.BOX_COUNT-this.boxCnt)/2|0;this.drawBox(e-o,t-o,W.BOX_SMALL_SIZE+o*2,W.BOX_SMALL_SIZE+o*2),a===0?M.drawString(W.DIFFICULTY_SHORT_STR[n],e+13,t+13,12,M.TO_RIGHT):(M.drawString(W.DIFFICULTY_SHORT_STR[n],e+4,t+13,12,M.TO_RIGHT),a>=K.REACHED_PARSEC_SLOT_NUM-1?M.drawString("X",e+21,t+14,12,M.TO_RIGHT):M.drawNum(a,e+22,t+13,12,M.TO_RIGHT))}else this.drawBoxLight(e,t,W.BOX_SMALL_SIZE,W.BOX_SMALL_SIZE);e+=28}t+=32,n===K.DIFFICULTY_NUM-1&&(t+=15)}this.drawTitleBoard()}};s(W,"BOX_COUNT",16),s(W,"BOX_SMALL_SIZE",24),s(W,"DIFFICULTY_SHORT_STR",["P","N","H","E","Q"]),s(W,"DIFFICULTY_STR",["PRACTICE","NORMAL","HARD","EXTREME","QUIT"]),s(W,"MODE_STR",["ROLL","LOCK"]);let ue=W;const rt=class rt extends ge{constructor(){super(...arguments);s(this,"pos",new T);s(this,"ppos",new T);s(this,"vel",new T);s(this,"z",0);s(this,"mz",0);s(this,"pz",0);s(this,"lumAlp",0);s(this,"cnt",0)}init(t){if(!((Array.isArray(t)?t[0]:t)instanceof ze))throw new Error("Particle.init requires ParticleInitializer");this.pos=new T,this.ppos=new T,this.vel=new T}set(t,r,i,n){i>0?(this.pos.x=t.x+Math.sin(r)*i,this.pos.y=t.y+Math.cos(r)*i):(this.pos.x=t.x,this.pos.y=t.y),this.z=0;const a=rt.rand.nextFloat(.5)+.75;this.vel.x=Math.sin(r)*n*a,this.vel.y=Math.cos(r)*n*a,this.mz=rt.rand.nextSignedFloat(.7),this.cnt=12+rt.rand.nextInt(48),this.lumAlp=.8+rt.rand.nextFloat(.2),this.exists=!0}move(){if(this.cnt--,this.cnt<0){this.exists=!1;return}this.ppos.x=this.pos.x,this.ppos.y=this.pos.y,this.pz=this.z,this.pos.opAddAssign(this.vel),this.vel.opMulAssign(.98),this.z+=this.mz,this.lumAlp*=.98}draw(){l.glVertex3f(this.ppos.x,this.ppos.y,this.pz),l.glVertex3f(this.pos.x,this.pos.y,this.z)}drawLuminous(){this.lumAlp<.2||(l.setColor(rt.R,rt.G,rt.B,this.lumAlp),l.glVertex3f(this.ppos.x,this.ppos.y,this.pz),l.glVertex3f(this.pos.x,this.pos.y,this.z))}};s(rt,"R",1),s(rt,"G",1),s(rt,"B",.5),s(rt,"rand",new it);let jt=rt;class ze{}const ae=1,Is=27,Me=80,ks=16;class Ce extends yt{init(e){}move(){}draw(){}}class Ns extends ge{init(e){}move(){}draw(){}drawLuminous(){}}const D=class D extends yr{constructor(){super(...arguments);s(this,"nowait",!1);s(this,"difficulty",1);s(this,"parsecSlot",0);s(this,"mode",D.ROLL);s(this,"state",D.TITLE);s(this,"ENEMY_MAX",32);s(this,"FIRST_EXTEND",2e5);s(this,"EVERY_EXTEND",5e5);s(this,"LEFT_MAX",4);s(this,"BOSS_WING_NUM",4);s(this,"SLOWDOWN_START_BULLETS_SPEED",[30,42]);s(this,"PAD_BUTTON1",tt.Button.A);s(this,"PAD_BUTTON2",tt.Button.B);s(this,"pad");s(this,"prefManager");s(this,"screen");s(this,"rand");s(this,"field");s(this,"ship");s(this,"enemies");s(this,"particles");s(this,"fragments");s(this,"bullets");s(this,"shots");s(this,"rolls");s(this,"locks");s(this,"bonuses");s(this,"barrageManager");s(this,"stageManager");s(this,"title");s(this,"left",0);s(this,"score",0);s(this,"extendScore",this.FIRST_EXTEND);s(this,"cnt",0);s(this,"pauseCnt",0);s(this,"bossShield",0);s(this,"bossWingShield",Array(this.BOSS_WING_NUM).fill(0));s(this,"interval",0);s(this,"pPrsd",!0);s(this,"btnPrsd",!0);s(this,"screenShakeCnt",0);s(this,"screenShakeIntense",0);s(this,"waitingForBarrageAssets",!0);s(this,"barrageAssetsReady",!1);s(this,"barrageAssetsFailed",!1);s(this,"titleAssetsReady",!1);s(this,"titleAssetsFailed",!1)}init(){var i,n;this.pad=this.input,this.prefManager=this.abstPrefManager,this.screen=this.abstScreen,this.difficulty=this.getPrefValue("selectedDifficulty",1),this.parsecSlot=this.getPrefValue("selectedParsecSlot",0),this.mode=this.getPrefValue("selectedMode",D.ROLL),this.rand=new it,vt.createDisplayLists(),this.field=new vt,this.field.init(),Tt.createDisplayLists(),this.ship=new Tt,this.ship.init(this.pad,this.field,this),this.particles=new Le(128,[new ze],this.hasActorContract(jt)?(()=>new jt):(()=>new Ns)),this.fragments=new Le(128,[new He],()=>new ht),ct.createDisplayLists(),this.bullets=new Lt(512,new Fe(this.field,this.ship)),M.createDisplayLists();const t=new Ve(this.field);this.shots=new Et(32,[t],this.hasActorContract(kt)?(()=>new kt):(()=>new Ce));const r=new Ue(this.ship,this.field,this);this.rolls=new Et(4,[r],this.hasActorContract(It)?(()=>new It):(()=>new Ce)),Pt.init(),this.locks=new Et(4,[new Ge(this.ship,this.field,this)],()=>new Pt),this.enemies=new Et(this.ENEMY_MAX,[new $e(this.field,this.bullets,this.shots,this.rolls,this.locks,this.ship,this)],()=>new xt),at.init(),this.bonuses=new Et(128,[new _e(this.field,this.ship,this)],()=>new at),this.barrageManager=new F,j.init(this.barrageManager),this.barrageManager.loadBulletMLs().then(()=>{this.onBarrageAssetsReady(!1)}).catch(a=>{const o=a instanceof Error?a:new Error(String(a));Rt.error(o),this.onBarrageAssetsReady(!0)}),this.stageManager=new ce,this.stageManager.init(this,this.barrageManager,this.field),this.title=new ue,this.title.init(this.pad,this,this.prefManager,this.field),(n=(i=this.title).waitForAssets)==null||n.call(i).then(a=>{this.onTitleAssetsReady(a===!1)}).catch(a=>{const o=a instanceof Error?a:new Error(String(a));Rt.error(o),this.onTitleAssetsReady(!0)}),this.interval=this.mainLoop.INTERVAL_BASE,P.init(this)}start(){if(this.assetsReady()){this.waitingForBarrageAssets=!1,this.startTitle();return}this.waitingForBarrageAssets=!0,this.state=D.TITLE,this.cnt=0,gt.haltMusic()}close(){this.barrageManager.unloadBulletMLs(),this.title.close(),P.close(),M.deleteDisplayLists(),vt.deleteDisplayLists(),Tt.deleteDisplayLists(),ct.deleteDisplayLists()}addScore(t){this.score+=t,this.score>this.extendScore&&(this.left<this.LEFT_MAX&&(P.playSe(P.EXTEND),this.left++),this.extendScore<=this.FIRST_EXTEND?this.extendScore=this.EVERY_EXTEND:this.extendScore+=this.EVERY_EXTEND)}shipDestroyed(){this.mode===D.ROLL?this.releaseRoll():this.releaseLock(),this.clearBullets(),this.left--,this.left<0&&this.startGameover()}addParticle(t,r,i,n){var o;const a=this.particles.getInstanceForced();a.exists=!0,(o=a.set)==null||o.call(a,t,r,i,n)}addFragments(t,r,i,n,a,o,h,u){var d;for(let m=0;m<t;m++){const b=this.fragments.getInstanceForced();b.exists=!0,(d=b.set)==null||d.call(b,r,i,n,a,o,h,u)}}addEnemy(t,r,i,n){var o;const a=this.enemies.getInstance();a&&((o=a.set)==null||o.call(a,t,r,i,n),a.exists=!0)}clearBullets(){var t;for(let r=0;r<this.bullets.actor.length;r++){const i=this.bullets.actor[r];i.exists&&((t=i.toRetro)==null||t.call(i))}}addBoss(t,r,i){var a;const n=this.enemies.getInstance();n&&((a=n.setBoss)==null||a.call(n,t,r,i),n.exists=!0)}addShot(t,r){const i=this.shots.getInstance();i&&(this.callIfFunction(i,"set",t,r),i.exists=!0)}addRoll(){const t=this.rolls.getInstance();t&&(this.callIfFunction(t,"set"),t.exists=!0)}addLock(){const t=this.locks.getInstance();t&&(this.callIfFunction(t,"set"),t.exists=!0)}releaseRoll(){for(let t=0;t<this.rolls.actor.length;t++){const r=this.rolls.actor[t];r.exists&&(r.released=!0)}}releaseLock(){for(let t=0;t<this.locks.actor.length;t++){const r=this.locks.actor[t];r.exists&&(r.released=!0)}}addBonus(t,r,i){for(let n=0;n<i;n++){const a=this.bonuses.getInstance();if(!a)return;this.callIfFunction(a,"set",t,r),a.exists=!0}}setBossShieldMeter(t,r,i,n,a,o){const h=o*.7;this.bossShield=t*h|0,this.bossWingShield[0]=r*h|0,this.bossWingShield[1]=i*h|0,this.bossWingShield[2]=n*h|0,this.bossWingShield[3]=a*h|0}startStage(t,r,i,n){this.enemies.clear(),this.bullets.clear(),this.difficulty=t,this.parsecSlot=r,this.mode=n;const a=this.rand.nextInt(99999);switch(t){case D.PRACTICE:this.stageManager.setRank(1,4,i,a),this.ship.setSpeedRate(.7),at.setSpeedRate(.6);break;case D.NORMAL:this.stageManager.setRank(10,8,i,a),this.ship.setSpeedRate(.9),at.setSpeedRate(.8);break;case D.HARD:this.stageManager.setRank(22,12,i,a),this.ship.setSpeedRate(1),at.setSpeedRate(1);break;case D.EXTREME:this.stageManager.setRank(36,16,i,a),this.ship.setSpeedRate(1.2),at.setSpeedRate(1.3);break;case D.QUIT:default:this.stageManager.setRank(0,0,0,0),this.ship.setSpeedRate(1),at.setSpeedRate(1);break}}setScreenShake(t,r){this.screenShakeCnt=t,this.screenShakeIntense=r}move(){if(this.pad.keys[Is]===ae){this.mainLoop.breakLoop();return}if(this.waitingForBarrageAssets){this.cnt++;return}switch(this.state){case D.IN_GAME:this.inGameMove();break;case D.TITLE:this.titleMove();break;case D.GAMEOVER:this.gameoverMove();break;case D.PAUSE:this.pauseMove();break}this.cnt++}draw(){var r,i,n,a,o,h,u,d,m,b,g,L,S,v,N,O;const t=this.mainLoop.event;if(t.type===ks){const G=((r=t.resize)==null?void 0:r.w)??0,U=((i=t.resize)==null?void 0:i.h)??0;G>150&&U>100&&this.screen.resized(G,U)}if(this.waitingForBarrageAssets){(a=(n=this.screen).viewOrthoFixed)==null||a.call(n),this.drawLoadingStatus(),(h=(o=this.screen).viewPerspective)==null||h.call(o);return}switch((d=(u=this.screen).startRenderToTexture)==null||d.call(u),l.glPushMatrix(),this.setEyepos(),this.state){case D.IN_GAME:case D.PAUSE:this.inGameDrawLuminous();break;case D.TITLE:this.titleDrawLuminous();break;case D.GAMEOVER:this.gameoverDrawLuminous();break}switch(l.glPopMatrix(),(b=(m=this.screen).endRenderToTexture)==null||b.call(m),this.screen.clear(),l.glPushMatrix(),this.setEyepos(),this.state){case D.IN_GAME:case D.PAUSE:this.inGameDraw();break;case D.TITLE:this.titleDraw();break;case D.GAMEOVER:this.gameoverDraw();break}switch(l.glPopMatrix(),(L=(g=this.screen).drawLuminous)==null||L.call(g),(v=(S=this.screen).viewOrthoFixed)==null||v.call(S),this.state){case D.IN_GAME:this.inGameDrawStatus();break;case D.TITLE:this.titleDrawStatus();break;case D.GAMEOVER:this.gameoverDrawStatus();break;case D.PAUSE:this.pauseDrawStatus();break}(O=(N=this.screen).viewPerspective)==null||O.call(N)}onBarrageAssetsReady(t){this.barrageAssetsReady=!0,this.barrageAssetsFailed=t,this.tryLeaveAssetLoading()}onTitleAssetsReady(t){this.titleAssetsReady=!0,this.titleAssetsFailed=t,this.tryLeaveAssetLoading()}tryLeaveAssetLoading(){this.assetsReady()&&this.waitingForBarrageAssets&&(this.waitingForBarrageAssets=!1,this.startTitle())}assetsReady(){return this.barrageAssetsReady&&this.titleAssetsReady}initShipState(){this.left=2,this.score=0,this.extendScore=this.FIRST_EXTEND,this.ship.start()}startInGame(){this.state=D.IN_GAME,this.initShipState(),this.startStage(this.difficulty,this.parsecSlot,this.getStartParsec(this.difficulty,this.parsecSlot),this.mode)}startTitle(){var t,r;this.state=D.TITLE,(r=(t=this.title).start)==null||r.call(t),this.initShipState(),this.bullets.clear(),this.ship.cnt=0,this.startStage(this.difficulty,this.parsecSlot,this.getStartParsec(this.difficulty,this.parsecSlot),this.mode),this.cnt=0,gt.haltMusic()}startGameover(){this.state=D.GAMEOVER,this.bonuses.clear(),this.shots.clear(),this.rolls.clear(),this.locks.clear(),this.setScreenShake(0,0),this.mainLoop.interval=this.interval=this.mainLoop.INTERVAL_BASE,this.cnt=0;const t=this.getHiScore(this.mode,this.difficulty,this.parsecSlot);this.score>t&&this.setHiScore(this.mode,this.difficulty,this.parsecSlot,this.score);const r=this.stageManager.parsec??0;r>this.getReachedParsec(this.mode,this.difficulty)&&this.setReachedParsec(this.mode,this.difficulty,r),gt.fadeMusic()}startPause(){this.state=D.PAUSE,this.pauseCnt=0}resumePause(){this.state=D.IN_GAME}stageMove(){var t,r;(r=(t=this.stageManager).move)==null||r.call(t)}inGameMove(){if(this.stageMove(),this.field.move(),this.callIfFunction(this.ship,"move"),this.bonuses.move(),this.shots.move(),this.enemies.move(),this.mode===D.ROLL?this.rolls.move():this.locks.move(),ct.resetTotalBulletsSpeed(),this.bullets.move(),this.particles.move(),this.fragments.move(),this.moveScreenShake(),this.pad.keys[Me]===ae?this.pPrsd||(this.pPrsd=!0,this.startPause()):this.pPrsd=!1,!this.nowait){const t=this.SLOWDOWN_START_BULLETS_SPEED[this.mode]??this.SLOWDOWN_START_BULLETS_SPEED[0];if(ct.totalBulletsSpeed>t){let r=ct.totalBulletsSpeed/t;r>1.75&&(r=1.75),this.interval+=(r*this.mainLoop.INTERVAL_BASE-this.interval)*.1}else this.interval+=(this.mainLoop.INTERVAL_BASE-this.interval)*.08;this.mainLoop.interval=this.interval}}titleMove(){var t,r,i,n,a,o;if((r=(t=this.title).move)==null||r.call(t),this.cnt<=8)this.btnPrsd=!0;else{const h=this.pad.getButtonState();if((h&this.PAD_BUTTON1)!==0){if(!this.btnPrsd){(n=(i=this.title).setStatus)==null||n.call(i),this.difficulty>=4?this.mainLoop.breakLoop():this.startInGame();return}}else(h&this.PAD_BUTTON2)!==0?this.btnPrsd||((o=(a=this.title).changeMode)==null||o.call(a),this.btnPrsd=!0):this.btnPrsd=!1}this.stageMove(),this.field.move(),this.enemies.move(),this.bullets.move()}gameoverMove(){let t=!1;this.cnt<=64?this.btnPrsd=!0:(this.pad.getButtonState()&(this.PAD_BUTTON1|this.PAD_BUTTON2))!==0?this.btnPrsd||(t=!0):this.btnPrsd=!1,this.cnt>64&&t?this.startTitle():this.cnt>500&&this.startTitle(),this.field.move(),this.enemies.move(),this.bullets.move(),this.particles.move(),this.fragments.move()}pauseMove(){this.pauseCnt++,this.pad.keys[Me]===ae?this.pPrsd||(this.pPrsd=!0,this.resumePause()):this.pPrsd=!1}inGameDraw(){this.field.draw(),w.setRetroColor(.2,.7,.5,1),l.glBlendFunc(l.GL_SRC_ALPHA,l.GL_ONE_MINUS_SRC_ALPHA),this.bonuses.draw(),l.glBlendFunc(l.GL_SRC_ALPHA,l.GL_ONE),l.setColor(.3,.7,1,1),l.glBegin(l.GL_LINES),this.particles.draw(),l.glEnd(),w.setRetroColor(ht.R,ht.G,ht.B,1),this.fragments.draw(),w.setRetroZ(0),this.callIfFunction(this.ship,"draw"),w.setRetroColor(.8,.8,.2,.8),this.shots.draw(),w.setRetroColor(1,.8,.5,1),this.mode===D.ROLL?this.rolls.draw():this.locks.draw(),this.enemies.draw(),this.bullets.draw()}titleDraw(){this.field.draw(),this.enemies.draw(),this.bullets.draw()}gameoverDraw(){this.field.draw(),l.setColor(.3,.7,1,1),l.glBegin(l.GL_LINES),this.particles.draw(),l.glEnd(),w.setRetroColor(ht.R,ht.G,ht.B,1),this.fragments.draw(),w.setRetroZ(0),this.enemies.draw(),this.bullets.draw()}inGameDrawLuminous(){l.glBegin(l.GL_LINES),this.particles.drawLuminous(),this.fragments.drawLuminous(),l.glEnd()}titleDrawLuminous(){}gameoverDrawLuminous(){l.glBegin(l.GL_LINES),this.particles.drawLuminous(),this.fragments.drawLuminous(),l.glEnd()}drawBoard(t,r,i,n){l.setColor(0,0,0,1),l.glBegin(l.GL_QUADS),l.glVertexXYZ(t,r,0),l.glVertexXYZ(t+i,r,0),l.glVertexXYZ(t+i,r+n,0),l.glVertexXYZ(t,r+n,0),l.glEnd()}drawSideBoards(){l.glDisable(l.GL_BLEND),this.drawBoard(0,0,160,480),this.drawBoard(480,0,160,480),l.glEnable(l.GL_BLEND)}drawScore(){M.drawNum(this.score,120,28,25,M.TO_UP),M.drawNum(at.bonusScore,24,20,12,M.TO_UP)}drawLeft(){this.left<0||(M.drawString("LEFT",520,260,25,M.TO_DOWN),M.changeColor(M.RED),M.drawNum(this.left,520,450,25,M.TO_DOWN),M.changeColor(M.WHITE))}drawParsec(){const t=this.stageManager.parsec??0;t<10?M.drawNum(t,600,26,25,M.TO_DOWN):t<100?M.drawNum(t,600,68,25,M.TO_DOWN):M.drawNum(t,600,110,25,M.TO_DOWN)}drawBox(t,r,i,n){i<=0||(l.setColor(1,1,1,.5),w.drawBoxSolid(t,r,i,n),l.setColor(1,1,1,1),w.drawBoxLine(t,r,i,n))}drawBossShieldMeter(){this.drawBox(165,6,this.bossShield,6);let t=24;for(let r=0;r<this.BOSS_WING_NUM;r++)switch(r%2){case 0:this.drawBox(165,t,this.bossWingShield[r],6);break;case 1:this.drawBox(475-this.bossWingShield[r],t,this.bossWingShield[r],6),t+=12;break}}drawSideInfo(){this.drawSideBoards(),this.drawScore(),this.drawLeft(),this.drawParsec()}inGameDrawStatus(){this.drawSideInfo(),this.stageManager.bossSection&&this.drawBossShieldMeter()}titleDrawStatus(){var t,r;this.drawSideBoards(),this.drawScore(),(r=(t=this.title).draw)==null||r.call(t)}gameoverDrawStatus(){this.drawSideInfo(),this.cnt>64&&M.drawString("GAME OVER",220,200,15,M.TO_RIGHT)}pauseDrawStatus(){this.drawSideInfo(),this.pauseCnt%60<30&&M.drawString("PAUSE",280,220,12,M.TO_RIGHT)}drawLoadingStatus(){this.drawSideBoards(),M.drawString("LOADING ASSETS",234,192,10,M.TO_RIGHT),M.drawString(this.barrageAssetsReady?"BULLETML: OK":"BULLETML: ...",230,224,8,M.TO_RIGHT),M.drawString(this.titleAssetsReady?"TITLE BMP: OK":"TITLE BMP: ...",230,250,8,M.TO_RIGHT),(this.barrageAssetsFailed||this.titleAssetsFailed)&&(M.changeColor(M.RED),M.drawString("LOAD FAILED",252,286,10,M.TO_RIGHT),M.changeColor(M.WHITE))}moveScreenShake(){this.screenShakeCnt>0&&this.screenShakeCnt--}setEyepos(){let t=0,r=0;this.screenShakeCnt>0&&(t=this.rand.nextSignedFloat(this.screenShakeIntense*(this.screenShakeCnt+10)),r=this.rand.nextSignedFloat(this.screenShakeIntense*(this.screenShakeCnt+10))),l.glTranslatef(t,r,-this.field.eyeZ)}getStartParsec(t,r){return this.title.getStartParsec?this.title.getStartParsec(t,r):r*10+1}getPrefValue(t,r){const i=this.prefManager[t];return typeof i=="number"?i:r}getHiScore(t,r,i){const n=this.prefManager.hiScore;if(typeof n=="number")return n;if(!Array.isArray(n))return 0;const a=n[t];if(!Array.isArray(a))return 0;const o=a[r];if(!Array.isArray(o))return 0;const h=o[i];return typeof h=="number"?h:0}setHiScore(t,r,i,n){const a=this.prefManager;if(typeof a.hiScore=="number"){a.hiScore=n;return}if(!Array.isArray(a.hiScore))return;const o=a.hiScore[t];if(!Array.isArray(o))return;const h=o[r];Array.isArray(h)&&(h[i]=n)}getReachedParsec(t,r){const i=this.prefManager.reachedParsec;if(!Array.isArray(i))return 0;const n=i[t];if(!Array.isArray(n))return 0;const a=n[r];return typeof a=="number"?a:0}setReachedParsec(t,r,i){const n=this.prefManager;if(!Array.isArray(n.reachedParsec))return;const a=n.reachedParsec[t];Array.isArray(a)&&(a[r]=i)}hasActorContract(t){const r=t.prototype;return r?typeof r.init=="function"&&typeof r.move=="function"&&typeof r.draw=="function":!1}callIfFunction(t,r,...i){const n=t[r];typeof n=="function"&&n.apply(t,i)}};s(D,"ROLL",0),s(D,"LOCK",1),s(D,"TITLE",0),s(D,"IN_GAME",1),s(D,"GAMEOVER",2),s(D,"PAUSE",3),s(D,"PRACTICE",0),s(D,"NORMAL",1),s(D,"HARD",2),s(D,"EXTREME",3),s(D,"QUIT",4);let wt=D,Pe=null,Ct=null,Wt=null,Ie=null,qt=null;function Ds(c){Pe=new w,Ct=new tt;try{Ct.openJoystick()}catch{}Wt=new wt,Ie=new K,qt=new tr(Pe,Ct,Wt,Ie);try{Bs(c)}catch{return 1}return qt.loop(),0}function Bs(c){const e=c[0]??"p47-web";for(let t=1;t<c.length;t++)switch(c[t]){case"-brightness":{t>=c.length-1&&Mt(e),t++;const r=parseInt(c[t],10)/100;r>=0&&r<=1||Mt(e),l.brightness=r;break}case"-luminous":{t>=c.length-1&&Mt(e),t++;const r=parseInt(c[t],10)/100;r>=0&&r<=1||Mt(e),w.luminous=r;break}case"-nosound":z.noSound=!0;break;case"-window":l.windowMode=!0;break;case"-reverse":Ct&&(Ct.buttonReversed=!0);break;case"-lowres":l.width=320,l.height=240;break;case"-nowait":Wt&&(Wt.nowait=!0);break;case"-accframe":qt&&(qt.accframe=1);break;case"-slowship":Tt.isSlow=!0;break;default:Mt(e)}}function Os(c){Rt.error(`Usage: ${c} [-brightness [0-100]] [-luminous [0-100]] [-nosound] [-window] [-reverse] [-lowres] [-slowship] [-nowait] [-accframe]`)}function Mt(c){throw Os(c),new Error("Invalid options")}Ds(["p47-web"]);
