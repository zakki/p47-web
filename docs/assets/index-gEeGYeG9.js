var $e=Object.defineProperty;var ze=(c,e,t)=>e in c?$e(c,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):c[e]=t;var s=(c,e,t)=>ze(c,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const l of n.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&r(l)}).observe(document,{childList:!0,subtree:!0});function t(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function r(i){if(i.ep)return;i.ep=!0;const n=t(i);fetch(i.href,n)}})();class At{static info(e,t=!0){t?console.info(e):process.stderr.write(e)}static infoNumber(e,t=!0){t?console.info(String(e)):process.stderr.write(`${e} `)}static error(e){if(typeof e=="string"){console.error(`Error: ${e}`);return}console.error(`Error: ${e.toString()}`)}}class J extends Error{constructor(e){super(e),this.name="SDLInitFailedException"}}class pe extends Error{constructor(e){super(e),this.name="SDLException"}}var U;let $=(U=class{static init(){if(!U.noSound&&!(typeof AudioContext>"u"))try{U.audioContext||(U.audioContext=new AudioContext),U.bindUnlockHandlers()}catch{throw U.noSound=!0,new J("Unable to initialize audio")}}static close(){U.noSound||U.audioContext&&U.audioContext.suspend()}static getContext(){return U.audioContext}static unlock(){!U.audioContext||U.unlocked||(U.audioContext.resume(),U.unlocked=U.audioContext.state==="running")}static bindUnlockHandlers(){if(U.unlockHandlersBound||typeof window>"u")return;U.unlockHandlersBound=!0;const e=()=>{U.unlock(),U.unlocked&&(window.removeEventListener("pointerdown",e),window.removeEventListener("keydown",e))};window.addEventListener("pointerdown",e),window.addEventListener("keydown",e)}},s(U,"noSound",!1),s(U,"audioContext",null),s(U,"unlocked",!1),s(U,"unlockHandlersBound",!1),U);const et=class et{constructor(){s(this,"audio",null);s(this,"gain",null);s(this,"source",null);s(this,"music",null)}load(e){if($.noSound)return;const t=`${et.dir}/${e}`;if(this.music=t,typeof Audio<"u"){this.audio=new Audio(t),this.audio.preload="auto",this.audio.loop=!0;const r=$.getContext();r&&(this.source=r.createMediaElementSource(this.audio),this.gain=r.createGain(),this.gain.gain.value=1,this.source.connect(this.gain),this.gain.connect(r.destination))}else if(!this.music)throw new pe(`Couldn't load: ${t}`)}free(){var e,t;this.halt(),(e=this.source)==null||e.disconnect(),(t=this.gain)==null||t.disconnect(),this.source=null,this.gain=null,this.audio=null,this.music=null}play(){$.noSound||($.unlock(),this.audio&&(this.audio.loop=!0,this.audio.currentTime=0,this.audio.play().catch(()=>{}),et.active.add(this)))}playOnce(){$.noSound||($.unlock(),this.audio&&(this.audio.loop=!1,this.audio.currentTime=0,this.audio.play().catch(()=>{}),et.active.add(this)))}fade(){et.fadeMusic()}halt(){et.haltMusic()}static fadeMusic(){if($.noSound)return;const e=$.getContext();if(e){const t=e.currentTime;for(const r of et.active)r.gain&&(r.gain.gain.cancelScheduledValues(t),r.gain.gain.setValueAtTime(r.gain.gain.value,t),r.gain.gain.linearRampToValueAtTime(0,t+.4));return}for(const t of et.active)t.audio&&(t.audio.volume=Math.max(0,t.audio.volume-.3))}static haltMusic(){if(!$.noSound){for(const e of et.active)e.audio&&(e.audio.pause(),e.audio.currentTime=0,e.audio.volume=1,e.gain&&(e.gain.gain.value=1));et.active.clear()}}};s(et,"fadeOutSpeed",1280),s(et,"dir","sounds/musics"),s(et,"active",new Set);let wt=et;const qt=class qt{constructor(){s(this,"chunk",null);s(this,"players",[]);s(this,"nextPlayerIdx",0);s(this,"maxPlayers",8);s(this,"chunkChannel",0)}load(e,t=0){if($.noSound)return;const r=`${qt.dir}/${e}`;if(this.chunk=r,this.players=[],this.nextPlayerIdx=0,typeof Audio>"u"&&!this.chunk)throw new pe(`Couldn't load: ${r}`);this.chunkChannel=t}free(){this.chunk&&(this.halt(),this.chunk=null,this.players=[])}play(){if($.noSound||($.unlock(),!this.chunk||typeof Audio>"u"))return;const e=this.acquirePlayer();e&&(e.currentTime=0,e.play().catch(()=>{}),this.chunkChannel)}halt(){if(!$.noSound)for(const e of this.players)e.pause(),e.currentTime=0}fade(){this.halt()}acquirePlayer(){for(let t=0;t<this.players.length;t++){const r=this.players[t];if(r.ended||r.paused)return r}if(this.players.length<this.maxPlayers){const t=new Audio(this.chunk);return t.preload="auto",this.players.push(t),t}const e=this.players[this.nextPlayerIdx];return this.nextPlayerIdx=(this.nextPlayerIdx+1)%this.players.length,e.pause(),e}};s(qt,"dir","sounds/chunks");let zt=qt;class Xe{constructor(){s(this,"frameCount",0);s(this,"updateCount",0);s(this,"droppedFrameCount",0);s(this,"totalFrameMs",0);s(this,"worstFrameMs",0);s(this,"lastUpdatedMs",0)}reset(e){this.frameCount=0,this.updateCount=0,this.droppedFrameCount=0,this.totalFrameMs=0,this.worstFrameMs=0,this.lastUpdatedMs=e}recordFrame(e,t,r){const i=Number.isFinite(e)?Math.max(0,e):0,n=Math.max(0,t|0);this.frameCount++,this.updateCount+=n,n>1&&(this.droppedFrameCount+=n-1),this.totalFrameMs+=i,i>this.worstFrameMs&&(this.worstFrameMs=i),this.lastUpdatedMs=r}getSnapshot(){const e=this.frameCount>0?this.totalFrameMs/this.frameCount:0,t=e>0?1e3/e:0;return{frames:this.frameCount,updates:this.updateCount,droppedFrames:this.droppedFrameCount,avgFrameMs:e,worstFrameMs:this.worstFrameMs,avgFps:t,updatedAtMs:this.lastUpdatedMs}}}class me{constructor(e){s(this,"gl");s(this,"program");s(this,"posBuffer");s(this,"texCoordBuffer");s(this,"colorBuffer");s(this,"posLoc");s(this,"texCoordLoc");s(this,"colorAttrLoc");s(this,"matrixMode",5888);s(this,"modelView",ut());s(this,"projection",ut());s(this,"mvp",ut());s(this,"mvpDirty",!0);s(this,"modelViewStack",[]);s(this,"projectionStack",[]);s(this,"drawColor",[1,1,1,1]);s(this,"clearColor",[0,0,0,1]);s(this,"width",1);s(this,"height",1);s(this,"immediateMode",null);s(this,"immediateVertices",[]);s(this,"blendMode","alpha");s(this,"pointSize",1);s(this,"pointSizeLoc");s(this,"mvpLoc");s(this,"useTextureLoc");s(this,"samplerLoc");s(this,"textureEnabled",!1);s(this,"boundTexture",null);s(this,"currentTexU",0);s(this,"currentTexV",0);s(this,"immediateTexCoords",[]);s(this,"immediateColors",[]);s(this,"drawVerticesBuffer",new Float32Array(0));s(this,"drawTexCoordsBuffer",new Float32Array(0));s(this,"drawColorsBuffer",new Float32Array(0));s(this,"matrixMulScratch",new Float32Array(16));s(this,"activeRenderTarget",null);this.gl=e,this.program=this.createProgram();const t=e.createBuffer(),r=e.createBuffer(),i=e.createBuffer();if(!t)throw new J("Unable to create WebGL vertex buffer");if(!r)throw new J("Unable to create WebGL texture coord buffer");if(!i)throw new J("Unable to create WebGL color buffer");this.posBuffer=t,this.texCoordBuffer=r,this.colorBuffer=i;const n=e.getAttribLocation(this.program,"aPosition"),l=e.getAttribLocation(this.program,"aTexCoord"),a=e.getAttribLocation(this.program,"aColor");if(n<0)throw new J("Unable to resolve shader attribute aPosition");if(l<0)throw new J("Unable to resolve shader attribute aTexCoord");if(a<0)throw new J("Unable to resolve shader attribute aColor");this.posLoc=n,this.texCoordLoc=l,this.colorAttrLoc=a;const h=e.getUniformLocation(this.program,"uPointSize"),d=e.getUniformLocation(this.program,"uMvp"),u=e.getUniformLocation(this.program,"uUseTexture"),f=e.getUniformLocation(this.program,"uSampler");if(!h||!d||!u||!f)throw new J("Unable to resolve shader uniforms");this.pointSizeLoc=h,this.mvpLoc=d,this.useTextureLoc=u,this.samplerLoc=f,e.useProgram(this.program),e.enableVertexAttribArray(this.posLoc),e.enableVertexAttribArray(this.texCoordLoc),e.enableVertexAttribArray(this.colorAttrLoc),e.bindBuffer(e.ARRAY_BUFFER,this.posBuffer),e.vertexAttribPointer(this.posLoc,4,e.FLOAT,!1,0,0),e.bindBuffer(e.ARRAY_BUFFER,this.texCoordBuffer),e.vertexAttribPointer(this.texCoordLoc,2,e.FLOAT,!1,0,0),e.bindBuffer(e.ARRAY_BUFFER,this.colorBuffer),e.vertexAttribPointer(this.colorAttrLoc,4,e.FLOAT,!1,0,0),e.uniform1i(this.samplerLoc,0),e.enable(e.BLEND),this.applyBlendMode(),e.clearColor(this.clearColor[0],this.clearColor[1],this.clearColor[2],this.clearColor[3])}static create(e){const t=e.getContext("webgl",{alpha:!1,antialias:!1,depth:!0,stencil:!1,preserveDrawingBuffer:!1});if(!t)throw new J("Unable to initialize WebGL context");return new me(t)}resize(e,t){this.width=Math.max(1,e),this.height=Math.max(1,t),this.gl.viewport(0,0,this.width,this.height)}setViewport(e,t){this.gl.viewport(0,0,Math.max(1,e),Math.max(1,t))}clear(){this.gl.clearColor(this.clearColor[0],this.clearColor[1],this.clearColor[2],this.clearColor[3]),this.gl.clear(this.gl.COLOR_BUFFER_BIT|this.gl.DEPTH_BUFFER_BIT)}flush(){this.gl.flush()}setDrawColor(e,t,r,i){this.drawColor=[ft(e),ft(t),ft(r),ft(i)]}setClearColor(e,t,r,i){this.clearColor=[ft(e),ft(t),ft(r),ft(i)]}setBlendMode(e){this.blendMode=e,this.applyBlendMode()}translate(e){this.translateXYZ(e.x,e.y,e.z)}setMatrixMode(e){(e===5888||e===5889)&&(this.matrixMode=e)}loadIdentity(){this.setCurrentMatrix(ut())}pushMatrix(){if(this.matrixMode===5889){this.projectionStack.push(ye(this.projection));return}this.modelViewStack.push(ye(this.modelView))}popMatrix(){if(this.matrixMode===5889){const t=this.projectionStack.pop();if(!t)return;this.projection=t,this.mvpDirty=!0;return}const e=this.modelViewStack.pop();e&&(this.modelView=e,this.mvpDirty=!0)}translateXYZ(e,t,r=0){const i=this.getCurrentMatrix();We(i,e,t,r),this.mvpDirty=!0}scaleXYZ(e,t,r=1){const i=this.getCurrentMatrix();Ze(i,e,t,r),this.mvpDirty=!0}rotateDeg(e,t=0,r=0,i=1){this.mulCurrentMatrix(Ke(e,t,r,i))}frustum(e,t,r,i,n,l){this.mulCurrentMatrix(Qe(e,t,r,i,n,l))}ortho(e,t,r,i,n,l){this.mulCurrentMatrix(Je(e,t,r,i,n,l))}lookAt(e,t,r,i,n,l,a,h,d){this.mulCurrentMatrix(tr(e,t,r,i,n,l,a,h,d))}begin(e){this.immediateMode=e,this.immediateVertices.length=0,this.immediateTexCoords.length=0,this.immediateColors.length=0}vertex(e){this.vertexXYZ(e.x,e.y,e.z)}vertexXYZ(e,t,r=0){if(!this.immediateMode){this.drawVertex(e,t,r);return}this.immediateVertices.push(e,t,r,1),this.immediateTexCoords.push(this.currentTexU,this.currentTexV),this.immediateColors.push(this.drawColor[0],this.drawColor[1],this.drawColor[2],this.drawColor[3])}end(){if(!this.immediateMode||this.immediateVertices.length===0){this.immediateMode=null,this.immediateVertices.length=0,this.immediateTexCoords.length=0,this.immediateColors.length=0;return}this.drawImmediate(this.immediateMode,this.immediateVertices,this.immediateTexCoords,this.immediateColors),this.immediateMode=null,this.immediateVertices.length=0,this.immediateTexCoords.length=0,this.immediateColors.length=0}drawArraysXYZC(e,t,r){const i=this.createPackedDrawCall(e,t,r);i&&this.drawPacked(i.mode,i.count,i.vertices,i.texCoords,i.colors)}createStaticMeshXYZC(e,t,r){const i=this.createPackedDrawCall(e,t,r);if(!i)return null;const n=this.gl,l=n.createBuffer(),a=n.createBuffer(),h=n.createBuffer();return!l||!a||!h?(l&&n.deleteBuffer(l),a&&n.deleteBuffer(a),h&&n.deleteBuffer(h),null):(n.bindBuffer(n.ARRAY_BUFFER,l),n.bufferData(n.ARRAY_BUFFER,i.vertices,n.STATIC_DRAW),n.bindBuffer(n.ARRAY_BUFFER,a),n.bufferData(n.ARRAY_BUFFER,i.texCoords,n.STATIC_DRAW),n.bindBuffer(n.ARRAY_BUFFER,h),n.bufferData(n.ARRAY_BUFFER,i.colors,n.STATIC_DRAW),{mode:i.mode,count:i.count,posBuffer:l,texCoordBuffer:a,colorBuffer:h})}drawStaticMesh(e){if(e.count<=0)return;const t=this.gl;this.prepareDraw(),t.bindBuffer(t.ARRAY_BUFFER,e.posBuffer),t.vertexAttribPointer(this.posLoc,4,t.FLOAT,!1,0,0),t.bindBuffer(t.ARRAY_BUFFER,e.texCoordBuffer),t.vertexAttribPointer(this.texCoordLoc,2,t.FLOAT,!1,0,0),t.bindBuffer(t.ARRAY_BUFFER,e.colorBuffer),t.vertexAttribPointer(this.colorAttrLoc,4,t.FLOAT,!1,0,0),t.drawArrays(e.mode,0,e.count)}deleteStaticMesh(e){const t=this.gl;t.deleteBuffer(e.posBuffer),t.deleteBuffer(e.texCoordBuffer),t.deleteBuffer(e.colorBuffer)}drawVertex(e,t,r=0){this.begin("points"),this.vertexXYZ(e,t,r),this.end()}setPointSize(e){this.pointSize=Math.max(1,e)}enable(e){const t=this.gl;if(e===t.BLEND){t.enable(t.BLEND);return}if(e===t.DEPTH_TEST){t.enable(t.DEPTH_TEST);return}if(e===t.TEXTURE_2D){this.textureEnabled=!0;return}}disable(e){const t=this.gl;if(e===t.BLEND){t.disable(t.BLEND);return}if(e===t.DEPTH_TEST){t.disable(t.DEPTH_TEST);return}if(e===t.TEXTURE_2D){this.textureEnabled=!1;return}}createTextureFromImage(e){const t=this.gl,r=t.createTexture();return r?(t.bindTexture(t.TEXTURE_2D,r),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,1),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,t.RGBA,t.UNSIGNED_BYTE,e),t.bindTexture(t.TEXTURE_2D,null),r):null}bindTexture(e){this.boundTexture=e,this.gl.bindTexture(this.gl.TEXTURE_2D,e)}texCoord2f(e,t){this.currentTexU=e,this.currentTexV=t}deleteTexture(e){this.boundTexture===e&&(this.boundTexture=null),this.gl.deleteTexture(e)}close(){const e=this.gl;e.deleteBuffer(this.posBuffer),e.deleteBuffer(this.texCoordBuffer),e.deleteBuffer(this.colorBuffer),e.deleteProgram(this.program)}createRenderTarget(e,t){const r=this.gl,i=Math.max(1,e),n=Math.max(1,t),l=r.createTexture(),a=r.createFramebuffer();if(!l||!a)return l&&r.deleteTexture(l),a&&r.deleteFramebuffer(a),null;r.bindTexture(r.TEXTURE_2D,l),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MAG_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE),r.texImage2D(r.TEXTURE_2D,0,r.RGBA,i,n,0,r.RGBA,r.UNSIGNED_BYTE,null),r.bindFramebuffer(r.FRAMEBUFFER,a),r.framebufferTexture2D(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,l,0);const h=r.checkFramebufferStatus(r.FRAMEBUFFER);return r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindTexture(r.TEXTURE_2D,null),h!==r.FRAMEBUFFER_COMPLETE?(r.deleteFramebuffer(a),r.deleteTexture(l),null):{texture:l,framebuffer:a,width:i,height:n}}beginRenderTarget(e){const t=this.gl;this.activeRenderTarget=e,t.bindFramebuffer(t.FRAMEBUFFER,e.framebuffer),t.viewport(0,0,e.width,e.height)}endRenderTarget(){const e=this.gl;this.activeRenderTarget=null,e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,this.width,this.height)}deleteRenderTarget(e){const t=this.gl;this.activeRenderTarget===e&&this.endRenderTarget(),this.boundTexture===e.texture&&(this.boundTexture=null),t.deleteFramebuffer(e.framebuffer),t.deleteTexture(e.texture)}createProgram(){const e=this.gl,t=`
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
}`,i=this.compileShader(e.VERTEX_SHADER,t),n=this.compileShader(e.FRAGMENT_SHADER,r),l=e.createProgram();if(!l)throw new J("Unable to create WebGL program");if(e.attachShader(l,i),e.attachShader(l,n),e.linkProgram(l),!e.getProgramParameter(l,e.LINK_STATUS)){const a=e.getProgramInfoLog(l)??"unknown link error";throw e.deleteProgram(l),new J(`Unable to link WebGL program: ${a}`)}return e.deleteShader(i),e.deleteShader(n),l}compileShader(e,t){const r=this.gl,i=r.createShader(e);if(!i)throw new J("Unable to create shader");if(r.shaderSource(i,t),r.compileShader(i),!r.getShaderParameter(i,r.COMPILE_STATUS)){const n=r.getShaderInfoLog(i)??"unknown compile error";throw r.deleteShader(i),new J(`Unable to compile shader: ${n}`)}return i}drawImmediate(e,t,r,i){const n=this.gl,l=this.getDrawCall(e,t,r,i);l&&(this.prepareDraw(),n.bindBuffer(n.ARRAY_BUFFER,this.posBuffer),n.bufferData(n.ARRAY_BUFFER,l.vertices,n.STREAM_DRAW),n.vertexAttribPointer(this.posLoc,4,n.FLOAT,!1,0,0),n.bindBuffer(n.ARRAY_BUFFER,this.texCoordBuffer),n.bufferData(n.ARRAY_BUFFER,l.texCoords,n.STREAM_DRAW),n.vertexAttribPointer(this.texCoordLoc,2,n.FLOAT,!1,0,0),n.bindBuffer(n.ARRAY_BUFFER,this.colorBuffer),n.bufferData(n.ARRAY_BUFFER,l.colors,n.STREAM_DRAW),n.vertexAttribPointer(this.colorAttrLoc,4,n.FLOAT,!1,0,0),n.drawArrays(l.mode,0,l.count))}drawPacked(e,t,r,i,n){if(t<=0)return;const l=this.gl;this.prepareDraw(),l.bindBuffer(l.ARRAY_BUFFER,this.posBuffer),l.bufferData(l.ARRAY_BUFFER,r,l.STREAM_DRAW),l.vertexAttribPointer(this.posLoc,4,l.FLOAT,!1,0,0),l.bindBuffer(l.ARRAY_BUFFER,this.texCoordBuffer),l.bufferData(l.ARRAY_BUFFER,i,l.STREAM_DRAW),l.vertexAttribPointer(this.texCoordLoc,2,l.FLOAT,!1,0,0),l.bindBuffer(l.ARRAY_BUFFER,this.colorBuffer),l.bufferData(l.ARRAY_BUFFER,n,l.STREAM_DRAW),l.vertexAttribPointer(this.colorAttrLoc,4,l.FLOAT,!1,0,0),l.drawArrays(e,0,t)}ensureDrawBuffers(e){const t=e*4;this.drawVerticesBuffer.length<t&&(this.drawVerticesBuffer=new Float32Array(Jt(t)));const r=e*2;this.drawTexCoordsBuffer.length<r&&(this.drawTexCoordsBuffer=new Float32Array(Jt(r)));const i=e*4;this.drawColorsBuffer.length<i&&(this.drawColorsBuffer=new Float32Array(Jt(i)))}createPackedDrawCall(e,t,r){if(e==="quads")return this.createPackedQuadDrawCall(t,r);const i=Math.floor(t.length/3);if(i<=0)return null;this.ensureDrawBuffers(i);const n=r.length>=i*4;let l=0,a=0,h=0;for(let v=0;v<i;v++){const E=v*3;if(this.drawVerticesBuffer[l++]=t[E],this.drawVerticesBuffer[l++]=t[E+1],this.drawVerticesBuffer[l++]=t[E+2],this.drawVerticesBuffer[l++]=1,this.drawTexCoordsBuffer[a++]=0,this.drawTexCoordsBuffer[a++]=0,n){const x=v*4;this.drawColorsBuffer[h++]=r[x],this.drawColorsBuffer[h++]=r[x+1],this.drawColorsBuffer[h++]=r[x+2],this.drawColorsBuffer[h++]=r[x+3]}else this.drawColorsBuffer[h++]=this.drawColor[0],this.drawColorsBuffer[h++]=this.drawColor[1],this.drawColorsBuffer[h++]=this.drawColor[2],this.drawColorsBuffer[h++]=this.drawColor[3]}const d=this.mapPrimitiveToDrawMode(e);if(d!==null)return{mode:d,count:i,vertices:this.drawVerticesBuffer.subarray(0,i*4),texCoords:this.drawTexCoordsBuffer.subarray(0,i*2),colors:this.drawColorsBuffer.subarray(0,i*4)};const u=Array.from(this.drawVerticesBuffer.subarray(0,i*4)),f=Array.from(this.drawTexCoordsBuffer.subarray(0,i*2)),g=Array.from(this.drawColorsBuffer.subarray(0,i*4)),w=this.getDrawCall(e,u,f,g);return w||null}mapPrimitiveToDrawMode(e){const t=this.gl;switch(e){case"points":return t.POINTS;case"lines":return t.LINES;case"lineStrip":return t.LINE_STRIP;case"lineLoop":return t.LINE_LOOP;case"triangles":return t.TRIANGLES;case"triangleStrip":return t.TRIANGLE_STRIP;case"triangleFan":return t.TRIANGLE_FAN;default:return null}}createPackedQuadDrawCall(e,t){const r=Math.floor(e.length/3),i=Math.floor(r/4),n=i*6;if(n<=0)return null;this.ensureDrawBuffers(n);const l=t.length>=r*4,a=[0,1,2,0,2,3];let h=0,d=0,u=0;for(let f=0;f<i;f++){const g=f*4;for(let w=0;w<6;w++){const v=g+a[w],E=v*3;if(this.drawVerticesBuffer[h++]=e[E],this.drawVerticesBuffer[h++]=e[E+1],this.drawVerticesBuffer[h++]=e[E+2],this.drawVerticesBuffer[h++]=1,this.drawTexCoordsBuffer[d++]=0,this.drawTexCoordsBuffer[d++]=0,l){const x=v*4;this.drawColorsBuffer[u++]=t[x],this.drawColorsBuffer[u++]=t[x+1],this.drawColorsBuffer[u++]=t[x+2],this.drawColorsBuffer[u++]=t[x+3]}else this.drawColorsBuffer[u++]=this.drawColor[0],this.drawColorsBuffer[u++]=this.drawColor[1],this.drawColorsBuffer[u++]=this.drawColor[2],this.drawColorsBuffer[u++]=this.drawColor[3]}}return{mode:this.gl.TRIANGLES,count:n,vertices:this.drawVerticesBuffer.subarray(0,n*4),texCoords:this.drawTexCoordsBuffer.subarray(0,n*2),colors:this.drawColorsBuffer.subarray(0,n*4)}}applyBlendMode(){const e=this.gl;if(this.blendMode==="additive"){e.blendFunc(e.SRC_ALPHA,e.ONE);return}e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA)}prepareDraw(){const e=this.gl;e.useProgram(this.program),e.uniform1f(this.pointSizeLoc,this.pointSize),e.uniformMatrix4fv(this.mvpLoc,!1,this.getCurrentMvp());const t=this.textureEnabled&&this.boundTexture!==null;e.uniform1i(this.useTextureLoc,t?1:0),e.activeTexture(e.TEXTURE0),t&&this.boundTexture&&e.bindTexture(e.TEXTURE_2D,this.boundTexture)}getDrawCall(e,t,r,i){const n=this.gl;if(t.length<4||r.length<2||i.length<4)return null;const l=Math.floor(t.length/4),a=Math.floor(r.length/2),h=Math.floor(i.length/4),d=Math.min(l,a,h);if(d<=0)return null;const u=t.slice(0,d*4),f=r.slice(0,d*2),g=i.slice(0,d*4);switch(e){case"points":return{mode:n.POINTS,vertices:new Float32Array(u),texCoords:new Float32Array(f),colors:new Float32Array(g),count:d};case"lines":return{mode:n.LINES,vertices:new Float32Array(u),texCoords:new Float32Array(f),colors:new Float32Array(g),count:d-d%2};case"lineStrip":return{mode:n.LINE_STRIP,vertices:new Float32Array(u),texCoords:new Float32Array(f),colors:new Float32Array(g),count:d};case"lineLoop":{if(d<2)return null;const w=u.slice(),v=f.slice(),E=g.slice();return w.push(u[0],u[1],u[2],u[3]),v.push(f[0],f[1]),E.push(g[0],g[1],g[2],g[3]),{mode:n.LINE_STRIP,vertices:new Float32Array(w),texCoords:new Float32Array(v),colors:new Float32Array(E),count:d+1}}case"triangles":return{mode:n.TRIANGLES,vertices:new Float32Array(u),texCoords:new Float32Array(f),colors:new Float32Array(g),count:d-d%3};case"triangleStrip":return{mode:n.TRIANGLE_STRIP,vertices:new Float32Array(u),texCoords:new Float32Array(f),colors:new Float32Array(g),count:d};case"triangleFan":return{mode:n.TRIANGLE_FAN,vertices:new Float32Array(u),texCoords:new Float32Array(f),colors:new Float32Array(g),count:d};case"quads":{if(d<4)return null;const w=[],v=[],E=[];for(let x=0;x+3<d;x+=4){const B=x*4,k=(x+1)*4,H=(x+2)*4,q=(x+3)*4,K=x*2,dt=(x+1)*2,Et=(x+2)*2,we=(x+3)*2,pt=x*4,kt=(x+1)*4,mt=(x+2)*4,_t=(x+3)*4;w.push(u[B],u[B+1],u[B+2],u[B+3],u[k],u[k+1],u[k+2],u[k+3],u[H],u[H+1],u[H+2],u[H+3],u[B],u[B+1],u[B+2],u[B+3],u[H],u[H+1],u[H+2],u[H+3],u[q],u[q+1],u[q+2],u[q+3]),v.push(f[K],f[K+1],f[dt],f[dt+1],f[Et],f[Et+1],f[K],f[K+1],f[Et],f[Et+1],f[we],f[we+1]),E.push(g[pt],g[pt+1],g[pt+2],g[pt+3],g[kt],g[kt+1],g[kt+2],g[kt+3],g[mt],g[mt+1],g[mt+2],g[mt+3],g[pt],g[pt+1],g[pt+2],g[pt+3],g[mt],g[mt+1],g[mt+2],g[mt+3],g[_t],g[_t+1],g[_t+2],g[_t+3])}return{mode:n.TRIANGLES,vertices:new Float32Array(w),texCoords:new Float32Array(v),colors:new Float32Array(E),count:w.length/4}}default:return null}}getCurrentMatrix(){return this.matrixMode===5889?this.projection:this.modelView}setCurrentMatrix(e){this.matrixMode===5889?this.projection=e:this.modelView=e,this.mvpDirty=!0}mulCurrentMatrix(e){const t=this.getCurrentMatrix();le(this.matrixMulScratch,t,e),t.set(this.matrixMulScratch),this.mvpDirty=!0}getCurrentMvp(){return this.mvpDirty&&(le(this.mvp,this.projection,this.modelView),this.mvpDirty=!1),this.mvp}}function ft(c){return Math.max(0,Math.min(1,c))}function Jt(c){let e=1;for(;e<c;)e<<=1;return e}function ut(){return new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])}function ye(c){return new Float32Array(c)}function je(c,e){const t=new Float32Array(16);return le(t,c,e),t}function le(c,e,t){for(let r=0;r<4;r++){const i=t[r*4],n=t[r*4+1],l=t[r*4+2],a=t[r*4+3];c[r*4]=e[0]*i+e[4]*n+e[8]*l+e[12]*a,c[r*4+1]=e[1]*i+e[5]*n+e[9]*l+e[13]*a,c[r*4+2]=e[2]*i+e[6]*n+e[10]*l+e[14]*a,c[r*4+3]=e[3]*i+e[7]*n+e[11]*l+e[15]*a}}function We(c,e,t,r){c[12]+=c[0]*e+c[4]*t+c[8]*r,c[13]+=c[1]*e+c[5]*t+c[9]*r,c[14]+=c[2]*e+c[6]*t+c[10]*r,c[15]+=c[3]*e+c[7]*t+c[11]*r}function Ze(c,e,t,r){c[0]*=e,c[1]*=e,c[2]*=e,c[3]*=e,c[4]*=t,c[5]*=t,c[6]*=t,c[7]*=t,c[8]*=r,c[9]*=r,c[10]*=r,c[11]*=r}function qe(c,e,t){return new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,c,e,t,1])}function Ke(c,e,t,r){const i=Math.hypot(e,t,r);if(i<=0)return ut();const n=e/i,l=t/i,a=r/i,h=c*Math.PI/180,d=Math.cos(h),u=Math.sin(h),f=1-d;return new Float32Array([n*n*f+d,l*n*f+a*u,a*n*f-l*u,0,n*l*f-a*u,l*l*f+d,a*l*f+n*u,0,n*a*f+l*u,l*a*f-n*u,a*a*f+d,0,0,0,0,1])}function Qe(c,e,t,r,i,n){const l=e-c,a=r-t,h=n-i;return l===0||a===0||h===0||i===0?ut():new Float32Array([2*i/l,0,0,0,0,2*i/a,0,0,(e+c)/l,(r+t)/a,-(n+i)/h,-1,0,0,-2*n*i/h,0])}function Je(c,e,t,r,i,n){const l=e-c,a=r-t,h=n-i;return l===0||a===0||h===0?ut():new Float32Array([2/l,0,0,0,0,2/a,0,0,0,0,-2/h,0,-(e+c)/l,-(r+t)/a,-(n+i)/h,1])}function tr(c,e,t,r,i,n,l,a,h){let d=r-c,u=i-e,f=n-t;const g=Math.hypot(d,u,f);if(g===0)return ut();d/=g,u/=g,f/=g;let w=u*h-f*a,v=f*l-d*h,E=d*a-u*l;const x=Math.hypot(w,v,E);if(x===0)return ut();w/=x,v/=x,E/=x;const B=v*f-E*u,k=E*d-w*f,H=w*u-v*d,q=new Float32Array([w,B,-d,0,v,k,-u,0,E,H,-f,0,0,0,0,1]);return je(q,qe(-c,-e,-t))}const p=class p{constructor(){s(this,"onWindowResize",null);s(this,"onVisualViewportResize",null)}initSDL(){if(typeof document<"u"){let e=document.getElementById("tt-screen-root");e||(e=document.createElement("div"),e.id="tt-screen-root",e.style.position="relative",e.style.display="inline-block",document.body.appendChild(e)),document.body.style.margin="0",document.body.style.overflow="hidden";let t=document.getElementById("tt-screen");t||(t=document.createElement("canvas"),t.id="tt-screen",t.style.display="block",e.appendChild(t)),t.width=p.width,t.height=p.height,t.style.width=`${p.width}px`,t.style.height=`${p.height}px`,p.canvas=t,p.gl=me.create(t);let r=document.getElementById("tt-screen-overlay");r||(r=document.createElement("canvas"),r.id="tt-screen-overlay",r.style.position="absolute",r.style.left="0",r.style.top="0",r.style.pointerEvents="none",e.appendChild(r)),r.width=p.width,r.height=p.height,r.style.width=`${p.width}px`,r.style.height=`${p.height}px`,p.overlayCanvas=r,p.ctx2d=r.getContext("2d")}typeof window<"u"&&p.autoResizeToWindow?(this.onWindowResize=()=>{const e=this.getViewportSize();this.resized(e.width,e.height)},window.addEventListener("resize",this.onWindowResize),window.visualViewport&&(this.onVisualViewportResize=()=>{const e=this.getViewportSize();this.resized(e.width,e.height)},window.visualViewport.addEventListener("resize",this.onVisualViewportResize),window.visualViewport.addEventListener("scroll",this.onVisualViewportResize)),this.onWindowResize()):this.resized(p.width,p.height),this.init()}screenResized(){}resized(e,t){var r;p.width=e,p.height=t,p.canvas&&(p.canvas.width=e,p.canvas.height=t,p.canvas.style.width=`${e}px`,p.canvas.style.height=`${t}px`),p.overlayCanvas&&(p.overlayCanvas.width=e,p.overlayCanvas.height=t,p.overlayCanvas.style.width=`${e}px`,p.overlayCanvas.style.height=`${t}px`),(r=p.gl)==null||r.resize(e,t),this.resetProjectionForResize(),this.screenResized()}resetProjectionForResize(){const e=p.nearPlane,t=p.farPlane,r=Math.max(1,p.width),i=Math.max(1,p.height),n=e*i/r,l=-n,a=-e,h=e;p.glMatrixMode(p.GL_PROJECTION),p.glLoadIdentity(),p.glFrustum(a,h,l,n,.1,t),p.glMatrixMode(p.GL_MODELVIEW)}closeSDL(){var e;typeof window<"u"&&this.onWindowResize&&(window.removeEventListener("resize",this.onWindowResize),this.onWindowResize=null),typeof window<"u"&&window.visualViewport&&this.onVisualViewportResize&&(window.visualViewport.removeEventListener("resize",this.onVisualViewportResize),window.visualViewport.removeEventListener("scroll",this.onVisualViewportResize),this.onVisualViewportResize=null),this.close(),(e=p.gl)==null||e.close(),p.gl=null,p.ctx2d=null,p.overlayCanvas=null,p.canvas=null}flip(){var e;(e=p.gl)==null||e.flush(),this.handleError()}clear(){var e;(e=p.gl)==null||e.clear(),p.ctx2d&&p.ctx2d.clearRect(0,0,p.width,p.height)}handleError(){}setCaption(e){typeof document<"u"&&(document.title=e)}getViewportSize(){if(typeof window>"u")return{width:p.width,height:p.height};const e=window.visualViewport;return e?{width:Math.max(1,Math.round(e.width)),height:Math.max(1,Math.round(e.height))}:{width:Math.max(1,window.innerWidth),height:Math.max(1,window.innerHeight)}}static setColor(e,t,r,i=1){p.drawColor=Se(e,t,r,i),p.captureOrRun(()=>{var n;(n=p.gl)==null||n.setDrawColor(e,t,r,i)})}static setClearColor(e,t,r,i=1){p.clearColor=Se(e,t,r,i),p.captureOrRun(()=>{var n;(n=p.gl)==null||n.setClearColor(e,t,r,i)})}static glVertex(e){p.glVertexXYZ(e.x,e.y,e.z)}static glVertexXYZ(e,t,r=0){p.captureOrRun(()=>{var i;(i=p.gl)==null||i.vertexXYZ(e,t,r)})}static glVertex3f(e,t,r){p.glVertexXYZ(e,t,r)}static glTranslate(e){p.glTranslatef(e.x,e.y,e.z)}static glTranslatef(e,t,r){p.captureOrRun(()=>{var i;(i=p.gl)==null||i.translateXYZ(e,t,r)})}static glScalef(e,t,r){p.captureOrRun(()=>{var i;(i=p.gl)==null||i.scaleXYZ(e,t,r)})}static glRotatef(e,t,r,i){p.captureOrRun(()=>{var n;(n=p.gl)==null||n.rotateDeg(e,t,r,i)})}static glBegin(e){const t=te(e);p.captureOrRun(()=>{var r;(r=p.gl)==null||r.begin(t)})}static glEnd(){p.captureOrRun(()=>{var e;(e=p.gl)==null||e.end()})}static glDrawArrays(e,t,r){const i=te(e);p.captureOrRun(()=>{var n;(n=p.gl)==null||n.drawArraysXYZC(i,t,r)})}static glCreateStaticMesh(e,t,r){var n;const i=te(e);return((n=p.gl)==null?void 0:n.createStaticMeshXYZC(i,t,r))??null}static glDrawStaticMesh(e){p.captureOrRun(()=>{var t;(t=p.gl)==null||t.drawStaticMesh(e)})}static glDeleteStaticMesh(e){p.captureOrRun(()=>{var t;(t=p.gl)==null||t.deleteStaticMesh(e)})}static glLoadIdentity(){p.captureOrRun(()=>{var e;(e=p.gl)==null||e.loadIdentity()})}static glPushMatrix(){p.captureOrRun(()=>{var e;(e=p.gl)==null||e.pushMatrix()})}static glPopMatrix(){p.captureOrRun(()=>{var e;(e=p.gl)==null||e.popMatrix()})}static glBlendAdditive(){p.captureOrRun(()=>{var e;(e=p.gl)==null||e.setBlendMode("additive")})}static glBlendAlpha(){p.captureOrRun(()=>{var e;(e=p.gl)==null||e.setBlendMode("alpha")})}static glPointSize(e){p.captureOrRun(()=>{var t;(t=p.gl)==null||t.setPointSize(e)})}static glEnable(e){p.captureOrRun(()=>{var t;(t=p.gl)==null||t.enable(e)})}static glDisable(e){p.captureOrRun(()=>{var t;(t=p.gl)==null||t.disable(e)})}static glBlendFunc(e,t){p.captureOrRun(()=>{var r,i;if(e===p.GL_SRC_ALPHA&&t===p.GL_ONE){(r=p.gl)==null||r.setBlendMode("additive");return}e===p.GL_SRC_ALPHA&&t===p.GL_ONE_MINUS_SRC_ALPHA&&((i=p.gl)==null||i.setBlendMode("alpha"))})}static glMatrixMode(e){p.captureOrRun(()=>{var t;(t=p.gl)==null||t.setMatrixMode(e)})}static glViewport(e,t,r,i){var n;(n=p.gl)==null||n.setViewport(r,i)}static glFrustum(e,t,r,i,n,l){p.captureOrRun(()=>{var a;(a=p.gl)==null||a.frustum(e,t,r,i,n,l)})}static glClear(e){var t;(e&p.GL_COLOR_BUFFER_BIT)!==0&&((t=p.gl)==null||t.clear())}static glLineWidth(e){}static glOrtho(e,t,r,i,n,l){p.captureOrRun(()=>{var a;(a=p.gl)==null||a.ortho(e,t,r,i,n,l)})}static glTexCoord2f(e,t){p.captureOrRun(()=>{var r;(r=p.gl)==null||r.texCoord2f(e,t)})}static gluLookAt(e,t,r,i,n,l,a,h,d){p.captureOrRun(()=>{var u;(u=p.gl)==null||u.lookAt(e,t,r,i,n,l,a,h,d)})}static beginDisplayListCapture(e){p.captureCommands=[],p.captureCommit=e}static endDisplayListCapture(){if(!p.captureCommands||!p.captureCommit){p.captureCommands=null,p.captureCommit=null;return}const e=p.captureCommands.slice();p.captureCommands=null;const t=p.captureCommit;p.captureCommit=null,t(e)}static captureOrRun(e){if(p.captureCommands){p.captureCommands.push(e);return}e()}};s(p,"GL_POINTS",0),s(p,"GL_LINES",1),s(p,"GL_LINE_LOOP",2),s(p,"GL_LINE_STRIP",3),s(p,"GL_TRIANGLES",4),s(p,"GL_TRIANGLE_STRIP",5),s(p,"GL_TRIANGLE_FAN",6),s(p,"GL_QUADS",7),s(p,"GL_BLEND",3042),s(p,"GL_DEPTH_TEST",2929),s(p,"GL_SRC_ALPHA",770),s(p,"GL_ONE",1),s(p,"GL_ONE_MINUS_SRC_ALPHA",771),s(p,"GL_LINE_SMOOTH",2848),s(p,"GL_COLOR_MATERIAL",2903),s(p,"GL_CULL_FACE",2884),s(p,"GL_LIGHTING",2896),s(p,"GL_TEXTURE_2D",3553),s(p,"GL_MODELVIEW",5888),s(p,"GL_PROJECTION",5889),s(p,"GL_COLOR_BUFFER_BIT",16384),s(p,"brightness",1),s(p,"width",640),s(p,"height",480),s(p,"windowMode",!1),s(p,"autoResizeToWindow",!0),s(p,"nearPlane",.1),s(p,"farPlane",1e3),s(p,"canvas",null),s(p,"overlayCanvas",null),s(p,"ctx2d",null),s(p,"gl",null),s(p,"clearColor","rgba(0, 0, 0, 1)"),s(p,"drawColor","rgba(255, 255, 255, 1)"),s(p,"captureCommands",null),s(p,"captureCommit",null);let o=p;function Se(c,e,t,r){const i=Math.max(0,Math.min(1,c)),n=Math.max(0,Math.min(1,e)),l=Math.max(0,Math.min(1,t)),a=Math.max(0,Math.min(1,r));return`rgba(${Math.round(i*255)}, ${Math.round(n*255)}, ${Math.round(l*255)}, ${a})`}function te(c){if(typeof c=="string")return c;switch(c){case o.GL_POINTS:return"points";case o.GL_LINES:return"lines";case o.GL_LINE_LOOP:return"lineLoop";case o.GL_LINE_STRIP:return"lineStrip";case o.GL_TRIANGLES:return"triangles";case o.GL_TRIANGLE_STRIP:return"triangleStrip";case o.GL_TRIANGLE_FAN:return"triangleFan";case o.GL_QUADS:return"quads";default:return"triangles"}}const Ee=24;class er{constructor(e,t,r,i){s(this,"INTERVAL_BASE",16);s(this,"interval",this.INTERVAL_BASE);s(this,"accframe",0);s(this,"maxSkipFrame",5);s(this,"event",{type:0});s(this,"screen");s(this,"input");s(this,"gameManager");s(this,"prefManager");s(this,"done",!1);s(this,"rafId",null);s(this,"running",!1);s(this,"finalized",!1);s(this,"lastTickMs",0);s(this,"accumulatorMs",0);s(this,"frameStats",new Xe);s(this,"lastStatsPublishMs",0);s(this,"lastStatsSnapshot",null);this.screen=e,this.input=t,r.setMainLoop(this),r.setUIs(e,t),r.setPrefManager(i),this.gameManager=r,this.prefManager=i}initFirst(){this.prefManager.load();try{$.init()}catch(e){if(e instanceof J)At.error(e);else throw e}this.gameManager.init()}quitLast(){this.gameManager.close(),$.close(),this.prefManager.save(),this.screen.closeSDL()}breakLoop(){this.done=!0,this.rafId!==null&&typeof cancelAnimationFrame=="function"&&(cancelAnimationFrame(this.rafId),this.rafId=null),this.running&&this.finalizeOnce(),this.running=!1}loop(){this.done=!1,this.running=!0,this.finalized=!1;const e=this.nowMs();if(this.frameStats.reset(e),this.lastStatsPublishMs=e,this.screen.initSDL(),this.initFirst(),this.gameManager.start(),typeof requestAnimationFrame=="function"){this.startBrowserLoop();return}this.startFallbackLoop()}startBrowserLoop(){this.accumulatorMs=0,this.lastTickMs=this.nowMs();const e=t=>{if(this.done)return;const r=t-this.lastTickMs;this.lastTickMs=t,this.accumulatorMs+=Math.max(0,r),this.input.handleEvent({type:Ee});let i=0;for(;this.accumulatorMs>=this.interval&&i<this.maxSkipFrame;)this.gameManager.move(),this.accumulatorMs-=this.interval,i++;i>=this.maxSkipFrame&&this.accumulatorMs>=this.interval&&(this.accumulatorMs=0),this.screen.clear(),this.gameManager.draw(),this.drawOverlay(),this.screen.flip(),this.frameStats.recordFrame(r,i,t),this.publishStats(t),this.rafId=requestAnimationFrame(e)};this.rafId=requestAnimationFrame(e)}startFallbackLoop(){let e=0,t,r;for(;!this.done;){const i=this.nowMs();this.input.handleEvent({type:Ee}),t=this.nowMs(),r=(t-e)/this.interval|0,r<=0?(r=1,e+this.interval-t,this.accframe?e=this.nowMs():e+=this.interval):r>this.maxSkipFrame?(r=this.maxSkipFrame,e=t):e+=r*this.interval;for(let l=0;l<r;l++)this.gameManager.move();this.screen.clear(),this.gameManager.draw(),this.drawOverlay(),this.screen.flip();const n=this.nowMs();this.frameStats.recordFrame(n-i,r,n),this.publishStats(n)}this.running=!1,this.finalizeOnce()}nowMs(){return typeof performance<"u"&&typeof performance.now=="function"?performance.now():Date.now()}finalizeOnce(){this.finalized||(this.finalized=!0,this.quitLast())}publishStats(e){if(typeof globalThis>"u"||(this.lastStatsSnapshot||(this.lastStatsSnapshot=this.frameStats.getSnapshot()),e-this.lastStatsPublishMs<1e3))return;this.lastStatsPublishMs=e;const t=globalThis;this.lastStatsSnapshot=this.frameStats.getSnapshot(),t.__ttFrameStats=this.lastStatsSnapshot}drawOverlay(){var r;const e=o.ctx2d;if(!e)return;e.clearRect(0,0,o.width,o.height);const t=this.input;(r=t.drawTouchGuide)==null||r.call(t,e,o.width,o.height),this.lastStatsSnapshot&&this.drawStatsOverlay(this.lastStatsSnapshot)}drawStatsOverlay(e){if(!globalThis.__ttShowFrameStats)return;const r=o.ctx2d;if(!r)return;const i=`FPS ${e.avgFps.toFixed(1)} / AVG ${e.avgFrameMs.toFixed(2)}ms / WORST ${e.worstFrameMs.toFixed(2)}ms / DROP ${e.droppedFrames}`;r.save(),r.globalCompositeOperation="source-over",r.fillStyle="rgba(0,0,0,0.55)",r.fillRect(8,8,Math.min(o.width-16,520),20),r.fillStyle="rgba(180,255,180,0.95)",r.font="12px monospace",r.textBaseline="top",r.fillText(i,12,12),r.restore()}}const Y=1,Ft=39,Gt=37,Yt=40,Ut=38,rr=102,ir=100,sr=98,nr=104,ar=68,lr=65,or=83,hr=87,ee=90,cr=190,ur=17,Ht=88,dr=191,pr=18,mr=16,re=80,nt=class nt{constructor(){s(this,"keys",{});s(this,"buttonReversed",!1);s(this,"lastDirState",0);s(this,"lastButtonState",0);s(this,"stickIndex",-1);s(this,"JOYSTICK_AXIS",16384);s(this,"listenersBound",!1);s(this,"touchRoles",new Map);s(this,"touchMovePointerId",null);s(this,"touchMoveOriginX",0);s(this,"touchMoveOriginY",0);s(this,"touchMoveCurrentX",0);s(this,"touchMoveCurrentY",0);s(this,"touchGuideEnabled",!1);s(this,"touchFireToggled",!1)}openJoystick(){typeof window>"u"||(this.bindKeyboardListeners(),this.bindGamepadListeners(),this.bindTouchListeners(),this.touchGuideEnabled=this.detectTouchScreen())}handleEvent(e){this.refreshGamepad()}getDirState(){let e=0,t=0,r=0;const i=this.getActiveGamepad();return i&&(e=(i.axes[0]??0)*32767|0,t=(i.axes[1]??0)*32767|0),(this.keys[Ft]===Y||this.keys[rr]===Y||this.keys[ar]===Y||e>this.JOYSTICK_AXIS)&&(r|=nt.Dir.RIGHT),(this.keys[Gt]===Y||this.keys[ir]===Y||this.keys[lr]===Y||e<-this.JOYSTICK_AXIS)&&(r|=nt.Dir.LEFT),(this.keys[Yt]===Y||this.keys[sr]===Y||this.keys[or]===Y||t>this.JOYSTICK_AXIS)&&(r|=nt.Dir.DOWN),(this.keys[Ut]===Y||this.keys[nr]===Y||this.keys[hr]===Y||t<-this.JOYSTICK_AXIS)&&(r|=nt.Dir.UP),this.lastDirState=r,r}getButtonState(){var f,g,w,v,E,x,B,k;let e=0;const t=this.getActiveGamepad(),r=(f=t==null?void 0:t.buttons[0])!=null&&f.pressed?1:0,i=(g=t==null?void 0:t.buttons[1])!=null&&g.pressed?1:0,n=(w=t==null?void 0:t.buttons[2])!=null&&w.pressed?1:0,l=(v=t==null?void 0:t.buttons[3])!=null&&v.pressed?1:0,a=(E=t==null?void 0:t.buttons[4])!=null&&E.pressed?1:0,h=(x=t==null?void 0:t.buttons[5])!=null&&x.pressed?1:0,d=(B=t==null?void 0:t.buttons[6])!=null&&B.pressed?1:0,u=(k=t==null?void 0:t.buttons[7])!=null&&k.pressed?1:0;return(this.keys[ee]===Y||this.keys[cr]===Y||this.keys[ur]===Y||r||l||a||u)&&(this.buttonReversed?e|=nt.Button.B:e|=nt.Button.A),(this.keys[Ht]===Y||this.keys[dr]===Y||this.keys[pr]===Y||this.keys[mr]===Y||i||n||h||d)&&(this.buttonReversed?e|=nt.Button.A:e|=nt.Button.B),this.lastButtonState=e,e}drawTouchGuide(e,t,r){if(!this.touchGuideEnabled)return;const i=this.getTouchGuideLayout(t,r);this.drawTouchCircle(e,i.move.x,i.move.y,i.move.radius,"MOVE"),this.drawTouchCircle(e,i.fire.x,i.fire.y,i.fire.radius,"SHOT"),this.drawTouchCircle(e,i.charge.x,i.charge.y,i.charge.radius,"CHARGE"),this.drawTouchCircle(e,i.pause.x,i.pause.y,i.pause.radius,"II")}bindKeyboardListeners(){this.listenersBound||typeof window>"u"||(this.listenersBound=!0,window.addEventListener("keydown",e=>{this.keys[e.keyCode]=Y}),window.addEventListener("keyup",e=>{this.keys[e.keyCode]=0}),window.addEventListener("blur",()=>{this.keys={},this.clearTouchState()}))}bindGamepadListeners(){typeof window>"u"||(window.addEventListener("gamepadconnected",e=>{const t=e.gamepad;this.stickIndex<0&&(this.stickIndex=t.index)}),window.addEventListener("gamepaddisconnected",e=>{e.gamepad.index===this.stickIndex&&(this.stickIndex=-1)}),this.refreshGamepad())}bindTouchListeners(){if(typeof window>"u")return;const e=i=>{if(i.pointerType==="mouse")return;i.preventDefault();const n=this.resolveTouchRole(i.clientX,i.clientY);this.touchRoles.set(i.pointerId,n),n==="move"&&(this.touchMovePointerId=i.pointerId,this.touchMoveOriginX=i.clientX,this.touchMoveOriginY=i.clientY,this.touchMoveCurrentX=i.clientX,this.touchMoveCurrentY=i.clientY,this.updateTouchMoveKeys()),n==="fire"&&this.toggleTouchFire(),n==="charge"&&(this.keys[Ht]=Y),n==="pause"&&(this.keys[re]=Y)},t=i=>{i.pointerType==="mouse"||this.touchRoles.get(i.pointerId)!=="move"||this.touchMovePointerId!==i.pointerId||(i.preventDefault(),this.touchMoveCurrentX=i.clientX,this.touchMoveCurrentY=i.clientY,this.updateTouchMoveKeys())},r=i=>{i.pointerType!=="mouse"&&(i.preventDefault(),this.releaseTouchPointer(i.pointerId))};window.addEventListener("pointerdown",e,{passive:!1}),window.addEventListener("pointermove",t,{passive:!1}),window.addEventListener("pointerup",r,{passive:!1}),window.addEventListener("pointercancel",r,{passive:!1}),window.addEventListener("visibilitychange",()=>{document.visibilityState!=="visible"&&this.clearTouchState()})}detectTouchScreen(){return typeof window>"u"||typeof navigator>"u"?!1:!!(navigator.maxTouchPoints>0||"ontouchstart"in window||typeof window.matchMedia=="function"&&window.matchMedia("(pointer: coarse)").matches)}resolveTouchRole(e,t){if(typeof window>"u")return"fire";const r=Math.max(1,window.innerWidth),i=Math.max(1,window.innerHeight),n=this.getTouchGuideLayout(r,i);return this.isInsideCircle(e,t,n.pause.x,n.pause.y,n.pause.radius)?"pause":this.isInsideCircle(e,t,n.fire.x,n.fire.y,n.fire.radius)?"fire":this.isInsideCircle(e,t,n.charge.x,n.charge.y,n.charge.radius)?"charge":this.isInsideCircle(e,t,n.move.x,n.move.y,n.move.radius*1.35)||e<r*.5?"move":t<i*.5?"fire":"charge"}updateTouchMoveKeys(){const t=this.touchMoveCurrentX-this.touchMoveOriginX,r=this.touchMoveCurrentY-this.touchMoveOriginY;this.keys[Gt]=t<-24?Y:0,this.keys[Ft]=t>24?Y:0,this.keys[Ut]=r<-24?Y:0,this.keys[Yt]=r>24?Y:0}releaseTouchPointer(e){const t=this.touchRoles.get(e);t&&(this.touchRoles.delete(e),t==="move"&&this.touchMovePointerId===e&&(this.touchMovePointerId=null,this.keys[Gt]=0,this.keys[Ft]=0,this.keys[Ut]=0,this.keys[Yt]=0),t==="charge"&&!this.hasTouchRole("charge")&&(this.keys[Ht]=0),t==="pause"&&!this.hasTouchRole("pause")&&(this.keys[re]=0))}hasTouchRole(e){for(const t of this.touchRoles.values())if(t===e)return!0;return!1}clearTouchState(){this.touchRoles.clear(),this.touchMovePointerId=null,this.touchFireToggled=!1,this.keys[Gt]=0,this.keys[Ft]=0,this.keys[Ut]=0,this.keys[Yt]=0,this.keys[ee]=0,this.keys[Ht]=0,this.keys[re]=0}toggleTouchFire(){this.touchFireToggled=!this.touchFireToggled,this.keys[ee]=this.touchFireToggled?Y:0}getTouchGuideLayout(e,t){const r=Math.min(e,t),i=Math.max(36,r*.11),n=Math.max(30,r*.085),l=Math.max(20,r*.05);return{move:{x:e*.2,y:t*.64,radius:i},fire:{x:e*.86,y:t*.64,radius:n},charge:{x:e*.8,y:t*.82,radius:n},pause:{x:e*.92,y:t*.1,radius:l}}}isInsideCircle(e,t,r,i,n){const l=e-r,a=t-i;return l*l+a*a<=n*n}drawTouchCircle(e,t,r,i,n){e.save(),e.globalCompositeOperation="source-over",e.fillStyle="rgba(200, 245, 255, 0.09)",e.strokeStyle="rgba(210, 245, 255, 0.34)",e.lineWidth=Math.max(1.5,i*.06),e.beginPath(),e.arc(t,r,i,0,Math.PI*2),e.fill(),e.stroke(),e.fillStyle="rgba(210, 245, 255, 0.5)",e.font=`${Math.max(10,Math.round(i*.38))}px monospace`,e.textAlign="center",e.textBaseline="middle",e.fillText(n,t,r),e.restore()}refreshGamepad(){if(typeof navigator>"u"||typeof navigator.getGamepads!="function")return;const e=navigator.getGamepads();if(!(this.stickIndex>=0&&e[this.stickIndex])){this.stickIndex=-1;for(const t of e)if(t){this.stickIndex=t.index;break}}}getActiveGamepad(){if(typeof navigator>"u"||typeof navigator.getGamepads!="function")return null;const e=navigator.getGamepads();if(this.stickIndex>=0)return e[this.stickIndex]??null;for(const t of e)if(t)return t;return null}};s(nt,"Dir",{UP:1,DOWN:2,LEFT:4,RIGHT:8}),s(nt,"Button",{A:16,B:32,ANY:48});let tt=nt;class St{constructor(){s(this,"_exists",!1)}get exists(){return this._exists}set exists(e){this._exists=e}}class xt{constructor(e,t=null,r){s(this,"actor",[]);s(this,"actorIdx",0);s(this,"factory");this.factory=r??(()=>{throw new Error("ActorPool factory is required in TypeScript port")}),typeof e=="number"&&this.createActors(e,t)}createActors(e,t=null){this.actor=[];for(let r=0;r<e;r++){const i=this.factory();i.exists=!1,i.init(t),this.actor.push(i)}this.actorIdx=0}getInstance(){for(let e=0;e<this.actor.length;e++)if(this.actorIdx--,this.actorIdx<0&&(this.actorIdx=this.actor.length-1),!this.actor[this.actorIdx].exists)return this.actor[this.actorIdx];return null}getInstanceForced(){return this.actorIdx--,this.actorIdx<0&&(this.actorIdx=this.actor.length-1),this.actor[this.actorIdx]}getMultipleInstances(e){const t=[];for(let r=0;r<e;r++){const i=this.getInstance();if(!i){for(const n of t)n.exists=!1;return null}i.exists=!0,t.push(i)}for(const r of t)r.exists=!1;return t}move(){for(const e of this.actor)e.exists&&e.move()}draw(){for(const e of this.actor)e.exists&&e.draw()}clear(){for(const e of this.actor)e.exists=!1;this.actorIdx=0}}class it{constructor(){oe(Date.now())}setSeed(e){oe(e)}nextInt32(){return $t()}nextInt(e){return e===0?0:$t()%e}nextSignedInt(e){return e===0?0:$t()%(e*2)-e}nextFloat(e){return xe()*e}nextSignedFloat(e){return xe()*(e*2)-e}}const ot=624,bt=397,fr=2567483615,br=2147483648,gr=2147483647;function wr(c,e){return(c&br|e&gr)>>>0}function ie(c,e){return(wr(c,e)>>>1^((e&1)!==0?fr:0))>>>0}const Z=new Uint32Array(ot);let fe=1,Ie=0,Oe=0;function oe(c){Z[0]=c>>>0;for(let e=1;e<ot;e++)Z[e]=Math.imul(1812433253,Z[e-1]^Z[e-1]>>>30)+e>>>0;fe=1,Ie=1}function yr(){Ie===0&&oe(5489),fe=ot,Oe=0;for(let e=ot-bt+1;e>0;e--){const t=ot-bt+1-e;Z[t]=(Z[t+bt]^ie(Z[t],Z[t+1]))>>>0}for(let e=bt;e>0;e--){const t=ot-bt+1+(bt-e);Z[t]=(Z[t+bt-ot]^ie(Z[t],Z[t+1]))>>>0}const c=ot-1;Z[c]=(Z[c+bt-ot]^ie(Z[c],Z[0]))>>>0}function $t(){--fe===0&&yr();let c=Z[Oe++];return c^=c>>>11,c^=c<<7&2636928640,c^=c<<15&4022730752,c^=c>>>18,c>>>0}function xe(){return $t()*(1/4294967295)}class Sr{constructor(){s(this,"mainLoop");s(this,"abstScreen");s(this,"input");s(this,"abstPrefManager")}setMainLoop(e){this.mainLoop=e}setUIs(e,t){this.abstScreen=e,this.input=t}setPrefManager(e){this.abstPrefManager=e}}const Er=`<?xml version="1.0" ?>\r
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
`,Rr=`<?xml version="1.0" ?>\r
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
`,Lr=`<?xml version="1.0" ?>\r
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
`,Ar=`<?xml version="1.0" ?>\r
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
`,Cr=`<?xml version="1.0" ?>\r
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
`,Pr=`<?xml version="1.0" ?>\r
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
`,Ir=`<?xml version="1.0" ?>\r
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
`,Or=`<?xml version="1.0" ?>\r
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
`,Br=`<?xml version="1.0" ?>\r
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
`,Dr=`<?xml version="1.0" ?>\r
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
`,Nr=`<?xml version="1.0" ?>\r
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
`,kr=`<?xml version="1.0" ?>\r
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
`,_r=`<?xml version="1.0" ?>\r
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
`,Fr=`<?xml version="1.0" ?>\r
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
`,Gr=`<?xml version="1.0" ?>\r
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
`,Ur=`<?xml version="1.0" ?>\r
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
`,Hr=`<?xml version="1.0" ?>\r
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
`,zr=`<?xml version="1.0" ?>\r
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
`,Xr=`<?xml version="1.0" ?>\r
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
`,jr=`<?xml version="1.0" ?>\r
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
`,Wr=`<?xml version="1.0" ?>\r
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
`,Zr=`<?xml version="1.0" ?>\r
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
`,Kr=`<?xml version="1.0" ?>\r
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
`,Qr=`<?xml version="1.0" ?>\r
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
`,ti=`<?xml version="1.0" ?>\r
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
`,ei=`<?xml version="1.0" ?>\r
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
`,ri=`<?xml version="1.0" ?>\r
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
`,ii=`<?xml version="1.0" ?>\r
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
`,si=`<?xml version="1.0" ?>\r
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
`,ni=`<?xml version="1.0" ?>\r
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
`,ai=`<?xml version="1.0" ?>\r
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
`,li=`<?xml version="1.0" ?>\r
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
`,oi=`<?xml version="1.0" ?>\r
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
`,hi=`<?xml version="1.0" ?>\r
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
`,ci=`<?xml version="1.0" ?>\r
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
`,ui=`<?xml version="1.0" ?>\r
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
`,pi=`<?xml version="1.0" ?>\r
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
`,mi=`<?xml version="1.0" ?>\r
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
`,fi=`<?xml version="1.0" ?>\r
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
`,bi=`<?xml version="1.0" ?>\r
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
`,gi=`<?xml version="1.0" ?>\r
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
`,wi=`<?xml version="1.0" ?>\r
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
`,yi=`<?xml version="1.0" ?>\r
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
`,Si=`<?xml version="1.0" ?>\r
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
`,Ri=`<?xml version="1.0" ?>\r
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
`,Li=`<?xml version="1.0" ?>\r
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
`,Ai=`<?xml version="1.0" ?>\r
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
`,Ci=`<?xml version="1.0" ?>\r
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
`,Pi=`<?xml version="1.0" ?>\r
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
`,Ii=`<?xml version="1.0" ?>\r
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
`,Oi=`<?xml version="1.0" ?>\r
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
`,Bi=`<?xml version="1.0" ?>\r
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
`,Di=`<?xml version="1.0" ?>\r
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
`,Ni=`<?xml version="1.0" ?>\r
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
`,ki=`<?xml version="1.0" ?>\r
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
`,_i=`<?xml version="1.0" ?>\r
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
`,Fi=`<?xml version="1.0" ?>\r
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
`,Gi=`<?xml version="1.0" ?>\r
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
`,Ui=`<?xml version="1.0" ?>\r
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
`,Hi=`<?xml version="1.0" ?>\r
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
`,zi=`<?xml version="1.0" ?>\r
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
`,Xi=`<?xml version="1.0" ?>\r
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
`,ji=`<?xml version="1.0" ?>\r
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
`,Wi=`<?xml version="1.0" ?>\r
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
`,Zi=`<?xml version="1.0" ?>\r
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
`,Ki=`<?xml version="1.0" ?>\r
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
`,Qi={bullet:0,action:1,fire:2,changeDirection:3,changeSpeed:4,accel:5,wait:6,repeat:7,bulletRef:8,actionRef:9,fireRef:10,vanish:11,horizontal:12,vertical:13,term:14,times:15,direction:16,speed:17,param:18,bulletml:19};function Ji(c){switch(c){case"aim":return 1;case"absolute":return 2;case"relative":return 3;case"sequence":return 4;case null:case"":return 0;default:throw new Error(`BulletML parser: unknown type ${c}.`)}}class ts{constructor(e){s(this,"name");s(this,"type",0);s(this,"refID",-1);s(this,"parent",null);s(this,"children",[]);s(this,"formula",null);const t=Qi[e];if(t===void 0)throw new Error(`BulletML parser: unknown tag ${e}.`);this.name=t}setParent(e){this.parent=e}getParent(){return this.parent}addChild(e){e.setParent(this),this.children.push(e)}childSize(){return this.children.length}childBegin(){return this.children.length>0?this.children[0]:null}childList(){return this.children}setValue(e){this.formula=as(e.trim())}getValue(e){return this.formula?this.formula(e):0}getChild(e){for(const t of this.children)if(t.name===e)return t;return null}getAllChildrenVec(e,t){for(const r of this.children)r.name===e&&t.push(r)}next(){const e=this.parent;if(!e)return null;const t=e.children.indexOf(this);return t<0||t+1>=e.children.length?null:e.children[t+1]}}class es{constructor(e){s(this,"bulletml",null);s(this,"topActions",[]);s(this,"bulletMap",[]);s(this,"actionMap",[]);s(this,"fireMap",[]);s(this,"horizontal",!1);s(this,"name");this.name=e}parse(e){this.bulletml=null,this.topActions.length=0,this.bulletMap.length=0,this.actionMap.length=0,this.fireMap.length=0,this.horizontal=!1;const t={bullet:new Map,action:new Map,fire:new Map,bulletMax:0,actionMax:0,fireMax:0},r=new DOMParser().parseFromString(e,"application/xml"),i=r.querySelector("parsererror");if(i)throw new Error(`${this.name}: ${i.textContent??"xml parse error"}`);const n=r.documentElement;if(!n)throw new Error(`${this.name}: empty xml`);const l=(h,d)=>{const u=new ts(rs(h));if(u.name===19)this.bulletml=u,se(h,"type")==="horizontal"&&(this.horizontal=!0);else if(d)d.addChild(u);else throw new Error("<bulletml> doesn't come.");if(u.name!==19){const w=se(h,"type");u.type=Ji(w)}const f=se(h,"label");if(f){const w=is(u.name),v=ss(t,w,f);if(u.name===0)this.bulletMap[v]=u;else if(u.name===1)this.actionMap[v]=u;else if(u.name===2)this.fireMap[v]=u;else if(u.name===8||u.name===9||u.name===10)u.refID=v;else throw new Error(`he can't have attribute "label".`);u.name===1&&f.startsWith("top")&&this.topActions.push(u)}let g="";for(const w of Array.from(h.childNodes))w.nodeType===Node.ELEMENT_NODE?l(w,u):(w.nodeType===Node.TEXT_NODE||w.nodeType===Node.CDATA_SECTION_NODE)&&(g+=w.nodeValue??"");return g.trim().length>0&&u.setValue(g),u},a=l(n,null);if(a.name!==19)throw new Error("<bulletml> doesn't come.");if(this.bulletml=a,this.topActions.length===0)for(const h of a.childList())h.name===1&&this.topActions.push(h)}getTopActions(){return this.topActions}getBulletRef(e){const t=this.bulletMap[e]??null;if(!t)throw new Error("bulletRef key doesn't exist.");return t}getActionRef(e){const t=this.actionMap[e]??null;if(!t)throw new Error("actionRef key doesn't exist.");return t}getFireRef(e){const t=this.fireMap[e]??null;if(!t)throw new Error("fireRef key doesn't exist.");return t}isHorizontal(){return this.horizontal}}function rs(c){const e=(c.localName&&c.localName.length>0?c.localName:c.tagName).trim(),t=e.indexOf(":");return t>=0?e.slice(t+1):e}function se(c,e){const t=c.getAttribute(e);if(t!==null)return t;for(const r of Array.from(c.attributes)){const i=(r.localName&&r.localName.length>0?r.localName:r.name).trim();if(i===e)return r.value;const n=i.indexOf(":");if(n>=0&&i.slice(n+1)===e)return r.value}return null}function is(c){if(c===0||c===8)return"bullet";if(c===1||c===9)return"action";if(c===2||c===10)return"fire";throw new Error("invalid label domain")}function ss(c,e,t){const r=c[e],i=r.get(t);if(i!==void 0)return i;const n=`${e}Max`,l=c[n];return c[n]++,r.set(t,l),l}class he{constructor(e,t,r){s(this,"bulletml");s(this,"node");s(this,"para");this.bulletml=e,this.node=t,this.para=r}createRunner(){return new Be(this)}}class Mt{constructor(e,t,r,i){s(this,"gradient");this.firstX=e,this.lastX=t,this.firstY=r,this.lastY=i;const n=this.lastX-this.firstX;this.gradient=n!==0?(this.lastY-this.firstY)/n:0}getValue(e){return this.firstY+this.gradient*(e-this.firstX)}isLast(e){return e>=this.lastX}getLast(){return this.lastY}}class Re{constructor(e,t){s(this,"act");s(this,"node");s(this,"actTurn",-1);s(this,"endTurn",0);s(this,"actIte",0);s(this,"end",!1);s(this,"spd",null);s(this,"dir",null);s(this,"prevSpd",null);s(this,"prevDir",null);s(this,"changeDir",null);s(this,"changeSpeed",null);s(this,"accelX",null);s(this,"accelY",null);s(this,"parameters");s(this,"repeatStack",[]);s(this,"refStack",[]);this.state=e,this.runner=t,this.node=[...e.node],this.parameters=e.para,this.act=this.node[0]??null;for(const r of this.node)r.setParent(null)}isEnd(){return this.end}run(){if(!this.isEnd()){if(this.applyChanges(),this.endTurn=this.runner.getTurn(),!this.act){this.isTurnEnd()||!this.changeDir&&!this.changeSpeed&&!this.accelX&&!this.accelY&&(this.end=!0);return}this.act=this.node[this.actIte]??null,this.actTurn===-1&&(this.actTurn=this.runner.getTurn()),this.runSub(),this.act?this.node[this.actIte]=this.act:(this.actIte++,this.act=this.node[this.actIte]??null)}}runSub(){var e,t;for(;this.act&&!this.isTurnEnd();){let r=this.act;if(this.dispatch(r),!this.act&&((e=r.getParent())==null?void 0:e.name)===19){const i=this.refStack.pop();if(!i)throw new Error("ref stack underflow");r=i.act,this.parameters=i.para}for(this.act||(this.act=r.next());!this.act;){const i=r.getParent();if((i==null?void 0:i.name)===7){const n=this.repeatStack[this.repeatStack.length-1];if(!n)throw new Error("repeat stack underflow");if(n.ite++,n.ite<n.end){this.act=n.act;break}this.repeatStack.pop()}if(this.act=r.getParent(),!this.act)break;if(r=this.act,((t=this.act.getParent())==null?void 0:t.name)===19){const n=this.refStack.pop();if(!n)throw new Error("ref stack underflow");r=n.act,this.act=n.act,this.parameters=n.para}this.act=this.act.next()}}}dispatch(e){switch(e.name){case 0:this.runBullet();return;case 1:this.runAction();return;case 2:this.runFire();return;case 3:this.runChangeDirection();return;case 4:this.runChangeSpeed();return;case 5:this.runAccel();return;case 6:this.runWait();return;case 7:this.runRepeat();return;case 8:this.runBulletRef();return;case 9:this.runActionRef();return;case 10:this.runFireRef();return;case 11:this.runVanish();return;default:this.act=null}}runBullet(){if(this.act){if(this.setSpeed(),this.setDirection(),this.spd==null&&(this.prevSpd=this.spd=this.runner.getDefaultSpeed()),this.dir==null&&(this.prevDir=this.dir=this.runner.getAimDirection()),!this.act.getChild(1)&&!this.act.getChild(9))this.runner.createSimpleBullet(this.dir,this.spd);else{const e=[];this.act.getAllChildrenVec(1,e),this.act.getAllChildrenVec(9,e),this.runner.createBullet(new he(this.state.bulletml,e,this.parameters),this.dir,this.spd)}this.act=null}}runFire(){if(!this.act)return;this.shotInit(),this.setSpeed(),this.setDirection();let e=this.act.getChild(0);if(e||(e=this.act.getChild(8)),!e)throw new Error("<fire> must have contents bullet or bulletRef");this.act=e}runAction(){this.act&&(this.act=this.act.childBegin())}runWait(){this.act&&(this.doWait(Math.trunc(this.getNumberContents(this.act))),this.act=null)}runRepeat(){if(!this.act)return;const e=this.act.getChild(15);if(!e)return;const t=Math.trunc(this.getNumberContents(e));let r=this.act.getChild(1);if(r||(r=this.act.getChild(9)),!r)throw new Error("repeat elem must have contents action or actionRef");this.repeatStack.push({ite:0,end:t,act:r}),this.act=r}runFireRef(){if(!this.act)return;const e=this.act,t=this.parameters;this.parameters=this.getParameters(),this.refStack.push({act:e,para:t}),this.act=this.state.bulletml.getFireRef(e.refID)}runActionRef(){if(!this.act)return;const e=this.act,t=this.parameters;this.parameters=this.getParameters(),this.refStack.push({act:e,para:t}),this.act=this.state.bulletml.getActionRef(e.refID)}runBulletRef(){if(!this.act)return;const e=this.act,t=this.parameters;this.parameters=this.getParameters(),this.refStack.push({act:e,para:t}),this.act=this.state.bulletml.getBulletRef(e.refID)}runChangeDirection(){if(!this.act)return;const e=this.act.getChild(14),t=this.act.getChild(16);if(!e||!t){this.act=null;return}const r=Math.trunc(this.getNumberContents(e)),i=t.type,n=i!==4?this.getDirection(t,!1):this.getNumberContents(t);this.calcChangeDirection(n,r,i===4),this.act=null}runChangeSpeed(){if(!this.act)return;const e=this.act.getChild(14),t=this.act.getChild(17);if(!e||!t){this.act=null;return}const r=Math.trunc(this.getNumberContents(e));let i;t.type!==4?i=this.getSpeed(t):i=this.getNumberContents(t)*r+this.runner.getBulletSpeed(),this.calcChangeSpeed(i,r),this.act=null}runAccel(){if(!this.act)return;const e=this.act.getChild(14);if(!e){this.act=null;return}const t=Math.trunc(this.getNumberContents(e)),r=this.act.getChild(12),i=this.act.getChild(13);this.state.bulletml.isHorizontal()?(i&&this.calcAccelX(this.getNumberContents(i),t,i.type),r&&this.calcAccelY(-this.getNumberContents(r),t,r.type)):(r&&this.calcAccelX(this.getNumberContents(r),t,r.type),i&&this.calcAccelY(this.getNumberContents(i),t,i.type)),this.act=null}runVanish(){this.runner.doVanish(),this.act=null}applyChanges(){const e=this.runner.getTurn();this.changeDir&&(this.changeDir.isLast(e)?(this.runner.doChangeDirection(this.changeDir.getLast()),this.changeDir=null):this.runner.doChangeDirection(this.changeDir.getValue(e))),this.changeSpeed&&(this.changeSpeed.isLast(e)?(this.runner.doChangeSpeed(this.changeSpeed.getLast()),this.changeSpeed=null):this.runner.doChangeSpeed(this.changeSpeed.getValue(e))),this.accelX&&(this.accelX.isLast(e)?(this.runner.doAccelX(this.accelX.getLast()),this.accelX=null):this.runner.doAccelX(this.accelX.getValue(e))),this.accelY&&(this.accelY.isLast(e)?(this.runner.doAccelY(this.accelY.getLast()),this.accelY=null):this.runner.doAccelY(this.accelY.getValue(e)))}isTurnEnd(){return this.end||this.actTurn>this.endTurn}doWait(e){e<=0||(this.actTurn+=e)}shotInit(){this.spd=null,this.dir=null}setSpeed(){if(!this.act)return;const e=this.act.getChild(17);e&&(this.spd=this.getSpeed(e))}setDirection(){if(!this.act)return;const e=this.act.getChild(16);e&&(this.dir=this.getDirection(e,!0))}getNumberContents(e){return e.getValue({rank:this.runner.getRank(),parameters:this.parameters,runner:this.runner})}getSpeed(e){let t=this.getNumberContents(e);return e.type===3?t+=this.runner.getBulletSpeed():e.type===4&&(this.prevSpd==null?t=1:t+=this.prevSpd),this.prevSpd=t,t}getDirection(e,t){let r=this.getNumberContents(e),i=!0;for(e.type!==0&&(i=!1,e.type===2?this.state.bulletml.isHorizontal()&&(r-=90):e.type===3?r+=this.runner.getBulletDirection():e.type===4?this.prevDir==null?(r=0,i=!0):r+=this.prevDir:i=!0),i&&(r+=this.runner.getAimDirection());r>360;)r-=360;for(;r<0;)r+=360;return t&&(this.prevDir=r),r}calcChangeDirection(e,t,r){const i=this.actTurn+t,n=this.runner.getBulletDirection();if(r){this.changeDir=new Mt(this.actTurn,i,n,n+e*t);return}const l=e-n,a=l>0?l-360:l+360,h=Math.abs(l)<Math.abs(a)?l:a;this.changeDir=new Mt(this.actTurn,i,n,n+h)}calcChangeSpeed(e,t){const r=this.actTurn+t,i=this.runner.getBulletSpeed();this.changeSpeed=new Mt(this.actTurn,r,i,e)}calcAccelX(e,t,r){const i=this.actTurn+t,n=this.runner.getBulletSpeedX();let l;r===4?l=n+e*t:r===3?l=n+e:l=e,this.accelX=new Mt(this.actTurn,i,n,l)}calcAccelY(e,t,r){const i=this.actTurn+t,n=this.runner.getBulletSpeedY();let l;r===4?l=n+e*t:r===3?l=n+e:l=e,this.accelY=new Mt(this.actTurn,i,n,l)}getParameters(){if(!this.act)return null;let e=null;for(const t of this.act.childList())t.name===18&&(e||(e=[0]),e.push(this.getNumberContents(t)));return e}}class Be{constructor(e){s(this,"callbacks",{});s(this,"end",!1);s(this,"impl",[]);if(e instanceof he){this.impl.push(new Re(e,this));return}for(const t of e.getTopActions())this.impl.push(new Re(new he(e,[t],null),this))}run(){if(!this.end)for(const e of this.impl)e.run()}isEnd(){if(this.end)return!0;for(const e of this.impl)if(!e.isEnd())return!1;return this.impl.length>0}getBulletDirection(){return this.callNumber("getBulletDirection",0)}getAimDirection(){return this.callNumber("getAimDirection",0)}getBulletSpeed(){return this.callNumber("getBulletSpeed",0)}getDefaultSpeed(){return this.callNumber("getDefaultSpeed",1)}getRank(){return this.callNumber("getRank",0)}createSimpleBullet(e,t){this.callVoid("createSimpleBullet",e,t)}createBullet(e,t,r){this.callVoid("createBullet",e,t,r)}getTurn(){return Math.trunc(this.callNumber("getTurn",0))}doVanish(){this.callVoid("doVanish")}doChangeDirection(e){this.callVoid("doChangeDirection",e)}doChangeSpeed(e){this.callVoid("doChangeSpeed",e)}doAccelX(e){this.callVoid("doAccelX",e)}doAccelY(e){this.callVoid("doAccelY",e)}getBulletSpeedX(){return this.callNumber("getBulletSpeedX",0)}getBulletSpeedY(){return this.callNumber("getBulletSpeedY",0)}getRand(){return this.callNumber("getRand",Math.random())}callNumber(e,t){const r=this.callbacks[e];if(!r)return t;const i=r(this);return typeof i=="number"&&Number.isFinite(i)?i:t}callVoid(e,...t){const r=this.callbacks[e];r&&r(this,...t)}}class ns{constructor(e,t,r=null){s(this,"name");s(this,"url");s(this,"inlineXmlText");s(this,"parser",null);s(this,"preloadPromise",null);this.name=e,this.url=t,this.inlineXmlText=r}async preload(){this.parser||(this.preloadPromise||(this.preloadPromise=(async()=>{let e=this.inlineXmlText;if(e==null){const r=await fetch(this.url);if(!r.ok)throw new Error(`Unable to load BulletML: ${this.url}`);e=await r.text()}const t=new es(this.name);t.parse(e),this.parser=t})()),await this.preloadPromise)}createRunner(){if(!this.parser)throw new Error(`BulletML parser is not loaded yet: ${this.name}`);return new Be(this.parser)}}function as(c){const e=ls(c);let t=0;function r(){const a=e[t++];if(!a)return()=>0;if(a.type==="num"){const h=a.value;return()=>h}if(a.type==="var"){if(a.value==="rand")return d=>d.runner.getRand();if(a.value==="rank")return d=>d.rank;const h=Number.parseInt(a.value,10);return d=>!Number.isFinite(h)||!d.parameters||h<0||h>=d.parameters.length?1:d.parameters[h]}if(a.type==="op"&&a.value==="("){const h=n(),d=e[t++];if(!d||d.type!=="op"||d.value!==")")throw new Error("formula: missing ')' ");return h}if(a.type==="op"&&a.value==="-"){const h=r();return d=>-h(d)}throw new Error(`formula: invalid token ${a.value}`)}function i(){let a=r();for(;t<e.length;){const h=e[t];if(!h||h.type!=="op"||h.value!=="*"&&h.value!=="/")break;t++;const d=r(),u=a;h.value==="*"?a=f=>u(f)*d(f):a=f=>u(f)/d(f)}return a}function n(){let a=i();for(;t<e.length;){const h=e[t];if(!h||h.type!=="op"||h.value!=="+"&&h.value!=="-")break;t++;const d=i(),u=a;h.value==="+"?a=f=>u(f)+d(f):a=f=>u(f)-d(f)}return a}if(e.length===0)return()=>0;const l=n();if(t<e.length)throw new Error(`formula: trailing token ${e[t].value}`);return l}function ls(c){const e=[];let t=0;for(;t<c.length;){const r=c[t];if(r===" "||r==="	"||r===`
`||r==="\r"){t++;continue}if(r>="0"&&r<="9"||r==="."){let i=t+1;for(;i<c.length;){const n=c[i];if(n>="0"&&n<="9"||n===".")i++;else break}e.push({type:"num",value:Number.parseFloat(c.slice(t,i))}),t=i;continue}if(r==="$"){let i=t+1;for(;i<c.length;){const l=c[i];if(l>="a"&&l<="z"||l>="A"&&l<="Z"||l>="0"&&l<="9"||l==="_")i++;else break}const n=c.slice(t+1,i);e.push({type:"var",value:n}),t=i;continue}if("+-*/()".includes(r)){e.push({type:"op",value:r}),t++;continue}throw new Error(`formula: unsupported character '${r}'`)}return e}class F{constructor(){s(this,"BARRAGE_TYPE",13);s(this,"BARRAGE_MAX",64);s(this,"parser");s(this,"parserNum");s(this,"dirName",["morph","small","smallmove","smallsidemove","middle","middlesub","middlemove","middlebackmove","large","largemove","morph_lock","small_lock","middlesub_lock"]);this.parser=Array.from({length:this.BARRAGE_TYPE},()=>Array(this.BARRAGE_MAX).fill(null)),this.parserNum=Array(this.BARRAGE_TYPE).fill(0)}async loadBulletMLs(){const e=this.collectXmlTextByDir();for(let t=0;t<this.BARRAGE_TYPE;t++){const r=this.dirName[t],i=e.get(r)??[];let n=0;for(const l of i){if(n>=this.BARRAGE_MAX)break;const a=`${r}/${l.name}`;At.info(`Load BulletML: ${a}`);const h=new ns(a,"",l.xmlText);try{await h.preload(),this.parser[t][n]=h,n++}catch(d){const u=d instanceof Error?d.message:String(d);At.error(`Failed to load BulletML: ${a} (${u})`)}}this.parserNum[t]=n}}unloadBulletMLs(){for(let e=0;e<this.BARRAGE_TYPE;e++){for(let t=0;t<this.parserNum[e];t++)this.parser[e][t]=null;this.parserNum[e]=0}}collectXmlTextByDir(){const e=Object.assign({"../../../large/57way.xml":Er,"../../../large/88way.xml":xr,"../../../large/allround.xml":Rr,"../../../large/dr1_boss_1.xml":Tr,"../../../large/dr1_boss_2.xml":vr,"../../../large/forward_3way.xml":Lr,"../../../large/grow.xml":Ar,"../../../large/growround.xml":Cr,"../../../large/kr4_boss_rb_rockets.xml":Mr,"../../../large/mnway.xml":Pr,"../../../large/nway.xml":Ir,"../../../large/pxa_boss_opening.xml":Or,"../../../large/spread2blt.xml":Br,"../../../large/wide_spread.xml":Dr,"../../../largemove/down.xml":Nr,"../../../largemove/down_slow.xml":kr,"../../../middle/2round.xml":_r,"../../../middle/4way.xml":Fr,"../../../middle/double_roll_seeds.xml":Gr,"../../../middle/dr1_boss_3.xml":Yr,"../../../middle/kr3_boss_fastspread.xml":Ur,"../../../middle/nwroll.xml":Hr,"../../../middle/roll2way.xml":Vr,"../../../middle/roll4way.xml":$r,"../../../middle/shotgun.xml":zr,"../../../middle/spread_bf.xml":Xr,"../../../middlebackmove/up.xml":jr,"../../../middlemove/back.xml":Wr,"../../../middlemove/curve.xml":Zr,"../../../middlemove/down.xml":qr,"../../../middlemove/down_fast.xml":Kr,"../../../middlemove/down_slow.xml":Qr,"../../../middlesub/shot.xml":Jr,"../../../middlesub_lock/shot.xml":ti,"../../../morph/248shot.xml":ei,"../../../morph/3way.xml":ri,"../../../morph/6gt.xml":ii,"../../../morph/accel.xml":si,"../../../morph/bar.xml":ni,"../../../morph/divide.xml":ai,"../../../morph/fire_slowshot.xml":li,"../../../morph/kr1b_bit_shot.xml":oi,"../../../morph/nway.xml":hi,"../../../morph/side_back_shot.xml":ci,"../../../morph/sideway.xml":ui,"../../../morph/slowdown.xml":di,"../../../morph/spread.xml":pi,"../../../morph/twin.xml":mi,"../../../morph/wide.xml":fi,"../../../morph_lock/248shot.xml":bi,"../../../morph_lock/3way.xml":gi,"../../../morph_lock/6gt.xml":wi,"../../../morph_lock/accel.xml":yi,"../../../morph_lock/bar.xml":Si,"../../../morph_lock/divide.xml":Ei,"../../../morph_lock/fire_slowshot.xml":xi,"../../../morph_lock/kr1b_bit_shot.xml":Ri,"../../../morph_lock/nway.xml":Ti,"../../../morph_lock/side_back_shot.xml":vi,"../../../morph_lock/sideway.xml":Li,"../../../morph_lock/slowdown.xml":Ai,"../../../morph_lock/spread.xml":Ci,"../../../morph_lock/twin.xml":Mi,"../../../morph_lock/wide.xml":Pi,"../../../small/shot.xml":Ii,"../../../small_lock/shot.xml":Oi,"../../../smallmove/248shot.xml":Bi,"../../../smallmove/3waychase.xml":Di,"../../../smallmove/6gt.xml":Ni,"../../../smallmove/accel.xml":ki,"../../../smallmove/accum.xml":_i,"../../../smallmove/bar.xml":Fi,"../../../smallmove/bit_move.xml":Gi,"../../../smallmove/ikr5_vrp.xml":Yi,"../../../smallmove/kr1_boss_bit.xml":Ui,"../../../smallmove/nway.xml":Hi,"../../../smallmove/rndway.xml":Vi,"../../../smallmove/slowdown.xml":$i,"../../../smallmove/spread.xml":zi,"../../../smallmove/twin.xml":Xi,"../../../smallmove/twin_extend.xml":ji,"../../../smallsidemove/3waychase.xml":Wi,"../../../smallsidemove/downaccel.xml":Zi,"../../../smallsidemove/straight.xml":qi,"../../../smallsidemove/upaccel.xml":Ki}),t=new Map;for(const[r,i]of Object.entries(e)){const n=r.match(/\/([^/]+)\/([^/]+\.xml)$/);if(!n)continue;const l=n[1],a=n[2],h=t.get(l);h?h.push({name:a,xmlText:i}):t.set(l,[{name:a,xmlText:i}])}for(const r of t.values())r.sort((i,n)=>i.name.localeCompare(n.name));return t}}s(F,"MORPH",0),s(F,"SMALL",1),s(F,"SMALLMOVE",2),s(F,"SMALLSIDEMOVE",3),s(F,"MIDDLE",4),s(F,"MIDDLESUB",5),s(F,"MIDDLEMOVE",6),s(F,"MIDDLEBACKMOVE",7),s(F,"LARGE",8),s(F,"LARGEMOVE",9),s(F,"MORPH_LOCK",10),s(F,"SMALL_LOCK",11),s(F,"MIDDLESUB_LOCK",12);class L{constructor(e=0,t=0){s(this,"x");s(this,"y");this.x=e,this.y=t}opMul(e){return this.x*e.x+this.y*e.y}getElement(e){const t=new L,r=e.opMul(e);if(r!==0){const i=this.opMul(e);t.x=i*e.x/r,t.y=i*e.y/r}else t.x=0,t.y=0;return t}opAddAssign(e){this.x+=e.x,this.y+=e.y}opSubAssign(e){this.x-=e.x,this.y-=e.y}opMulAssign(e){this.x*=e,this.y*=e}opDivAssign(e){this.x/=e,this.y/=e}checkSide(e,t,r){const i=t.x-e.x,n=t.y-e.y,l=r?this.x+r.x:this.x,a=r?this.y+r.y:this.y;return i===0?n===0?0:n>0?l-e.x:e.x-l:n===0?i>0?e.y-a:a-e.y:i*n>0?(l-e.x)/i-(a-e.y)/n:-(l-e.x)/i+(a-e.y)/n}checkCross(e,t,r,i){let n,l,a,h;this.x<e.x?(n=this.x-i,a=e.x+i):(n=e.x-i,a=this.x+i),this.y<e.y?(l=this.y-i,h=e.y+i):(l=e.y-i,h=this.y+i);let d,u,f,g;if(r.y<t.y?(u=r.y-i,g=t.y+i):(u=t.y-i,g=r.y+i),h>=u&&g>=l&&(r.x<t.x?(d=r.x-i,f=t.x+i):(d=t.x-i,f=r.x+i),a>=d&&f>=n)){const w=this.y-e.y,v=e.x-this.x,E=e.x*this.y-e.y*this.x,x=r.y-t.y,B=t.x-r.x,k=t.x*r.y-t.y*r.x,H=v*x-w*B;if(H!==0){const q=(v*k-E*B)/H,K=(E*x-w*k)/H;if(n<=q&&q<=a&&l<=K&&K<=h&&d<=q&&q<=f&&u<=K&&K<=g)return!0}}return!1}checkHitDist(e,t,r){let i=t.x-e.x,n=t.y-e.y;const l=i*i+n*n;if(l>1e-5){const a=this.x-e.x,h=this.y-e.y,d=i*a+n*h;if(d>=0&&d<=l){const u=a*a+h*h-d*d/l;if(u>=0&&u<=r)return!0}}return!1}size(){return Math.sqrt(this.x*this.x+this.y*this.y)}dist(e){const t=Math.abs(this.x-e.x),r=Math.abs(this.y-e.y);return t>r?t+r/2:r+t/2}toString(){return`(${this.x}, ${this.y})`}}const W=class W{constructor(e){s(this,"pos");s(this,"acc");s(this,"deg",0);s(this,"speed",0);s(this,"id");s(this,"runner",null);s(this,"_rank",0);this.pos=new L,this.acc=new L,this.id=e}static setRandSeed(e){W.rand.setSeed(e)}static setBulletsManager(e){W.manager=e,W.target=new L,W.target.x=0,W.target.y=0}static getRand(){return W.rand.nextFloat(1)}static addBullet(e,t,r){if(typeof e=="number"){W.manager.addSimpleBullet(e,t);return}W.manager.addStateBullet(e,t,r??0)}static getTurn(){return W.manager.getTurn()}set(e,t,r,i,n){this.pos.x=e,this.pos.y=t,this.acc.x=0,this.acc.y=0,this.deg=r,this.speed=i,this.rank=n,this.runner=null}setRunner(e){this.runner=e}setWithRunner(e,t,r,i,n,l){this.set(t,r,i,n,l),this.setRunner(e)}move(){W.now=this,this.runner&&!Te(this.runner)&&Ts(this.runner)}isEnd(){return this.runner?Te(this.runner):!0}kill(){W.manager.killMe(this)}remove(){this.runner&&(vs(this.runner),this.runner=null)}get rank(){return this._rank}set rank(e){this._rank=e}};s(W,"now"),s(W,"target"),s(W,"rand",new it),s(W,"manager");let _=W;const os=62/10,Nt=10/62;function De(c){return c*180/Math.PI}function be(c){return c*Math.PI/180}function hs(c){return De(_.now.deg)}function cs(c){return _.now.speed*os}function us(c){return 1}function ds(c){return _.now.rank}function ps(c,e,t){_.addBullet(be(e),t*Nt)}function ms(c,e,t,r){_.addBullet(e,be(t),r*Nt)}function fs(c){return _.getTurn()}function bs(c){_.now.kill()}function gs(c,e){_.now.deg=be(e)}function ws(c,e){_.now.speed=e*Nt}function ys(c,e){_.now.acc.x=e*Nt}function Ss(c,e){_.now.acc.y=e*Nt}function Es(c){return _.now.acc.x}function xs(c){return _.now.acc.y}function Rs(c){return _.getRand()}function Te(c){return c?typeof c.isEnd=="function"?c.isEnd():!!c.end||!!c.finished:!0}function Ts(c){if(typeof c.run=="function"){c.run();return}typeof c.update=="function"&&c.update()}function vs(c){typeof c.dispose=="function"&&c.dispose(),typeof c.close=="function"&&c.close(),c.end=!0}class Ls{constructor(e){s(this,"num");s(this,"idx");s(this,"enumIdx");s(this,"lists");s(this,"draft",null);this.num=e,this.idx=0,this.enumIdx=this.idx,this.lists=Array.from({length:e},()=>null)}beginNewList(){this.resetList(),this.newList()}nextNewList(){if(this.endList(),this.enumIdx>=this.idx+this.num||this.enumIdx<this.idx)throw new pe("Can't create new list. Index out of bound.");this.newList()}endNewList(){this.endList()}resetList(){this.enumIdx=this.idx}newList(){this.draft=null,o.beginDisplayListCapture(e=>{this.setCurrentCommands(e)})}endList(){o.endDisplayListCapture();const e=this.enumIdx-this.idx;e>=0&&e<this.lists.length&&(this.lists[e]=this.draft),this.enumIdx++}call(e){const t=this.lists[e];t&&t()}setCurrentList(e){this.draft=e}setCurrentCommands(e){this.draft=()=>{for(let t=0;t<e.length;t++)e[t]()}}close(){this.lists.fill(null),this.draft=null}}class As{constructor(){s(this,"renderTarget",null);s(this,"LUMINOUS_TEXTURE_WIDTH_MAX",64);s(this,"LUMINOUS_TEXTURE_HEIGHT_MAX",64);s(this,"luminousTextureWidth",64);s(this,"luminousTextureHeight",64);s(this,"screenWidth",0);s(this,"screenHeight",0);s(this,"luminous",0);s(this,"renderingToTexture",!1);s(this,"lmOfs",[[0,0],[1,0],[-1,0],[0,1],[0,-1]]);s(this,"lmOfsBs",5)}makeLuminousTexture(){const e=o.gl;if(!e){this.renderTarget=null;return}this.renderTarget&&(e.deleteRenderTarget(this.renderTarget),this.renderTarget=null),this.renderTarget=e.createRenderTarget(this.luminousTextureWidth,this.luminousTextureHeight)}init(e,t,r){this.makeLuminousTexture(),this.luminous=e,this.resized(t,r)}resized(e,t){this.screenWidth=e,this.screenHeight=t}close(){var e;this.renderTarget&&((e=o.gl)==null||e.deleteRenderTarget(this.renderTarget),this.renderTarget=null),this.renderingToTexture=!1}startRenderToTexture(){var e;this.renderTarget&&((e=o.gl)==null||e.beginRenderTarget(this.renderTarget),this.renderingToTexture=!0,o.glClear(o.GL_COLOR_BUFFER_BIT))}endRenderToTexture(){var e;this.renderingToTexture&&((e=o.gl)==null||e.endRenderTarget(),this.renderingToTexture=!1)}startRender(){this.startRenderToTexture()}endRender(){this.endRenderToTexture()}viewOrtho(){o.glMatrixMode(o.GL_PROJECTION),o.glPushMatrix(),o.glLoadIdentity(),o.glOrtho(0,this.screenWidth,this.screenHeight,0,-1,1),o.glMatrixMode(o.GL_MODELVIEW),o.glPushMatrix(),o.glLoadIdentity()}viewPerspective(){o.glMatrixMode(o.GL_PROJECTION),o.glPopMatrix(),o.glMatrixMode(o.GL_MODELVIEW),o.glPopMatrix()}draw(){var e;if(this.renderTarget){o.glEnable(o.GL_TEXTURE_2D),(e=o.gl)==null||e.bindTexture(this.renderTarget.texture),this.viewOrtho(),o.setColor(1,.8,.9,this.luminous),o.glBegin(o.GL_QUADS);for(let t=0;t<5;t++)o.glTexCoord2f(0,1),o.glVertex3f(0+this.lmOfs[t][0]*this.lmOfsBs,0+this.lmOfs[t][1]*this.lmOfsBs,0),o.glTexCoord2f(0,0),o.glVertex3f(0+this.lmOfs[t][0]*this.lmOfsBs,this.screenHeight+this.lmOfs[t][1]*this.lmOfsBs,0),o.glTexCoord2f(1,0),o.glVertex3f(this.screenWidth+this.lmOfs[t][0]*this.lmOfsBs,this.screenHeight+this.lmOfs[t][0]*this.lmOfsBs,0),o.glTexCoord2f(1,1),o.glVertex3f(this.screenWidth+this.lmOfs[t][0]*this.lmOfsBs,0+this.lmOfs[t][0]*this.lmOfsBs,0);o.glEnd(),this.viewPerspective(),o.glDisable(o.GL_TEXTURE_2D)}}}const T=class T extends o{constructor(){super(...arguments);s(this,"luminousScreen",null)}init(){this.setCaption(T.CAPTION),o.glEnable(o.GL_LINE_SMOOTH),o.glBlendFunc(o.GL_SRC_ALPHA,o.GL_ONE),o.glEnable(o.GL_BLEND),o.glDisable(o.GL_LIGHTING),o.glDisable(o.GL_CULL_FACE),o.glDisable(o.GL_DEPTH_TEST),o.glDisable(o.GL_TEXTURE_2D),o.glDisable(o.GL_COLOR_MATERIAL),T.rand=new it,T.luminous>0?(this.luminousScreen=new As,this.luminousScreen.init(T.luminous,o.width,o.height)):this.luminousScreen=null}close(){var t;(t=this.luminousScreen)==null||t.close()}startRenderToTexture(){var t;(t=this.luminousScreen)==null||t.startRenderToTexture()}endRenderToTexture(){var t;(t=this.luminousScreen)==null||t.endRenderToTexture()}drawLuminous(){var t;(t=this.luminousScreen)==null||t.draw()}resized(t,r){var i;(i=this.luminousScreen)==null||i.resized(t,r),super.resized(t,r)}viewOrthoFixed(){o.glMatrixMode(o.GL_PROJECTION),o.glPushMatrix(),o.glLoadIdentity(),o.glOrtho(0,640,480,0,-1,1),o.glMatrixMode(o.GL_MODELVIEW),o.glPushMatrix(),o.glLoadIdentity()}viewPerspective(){o.glMatrixMode(o.GL_PROJECTION),o.glPopMatrix(),o.glMatrixMode(o.GL_MODELVIEW),o.glPopMatrix()}static setRetroParam(t,r){T.retro=t,T.retroSize=r}static setRetroColor(t,r,i,n){T.retroR=t,T.retroG=r,T.retroB=i,T.retroA=n}static setRetroZ(t){T.retroZ=t}static drawLineRetro(t,r,i,n){if(T.setRetroDrawColor(),T.retro<.2){o.glBegin(o.GL_LINES),o.glVertex3f(t,r,T.retroZ),o.glVertex3f(i,n,T.retroZ),o.glEnd();return}const l=T.getRetroVerticesScratch();T.emitRetroSegmentQuads(l,t,r,i,n),l.length>0&&o.glDrawArrays(o.GL_QUADS,l,[])}static drawLineLoopRetro(t,r=0,i=0){if(t.length<2)return;if(T.setRetroDrawColor(),T.retro<.2){o.glBegin(o.GL_LINE_LOOP);for(let a=0;a<t.length;a++){const h=t[a];o.glVertex3f(r+h.x,i+h.y,T.retroZ)}o.glEnd();return}const n=T.getRetroVerticesScratch();let l=1;for(let a=0;a<t.length;a++,l++){l>=t.length&&(l=0);const h=t[a],d=t[l];T.emitRetroSegmentQuads(n,r+h.x,i+h.y,r+d.x,i+d.y)}n.length>0&&o.glDrawArrays(o.GL_QUADS,n,[])}static drawLineLoopRetro4(t,r,i,n,l,a,h,d){if(T.setRetroDrawColor(),T.retro<.2){o.glBegin(o.GL_LINE_LOOP),o.glVertex3f(t,r,T.retroZ),o.glVertex3f(i,n,T.retroZ),o.glVertex3f(l,a,T.retroZ),o.glVertex3f(h,d,T.retroZ),o.glEnd();return}const u=T.getRetroVerticesScratch();T.emitRetroSegmentQuads(u,t,r,i,n),T.emitRetroSegmentQuads(u,i,n,l,a),T.emitRetroSegmentQuads(u,l,a,h,d),T.emitRetroSegmentQuads(u,h,d,t,r),u.length>0&&o.glDrawArrays(o.GL_QUADS,u,[])}static drawLineLoopRetro3(t,r,i,n,l,a){if(T.setRetroDrawColor(),T.retro<.2){o.glBegin(o.GL_LINE_LOOP),o.glVertex3f(t,r,T.retroZ),o.glVertex3f(i,n,T.retroZ),o.glVertex3f(l,a,T.retroZ),o.glEnd();return}const h=T.getRetroVerticesScratch();T.emitRetroSegmentQuads(h,t,r,i,n),T.emitRetroSegmentQuads(h,i,n,l,a),T.emitRetroSegmentQuads(h,l,a,t,r),h.length>0&&o.glDrawArrays(o.GL_QUADS,h,[])}static setRetroDrawColor(){const t=(1-T.retro)*.5;let r=T.retroR+(1-T.retroR)*t,i=T.retroG+(1-T.retroG)*t,n=T.retroB+(1-T.retroB)*t,l=T.retroA*(t+.5);T.rand.nextInt(7)===0&&(r=Math.min(r*1.5,1),i=Math.min(i*1.5,1),n=Math.min(n*1.5,1),l=Math.min(l*1.5,1)),o.setColor(r,i,n,l)}static emitRetroSegmentQuads(t,r,i,n,l){const a=T.retroSize*T.retro;if(a<=0)return;const h=a/2,d=Math.abs(n-r),u=Math.abs(l-i);if(d<u){const B=Math.floor(u/a);if(B<=0)return;const k=(n-r)/B;let H=0;const q=l<i?-a:a;let K=r,dt=i;for(let Et=0;Et<=B;Et++,H+=k,dt+=q)H>=a?(K+=a,H-=a):H<=-a&&(K-=a,H+=a),t.push(K-h,dt-h,T.retroZ,K+h,dt-h,T.retroZ,K+h,dt+h,T.retroZ,K-h,dt+h,T.retroZ);return}const f=Math.floor(d/a);if(f<=0)return;const g=(l-i)/f;let w=0;const v=n<r?-a:a;let E=r,x=i;for(let B=0;B<=f;B++,E+=v,w+=g)w>=a?(x+=a,w-=a):w<=-a&&(x-=a,w+=a),t.push(E-h,x-h,T.retroZ,E+h,x-h,T.retroZ,E+h,x+h,T.retroZ,E-h,x+h,T.retroZ)}static getRetroVerticesScratch(){return T.retroVerticesScratch.length=0,T.retroVerticesScratch}static drawBoxRetro(t,r,i,n,l){const a=i*Math.cos(l)-n*Math.sin(l),h=i*Math.sin(l)+n*Math.cos(l),d=-i*Math.cos(l)-n*Math.sin(l),u=-i*Math.sin(l)+n*Math.cos(l);T.drawLineLoopRetro4(t+d,r-u,t+a,r-h,t-d,r+u,t-a,r+h)}static drawBoxLine(t,r,i,n){o.glBegin(o.GL_LINE_LOOP),o.glVertex3f(t,r,0),o.glVertex3f(t+i,r,0),o.glVertex3f(t+i,r+n,0),o.glVertex3f(t,r+n,0),o.glEnd()}static drawBoxSolid(t,r,i,n){o.glBegin(o.GL_TRIANGLE_FAN),o.glVertex3f(t,r,0),o.glVertex3f(t+i,r,0),o.glVertex3f(t+i,r+n,0),o.glVertex3f(t,r+n,0),o.glEnd()}};s(T,"CAPTION","PARSEC47"),s(T,"luminous",0),s(T,"rand"),s(T,"retro",0),s(T,"retroSize",.2),s(T,"retroR",1),s(T,"retroG",1),s(T,"retroB",1),s(T,"retroA",1),s(T,"retroZ",0),s(T,"retroVerticesScratch",[]);let S=T;class P{static init(e){if(this.manager=e,!$.noSound){wt.dir="sounds",zt.dir="sounds",this.bgm=[];for(let t=0;t<this.BGM_NUM;t++){const r=new wt;r.load(this.bgmFileName[t]),this.bgm.push(r)}this.se=[];for(let t=0;t<this.SE_NUM;t++){const r=new zt;r.load(this.seFileName[t],this.seChannel[t]),this.se.push(r)}}}static close(){if(!$.noSound){for(let e=0;e<this.bgm.length;e++)this.bgm[e].free();for(let e=0;e<this.se.length;e++)this.se[e].free()}}static playBgm(e){$.noSound||this.manager.state!==yt.IN_GAME||this.bgm[e].play()}static playSe(e){$.noSound||this.manager.state!==yt.IN_GAME||this.se[e].play()}static stopSe(e){$.noSound||this.se[e].halt()}}s(P,"SHOT",0),s(P,"ROLL_CHARGE",1),s(P,"ROLL_RELEASE",2),s(P,"SHIP_DESTROYED",3),s(P,"GET_BONUS",4),s(P,"EXTEND",5),s(P,"ENEMY_DESTROYED",6),s(P,"LARGE_ENEMY_DESTROYED",7),s(P,"BOSS_DESTROYED",8),s(P,"LOCK",9),s(P,"LASER",10),s(P,"BGM_NUM",4),s(P,"SE_NUM",11),s(P,"manager"),s(P,"bgm",[]),s(P,"se",[]),s(P,"bgmFileName",["ptn0.ogg","ptn1.ogg","ptn2.ogg","ptn3.ogg"]),s(P,"seFileName",["shot.wav","rollchg.wav","rollrls.wav","shipdst.wav","getbonus.wav","extend.wav","enemydst.wav","largedst.wav","bossdst.wav","lock.wav","laser.wav"]),s(P,"seChannel",[0,1,2,1,3,4,5,6,7,1,2]);const O=class O{constructor(){s(this,"restart",!1);s(this,"RESTART_CNT",300);s(this,"pos",new L);s(this,"cnt",0);s(this,"pad");s(this,"field");s(this,"manager");s(this,"ppos",new L);s(this,"baseSpeed",O.BASE_SPEED);s(this,"slowSpeed",O.SLOW_BASE_SPEED);s(this,"speed",O.BASE_SPEED);s(this,"vel",new L);s(this,"bank",0);s(this,"firePos",new L);s(this,"fireWideDeg",O.FIRE_WIDE_BASE_DEG);s(this,"fireCnt",0);s(this,"ttlCnt",0);s(this,"fieldLimitX",0);s(this,"fieldLimitY",0);s(this,"rollLockCnt",0);s(this,"rollCharged",!1)}static createDisplayLists(){O.deleteDisplayLists();const e=new Ls(3);e.beginNewList(),o.setColor(.5,1,.5,.2),S.drawBoxSolid(-.1,-.5,.2,1),o.setColor(.5,1,.5,.4),S.drawBoxLine(-.1,-.5,.2,1),e.nextNewList(),o.setColor(1,.2,.2,1),S.drawBoxSolid(-.2,-.2,.4,.4),o.setColor(1,.5,.5,1),S.drawBoxLine(-.2,-.2,.4,.4),e.nextNewList(),o.setColor(.7,1,.5,.3),S.drawBoxSolid(-.15,-.3,.3,.6),o.setColor(.7,1,.5,.6),S.drawBoxLine(-.15,-.3,.3,.6),e.endNewList(),O.displayList=e}static deleteDisplayLists(){var e;(e=O.displayList)==null||e.close(),O.displayList=null}init(e,t,r){this.pad=e,this.field=t,this.manager=r,this.pos=new L,this.ppos=new L,this.vel=new L,this.firePos=new L,this.ttlCnt=0,this.fieldLimitX=t.size.x-O.FIELD_SPACE,this.fieldLimitY=t.size.y-O.FIELD_SPACE}start(){this.ppos.x=this.pos.x=0,this.ppos.y=this.pos.y=-this.field.size.y/2,this.vel.x=0,this.vel.y=0,this.speed=O.BASE_SPEED,this.fireWideDeg=O.FIRE_WIDE_BASE_DEG,this.restart=!0,this.cnt=-228,this.fireCnt=0,this.rollLockCnt=0,this.bank=0,this.rollCharged=!1,at.resetBonusScore()}close(){}setSpeedRate(e){O.isSlow?this.baseSpeed=O.BASE_SPEED*.7:this.baseSpeed=O.BASE_SPEED*e,this.slowSpeed=O.SLOW_BASE_SPEED*e}destroyed(){if(!(this.cnt<=0)){P.playSe(P.SHIP_DESTROYED),this.manager.shipDestroyed(),this.manager.addFragments(30,this.pos.x,this.pos.y,this.pos.x,this.pos.y,0,.08,Math.PI);for(let e=0;e<45;e++)this.manager.addParticle(this.pos,O.rand.nextFloat(Math.PI*2),0,.6);this.start(),this.cnt=-this.RESTART_CNT}}move(){if(this.cnt++,this.cnt<-228)return;this.cnt===0&&(this.restart=!1);const e=this.pad.getButtonState();e&tt.Button.B?(this.speed+=(this.slowSpeed-this.speed)*.2,this.fireWideDeg+=(O.FIRE_NARROW_BASE_DEG-this.fireWideDeg)*.1,this.rollLockCnt++,this.manager.mode===yt.ROLL?this.rollLockCnt%15===0&&(this.manager.addRoll(),P.playSe(P.ROLL_CHARGE),this.rollCharged=!0):this.rollLockCnt%10===0&&this.manager.addLock()):(this.speed+=(this.baseSpeed-this.speed)*.2,this.fireWideDeg+=(O.FIRE_WIDE_BASE_DEG-this.fireWideDeg)*.1,this.manager.mode===yt.ROLL?this.rollCharged&&(this.rollLockCnt=0,this.manager.releaseRoll(),P.playSe(P.ROLL_RELEASE),this.rollCharged=!1):(this.rollLockCnt=0,this.manager.releaseLock()));const t=this.pad.getDirState();if(this.vel.x=0,this.vel.y=0,t&tt.Dir.UP?this.vel.y=this.speed:t&tt.Dir.DOWN&&(this.vel.y=-this.speed),t&tt.Dir.RIGHT?this.vel.x=this.speed:t&tt.Dir.LEFT&&(this.vel.x=-this.speed),this.vel.x!==0&&this.vel.y!==0&&(this.vel.x*=.707,this.vel.y*=.707),this.ppos.x=this.pos.x,this.ppos.y=this.pos.y,this.pos.x+=this.vel.x,this.pos.y+=this.vel.y,this.bank+=(this.vel.x*O.BANK_BASE-this.bank)*.1,this.pos.x<-this.fieldLimitX?this.pos.x=-this.fieldLimitX:this.pos.x>this.fieldLimitX&&(this.pos.x=this.fieldLimitX),this.pos.y<-this.fieldLimitY?this.pos.y=-this.fieldLimitY:this.pos.y>this.fieldLimitY&&(this.pos.y=this.fieldLimitY),e&tt.Button.A){let r=0;switch(this.fireCnt%4){case 0:this.firePos.x=this.pos.x+O.TURRET_INTERVAL_LENGTH,this.firePos.y=this.pos.y,r=0;break;case 1:this.firePos.x=this.pos.x+O.TURRET_INTERVAL_LENGTH,this.firePos.y=this.pos.y,r=this.fireWideDeg*((this.fireCnt/4|0)%5)*.2;break;case 2:this.firePos.x=this.pos.x-O.TURRET_INTERVAL_LENGTH,this.firePos.y=this.pos.y,r=0;break;case 3:this.firePos.x=this.pos.x-O.TURRET_INTERVAL_LENGTH,this.firePos.y=this.pos.y,r=-this.fireWideDeg*((this.fireCnt/4|0)%5)*.2;break}this.manager.addShot(this.firePos,r),P.playSe(P.SHOT),this.fireCnt++}_.target&&(_.target.x=this.pos.x,_.target.y=this.pos.y),this.ttlCnt++}draw(){var e,t,r,i,n,l,a,h,d;if(!(this.cnt<-228||this.cnt<0&&-this.cnt%32<16)){o.glPushMatrix(),o.glTranslatef(this.pos.x,this.pos.y,0),(e=O.displayList)==null||e.call(1),o.glRotatef(this.bank,0,1,0),o.glTranslatef(-.5,0,0),(t=O.displayList)==null||t.call(0),o.glTranslatef(.2,.3,.2),(r=O.displayList)==null||r.call(0),o.glTranslatef(0,0,-.4),(i=O.displayList)==null||i.call(0),o.glPopMatrix(),o.glPushMatrix(),o.glTranslatef(this.pos.x,this.pos.y,0),o.glRotatef(this.bank,0,1,0),o.glTranslatef(.5,0,0),(n=O.displayList)==null||n.call(0),o.glTranslatef(-.2,.3,.2),(l=O.displayList)==null||l.call(0),o.glTranslatef(0,0,-.4),(a=O.displayList)==null||a.call(0),o.glPopMatrix();for(let u=0;u<6;u++)o.glPushMatrix(),o.glTranslatef(this.pos.x-.7,this.pos.y-.3,0),o.glRotatef(this.bank,0,1,0),o.glRotatef(180/2-this.fireWideDeg*100,0,0,1),o.glRotatef(u*180/3-this.ttlCnt*4,1,0,0),o.glTranslatef(0,0,.7),(h=O.displayList)==null||h.call(2),o.glPopMatrix(),o.glPushMatrix(),o.glTranslatef(this.pos.x+.7,this.pos.y-.3,0),o.glRotatef(this.bank,0,1,0),o.glRotatef(-180/2+this.fireWideDeg*100,0,0,1),o.glRotatef(u*180/3-this.ttlCnt*4,1,0,0),o.glTranslatef(0,0,.7),(d=O.displayList)==null||d.call(2),o.glPopMatrix()}}};s(O,"isSlow",!1),s(O,"INVINCIBLE_CNT",228),s(O,"rand",new it),s(O,"displayList",null),s(O,"SIZE",.3),s(O,"BASE_SPEED",.6),s(O,"SLOW_BASE_SPEED",.3),s(O,"BANK_BASE",50),s(O,"FIRE_WIDE_BASE_DEG",.7),s(O,"FIRE_NARROW_BASE_DEG",.5),s(O,"TURRET_INTERVAL_LENGTH",.2),s(O,"FIELD_SPACE",1.5);let vt=O;const C=class C extends St{constructor(){super(...arguments);s(this,"fieldLimitX",0);s(this,"fieldLimitY",0);s(this,"field");s(this,"ship");s(this,"manager");s(this,"pos",new L);s(this,"vel",new L);s(this,"cnt",0);s(this,"isDown",!0);s(this,"isInhaled",!1);s(this,"inhaleCnt",0)}static init(){C.rand=new it}static resetBonusScore(){C.bonusScore=10}static setSpeedRate(t){C.rate=t,C.speed=C.BASE_SPEED*C.rate}init(t){const r=Array.isArray(t)?t[0]:t;if(!(r instanceof Ne))throw new Error("Bonus.init requires BonusInitializer");this.field=r.field,this.ship=r.ship,this.manager=r.manager,this.pos=new L,this.vel=new L,this.fieldLimitX=this.field.size.x/6*5,this.fieldLimitY=this.field.size.y/10*9}set(t,r=null){this.pos.x=t.x,this.pos.y=t.y,r!==null&&(this.pos.x+=r.x,this.pos.y+=r.y),this.vel.x=C.rand.nextSignedFloat(.07),this.vel.y=C.rand.nextSignedFloat(.07),this.cnt=0,this.inhaleCnt=0,this.isDown=!0,this.isInhaled=!1,this.exists=!0}missBonus(){C.resetBonusScore()}getBonus(){P.playSe(P.GET_BONUS),this.manager.addScore(C.bonusScore),C.bonusScore<1e3&&(C.bonusScore+=10)}move(){if(this.pos.x+=this.vel.x,this.pos.y+=this.vel.y,this.vel.x-=this.vel.x/50,this.pos.x>this.fieldLimitX?(this.pos.x=this.fieldLimitX,this.vel.x>0&&(this.vel.x=-this.vel.x)):this.pos.x<-this.fieldLimitX&&(this.pos.x=-this.fieldLimitX,this.vel.x<0&&(this.vel.x=-this.vel.x)),this.isDown)this.vel.y+=(-C.speed-this.vel.y)/50,this.pos.y<-this.fieldLimitY&&(this.isDown=!1,this.pos.y=-this.fieldLimitY,this.vel.y=C.speed);else if(this.vel.y+=(C.speed-this.vel.y)/50,this.pos.y>this.fieldLimitY){this.missBonus(),this.exists=!1;return}if(this.cnt++,this.cnt<C.RETRO_CNT)return;const t=this.pos.dist(this.ship.pos);if(t<C.ACQUIRE_WIDTH*(1+this.inhaleCnt*.2)&&this.ship.cnt>=-228){this.getBonus(),this.exists=!1;return}if(this.isInhaled){this.inhaleCnt++;let r=(C.INHALE_WIDTH-t)/48;r<.025&&(r=.025),this.vel.x+=(this.ship.pos.x-this.pos.x)*r,this.vel.y+=(this.ship.pos.y-this.pos.y)*r,this.ship.cnt<-228&&(this.isInhaled=!1,this.inhaleCnt=0)}else t<C.INHALE_WIDTH&&this.ship.cnt>=-228&&(this.isInhaled=!0)}draw(){const t=this.cnt<C.RETRO_CNT?1-this.cnt/C.RETRO_CNT:0,r=this.cnt*.1,i=Math.sin(r)*.3,n=Math.cos(r)*.3;t>0?(S.setRetroParam(t,.2),S.drawBoxRetro(this.pos.x-i,this.pos.y-n,C.BOX_SIZE/2,C.BOX_SIZE/2,0),S.drawBoxRetro(this.pos.x+i,this.pos.y+n,C.BOX_SIZE/2,C.BOX_SIZE/2,0),S.drawBoxRetro(this.pos.x-n,this.pos.y+i,C.BOX_SIZE/2,C.BOX_SIZE/2,0),S.drawBoxRetro(this.pos.x+n,this.pos.y-i,C.BOX_SIZE/2,C.BOX_SIZE/2,0)):(this.isInhaled?o.setColor(.8,.6,.4,.7):this.isDown?o.setColor(.4,.9,.6,.7):o.setColor(.8,.9,.5,.7),S.drawBoxLine(this.pos.x-i-C.BOX_SIZE/2,this.pos.y-n-C.BOX_SIZE/2,C.BOX_SIZE,C.BOX_SIZE),S.drawBoxLine(this.pos.x+i-C.BOX_SIZE/2,this.pos.y+n-C.BOX_SIZE/2,C.BOX_SIZE,C.BOX_SIZE),S.drawBoxLine(this.pos.x-n-C.BOX_SIZE/2,this.pos.y+i-C.BOX_SIZE/2,C.BOX_SIZE,C.BOX_SIZE),S.drawBoxLine(this.pos.x+n-C.BOX_SIZE/2,this.pos.y-i-C.BOX_SIZE/2,C.BOX_SIZE,C.BOX_SIZE))}};s(C,"rate",1),s(C,"bonusScore",10),s(C,"BASE_SPEED",.1),s(C,"speed",C.BASE_SPEED),s(C,"INHALE_WIDTH",3),s(C,"ACQUIRE_WIDTH",1),s(C,"RETRO_CNT",20),s(C,"BOX_SIZE",.4),s(C,"rand",new it);let at=C;class Ne{constructor(e,t,r){this.field=e,this.ship=t,this.manager=r}}class Ct extends xt{constructor(t,r){super(t,[r],()=>new ct);s(this,"cnt",0);_.setBulletsManager(this),ct.init(),this.cnt=0}addManagedBullet(t,r,i,n,l,a,h,d,u,f,g){const w=this.acquireActor();return w?(w.setRunnerBullet(t,r,i,n,l,a,h,d,u,f,g),w.setInvisible(),w):null}addTopBullet(t,r,i,n,l,a,h,d,u,f,g,w){const v=this.addManagedBullet(r,i,n,l,a,h,d,u,f,g,w);return v?(v.setTop(t),v):null}addTopMorphBullet(t,r,i,n,l,a,h,d,u,f,g,w,v,E,x){const B=this.acquireActor();return B?(B.setRunnerMorphBullet(r,i,n,l,a,h,d,u,f,g,w,v,E,0,x),B.setTop(t),B):null}move(){super.move(),this.cnt++}getTurn(){return this.cnt}killMe(t){const r=this.actor[t.id];if(r&&r.bullet.id===t.id){r.remove();return}for(let i=0;i<this.actor.length;i++){const n=this.actor[i];if(!n.exists)continue;const l=n.bullet;if(l===t||l.id===t.id){n.remove();return}}}clear(){for(let t=0;t<this.actor.length;t++)this.actor[t].exists&&this.actor[t].remove()}static registFunctions(t){const r=t.callbacks??(t.callbacks={});r.getBulletDirection=hs,r.getAimDirection=Cs,r.getBulletSpeed=cs,r.getDefaultSpeed=us,r.getRank=ds,r.createSimpleBullet=ps,r.createBullet=ms,r.getTurn=fs,r.doVanish=bs,r.doChangeDirection=gs,r.doChangeSpeed=ws,r.doAccelX=ys,r.doAccelY=Ss,r.getBulletSpeedX=Es,r.getBulletSpeedY=xs,r.getRand=Rs}acquireActor(){return this.getInstance()}addSimpleBullet(t,r){const i=this.acquireActor();if(!i)return;const n=_.now,l=n.morphParser,a=n.morphNum,h=n.morphIdx,d=n.morphCnt;if(n.isMorph){const u=l[h];if(!u)throw new Error(`Morph parser missing at index ${h} (morphNum=${a})`);const f=u.createRunner();Ct.registFunctions(f),i.setRunnerMorphBullet(f,_.now.pos.x,_.now.pos.y,t,r,_.now.rank,n.speedRank,n.shape,n.color,n.bulletSize,n.xReverse,l,a,h+1,d-1);return}i.setSimpleBullet(_.now.pos.x,_.now.pos.y,t,r,_.now.rank,n.speedRank,n.shape,n.color,n.bulletSize,n.xReverse)}addStateBullet(t,r,i){const n=this.acquireActor();if(!n)return;const l=this.createRunnerFromState(t);Ct.registFunctions(l);const a=_.now;if(a.isMorph){n.setRunnerMorphBullet(l,_.now.pos.x,_.now.pos.y,r,i,_.now.rank,a.speedRank,a.shape,a.color,a.bulletSize,a.xReverse,a.morphParser,a.morphNum,a.morphIdx,a.morphCnt);return}n.setRunnerBullet(l,_.now.pos.x,_.now.pos.y,r,i,_.now.rank,a.speedRank,a.shape,a.color,a.bulletSize,a.xReverse)}createRunnerFromState(t){return t.createRunner()}}function Cs(c){const e=_.now.pos,t=_.target,r=_.now.xReverse;return Math.atan2(t.x-e.x,t.y-e.y)*r*180/Math.PI}class Qt extends _{constructor(t){super(t);s(this,"morphParser",[]);s(this,"morphNum",0);s(this,"morphIdx",0);s(this,"morphCnt",0);s(this,"baseMorphIdx",0);s(this,"baseMorphCnt",0);s(this,"isMorph",!1)}setMorph(t,r,i,n){if(n<=0){this.isMorph=!1;return}this.isMorph=!0,this.baseMorphCnt=this.morphCnt=n,this.morphNum=r;for(let l=0;l<r;l++)this.morphParser[l]=t[l];this.morphIdx=i,this.morphIdx>=this.morphNum&&(this.morphIdx=0),this.baseMorphIdx=this.morphIdx}resetMorph(){this.morphIdx=this.baseMorphIdx,this.morphCnt=this.baseMorphCnt}}s(Qt,"MORPH_MAX",8);class Ms extends Qt{constructor(t){super(t);s(this,"speedRank",0);s(this,"shape",0);s(this,"color",0);s(this,"bulletSize",0);s(this,"xReverse",0)}setParam(t,r,i,n,l){this.speedRank=t,this.shape=r,this.color=i,this.bulletSize=n,this.xReverse=l}}const m=class m extends St{constructor(){super();s(this,"bullet");s(this,"field");s(this,"ship");s(this,"isSimple",!1);s(this,"isTop",!1);s(this,"isVisible",!0);s(this,"parser",null);s(this,"ppos",new L);s(this,"cnt",0);s(this,"rtCnt",0);s(this,"shouldBeRemoved",!1);s(this,"backToRetro",!1)}static init(){m.nextId=0}static resetTotalBulletsSpeed(){m.totalBulletsSpeed=0}init(t){const r=Array.isArray(t)?t[0]:t;if(!(r instanceof ke))throw new Error("BulletActor.init requires BulletActorInitializer");this.field=r.field,this.ship=r.ship,this.bullet=this.createBullet(m.nextId++),this.ppos=new L,this.exists=!1}createBullet(t){return new Ms(t)}start(t,r,i,n,l){this.exists=!0,this.isTop=!1,this.isVisible=!0,this.ppos.x=this.bullet.pos.x,this.ppos.y=this.bullet.pos.y,this.bullet.setParam(t,r,i,n,l),this.cnt=0,this.rtCnt=0,this.shouldBeRemoved=!1,this.backToRetro=!1}setRunnerBullet(t,r,i,n,l,a,h,d,u,f,g){this.bullet.set(r,i,n,l,a),this.bullet.setRunner(t),this.bullet.isMorph=!1,this.isSimple=!1,this.start(h,d,u,f,g)}setRunnerMorphBullet(t,r,i,n,l,a,h,d,u,f,g,w,v,E,x){this.bullet.set(r,i,n,l,a),this.bullet.setRunner(t),this.bullet.setMorph(w,v,E,x),this.isSimple=!1,this.start(h,d,u,f,g)}setSimpleBullet(t,r,i,n,l,a,h,d,u,f){this.bullet.set(t,r,i,n,l),this.bullet.isMorph=!1,this.isSimple=!0,this.start(a,h,d,u,f)}setInvisible(){this.isVisible=!1}setTop(t){this.parser=t,this.isTop=!0,this.setInvisible()}rewind(){if(this.bullet.remove(),!this.parser)return;const t=this.parser.createRunner();Ct.registFunctions(t),this.bullet.setRunner(t),this.bullet.resetMorph()}remove(){this.shouldBeRemoved=!0}removeForced(){this.isSimple||this.bullet.remove(),this.exists=!1}toRetro(){!this.isVisible||this.backToRetro||(this.backToRetro=!0,this.rtCnt>=m.RETRO_CNT&&(this.rtCnt=m.RETRO_CNT-.1))}checkShipHit(){let t=this.ppos.x-this.bullet.pos.x,r=this.ppos.y-this.bullet.pos.y;const i=t*t+r*r;if(i<=1e-5)return;const n=this.ship.pos.x-this.bullet.pos.x,l=this.ship.pos.y-this.bullet.pos.y,a=t*n+r*l;if(a<0||a>i)return;const h=n*n+l*l-a*a/i;h>=0&&h<=m.SHIP_HIT_WIDTH&&this.ship.destroyed()}move(){if(this.ppos.x=this.bullet.pos.x,this.ppos.y=this.bullet.pos.y,this.isSimple||(this.bullet.move(),this.isTop&&this.bullet.isEnd()&&this.rewind()),this.shouldBeRemoved){this.removeForced();return}let t;if(this.rtCnt<m.RETRO_CNT){if(t=this.bullet.speedRank*(.3+this.rtCnt/m.RETRO_CNT*.7),this.backToRetro){if(this.rtCnt-=t,this.rtCnt<=0){this.removeForced();return}}else this.rtCnt+=t;if(this.ship.cnt<-228/2&&this.isVisible&&this.rtCnt>=m.RETRO_CNT){this.removeForced();return}}else t=this.bullet.speedRank,this.cnt>m.BULLET_DISAPPEAR_CNT&&this.toRetro();this.bullet.pos.x+=(Math.sin(this.bullet.deg)*this.bullet.speed+this.bullet.acc.x)*t*this.bullet.xReverse,this.bullet.pos.y+=(Math.cos(this.bullet.deg)*this.bullet.speed-this.bullet.acc.y)*t,this.isVisible&&(m.totalBulletsSpeed+=this.bullet.speed*t,this.rtCnt>m.RETRO_CNT&&this.checkShipHit(),this.checkFieldHit(this.bullet.pos,m.FIELD_SPACE)&&this.removeForced()),this.cnt++}checkFieldHit(t,r){const i=this.field;return typeof i.checkHit=="function"?i.checkHit(t,r):t.x<-i.size.x+r||t.x>i.size.x-r||t.y<-i.size.y+r||t.y>i.size.y-r}drawRetro(t){const r=1-this.rtCnt/m.RETRO_CNT;S.setRetroParam(r,.4*this.bullet.bulletSize);const i=m.bulletColor[this.clampColor(this.bullet.color)];S.setRetroColor(i[0],i[1],i[2],1);let n=0,l=0,a=0,h=0;const d=m.shapePos[this.clampShape(this.bullet.shape)];for(let u=0;u<d.length;u++){const f=n,g=l,w=d[u][0]*this.bullet.bulletSize;l=d[u][1]*this.bullet.bulletSize,n=w*Math.cos(t)-l*Math.sin(t),l=w*Math.sin(t)+l*Math.cos(t),u>0?S.drawLineRetro(f,g,n,l):(a=n,h=l)}S.drawLineRetro(n,l,a,h)}draw(){if(!this.isVisible)return;let t=0;switch(this.bullet.shape){case 0:case 2:case 5:t=-this.bullet.deg*this.bullet.xReverse;break;case 1:t=this.cnt*.14;break;case 3:t=this.cnt*.23;break;case 4:t=this.cnt*.33;break;case 6:t=this.cnt*.08;break;default:t=-this.bullet.deg*this.bullet.xReverse;break}if(o.glPushMatrix(),o.glTranslatef(this.bullet.pos.x,this.bullet.pos.y,0),this.rtCnt>=m.RETRO_CNT&&m.displayShapes.length>0){const r=this.clampColor(this.bullet.color),i=r*(m.BULLET_SHAPE_NUM+1),[n,l,a]=m.getDisplayColor(r);m.drawDisplayShape(i)||m.drawDisplayListShapeImmediate(0,n,l,a),o.glRotatef(De(t),0,0,1),o.glScalef(this.bullet.bulletSize,this.bullet.bulletSize,1);const d=1+this.clampShape(this.bullet.shape);m.drawDisplayShape(i+d)||m.drawDisplayListShapeImmediate(d,n,l,a)}else this.drawRetro(t);o.glPopMatrix()}clampShape(t){return t<0?0:t>=m.BULLET_SHAPE_NUM?m.BULLET_SHAPE_NUM-1:t}clampColor(t){return t<0?0:t>=m.BULLET_COLOR_NUM?m.BULLET_COLOR_NUM-1:t}static createDisplayLists(){m.deleteDisplayLists();const t=m.BULLET_COLOR_NUM*(m.BULLET_SHAPE_NUM+1),r=[];for(let i=0;i<m.BULLET_COLOR_NUM;i++){const[n,l,a]=m.getDisplayColor(i);for(let h=0;h<m.BULLET_SHAPE_NUM+1;h++)r.push(m.buildDisplayShape(h,n,l,a))}if(r.length!==t){m.deleteDisplayLists();return}m.displayShapes=r}static buildDisplayShape(t,r,i,n){let a=0,h=0;switch(t){case 0:return{parts:[m.createShapePart(o.GL_TRIANGLE_FAN,[-.1,-.1,0,m.SHAPE_POINT_SIZE,-.1,0,m.SHAPE_POINT_SIZE,m.SHAPE_POINT_SIZE,0,-.1,m.SHAPE_POINT_SIZE,0],m.expandFlatColor(4,r,i,n,1))]};case 1:return a=1/2,{parts:[m.createShapePart(o.GL_LINE_LOOP,[-a,-a,0,a,-a,0,0,1,0],m.expandFlatColor(3,r,i,n,1),!0),m.createShapePart(o.GL_TRIANGLE_FAN,[-a,-a,0,a,-a,0,0,1,0],[r,i,n,.55,r,i,n,.55,m.SHAPE_BASE_COLOR_R,m.SHAPE_BASE_COLOR_G,m.SHAPE_BASE_COLOR_B,.55])]};case 2:return a=1/2,{parts:[m.createShapePart(o.GL_LINE_LOOP,[0,-1,0,a,0,0,0,1,0,-a,0,0],m.expandFlatColor(4,r,i,n,1),!0),m.createShapePart(o.GL_TRIANGLE_FAN,[0,-1,0,a,0,0,0,1,0,-a,0,0],[r,i,n,.7,r,i,n,.7,m.SHAPE_BASE_COLOR_R,m.SHAPE_BASE_COLOR_G,m.SHAPE_BASE_COLOR_B,.55,m.SHAPE_BASE_COLOR_R,m.SHAPE_BASE_COLOR_G,m.SHAPE_BASE_COLOR_B,.55])]};case 3:return a=1/4,h=1/3*2,{parts:[m.createShapePart(o.GL_LINE_LOOP,[-a,-h,0,a,-h,0,a,h,0,-a,h,0],m.expandFlatColor(4,r,i,n,1),!0),m.createShapePart(o.GL_TRIANGLE_FAN,[-a,-h,0,a,-h,0,a,h,0,-a,h,0],[r,i,n,.45,r,i,n,.45,m.SHAPE_BASE_COLOR_R,m.SHAPE_BASE_COLOR_G,m.SHAPE_BASE_COLOR_B,.55,m.SHAPE_BASE_COLOR_R,m.SHAPE_BASE_COLOR_G,m.SHAPE_BASE_COLOR_B,.55])]};case 4:return a=1/2,{parts:[m.createShapePart(o.GL_LINE_LOOP,[-a,-a,0,a,-a,0,a,a,0,-a,a,0],m.expandFlatColor(4,r,i,n,1),!0),m.createShapePart(o.GL_TRIANGLE_FAN,[-a,-a,0,a,-a,0,a,a,0,-a,a,0],[r,i,n,.7,r,i,n,.7,m.SHAPE_BASE_COLOR_R,m.SHAPE_BASE_COLOR_G,m.SHAPE_BASE_COLOR_B,.55,m.SHAPE_BASE_COLOR_R,m.SHAPE_BASE_COLOR_G,m.SHAPE_BASE_COLOR_B,.55])]};case 5:return a=1/2,{parts:[m.createShapePart(o.GL_LINE_LOOP,[-a/2,-a,0,a/2,-a,0,a,-a/2,0,a,a/2,0,a/2,a,0,-a/2,a,0,-a,a/2,0,-a,-a/2,0],m.expandFlatColor(8,r,i,n,1),!0),m.createShapePart(o.GL_TRIANGLE_FAN,[-a/2,-a,0,a/2,-a,0,a,-a/2,0,a,a/2,0,a/2,a,0,-a/2,a,0,-a,a/2,0,-a,-a/2,0],[r,i,n,.85,r,i,n,.85,r,i,n,.85,r,i,n,.85,m.SHAPE_BASE_COLOR_R,m.SHAPE_BASE_COLOR_G,m.SHAPE_BASE_COLOR_B,.55,m.SHAPE_BASE_COLOR_R,m.SHAPE_BASE_COLOR_G,m.SHAPE_BASE_COLOR_B,.55,m.SHAPE_BASE_COLOR_R,m.SHAPE_BASE_COLOR_G,m.SHAPE_BASE_COLOR_B,.55,m.SHAPE_BASE_COLOR_R,m.SHAPE_BASE_COLOR_G,m.SHAPE_BASE_COLOR_B,.55])]};case 6:return a=2/3,h=1/5,{parts:[m.createShapePart(o.GL_LINE_STRIP,[-a,-a+h,0,0,a+h,0,a,-a+h,0],m.expandFlatColor(3,r,i,n,1),!0),m.createShapePart(o.GL_TRIANGLE_FAN,[-a,-a+h,0,a,-a+h,0,0,a+h,0],[r,i,n,.55,r,i,n,.55,m.SHAPE_BASE_COLOR_R,m.SHAPE_BASE_COLOR_G,m.SHAPE_BASE_COLOR_B,.55])]};case 7:return a=1/2,{parts:[m.createShapePart(o.GL_LINE_LOOP,[-a,-a,0,0,-a,0,a,0,0,a,a,0,0,a,0,-a,0,0],m.expandFlatColor(6,r,i,n,1),!0),m.createShapePart(o.GL_TRIANGLE_FAN,[-a,-a,0,0,-a,0,a,0,0,a,a,0,0,a,0,-a,0,0],[r,i,n,.85,r,i,n,.85,r,i,n,.85,m.SHAPE_BASE_COLOR_R,m.SHAPE_BASE_COLOR_G,m.SHAPE_BASE_COLOR_B,.55,m.SHAPE_BASE_COLOR_R,m.SHAPE_BASE_COLOR_G,m.SHAPE_BASE_COLOR_B,.55,m.SHAPE_BASE_COLOR_R,m.SHAPE_BASE_COLOR_G,m.SHAPE_BASE_COLOR_B,.55])]};default:return{parts:[]}}}static createShapePart(t,r,i,n=!1){return{mode:t,vertices:r,colors:i,opaque:n,mesh:o.glCreateStaticMesh(t,r,i)}}static expandFlatColor(t,r,i,n,l){const a=[];for(let h=0;h<t;h++)a.push(r,i,n,l);return a}static getDisplayColor(t){let r=m.bulletColor[t][0],i=m.bulletColor[t][1],n=m.bulletColor[t][2];return r+=(1-r)*.5,i+=(1-i)*.5,n+=(1-n)*.5,[r,i,n]}static drawDisplayShape(t){const r=m.displayShapes[t];if(!r)return!1;for(const i of r.parts)i.opaque&&o.glDisable(o.GL_BLEND),i.mesh?o.glDrawStaticMesh(i.mesh):i.vertices.length>0&&o.glDrawArrays(i.mode,i.vertices,i.colors),i.opaque&&o.glEnable(o.GL_BLEND);return!0}static drawDisplayListShapeImmediate(t,r,i,n){let a=0,h=0;switch(t){case 0:o.glBegin(o.GL_TRIANGLE_FAN),o.glVertex3f(-.1,-.1,0),o.glVertex3f(m.SHAPE_POINT_SIZE,-.1,0),o.glVertex3f(m.SHAPE_POINT_SIZE,m.SHAPE_POINT_SIZE,0),o.glVertex3f(-.1,m.SHAPE_POINT_SIZE,0),o.glEnd();break;case 1:a=1/2,o.glDisable(o.GL_BLEND),o.glBegin(o.GL_LINE_LOOP),o.glVertex3f(-a,-a,0),o.glVertex3f(a,-a,0),o.glVertex3f(0,1,0),o.glEnd(),o.glEnable(o.GL_BLEND),o.setColor(r,i,n,.55),o.glBegin(o.GL_TRIANGLE_FAN),o.glVertex3f(-a,-a,0),o.glVertex3f(a,-a,0),o.setColor(m.SHAPE_BASE_COLOR_R,m.SHAPE_BASE_COLOR_G,m.SHAPE_BASE_COLOR_B,.55),o.glVertex3f(0,1,0),o.glEnd();break;case 2:a=1/2,o.glDisable(o.GL_BLEND),o.glBegin(o.GL_LINE_LOOP),o.glVertex3f(0,-1,0),o.glVertex3f(a,0,0),o.glVertex3f(0,1,0),o.glVertex3f(-a,0,0),o.glEnd(),o.glEnable(o.GL_BLEND),o.setColor(r,i,n,.7),o.glBegin(o.GL_TRIANGLE_FAN),o.glVertex3f(0,-1,0),o.glVertex3f(a,0,0),o.setColor(m.SHAPE_BASE_COLOR_R,m.SHAPE_BASE_COLOR_G,m.SHAPE_BASE_COLOR_B,.55),o.glVertex3f(0,1,0),o.glVertex3f(-a,0,0),o.glEnd();break;case 3:a=1/4,h=1/3*2,o.glDisable(o.GL_BLEND),o.glBegin(o.GL_LINE_LOOP),o.glVertex3f(-a,-h,0),o.glVertex3f(a,-h,0),o.glVertex3f(a,h,0),o.glVertex3f(-a,h,0),o.glEnd(),o.glEnable(o.GL_BLEND),o.setColor(r,i,n,.45),o.glBegin(o.GL_TRIANGLE_FAN),o.glVertex3f(-a,-h,0),o.glVertex3f(a,-h,0),o.setColor(m.SHAPE_BASE_COLOR_R,m.SHAPE_BASE_COLOR_G,m.SHAPE_BASE_COLOR_B,.55),o.glVertex3f(a,h,0),o.glVertex3f(-a,h,0),o.glEnd();break;case 4:a=1/2,o.glDisable(o.GL_BLEND),o.glBegin(o.GL_LINE_LOOP),o.glVertex3f(-a,-a,0),o.glVertex3f(a,-a,0),o.glVertex3f(a,a,0),o.glVertex3f(-a,a,0),o.glEnd(),o.glEnable(o.GL_BLEND),o.setColor(r,i,n,.7),o.glBegin(o.GL_TRIANGLE_FAN),o.glVertex3f(-a,-a,0),o.glVertex3f(a,-a,0),o.setColor(m.SHAPE_BASE_COLOR_R,m.SHAPE_BASE_COLOR_G,m.SHAPE_BASE_COLOR_B,.55),o.glVertex3f(a,a,0),o.glVertex3f(-a,a,0),o.glEnd();break;case 5:a=1/2,o.glDisable(o.GL_BLEND),o.glBegin(o.GL_LINE_LOOP),o.glVertex3f(-a/2,-a,0),o.glVertex3f(a/2,-a,0),o.glVertex3f(a,-a/2,0),o.glVertex3f(a,a/2,0),o.glVertex3f(a/2,a,0),o.glVertex3f(-a/2,a,0),o.glVertex3f(-a,a/2,0),o.glVertex3f(-a,-a/2,0),o.glEnd(),o.glEnable(o.GL_BLEND),o.setColor(r,i,n,.85),o.glBegin(o.GL_TRIANGLE_FAN),o.glVertex3f(-a/2,-a,0),o.glVertex3f(a/2,-a,0),o.glVertex3f(a,-a/2,0),o.glVertex3f(a,a/2,0),o.setColor(m.SHAPE_BASE_COLOR_R,m.SHAPE_BASE_COLOR_G,m.SHAPE_BASE_COLOR_B,.55),o.glVertex3f(a/2,a,0),o.glVertex3f(-a/2,a,0),o.glVertex3f(-a,a/2,0),o.glVertex3f(-a,-a/2,0),o.glEnd();break;case 6:a=2/3,h=1/5,o.glDisable(o.GL_BLEND),o.glBegin(o.GL_LINE_STRIP),o.glVertex3f(-a,-a+h,0),o.glVertex3f(0,a+h,0),o.glVertex3f(a,-a+h,0),o.glEnd(),o.glEnable(o.GL_BLEND),o.setColor(r,i,n,.55),o.glBegin(o.GL_TRIANGLE_FAN),o.glVertex3f(-a,-a+h,0),o.glVertex3f(a,-a+h,0),o.setColor(m.SHAPE_BASE_COLOR_R,m.SHAPE_BASE_COLOR_G,m.SHAPE_BASE_COLOR_B,.55),o.glVertex3f(0,a+h,0),o.glEnd();break;case 7:a=1/2,o.glDisable(o.GL_BLEND),o.glBegin(o.GL_LINE_LOOP),o.glVertex3f(-a,-a,0),o.glVertex3f(0,-a,0),o.glVertex3f(a,0,0),o.glVertex3f(a,a,0),o.glVertex3f(0,a,0),o.glVertex3f(-a,0,0),o.glEnd(),o.glEnable(o.GL_BLEND),o.setColor(r,i,n,.85),o.glBegin(o.GL_TRIANGLE_FAN),o.glVertex3f(-a,-a,0),o.glVertex3f(0,-a,0),o.glVertex3f(a,0,0),o.setColor(m.SHAPE_BASE_COLOR_R,m.SHAPE_BASE_COLOR_G,m.SHAPE_BASE_COLOR_B,.55),o.glVertex3f(a,a,0),o.glVertex3f(0,a,0),o.glVertex3f(-a,0,0),o.glEnd();break}}static deleteDisplayLists(){for(const t of m.displayShapes)for(const r of t.parts)r.mesh&&o.glDeleteStaticMesh(r.mesh);m.displayShapes=[]}};s(m,"totalBulletsSpeed",0),s(m,"BULLET_SHAPE_NUM",7),s(m,"BULLET_COLOR_NUM",4),s(m,"FIELD_SPACE",.5),s(m,"BULLET_DISAPPEAR_CNT",180),s(m,"nextId",0),s(m,"displayShapes",[]),s(m,"SHIP_HIT_WIDTH",.2),s(m,"RETRO_CNT",24),s(m,"SHAPE_POINT_SIZE",.1),s(m,"SHAPE_BASE_COLOR_R",1),s(m,"SHAPE_BASE_COLOR_G",.9),s(m,"SHAPE_BASE_COLOR_B",.7),s(m,"bulletColor",[[1,0,0],[.2,1,.4],[.3,.3,1],[1,1,0]]),s(m,"shapePos",[[[-.5,-.5],[.5,-.5],[0,1]],[[0,-1],[.5,0],[0,1],[-.5,0]],[[-.25,-.66],[.25,-.66],[.25,.66],[-.25,.66]],[[-.5,-.5],[.5,-.5],[.5,.5],[-.5,.5]],[[-.25,-.5],[.25,-.5],[.5,-.25],[.5,.25],[.25,.5],[-.25,.5],[-.5,.25],[-.5,-.25]],[[-.66,-.46],[0,.86],[.66,-.46]],[[-.5,-.5],[0,-.5],[.5,0],[.5,.5],[0,.5],[-.5,0]]]);let ct=m;class ke{constructor(e,t){this.field=e,this.ship=t}}function st(c){return c<0?Math.ceil(c):Math.floor(c)}class _e{constructor(){s(this,"parser",null);s(this,"morphParser");s(this,"morphNum",0);s(this,"morphCnt",0);s(this,"rank",0);s(this,"speedRank",0);s(this,"morphRank",0);s(this,"shape",0);s(this,"color",0);s(this,"bulletSize",0);s(this,"xReverse",1);this.morphParser=Array.from({length:Qt.MORPH_MAX},()=>null)}}const gt=class gt{constructor(){s(this,"wingShapePos");s(this,"collisionPos");s(this,"collisionSize");s(this,"batteryPos");s(this,"batteryNum",0);s(this,"r",0);s(this,"g",0);s(this,"b",0);s(this,"barrage");s(this,"xReverseAlternate",!1);s(this,"shield",0);this.barrage=Array.from({length:gt.BARRAGE_PATTERN_MAX},()=>new _e),this.wingShapePos=Array.from({length:gt.WING_SHAPE_POINT_NUM},()=>new L),this.collisionPos=new L,this.collisionSize=new L,this.batteryPos=Array.from({length:gt.WING_BATTERY_MAX},()=>new L)}};s(gt,"WING_SHAPE_POINT_NUM",3),s(gt,"WING_BATTERY_MAX",3),s(gt,"BARRAGE_PATTERN_MAX",8);let Xt=gt;const b=class b{constructor(){s(this,"barrage");s(this,"bodyShapePos");s(this,"collisionSize");s(this,"wingCollision",!1);s(this,"r",0);s(this,"g",0);s(this,"b",0);s(this,"retroSize",0);s(this,"batteryType");s(this,"batteryNum",0);s(this,"shield",0);s(this,"fireInterval",0);s(this,"firePeriod",0);s(this,"barragePatternNum",0);s(this,"id");s(this,"type",b.SMALL);s(this,"er",1);s(this,"eg",1);s(this,"eb",1);s(this,"ect",0);if(this.bodyShapePos=Array.from({length:b.BODY_SHAPE_POINT_NUM},()=>new L),this.collisionSize=new L,this.barrage=Array.from({length:b.BARRAGE_PATTERN_MAX},()=>new _e),this.batteryType=Array.from({length:b.BATTERY_MAX},()=>new Xt),b.idCnt>=b.ENEMY_TYPE_MAX)throw new Error("EnemyType id overflow");this.id=b.idCnt,b.idCnt++}static init(e){b.rand=new it,b.barrageManager=e,b.idCnt=0,b.usedMorphParser=Array.from({length:e.BARRAGE_MAX},()=>!1)}static clearIsExistList(){for(let e=0;e<b.idCnt;e++)b.isExist[e]=!1}static requireRand(){if(!b.rand)throw new Error("EnemyType.init() must be called before creating enemy types.");return b.rand}static requireBarrageManager(){if(!b.barrageManager)throw new Error("EnemyType.init() must be called before creating enemy types.");return b.barrageManager}getParser(e,t){var n;const i=((n=b.requireBarrageManager().parser[e])==null?void 0:n[t])??null;if(!i)throw new Error(`Missing barrage parser type=${e} idx=${t}`);return i}setBarrageType(e,t,r){const i=b.requireRand(),n=b.requireBarrageManager();e.parser=this.getParser(t,i.nextInt(n.parserNum[t])),b.usedMorphParser.fill(!1);const l=r===b.ROLL?n.parserNum[F.MORPH]:n.parserNum[F.MORPH_LOCK];for(let a=0;a<e.morphParser.length;a++){let h=i.nextInt(l);for(let d=0;d<l&&b.usedMorphParser[h];d++)h++,h>=l&&(h=0);e.morphParser[a]=r===b.ROLL?this.getParser(F.MORPH,h):this.getParser(F.MORPH_LOCK,h),b.usedMorphParser[h]=!0}e.morphNum=e.morphParser.length}setBarrageRank(e,t,r,i){const n=b.requireRand();if(t<=0){e.rank=0;return}for(e.rank=Math.sqrt(t)/(8-n.nextInt(3)),e.rank>.8&&(e.rank=n.nextFloat(.2)+.8),t/=e.rank+2,r===b.WEAK&&(e.rank/=2),i===b.ROLL?e.speedRank=Math.sqrt(t)*(n.nextFloat(.2)+1):e.speedRank=Math.sqrt(t*.66)*(n.nextFloat(.2)+.8),e.speedRank<1&&(e.speedRank=1),e.speedRank>2&&(e.speedRank=Math.sqrt(e.speedRank)+.27),e.morphRank=t/e.speedRank,e.morphCnt=0;e.morphRank>1;)e.morphCnt++,e.morphRank/=3;r===b.VERYWEAK?(e.morphRank/=2,e.morphCnt=st(e.morphCnt/1.7)):r===b.MORPHWEAK?e.morphRank/=2:r===b.WEAK&&(e.morphRank/=1.5)}setBarrageRankSlow(e,t,r,i,n){this.setBarrageRank(e,t,r,i),e.speedRank*=n}setBarrageShape(e,t){const r=b.requireRand();e.shape=r.nextInt(b.BULLET_SHAPE_NUM),e.color=r.nextInt(b.BULLET_COLOR_NUM),e.bulletSize=(1+r.nextSignedFloat(.1))*t}setEnemyColorType(){const e=b.requireRand();this.ect=e.nextInt(3)}createEnemyColor(){const e=b.requireRand();switch(this.ect){case 0:this.er=1,this.eg=e.nextFloat(.7)+.3,this.eb=e.nextFloat(.7)+.3;break;case 1:this.er=e.nextFloat(.7)+.3,this.eg=1,this.eb=e.nextFloat(.7)+.3;break;case 2:this.er=e.nextFloat(.7)+.3,this.eg=e.nextFloat(.7)+.3,this.eb=1;break}}setEnemyShapeAndWings(e){const t=b.requireRand();this.createEnemyColor(),this.r=this.er,this.g=this.eg,this.b=this.eb;const r=b.enemySize[e][0]+t.nextSignedFloat(b.enemySize[e][1]),i=b.enemySize[e][2]+t.nextSignedFloat(b.enemySize[e][3]),n=b.enemySize[e][0]+t.nextSignedFloat(b.enemySize[e][1]),l=b.enemySize[e][2]+t.nextSignedFloat(b.enemySize[e][3]);switch(this.bodyShapePos[0].x=-r,this.bodyShapePos[0].y=i,this.bodyShapePos[1].x=r,this.bodyShapePos[1].y=i,this.bodyShapePos[2].x=n,this.bodyShapePos[2].y=-l,this.bodyShapePos[3].x=-n,this.bodyShapePos[3].y=-l,this.retroSize=b.enemySize[e][4],e){case b.SMALL:case b.MIDDLE:case b.MIDDLEBOSS:this.batteryNum=2;break;case b.LARGE:case b.LARGEBOSS:this.batteryNum=4;break}let a=0,h=0,d=0,u=0,f=0;this.collisionSize.x=r>n?r:n,this.collisionSize.y=i>l?i:l;for(let g=0;g<this.batteryNum;g++){const w=this.batteryType[g];let v=1;if(g%2===0){a=b.enemySize[e][5]+t.nextFloat(b.enemySize[e][6]),this.batteryNum<=2?h=t.nextSignedFloat(b.enemySize[e][7]):g<2?h=t.nextFloat(b.enemySize[e][7]/2)+b.enemySize[e][7]/2:h=-t.nextFloat(b.enemySize[e][7]/2)-b.enemySize[e][7]/2;let B=0;switch(t.nextInt(2)===0?B=t.nextFloat(Math.PI/2)-Math.PI/4:B=t.nextFloat(Math.PI/2)+Math.PI/4*3,d=a/2+Math.sin(B)*(b.enemySize[e][8]/2+t.nextFloat(b.enemySize[e][8]/2)),u=h/2+Math.cos(B)*(b.enemySize[e][8]/2+t.nextFloat(b.enemySize[e][8]/2)),e){case b.SMALL:case b.MIDDLE:case b.LARGE:f=1;break;case b.MIDDLEBOSS:f=150+t.nextInt(30);break;case b.LARGEBOSS:f=200+t.nextInt(50);break}if(this.createEnemyColor(),v=-1,!this.wingCollision){a>this.collisionSize.x&&(this.collisionSize.x=a);let k=Math.abs(h);k>this.collisionSize.y&&(this.collisionSize.y=k),k=Math.abs(u),k>this.collisionSize.y&&(this.collisionSize.y=k)}}w.wingShapePos[0].x=a/4*v,w.wingShapePos[0].y=h/4,w.wingShapePos[1].x=a*v,w.wingShapePos[1].y=h,w.wingShapePos[2].x=d*v,w.wingShapePos[2].y=u,w.collisionPos.x=(a+a/4)/2*v,w.collisionPos.y=(h+u+h/4)/3,w.collisionSize.x=a/4*3/2*1;const E=Math.abs(h-u)/2,x=Math.abs(h-h/4)/2;w.collisionSize.y=E>x?E:x,w.r=this.er,w.g=this.eg,w.b=this.eb,w.shield=f}}setBattery(e,t,r,i,n,l,a,h){const d=b.requireRand(),u=this.batteryType[n],f=this.batteryType[n+1],g=u.barrage[l],w=f.barrage[l];this.setBarrageType(g,r,h),this.setBarrageRankSlow(g,e/t,i,h,a),this.setBarrageShape(g,.8),g.xReverse=d.nextInt(2)*2-1,w.parser=g.parser;for(let k=0;k<Qt.MORPH_MAX;k++)w.morphParser[k]=g.morphParser[k];w.morphNum=g.morphNum,w.morphCnt=g.morphCnt,w.rank=g.rank,w.speedRank=g.speedRank,w.morphRank=g.morphRank,w.shape=g.shape,w.color=g.color,w.bulletSize=g.bulletSize,w.xReverse=-g.xReverse,d.nextInt(4)===0?(u.xReverseAlternate=!0,f.xReverseAlternate=!0):(u.xReverseAlternate=!1,f.xReverseAlternate=!1);let v=u.wingShapePos[1].x,E=u.wingShapePos[1].y;const x=u.wingShapePos[2].x,B=u.wingShapePos[2].y;for(let k=0;k<t;k++)u.batteryPos[k].x=v,u.batteryPos[k].y=E,f.batteryPos[k].x=-v,f.batteryPos[k].y=E,v+=(x-v)/(t-1),E+=(B-E)/(t-1);u.batteryNum=t,f.batteryNum=t}setSmallEnemyType(e,t){const r=b.requireRand();this.type=b.SMALL,this.barragePatternNum=1,this.wingCollision=!1,this.setEnemyColorType();const i=this.barrage[0];t===b.ROLL?this.setBarrageType(i,F.SMALL,t):this.setBarrageType(i,F.SMALL_LOCK,t),this.setBarrageRank(i,e,b.VERYWEAK,t),this.setBarrageShape(i,.7),i.xReverse=r.nextInt(2)*2-1,this.setEnemyShapeAndWings(b.SMALL),this.setBattery(0,0,0,b.NORMAL,0,0,1,t),this.shield=1,this.fireInterval=99999,this.firePeriod=150+r.nextInt(40),e<10&&(this.firePeriod=st(this.firePeriod/(2-e*.1)))}setMiddleEnemyType(e,t){const r=b.requireRand();this.type=b.MIDDLE,this.barragePatternNum=1,this.wingCollision=!1,this.setEnemyColorType();const i=this.barrage[0];this.setBarrageType(i,F.MIDDLE,t);let n=0,l=0;if(t===b.ROLL)switch(r.nextInt(6)){case 0:case 1:n=e/3*2,l=0;break;case 2:n=e/4,l=e/4;break;case 3:case 4:case 5:n=0,l=e/2;break}else switch(r.nextInt(6)){case 0:case 1:n=e/5,l=e/4;break;case 2:case 3:case 4:case 5:n=0,l=e/2;break}this.setBarrageRank(i,n,b.MORPHWEAK,t),this.setBarrageShape(i,.75),i.xReverse=r.nextInt(2)*2-1,this.setEnemyShapeAndWings(b.MIDDLE),t===b.ROLL?(this.shield=40+r.nextInt(10),this.setBattery(l,1,F.MIDDLESUB,b.NORMAL,0,0,1,t),this.fireInterval=100+r.nextInt(60),this.firePeriod=st(this.fireInterval/(1.8+r.nextFloat(.7)))):(this.shield=30+r.nextInt(8),this.setBattery(l,1,F.MIDDLESUB_LOCK,b.NORMAL,0,0,1,t),this.fireInterval=72+r.nextInt(30),this.firePeriod=st(this.fireInterval/(1.2+r.nextFloat(.2)))),e<10&&(this.firePeriod=st(this.firePeriod/(2-e*.1)))}setLargeEnemyType(e,t){const r=b.requireRand();this.type=b.LARGE,this.barragePatternNum=1,this.wingCollision=!1,this.setEnemyColorType();const i=this.barrage[0];this.setBarrageType(i,F.LARGE,t);let n=0,l=0,a=0;if(t===b.ROLL)switch(r.nextInt(9)){case 0:case 1:case 2:case 3:n=e,l=0,a=0;break;case 4:n=e/3*2,l=e/3*2,a=0;break;case 5:n=e/3*2,l=0,a=e/3*2;break;case 6:case 7:case 8:n=0,l=e/3*2,a=e/3*2;break}else switch(r.nextInt(9)){case 0:n=e/4*3,l=0,a=0;break;case 1:case 2:n=e/4*2,l=e/3*2,a=0;break;case 3:case 4:n=e/4*2,l=0,a=e/3*2;break;case 5:case 6:case 7:case 8:n=0,l=e/3*2,a=e/3*2;break}this.setBarrageRank(i,n,b.WEAK,t),this.setBarrageShape(i,.8),i.xReverse=r.nextInt(2)*2-1,this.setEnemyShapeAndWings(b.LARGE),t===b.ROLL?(this.shield=60+r.nextInt(10),this.setBattery(l,1,F.MIDDLESUB,b.NORMAL,0,0,1,t),this.setBattery(a,1,F.MIDDLESUB,b.NORMAL,2,0,1,t),this.fireInterval=150+r.nextInt(60),this.firePeriod=st(this.fireInterval/(1.3+r.nextFloat(.8)))):(this.shield=45+r.nextInt(8),this.setBattery(l,1,F.MIDDLESUB_LOCK,b.NORMAL,0,0,1,t),this.setBattery(a,1,F.MIDDLESUB_LOCK,b.NORMAL,2,0,1,t),this.fireInterval=100+r.nextInt(50),this.firePeriod=st(this.fireInterval/(1.2+r.nextFloat(.2)))),e<10&&(this.firePeriod=st(this.firePeriod/(2-e*.1)))}setMiddleBossEnemyType(e,t){const r=b.requireRand();this.type=b.MIDDLEBOSS,this.barragePatternNum=2+r.nextInt(2),this.wingCollision=!0,this.setEnemyColorType();const i=1+r.nextInt(2);for(let n=0;n<this.barragePatternNum;n++){const l=this.barrage[n];this.setBarrageType(l,F.LARGE,t);let a=0,h=0;switch(r.nextInt(3)){case 0:a=e,h=0;break;case 1:a=e/3,h=e/3;break;case 2:a=0,h=e;break}this.setBarrageRankSlow(l,a,b.NORMAL,t,.9),this.setBarrageShape(l,.9),l.xReverse=r.nextInt(2)*2-1,this.setEnemyShapeAndWings(b.MIDDLEBOSS),this.setBattery(h,i,F.MIDDLE,b.WEAK,0,n,.9,t)}this.shield=300+r.nextInt(50),this.fireInterval=200+r.nextInt(40),this.firePeriod=st(this.fireInterval/(1.2+r.nextFloat(.4))),e<10&&(this.firePeriod=st(this.firePeriod/(2-e*.1)))}setLargeBossEnemyType(e,t){const r=b.requireRand();this.type=b.LARGEBOSS,this.barragePatternNum=2+r.nextInt(3),this.wingCollision=!0,this.setEnemyColorType();const i=1+r.nextInt(3),n=1+r.nextInt(3);for(let l=0;l<this.barragePatternNum;l++){const a=this.barrage[l];this.setBarrageType(a,F.LARGE,t);let h=0,d=0,u=0;switch(r.nextInt(3)){case 0:h=e,d=0,u=0;break;case 1:h=e/3,d=e/3,u=0;break;case 2:h=e/3,d=0,u=e/3;break}this.setBarrageRankSlow(a,h,b.NORMAL,t,.9),this.setBarrageShape(a,1),a.xReverse=r.nextInt(2)*2-1,this.setEnemyShapeAndWings(b.LARGEBOSS),this.setBattery(d,i,F.MIDDLE,b.NORMAL,0,l,.9,t),this.setBattery(u,n,F.MIDDLE,b.NORMAL,2,l,.9,t)}this.shield=400+r.nextInt(50),this.fireInterval=220+r.nextInt(60),this.firePeriod=st(this.fireInterval/(1.2+r.nextFloat(.3))),e<10&&(this.firePeriod=st(this.firePeriod/(2-e*.1)))}};s(b,"BARRAGE_PATTERN_MAX",Xt.BARRAGE_PATTERN_MAX),s(b,"BODY_SHAPE_POINT_NUM",4),s(b,"BATTERY_MAX",4),s(b,"ENEMY_TYPE_MAX",32),s(b,"BULLET_SHAPE_NUM",7),s(b,"BULLET_COLOR_NUM",4),s(b,"SMALL",0),s(b,"MIDDLE",1),s(b,"LARGE",2),s(b,"MIDDLEBOSS",3),s(b,"LARGEBOSS",4),s(b,"ROLL",0),s(b,"LOCK",1),s(b,"isExist",Array.from({length:b.ENEMY_TYPE_MAX},()=>!1)),s(b,"rand",null),s(b,"barrageManager",null),s(b,"idCnt",0),s(b,"usedMorphParser",[]),s(b,"NORMAL",0),s(b,"WEAK",1),s(b,"VERYWEAK",2),s(b,"MORPHWEAK",3),s(b,"enemySize",[[.3,.3,.3,.1,.1,1,.4,.6,.9],[.4,.2,.4,.1,.15,2.2,.2,1.6,1],[.6,.3,.5,.1,.2,3,.3,1.4,1.2],[.9,.3,.7,.2,.25,5,.6,3,1.5],[1.2,.2,.9,.1,.3,7,.8,4.5,1.5]]);let X=b;const A=class A extends St{constructor(){super(...arguments);s(this,"state",A.SEARCH);s(this,"pos",Array.from({length:A.LENGTH},()=>new L));s(this,"cnt",0);s(this,"lockMinY",0);s(this,"lockedEnemy");s(this,"lockedPart",-1);s(this,"lockedPos",new L);s(this,"released",!1);s(this,"vel",new L);s(this,"ship");s(this,"field");s(this,"manager")}static init(){A.rand=new it}init(t){const r=Array.isArray(t)?t[0]:t;if(!(r instanceof Fe))throw new Error("Lock.init requires LockInitializer");this.ship=r.ship,this.field=r.field,this.manager=r.manager,this.pos=Array.from({length:A.LENGTH},()=>new L),this.vel=new L,this.lockedPos=new L}reset(){for(let t=0;t<A.LENGTH;t++)this.pos[t].x=this.ship.pos.x,this.pos[t].y=this.ship.pos.y;this.vel.x=A.rand.nextSignedFloat(1.5),this.vel.y=-2,this.cnt=0}set(){this.reset(),this.state=A.SEARCH,this.lockMinY=this.field.size.y*2,this.released=!1,this.exists=!0}hit(){this.state=A.HIT,this.cnt=0}move(){var t,r;if(this.state===A.SEARCH){this.exists=!1;return}else this.state===A.SEARCHED&&(this.state=A.LOCKING,P.playSe(P.LOCK));switch(this.state!==A.HIT&&this.state!==A.CANCELED&&(this.lockedPart<0?(this.lockedPos.x=this.lockedEnemy.pos.x,this.lockedPos.y=this.lockedEnemy.pos.y):(this.lockedPos.x=this.lockedEnemy.pos.x+this.lockedEnemy.type.batteryType[this.lockedPart].collisionPos.x,this.lockedPos.y=this.lockedEnemy.pos.y+this.lockedEnemy.type.batteryType[this.lockedPart].collisionPos.y)),this.state){case A.LOCKING:this.cnt>=A.LOCK_CNT&&(this.state=A.LOCKED,P.playSe(P.LASER),this.cnt=0);break;case A.LOCKED:this.cnt>=A.NO_COLLISION_CNT&&(this.state=A.FIRED);case A.FIRED:case A.CANCELED:this.state!==A.CANCELED?(!this.lockedEnemy.exists||this.lockedEnemy.shield<=0||this.lockedPart>=0&&this.lockedEnemy.battery[this.lockedPart].shield<=0?this.state=A.CANCELED:(this.vel.x+=(this.lockedPos.x-this.pos[0].x)*A.SPEED,this.vel.y+=(this.lockedPos.y-this.pos[0].y)*A.SPEED),this.vel.x*=.9,this.vel.y*=.9,this.pos[0].x+=(this.lockedPos.x-this.pos[0].x)*.002*this.cnt,this.pos[0].y+=(this.lockedPos.y-this.pos[0].y)*.002*this.cnt):this.vel.y+=(this.field.size.y*2-this.pos[0].y)*A.SPEED;for(let i=A.LENGTH-1;i>0;i--)this.pos[i].x=this.pos[i-1].x,this.pos[i].y=this.pos[i-1].y;if(this.pos[0].x+=this.vel.x,this.pos[0].y+=this.vel.y,this.pos[0].y>this.field.size.y+5){if(this.state===A.CANCELED){this.exists=!1;return}this.state=A.LOCKED,P.playSe(P.LASER),this.reset()}{const i=Math.atan2(this.pos[1].x-this.pos[0].x,this.pos[1].y-this.pos[0].y);(r=(t=this.manager).addParticle)==null||r.call(t,this.pos[0],i,0,A.SPEED*32)}break;case A.HIT:for(let i=1;i<A.LENGTH;i++)this.pos[i].x=this.pos[i-1].x,this.pos[i].y=this.pos[i-1].y;if(this.cnt>5)if(!this.released)this.state=A.LOCKED,P.playSe(P.LASER),this.reset();else{this.exists=!1;return}break}this.cnt++}draw(){switch(this.state){case A.LOCKING:{const t=this.lockedPos.y-(A.LOCK_CNT-this.cnt)*.5;let r=(A.LOCK_CNT-this.cnt)*.1;const i=(A.LOCK_CNT-this.cnt)*.5+.8;S.setRetroParam((A.LOCK_CNT-this.cnt)/A.LOCK_CNT,.2);for(let n=0;n<3;n++,r+=Math.PI*2/3)S.drawBoxRetro(this.lockedPos.x+Math.sin(r)*i,t+Math.cos(r)*i,.2,1,r+Math.PI/2);break}case A.LOCKED:case A.FIRED:case A.CANCELED:case A.HIT:{let t=0,r=.8;S.setRetroParam(0,.2);for(let i=0;i<3;i++,t+=Math.PI*2/3)S.drawBoxRetro(this.lockedPos.x+Math.sin(t)*r,this.lockedPos.y+Math.cos(t)*r,.2,1,t+Math.PI/2);r=this.cnt*.1;for(let i=0;i<A.LENGTH-1;i++,r-=.1){let n=r;n<0?n=0:n>1&&(n=1),S.setRetroParam(n,.33),S.drawLineRetro(this.pos[i].x,this.pos[i].y,this.pos[i+1].x,this.pos[i+1].y)}break}}}};s(A,"SEARCH",0),s(A,"SEARCHED",1),s(A,"LOCKING",2),s(A,"LOCKED",3),s(A,"FIRED",4),s(A,"HIT",5),s(A,"CANCELED",6),s(A,"LENGTH",12),s(A,"NO_COLLISION_CNT",8),s(A,"SPEED",.01),s(A,"LOCK_CNT",8),s(A,"rand",new it);let Ot=A;class Fe{constructor(e,t,r){s(this,"ship");s(this,"field");s(this,"manager");this.ship=e,this.field=t,this.manager=r}}const G=class G extends St{constructor(){super(...arguments);s(this,"released",!1);s(this,"pos",Array.from({length:G.LENGTH},()=>new L));s(this,"cnt",0);s(this,"vel",Array.from({length:G.LENGTH},()=>new L));s(this,"ship");s(this,"field");s(this,"manager");s(this,"dist",0)}init(t){const r=Array.isArray(t)?t[0]:t;if(!(r instanceof Ge))throw new Error("Roll.init requires RollInitializer");this.ship=r.ship,this.field=r.field,this.manager=r.manager,this.pos=Array.from({length:G.LENGTH},()=>new L),this.vel=Array.from({length:G.LENGTH},()=>new L)}set(){for(let t=0;t<G.LENGTH;t++)this.pos[t].x=this.ship.pos.x,this.pos[t].y=this.ship.pos.y,this.vel[t].x=0,this.vel[t].y=0;this.cnt=0,this.dist=0,this.released=!1,this.exists=!0}move(){var t,r;if(this.released){if(this.pos[0].y+=G.SPEED,this.pos[0].y>this.field.size.y){this.exists=!1;return}(r=(t=this.manager).addParticle)==null||r.call(t,this.pos[0],Math.PI,G.BASE_SIZE*G.LENGTH,G.SPEED/8)}else this.dist<G.BASE_DIST&&(this.dist+=G.BASE_DIST/90),this.pos[0].x=this.ship.pos.x+Math.sin(this.cnt*.1)*this.dist,this.pos[0].y=this.ship.pos.y+Math.cos(this.cnt*.1)*this.dist;for(let i=1;i<G.LENGTH;i++){this.pos[i].x+=this.vel[i].x,this.pos[i].y+=this.vel[i].y,this.vel[i].x*=G.BASE_RESISTANCE,this.vel[i].y*=G.BASE_RESISTANCE;const n=this.pos[i].dist(this.pos[i-1]);if(n<=G.BASE_LENGTH)continue;const l=(n-G.BASE_LENGTH)*G.BASE_SPRING,a=Math.atan2(this.pos[i-1].x-this.pos[i].x,this.pos[i-1].y-this.pos[i].y);this.vel[i].x+=Math.sin(a)*l,this.vel[i].y+=Math.cos(a)*l}this.cnt++}draw(){this.released?S.setRetroParam(1,.2):S.setRetroParam(.5,.2);for(let t=0;t<G.LENGTH;t++)S.drawBoxRetro(this.pos[t].x,this.pos[t].y,G.BASE_SIZE*(G.LENGTH-t),G.BASE_SIZE*(G.LENGTH-t),this.cnt*.1)}};s(G,"LENGTH",4),s(G,"NO_COLLISION_CNT",45),s(G,"BASE_LENGTH",1),s(G,"BASE_RESISTANCE",.8),s(G,"BASE_SPRING",.2),s(G,"BASE_SIZE",.2),s(G,"BASE_DIST",3),s(G,"SPEED",.75);let Bt=G;class Ge{constructor(e,t,r){this.ship=e,this.field=t,this.manager=r}}const lt=class lt extends St{constructor(){super(...arguments);s(this,"pos",new L);s(this,"field");s(this,"vel",new L);s(this,"deg",0);s(this,"cnt",0)}init(t){const r=Array.isArray(t)?t[0]:t;if(!(r instanceof Ye))throw new Error("Shot.init requires ShotInitializer");this.field=r.field,this.pos=new L,this.vel=new L}set(t,r){this.pos.x=t.x,this.pos.y=t.y,this.deg=r,this.vel.x=Math.sin(this.deg)*lt.SPEED,this.vel.y=Math.cos(this.deg)*lt.SPEED,this.cnt=0,this.exists=!0}move(){this.pos.x+=this.vel.x,this.pos.y+=this.vel.y,this.field.checkHit(this.pos,lt.FIELD_SPACE)&&(this.exists=!1),this.cnt++}draw(){let t;this.cnt>lt.RETRO_CNT?t=1:t=this.cnt/lt.RETRO_CNT,S.setRetroParam(t,.2),S.drawBoxRetro(this.pos.x,this.pos.y,.2,1,this.deg)}};s(lt,"SPEED",1),s(lt,"FIELD_SPACE",1),s(lt,"RETRO_CNT",4);let Dt=lt;class Ye{constructor(e){this.field=e}}class Ps{constructor(e){s(this,"topBullet");s(this,"shield",0);s(this,"damaged",!1);this.topBullet=Array.from({length:e},()=>null)}}const R=class R extends St{constructor(){super();s(this,"pos",new L);s(this,"type");s(this,"battery",[]);s(this,"shield",0);s(this,"field");s(this,"bullets");s(this,"shots");s(this,"rolls");s(this,"locks");s(this,"ship");s(this,"manager");s(this,"cnt",0);s(this,"topBullet",null);s(this,"moveBullet",null);s(this,"movePoint",[]);s(this,"movePointNum",0);s(this,"movePointIdx",0);s(this,"speed",0);s(this,"deg",0);s(this,"onRoute",!1);s(this,"baseDeg",0);s(this,"fireCnt",0);s(this,"barragePatternIdx",0);s(this,"fieldLimitX",0);s(this,"fieldLimitY",0);s(this,"appCnt",0);s(this,"dstCnt",0);s(this,"timeoutCnt",0);s(this,"z",0);s(this,"isBoss",!1);s(this,"vel",new L);s(this,"velCnt",0);s(this,"damaged",!1);s(this,"bossTimer",0);const t=this.getBatteryTypeConst("WING_BATTERY_MAX",3),r=this.getEnemyTypeConst("BATTERY_MAX",4);this.battery=Array.from({length:r},()=>new Ps(t)),this.movePoint=Array.from({length:R.MOVE_POINT_MAX},()=>new L)}init(t){const r=Array.isArray(t)?t[0]:t;if(!(r instanceof Ue))throw new Error("Enemy.init requires EnemyInitializer");this.field=r.field,this.bullets=r.bullets,this.shots=r.shots,this.rolls=r.rolls,this.locks=r.locks,this.ship=r.ship,this.manager=r.manager,this.pos=new L,this.movePoint=Array.from({length:R.MOVE_POINT_MAX},()=>new L),this.vel=new L,this.velCnt=0,this.fieldLimitX=this.field.size.x/4*3,this.fieldLimitY=this.field.size.y/4*3}set(t,r,i,n){this.pos.x=t.x,this.pos.y=t.y,this.type=i;const l=n.createRunner();if(this.registFunctions(l),this.moveBullet=this.bullets.addManagedBullet(l,this.pos.x,this.pos.y,r,0,.5,1,0,0,1,1)??null,!!this.moveBullet){this.cnt=0,this.shield=this.type.shield;for(let a=0;a<this.type.batteryNum;a++)this.battery[a].shield=this.type.batteryType[a].shield;this.fireCnt=0,this.barragePatternIdx=0,this.baseDeg=r,this.appCnt=0,this.dstCnt=0,this.timeoutCnt=0,this.z=0,this.isBoss=!1,this.exists=!0}}setBoss(t,r,i){this.pos.x=t.x,this.pos.y=t.y,this.type=i,this.moveBullet=null;const n=R.rand.nextFloat(this.field.size.x/4)+this.field.size.x/4,l=R.rand.nextFloat(this.field.size.y/9)+this.field.size.y/7,a=this.field.size.y/7*4;this.movePointNum=R.rand.nextInt(3)+2;for(let d=0;d<Math.floor(this.movePointNum/2);d++)this.movePoint[d*2].x=R.rand.nextFloat(n/2)+n/2,this.movePoint[d*2+1].x=-this.movePoint[d*2].x,this.movePoint[d*2].y=this.movePoint[d*2+1].y=R.rand.nextSignedFloat(l)+a;this.movePointNum===3&&(this.movePoint[2].x=0,this.movePoint[2].y=R.rand.nextSignedFloat(l)+a);for(let d=0;d<8;d++){const u=R.rand.nextInt(this.movePointNum);let f=R.rand.nextInt(this.movePointNum);u===f&&(f++,f>=this.movePointNum&&(f=0));const g=this.movePoint[u];this.movePoint[u]=this.movePoint[f],this.movePoint[f]=g}this.speed=.03+R.rand.nextFloat(.02),this.movePointIdx=0,this.deg=Math.PI,this.onRoute=!1,this.cnt=0,this.shield=this.type.shield;for(let d=0;d<this.type.batteryNum;d++)this.battery[d].shield=this.type.batteryType[d].shield;const h=this.getEnemyTypeConst("BATTERY_MAX",4);for(let d=this.type.batteryNum;d<h;d++)this.battery[d].shield=0;this.fireCnt=0,this.barragePatternIdx=0,this.baseDeg=r,this.appCnt=R.APPEARANCE_CNT,this.z=R.APPEARANCE_Z,this.dstCnt=0,this.timeoutCnt=0,this.isBoss=!0,this.bossTimer=0,this.exists=!0}setBullet(t,r,i=1){if(t.rank<=0)return null;const n=t.parser.createRunner();this.registFunctions(n);let l=this.pos.x,a=this.pos.y;return r&&(l+=r.x,a+=r.y),t.morphCnt>0?this.bullets.addTopMorphBullet(t.parser,n,l,a,this.baseDeg,0,t.rank,t.speedRank,t.shape,t.color,t.bulletSize,t.xReverse*i,t.morphParser,t.morphNum,t.morphCnt)??null:this.bullets.addTopBullet(t.parser,n,l,a,this.baseDeg,0,t.rank,t.speedRank,t.shape,t.color,t.bulletSize,t.xReverse*i)??null}setTopBullets(){this.topBullet=this.setBullet(this.type.barrage[this.barragePatternIdx],null);for(let t=0;t<this.type.batteryNum;t++){const r=this.battery[t];if(r.shield<=0)continue;const i=this.type.batteryType[t];let n=1;for(let l=0;l<i.batteryNum;l++)r.topBullet[l]=this.setBullet(i.barrage[this.barragePatternIdx],i.batteryPos[l],n),i.xReverseAlternate&&(n*=-1)}}addBonuses(t,r){var n,l;const i=Math.floor((r*3/(this.cnt/30+1)*at.rate||0)+.9);(l=(n=this.manager).addBonus)==null||l.call(n,this.pos,t,i)}addBonusesByTypeShield(){this.addBonuses(null,this.type.shield)}addWingFragments(t,r,i,n,l){var d,u;const a=this.getBatteryTypeConst("WING_SHAPE_POINT_NUM",3);let h=1;for(let f=0;f<a;f++,h++)h>=a&&(h=0),(u=(d=this.manager).addFragments)==null||u.call(d,r,this.pos.x+t.wingShapePos[f].x,this.pos.y+t.wingShapePos[f].y,this.pos.x+t.wingShapePos[h].x,this.pos.y+t.wingShapePos[h].y,i,n,l)}addFragments(t,r,i,n){var h,d;const l=this.getEnemyTypeConst("BODY_SHAPE_POINT_NUM",4);let a=1;for(let u=0;u<l;u++,a++)a>=l&&(a=0),(d=(h=this.manager).addFragments)==null||d.call(h,t,this.pos.x+this.type.bodyShapePos[u].x,this.pos.y+this.type.bodyShapePos[u].y,this.pos.x+this.type.bodyShapePos[a].x,this.pos.y+this.type.bodyShapePos[a].y,r,i,n);for(let u=0;u<this.type.batteryNum;u++)this.battery[u].shield>0&&this.addWingFragments(this.type.batteryType[u],t,r,i,n)}addDamage(t){var r,i,n,l,a,h,d;if(this.shield-=t,this.shield<=0)if(this.addBonusesByTypeShield(),(i=(r=this.manager).addScore)==null||i.call(r,this.getEnemyTypeScore(this.type.type)),this.isBoss)this.addFragments(15,0,.1,R.rand.nextSignedFloat(1)),P.playSe(P.BOSS_DESTROYED),(l=(n=this.manager).setScreenShake)==null||l.call(n,20,.05),(h=(a=this.manager).clearBullets)==null||h.call(a),this.removeTopBullets(),this.dstCnt=R.DESTROYED_CNT;else{let u=R.rand.nextSignedFloat(1);this.type.type===this.getEnemyTypeConst("SMALL",0)?(u=((d=this.moveBullet)==null?void 0:d.bullet.deg)??0,P.playSe(P.ENEMY_DESTROYED)):P.playSe(P.LARGE_ENEMY_DESTROYED),this.addFragments(this.type.type*4+2,0,.04,u),this.remove()}this.damaged=!0}removeBattery(t,r){var i;for(let n=0;n<r.batteryNum;n++)t.topBullet[n]&&((i=t.topBullet[n])==null||i.remove(),t.topBullet[n]=null);t.damaged=!0}addDamageBattery(t,r){var i,n,l,a;if(this.battery[t].shield-=r,this.battery[t].shield<=0){const h=this.type.batteryType[t].collisionPos;this.addBonuses(h,this.type.batteryType[t].shield),(n=(i=this.manager).addScore)==null||n.call(i,R.ENEMY_WING_SCORE),this.addWingFragments(this.type.batteryType[t],10,0,.1,R.rand.nextSignedFloat(1)),P.playSe(P.LARGE_ENEMY_DESTROYED),(a=(l=this.manager).setScreenShake)==null||a.call(l,10,.03),this.removeBattery(this.battery[t],this.type.batteryType[t]),this.vel.x=-h.x/10,this.vel.y=-h.y/10,this.velCnt=60,this.removeTopBullets(),this.fireCnt=this.velCnt+10}}checkHit(t,r,i){if(Math.abs(t.x-this.pos.x)<this.type.collisionSize.x+r&&Math.abs(t.y-this.pos.y)<this.type.collisionSize.y+i)return R.HIT;if(this.type.wingCollision)for(let n=0;n<this.type.batteryNum;n++){if(this.battery[n].shield<=0)continue;const l=this.type.batteryType[n];if(Math.abs(t.x-this.pos.x-l.collisionPos.x)<l.collisionSize.x+r&&Math.abs(t.y-this.pos.y-l.collisionPos.y)<l.collisionSize.y+i)return n}return R.NOHIT}checkLocked(t,r,i){if(Math.abs(t.x-this.pos.x)<this.type.collisionSize.x+r&&this.pos.y<i.lockMinY&&this.pos.y>t.y)return i.lockMinY=this.pos.y,R.HIT;if(this.type.wingCollision){let n=R.NOHIT;for(let l=0;l<this.type.batteryNum;l++){if(this.battery[l].shield<=0)continue;const a=this.type.batteryType[l],h=this.pos.y+a.collisionPos.y;Math.abs(t.x-this.pos.x-a.collisionPos.x)<a.collisionSize.x+r&&h<i.lockMinY&&h>t.y&&(i.lockMinY=h,n=l)}if(n!==R.NOHIT)return n}return R.NOHIT}checkDamage(){var r,i,n,l,a,h,d,u,f,g;const t=this.getShotSpeed();for(let w=0;w<this.shots.actor.length;w++){const v=this.shots.actor[w];if(!v.exists)continue;const E=v,x=this.checkHit(E.pos,.7,0);x>=R.HIT&&((i=(r=this.manager).addParticle)==null||i.call(r,E.pos,R.rand.nextSignedFloat(.3),0,t/4),(l=(n=this.manager).addParticle)==null||l.call(n,E.pos,R.rand.nextSignedFloat(.3),0,t/4),(h=(a=this.manager).addParticle)==null||h.call(a,E.pos,Math.PI+R.rand.nextSignedFloat(.3),0,t/7),v.exists=!1,x===R.HIT?this.addDamage(R.SHOT_DAMAGE):this.addDamageBattery(x,R.SHOT_DAMAGE))}if(this.manager.mode===this.getManagerModeRoll())for(let w=0;w<this.rolls.actor.length;w++){const v=this.rolls.actor[w];if(!v.exists)continue;const E=v,x=this.checkHit(E.pos[0],1,1);if(x>=R.HIT){for(let k=0;k<4;k++)(u=(d=this.manager).addParticle)==null||u.call(d,E.pos[0],R.rand.nextFloat(Math.PI*2),0,t/10);let B=R.ROLL_DAMAGE;if(E.released)B+=B;else if(E.cnt<this.getRollNoCollisionCnt())continue;x===R.HIT?this.addDamage(B):this.addDamageBattery(x,B)}}else if(this.type.type!==this.getEnemyTypeConst("SMALL",0))for(let w=0;w<this.locks.actor.length;w++){const v=this.locks.actor[w];if(!v.exists)continue;const E=v;if(E.state===this.getLockState("SEARCH",0)||E.state===this.getLockState("SEARCHED",1)){const x=this.checkLocked(E.pos[0],2.5,E);x>=R.HIT&&(E.state=this.getLockState("SEARCHED",1),E.lockedEnemy=this,E.lockedPart=x);return}if(E.state===this.getLockState("FIRED",4)&&E.lockedEnemy===this){const x=this.checkHit(E.pos[0],1.5,1.5);if(x>=R.HIT&&x===E.lockedPart){for(let B=0;B<4;B++)(g=(f=this.manager).addParticle)==null||g.call(f,E.pos[0],R.rand.nextFloat(Math.PI*2),0,t/10);x===R.HIT?this.addDamage(R.LOCK_DAMAGE):this.addDamageBattery(x,R.LOCK_DAMAGE),E.hit()}}}}removeTopBullets(){var t;this.topBullet&&(this.topBullet.remove(),this.topBullet=null);for(let r=0;r<this.type.batteryNum;r++){const i=this.type.batteryType[r],n=this.battery[r];for(let l=0;l<i.batteryNum;l++)n.topBullet[l]&&((t=n.topBullet[l])==null||t.remove(),n.topBullet[l]=null)}}remove(){this.removeTopBullets(),this.moveBullet&&this.moveBullet.remove(),this.exists=!1}gotoNextPoint(){this.onRoute=!1,this.movePointIdx++,this.movePointIdx>=this.movePointNum&&(this.movePointIdx=0)}moveBoss(){const t=this.movePoint[this.movePointIdx],r=Math.atan2(t.x-this.pos.x,t.y-this.pos.y);let i=r-this.deg;i>Math.PI?i-=Math.PI*2:i<-Math.PI&&(i+=Math.PI*2);const n=Math.abs(i);n<R.BOSS_MOVE_DEG?this.deg=r:i>0?(this.deg+=R.BOSS_MOVE_DEG,this.deg>=Math.PI*2&&(this.deg-=Math.PI*2)):(this.deg-=R.BOSS_MOVE_DEG,this.deg<0&&(this.deg+=Math.PI*2)),this.pos.x+=Math.sin(this.deg)*this.speed,this.pos.y+=Math.cos(this.deg)*this.speed,this.velCnt>0&&(this.velCnt--,this.pos.x+=this.vel.x,this.pos.y+=this.vel.y,this.vel.x*=.92,this.vel.y*=.92),this.onRoute?n>Math.PI/2&&this.gotoNextPoint():n<Math.PI/2&&(this.onRoute=!0),this.pos.x>this.fieldLimitX?(this.pos.x=this.fieldLimitX,this.gotoNextPoint()):this.pos.x<-this.fieldLimitX&&(this.pos.x=-this.fieldLimitX,this.gotoNextPoint()),this.pos.y>this.fieldLimitY?(this.pos.y=this.fieldLimitY,this.gotoNextPoint()):this.pos.y<this.fieldLimitY/4&&(this.pos.y=this.fieldLimitY/4,this.gotoNextPoint())}controlFireCnt(){this.fireCnt<=0?(this.setTopBullets(),this.fireCnt=this.type.fireInterval,this.barragePatternIdx++,this.barragePatternIdx>=this.type.barragePatternNum&&(this.barragePatternIdx=0)):this.fireCnt<this.type.fireInterval-this.type.firePeriod&&this.removeTopBullets(),this.fireCnt--}move(){var t,r,i,n,l,a,h,d;if(this.setEnemyTypeExist(this.type.id,!0),this.isBoss)this.moveBoss();else{if(!this.moveBullet){this.remove();return}this.pos.x=this.moveBullet.bullet.pos.x,this.pos.y=this.moveBullet.bullet.pos.y}this.topBullet&&(this.topBullet.bullet.pos.x=this.pos.x,this.topBullet.bullet.pos.y=this.pos.y),this.damaged=!1;for(let u=0;u<this.type.batteryNum;u++){const f=this.type.batteryType[u],g=this.battery[u];g.damaged=!1;for(let w=0;w<f.batteryNum;w++)g.topBullet[w]&&(g.topBullet[w].bullet.pos.x=this.pos.x+f.batteryPos[w].x,g.topBullet[w].bullet.pos.y=this.pos.y+f.batteryPos[w].y)}if(this.isBoss){let u=1;if(this.appCnt>0)this.z<0&&(this.z-=R.APPEARANCE_Z/60),this.appCnt--,u=1-this.appCnt/R.APPEARANCE_CNT;else if(this.dstCnt>0){if(this.addFragments(1,this.z,.05,R.rand.nextSignedFloat(Math.PI)),(r=(t=this.manager).clearBullets)==null||r.call(t),this.z+=R.DESTROYED_Z/60,this.dstCnt--,this.dstCnt<=0){this.addFragments(25,this.z,.4,R.rand.nextSignedFloat(Math.PI)),P.playSe(P.BOSS_DESTROYED),(n=(i=this.manager).setScreenShake)==null||n.call(i,60,.01),this.remove(),(a=(l=this.manager).setBossShieldMeter)==null||a.call(l,0,0,0,0,0,0);return}u=this.dstCnt/R.DESTROYED_CNT}else if(this.timeoutCnt>0){if(this.z+=R.DESTROYED_Z/60,this.timeoutCnt--,this.timeoutCnt<=0){this.remove();return}u=0}else this.controlFireCnt(),u=1,this.bossTimer++,this.bossTimer>R.BOSS_TIMEOUT&&(this.timeoutCnt=R.TIMEOUT_CNT,this.shield=0,this.removeTopBullets());(d=(h=this.manager).setBossShieldMeter)==null||d.call(h,this.shield,this.battery[0].shield,this.battery[1].shield,this.battery[2].shield,this.battery[3].shield,u)}else{if(this.checkFieldHit(this.pos)){this.remove();return}this.pos.y<-this.field.size.y/4?this.removeTopBullets():this.controlFireCnt()}this.cnt++,this.appCnt<=0&&this.dstCnt<=0&&this.timeoutCnt<=0&&this.checkDamage()}draw(){let t=1;this.appCnt>0?(S.setRetroZ(this.z),t=this.appCnt/R.APPEARANCE_CNT,S.setRetroParam(1,this.type.retroSize*(1+t*10)),S.setRetroColor(this.type.r,this.type.g,this.type.b,1-t)):this.dstCnt>0?(S.setRetroZ(this.z),t=this.dstCnt/R.DESTROYED_CNT/2+.5,S.setRetroColor(this.type.r,this.type.g,this.type.b,t)):this.timeoutCnt>0?(S.setRetroZ(this.z),t=this.timeoutCnt/R.TIMEOUT_CNT,S.setRetroColor(this.type.r,this.type.g,this.type.b,t)):(S.setRetroParam(1,this.type.retroSize),this.damaged?S.setRetroColor(1,1,this.type.b,1):S.setRetroColor(this.type.r,this.type.g,this.type.b,1));const r=this.getEnemyTypeConst("BODY_SHAPE_POINT_NUM",4);if(r===4)S.drawLineLoopRetro4(this.pos.x+this.type.bodyShapePos[0].x,this.pos.y+this.type.bodyShapePos[0].y,this.pos.x+this.type.bodyShapePos[1].x,this.pos.y+this.type.bodyShapePos[1].y,this.pos.x+this.type.bodyShapePos[2].x,this.pos.y+this.type.bodyShapePos[2].y,this.pos.x+this.type.bodyShapePos[3].x,this.pos.y+this.type.bodyShapePos[3].y);else{let n=1;for(let l=0;l<r;l++,n++)n>=r&&(n=0),S.drawLineRetro(this.pos.x+this.type.bodyShapePos[l].x,this.pos.y+this.type.bodyShapePos[l].y,this.pos.x+this.type.bodyShapePos[n].x,this.pos.y+this.type.bodyShapePos[n].y)}if(this.type.type!==this.getEnemyTypeConst("SMALL",0)){o.glBegin(o.GL_TRIANGLE_FAN),o.setColor(S.retroR,S.retroG,S.retroB,0);for(let n=0;n<r;n++)n===2&&o.setColor(S.retroR,S.retroG,S.retroB,S.retroA),o.glVertex3f(this.pos.x+this.type.bodyShapePos[n].x,this.pos.y+this.type.bodyShapePos[n].y,this.z);o.glEnd()}const i=this.getBatteryTypeConst("WING_SHAPE_POINT_NUM",3);for(let n=0;n<this.type.batteryNum;n++){const l=this.type.batteryType[n];if(this.appCnt>0?S.setRetroColor(l.r,l.g,l.b,1-t):this.dstCnt>0||this.timeoutCnt>0?S.setRetroColor(l.r,l.g,l.b,t):this.battery[n].damaged?S.setRetroColor(1,1,l.b,1):S.setRetroColor(l.r,l.g,l.b,1),this.battery[n].shield<=0)S.drawLineRetro(this.pos.x+l.wingShapePos[0].x,this.pos.y+l.wingShapePos[0].y,this.pos.x+l.wingShapePos[1].x,this.pos.y+l.wingShapePos[1].y);else{if(i===3)S.drawLineLoopRetro3(this.pos.x+l.wingShapePos[0].x,this.pos.y+l.wingShapePos[0].y,this.pos.x+l.wingShapePos[1].x,this.pos.y+l.wingShapePos[1].y,this.pos.x+l.wingShapePos[2].x,this.pos.y+l.wingShapePos[2].y);else{let a=1;for(let h=0;h<i;h++,a++)a>=i&&(a=0),S.drawLineRetro(this.pos.x+l.wingShapePos[h].x,this.pos.y+l.wingShapePos[h].y,this.pos.x+l.wingShapePos[a].x,this.pos.y+l.wingShapePos[a].y)}if(this.type.type!==this.getEnemyTypeConst("SMALL",0)){o.glBegin(o.GL_TRIANGLE_FAN),o.setColor(S.retroR,S.retroG,S.retroB,S.retroA);for(let a=0;a<i;a++)a===2&&o.setColor(S.retroR,S.retroG,S.retroB,0),o.glVertex3f(this.pos.x+l.wingShapePos[a].x,this.pos.y+l.wingShapePos[a].y,this.z);o.glEnd()}}}S.setRetroZ(0)}registFunctions(t){Ct.registFunctions(t)}checkFieldHit(t){return typeof this.field.checkHit=="function"?this.field.checkHit(t):t.x<-this.field.size.x||t.x>this.field.size.x||t.y<-this.field.size.y||t.y>this.field.size.y}getEnemyTypeConst(t,r){const i=X[t];return typeof i=="number"?i:r}getBatteryTypeConst(t,r){var l,a,h;const i=(h=(a=(l=this.type)==null?void 0:l.batteryType)==null?void 0:a[0])==null?void 0:h.constructor,n=i==null?void 0:i[t];return typeof n=="number"?n:r}getManagerModeRoll(){var r;const t=(r=this.manager.constructor)==null?void 0:r.ROLL;return typeof t=="number"?t:0}getRollNoCollisionCnt(){const t=Bt.NO_COLLISION_CNT;return typeof t=="number"?t:45}getShotSpeed(){const t=Dt.SPEED;return typeof t=="number"?t:1}getLockState(t,r){const i=Ot[t];return typeof i=="number"?i:r}setEnemyTypeExist(t,r){const i=X;i.isExist||(i.isExist=[]),i.isExist[t]=r}getEnemyTypeScore(t){return t<0?R.ENEMY_TYPE_SCORE[0]:t>=R.ENEMY_TYPE_SCORE.length?R.ENEMY_TYPE_SCORE[R.ENEMY_TYPE_SCORE.length-1]:R.ENEMY_TYPE_SCORE[t]}};s(R,"FIELD_SPACE",.5),s(R,"MOVE_POINT_MAX",8),s(R,"APPEARANCE_CNT",90),s(R,"APPEARANCE_Z",-15),s(R,"DESTROYED_CNT",90),s(R,"DESTROYED_Z",-10),s(R,"TIMEOUT_CNT",90),s(R,"BOSS_TIMEOUT",1800),s(R,"SHOT_DAMAGE",1),s(R,"ROLL_DAMAGE",1),s(R,"LOCK_DAMAGE",7),s(R,"ENEMY_TYPE_SCORE",[100,500,1e3,5e3,1e4]),s(R,"ENEMY_WING_SCORE",1e3),s(R,"BOSS_MOVE_DEG",.02),s(R,"NOHIT",-2),s(R,"HIT",-1),s(R,"rand",new it);let Rt=R;class Ue{constructor(e,t,r,i,n,l,a){this.field=e,this.bullets=t,this.shots=r,this.rolls=i,this.locks=n,this.ship=l,this.manager=a}}const y=class y{constructor(){s(this,"size",new L);s(this,"eyeZ",20);s(this,"aimZ",10);s(this,"aimSpeed",.1);s(this,"roll",0);s(this,"yaw",0);s(this,"z",10);s(this,"speed",.1);s(this,"yawYBase",0);s(this,"yawZBase",0);s(this,"aimYawYBase",0);s(this,"aimYawZBase",0);s(this,"r",0);s(this,"g",0);s(this,"b",0)}init(){this.size.x=11,this.size.y=16,this.eyeZ=20,this.roll=0,this.yaw=0,this.z=10,this.aimZ=10,this.speed=.1,this.aimSpeed=.1,this.yawYBase=0,this.yawZBase=0,this.aimYawYBase=0,this.aimYawZBase=0,this.r=0,this.g=0,this.b=0}setColor(e){const t=yt,r=t.ROLL,i=t.LOCK;switch(e){case r:this.r=.2,this.g=.2,this.b=.7;break;case i:this.r=.5,this.g=.3,this.b=.6;break}}move(){this.roll+=this.speed,this.roll>=y.RING_ANGLE_INT&&(this.roll-=y.RING_ANGLE_INT),this.yaw+=this.speed,this.z+=(this.aimZ-this.z)*.003,this.speed+=(this.aimSpeed-this.speed)*.004,this.yawYBase+=(this.aimYawYBase-this.yawYBase)*.002,this.yawZBase+=(this.aimYawZBase-this.yawZBase)*.002}setType(e){switch(e){case 0:this.aimYawYBase=30,this.aimYawZBase=0;break;case 1:this.aimYawYBase=0,this.aimYawZBase=20;break;case 2:this.aimYawYBase=50,this.aimYawZBase=10;break;case 3:this.aimYawYBase=10,this.aimYawZBase=30;break}}draw(){y.ensureRingMeshes(this.r,this.g,this.b,.7);let e=-16*y.RING_ANGLE_INT/2+this.roll;for(let t=0;t<y.RING_NUM;t++){for(let r=1;r<8;r++){const i=r/16+.5;o.glPushMatrix(),o.glTranslatef(0,0,this.z),o.glRotatef(e,1,0,0);const n=Math.sin(this.yaw/180*Math.PI);o.glRotatef(n*this.yawYBase,0,1,0),o.glRotatef(n*this.yawZBase,0,0,1),o.glScalef(1,1,i),y.ringMeshes.length>0?y.drawRingMeshes():y.drawRingFallback(this.r,this.g,this.b,.7),o.glPopMatrix()}e+=y.RING_ANGLE_INT}}checkHit(e,t=0){return e.x<-this.size.x+t||e.x>this.size.x-t||e.y<-this.size.y+t||e.y>this.size.y-t}static buildRingElementVertices0(){const e=[];for(let t=0;t<=y.RING_POS_NUM/2-2;t++)e.push(y.ringPos[t].x,y.RING_SIZE,y.ringPos[t].y);for(let t=y.RING_POS_NUM/2-2;t>=0;t--)e.push(y.ringPos[t].x,-.5,y.ringPos[t].y);return e.push(y.ringPos[0].x,y.RING_SIZE,y.ringPos[0].y),e}static buildRingElementVertices1(){const e=[];return e.push(y.ringPos[y.RING_POS_NUM/2-1].x,y.RING_SIZE,y.ringPos[y.RING_POS_NUM/2-1].y),e.push(y.ringPos[y.RING_POS_NUM/2].x,y.RING_SIZE,y.ringPos[y.RING_POS_NUM/2].y),e.push(y.ringPos[y.RING_POS_NUM/2].x,-.5,y.ringPos[y.RING_POS_NUM/2].y),e.push(y.ringPos[y.RING_POS_NUM/2-1].x,-.5,y.ringPos[y.RING_POS_NUM/2-1].y),e.push(y.ringPos[y.RING_POS_NUM/2-1].x,y.RING_SIZE,y.ringPos[y.RING_POS_NUM/2-1].y),e}static buildRingElementVertices2(){const e=[];for(let t=y.RING_POS_NUM/2+1;t<=y.RING_POS_NUM-1;t++)e.push(y.ringPos[t].x,y.RING_SIZE,y.ringPos[t].y);for(let t=y.RING_POS_NUM-1;t>=y.RING_POS_NUM/2+1;t--)e.push(y.ringPos[t].x,-.5,y.ringPos[t].y);return e.push(y.ringPos[y.RING_POS_NUM/2+1].x,y.RING_SIZE,y.ringPos[y.RING_POS_NUM/2+1].y),e}static createColors(e,t,r,i,n){const l=[];for(let a=0;a<e;a++)l.push(t,r,i,n);return l}static ensureRingMeshes(e,t,r,i){if(y.meshColor&&y.meshColor[0]===e&&y.meshColor[1]===t&&y.meshColor[2]===r&&y.meshColor[3]===i)return;y.clearRingMeshes();const n=[y.buildRingElementVertices0(),y.buildRingElementVertices1(),y.buildRingElementVertices2()];for(const l of n){const a=o.glCreateStaticMesh(o.GL_LINE_STRIP,l,y.createColors(l.length/3,e,t,r,i));if(!a){y.clearRingMeshes();return}y.ringMeshes.push(a)}y.meshColor=[e,t,r,i]}static drawRingMeshes(){if(!(y.ringMeshes.length<=0))for(const e of y.ringMeshes)o.glDrawStaticMesh(e)}static drawRingFallback(e,t,r,i){const n=[y.buildRingElementVertices0(),y.buildRingElementVertices1(),y.buildRingElementVertices2()];for(const l of n)o.glDrawArrays(o.GL_LINE_STRIP,l,y.createColors(l.length/3,e,t,r,i))}static clearRingMeshes(){for(const e of y.ringMeshes)o.glDeleteStaticMesh(e);y.ringMeshes=[],y.meshColor=null}static createDisplayLists(){y.deleteDisplayLists();let e=-y.RING_DEG*(y.RING_POS_NUM/2-.5);for(let t=0;t<y.RING_POS_NUM;t++,e+=y.RING_DEG)y.ringPos[t].x=Math.sin(e)*y.RING_RADIUS,y.ringPos[t].y=Math.cos(e)*y.RING_RADIUS;y.clearRingMeshes()}static deleteDisplayLists(){y.clearRingMeshes()}};s(y,"TYPE_NUM",4),s(y,"ringMeshes",[]),s(y,"meshColor",null),s(y,"RING_NUM",16),s(y,"RING_ANGLE_INT",10),s(y,"RING_POS_NUM",16),s(y,"ringPos",Array.from({length:y.RING_POS_NUM},()=>new L)),s(y,"RING_DEG",Math.PI/3/(y.RING_POS_NUM/2+.5)),s(y,"RING_RADIUS",10),s(y,"RING_SIZE",.5);let Lt=y;class ge extends St{}const z=class z extends ge{constructor(){super(...arguments);s(this,"pos",[]);s(this,"vel",[]);s(this,"impact",new L);s(this,"z",0);s(this,"lumAlp",0);s(this,"retro",0);s(this,"cnt",0)}init(t){if(!((Array.isArray(t)?t[0]:t)instanceof He))throw new Error("Fragment.init requires FragmentInitializer");this.pos=Array.from({length:z.POINT_NUM},()=>new L),this.vel=Array.from({length:z.POINT_NUM},()=>new L),this.impact=new L}set(t,r,i,n,l,a,h){const d=z.rand.nextFloat(1),u=z.rand.nextFloat(1);this.pos[0].x=t*d+i*(1-d),this.pos[0].y=r*d+n*(1-d),this.pos[1].x=t*u+i*(1-u),this.pos[1].y=r*u+n*(1-u);for(let f=0;f<z.POINT_NUM;f++)this.vel[f].x=z.rand.nextSignedFloat(1)*a,this.vel[f].y=z.rand.nextSignedFloat(1)*a;this.impact.x=Math.sin(h)*a*4,this.impact.y=Math.cos(h)*a*4,this.z=l,this.cnt=32+z.rand.nextInt(24),this.lumAlp=.8+z.rand.nextFloat(.2),this.retro=1,this.exists=!0}move(){if(this.cnt--,this.cnt<0){this.exists=!1;return}for(let t=0;t<z.POINT_NUM;t++)this.pos[t].opAddAssign(this.vel[t]),this.pos[t].opAddAssign(this.impact),this.vel[t].opMulAssign(.98);this.impact.opMulAssign(.95),this.lumAlp*=.98,this.retro*=.97}draw(){S.setRetroZ(this.z),S.setRetroParam(this.retro,.2),S.drawLineRetro(this.pos[0].x,this.pos[0].y,this.pos[1].x,this.pos[1].y)}drawLuminous(){this.lumAlp<.2||(o.setColor(z.R,z.G,z.B,this.lumAlp),o.glVertex3f(this.pos[0].x,this.pos[0].y,this.z),o.glVertex3f(this.pos[1].x,this.pos[1].y,this.z))}};s(z,"R",1),s(z,"G",.8),s(z,"B",.6),s(z,"POINT_NUM",2),s(z,"rand",new it);let ht=z;class He{}const I=class I{static changeColor(e){I.colorIdx=e*I.LETTER_NUM}static drawLetter(e,t,r,i,n){const l=I.glyphs[e+I.colorIdx];l&&(o.glPushMatrix(),o.glTranslatef(t,r,0),o.glScalef(i,i,i),o.glRotatef(n,0,0,1),I.drawGlyphMesh(l),o.glPopMatrix())}static drawString(e,t,r,i,n){let l=t,a=0;switch(n){case I.TO_RIGHT:a=0;break;case I.TO_DOWN:a=90;break;case I.TO_LEFT:a=180;break;case I.TO_UP:a=270;break}for(let h=0;h<e.length;h++){const d=e[h];if(d!==" "){const u=d.charCodeAt(0);let f;u>=48&&u<=57?f=u-48:u>=65&&u<=90?f=u-65+10:u>=97&&u<=122?f=u-97+10:d==="."?f=36:d==="-"?f=38:d==="+"?f=39:f=37,I.drawLetter(f,l,r,i,a)}switch(n){case I.TO_RIGHT:l+=i*1.7;break;case I.TO_DOWN:r+=i*1.7;break;case I.TO_LEFT:l-=i*1.7;break;case I.TO_UP:r-=i*1.7;break}}}static drawNum(e,t,r,i,n){let l=Math.trunc(e),a=t,h=0;switch(n){case I.TO_RIGHT:h=0;break;case I.TO_DOWN:h=90;break;case I.TO_LEFT:h=180;break;case I.TO_UP:h=270;break}for(;;){switch(I.drawLetter(l%10,a,r,i,h),n){case I.TO_RIGHT:a-=i*1.7;break;case I.TO_DOWN:r-=i*1.7;break;case I.TO_LEFT:a+=i*1.7;break;case I.TO_UP:r+=i*1.7;break}if(l=Math.trunc(l/10),l<=0)break}}static buildGlyphMesh(e,t,r,i){const n=[],l=[],a=[],h=[];for(let f=0;;f++){let g=I.spData[e][f][4]|0;if(g>99990)break;let w=-I.spData[e][f][0];const v=-I.spData[e][f][1];let E=I.spData[e][f][2],x=I.spData[e][f][3];E*=.66,x*=.6,w=-w,g%=180,g<=45||g>135?I.appendBoxGeometry(w,v,E,x,t,r,i,n,l,a,h):I.appendBoxGeometry(w,v,x,E,t,r,i,n,l,a,h)}const d=n.length>0?o.glCreateStaticMesh(o.GL_QUADS,n,l):null,u=a.length>0?o.glCreateStaticMesh(o.GL_LINES,a,h):null;return{solidVertices:n,solidColors:l,lineVertices:a,lineColors:h,solidMesh:d,lineMesh:u}}static appendBoxGeometry(e,t,r,i,n,l,a,h,d,u,f){const g=e-r,w=t-i,v=e+r,E=t+i;h.push(g,w,0,v,w,0,v,E,0,g,E,0);for(let x=0;x<4;x++)d.push(n,l,a,.5);u.push(g,w,0,v,w,0,v,w,0,v,E,0,v,E,0,g,E,0,g,E,0,g,w,0);for(let x=0;x<8;x++)f.push(n,l,a,1)}static drawGlyphMesh(e){if(e.solidMesh&&e.lineMesh){o.glDrawStaticMesh(e.solidMesh),o.glDrawStaticMesh(e.lineMesh);return}e.solidVertices.length>0&&o.glDrawArrays(o.GL_QUADS,e.solidVertices,e.solidColors),e.lineVertices.length>0&&o.glDrawArrays(o.GL_LINES,e.lineVertices,e.lineColors)}static createDisplayLists(){I.deleteDisplayLists();const e=[];for(let t=0;t<I.LETTER_NUM;t++)e.push(I.buildGlyphMesh(t,1,1,1));for(let t=0;t<I.LETTER_NUM;t++)e.push(I.buildGlyphMesh(t,1,.7,.7));I.glyphs=e,I.colorIdx=0}static deleteDisplayLists(){for(const e of I.glyphs)e.solidMesh&&o.glDeleteStaticMesh(e.solidMesh),e.lineMesh&&o.glDeleteStaticMesh(e.lineMesh);I.glyphs=[]}};s(I,"glyphs",[]),s(I,"colorIdx",0),s(I,"WHITE",0),s(I,"RED",1),s(I,"TO_RIGHT",0),s(I,"TO_DOWN",1),s(I,"TO_LEFT",2),s(I,"TO_UP",3),s(I,"LETTER_NUM",42),s(I,"spData",[[[0,1.15,.65,.3,0],[-.6,.55,.65,.3,90],[.6,.55,.65,.3,90],[-.6,-.55,.65,.3,90],[.6,-.55,.65,.3,90],[0,-1.15,.65,.3,0],[0,0,0,0,99999]],[[0,.55,.65,.3,90],[0,-.55,.65,.3,90],[0,0,0,0,99999]],[[0,1.15,.65,.3,0],[.65,.55,.65,.3,90],[0,0,.65,.3,0],[-.65,-.55,.65,.3,90],[0,-1.15,.65,.3,0],[0,0,0,0,99999]],[[0,1.15,.65,.3,0],[.65,.55,.65,.3,90],[0,0,.65,.3,0],[.65,-.55,.65,.3,90],[0,-1.15,.65,.3,0],[0,0,0,0,99999]],[[-.65,.55,.65,.3,90],[.65,.55,.65,.3,90],[0,0,.65,.3,0],[.65,-.55,.65,.3,90],[0,0,0,0,99999]],[[0,1.15,.65,.3,0],[-.65,.55,.65,.3,90],[0,0,.65,.3,0],[.65,-.55,.65,.3,90],[0,-1.15,.65,.3,0],[0,0,0,0,99999]],[[0,1.15,.65,.3,0],[-.65,.55,.65,.3,90],[0,0,.65,.3,0],[-.65,-.55,.65,.3,90],[.65,-.55,.65,.3,90],[0,-1.15,.65,.3,0],[0,0,0,0,99999]],[[0,1.15,.65,.3,0],[.65,.55,.65,.3,90],[.65,-.55,.65,.3,90],[0,0,0,0,99999]],[[0,1.15,.65,.3,0],[-.65,.55,.65,.3,90],[.65,.55,.65,.3,90],[0,0,.65,.3,0],[-.65,-.55,.65,.3,90],[.65,-.55,.65,.3,90],[0,-1.15,.65,.3,0],[0,0,0,0,99999]],[[0,1.15,.65,.3,0],[-.65,.55,.65,.3,90],[.65,.55,.65,.3,90],[0,0,.65,.3,0],[.65,-.55,.65,.3,90],[0,-1.15,.65,.3,0],[0,0,0,0,99999]],[[0,1.15,.65,.3,0],[-.65,.55,.65,.3,90],[.65,.55,.65,.3,90],[0,0,.65,.3,0],[-.65,-.55,.65,.3,90],[.65,-.55,.65,.3,90],[0,0,0,0,99999]],[[-.1,1.15,.45,.3,0],[-.65,.55,.65,.3,90],[.45,.55,.65,.3,90],[-.1,0,.45,.3,0],[-.65,-.55,.65,.3,90],[.65,-.55,.65,.3,90],[0,-1.15,.65,.3,0],[0,0,0,0,99999]],[[0,1.15,.65,.3,0],[-.65,.55,.65,.3,90],[-.65,-.55,.65,.3,90],[0,-1.15,.65,.3,0],[0,0,0,0,99999]],[[-.1,1.15,.45,.3,0],[-.65,.55,.65,.3,90],[.45,.4,.65,.3,90],[-.65,-.55,.65,.3,90],[.65,-.55,.65,.3,90],[0,-1.15,.65,.3,0],[0,0,0,0,99999]],[[0,1.15,.65,.3,0],[-.65,.55,.65,.3,90],[0,0,.65,.3,0],[-.65,-.55,.65,.3,90],[0,-1.15,.65,.3,0],[0,0,0,0,99999]],[[0,1.15,.65,.3,0],[-.65,.55,.65,.3,90],[0,0,.65,.3,0],[-.65,-.55,.65,.3,90],[0,0,0,0,99999]],[[0,1.15,.65,.3,0],[-.65,.55,.65,.3,90],[.25,0,.25,.3,0],[-.65,-.55,.65,.3,90],[.65,-.55,.65,.3,90],[0,-1.15,.65,.3,0],[0,0,0,0,99999]],[[-.65,.55,.65,.3,90],[.65,.55,.65,.3,90],[0,0,.65,.3,0],[-.65,-.55,.65,.3,90],[.65,-.55,.65,.3,90],[0,0,0,0,99999]],[[0,.55,.65,.3,90],[0,-.55,.65,.3,90],[0,0,0,0,99999]],[[-.65,.55,.65,.3,90],[-.65,-.55,.65,.3,90],[.65,-.75,.25,.3,90],[0,-1.15,.65,.3,0],[0,0,0,0,99999]],[[-.65,.55,.65,.3,90],[.45,.55,.65,.3,90],[-.1,0,.45,.3,0],[-.65,-.55,.65,.3,90],[.65,-.55,.65,.3,90],[0,0,0,0,99999]],[[-.65,.55,.65,.3,90],[-.65,-.55,.65,.3,90],[0,-1.15,.65,.3,0],[0,0,0,0,99999]],[[-.3,1.15,.25,.3,0],[.3,1.15,.25,.3,0],[-.65,.55,.65,.3,90],[.65,.55,.65,.3,90],[-.65,-.55,.65,.3,90],[.65,-.55,.65,.3,90],[0,.55,.65,.3,90],[0,-.55,.65,.3,90],[0,0,0,0,99999]],[[0,1.15,.65,.3,0],[-.65,.55,.65,.3,90],[.65,.55,.65,.3,90],[-.65,-.55,.65,.3,90],[.65,-.55,.65,.3,90],[0,0,0,0,99999]],[[0,1.15,.65,.3,0],[-.65,.55,.65,.3,90],[.65,.55,.65,.3,90],[-.65,-.55,.65,.3,90],[.65,-.55,.65,.3,90],[0,-1.15,.65,.3,0],[0,0,0,0,99999]],[[0,1.15,.65,.3,0],[-.65,.55,.65,.3,90],[.65,.55,.65,.3,90],[0,0,.65,.3,0],[-.65,-.55,.65,.3,90],[0,0,0,0,99999]],[[0,1.15,.65,.3,0],[-.65,.55,.65,.3,90],[.65,.55,.65,.3,90],[-.65,-.55,.65,.3,90],[.65,-.55,.65,.3,90],[0,-1.15,.65,.3,0],[.2,-.6,.45,.3,60],[0,0,0,0,99999]],[[0,1.15,.65,.3,0],[-.65,.55,.65,.3,90],[.65,.55,.65,.3,90],[-.1,0,.45,.3,0],[-.65,-.55,.65,.3,90],[.45,-.55,.65,.3,90],[0,0,0,0,99999]],[[0,1.15,.65,.3,0],[-.65,.55,.65,.3,90],[0,0,.65,.3,0],[.65,-.55,.65,.3,90],[0,-1.15,.65,.3,0],[0,0,0,0,99999]],[[-.4,1.15,.45,.3,0],[.4,1.15,.45,.3,0],[0,.55,.65,.3,90],[0,-.55,.65,.3,90],[0,0,0,0,99999]],[[-.65,.55,.65,.3,90],[.65,.55,.65,.3,90],[-.65,-.55,.65,.3,90],[.65,-.55,.65,.3,90],[0,-1.15,.65,.3,0],[0,0,0,0,99999]],[[-.65,.55,.65,.3,90],[.65,.55,.65,.3,90],[-.5,-.55,.65,.3,90],[.5,-.55,.65,.3,90],[0,-1.15,.45,.3,0],[0,0,0,0,99999]],[[-.65,.55,.65,.3,90],[.65,.55,.65,.3,90],[-.65,-.55,.65,.3,90],[.65,-.55,.65,.3,90],[-.3,-1.15,.25,.3,0],[.3,-1.15,.25,.3,0],[0,.55,.65,.3,90],[0,-.55,.65,.3,90],[0,0,0,0,99999]],[[-.4,.6,.85,.3,240],[.4,.6,.85,.3,300],[-.4,-.6,.85,.3,120],[.4,-.6,.85,.3,60],[0,0,0,0,99999]],[[-.4,.6,.85,.3,240],[.4,.6,.85,.3,300],[0,-.55,.65,.3,90],[0,0,0,0,99999]],[[0,1.15,.65,.3,0],[.35,.5,.65,.3,300],[-.35,-.5,.65,.3,120],[0,-1.15,.65,.3,0],[0,0,0,0,99999]],[[0,-1.15,.05,.3,0],[0,0,0,0,99999]],[[0,-1.15,.65,.3,0],[0,0,0,0,99999]],[[0,0,.65,.3,0],[0,0,0,0,99999]],[[-.4,0,.45,.3,0],[.4,0,.45,.3,0],[0,.55,.65,.3,90],[0,-.55,.65,.3,90],[0,0,0,0,99999]],[[0,1,.4,.2,90],[0,0,0,0,99999]],[[-.19,1,.4,.2,90],[.2,1,.4,.2,90],[0,0,0,0,99999]]]);let M=I;class ve extends xt{constructor(e,t,r){super(e,t,r)}drawLuminous(){for(let e=0;e<this.actor.length;e++)this.actor[e].exists&&this.actor[e].drawLuminous()}}function ne(c){return c<0?Math.ceil(c):Math.floor(c)}const N=class N{constructor(){s(this,"parsec",0);s(this,"bossSection",!1);s(this,"gameManager");s(this,"barrageManager");s(this,"field");s(this,"rand");s(this,"SIMULTANEOUS_APPEARNCE_MAX",4);s(this,"appearance",[]);s(this,"SMALL_ENEMY_TYPE_MAX",3);s(this,"smallType",[]);s(this,"MIDDLE_ENEMY_TYPE_MAX",4);s(this,"middleType",[]);s(this,"LARGE_ENEMY_TYPE_MAX",2);s(this,"largeType",[]);s(this,"middleBossType");s(this,"largeBossType");s(this,"apNum",0);s(this,"apos");s(this,"sectionCnt",0);s(this,"sectionIntervalCnt",0);s(this,"section",0);s(this,"rank",0);s(this,"rankInc",0);s(this,"middleRushSectionNum",0);s(this,"middleRushSection",!1);s(this,"stageType",0);s(this,"MIDDLE_RUSH_SECTION_PATTERN",6);s(this,"apparancePattern",[[[1,0,0],[2,0,0],[1,1,0],[1,0,1],[2,1,0],[2,0,1],[0,1,1]],[[1,0,0],[1,1,0],[1,1,0],[1,0,1],[2,1,0],[1,1,1],[0,1,1]]])}init(e,t,r){this.gameManager=e,this.barrageManager=t,this.field=r,this.rand=new it,this.apos=new L,this.smallType=Array.from({length:this.SMALL_ENEMY_TYPE_MAX},()=>new X),this.middleType=Array.from({length:this.MIDDLE_ENEMY_TYPE_MAX},()=>new X),this.largeType=Array.from({length:this.LARGE_ENEMY_TYPE_MAX},()=>new X),this.middleBossType=new X,this.largeBossType=new X,this.appearance=Array.from({length:this.SIMULTANEOUS_APPEARNCE_MAX},()=>({type:this.smallType[0],moveParser:null,point:N.TOP,pattern:N.ALTERNATE,sequence:N.RANDOM,pos:0,num:0,interval:0,groupInterval:0,cnt:0,left:0,side:1}))}close(){}setRank(e,t,r,i){this.rank=e,this.rankInc=t,this.rank+=this.rankInc*ne(r/10),this.section=-1,this.parsec=r-1,this.stageType=i,this.createStage(),this.gotoNextSection()}move(){for(let e=0;e<this.apNum;e++){const t=this.appearance[e];if(t.cnt--,t.cnt>0){this.middleRushSection?t.type.type===X.MIDDLE&&!X.isExist[t.type.id]&&(t.cnt=0,X.isExist[t.type.id]=!0):t.type.type===X.SMALL&&!X.isExist[t.type.id]&&(t.cnt=0,X.isExist[t.type.id]=!0);continue}let r=0;switch(t.sequence){case N.RANDOM:r=this.rand.nextFloat(1);break;case N.FIXED:r=t.pos;break}let i=0;switch(t.point){case N.TOP:switch(t.pattern){case N.BOTH_SIDES:this.apos.x=(r-.5)*this.field.size.x*1.8;break;default:this.apos.x=(r*.6+.2)*this.field.size.x*t.side;break}this.apos.y=this.field.size.y-Rt.FIELD_SPACE,i=Math.PI;break;case N.BACK:switch(t.pattern){case N.BOTH_SIDES:this.apos.x=(r-.5)*this.field.size.x*1.8;break;default:this.apos.x=(r*.6+.2)*this.field.size.x*t.side;break}this.apos.y=-this.field.size.y+Rt.FIELD_SPACE,i=0;break;case N.SIDE:switch(t.pattern){case N.BOTH_SIDES:this.apos.x=(this.field.size.x-Rt.FIELD_SPACE)*(this.rand.nextInt(2)*2-1);break;default:this.apos.x=(this.field.size.x-Rt.FIELD_SPACE)*t.side;break}this.apos.y=(r*.4+.4)*this.field.size.y,this.apos.x<0?i=Math.PI/2:i=Math.PI/2*3;break}this.apos.x*=.88,t.moveParser&&this.gameManager.addEnemy(this.apos,i,t.type,t.moveParser),t.left--,t.left<=0?(t.cnt=t.groupInterval,t.left=t.num,t.pattern!==N.ONE_SIDE&&(t.side*=-1),t.pos=this.rand.nextFloat(1)):t.cnt=t.interval}(!this.bossSection||!X.isExist[this.middleBossType.id]&&!X.isExist[this.largeBossType.id])&&this.sectionCnt--,this.sectionCnt<this.sectionIntervalCnt&&(this.section===9&&this.sectionCnt===this.sectionIntervalCnt-1&&wt.fadeMusic(),this.apNum=0,this.sectionCnt<=0&&this.gotoNextSection()),X.clearIsExistList()}createEnemyData(){for(let e=0;e<this.smallType.length;e++)this.smallType[e].setSmallEnemyType(this.rank,this.gameManager.mode);for(let e=0;e<this.middleType.length;e++)this.middleType[e].setMiddleEnemyType(this.rank,this.gameManager.mode);for(let e=0;e<this.largeType.length;e++)this.largeType[e].setLargeEnemyType(this.rank,this.gameManager.mode);this.middleBossType.setMiddleBossEnemyType(this.rank,this.gameManager.mode),this.largeBossType.setLargeBossEnemyType(this.rank,this.gameManager.mode)}setAppearancePattern(e){switch(this.rand.nextInt(5)){case 0:e.pattern=N.ONE_SIDE;break;case 1:case 2:e.pattern=N.ALTERNATE;break;case 3:case 4:e.pattern=N.BOTH_SIDES;break}switch(this.rand.nextInt(3)){case 0:e.sequence=N.RANDOM;break;case 1:case 2:e.sequence=N.FIXED;break}}getParser(e){const t=this.barrageManager.parserNum[e]??0;return t<=0?null:this.barrageManager.parser[e][this.rand.nextInt(t)]??null}setSmallAppearance(e){e.type=this.smallType[this.rand.nextInt(this.smallType.length)];let t=0;switch(this.rand.nextFloat(1)>.2?(e.point=N.TOP,t=F.SMALLMOVE):(e.point=N.SIDE,t=F.SMALLSIDEMOVE),e.moveParser=this.getParser(t),this.setAppearancePattern(e),e.pattern===N.ONE_SIDE&&(e.pattern=N.ALTERNATE),this.rand.nextInt(4)){case 0:e.num=7+this.rand.nextInt(5),e.groupInterval=72+this.rand.nextInt(15),e.interval=15+this.rand.nextInt(5);break;case 1:e.num=5+this.rand.nextInt(3),e.groupInterval=56+this.rand.nextInt(10),e.interval=20+this.rand.nextInt(5);break;case 2:case 3:e.num=2+this.rand.nextInt(2),e.groupInterval=45+this.rand.nextInt(20),e.interval=25+this.rand.nextInt(5);break}}setMiddleAppearance(e){e.type=this.middleType[this.rand.nextInt(this.middleType.length)];const t=F.MIDDLEMOVE;switch(e.point=N.TOP,e.moveParser=this.getParser(t),this.setAppearancePattern(e),this.rand.nextInt(3)){case 0:e.num=4,e.groupInterval=240+this.rand.nextInt(150),e.interval=80+this.rand.nextInt(30);break;case 1:e.num=2,e.groupInterval=180+this.rand.nextInt(60),e.interval=180+this.rand.nextInt(20);break;case 2:e.num=1,e.groupInterval=150+this.rand.nextInt(50),e.interval=100;break}}setLargeAppearance(e){e.type=this.largeType[this.rand.nextInt(this.largeType.length)];const t=F.LARGEMOVE;switch(e.point=N.TOP,e.moveParser=this.getParser(t),this.setAppearancePattern(e),this.rand.nextInt(3)){case 0:e.num=3,e.groupInterval=400+this.rand.nextInt(100),e.interval=240+this.rand.nextInt(40);break;case 1:e.num=2,e.groupInterval=400+this.rand.nextInt(60),e.interval=300+this.rand.nextInt(20);break;case 2:e.num=1,e.groupInterval=270+this.rand.nextInt(50),e.interval=200;break}}setAppearance(e,t){switch(t){case N.SMALL:this.setSmallAppearance(e);break;case N.MIDDLE:this.setMiddleAppearance(e);break;case N.LARGE:this.setLargeAppearance(e);break}e.cnt=0,e.left=e.num,e.side=this.rand.nextInt(2)*2-1,e.pos=this.rand.nextFloat(1)}createSectionData(){if(this.apNum=0,this.rank<=0)return;if(this.field.aimSpeed=.1+this.section*.02,this.section===4){const l=new L;l.x=0,l.y=this.field.size.y/4*3,this.gameManager.addBoss(l,Math.PI,this.middleBossType),this.bossSection=!0,this.sectionIntervalCnt=this.sectionCnt=120,this.field.aimZ=11;return}if(this.section===9){const l=new L;l.x=0,l.y=this.field.size.y/4*3,this.gameManager.addBoss(l,Math.PI,this.largeBossType),this.bossSection=!0,this.sectionIntervalCnt=this.sectionCnt=180,this.field.aimZ=12;return}this.section===this.middleRushSectionNum?(this.middleRushSection=!0,this.field.aimZ=9):(this.middleRushSection=!1,this.field.aimZ=10+this.rand.nextSignedFloat(.3)),this.bossSection=!1,this.section===3?this.sectionIntervalCnt=120:this.section===3?this.sectionIntervalCnt=240:this.sectionIntervalCnt=60,this.sectionCnt=this.sectionIntervalCnt+600;const e=ne(this.section*3/7)+1,t=3+ne(this.section*3/10);let r=e+this.rand.nextInt(t-e+1);this.section===0?r=0:this.middleRushSection&&(r=this.MIDDLE_RUSH_SECTION_PATTERN);const i=this.apparancePattern[this.gameManager.mode]??this.apparancePattern[0],n=i[r]??i[0];for(let l=0;l<n[0];l++,this.apNum++)this.setAppearance(this.appearance[this.apNum],N.SMALL);for(let l=0;l<n[1];l++,this.apNum++)this.setAppearance(this.appearance[this.apNum],N.MIDDLE);for(let l=0;l<n[2];l++,this.apNum++)this.setAppearance(this.appearance[this.apNum],N.LARGE)}createStage(){this.createEnemyData(),this.middleRushSectionNum=2+this.rand.nextInt(6),this.middleRushSectionNum<=4&&this.middleRushSectionNum++,this.field.setType(this.stageType%Lt.TYPE_NUM),P.playBgm(this.stageType%P.BGM_NUM),this.stageType++}gotoNextSection(){this.section++,this.parsec++;const t=this.gameManager.constructor.TITLE??0;this.gameManager.state===t&&this.section>=4&&(this.section=0,this.parsec-=4),this.section>=10&&(this.section=0,this.rank+=this.rankInc,this.createStage()),this.createSectionData()}};s(N,"TOP",0),s(N,"SIDE",1),s(N,"BACK",2),s(N,"ONE_SIDE",0),s(N,"ALTERNATE",1),s(N,"BOTH_SIDES",2),s(N,"RANDOM",0),s(N,"FIXED",1),s(N,"SMALL",0),s(N,"MIDDLE",1),s(N,"LARGE",2),s(N,"STAGE_TYPE_NUM",4);let ce=N;const Kt=class Kt{constructor(e){s(this,"num",0);s(this,"fileName");s(this,"image",null);s(this,"texture",null);s(this,"loaded",!1);s(this,"failed",!1);s(this,"loadPromise");s(this,"settleLoadPromise",null);s(this,"loadPromiseSettled",!1);if(this.fileName=`${Kt.imagesDir}${e}`,!this.fileName)throw new J(`Unable to load: ${this.fileName}`);this.loadPromise=new Promise(t=>{this.settleLoadPromise=t}),this.loadImage()}deleteTexture(){var e;this.texture&&((e=o.gl)==null||e.deleteTexture(this.texture)),this.texture=null,this.image=null,this.loaded=!1,this.failed=!1,this.num=0}bind(){var e,t;if(this.failed)throw new J(`Unable to load: ${this.fileName}`);this.loaded&&(!this.texture&&this.image&&(this.texture=((e=o.gl)==null?void 0:e.createTextureFromImage(this.image))??null),this.texture&&((t=o.gl)==null||t.bindTexture(this.texture),this.num=1))}get src(){return this.fileName}get isLoaded(){return this.loaded}get isFailed(){return this.failed}getImage(){return this.image}waitForLoad(){return this.loadPromise}loadImage(){if(typeof Image>"u"){this.failed=!0,this.loaded=!1,this.resolveLoadPromise(!1);return}const e=new Image;e.onload=()=>{this.image=e,this.loaded=!0,this.failed=!1,this.num=1,this.resolveLoadPromise(!0)},e.onerror=()=>{this.failed=!0,this.loaded=!1,this.image=null,this.num=0,this.resolveLoadPromise(!1)},e.src=this.fileName}resolveLoadPromise(e){var t;this.loadPromiseSettled||(this.loadPromiseSettled=!0,(t=this.settleLoadPromise)==null||t.call(this,e))}};s(Kt,"imagesDir","images/");let ue=Kt;const V=class V{constructor(){s(this,"hiScore",[]);s(this,"reachedParsec",[]);s(this,"selectedDifficulty",1);s(this,"selectedParsecSlot",0);s(this,"selectedMode",0);this.init()}init(){this.reachedParsec=[],this.hiScore=[];for(let e=0;e<V.MODE_NUM;e++){const t=[],r=[];for(let i=0;i<V.DIFFICULTY_NUM;i++){t.push(0);const n=[];for(let l=0;l<V.REACHED_PARSEC_SLOT_NUM;l++)n.push(0);r.push(n)}this.reachedParsec.push(t),this.hiScore.push(r)}this.selectedDifficulty=1,this.selectedParsecSlot=0,this.selectedMode=0}loadPrevVersionData(e){const t=Le(e);for(let r=0;r<V.DIFFICULTY_NUM;r++){this.reachedParsec[0][r]=Vt(t,["reachedParsec",r]);for(let i=0;i<V.REACHED_PARSEC_SLOT_NUM;i++)this.hiScore[0][r][i]=Vt(t,["hiScore",r,i])}this.selectedDifficulty=Tt(t,"selectedDifficulty"),this.selectedParsecSlot=Tt(t,"selectedParsecSlot")}load(){try{const e=Is(V.PREF_FILE);if(!e)throw new Error("No pref data");const t=JSON.parse(e),r=Le(t),i=Tt(r,"version");if(i===V.PREV_VERSION_NUM){this.init(),this.loadPrevVersionData(r);return}if(i!==V.VERSION_NUM)throw new Error("Wrong version num");for(let n=0;n<V.MODE_NUM;n++)for(let l=0;l<V.DIFFICULTY_NUM;l++){this.reachedParsec[n][l]=Vt(r,["reachedParsec",n,l]);for(let a=0;a<V.REACHED_PARSEC_SLOT_NUM;a++)this.hiScore[n][l][a]=Vt(r,["hiScore",n,l,a])}this.selectedDifficulty=Tt(r,"selectedDifficulty"),this.selectedParsecSlot=Tt(r,"selectedParsecSlot"),this.selectedMode=Tt(r,"selectedMode")}catch{this.init()}}save(){const e={version:V.VERSION_NUM,reachedParsec:this.reachedParsec,hiScore:this.hiScore,selectedDifficulty:this.selectedDifficulty,selectedParsecSlot:this.selectedParsecSlot,selectedMode:this.selectedMode};Os(V.PREF_FILE,JSON.stringify(e))}};s(V,"PREV_VERSION_NUM",10),s(V,"VERSION_NUM",20),s(V,"PREF_FILE","p47.prf"),s(V,"MODE_NUM",2),s(V,"DIFFICULTY_NUM",4),s(V,"REACHED_PARSEC_SLOT_NUM",10);let Q=V;function Le(c){if(typeof c!="object"||c===null||Array.isArray(c))throw new Error("Invalid pref data");return c}function Tt(c,e){const t=c[e];if(typeof t!="number"||!Number.isFinite(t))throw new Error(`Invalid integer value: ${e}`);return t|0}function Vt(c,e){let t=c[e[0]];for(let r=1;r<e.length;r++){const i=e[r];if(!Array.isArray(t))throw new Error(`Invalid array path: ${e.join(".")}`);t=t[i]}if(typeof t!="number"||!Number.isFinite(t))throw new Error(`Invalid integer value: ${e.join(".")}`);return t|0}function Is(c){return typeof localStorage>"u"?null:localStorage.getItem(c)}function Os(c,e){typeof localStorage>"u"||localStorage.setItem(c,e)}const j=class j{constructor(){s(this,"pad");s(this,"gameManager");s(this,"prefManager");s(this,"field");s(this,"slotNum",[]);s(this,"startReachedParsec",[]);s(this,"curX",0);s(this,"curY",0);s(this,"mode",0);s(this,"boxCnt",0);s(this,"titleTexture",null);s(this,"padPrsd",!0)}init(e,t,r,i){this.pad=e,this.gameManager=t,this.prefManager=r,this.field=i,this.gameManager.difficulty=r.selectedDifficulty,this.gameManager.parsecSlot=r.selectedParsecSlot,this.gameManager.mode=r.selectedMode,this.titleTexture=new ue("title.bmp"),this.slotNum.length=0,this.startReachedParsec.length=0;for(let n=0;n<Q.MODE_NUM;n++)this.slotNum.push(Array(Q.DIFFICULTY_NUM+1).fill(0)),this.startReachedParsec.push(Array(Q.DIFFICULTY_NUM).fill(0))}close(){var e;(e=this.titleTexture)==null||e.deleteTexture(),this.titleTexture=null}async waitForAssets(){return this.titleTexture?this.titleTexture.waitForLoad():!0}start(){for(let e=0;e<Q.MODE_NUM;e++){for(let t=0;t<Q.DIFFICULTY_NUM;t++)this.slotNum[e][t]=((this.prefManager.reachedParsec[e][t]-1)/10|0)+1,this.startReachedParsec[e][t]=this.slotNum[e][t]*10+1,this.slotNum[e][t]>10&&(this.slotNum[e][t]=10);this.slotNum[e][Q.DIFFICULTY_NUM]=1}this.curX=this.gameManager.parsecSlot,this.curY=this.gameManager.difficulty,this.mode=this.gameManager.mode,this.boxCnt=j.BOX_COUNT,this.field.setColor(this.mode)}getStartParsec(e,t){if(t<Q.REACHED_PARSEC_SLOT_NUM-1)return t*10+1;let r=this.prefManager.reachedParsec[this.mode][e];return r--,r=(r/10|0)*10,r++,r}move(){const e=this.pad.getDirState();this.padPrsd?e===0&&(this.padPrsd=!1):(e&tt.Dir.DOWN?(this.curY++,this.curY>=this.slotNum[this.mode].length&&(this.curY=0),this.curX>=this.slotNum[this.mode][this.curY]&&(this.curX=this.slotNum[this.mode][this.curY]-1)):e&tt.Dir.UP?(this.curY--,this.curY<0&&(this.curY=this.slotNum[this.mode].length-1),this.curX>=this.slotNum[this.mode][this.curY]&&(this.curX=this.slotNum[this.mode][this.curY]-1)):e&tt.Dir.RIGHT?(this.curX++,this.curX>=this.slotNum[this.mode][this.curY]&&(this.curX=0)):e&tt.Dir.LEFT&&(this.curX--,this.curX<0&&(this.curX=this.slotNum[this.mode][this.curY]-1)),e!==0&&(this.boxCnt=j.BOX_COUNT,this.padPrsd=!0,this.gameManager.startStage(this.curY,this.curX,this.getStartParsec(this.curY,this.curX),this.mode))),this.boxCnt>=0&&this.boxCnt--}setStatus(){this.gameManager.difficulty=this.curY,this.gameManager.parsecSlot=this.curX,this.gameManager.mode=this.mode,this.curY<Q.DIFFICULTY_NUM&&(this.prefManager.selectedDifficulty=this.curY,this.prefManager.selectedParsecSlot=this.curX,this.prefManager.selectedMode=this.mode)}changeMode(){this.mode++,this.mode>=Q.MODE_NUM&&(this.mode=0),this.curX>=this.slotNum[this.mode][this.curY]&&(this.curX=this.slotNum[this.mode][this.curY]-1),this.field.setColor(this.mode),this.gameManager.startStage(this.curY,this.curX,this.getStartParsec(this.curY,this.curX),this.mode)}drawBox(e,t,r,i){o.setColor(1,1,1,1),S.drawBoxLine(e,t,r,i),o.setColor(1,1,1,.5),S.drawBoxSolid(e,t,r,i)}drawBoxLight(e,t,r,i){o.setColor(1,1,1,.7),S.drawBoxLine(e,t,r,i),o.setColor(1,1,1,.3),S.drawBoxSolid(e,t,r,i)}drawTitleBoard(){var e;(e=this.titleTexture)!=null&&e.isLoaded&&(o.glEnable(o.GL_TEXTURE_2D),this.titleTexture.bind(),S.setColor(1,1,1,1),o.glBegin(o.GL_TRIANGLE_FAN),o.glTexCoord2f(0,0),o.glVertex3f(180,20,0),o.glTexCoord2f(1,0),o.glVertex3f(308,20,0),o.glTexCoord2f(1,1),o.glVertex3f(308,148,0),o.glTexCoord2f(0,1),o.glVertex3f(180,148,0),o.glEnd(),o.glDisable(o.GL_TEXTURE_2D))}draw(){let e,t;const r=j.DIFFICULTY_STR[this.curY];M.drawString(r,470-r.length*14,150,10,M.TO_RIGHT);const i=j.MODE_STR[this.mode];M.drawString(i,470-i.length*14,450,10,M.TO_RIGHT),this.curX>0&&(M.drawString("START AT PARSEC",290,180,6,M.TO_RIGHT),M.drawNum(this.getStartParsec(this.curY,this.curX),470,180,6,M.TO_RIGHT)),this.curY<Q.DIFFICULTY_NUM&&M.drawNum(this.prefManager.hiScore[this.mode][this.curY][this.curX],470,210,10,M.TO_RIGHT),t=260;for(let n=0;n<Q.DIFFICULTY_NUM+1;n++){e=180;for(let l=0;l<this.slotNum[this.mode][n];l++){if(l===this.curX&&n===this.curY){const a=(j.BOX_COUNT-this.boxCnt)/2|0;this.drawBox(e-a,t-a,j.BOX_SMALL_SIZE+a*2,j.BOX_SMALL_SIZE+a*2),l===0?M.drawString(j.DIFFICULTY_SHORT_STR[n],e+13,t+13,12,M.TO_RIGHT):(M.drawString(j.DIFFICULTY_SHORT_STR[n],e+4,t+13,12,M.TO_RIGHT),l>=Q.REACHED_PARSEC_SLOT_NUM-1?M.drawString("X",e+21,t+14,12,M.TO_RIGHT):M.drawNum(l,e+22,t+13,12,M.TO_RIGHT))}else this.drawBoxLight(e,t,j.BOX_SMALL_SIZE,j.BOX_SMALL_SIZE);e+=28}t+=32,n===Q.DIFFICULTY_NUM-1&&(t+=15)}this.drawTitleBoard()}};s(j,"BOX_COUNT",16),s(j,"BOX_SMALL_SIZE",24),s(j,"DIFFICULTY_SHORT_STR",["P","N","H","E","Q"]),s(j,"DIFFICULTY_STR",["PRACTICE","NORMAL","HARD","EXTREME","QUIT"]),s(j,"MODE_STR",["ROLL","LOCK"]);let de=j;const rt=class rt extends ge{constructor(){super(...arguments);s(this,"pos",new L);s(this,"ppos",new L);s(this,"vel",new L);s(this,"z",0);s(this,"mz",0);s(this,"pz",0);s(this,"lumAlp",0);s(this,"cnt",0)}init(t){if(!((Array.isArray(t)?t[0]:t)instanceof Ve))throw new Error("Particle.init requires ParticleInitializer");this.pos=new L,this.ppos=new L,this.vel=new L}set(t,r,i,n){i>0?(this.pos.x=t.x+Math.sin(r)*i,this.pos.y=t.y+Math.cos(r)*i):(this.pos.x=t.x,this.pos.y=t.y),this.z=0;const l=rt.rand.nextFloat(.5)+.75;this.vel.x=Math.sin(r)*n*l,this.vel.y=Math.cos(r)*n*l,this.mz=rt.rand.nextSignedFloat(.7),this.cnt=12+rt.rand.nextInt(48),this.lumAlp=.8+rt.rand.nextFloat(.2),this.exists=!0}move(){if(this.cnt--,this.cnt<0){this.exists=!1;return}this.ppos.x=this.pos.x,this.ppos.y=this.pos.y,this.pz=this.z,this.pos.opAddAssign(this.vel),this.vel.opMulAssign(.98),this.z+=this.mz,this.lumAlp*=.98}draw(){o.glVertex3f(this.ppos.x,this.ppos.y,this.pz),o.glVertex3f(this.pos.x,this.pos.y,this.z)}drawLuminous(){this.lumAlp<.2||(o.setColor(rt.R,rt.G,rt.B,this.lumAlp),o.glVertex3f(this.ppos.x,this.ppos.y,this.pz),o.glVertex3f(this.pos.x,this.pos.y,this.z))}};s(rt,"R",1),s(rt,"G",1),s(rt,"B",.5),s(rt,"rand",new it);let jt=rt;class Ve{}const ae=1,Bs=27,Ae=80,Ds=16;class Ce extends St{init(e){}move(){}draw(){}}class Ns extends ge{init(e){}move(){}draw(){}drawLuminous(){}}const D=class D extends Sr{constructor(){super(...arguments);s(this,"nowait",!1);s(this,"difficulty",1);s(this,"parsecSlot",0);s(this,"mode",D.ROLL);s(this,"state",D.TITLE);s(this,"ENEMY_MAX",32);s(this,"FIRST_EXTEND",2e5);s(this,"EVERY_EXTEND",5e5);s(this,"LEFT_MAX",4);s(this,"BOSS_WING_NUM",4);s(this,"SLOWDOWN_START_BULLETS_SPEED",[30,42]);s(this,"PAD_BUTTON1",tt.Button.A);s(this,"PAD_BUTTON2",tt.Button.B);s(this,"pad");s(this,"prefManager");s(this,"screen");s(this,"rand");s(this,"field");s(this,"ship");s(this,"enemies");s(this,"particles");s(this,"fragments");s(this,"bullets");s(this,"shots");s(this,"rolls");s(this,"locks");s(this,"bonuses");s(this,"barrageManager");s(this,"stageManager");s(this,"title");s(this,"left",0);s(this,"score",0);s(this,"extendScore",this.FIRST_EXTEND);s(this,"cnt",0);s(this,"pauseCnt",0);s(this,"bossShield",0);s(this,"bossWingShield",Array(this.BOSS_WING_NUM).fill(0));s(this,"interval",0);s(this,"pPrsd",!0);s(this,"btnPrsd",!0);s(this,"screenShakeCnt",0);s(this,"screenShakeIntense",0);s(this,"waitingForBarrageAssets",!0);s(this,"barrageAssetsReady",!1);s(this,"barrageAssetsFailed",!1);s(this,"titleAssetsReady",!1);s(this,"titleAssetsFailed",!1)}init(){var i,n;this.pad=this.input,this.prefManager=this.abstPrefManager,this.screen=this.abstScreen,this.difficulty=this.getPrefValue("selectedDifficulty",1),this.parsecSlot=this.getPrefValue("selectedParsecSlot",0),this.mode=this.getPrefValue("selectedMode",D.ROLL),this.rand=new it,Lt.createDisplayLists(),this.field=new Lt,this.field.init(),vt.createDisplayLists(),this.ship=new vt,this.ship.init(this.pad,this.field,this),this.particles=new ve(128,[new Ve],this.hasActorContract(jt)?(()=>new jt):(()=>new Ns)),this.fragments=new ve(128,[new He],()=>new ht),ct.createDisplayLists(),this.bullets=new Ct(512,new ke(this.field,this.ship)),M.createDisplayLists();const t=new Ye(this.field);this.shots=new xt(32,[t],this.hasActorContract(Dt)?(()=>new Dt):(()=>new Ce));const r=new Ge(this.ship,this.field,this);this.rolls=new xt(4,[r],this.hasActorContract(Bt)?(()=>new Bt):(()=>new Ce)),Ot.init(),this.locks=new xt(4,[new Fe(this.ship,this.field,this)],()=>new Ot),this.enemies=new xt(this.ENEMY_MAX,[new Ue(this.field,this.bullets,this.shots,this.rolls,this.locks,this.ship,this)],()=>new Rt),at.init(),this.bonuses=new xt(128,[new Ne(this.field,this.ship,this)],()=>new at),this.barrageManager=new F,X.init(this.barrageManager),this.barrageManager.loadBulletMLs().then(()=>{this.onBarrageAssetsReady(!1)}).catch(l=>{const a=l instanceof Error?l:new Error(String(l));At.error(a),this.onBarrageAssetsReady(!0)}),this.stageManager=new ce,this.stageManager.init(this,this.barrageManager,this.field),this.title=new de,this.title.init(this.pad,this,this.prefManager,this.field),(n=(i=this.title).waitForAssets)==null||n.call(i).then(l=>{this.onTitleAssetsReady(l===!1)}).catch(l=>{const a=l instanceof Error?l:new Error(String(l));At.error(a),this.onTitleAssetsReady(!0)}),this.interval=this.mainLoop.INTERVAL_BASE,P.init(this)}start(){if(this.assetsReady()){this.waitingForBarrageAssets=!1,this.startTitle();return}this.waitingForBarrageAssets=!0,this.state=D.TITLE,this.cnt=0,wt.haltMusic()}close(){this.barrageManager.unloadBulletMLs(),this.title.close(),P.close(),M.deleteDisplayLists(),Lt.deleteDisplayLists(),vt.deleteDisplayLists(),ct.deleteDisplayLists()}addScore(t){this.score+=t,this.score>this.extendScore&&(this.left<this.LEFT_MAX&&(P.playSe(P.EXTEND),this.left++),this.extendScore<=this.FIRST_EXTEND?this.extendScore=this.EVERY_EXTEND:this.extendScore+=this.EVERY_EXTEND)}shipDestroyed(){this.mode===D.ROLL?this.releaseRoll():this.releaseLock(),this.clearBullets(),this.left--,this.left<0&&this.startGameover()}addParticle(t,r,i,n){var a;const l=this.particles.getInstanceForced();l.exists=!0,(a=l.set)==null||a.call(l,t,r,i,n)}addFragments(t,r,i,n,l,a,h,d){var u;for(let f=0;f<t;f++){const g=this.fragments.getInstanceForced();g.exists=!0,(u=g.set)==null||u.call(g,r,i,n,l,a,h,d)}}addEnemy(t,r,i,n){var a;const l=this.enemies.getInstance();l&&((a=l.set)==null||a.call(l,t,r,i,n),l.exists=!0)}clearBullets(){var t;for(let r=0;r<this.bullets.actor.length;r++){const i=this.bullets.actor[r];i.exists&&((t=i.toRetro)==null||t.call(i))}}addBoss(t,r,i){var l;const n=this.enemies.getInstance();n&&((l=n.setBoss)==null||l.call(n,t,r,i),n.exists=!0)}addShot(t,r){const i=this.shots.getInstance();i&&(this.callIfFunction(i,"set",t,r),i.exists=!0)}addRoll(){const t=this.rolls.getInstance();t&&(this.callIfFunction(t,"set"),t.exists=!0)}addLock(){const t=this.locks.getInstance();t&&(this.callIfFunction(t,"set"),t.exists=!0)}releaseRoll(){for(let t=0;t<this.rolls.actor.length;t++){const r=this.rolls.actor[t];r.exists&&(r.released=!0)}}releaseLock(){for(let t=0;t<this.locks.actor.length;t++){const r=this.locks.actor[t];r.exists&&(r.released=!0)}}addBonus(t,r,i){for(let n=0;n<i;n++){const l=this.bonuses.getInstance();if(!l)return;this.callIfFunction(l,"set",t,r),l.exists=!0}}setBossShieldMeter(t,r,i,n,l,a){const h=a*.7;this.bossShield=t*h|0,this.bossWingShield[0]=r*h|0,this.bossWingShield[1]=i*h|0,this.bossWingShield[2]=n*h|0,this.bossWingShield[3]=l*h|0}startStage(t,r,i,n){this.enemies.clear(),this.bullets.clear(),this.difficulty=t,this.parsecSlot=r,this.mode=n;const l=this.rand.nextInt(99999);switch(t){case D.PRACTICE:this.stageManager.setRank(1,4,i,l),this.ship.setSpeedRate(.7),at.setSpeedRate(.6);break;case D.NORMAL:this.stageManager.setRank(10,8,i,l),this.ship.setSpeedRate(.9),at.setSpeedRate(.8);break;case D.HARD:this.stageManager.setRank(22,12,i,l),this.ship.setSpeedRate(1),at.setSpeedRate(1);break;case D.EXTREME:this.stageManager.setRank(36,16,i,l),this.ship.setSpeedRate(1.2),at.setSpeedRate(1.3);break;case D.QUIT:default:this.stageManager.setRank(0,0,0,0),this.ship.setSpeedRate(1),at.setSpeedRate(1);break}}setScreenShake(t,r){this.screenShakeCnt=t,this.screenShakeIntense=r}move(){if(this.pad.keys[Bs]===ae){this.mainLoop.breakLoop();return}if(this.waitingForBarrageAssets){this.cnt++;return}switch(this.state){case D.IN_GAME:this.inGameMove();break;case D.TITLE:this.titleMove();break;case D.GAMEOVER:this.gameoverMove();break;case D.PAUSE:this.pauseMove();break}this.cnt++}draw(){var r,i,n,l,a,h,d,u,f,g,w,v,E,x,B,k;const t=this.mainLoop.event;if(t.type===Ds){const H=((r=t.resize)==null?void 0:r.w)??0,q=((i=t.resize)==null?void 0:i.h)??0;H>150&&q>100&&this.screen.resized(H,q)}if(this.waitingForBarrageAssets){(l=(n=this.screen).viewOrthoFixed)==null||l.call(n),this.drawLoadingStatus(),(h=(a=this.screen).viewPerspective)==null||h.call(a);return}switch((u=(d=this.screen).startRenderToTexture)==null||u.call(d),o.glPushMatrix(),this.setEyepos(),this.state){case D.IN_GAME:case D.PAUSE:this.inGameDrawLuminous();break;case D.TITLE:this.titleDrawLuminous();break;case D.GAMEOVER:this.gameoverDrawLuminous();break}switch(o.glPopMatrix(),(g=(f=this.screen).endRenderToTexture)==null||g.call(f),this.screen.clear(),o.glPushMatrix(),this.setEyepos(),this.state){case D.IN_GAME:case D.PAUSE:this.inGameDraw();break;case D.TITLE:this.titleDraw();break;case D.GAMEOVER:this.gameoverDraw();break}switch(o.glPopMatrix(),(v=(w=this.screen).drawLuminous)==null||v.call(w),(x=(E=this.screen).viewOrthoFixed)==null||x.call(E),this.state){case D.IN_GAME:this.inGameDrawStatus();break;case D.TITLE:this.titleDrawStatus();break;case D.GAMEOVER:this.gameoverDrawStatus();break;case D.PAUSE:this.pauseDrawStatus();break}(k=(B=this.screen).viewPerspective)==null||k.call(B)}onBarrageAssetsReady(t){this.barrageAssetsReady=!0,this.barrageAssetsFailed=t,this.tryLeaveAssetLoading()}onTitleAssetsReady(t){this.titleAssetsReady=!0,this.titleAssetsFailed=t,this.tryLeaveAssetLoading()}tryLeaveAssetLoading(){this.assetsReady()&&this.waitingForBarrageAssets&&(this.waitingForBarrageAssets=!1,this.startTitle())}assetsReady(){return this.barrageAssetsReady&&this.titleAssetsReady}initShipState(){this.left=2,this.score=0,this.extendScore=this.FIRST_EXTEND,this.ship.start()}startInGame(){this.state=D.IN_GAME,this.initShipState(),this.startStage(this.difficulty,this.parsecSlot,this.getStartParsec(this.difficulty,this.parsecSlot),this.mode)}startTitle(){var t,r;this.state=D.TITLE,(r=(t=this.title).start)==null||r.call(t),this.initShipState(),this.bullets.clear(),this.ship.cnt=0,this.startStage(this.difficulty,this.parsecSlot,this.getStartParsec(this.difficulty,this.parsecSlot),this.mode),this.cnt=0,wt.haltMusic()}startGameover(){this.state=D.GAMEOVER,this.bonuses.clear(),this.shots.clear(),this.rolls.clear(),this.locks.clear(),this.setScreenShake(0,0),this.mainLoop.interval=this.interval=this.mainLoop.INTERVAL_BASE,this.cnt=0;const t=this.getHiScore(this.mode,this.difficulty,this.parsecSlot);this.score>t&&this.setHiScore(this.mode,this.difficulty,this.parsecSlot,this.score);const r=this.stageManager.parsec??0;r>this.getReachedParsec(this.mode,this.difficulty)&&this.setReachedParsec(this.mode,this.difficulty,r),wt.fadeMusic()}startPause(){this.state=D.PAUSE,this.pauseCnt=0}resumePause(){this.state=D.IN_GAME}stageMove(){var t,r;(r=(t=this.stageManager).move)==null||r.call(t)}inGameMove(){if(this.stageMove(),this.field.move(),this.callIfFunction(this.ship,"move"),this.bonuses.move(),this.shots.move(),this.enemies.move(),this.mode===D.ROLL?this.rolls.move():this.locks.move(),ct.resetTotalBulletsSpeed(),this.bullets.move(),this.particles.move(),this.fragments.move(),this.moveScreenShake(),this.pad.keys[Ae]===ae?this.pPrsd||(this.pPrsd=!0,this.startPause()):this.pPrsd=!1,!this.nowait){const t=this.SLOWDOWN_START_BULLETS_SPEED[this.mode]??this.SLOWDOWN_START_BULLETS_SPEED[0];if(ct.totalBulletsSpeed>t){let r=ct.totalBulletsSpeed/t;r>1.75&&(r=1.75),this.interval+=(r*this.mainLoop.INTERVAL_BASE-this.interval)*.1}else this.interval+=(this.mainLoop.INTERVAL_BASE-this.interval)*.08;this.mainLoop.interval=this.interval}}titleMove(){var t,r,i,n,l,a;if((r=(t=this.title).move)==null||r.call(t),this.cnt<=8)this.btnPrsd=!0;else{const h=this.pad.getButtonState();if((h&this.PAD_BUTTON1)!==0){if(!this.btnPrsd){(n=(i=this.title).setStatus)==null||n.call(i),this.difficulty>=4?this.mainLoop.breakLoop():this.startInGame();return}}else(h&this.PAD_BUTTON2)!==0?this.btnPrsd||((a=(l=this.title).changeMode)==null||a.call(l),this.btnPrsd=!0):this.btnPrsd=!1}this.stageMove(),this.field.move(),this.enemies.move(),this.bullets.move()}gameoverMove(){let t=!1;this.cnt<=64?this.btnPrsd=!0:(this.pad.getButtonState()&(this.PAD_BUTTON1|this.PAD_BUTTON2))!==0?this.btnPrsd||(t=!0):this.btnPrsd=!1,this.cnt>64&&t?this.startTitle():this.cnt>500&&this.startTitle(),this.field.move(),this.enemies.move(),this.bullets.move(),this.particles.move(),this.fragments.move()}pauseMove(){this.pauseCnt++,this.pad.keys[Ae]===ae?this.pPrsd||(this.pPrsd=!0,this.resumePause()):this.pPrsd=!1}inGameDraw(){this.field.draw(),S.setRetroColor(.2,.7,.5,1),o.glBlendFunc(o.GL_SRC_ALPHA,o.GL_ONE_MINUS_SRC_ALPHA),this.bonuses.draw(),o.glBlendFunc(o.GL_SRC_ALPHA,o.GL_ONE),o.setColor(.3,.7,1,1),o.glBegin(o.GL_LINES),this.particles.draw(),o.glEnd(),S.setRetroColor(ht.R,ht.G,ht.B,1),this.fragments.draw(),S.setRetroZ(0),this.callIfFunction(this.ship,"draw"),S.setRetroColor(.8,.8,.2,.8),this.shots.draw(),S.setRetroColor(1,.8,.5,1),this.mode===D.ROLL?this.rolls.draw():this.locks.draw(),this.enemies.draw(),this.bullets.draw()}titleDraw(){this.field.draw(),this.enemies.draw(),this.bullets.draw()}gameoverDraw(){this.field.draw(),o.setColor(.3,.7,1,1),o.glBegin(o.GL_LINES),this.particles.draw(),o.glEnd(),S.setRetroColor(ht.R,ht.G,ht.B,1),this.fragments.draw(),S.setRetroZ(0),this.enemies.draw(),this.bullets.draw()}inGameDrawLuminous(){o.glBegin(o.GL_LINES),this.particles.drawLuminous(),this.fragments.drawLuminous(),o.glEnd()}titleDrawLuminous(){}gameoverDrawLuminous(){o.glBegin(o.GL_LINES),this.particles.drawLuminous(),this.fragments.drawLuminous(),o.glEnd()}drawBoard(t,r,i,n){o.setColor(0,0,0,1),o.glBegin(o.GL_QUADS),o.glVertexXYZ(t,r,0),o.glVertexXYZ(t+i,r,0),o.glVertexXYZ(t+i,r+n,0),o.glVertexXYZ(t,r+n,0),o.glEnd()}drawSideBoards(){o.glDisable(o.GL_BLEND),this.drawBoard(0,0,160,480),this.drawBoard(480,0,160,480),o.glEnable(o.GL_BLEND)}drawScore(){M.drawNum(this.score,120,28,25,M.TO_UP),M.drawNum(at.bonusScore,24,20,12,M.TO_UP)}drawLeft(){this.left<0||(M.drawString("LEFT",520,260,25,M.TO_DOWN),M.changeColor(M.RED),M.drawNum(this.left,520,450,25,M.TO_DOWN),M.changeColor(M.WHITE))}drawParsec(){const t=this.stageManager.parsec??0;t<10?M.drawNum(t,600,26,25,M.TO_DOWN):t<100?M.drawNum(t,600,68,25,M.TO_DOWN):M.drawNum(t,600,110,25,M.TO_DOWN)}drawBox(t,r,i,n){i<=0||(o.setColor(1,1,1,.5),S.drawBoxSolid(t,r,i,n),o.setColor(1,1,1,1),S.drawBoxLine(t,r,i,n))}drawBossShieldMeter(){this.drawBox(165,6,this.bossShield,6);let t=24;for(let r=0;r<this.BOSS_WING_NUM;r++)switch(r%2){case 0:this.drawBox(165,t,this.bossWingShield[r],6);break;case 1:this.drawBox(475-this.bossWingShield[r],t,this.bossWingShield[r],6),t+=12;break}}drawSideInfo(){this.drawSideBoards(),this.drawScore(),this.drawLeft(),this.drawParsec()}inGameDrawStatus(){this.drawSideInfo(),this.stageManager.bossSection&&this.drawBossShieldMeter()}titleDrawStatus(){var t,r;this.drawSideBoards(),this.drawScore(),(r=(t=this.title).draw)==null||r.call(t)}gameoverDrawStatus(){this.drawSideInfo(),this.cnt>64&&M.drawString("GAME OVER",220,200,15,M.TO_RIGHT)}pauseDrawStatus(){this.drawSideInfo(),this.pauseCnt%60<30&&M.drawString("PAUSE",280,220,12,M.TO_RIGHT)}drawLoadingStatus(){this.drawSideBoards(),M.drawString("LOADING ASSETS",234,192,10,M.TO_RIGHT),M.drawString(this.barrageAssetsReady?"BULLETML: OK":"BULLETML: ...",230,224,8,M.TO_RIGHT),M.drawString(this.titleAssetsReady?"TITLE BMP: OK":"TITLE BMP: ...",230,250,8,M.TO_RIGHT),(this.barrageAssetsFailed||this.titleAssetsFailed)&&(M.changeColor(M.RED),M.drawString("LOAD FAILED",252,286,10,M.TO_RIGHT),M.changeColor(M.WHITE))}moveScreenShake(){this.screenShakeCnt>0&&this.screenShakeCnt--}setEyepos(){let t=0,r=0;this.screenShakeCnt>0&&(t=this.rand.nextSignedFloat(this.screenShakeIntense*(this.screenShakeCnt+10)),r=this.rand.nextSignedFloat(this.screenShakeIntense*(this.screenShakeCnt+10))),o.glTranslatef(t,r,-this.field.eyeZ)}getStartParsec(t,r){return this.title.getStartParsec?this.title.getStartParsec(t,r):r*10+1}getPrefValue(t,r){const i=this.prefManager[t];return typeof i=="number"?i:r}getHiScore(t,r,i){const n=this.prefManager.hiScore;if(typeof n=="number")return n;if(!Array.isArray(n))return 0;const l=n[t];if(!Array.isArray(l))return 0;const a=l[r];if(!Array.isArray(a))return 0;const h=a[i];return typeof h=="number"?h:0}setHiScore(t,r,i,n){const l=this.prefManager;if(typeof l.hiScore=="number"){l.hiScore=n;return}if(!Array.isArray(l.hiScore))return;const a=l.hiScore[t];if(!Array.isArray(a))return;const h=a[r];Array.isArray(h)&&(h[i]=n)}getReachedParsec(t,r){const i=this.prefManager.reachedParsec;if(!Array.isArray(i))return 0;const n=i[t];if(!Array.isArray(n))return 0;const l=n[r];return typeof l=="number"?l:0}setReachedParsec(t,r,i){const n=this.prefManager;if(!Array.isArray(n.reachedParsec))return;const l=n.reachedParsec[t];Array.isArray(l)&&(l[r]=i)}hasActorContract(t){const r=t.prototype;return r?typeof r.init=="function"&&typeof r.move=="function"&&typeof r.draw=="function":!1}callIfFunction(t,r,...i){const n=t[r];typeof n=="function"&&n.apply(t,i)}};s(D,"ROLL",0),s(D,"LOCK",1),s(D,"TITLE",0),s(D,"IN_GAME",1),s(D,"GAMEOVER",2),s(D,"PAUSE",3),s(D,"PRACTICE",0),s(D,"NORMAL",1),s(D,"HARD",2),s(D,"EXTREME",3),s(D,"QUIT",4);let yt=D,Me=null,It=null,Wt=null,Pe=null,Zt=null;function ks(c){Me=new S,It=new tt;try{It.openJoystick()}catch{}Wt=new yt,Pe=new Q,Zt=new er(Me,It,Wt,Pe);try{_s(c)}catch{return 1}return Zt.loop(),0}function _s(c){const e=c[0]??"p47-web";for(let t=1;t<c.length;t++)switch(c[t]){case"-brightness":{t>=c.length-1&&Pt(e),t++;const r=parseInt(c[t],10)/100;r>=0&&r<=1||Pt(e),o.brightness=r;break}case"-luminous":{t>=c.length-1&&Pt(e),t++;const r=parseInt(c[t],10)/100;r>=0&&r<=1||Pt(e),S.luminous=r;break}case"-nosound":$.noSound=!0;break;case"-window":o.windowMode=!0;break;case"-reverse":It&&(It.buttonReversed=!0);break;case"-lowres":o.width=320,o.height=240;break;case"-nowait":Wt&&(Wt.nowait=!0);break;case"-accframe":Zt&&(Zt.accframe=1);break;case"-slowship":vt.isSlow=!0;break;default:Pt(e)}}function Fs(c){At.error(`Usage: ${c} [-brightness [0-100]] [-luminous [0-100]] [-nosound] [-window] [-reverse] [-lowres] [-slowship] [-nowait] [-accframe]`)}function Pt(c){throw Fs(c),new Error("Invalid options")}ks(["p47-web"]);
