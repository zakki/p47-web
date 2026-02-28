var Xe=Object.defineProperty;var je=(d,e,t)=>e in d?Xe(d,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):d[e]=t;var i=(d,e,t)=>je(d,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const a of n.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function r(s){if(s.ep)return;s.ep=!0;const n=t(s);fetch(s.href,n)}})();class Rt{static info(e,t=!0){t?console.info(e):process.stderr.write(e)}static infoNumber(e,t=!0){t?console.info(String(e)):process.stderr.write(`${e} `)}static error(e){if(typeof e=="string"){console.error(`Error: ${e}`);return}console.error(`Error: ${e.toString()}`)}}class J extends Error{constructor(e){super(e),this.name="SDLInitFailedException"}}class pe extends Error{constructor(e){super(e),this.name="SDLException"}}var $;let z=($=class{static init(){if(!$.noSound&&!(typeof AudioContext>"u"))try{$.audioContext||($.audioContext=new AudioContext),$.bindUnlockHandlers()}catch{throw $.noSound=!0,new J("Unable to initialize audio")}}static close(){$.noSound||$.audioContext&&$.audioContext.suspend()}static getContext(){return $.audioContext}static unlock(){!$.audioContext||$.unlocked||($.audioContext.resume(),$.unlocked=$.audioContext.state==="running")}static bindUnlockHandlers(){if($.unlockHandlersBound||typeof window>"u")return;$.unlockHandlersBound=!0;const e=()=>{$.unlock(),$.unlocked&&(window.removeEventListener("pointerdown",e),window.removeEventListener("keydown",e))};window.addEventListener("pointerdown",e),window.addEventListener("keydown",e)}},i($,"noSound",!1),i($,"audioContext",null),i($,"unlocked",!1),i($,"unlockHandlersBound",!1),$);const et=class et{constructor(){i(this,"audio",null);i(this,"gain",null);i(this,"source",null);i(this,"music",null)}load(e){if(z.noSound)return;const t=`${et.dir}/${e}`;if(this.music=t,typeof Audio<"u"){this.audio=new Audio(t),this.audio.preload="auto",this.audio.loop=!0;const r=z.getContext();r&&(this.source=r.createMediaElementSource(this.audio),this.gain=r.createGain(),this.gain.gain.value=1,this.source.connect(this.gain),this.gain.connect(r.destination))}else if(!this.music)throw new pe(`Couldn't load: ${t}`)}free(){var e,t;this.halt(),(e=this.source)==null||e.disconnect(),(t=this.gain)==null||t.disconnect(),this.source=null,this.gain=null,this.audio=null,this.music=null}play(){z.noSound||(z.unlock(),this.audio&&(this.audio.loop=!0,this.audio.currentTime=0,this.audio.play().catch(()=>{}),et.active.add(this)))}playOnce(){z.noSound||(z.unlock(),this.audio&&(this.audio.loop=!1,this.audio.currentTime=0,this.audio.play().catch(()=>{}),et.active.add(this)))}fade(){et.fadeMusic()}halt(){et.haltMusic()}static fadeMusic(){if(z.noSound)return;const e=z.getContext();if(e){const t=e.currentTime;for(const r of et.active)r.gain&&(r.gain.gain.cancelScheduledValues(t),r.gain.gain.setValueAtTime(r.gain.gain.value,t),r.gain.gain.linearRampToValueAtTime(0,t+.4));return}for(const t of et.active)t.audio&&(t.audio.volume=Math.max(0,t.audio.volume-.3))}static haltMusic(){if(!z.noSound){for(const e of et.active)e.audio&&(e.audio.pause(),e.audio.currentTime=0,e.audio.volume=1,e.gain&&(e.gain.gain.value=1));et.active.clear()}}};i(et,"fadeOutSpeed",1280),i(et,"dir","sounds/musics"),i(et,"active",new Set);let gt=et;const qt=class qt{constructor(){i(this,"chunk",null);i(this,"players",[]);i(this,"nextPlayerIdx",0);i(this,"maxPlayers",8);i(this,"chunkChannel",0)}load(e,t=0){if(z.noSound)return;const r=`${qt.dir}/${e}`;if(this.chunk=r,this.players=[],this.nextPlayerIdx=0,typeof Audio>"u"&&!this.chunk)throw new pe(`Couldn't load: ${r}`);this.chunkChannel=t}free(){this.chunk&&(this.halt(),this.chunk=null,this.players=[])}play(){if(z.noSound||(z.unlock(),!this.chunk||typeof Audio>"u"))return;const e=this.acquirePlayer();e&&(e.currentTime=0,e.play().catch(()=>{}),this.chunkChannel)}halt(){if(!z.noSound)for(const e of this.players)e.pause(),e.currentTime=0}fade(){this.halt()}acquirePlayer(){for(let t=0;t<this.players.length;t++){const r=this.players[t];if(r.ended||r.paused)return r}if(this.players.length<this.maxPlayers){const t=new Audio(this.chunk);return t.preload="auto",this.players.push(t),t}const e=this.players[this.nextPlayerIdx];return this.nextPlayerIdx=(this.nextPlayerIdx+1)%this.players.length,e.pause(),e}};i(qt,"dir","sounds/chunks");let Ht=qt;class We{constructor(){i(this,"frameCount",0);i(this,"updateCount",0);i(this,"droppedFrameCount",0);i(this,"totalFrameMs",0);i(this,"worstFrameMs",0);i(this,"lastUpdatedMs",0)}reset(e){this.frameCount=0,this.updateCount=0,this.droppedFrameCount=0,this.totalFrameMs=0,this.worstFrameMs=0,this.lastUpdatedMs=e}recordFrame(e,t,r){const s=Number.isFinite(e)?Math.max(0,e):0,n=Math.max(0,t|0);this.frameCount++,this.updateCount+=n,n>1&&(this.droppedFrameCount+=n-1),this.totalFrameMs+=s,s>this.worstFrameMs&&(this.worstFrameMs=s),this.lastUpdatedMs=r}getSnapshot(){const e=this.frameCount>0?this.totalFrameMs/this.frameCount:0,t=e>0?1e3/e:0;return{frames:this.frameCount,updates:this.updateCount,droppedFrames:this.droppedFrameCount,avgFrameMs:e,worstFrameMs:this.worstFrameMs,avgFps:t,updatedAtMs:this.lastUpdatedMs}}}class me{constructor(e){i(this,"gl");i(this,"program");i(this,"posBuffer");i(this,"texCoordBuffer");i(this,"colorBuffer");i(this,"posLoc");i(this,"texCoordLoc");i(this,"colorAttrLoc");i(this,"matrixMode",5888);i(this,"modelView",dt());i(this,"projection",dt());i(this,"mvp",dt());i(this,"mvpDirty",!0);i(this,"modelViewStack",[]);i(this,"projectionStack",[]);i(this,"drawColor",[1,1,1,1]);i(this,"clearColor",[0,0,0,1]);i(this,"width",1);i(this,"height",1);i(this,"immediateMode",null);i(this,"immediateVertices",[]);i(this,"blendMode","alpha");i(this,"pointSize",1);i(this,"pointSizeLoc");i(this,"mvpLoc");i(this,"useTextureLoc");i(this,"samplerLoc");i(this,"textureEnabled",!1);i(this,"boundTexture",null);i(this,"currentTexU",0);i(this,"currentTexV",0);i(this,"immediateTexCoords",[]);i(this,"immediateColors",[]);i(this,"drawVerticesBuffer",new Float32Array(0));i(this,"drawTexCoordsBuffer",new Float32Array(0));i(this,"drawColorsBuffer",new Float32Array(0));i(this,"activeRenderTarget",null);this.gl=e,this.program=this.createProgram();const t=e.createBuffer(),r=e.createBuffer(),s=e.createBuffer();if(!t)throw new J("Unable to create WebGL vertex buffer");if(!r)throw new J("Unable to create WebGL texture coord buffer");if(!s)throw new J("Unable to create WebGL color buffer");this.posBuffer=t,this.texCoordBuffer=r,this.colorBuffer=s;const n=e.getAttribLocation(this.program,"aPosition"),a=e.getAttribLocation(this.program,"aTexCoord"),o=e.getAttribLocation(this.program,"aColor");if(n<0)throw new J("Unable to resolve shader attribute aPosition");if(a<0)throw new J("Unable to resolve shader attribute aTexCoord");if(o<0)throw new J("Unable to resolve shader attribute aColor");this.posLoc=n,this.texCoordLoc=a,this.colorAttrLoc=o;const h=e.getUniformLocation(this.program,"uPointSize"),u=e.getUniformLocation(this.program,"uMvp"),c=e.getUniformLocation(this.program,"uUseTexture"),m=e.getUniformLocation(this.program,"uSampler");if(!h||!u||!c||!m)throw new J("Unable to resolve shader uniforms");this.pointSizeLoc=h,this.mvpLoc=u,this.useTextureLoc=c,this.samplerLoc=m,e.useProgram(this.program),e.enableVertexAttribArray(this.posLoc),e.enableVertexAttribArray(this.texCoordLoc),e.enableVertexAttribArray(this.colorAttrLoc),e.bindBuffer(e.ARRAY_BUFFER,this.posBuffer),e.vertexAttribPointer(this.posLoc,4,e.FLOAT,!1,0,0),e.bindBuffer(e.ARRAY_BUFFER,this.texCoordBuffer),e.vertexAttribPointer(this.texCoordLoc,2,e.FLOAT,!1,0,0),e.bindBuffer(e.ARRAY_BUFFER,this.colorBuffer),e.vertexAttribPointer(this.colorAttrLoc,4,e.FLOAT,!1,0,0),e.uniform1i(this.samplerLoc,0),e.enable(e.BLEND),this.applyBlendMode(),e.clearColor(this.clearColor[0],this.clearColor[1],this.clearColor[2],this.clearColor[3])}static create(e){const t=e.getContext("webgl",{alpha:!1,antialias:!1,depth:!0,stencil:!1,preserveDrawingBuffer:!1});if(!t)throw new J("Unable to initialize WebGL context");return new me(t)}resize(e,t){this.width=Math.max(1,e),this.height=Math.max(1,t),this.gl.viewport(0,0,this.width,this.height)}setViewport(e,t){this.gl.viewport(0,0,Math.max(1,e),Math.max(1,t))}clear(){this.gl.clearColor(this.clearColor[0],this.clearColor[1],this.clearColor[2],this.clearColor[3]),this.gl.clear(this.gl.COLOR_BUFFER_BIT|this.gl.DEPTH_BUFFER_BIT)}flush(){this.gl.flush()}setDrawColor(e,t,r,s){this.drawColor=[mt(e),mt(t),mt(r),mt(s)]}setClearColor(e,t,r,s){this.clearColor=[mt(e),mt(t),mt(r),mt(s)]}setBlendMode(e){this.blendMode=e,this.applyBlendMode()}translate(e){this.translateXYZ(e.x,e.y,e.z)}setMatrixMode(e){(e===5888||e===5889)&&(this.matrixMode=e)}loadIdentity(){this.setCurrentMatrix(dt())}pushMatrix(){if(this.matrixMode===5889){this.projectionStack.push(Ee(this.projection));return}this.modelViewStack.push(Ee(this.modelView))}popMatrix(){if(this.matrixMode===5889){const t=this.projectionStack.pop();if(!t)return;this.projection=t,this.mvpDirty=!0;return}const e=this.modelViewStack.pop();e&&(this.modelView=e,this.mvpDirty=!0)}translateXYZ(e,t,r=0){this.mulCurrentMatrix(ke(e,t,r))}scaleXYZ(e,t,r=1){this.mulCurrentMatrix(qe(e,t,r))}rotateDeg(e,t=0,r=0,s=1){this.mulCurrentMatrix(Ze(e,t,r,s))}frustum(e,t,r,s,n,a){this.mulCurrentMatrix(Ke(e,t,r,s,n,a))}ortho(e,t,r,s,n,a){this.mulCurrentMatrix(Je(e,t,r,s,n,a))}lookAt(e,t,r,s,n,a,o,h,u){this.mulCurrentMatrix(Qe(e,t,r,s,n,a,o,h,u))}begin(e){this.immediateMode=e,this.immediateVertices.length=0,this.immediateTexCoords.length=0,this.immediateColors.length=0}vertex(e){this.vertexXYZ(e.x,e.y,e.z)}vertexXYZ(e,t,r=0){if(!this.immediateMode){this.drawVertex(e,t,r);return}this.immediateVertices.push(e,t,r,1),this.immediateTexCoords.push(this.currentTexU,this.currentTexV),this.immediateColors.push(this.drawColor[0],this.drawColor[1],this.drawColor[2],this.drawColor[3])}end(){if(!this.immediateMode||this.immediateVertices.length===0){this.immediateMode=null,this.immediateVertices.length=0,this.immediateTexCoords.length=0,this.immediateColors.length=0;return}this.drawImmediate(this.immediateMode,this.immediateVertices,this.immediateTexCoords,this.immediateColors),this.immediateMode=null,this.immediateVertices.length=0,this.immediateTexCoords.length=0,this.immediateColors.length=0}drawArraysXYZC(e,t,r){const s=this.createPackedDrawCall(e,t,r);s&&this.drawPacked(s.mode,s.count,s.vertices,s.texCoords,s.colors)}createStaticMeshXYZC(e,t,r){const s=this.createPackedDrawCall(e,t,r);if(!s)return null;const n=this.gl,a=n.createBuffer(),o=n.createBuffer(),h=n.createBuffer();return!a||!o||!h?(a&&n.deleteBuffer(a),o&&n.deleteBuffer(o),h&&n.deleteBuffer(h),null):(n.bindBuffer(n.ARRAY_BUFFER,a),n.bufferData(n.ARRAY_BUFFER,s.vertices,n.STATIC_DRAW),n.bindBuffer(n.ARRAY_BUFFER,o),n.bufferData(n.ARRAY_BUFFER,s.texCoords,n.STATIC_DRAW),n.bindBuffer(n.ARRAY_BUFFER,h),n.bufferData(n.ARRAY_BUFFER,s.colors,n.STATIC_DRAW),{mode:s.mode,count:s.count,posBuffer:a,texCoordBuffer:o,colorBuffer:h})}drawStaticMesh(e){if(e.count<=0)return;const t=this.gl;this.prepareDraw(),t.bindBuffer(t.ARRAY_BUFFER,e.posBuffer),t.vertexAttribPointer(this.posLoc,4,t.FLOAT,!1,0,0),t.bindBuffer(t.ARRAY_BUFFER,e.texCoordBuffer),t.vertexAttribPointer(this.texCoordLoc,2,t.FLOAT,!1,0,0),t.bindBuffer(t.ARRAY_BUFFER,e.colorBuffer),t.vertexAttribPointer(this.colorAttrLoc,4,t.FLOAT,!1,0,0),t.drawArrays(e.mode,0,e.count)}deleteStaticMesh(e){const t=this.gl;t.deleteBuffer(e.posBuffer),t.deleteBuffer(e.texCoordBuffer),t.deleteBuffer(e.colorBuffer)}drawVertex(e,t,r=0){this.begin("points"),this.vertexXYZ(e,t,r),this.end()}setPointSize(e){this.pointSize=Math.max(1,e)}enable(e){const t=this.gl;if(e===t.BLEND){t.enable(t.BLEND);return}if(e===t.DEPTH_TEST){t.enable(t.DEPTH_TEST);return}if(e===t.TEXTURE_2D){this.textureEnabled=!0;return}}disable(e){const t=this.gl;if(e===t.BLEND){t.disable(t.BLEND);return}if(e===t.DEPTH_TEST){t.disable(t.DEPTH_TEST);return}if(e===t.TEXTURE_2D){this.textureEnabled=!1;return}}createTextureFromImage(e){const t=this.gl,r=t.createTexture();return r?(t.bindTexture(t.TEXTURE_2D,r),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,1),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,t.RGBA,t.UNSIGNED_BYTE,e),t.bindTexture(t.TEXTURE_2D,null),r):null}bindTexture(e){this.boundTexture=e,this.gl.bindTexture(this.gl.TEXTURE_2D,e)}texCoord2f(e,t){this.currentTexU=e,this.currentTexV=t}deleteTexture(e){this.boundTexture===e&&(this.boundTexture=null),this.gl.deleteTexture(e)}close(){const e=this.gl;e.deleteBuffer(this.posBuffer),e.deleteBuffer(this.texCoordBuffer),e.deleteBuffer(this.colorBuffer),e.deleteProgram(this.program)}createRenderTarget(e,t){const r=this.gl,s=Math.max(1,e),n=Math.max(1,t),a=r.createTexture(),o=r.createFramebuffer();if(!a||!o)return a&&r.deleteTexture(a),o&&r.deleteFramebuffer(o),null;r.bindTexture(r.TEXTURE_2D,a),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MAG_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE),r.texImage2D(r.TEXTURE_2D,0,r.RGBA,s,n,0,r.RGBA,r.UNSIGNED_BYTE,null),r.bindFramebuffer(r.FRAMEBUFFER,o),r.framebufferTexture2D(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,a,0);const h=r.checkFramebufferStatus(r.FRAMEBUFFER);return r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindTexture(r.TEXTURE_2D,null),h!==r.FRAMEBUFFER_COMPLETE?(r.deleteFramebuffer(o),r.deleteTexture(a),null):{texture:a,framebuffer:o,width:s,height:n}}beginRenderTarget(e){const t=this.gl;this.activeRenderTarget=e,t.bindFramebuffer(t.FRAMEBUFFER,e.framebuffer),t.viewport(0,0,e.width,e.height)}endRenderTarget(){const e=this.gl;this.activeRenderTarget=null,e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,this.width,this.height)}deleteRenderTarget(e){const t=this.gl;this.activeRenderTarget===e&&this.endRenderTarget(),this.boundTexture===e.texture&&(this.boundTexture=null),t.deleteFramebuffer(e.framebuffer),t.deleteTexture(e.texture)}createProgram(){const e=this.gl,t=`
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
}`,s=this.compileShader(e.VERTEX_SHADER,t),n=this.compileShader(e.FRAGMENT_SHADER,r),a=e.createProgram();if(!a)throw new J("Unable to create WebGL program");if(e.attachShader(a,s),e.attachShader(a,n),e.linkProgram(a),!e.getProgramParameter(a,e.LINK_STATUS)){const o=e.getProgramInfoLog(a)??"unknown link error";throw e.deleteProgram(a),new J(`Unable to link WebGL program: ${o}`)}return e.deleteShader(s),e.deleteShader(n),a}compileShader(e,t){const r=this.gl,s=r.createShader(e);if(!s)throw new J("Unable to create shader");if(r.shaderSource(s,t),r.compileShader(s),!r.getShaderParameter(s,r.COMPILE_STATUS)){const n=r.getShaderInfoLog(s)??"unknown compile error";throw r.deleteShader(s),new J(`Unable to compile shader: ${n}`)}return s}drawImmediate(e,t,r,s){const n=this.gl,a=this.getDrawCall(e,t,r,s);a&&(this.prepareDraw(),n.bindBuffer(n.ARRAY_BUFFER,this.posBuffer),n.bufferData(n.ARRAY_BUFFER,a.vertices,n.STREAM_DRAW),n.vertexAttribPointer(this.posLoc,4,n.FLOAT,!1,0,0),n.bindBuffer(n.ARRAY_BUFFER,this.texCoordBuffer),n.bufferData(n.ARRAY_BUFFER,a.texCoords,n.STREAM_DRAW),n.vertexAttribPointer(this.texCoordLoc,2,n.FLOAT,!1,0,0),n.bindBuffer(n.ARRAY_BUFFER,this.colorBuffer),n.bufferData(n.ARRAY_BUFFER,a.colors,n.STREAM_DRAW),n.vertexAttribPointer(this.colorAttrLoc,4,n.FLOAT,!1,0,0),n.drawArrays(a.mode,0,a.count))}drawPacked(e,t,r,s,n){if(t<=0)return;const a=this.gl;this.prepareDraw(),a.bindBuffer(a.ARRAY_BUFFER,this.posBuffer),a.bufferData(a.ARRAY_BUFFER,r,a.STREAM_DRAW),a.vertexAttribPointer(this.posLoc,4,a.FLOAT,!1,0,0),a.bindBuffer(a.ARRAY_BUFFER,this.texCoordBuffer),a.bufferData(a.ARRAY_BUFFER,s,a.STREAM_DRAW),a.vertexAttribPointer(this.texCoordLoc,2,a.FLOAT,!1,0,0),a.bindBuffer(a.ARRAY_BUFFER,this.colorBuffer),a.bufferData(a.ARRAY_BUFFER,n,a.STREAM_DRAW),a.vertexAttribPointer(this.colorAttrLoc,4,a.FLOAT,!1,0,0),a.drawArrays(e,0,t)}ensureDrawBuffers(e){const t=e*4;this.drawVerticesBuffer.length<t&&(this.drawVerticesBuffer=new Float32Array(Qt(t)));const r=e*2;this.drawTexCoordsBuffer.length<r&&(this.drawTexCoordsBuffer=new Float32Array(Qt(r)));const s=e*4;this.drawColorsBuffer.length<s&&(this.drawColorsBuffer=new Float32Array(Qt(s)))}createPackedDrawCall(e,t,r){const s=Math.floor(t.length/3);if(s<=0)return null;this.ensureDrawBuffers(s);const n=r.length>=s*4;let a=0,o=0,h=0;for(let T=0;T<s;T++){const S=T*3;if(this.drawVerticesBuffer[a++]=t[S],this.drawVerticesBuffer[a++]=t[S+1],this.drawVerticesBuffer[a++]=t[S+2],this.drawVerticesBuffer[a++]=1,this.drawTexCoordsBuffer[o++]=0,this.drawTexCoordsBuffer[o++]=0,n){const v=T*4;this.drawColorsBuffer[h++]=r[v],this.drawColorsBuffer[h++]=r[v+1],this.drawColorsBuffer[h++]=r[v+2],this.drawColorsBuffer[h++]=r[v+3]}else this.drawColorsBuffer[h++]=this.drawColor[0],this.drawColorsBuffer[h++]=this.drawColor[1],this.drawColorsBuffer[h++]=this.drawColor[2],this.drawColorsBuffer[h++]=this.drawColor[3]}const u=this.mapPrimitiveToDrawMode(e);if(u!==null)return{mode:u,count:s,vertices:this.drawVerticesBuffer.subarray(0,s*4),texCoords:this.drawTexCoordsBuffer.subarray(0,s*2),colors:this.drawColorsBuffer.subarray(0,s*4)};const c=Array.from(this.drawVerticesBuffer.subarray(0,s*4)),m=Array.from(this.drawTexCoordsBuffer.subarray(0,s*2)),b=Array.from(this.drawColorsBuffer.subarray(0,s*4)),g=this.getDrawCall(e,c,m,b);return g||null}mapPrimitiveToDrawMode(e){const t=this.gl;switch(e){case"points":return t.POINTS;case"lines":return t.LINES;case"lineStrip":return t.LINE_STRIP;case"lineLoop":return t.LINE_LOOP;case"triangles":return t.TRIANGLES;case"triangleStrip":return t.TRIANGLE_STRIP;case"triangleFan":return t.TRIANGLE_FAN;default:return null}}applyBlendMode(){const e=this.gl;if(this.blendMode==="additive"){e.blendFunc(e.SRC_ALPHA,e.ONE);return}e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA)}prepareDraw(){const e=this.gl;e.useProgram(this.program),e.uniform1f(this.pointSizeLoc,this.pointSize),e.uniformMatrix4fv(this.mvpLoc,!1,this.getCurrentMvp());const t=this.textureEnabled&&this.boundTexture!==null;e.uniform1i(this.useTextureLoc,t?1:0),e.activeTexture(e.TEXTURE0),t&&this.boundTexture&&e.bindTexture(e.TEXTURE_2D,this.boundTexture)}getDrawCall(e,t,r,s){const n=this.gl;if(t.length<4||r.length<2||s.length<4)return null;const a=Math.floor(t.length/4),o=Math.floor(r.length/2),h=Math.floor(s.length/4),u=Math.min(a,o,h);if(u<=0)return null;const c=t.slice(0,u*4),m=r.slice(0,u*2),b=s.slice(0,u*4);switch(e){case"points":return{mode:n.POINTS,vertices:new Float32Array(c),texCoords:new Float32Array(m),colors:new Float32Array(b),count:u};case"lines":return{mode:n.LINES,vertices:new Float32Array(c),texCoords:new Float32Array(m),colors:new Float32Array(b),count:u-u%2};case"lineStrip":return{mode:n.LINE_STRIP,vertices:new Float32Array(c),texCoords:new Float32Array(m),colors:new Float32Array(b),count:u};case"lineLoop":{if(u<2)return null;const g=c.slice(),T=m.slice(),S=b.slice();return g.push(c[0],c[1],c[2],c[3]),T.push(m[0],m[1]),S.push(b[0],b[1],b[2],b[3]),{mode:n.LINE_STRIP,vertices:new Float32Array(g),texCoords:new Float32Array(T),colors:new Float32Array(S),count:u+1}}case"triangles":return{mode:n.TRIANGLES,vertices:new Float32Array(c),texCoords:new Float32Array(m),colors:new Float32Array(b),count:u-u%3};case"triangleStrip":return{mode:n.TRIANGLE_STRIP,vertices:new Float32Array(c),texCoords:new Float32Array(m),colors:new Float32Array(b),count:u};case"triangleFan":return{mode:n.TRIANGLE_FAN,vertices:new Float32Array(c),texCoords:new Float32Array(m),colors:new Float32Array(b),count:u};case"quads":{if(u<4)return null;const g=[],T=[],S=[];for(let v=0;v+3<u;v+=4){const P=v*4,O=(v+1)*4,G=(v+2)*4,U=(v+3)*4,Q=v*2,we=(v+1)*2,Dt=(v+2)*2,ye=(v+3)*2,ut=v*4,Bt=(v+1)*4,pt=(v+2)*4,Ot=(v+3)*4;g.push(c[P],c[P+1],c[P+2],c[P+3],c[O],c[O+1],c[O+2],c[O+3],c[G],c[G+1],c[G+2],c[G+3],c[P],c[P+1],c[P+2],c[P+3],c[G],c[G+1],c[G+2],c[G+3],c[U],c[U+1],c[U+2],c[U+3]),T.push(m[Q],m[Q+1],m[we],m[we+1],m[Dt],m[Dt+1],m[Q],m[Q+1],m[Dt],m[Dt+1],m[ye],m[ye+1]),S.push(b[ut],b[ut+1],b[ut+2],b[ut+3],b[Bt],b[Bt+1],b[Bt+2],b[Bt+3],b[pt],b[pt+1],b[pt+2],b[pt+3],b[ut],b[ut+1],b[ut+2],b[ut+3],b[pt],b[pt+1],b[pt+2],b[pt+3],b[Ot],b[Ot+1],b[Ot+2],b[Ot+3])}return{mode:n.TRIANGLES,vertices:new Float32Array(g),texCoords:new Float32Array(T),colors:new Float32Array(S),count:g.length/4}}default:return null}}getCurrentMatrix(){return this.matrixMode===5889?this.projection:this.modelView}setCurrentMatrix(e){this.matrixMode===5889?this.projection=e:this.modelView=e,this.mvpDirty=!0}mulCurrentMatrix(e){const t=this.getCurrentMatrix();this.setCurrentMatrix(le(t,e))}getCurrentMvp(){return this.mvpDirty&&(this.mvp=le(this.projection,this.modelView),this.mvpDirty=!1),this.mvp}}function mt(d){return Math.max(0,Math.min(1,d))}function Qt(d){let e=1;for(;e<d;)e<<=1;return e}function dt(){return new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])}function Ee(d){return new Float32Array(d)}function le(d,e){const t=new Float32Array(16);for(let r=0;r<4;r++){const s=e[r*4],n=e[r*4+1],a=e[r*4+2],o=e[r*4+3];t[r*4]=d[0]*s+d[4]*n+d[8]*a+d[12]*o,t[r*4+1]=d[1]*s+d[5]*n+d[9]*a+d[13]*o,t[r*4+2]=d[2]*s+d[6]*n+d[10]*a+d[14]*o,t[r*4+3]=d[3]*s+d[7]*n+d[11]*a+d[15]*o}return t}function ke(d,e,t){return new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,d,e,t,1])}function qe(d,e,t){return new Float32Array([d,0,0,0,0,e,0,0,0,0,t,0,0,0,0,1])}function Ze(d,e,t,r){const s=Math.hypot(e,t,r);if(s<=0)return dt();const n=e/s,a=t/s,o=r/s,h=d*Math.PI/180,u=Math.cos(h),c=Math.sin(h),m=1-u;return new Float32Array([n*n*m+u,a*n*m+o*c,o*n*m-a*c,0,n*a*m-o*c,a*a*m+u,o*a*m+n*c,0,n*o*m+a*c,a*o*m-n*c,o*o*m+u,0,0,0,0,1])}function Ke(d,e,t,r,s,n){const a=e-d,o=r-t,h=n-s;return a===0||o===0||h===0||s===0?dt():new Float32Array([2*s/a,0,0,0,0,2*s/o,0,0,(e+d)/a,(r+t)/o,-(n+s)/h,-1,0,0,-2*n*s/h,0])}function Je(d,e,t,r,s,n){const a=e-d,o=r-t,h=n-s;return a===0||o===0||h===0?dt():new Float32Array([2/a,0,0,0,0,2/o,0,0,0,0,-2/h,0,-(e+d)/a,-(r+t)/o,-(n+s)/h,1])}function Qe(d,e,t,r,s,n,a,o,h){let u=r-d,c=s-e,m=n-t;const b=Math.hypot(u,c,m);if(b===0)return dt();u/=b,c/=b,m/=b;let g=c*h-m*o,T=m*a-u*h,S=u*o-c*a;const v=Math.hypot(g,T,S);if(v===0)return dt();g/=v,T/=v,S/=v;const P=T*m-S*c,O=S*u-g*m,G=g*c-T*u,U=new Float32Array([g,P,-u,0,T,O,-c,0,S,G,-m,0,0,0,0,1]);return le(U,ke(-d,-e,-t))}const p=class p{constructor(){i(this,"onWindowResize",null);i(this,"onVisualViewportResize",null)}initSDL(){if(typeof document<"u"){let e=document.getElementById("tt-screen-root");e||(e=document.createElement("div"),e.id="tt-screen-root",e.style.position="relative",e.style.display="inline-block",document.body.appendChild(e)),document.body.style.margin="0",document.body.style.overflow="hidden";let t=document.getElementById("tt-screen");t||(t=document.createElement("canvas"),t.id="tt-screen",t.style.display="block",e.appendChild(t)),t.width=p.width,t.height=p.height,t.style.width=`${p.width}px`,t.style.height=`${p.height}px`,p.canvas=t,p.gl=me.create(t);let r=document.getElementById("tt-screen-overlay");r||(r=document.createElement("canvas"),r.id="tt-screen-overlay",r.style.position="absolute",r.style.left="0",r.style.top="0",r.style.pointerEvents="none",e.appendChild(r)),r.width=p.width,r.height=p.height,r.style.width=`${p.width}px`,r.style.height=`${p.height}px`,p.overlayCanvas=r,p.ctx2d=r.getContext("2d")}typeof window<"u"&&p.autoResizeToWindow?(this.onWindowResize=()=>{const e=this.getViewportSize();this.resized(e.width,e.height)},window.addEventListener("resize",this.onWindowResize),window.visualViewport&&(this.onVisualViewportResize=()=>{const e=this.getViewportSize();this.resized(e.width,e.height)},window.visualViewport.addEventListener("resize",this.onVisualViewportResize),window.visualViewport.addEventListener("scroll",this.onVisualViewportResize)),this.onWindowResize()):this.resized(p.width,p.height),this.init()}screenResized(){}resized(e,t){var r;p.width=e,p.height=t,p.canvas&&(p.canvas.width=e,p.canvas.height=t,p.canvas.style.width=`${e}px`,p.canvas.style.height=`${t}px`),p.overlayCanvas&&(p.overlayCanvas.width=e,p.overlayCanvas.height=t,p.overlayCanvas.style.width=`${e}px`,p.overlayCanvas.style.height=`${t}px`),(r=p.gl)==null||r.resize(e,t),this.resetProjectionForResize(),this.screenResized()}resetProjectionForResize(){const e=p.nearPlane,t=p.farPlane,r=Math.max(1,p.width),s=Math.max(1,p.height),n=e*s/r,a=-n,o=-e,h=e;p.glMatrixMode(p.GL_PROJECTION),p.glLoadIdentity(),p.glFrustum(o,h,a,n,.1,t),p.glMatrixMode(p.GL_MODELVIEW)}closeSDL(){var e;typeof window<"u"&&this.onWindowResize&&(window.removeEventListener("resize",this.onWindowResize),this.onWindowResize=null),typeof window<"u"&&window.visualViewport&&this.onVisualViewportResize&&(window.visualViewport.removeEventListener("resize",this.onVisualViewportResize),window.visualViewport.removeEventListener("scroll",this.onVisualViewportResize),this.onVisualViewportResize=null),this.close(),(e=p.gl)==null||e.close(),p.gl=null,p.ctx2d=null,p.overlayCanvas=null,p.canvas=null}flip(){var e;(e=p.gl)==null||e.flush(),this.handleError()}clear(){var e;(e=p.gl)==null||e.clear(),p.ctx2d&&p.ctx2d.clearRect(0,0,p.width,p.height)}handleError(){}setCaption(e){typeof document<"u"&&(document.title=e)}getViewportSize(){if(typeof window>"u")return{width:p.width,height:p.height};const e=window.visualViewport;return e?{width:Math.max(1,Math.round(e.width)),height:Math.max(1,Math.round(e.height))}:{width:Math.max(1,window.innerWidth),height:Math.max(1,window.innerHeight)}}static setColor(e,t,r,s=1){p.drawColor=xe(e,t,r,s),p.captureOrRun(()=>{var n;(n=p.gl)==null||n.setDrawColor(e,t,r,s)})}static setClearColor(e,t,r,s=1){p.clearColor=xe(e,t,r,s),p.captureOrRun(()=>{var n;(n=p.gl)==null||n.setClearColor(e,t,r,s)})}static glVertex(e){p.glVertexXYZ(e.x,e.y,e.z)}static glVertexXYZ(e,t,r=0){p.captureOrRun(()=>{var s;(s=p.gl)==null||s.vertexXYZ(e,t,r)})}static glVertex3f(e,t,r){p.glVertexXYZ(e,t,r)}static glTranslate(e){p.glTranslatef(e.x,e.y,e.z)}static glTranslatef(e,t,r){p.captureOrRun(()=>{var s;(s=p.gl)==null||s.translateXYZ(e,t,r)})}static glScalef(e,t,r){p.captureOrRun(()=>{var s;(s=p.gl)==null||s.scaleXYZ(e,t,r)})}static glRotatef(e,t,r,s){p.captureOrRun(()=>{var n;(n=p.gl)==null||n.rotateDeg(e,t,r,s)})}static glBegin(e){const t=te(e);p.captureOrRun(()=>{var r;(r=p.gl)==null||r.begin(t)})}static glEnd(){p.captureOrRun(()=>{var e;(e=p.gl)==null||e.end()})}static glDrawArrays(e,t,r){const s=te(e);p.captureOrRun(()=>{var n;(n=p.gl)==null||n.drawArraysXYZC(s,t,r)})}static glCreateStaticMesh(e,t,r){var n;const s=te(e);return((n=p.gl)==null?void 0:n.createStaticMeshXYZC(s,t,r))??null}static glDrawStaticMesh(e){p.captureOrRun(()=>{var t;(t=p.gl)==null||t.drawStaticMesh(e)})}static glDeleteStaticMesh(e){p.captureOrRun(()=>{var t;(t=p.gl)==null||t.deleteStaticMesh(e)})}static glLoadIdentity(){p.captureOrRun(()=>{var e;(e=p.gl)==null||e.loadIdentity()})}static glPushMatrix(){p.captureOrRun(()=>{var e;(e=p.gl)==null||e.pushMatrix()})}static glPopMatrix(){p.captureOrRun(()=>{var e;(e=p.gl)==null||e.popMatrix()})}static glBlendAdditive(){p.captureOrRun(()=>{var e;(e=p.gl)==null||e.setBlendMode("additive")})}static glBlendAlpha(){p.captureOrRun(()=>{var e;(e=p.gl)==null||e.setBlendMode("alpha")})}static glPointSize(e){p.captureOrRun(()=>{var t;(t=p.gl)==null||t.setPointSize(e)})}static glEnable(e){p.captureOrRun(()=>{var t;(t=p.gl)==null||t.enable(e)})}static glDisable(e){p.captureOrRun(()=>{var t;(t=p.gl)==null||t.disable(e)})}static glBlendFunc(e,t){p.captureOrRun(()=>{var r,s;if(e===p.GL_SRC_ALPHA&&t===p.GL_ONE){(r=p.gl)==null||r.setBlendMode("additive");return}e===p.GL_SRC_ALPHA&&t===p.GL_ONE_MINUS_SRC_ALPHA&&((s=p.gl)==null||s.setBlendMode("alpha"))})}static glMatrixMode(e){p.captureOrRun(()=>{var t;(t=p.gl)==null||t.setMatrixMode(e)})}static glViewport(e,t,r,s){var n;(n=p.gl)==null||n.setViewport(r,s)}static glFrustum(e,t,r,s,n,a){p.captureOrRun(()=>{var o;(o=p.gl)==null||o.frustum(e,t,r,s,n,a)})}static glClear(e){var t;(e&p.GL_COLOR_BUFFER_BIT)!==0&&((t=p.gl)==null||t.clear())}static glLineWidth(e){}static glOrtho(e,t,r,s,n,a){p.captureOrRun(()=>{var o;(o=p.gl)==null||o.ortho(e,t,r,s,n,a)})}static glTexCoord2f(e,t){p.captureOrRun(()=>{var r;(r=p.gl)==null||r.texCoord2f(e,t)})}static gluLookAt(e,t,r,s,n,a,o,h,u){p.captureOrRun(()=>{var c;(c=p.gl)==null||c.lookAt(e,t,r,s,n,a,o,h,u)})}static beginDisplayListCapture(e){p.captureCommands=[],p.captureCommit=e}static endDisplayListCapture(){if(!p.captureCommands||!p.captureCommit){p.captureCommands=null,p.captureCommit=null;return}const e=p.captureCommands.slice();p.captureCommands=null;const t=p.captureCommit;p.captureCommit=null,t(e)}static captureOrRun(e){if(p.captureCommands){p.captureCommands.push(e);return}e()}};i(p,"GL_POINTS",0),i(p,"GL_LINES",1),i(p,"GL_LINE_LOOP",2),i(p,"GL_LINE_STRIP",3),i(p,"GL_TRIANGLES",4),i(p,"GL_TRIANGLE_STRIP",5),i(p,"GL_TRIANGLE_FAN",6),i(p,"GL_QUADS",7),i(p,"GL_BLEND",3042),i(p,"GL_DEPTH_TEST",2929),i(p,"GL_SRC_ALPHA",770),i(p,"GL_ONE",1),i(p,"GL_ONE_MINUS_SRC_ALPHA",771),i(p,"GL_LINE_SMOOTH",2848),i(p,"GL_COLOR_MATERIAL",2903),i(p,"GL_CULL_FACE",2884),i(p,"GL_LIGHTING",2896),i(p,"GL_TEXTURE_2D",3553),i(p,"GL_MODELVIEW",5888),i(p,"GL_PROJECTION",5889),i(p,"GL_COLOR_BUFFER_BIT",16384),i(p,"brightness",1),i(p,"width",640),i(p,"height",480),i(p,"windowMode",!1),i(p,"autoResizeToWindow",!0),i(p,"nearPlane",.1),i(p,"farPlane",1e3),i(p,"canvas",null),i(p,"overlayCanvas",null),i(p,"ctx2d",null),i(p,"gl",null),i(p,"clearColor","rgba(0, 0, 0, 1)"),i(p,"drawColor","rgba(255, 255, 255, 1)"),i(p,"captureCommands",null),i(p,"captureCommit",null);let l=p;function xe(d,e,t,r){const s=Math.max(0,Math.min(1,d)),n=Math.max(0,Math.min(1,e)),a=Math.max(0,Math.min(1,t)),o=Math.max(0,Math.min(1,r));return`rgba(${Math.round(s*255)}, ${Math.round(n*255)}, ${Math.round(a*255)}, ${o})`}function te(d){if(typeof d=="string")return d;switch(d){case l.GL_POINTS:return"points";case l.GL_LINES:return"lines";case l.GL_LINE_LOOP:return"lineLoop";case l.GL_LINE_STRIP:return"lineStrip";case l.GL_TRIANGLES:return"triangles";case l.GL_TRIANGLE_STRIP:return"triangleStrip";case l.GL_TRIANGLE_FAN:return"triangleFan";case l.GL_QUADS:return"quads";default:return"triangles"}}const Se=24;class tr{constructor(e,t,r,s){i(this,"INTERVAL_BASE",16);i(this,"interval",this.INTERVAL_BASE);i(this,"accframe",0);i(this,"maxSkipFrame",5);i(this,"event",{type:0});i(this,"screen");i(this,"input");i(this,"gameManager");i(this,"prefManager");i(this,"done",!1);i(this,"rafId",null);i(this,"running",!1);i(this,"finalized",!1);i(this,"lastTickMs",0);i(this,"accumulatorMs",0);i(this,"frameStats",new We);i(this,"lastStatsPublishMs",0);i(this,"lastStatsSnapshot",null);this.screen=e,this.input=t,r.setMainLoop(this),r.setUIs(e,t),r.setPrefManager(s),this.gameManager=r,this.prefManager=s}initFirst(){this.prefManager.load();try{z.init()}catch(e){if(e instanceof J)Rt.error(e);else throw e}this.gameManager.init()}quitLast(){this.gameManager.close(),z.close(),this.prefManager.save(),this.screen.closeSDL()}breakLoop(){this.done=!0,this.rafId!==null&&typeof cancelAnimationFrame=="function"&&(cancelAnimationFrame(this.rafId),this.rafId=null),this.running&&this.finalizeOnce(),this.running=!1}loop(){this.done=!1,this.running=!0,this.finalized=!1;const e=this.nowMs();if(this.frameStats.reset(e),this.lastStatsPublishMs=e,this.screen.initSDL(),this.initFirst(),this.gameManager.start(),typeof requestAnimationFrame=="function"){this.startBrowserLoop();return}this.startFallbackLoop()}startBrowserLoop(){this.accumulatorMs=0,this.lastTickMs=this.nowMs();const e=t=>{if(this.done)return;const r=t-this.lastTickMs;this.lastTickMs=t,this.accumulatorMs+=Math.max(0,r),this.input.handleEvent({type:Se});let s=0;for(;this.accumulatorMs>=this.interval&&s<this.maxSkipFrame;)this.gameManager.move(),this.accumulatorMs-=this.interval,s++;s>=this.maxSkipFrame&&this.accumulatorMs>=this.interval&&(this.accumulatorMs=0),this.screen.clear(),this.gameManager.draw(),this.drawOverlay(),this.screen.flip(),this.frameStats.recordFrame(r,s,t),this.publishStats(t),this.rafId=requestAnimationFrame(e)};this.rafId=requestAnimationFrame(e)}startFallbackLoop(){let e=0,t,r;for(;!this.done;){const s=this.nowMs();this.input.handleEvent({type:Se}),t=this.nowMs(),r=(t-e)/this.interval|0,r<=0?(r=1,e+this.interval-t,this.accframe?e=this.nowMs():e+=this.interval):r>this.maxSkipFrame?(r=this.maxSkipFrame,e=t):e+=r*this.interval;for(let a=0;a<r;a++)this.gameManager.move();this.screen.clear(),this.gameManager.draw(),this.drawOverlay(),this.screen.flip();const n=this.nowMs();this.frameStats.recordFrame(n-s,r,n),this.publishStats(n)}this.running=!1,this.finalizeOnce()}nowMs(){return typeof performance<"u"&&typeof performance.now=="function"?performance.now():Date.now()}finalizeOnce(){this.finalized||(this.finalized=!0,this.quitLast())}publishStats(e){if(typeof globalThis>"u"||(this.lastStatsSnapshot||(this.lastStatsSnapshot=this.frameStats.getSnapshot()),e-this.lastStatsPublishMs<1e3))return;this.lastStatsPublishMs=e;const t=globalThis;this.lastStatsSnapshot=this.frameStats.getSnapshot(),t.__ttFrameStats=this.lastStatsSnapshot}drawOverlay(){var r;const e=l.ctx2d;if(!e)return;e.clearRect(0,0,l.width,l.height);const t=this.input;(r=t.drawTouchGuide)==null||r.call(t,e,l.width,l.height),this.lastStatsSnapshot&&this.drawStatsOverlay(this.lastStatsSnapshot)}drawStatsOverlay(e){if(!globalThis.__ttShowFrameStats)return;const r=l.ctx2d;if(!r)return;const s=`FPS ${e.avgFps.toFixed(1)} / AVG ${e.avgFrameMs.toFixed(2)}ms / WORST ${e.worstFrameMs.toFixed(2)}ms / DROP ${e.droppedFrames}`;r.save(),r.globalCompositeOperation="source-over",r.fillStyle="rgba(0,0,0,0.55)",r.fillRect(8,8,Math.min(l.width-16,520),20),r.fillStyle="rgba(180,255,180,0.95)",r.font="12px monospace",r.textBaseline="top",r.fillText(s,12,12),r.restore()}}const V=1,_t=39,Ft=37,Yt=40,Gt=38,er=102,rr=100,ir=98,sr=104,nr=68,ar=65,lr=83,or=87,ee=90,hr=190,cr=17,Ut=88,dr=191,ur=18,pr=16,re=80,nt=class nt{constructor(){i(this,"keys",{});i(this,"buttonReversed",!1);i(this,"lastDirState",0);i(this,"lastButtonState",0);i(this,"stickIndex",-1);i(this,"JOYSTICK_AXIS",16384);i(this,"listenersBound",!1);i(this,"touchRoles",new Map);i(this,"touchMovePointerId",null);i(this,"touchMoveOriginX",0);i(this,"touchMoveOriginY",0);i(this,"touchMoveCurrentX",0);i(this,"touchMoveCurrentY",0);i(this,"touchGuideEnabled",!1);i(this,"touchFireToggled",!1)}openJoystick(){typeof window>"u"||(this.bindKeyboardListeners(),this.bindGamepadListeners(),this.bindTouchListeners(),this.touchGuideEnabled=this.detectTouchScreen())}handleEvent(e){this.refreshGamepad()}getDirState(){let e=0,t=0,r=0;const s=this.getActiveGamepad();return s&&(e=(s.axes[0]??0)*32767|0,t=(s.axes[1]??0)*32767|0),(this.keys[_t]===V||this.keys[er]===V||this.keys[nr]===V||e>this.JOYSTICK_AXIS)&&(r|=nt.Dir.RIGHT),(this.keys[Ft]===V||this.keys[rr]===V||this.keys[ar]===V||e<-this.JOYSTICK_AXIS)&&(r|=nt.Dir.LEFT),(this.keys[Yt]===V||this.keys[ir]===V||this.keys[lr]===V||t>this.JOYSTICK_AXIS)&&(r|=nt.Dir.DOWN),(this.keys[Gt]===V||this.keys[sr]===V||this.keys[or]===V||t<-this.JOYSTICK_AXIS)&&(r|=nt.Dir.UP),this.lastDirState=r,r}getButtonState(){var m,b,g,T,S,v,P,O;let e=0;const t=this.getActiveGamepad(),r=(m=t==null?void 0:t.buttons[0])!=null&&m.pressed?1:0,s=(b=t==null?void 0:t.buttons[1])!=null&&b.pressed?1:0,n=(g=t==null?void 0:t.buttons[2])!=null&&g.pressed?1:0,a=(T=t==null?void 0:t.buttons[3])!=null&&T.pressed?1:0,o=(S=t==null?void 0:t.buttons[4])!=null&&S.pressed?1:0,h=(v=t==null?void 0:t.buttons[5])!=null&&v.pressed?1:0,u=(P=t==null?void 0:t.buttons[6])!=null&&P.pressed?1:0,c=(O=t==null?void 0:t.buttons[7])!=null&&O.pressed?1:0;return(this.keys[ee]===V||this.keys[hr]===V||this.keys[cr]===V||r||a||o||c)&&(this.buttonReversed?e|=nt.Button.B:e|=nt.Button.A),(this.keys[Ut]===V||this.keys[dr]===V||this.keys[ur]===V||this.keys[pr]===V||s||n||h||u)&&(this.buttonReversed?e|=nt.Button.A:e|=nt.Button.B),this.lastButtonState=e,e}drawTouchGuide(e,t,r){if(!this.touchGuideEnabled)return;const s=this.getTouchGuideLayout(t,r);this.drawTouchCircle(e,s.move.x,s.move.y,s.move.radius,"MOVE"),this.drawTouchCircle(e,s.fire.x,s.fire.y,s.fire.radius,"SHOT"),this.drawTouchCircle(e,s.charge.x,s.charge.y,s.charge.radius,"CHARGE"),this.drawTouchCircle(e,s.pause.x,s.pause.y,s.pause.radius,"II")}bindKeyboardListeners(){this.listenersBound||typeof window>"u"||(this.listenersBound=!0,window.addEventListener("keydown",e=>{this.keys[e.keyCode]=V}),window.addEventListener("keyup",e=>{this.keys[e.keyCode]=0}),window.addEventListener("blur",()=>{this.keys={},this.clearTouchState()}))}bindGamepadListeners(){typeof window>"u"||(window.addEventListener("gamepadconnected",e=>{const t=e.gamepad;this.stickIndex<0&&(this.stickIndex=t.index)}),window.addEventListener("gamepaddisconnected",e=>{e.gamepad.index===this.stickIndex&&(this.stickIndex=-1)}),this.refreshGamepad())}bindTouchListeners(){if(typeof window>"u")return;const e=s=>{if(s.pointerType==="mouse")return;s.preventDefault();const n=this.resolveTouchRole(s.clientX,s.clientY);this.touchRoles.set(s.pointerId,n),n==="move"&&(this.touchMovePointerId=s.pointerId,this.touchMoveOriginX=s.clientX,this.touchMoveOriginY=s.clientY,this.touchMoveCurrentX=s.clientX,this.touchMoveCurrentY=s.clientY,this.updateTouchMoveKeys()),n==="fire"&&this.toggleTouchFire(),n==="charge"&&(this.keys[Ut]=V),n==="pause"&&(this.keys[re]=V)},t=s=>{s.pointerType==="mouse"||this.touchRoles.get(s.pointerId)!=="move"||this.touchMovePointerId!==s.pointerId||(s.preventDefault(),this.touchMoveCurrentX=s.clientX,this.touchMoveCurrentY=s.clientY,this.updateTouchMoveKeys())},r=s=>{s.pointerType!=="mouse"&&(s.preventDefault(),this.releaseTouchPointer(s.pointerId))};window.addEventListener("pointerdown",e,{passive:!1}),window.addEventListener("pointermove",t,{passive:!1}),window.addEventListener("pointerup",r,{passive:!1}),window.addEventListener("pointercancel",r,{passive:!1}),window.addEventListener("visibilitychange",()=>{document.visibilityState!=="visible"&&this.clearTouchState()})}detectTouchScreen(){return typeof window>"u"||typeof navigator>"u"?!1:!!(navigator.maxTouchPoints>0||"ontouchstart"in window||typeof window.matchMedia=="function"&&window.matchMedia("(pointer: coarse)").matches)}resolveTouchRole(e,t){if(typeof window>"u")return"fire";const r=Math.max(1,window.innerWidth),s=Math.max(1,window.innerHeight),n=this.getTouchGuideLayout(r,s);return this.isInsideCircle(e,t,n.pause.x,n.pause.y,n.pause.radius)?"pause":this.isInsideCircle(e,t,n.fire.x,n.fire.y,n.fire.radius)?"fire":this.isInsideCircle(e,t,n.charge.x,n.charge.y,n.charge.radius)?"charge":this.isInsideCircle(e,t,n.move.x,n.move.y,n.move.radius*1.35)||e<r*.5?"move":t<s*.5?"fire":"charge"}updateTouchMoveKeys(){const t=this.touchMoveCurrentX-this.touchMoveOriginX,r=this.touchMoveCurrentY-this.touchMoveOriginY;this.keys[Ft]=t<-24?V:0,this.keys[_t]=t>24?V:0,this.keys[Gt]=r<-24?V:0,this.keys[Yt]=r>24?V:0}releaseTouchPointer(e){const t=this.touchRoles.get(e);t&&(this.touchRoles.delete(e),t==="move"&&this.touchMovePointerId===e&&(this.touchMovePointerId=null,this.keys[Ft]=0,this.keys[_t]=0,this.keys[Gt]=0,this.keys[Yt]=0),t==="charge"&&!this.hasTouchRole("charge")&&(this.keys[Ut]=0),t==="pause"&&!this.hasTouchRole("pause")&&(this.keys[re]=0))}hasTouchRole(e){for(const t of this.touchRoles.values())if(t===e)return!0;return!1}clearTouchState(){this.touchRoles.clear(),this.touchMovePointerId=null,this.touchFireToggled=!1,this.keys[Ft]=0,this.keys[_t]=0,this.keys[Gt]=0,this.keys[Yt]=0,this.keys[ee]=0,this.keys[Ut]=0,this.keys[re]=0}toggleTouchFire(){this.touchFireToggled=!this.touchFireToggled,this.keys[ee]=this.touchFireToggled?V:0}getTouchGuideLayout(e,t){const r=Math.min(e,t),s=Math.max(36,r*.11),n=Math.max(30,r*.085),a=Math.max(20,r*.05);return{move:{x:e*.2,y:t*.64,radius:s},fire:{x:e*.86,y:t*.64,radius:n},charge:{x:e*.8,y:t*.82,radius:n},pause:{x:e*.92,y:t*.1,radius:a}}}isInsideCircle(e,t,r,s,n){const a=e-r,o=t-s;return a*a+o*o<=n*n}drawTouchCircle(e,t,r,s,n){e.save(),e.globalCompositeOperation="source-over",e.fillStyle="rgba(200, 245, 255, 0.09)",e.strokeStyle="rgba(210, 245, 255, 0.34)",e.lineWidth=Math.max(1.5,s*.06),e.beginPath(),e.arc(t,r,s,0,Math.PI*2),e.fill(),e.stroke(),e.fillStyle="rgba(210, 245, 255, 0.5)",e.font=`${Math.max(10,Math.round(s*.38))}px monospace`,e.textAlign="center",e.textBaseline="middle",e.fillText(n,t,r),e.restore()}refreshGamepad(){if(typeof navigator>"u"||typeof navigator.getGamepads!="function")return;const e=navigator.getGamepads();if(!(this.stickIndex>=0&&e[this.stickIndex])){this.stickIndex=-1;for(const t of e)if(t){this.stickIndex=t.index;break}}}getActiveGamepad(){if(typeof navigator>"u"||typeof navigator.getGamepads!="function")return null;const e=navigator.getGamepads();if(this.stickIndex>=0)return e[this.stickIndex]??null;for(const t of e)if(t)return t;return null}};i(nt,"Dir",{UP:1,DOWN:2,LEFT:4,RIGHT:8}),i(nt,"Button",{A:16,B:32,ANY:48});let tt=nt;class yt{constructor(){i(this,"_exists",!1)}get exists(){return this._exists}set exists(e){this._exists=e}}class Et{constructor(e,t=null,r){i(this,"actor",[]);i(this,"actorIdx",0);i(this,"factory");this.factory=r??(()=>{throw new Error("ActorPool factory is required in TypeScript port")}),typeof e=="number"&&this.createActors(e,t)}createActors(e,t=null){this.actor=[];for(let r=0;r<e;r++){const s=this.factory();s.exists=!1,s.init(t),this.actor.push(s)}this.actorIdx=0}getInstance(){for(let e=0;e<this.actor.length;e++)if(this.actorIdx--,this.actorIdx<0&&(this.actorIdx=this.actor.length-1),!this.actor[this.actorIdx].exists)return this.actor[this.actorIdx];return null}getInstanceForced(){return this.actorIdx--,this.actorIdx<0&&(this.actorIdx=this.actor.length-1),this.actor[this.actorIdx]}getMultipleInstances(e){const t=[];for(let r=0;r<e;r++){const s=this.getInstance();if(!s){for(const n of t)n.exists=!1;return null}s.exists=!0,t.push(s)}for(const r of t)r.exists=!1;return t}move(){for(const e of this.actor)e.exists&&e.move()}draw(){for(const e of this.actor)e.exists&&e.draw()}clear(){for(const e of this.actor)e.exists=!1;this.actorIdx=0}}class it{constructor(){oe(Date.now())}setSeed(e){oe(e)}nextInt32(){return $t()}nextInt(e){return e===0?0:$t()%e}nextSignedInt(e){return e===0?0:$t()%(e*2)-e}nextFloat(e){return Te()*e}nextSignedFloat(e){return Te()*(e*2)-e}}const ot=624,ft=397,mr=2567483615,fr=2147483648,br=2147483647;function gr(d,e){return(d&fr|e&br)>>>0}function ie(d,e){return(gr(d,e)>>>1^((e&1)!==0?mr:0))>>>0}const Z=new Uint32Array(ot);let fe=1,Ne=0,De=0;function oe(d){Z[0]=d>>>0;for(let e=1;e<ot;e++)Z[e]=Math.imul(1812433253,Z[e-1]^Z[e-1]>>>30)+e>>>0;fe=1,Ne=1}function wr(){Ne===0&&oe(5489),fe=ot,De=0;for(let e=ot-ft+1;e>0;e--){const t=ot-ft+1-e;Z[t]=(Z[t+ft]^ie(Z[t],Z[t+1]))>>>0}for(let e=ft;e>0;e--){const t=ot-ft+1+(ft-e);Z[t]=(Z[t+ft-ot]^ie(Z[t],Z[t+1]))>>>0}const d=ot-1;Z[d]=(Z[d+ft-ot]^ie(Z[d],Z[0]))>>>0}function $t(){--fe===0&&wr();let d=Z[De++];return d^=d>>>11,d^=d<<7&2636928640,d^=d<<15&4022730752,d^=d>>>18,d>>>0}function Te(){return $t()*(1/4294967295)}class yr{constructor(){i(this,"mainLoop");i(this,"abstScreen");i(this,"input");i(this,"abstPrefManager")}setMainLoop(e){this.mainLoop=e}setUIs(e,t){this.abstScreen=e,this.input=t}setPrefManager(e){this.abstPrefManager=e}}const Er=`<?xml version="1.0" ?>\r
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
`,Ki={bullet:0,action:1,fire:2,changeDirection:3,changeSpeed:4,accel:5,wait:6,repeat:7,bulletRef:8,actionRef:9,fireRef:10,vanish:11,horizontal:12,vertical:13,term:14,times:15,direction:16,speed:17,param:18,bulletml:19};function Ji(d){switch(d){case"aim":return 1;case"absolute":return 2;case"relative":return 3;case"sequence":return 4;case null:case"":return 0;default:throw new Error(`BulletML parser: unknown type ${d}.`)}}class Qi{constructor(e){i(this,"name");i(this,"type",0);i(this,"refID",-1);i(this,"parent",null);i(this,"children",[]);i(this,"formula",null);const t=Ki[e];if(t===void 0)throw new Error(`BulletML parser: unknown tag ${e}.`);this.name=t}setParent(e){this.parent=e}getParent(){return this.parent}addChild(e){e.setParent(this),this.children.push(e)}childSize(){return this.children.length}childBegin(){return this.children.length>0?this.children[0]:null}childList(){return this.children}setValue(e){this.formula=ns(e.trim())}getValue(e){return this.formula?this.formula(e):0}getChild(e){for(const t of this.children)if(t.name===e)return t;return null}getAllChildrenVec(e,t){for(const r of this.children)r.name===e&&t.push(r)}next(){const e=this.parent;if(!e)return null;const t=e.children.indexOf(this);return t<0||t+1>=e.children.length?null:e.children[t+1]}}class ts{constructor(e){i(this,"bulletml",null);i(this,"topActions",[]);i(this,"bulletMap",[]);i(this,"actionMap",[]);i(this,"fireMap",[]);i(this,"horizontal",!1);i(this,"name");this.name=e}parse(e){this.bulletml=null,this.topActions.length=0,this.bulletMap.length=0,this.actionMap.length=0,this.fireMap.length=0,this.horizontal=!1;const t={bullet:new Map,action:new Map,fire:new Map,bulletMax:0,actionMax:0,fireMax:0},r=new DOMParser().parseFromString(e,"application/xml"),s=r.querySelector("parsererror");if(s)throw new Error(`${this.name}: ${s.textContent??"xml parse error"}`);const n=r.documentElement;if(!n)throw new Error(`${this.name}: empty xml`);const a=(h,u)=>{const c=new Qi(es(h));if(c.name===19)this.bulletml=c,se(h,"type")==="horizontal"&&(this.horizontal=!0);else if(u)u.addChild(c);else throw new Error("<bulletml> doesn't come.");if(c.name!==19){const g=se(h,"type");c.type=Ji(g)}const m=se(h,"label");if(m){const g=rs(c.name),T=is(t,g,m);if(c.name===0)this.bulletMap[T]=c;else if(c.name===1)this.actionMap[T]=c;else if(c.name===2)this.fireMap[T]=c;else if(c.name===8||c.name===9||c.name===10)c.refID=T;else throw new Error(`he can't have attribute "label".`);c.name===1&&m.startsWith("top")&&this.topActions.push(c)}let b="";for(const g of Array.from(h.childNodes))g.nodeType===Node.ELEMENT_NODE?a(g,c):(g.nodeType===Node.TEXT_NODE||g.nodeType===Node.CDATA_SECTION_NODE)&&(b+=g.nodeValue??"");return b.trim().length>0&&c.setValue(b),c},o=a(n,null);if(o.name!==19)throw new Error("<bulletml> doesn't come.");if(this.bulletml=o,this.topActions.length===0)for(const h of o.childList())h.name===1&&this.topActions.push(h)}getTopActions(){return this.topActions}getBulletRef(e){const t=this.bulletMap[e]??null;if(!t)throw new Error("bulletRef key doesn't exist.");return t}getActionRef(e){const t=this.actionMap[e]??null;if(!t)throw new Error("actionRef key doesn't exist.");return t}getFireRef(e){const t=this.fireMap[e]??null;if(!t)throw new Error("fireRef key doesn't exist.");return t}isHorizontal(){return this.horizontal}}function es(d){const e=(d.localName&&d.localName.length>0?d.localName:d.tagName).trim(),t=e.indexOf(":");return t>=0?e.slice(t+1):e}function se(d,e){const t=d.getAttribute(e);if(t!==null)return t;for(const r of Array.from(d.attributes)){const s=(r.localName&&r.localName.length>0?r.localName:r.name).trim();if(s===e)return r.value;const n=s.indexOf(":");if(n>=0&&s.slice(n+1)===e)return r.value}return null}function rs(d){if(d===0||d===8)return"bullet";if(d===1||d===9)return"action";if(d===2||d===10)return"fire";throw new Error("invalid label domain")}function is(d,e,t){const r=d[e],s=r.get(t);if(s!==void 0)return s;const n=`${e}Max`,a=d[n];return d[n]++,r.set(t,a),a}class he{constructor(e,t,r){i(this,"bulletml");i(this,"node");i(this,"para");this.bulletml=e,this.node=t,this.para=r}createRunner(){return new Be(this)}}class At{constructor(e,t,r,s){i(this,"gradient");this.firstX=e,this.lastX=t,this.firstY=r,this.lastY=s;const n=this.lastX-this.firstX;this.gradient=n!==0?(this.lastY-this.firstY)/n:0}getValue(e){return this.firstY+this.gradient*(e-this.firstX)}isLast(e){return e>=this.lastX}getLast(){return this.lastY}}class ve{constructor(e,t){i(this,"act");i(this,"node");i(this,"actTurn",-1);i(this,"endTurn",0);i(this,"actIte",0);i(this,"end",!1);i(this,"spd",null);i(this,"dir",null);i(this,"prevSpd",null);i(this,"prevDir",null);i(this,"changeDir",null);i(this,"changeSpeed",null);i(this,"accelX",null);i(this,"accelY",null);i(this,"parameters");i(this,"repeatStack",[]);i(this,"refStack",[]);this.state=e,this.runner=t,this.node=[...e.node],this.parameters=e.para,this.act=this.node[0]??null;for(const r of this.node)r.setParent(null)}isEnd(){return this.end}run(){if(!this.isEnd()){if(this.applyChanges(),this.endTurn=this.runner.getTurn(),!this.act){this.isTurnEnd()||!this.changeDir&&!this.changeSpeed&&!this.accelX&&!this.accelY&&(this.end=!0);return}this.act=this.node[this.actIte]??null,this.actTurn===-1&&(this.actTurn=this.runner.getTurn()),this.runSub(),this.act?this.node[this.actIte]=this.act:(this.actIte++,this.act=this.node[this.actIte]??null)}}runSub(){var e,t;for(;this.act&&!this.isTurnEnd();){let r=this.act;if(this.dispatch(r),!this.act&&((e=r.getParent())==null?void 0:e.name)===19){const s=this.refStack.pop();if(!s)throw new Error("ref stack underflow");r=s.act,this.parameters=s.para}for(this.act||(this.act=r.next());!this.act;){const s=r.getParent();if((s==null?void 0:s.name)===7){const n=this.repeatStack[this.repeatStack.length-1];if(!n)throw new Error("repeat stack underflow");if(n.ite++,n.ite<n.end){this.act=n.act;break}this.repeatStack.pop()}if(this.act=r.getParent(),!this.act)break;if(r=this.act,((t=this.act.getParent())==null?void 0:t.name)===19){const n=this.refStack.pop();if(!n)throw new Error("ref stack underflow");r=n.act,this.act=n.act,this.parameters=n.para}this.act=this.act.next()}}}dispatch(e){switch(e.name){case 0:this.runBullet();return;case 1:this.runAction();return;case 2:this.runFire();return;case 3:this.runChangeDirection();return;case 4:this.runChangeSpeed();return;case 5:this.runAccel();return;case 6:this.runWait();return;case 7:this.runRepeat();return;case 8:this.runBulletRef();return;case 9:this.runActionRef();return;case 10:this.runFireRef();return;case 11:this.runVanish();return;default:this.act=null}}runBullet(){if(this.act){if(this.setSpeed(),this.setDirection(),this.spd==null&&(this.prevSpd=this.spd=this.runner.getDefaultSpeed()),this.dir==null&&(this.prevDir=this.dir=this.runner.getAimDirection()),!this.act.getChild(1)&&!this.act.getChild(9))this.runner.createSimpleBullet(this.dir,this.spd);else{const e=[];this.act.getAllChildrenVec(1,e),this.act.getAllChildrenVec(9,e),this.runner.createBullet(new he(this.state.bulletml,e,this.parameters),this.dir,this.spd)}this.act=null}}runFire(){if(!this.act)return;this.shotInit(),this.setSpeed(),this.setDirection();let e=this.act.getChild(0);if(e||(e=this.act.getChild(8)),!e)throw new Error("<fire> must have contents bullet or bulletRef");this.act=e}runAction(){this.act&&(this.act=this.act.childBegin())}runWait(){this.act&&(this.doWait(Math.trunc(this.getNumberContents(this.act))),this.act=null)}runRepeat(){if(!this.act)return;const e=this.act.getChild(15);if(!e)return;const t=Math.trunc(this.getNumberContents(e));let r=this.act.getChild(1);if(r||(r=this.act.getChild(9)),!r)throw new Error("repeat elem must have contents action or actionRef");this.repeatStack.push({ite:0,end:t,act:r}),this.act=r}runFireRef(){if(!this.act)return;const e=this.act,t=this.parameters;this.parameters=this.getParameters(),this.refStack.push({act:e,para:t}),this.act=this.state.bulletml.getFireRef(e.refID)}runActionRef(){if(!this.act)return;const e=this.act,t=this.parameters;this.parameters=this.getParameters(),this.refStack.push({act:e,para:t}),this.act=this.state.bulletml.getActionRef(e.refID)}runBulletRef(){if(!this.act)return;const e=this.act,t=this.parameters;this.parameters=this.getParameters(),this.refStack.push({act:e,para:t}),this.act=this.state.bulletml.getBulletRef(e.refID)}runChangeDirection(){if(!this.act)return;const e=this.act.getChild(14),t=this.act.getChild(16);if(!e||!t){this.act=null;return}const r=Math.trunc(this.getNumberContents(e)),s=t.type,n=s!==4?this.getDirection(t,!1):this.getNumberContents(t);this.calcChangeDirection(n,r,s===4),this.act=null}runChangeSpeed(){if(!this.act)return;const e=this.act.getChild(14),t=this.act.getChild(17);if(!e||!t){this.act=null;return}const r=Math.trunc(this.getNumberContents(e));let s;t.type!==4?s=this.getSpeed(t):s=this.getNumberContents(t)*r+this.runner.getBulletSpeed(),this.calcChangeSpeed(s,r),this.act=null}runAccel(){if(!this.act)return;const e=this.act.getChild(14);if(!e){this.act=null;return}const t=Math.trunc(this.getNumberContents(e)),r=this.act.getChild(12),s=this.act.getChild(13);this.state.bulletml.isHorizontal()?(s&&this.calcAccelX(this.getNumberContents(s),t,s.type),r&&this.calcAccelY(-this.getNumberContents(r),t,r.type)):(r&&this.calcAccelX(this.getNumberContents(r),t,r.type),s&&this.calcAccelY(this.getNumberContents(s),t,s.type)),this.act=null}runVanish(){this.runner.doVanish(),this.act=null}applyChanges(){const e=this.runner.getTurn();this.changeDir&&(this.changeDir.isLast(e)?(this.runner.doChangeDirection(this.changeDir.getLast()),this.changeDir=null):this.runner.doChangeDirection(this.changeDir.getValue(e))),this.changeSpeed&&(this.changeSpeed.isLast(e)?(this.runner.doChangeSpeed(this.changeSpeed.getLast()),this.changeSpeed=null):this.runner.doChangeSpeed(this.changeSpeed.getValue(e))),this.accelX&&(this.accelX.isLast(e)?(this.runner.doAccelX(this.accelX.getLast()),this.accelX=null):this.runner.doAccelX(this.accelX.getValue(e))),this.accelY&&(this.accelY.isLast(e)?(this.runner.doAccelY(this.accelY.getLast()),this.accelY=null):this.runner.doAccelY(this.accelY.getValue(e)))}isTurnEnd(){return this.end||this.actTurn>this.endTurn}doWait(e){e<=0||(this.actTurn+=e)}shotInit(){this.spd=null,this.dir=null}setSpeed(){if(!this.act)return;const e=this.act.getChild(17);e&&(this.spd=this.getSpeed(e))}setDirection(){if(!this.act)return;const e=this.act.getChild(16);e&&(this.dir=this.getDirection(e,!0))}getNumberContents(e){return e.getValue({rank:this.runner.getRank(),parameters:this.parameters,runner:this.runner})}getSpeed(e){let t=this.getNumberContents(e);return e.type===3?t+=this.runner.getBulletSpeed():e.type===4&&(this.prevSpd==null?t=1:t+=this.prevSpd),this.prevSpd=t,t}getDirection(e,t){let r=this.getNumberContents(e),s=!0;for(e.type!==0&&(s=!1,e.type===2?this.state.bulletml.isHorizontal()&&(r-=90):e.type===3?r+=this.runner.getBulletDirection():e.type===4?this.prevDir==null?(r=0,s=!0):r+=this.prevDir:s=!0),s&&(r+=this.runner.getAimDirection());r>360;)r-=360;for(;r<0;)r+=360;return t&&(this.prevDir=r),r}calcChangeDirection(e,t,r){const s=this.actTurn+t,n=this.runner.getBulletDirection();if(r){this.changeDir=new At(this.actTurn,s,n,n+e*t);return}const a=e-n,o=a>0?a-360:a+360,h=Math.abs(a)<Math.abs(o)?a:o;this.changeDir=new At(this.actTurn,s,n,n+h)}calcChangeSpeed(e,t){const r=this.actTurn+t,s=this.runner.getBulletSpeed();this.changeSpeed=new At(this.actTurn,r,s,e)}calcAccelX(e,t,r){const s=this.actTurn+t,n=this.runner.getBulletSpeedX();let a;r===4?a=n+e*t:r===3?a=n+e:a=e,this.accelX=new At(this.actTurn,s,n,a)}calcAccelY(e,t,r){const s=this.actTurn+t,n=this.runner.getBulletSpeedY();let a;r===4?a=n+e*t:r===3?a=n+e:a=e,this.accelY=new At(this.actTurn,s,n,a)}getParameters(){if(!this.act)return null;let e=null;for(const t of this.act.childList())t.name===18&&(e||(e=[0]),e.push(this.getNumberContents(t)));return e}}class Be{constructor(e){i(this,"callbacks",{});i(this,"end",!1);i(this,"impl",[]);if(e instanceof he){this.impl.push(new ve(e,this));return}for(const t of e.getTopActions())this.impl.push(new ve(new he(e,[t],null),this))}run(){if(!this.end)for(const e of this.impl)e.run()}isEnd(){if(this.end)return!0;for(const e of this.impl)if(!e.isEnd())return!1;return this.impl.length>0}getBulletDirection(){return this.callNumber("getBulletDirection",0)}getAimDirection(){return this.callNumber("getAimDirection",0)}getBulletSpeed(){return this.callNumber("getBulletSpeed",0)}getDefaultSpeed(){return this.callNumber("getDefaultSpeed",1)}getRank(){return this.callNumber("getRank",0)}createSimpleBullet(e,t){this.callVoid("createSimpleBullet",e,t)}createBullet(e,t,r){this.callVoid("createBullet",e,t,r)}getTurn(){return Math.trunc(this.callNumber("getTurn",0))}doVanish(){this.callVoid("doVanish")}doChangeDirection(e){this.callVoid("doChangeDirection",e)}doChangeSpeed(e){this.callVoid("doChangeSpeed",e)}doAccelX(e){this.callVoid("doAccelX",e)}doAccelY(e){this.callVoid("doAccelY",e)}getBulletSpeedX(){return this.callNumber("getBulletSpeedX",0)}getBulletSpeedY(){return this.callNumber("getBulletSpeedY",0)}getRand(){return this.callNumber("getRand",Math.random())}callNumber(e,t){const r=this.callbacks[e];if(!r)return t;const s=r(this);return typeof s=="number"&&Number.isFinite(s)?s:t}callVoid(e,...t){const r=this.callbacks[e];r&&r(this,...t)}}class ss{constructor(e,t,r=null){i(this,"name");i(this,"url");i(this,"inlineXmlText");i(this,"parser",null);i(this,"preloadPromise",null);this.name=e,this.url=t,this.inlineXmlText=r}async preload(){this.parser||(this.preloadPromise||(this.preloadPromise=(async()=>{let e=this.inlineXmlText;if(e==null){const r=await fetch(this.url);if(!r.ok)throw new Error(`Unable to load BulletML: ${this.url}`);e=await r.text()}const t=new ts(this.name);t.parse(e),this.parser=t})()),await this.preloadPromise)}createRunner(){if(!this.parser)throw new Error(`BulletML parser is not loaded yet: ${this.name}`);return new Be(this.parser)}}function ns(d){const e=as(d);let t=0;function r(){const o=e[t++];if(!o)return()=>0;if(o.type==="num"){const h=o.value;return()=>h}if(o.type==="var"){if(o.value==="rand")return u=>u.runner.getRand();if(o.value==="rank")return u=>u.rank;const h=Number.parseInt(o.value,10);return u=>!Number.isFinite(h)||!u.parameters||h<0||h>=u.parameters.length?1:u.parameters[h]}if(o.type==="op"&&o.value==="("){const h=n(),u=e[t++];if(!u||u.type!=="op"||u.value!==")")throw new Error("formula: missing ')' ");return h}if(o.type==="op"&&o.value==="-"){const h=r();return u=>-h(u)}throw new Error(`formula: invalid token ${o.value}`)}function s(){let o=r();for(;t<e.length;){const h=e[t];if(!h||h.type!=="op"||h.value!=="*"&&h.value!=="/")break;t++;const u=r(),c=o;h.value==="*"?o=m=>c(m)*u(m):o=m=>c(m)/u(m)}return o}function n(){let o=s();for(;t<e.length;){const h=e[t];if(!h||h.type!=="op"||h.value!=="+"&&h.value!=="-")break;t++;const u=s(),c=o;h.value==="+"?o=m=>c(m)+u(m):o=m=>c(m)-u(m)}return o}if(e.length===0)return()=>0;const a=n();if(t<e.length)throw new Error(`formula: trailing token ${e[t].value}`);return a}function as(d){const e=[];let t=0;for(;t<d.length;){const r=d[t];if(r===" "||r==="	"||r===`
`||r==="\r"){t++;continue}if(r>="0"&&r<="9"||r==="."){let s=t+1;for(;s<d.length;){const n=d[s];if(n>="0"&&n<="9"||n===".")s++;else break}e.push({type:"num",value:Number.parseFloat(d.slice(t,s))}),t=s;continue}if(r==="$"){let s=t+1;for(;s<d.length;){const a=d[s];if(a>="a"&&a<="z"||a>="A"&&a<="Z"||a>="0"&&a<="9"||a==="_")s++;else break}const n=d.slice(t+1,s);e.push({type:"var",value:n}),t=s;continue}if("+-*/()".includes(r)){e.push({type:"op",value:r}),t++;continue}throw new Error(`formula: unsupported character '${r}'`)}return e}class F{constructor(){i(this,"BARRAGE_TYPE",13);i(this,"BARRAGE_MAX",64);i(this,"parser");i(this,"parserNum");i(this,"dirName",["morph","small","smallmove","smallsidemove","middle","middlesub","middlemove","middlebackmove","large","largemove","morph_lock","small_lock","middlesub_lock"]);this.parser=Array.from({length:this.BARRAGE_TYPE},()=>Array(this.BARRAGE_MAX).fill(null)),this.parserNum=Array(this.BARRAGE_TYPE).fill(0)}async loadBulletMLs(){const e=this.collectXmlTextByDir();for(let t=0;t<this.BARRAGE_TYPE;t++){const r=this.dirName[t],s=e.get(r)??[];let n=0;for(const a of s){if(n>=this.BARRAGE_MAX)break;const o=`${r}/${a.name}`;Rt.info(`Load BulletML: ${o}`);const h=new ss(o,"",a.xmlText);try{await h.preload(),this.parser[t][n]=h,n++}catch(u){const c=u instanceof Error?u.message:String(u);Rt.error(`Failed to load BulletML: ${o} (${c})`)}}this.parserNum[t]=n}}unloadBulletMLs(){for(let e=0;e<this.BARRAGE_TYPE;e++){for(let t=0;t<this.parserNum[e];t++)this.parser[e][t]=null;this.parserNum[e]=0}}collectXmlTextByDir(){const e=Object.assign({"../../../large/57way.xml":Er,"../../../large/88way.xml":xr,"../../../large/allround.xml":Sr,"../../../large/dr1_boss_1.xml":Tr,"../../../large/dr1_boss_2.xml":vr,"../../../large/forward_3way.xml":Rr,"../../../large/grow.xml":Lr,"../../../large/growround.xml":Ar,"../../../large/kr4_boss_rb_rockets.xml":Mr,"../../../large/mnway.xml":Cr,"../../../large/nway.xml":Pr,"../../../large/pxa_boss_opening.xml":Ir,"../../../large/spread2blt.xml":kr,"../../../large/wide_spread.xml":Nr,"../../../largemove/down.xml":Dr,"../../../largemove/down_slow.xml":Br,"../../../middle/2round.xml":Or,"../../../middle/4way.xml":_r,"../../../middle/double_roll_seeds.xml":Fr,"../../../middle/dr1_boss_3.xml":Yr,"../../../middle/kr3_boss_fastspread.xml":Gr,"../../../middle/nwroll.xml":Ur,"../../../middle/roll2way.xml":Vr,"../../../middle/roll4way.xml":$r,"../../../middle/shotgun.xml":Hr,"../../../middle/spread_bf.xml":zr,"../../../middlebackmove/up.xml":Xr,"../../../middlemove/back.xml":jr,"../../../middlemove/curve.xml":Wr,"../../../middlemove/down.xml":qr,"../../../middlemove/down_fast.xml":Zr,"../../../middlemove/down_slow.xml":Kr,"../../../middlesub/shot.xml":Jr,"../../../middlesub_lock/shot.xml":Qr,"../../../morph/248shot.xml":ti,"../../../morph/3way.xml":ei,"../../../morph/6gt.xml":ri,"../../../morph/accel.xml":ii,"../../../morph/bar.xml":si,"../../../morph/divide.xml":ni,"../../../morph/fire_slowshot.xml":ai,"../../../morph/kr1b_bit_shot.xml":li,"../../../morph/nway.xml":oi,"../../../morph/side_back_shot.xml":hi,"../../../morph/sideway.xml":ci,"../../../morph/slowdown.xml":di,"../../../morph/spread.xml":ui,"../../../morph/twin.xml":pi,"../../../morph/wide.xml":mi,"../../../morph_lock/248shot.xml":fi,"../../../morph_lock/3way.xml":bi,"../../../morph_lock/6gt.xml":gi,"../../../morph_lock/accel.xml":wi,"../../../morph_lock/bar.xml":yi,"../../../morph_lock/divide.xml":Ei,"../../../morph_lock/fire_slowshot.xml":xi,"../../../morph_lock/kr1b_bit_shot.xml":Si,"../../../morph_lock/nway.xml":Ti,"../../../morph_lock/side_back_shot.xml":vi,"../../../morph_lock/sideway.xml":Ri,"../../../morph_lock/slowdown.xml":Li,"../../../morph_lock/spread.xml":Ai,"../../../morph_lock/twin.xml":Mi,"../../../morph_lock/wide.xml":Ci,"../../../small/shot.xml":Pi,"../../../small_lock/shot.xml":Ii,"../../../smallmove/248shot.xml":ki,"../../../smallmove/3waychase.xml":Ni,"../../../smallmove/6gt.xml":Di,"../../../smallmove/accel.xml":Bi,"../../../smallmove/accum.xml":Oi,"../../../smallmove/bar.xml":_i,"../../../smallmove/bit_move.xml":Fi,"../../../smallmove/ikr5_vrp.xml":Yi,"../../../smallmove/kr1_boss_bit.xml":Gi,"../../../smallmove/nway.xml":Ui,"../../../smallmove/rndway.xml":Vi,"../../../smallmove/slowdown.xml":$i,"../../../smallmove/spread.xml":Hi,"../../../smallmove/twin.xml":zi,"../../../smallmove/twin_extend.xml":Xi,"../../../smallsidemove/3waychase.xml":ji,"../../../smallsidemove/downaccel.xml":Wi,"../../../smallsidemove/straight.xml":qi,"../../../smallsidemove/upaccel.xml":Zi}),t=new Map;for(const[r,s]of Object.entries(e)){const n=r.match(/\/([^/]+)\/([^/]+\.xml)$/);if(!n)continue;const a=n[1],o=n[2],h=t.get(a);h?h.push({name:o,xmlText:s}):t.set(a,[{name:o,xmlText:s}])}for(const r of t.values())r.sort((s,n)=>s.name.localeCompare(n.name));return t}}i(F,"MORPH",0),i(F,"SMALL",1),i(F,"SMALLMOVE",2),i(F,"SMALLSIDEMOVE",3),i(F,"MIDDLE",4),i(F,"MIDDLESUB",5),i(F,"MIDDLEMOVE",6),i(F,"MIDDLEBACKMOVE",7),i(F,"LARGE",8),i(F,"LARGEMOVE",9),i(F,"MORPH_LOCK",10),i(F,"SMALL_LOCK",11),i(F,"MIDDLESUB_LOCK",12);class R{constructor(e=0,t=0){i(this,"x");i(this,"y");this.x=e,this.y=t}opMul(e){return this.x*e.x+this.y*e.y}getElement(e){const t=new R,r=e.opMul(e);if(r!==0){const s=this.opMul(e);t.x=s*e.x/r,t.y=s*e.y/r}else t.x=0,t.y=0;return t}opAddAssign(e){this.x+=e.x,this.y+=e.y}opSubAssign(e){this.x-=e.x,this.y-=e.y}opMulAssign(e){this.x*=e,this.y*=e}opDivAssign(e){this.x/=e,this.y/=e}checkSide(e,t,r){const s=t.x-e.x,n=t.y-e.y,a=r?this.x+r.x:this.x,o=r?this.y+r.y:this.y;return s===0?n===0?0:n>0?a-e.x:e.x-a:n===0?s>0?e.y-o:o-e.y:s*n>0?(a-e.x)/s-(o-e.y)/n:-(a-e.x)/s+(o-e.y)/n}checkCross(e,t,r,s){let n,a,o,h;this.x<e.x?(n=this.x-s,o=e.x+s):(n=e.x-s,o=this.x+s),this.y<e.y?(a=this.y-s,h=e.y+s):(a=e.y-s,h=this.y+s);let u,c,m,b;if(r.y<t.y?(c=r.y-s,b=t.y+s):(c=t.y-s,b=r.y+s),h>=c&&b>=a&&(r.x<t.x?(u=r.x-s,m=t.x+s):(u=t.x-s,m=r.x+s),o>=u&&m>=n)){const g=this.y-e.y,T=e.x-this.x,S=e.x*this.y-e.y*this.x,v=r.y-t.y,P=t.x-r.x,O=t.x*r.y-t.y*r.x,G=T*v-g*P;if(G!==0){const U=(T*O-S*P)/G,Q=(S*v-g*O)/G;if(n<=U&&U<=o&&a<=Q&&Q<=h&&u<=U&&U<=m&&c<=Q&&Q<=b)return!0}}return!1}checkHitDist(e,t,r){let s=t.x-e.x,n=t.y-e.y;const a=s*s+n*n;if(a>1e-5){const o=this.x-e.x,h=this.y-e.y,u=s*o+n*h;if(u>=0&&u<=a){const c=o*o+h*h-u*u/a;if(c>=0&&c<=r)return!0}}return!1}size(){return Math.sqrt(this.x*this.x+this.y*this.y)}dist(e){const t=Math.abs(this.x-e.x),r=Math.abs(this.y-e.y);return t>r?t+r/2:r+t/2}toString(){return`(${this.x}, ${this.y})`}}const q=class q{constructor(e){i(this,"pos");i(this,"acc");i(this,"deg",0);i(this,"speed",0);i(this,"id");i(this,"runner",null);i(this,"_rank",0);this.pos=new R,this.acc=new R,this.id=e}static setRandSeed(e){q.rand.setSeed(e)}static setBulletsManager(e){q.manager=e,q.target=new R,q.target.x=0,q.target.y=0}static getRand(){return q.rand.nextFloat(1)}static addBullet(e,t,r){if(typeof e=="number"){q.manager.addSimpleBullet(e,t);return}q.manager.addStateBullet(e,t,r??0)}static getTurn(){return q.manager.getTurn()}set(e,t,r,s,n){this.pos.x=e,this.pos.y=t,this.acc.x=0,this.acc.y=0,this.deg=r,this.speed=s,this.rank=n,this.runner=null}setRunner(e){this.runner=e}setWithRunner(e,t,r,s,n,a){this.set(t,r,s,n,a),this.setRunner(e)}move(){q.now=this,this.runner&&!Re(this.runner)&&Ts(this.runner)}isEnd(){return this.runner?Re(this.runner):!0}kill(){q.manager.killMe(this)}remove(){this.runner&&(vs(this.runner),this.runner=null)}get rank(){return this._rank}set rank(e){this._rank=e}};i(q,"now"),i(q,"target"),i(q,"rand",new it),i(q,"manager");let _=q;const ls=62/10,Nt=10/62;function Oe(d){return d*180/Math.PI}function be(d){return d*Math.PI/180}function os(d){return Oe(_.now.deg)}function hs(d){return _.now.speed*ls}function cs(d){return 1}function ds(d){return _.now.rank}function us(d,e,t){_.addBullet(be(e),t*Nt)}function ps(d,e,t,r){_.addBullet(e,be(t),r*Nt)}function ms(d){return _.getTurn()}function fs(d){_.now.kill()}function bs(d,e){_.now.deg=be(e)}function gs(d,e){_.now.speed=e*Nt}function ws(d,e){_.now.acc.x=e*Nt}function ys(d,e){_.now.acc.y=e*Nt}function Es(d){return _.now.acc.x}function xs(d){return _.now.acc.y}function Ss(d){return _.getRand()}function Re(d){return d?typeof d.isEnd=="function"?d.isEnd():!!d.end||!!d.finished:!0}function Ts(d){if(typeof d.run=="function"){d.run();return}typeof d.update=="function"&&d.update()}function vs(d){typeof d.dispose=="function"&&d.dispose(),typeof d.close=="function"&&d.close(),d.end=!0}class Kt{constructor(e){i(this,"num");i(this,"idx");i(this,"enumIdx");i(this,"lists");i(this,"draft",null);this.num=e,this.idx=0,this.enumIdx=this.idx,this.lists=Array.from({length:e},()=>null)}beginNewList(){this.resetList(),this.newList()}nextNewList(){if(this.endList(),this.enumIdx>=this.idx+this.num||this.enumIdx<this.idx)throw new pe("Can't create new list. Index out of bound.");this.newList()}endNewList(){this.endList()}resetList(){this.enumIdx=this.idx}newList(){this.draft=null,l.beginDisplayListCapture(e=>{this.setCurrentCommands(e)})}endList(){l.endDisplayListCapture();const e=this.enumIdx-this.idx;e>=0&&e<this.lists.length&&(this.lists[e]=this.draft),this.enumIdx++}call(e){const t=this.lists[e];t&&t()}setCurrentList(e){this.draft=e}setCurrentCommands(e){this.draft=()=>{for(let t=0;t<e.length;t++)e[t]()}}close(){this.lists.fill(null),this.draft=null}}class Rs{constructor(){i(this,"renderTarget",null);i(this,"LUMINOUS_TEXTURE_WIDTH_MAX",64);i(this,"LUMINOUS_TEXTURE_HEIGHT_MAX",64);i(this,"luminousTextureWidth",64);i(this,"luminousTextureHeight",64);i(this,"screenWidth",0);i(this,"screenHeight",0);i(this,"luminous",0);i(this,"renderingToTexture",!1);i(this,"lmOfs",[[0,0],[1,0],[-1,0],[0,1],[0,-1]]);i(this,"lmOfsBs",5)}makeLuminousTexture(){const e=l.gl;if(!e){this.renderTarget=null;return}this.renderTarget&&(e.deleteRenderTarget(this.renderTarget),this.renderTarget=null),this.renderTarget=e.createRenderTarget(this.luminousTextureWidth,this.luminousTextureHeight)}init(e,t,r){this.makeLuminousTexture(),this.luminous=e,this.resized(t,r)}resized(e,t){this.screenWidth=e,this.screenHeight=t}close(){var e;this.renderTarget&&((e=l.gl)==null||e.deleteRenderTarget(this.renderTarget),this.renderTarget=null),this.renderingToTexture=!1}startRenderToTexture(){var e;this.renderTarget&&((e=l.gl)==null||e.beginRenderTarget(this.renderTarget),this.renderingToTexture=!0,l.glClear(l.GL_COLOR_BUFFER_BIT))}endRenderToTexture(){var e;this.renderingToTexture&&((e=l.gl)==null||e.endRenderTarget(),this.renderingToTexture=!1)}startRender(){this.startRenderToTexture()}endRender(){this.endRenderToTexture()}viewOrtho(){l.glMatrixMode(l.GL_PROJECTION),l.glPushMatrix(),l.glLoadIdentity(),l.glOrtho(0,this.screenWidth,this.screenHeight,0,-1,1),l.glMatrixMode(l.GL_MODELVIEW),l.glPushMatrix(),l.glLoadIdentity()}viewPerspective(){l.glMatrixMode(l.GL_PROJECTION),l.glPopMatrix(),l.glMatrixMode(l.GL_MODELVIEW),l.glPopMatrix()}draw(){var e;if(this.renderTarget){l.glEnable(l.GL_TEXTURE_2D),(e=l.gl)==null||e.bindTexture(this.renderTarget.texture),this.viewOrtho(),l.setColor(1,.8,.9,this.luminous),l.glBegin(l.GL_QUADS);for(let t=0;t<5;t++)l.glTexCoord2f(0,1),l.glVertex3f(0+this.lmOfs[t][0]*this.lmOfsBs,0+this.lmOfs[t][1]*this.lmOfsBs,0),l.glTexCoord2f(0,0),l.glVertex3f(0+this.lmOfs[t][0]*this.lmOfsBs,this.screenHeight+this.lmOfs[t][1]*this.lmOfsBs,0),l.glTexCoord2f(1,0),l.glVertex3f(this.screenWidth+this.lmOfs[t][0]*this.lmOfsBs,this.screenHeight+this.lmOfs[t][0]*this.lmOfsBs,0),l.glTexCoord2f(1,1),l.glVertex3f(this.screenWidth+this.lmOfs[t][0]*this.lmOfsBs,0+this.lmOfs[t][0]*this.lmOfsBs,0);l.glEnd(),this.viewPerspective(),l.glDisable(l.GL_TEXTURE_2D)}}}const k=class k extends l{constructor(){super(...arguments);i(this,"luminousScreen",null)}init(){this.setCaption(k.CAPTION),l.glEnable(l.GL_LINE_SMOOTH),l.glBlendFunc(l.GL_SRC_ALPHA,l.GL_ONE),l.glEnable(l.GL_BLEND),l.glDisable(l.GL_LIGHTING),l.glDisable(l.GL_CULL_FACE),l.glDisable(l.GL_DEPTH_TEST),l.glDisable(l.GL_TEXTURE_2D),l.glDisable(l.GL_COLOR_MATERIAL),k.rand=new it,k.luminous>0?(this.luminousScreen=new Rs,this.luminousScreen.init(k.luminous,l.width,l.height)):this.luminousScreen=null}close(){var t;(t=this.luminousScreen)==null||t.close()}startRenderToTexture(){var t;(t=this.luminousScreen)==null||t.startRenderToTexture()}endRenderToTexture(){var t;(t=this.luminousScreen)==null||t.endRenderToTexture()}drawLuminous(){var t;(t=this.luminousScreen)==null||t.draw()}resized(t,r){var s;(s=this.luminousScreen)==null||s.resized(t,r),super.resized(t,r)}viewOrthoFixed(){l.glMatrixMode(l.GL_PROJECTION),l.glPushMatrix(),l.glLoadIdentity(),l.glOrtho(0,640,480,0,-1,1),l.glMatrixMode(l.GL_MODELVIEW),l.glPushMatrix(),l.glLoadIdentity()}viewPerspective(){l.glMatrixMode(l.GL_PROJECTION),l.glPopMatrix(),l.glMatrixMode(l.GL_MODELVIEW),l.glPopMatrix()}static setRetroParam(t,r){k.retro=t,k.retroSize=r}static setRetroColor(t,r,s,n){k.retroR=t,k.retroG=r,k.retroB=s,k.retroA=n}static setRetroZ(t){k.retroZ=t}static drawLineRetro(t,r,s,n){const a=(1-k.retro)*.5;let o=k.retroR+(1-k.retroR)*a,h=k.retroG+(1-k.retroG)*a,u=k.retroB+(1-k.retroB)*a,c=k.retroA*(a+.5);if(k.rand.nextInt(7)===0&&(o=Math.min(o*1.5,1),h=Math.min(h*1.5,1),u=Math.min(u*1.5,1),c=Math.min(c*1.5,1)),l.setColor(o,h,u,c),k.retro<.2){l.glBegin(l.GL_LINES),l.glVertex3f(t,r,k.retroZ),l.glVertex3f(s,n,k.retroZ),l.glEnd();return}const m=k.retroSize*k.retro,b=m/2,g=Math.abs(s-t),T=Math.abs(n-r);if(l.glBegin(l.GL_QUADS),g<T){const S=Math.floor(T/m);if(S>0){const v=(s-t)/S;let P=0;const O=n<r?-m:m;let G=t,U=r;for(let Q=0;Q<=S;Q++,P+=v,U+=O)P>=m?(G+=m,P-=m):P<=-m&&(G-=m,P+=m),l.glVertex3f(G-b,U-b,k.retroZ),l.glVertex3f(G+b,U-b,k.retroZ),l.glVertex3f(G+b,U+b,k.retroZ),l.glVertex3f(G-b,U+b,k.retroZ)}}else{const S=Math.floor(g/m);if(S>0){const v=(n-r)/S;let P=0;const O=s<t?-m:m;let G=t,U=r;for(let Q=0;Q<=S;Q++,G+=O,P+=v)P>=m?(U+=m,P-=m):P<=-m&&(U-=m,P+=m),l.glVertex3f(G-b,U-b,k.retroZ),l.glVertex3f(G+b,U-b,k.retroZ),l.glVertex3f(G+b,U+b,k.retroZ),l.glVertex3f(G-b,U+b,k.retroZ)}}l.glEnd()}static drawBoxRetro(t,r,s,n,a){const o=s*Math.cos(a)-n*Math.sin(a),h=s*Math.sin(a)+n*Math.cos(a),u=-s*Math.cos(a)-n*Math.sin(a),c=-s*Math.sin(a)+n*Math.cos(a);k.drawLineRetro(t+u,r-c,t+o,r-h),k.drawLineRetro(t+o,r-h,t-u,r+c),k.drawLineRetro(t-u,r+c,t-o,r+h),k.drawLineRetro(t-o,r+h,t+u,r-c)}static drawBoxLine(t,r,s,n){l.glBegin(l.GL_LINE_LOOP),l.glVertex3f(t,r,0),l.glVertex3f(t+s,r,0),l.glVertex3f(t+s,r+n,0),l.glVertex3f(t,r+n,0),l.glEnd()}static drawBoxSolid(t,r,s,n){l.glBegin(l.GL_TRIANGLE_FAN),l.glVertex3f(t,r,0),l.glVertex3f(t+s,r,0),l.glVertex3f(t+s,r+n,0),l.glVertex3f(t,r+n,0),l.glEnd()}};i(k,"CAPTION","PARSEC47"),i(k,"luminous",0),i(k,"rand"),i(k,"retro",0),i(k,"retroSize",.2),i(k,"retroR",1),i(k,"retroG",1),i(k,"retroB",1),i(k,"retroA",1),i(k,"retroZ",0);let w=k;class C{static init(e){if(this.manager=e,!z.noSound){gt.dir="sounds",Ht.dir="sounds",this.bgm=[];for(let t=0;t<this.BGM_NUM;t++){const r=new gt;r.load(this.bgmFileName[t]),this.bgm.push(r)}this.se=[];for(let t=0;t<this.SE_NUM;t++){const r=new Ht;r.load(this.seFileName[t],this.seChannel[t]),this.se.push(r)}}}static close(){if(!z.noSound){for(let e=0;e<this.bgm.length;e++)this.bgm[e].free();for(let e=0;e<this.se.length;e++)this.se[e].free()}}static playBgm(e){z.noSound||this.manager.state!==wt.IN_GAME||this.bgm[e].play()}static playSe(e){z.noSound||this.manager.state!==wt.IN_GAME||this.se[e].play()}static stopSe(e){z.noSound||this.se[e].halt()}}i(C,"SHOT",0),i(C,"ROLL_CHARGE",1),i(C,"ROLL_RELEASE",2),i(C,"SHIP_DESTROYED",3),i(C,"GET_BONUS",4),i(C,"EXTEND",5),i(C,"ENEMY_DESTROYED",6),i(C,"LARGE_ENEMY_DESTROYED",7),i(C,"BOSS_DESTROYED",8),i(C,"LOCK",9),i(C,"LASER",10),i(C,"BGM_NUM",4),i(C,"SE_NUM",11),i(C,"manager"),i(C,"bgm",[]),i(C,"se",[]),i(C,"bgmFileName",["ptn0.ogg","ptn1.ogg","ptn2.ogg","ptn3.ogg"]),i(C,"seFileName",["shot.wav","rollchg.wav","rollrls.wav","shipdst.wav","getbonus.wav","extend.wav","enemydst.wav","largedst.wav","bossdst.wav","lock.wav","laser.wav"]),i(C,"seChannel",[0,1,2,1,3,4,5,6,7,1,2]);const N=class N{constructor(){i(this,"restart",!1);i(this,"RESTART_CNT",300);i(this,"pos",new R);i(this,"cnt",0);i(this,"pad");i(this,"field");i(this,"manager");i(this,"ppos",new R);i(this,"baseSpeed",N.BASE_SPEED);i(this,"slowSpeed",N.SLOW_BASE_SPEED);i(this,"speed",N.BASE_SPEED);i(this,"vel",new R);i(this,"bank",0);i(this,"firePos",new R);i(this,"fireWideDeg",N.FIRE_WIDE_BASE_DEG);i(this,"fireCnt",0);i(this,"ttlCnt",0);i(this,"fieldLimitX",0);i(this,"fieldLimitY",0);i(this,"rollLockCnt",0);i(this,"rollCharged",!1)}static createDisplayLists(){N.deleteDisplayLists();const e=new Kt(3);e.beginNewList(),l.setColor(.5,1,.5,.2),w.drawBoxSolid(-.1,-.5,.2,1),l.setColor(.5,1,.5,.4),w.drawBoxLine(-.1,-.5,.2,1),e.nextNewList(),l.setColor(1,.2,.2,1),w.drawBoxSolid(-.2,-.2,.4,.4),l.setColor(1,.5,.5,1),w.drawBoxLine(-.2,-.2,.4,.4),e.nextNewList(),l.setColor(.7,1,.5,.3),w.drawBoxSolid(-.15,-.3,.3,.6),l.setColor(.7,1,.5,.6),w.drawBoxLine(-.15,-.3,.3,.6),e.endNewList(),N.displayList=e}static deleteDisplayLists(){var e;(e=N.displayList)==null||e.close(),N.displayList=null}init(e,t,r){this.pad=e,this.field=t,this.manager=r,this.pos=new R,this.ppos=new R,this.vel=new R,this.firePos=new R,this.ttlCnt=0,this.fieldLimitX=t.size.x-N.FIELD_SPACE,this.fieldLimitY=t.size.y-N.FIELD_SPACE}start(){this.ppos.x=this.pos.x=0,this.ppos.y=this.pos.y=-this.field.size.y/2,this.vel.x=0,this.vel.y=0,this.speed=N.BASE_SPEED,this.fireWideDeg=N.FIRE_WIDE_BASE_DEG,this.restart=!0,this.cnt=-228,this.fireCnt=0,this.rollLockCnt=0,this.bank=0,this.rollCharged=!1,at.resetBonusScore()}close(){}setSpeedRate(e){N.isSlow?this.baseSpeed=N.BASE_SPEED*.7:this.baseSpeed=N.BASE_SPEED*e,this.slowSpeed=N.SLOW_BASE_SPEED*e}destroyed(){if(!(this.cnt<=0)){C.playSe(C.SHIP_DESTROYED),this.manager.shipDestroyed(),this.manager.addFragments(30,this.pos.x,this.pos.y,this.pos.x,this.pos.y,0,.08,Math.PI);for(let e=0;e<45;e++)this.manager.addParticle(this.pos,N.rand.nextFloat(Math.PI*2),0,.6);this.start(),this.cnt=-this.RESTART_CNT}}move(){if(this.cnt++,this.cnt<-228)return;this.cnt===0&&(this.restart=!1);const e=this.pad.getButtonState();e&tt.Button.B?(this.speed+=(this.slowSpeed-this.speed)*.2,this.fireWideDeg+=(N.FIRE_NARROW_BASE_DEG-this.fireWideDeg)*.1,this.rollLockCnt++,this.manager.mode===wt.ROLL?this.rollLockCnt%15===0&&(this.manager.addRoll(),C.playSe(C.ROLL_CHARGE),this.rollCharged=!0):this.rollLockCnt%10===0&&this.manager.addLock()):(this.speed+=(this.baseSpeed-this.speed)*.2,this.fireWideDeg+=(N.FIRE_WIDE_BASE_DEG-this.fireWideDeg)*.1,this.manager.mode===wt.ROLL?this.rollCharged&&(this.rollLockCnt=0,this.manager.releaseRoll(),C.playSe(C.ROLL_RELEASE),this.rollCharged=!1):(this.rollLockCnt=0,this.manager.releaseLock()));const t=this.pad.getDirState();if(this.vel.x=0,this.vel.y=0,t&tt.Dir.UP?this.vel.y=this.speed:t&tt.Dir.DOWN&&(this.vel.y=-this.speed),t&tt.Dir.RIGHT?this.vel.x=this.speed:t&tt.Dir.LEFT&&(this.vel.x=-this.speed),this.vel.x!==0&&this.vel.y!==0&&(this.vel.x*=.707,this.vel.y*=.707),this.ppos.x=this.pos.x,this.ppos.y=this.pos.y,this.pos.x+=this.vel.x,this.pos.y+=this.vel.y,this.bank+=(this.vel.x*N.BANK_BASE-this.bank)*.1,this.pos.x<-this.fieldLimitX?this.pos.x=-this.fieldLimitX:this.pos.x>this.fieldLimitX&&(this.pos.x=this.fieldLimitX),this.pos.y<-this.fieldLimitY?this.pos.y=-this.fieldLimitY:this.pos.y>this.fieldLimitY&&(this.pos.y=this.fieldLimitY),e&tt.Button.A){let r=0;switch(this.fireCnt%4){case 0:this.firePos.x=this.pos.x+N.TURRET_INTERVAL_LENGTH,this.firePos.y=this.pos.y,r=0;break;case 1:this.firePos.x=this.pos.x+N.TURRET_INTERVAL_LENGTH,this.firePos.y=this.pos.y,r=this.fireWideDeg*((this.fireCnt/4|0)%5)*.2;break;case 2:this.firePos.x=this.pos.x-N.TURRET_INTERVAL_LENGTH,this.firePos.y=this.pos.y,r=0;break;case 3:this.firePos.x=this.pos.x-N.TURRET_INTERVAL_LENGTH,this.firePos.y=this.pos.y,r=-this.fireWideDeg*((this.fireCnt/4|0)%5)*.2;break}this.manager.addShot(this.firePos,r),C.playSe(C.SHOT),this.fireCnt++}_.target&&(_.target.x=this.pos.x,_.target.y=this.pos.y),this.ttlCnt++}draw(){var e,t,r,s,n,a,o,h,u;if(!(this.cnt<-228||this.cnt<0&&-this.cnt%32<16)){l.glPushMatrix(),l.glTranslatef(this.pos.x,this.pos.y,0),(e=N.displayList)==null||e.call(1),l.glRotatef(this.bank,0,1,0),l.glTranslatef(-.5,0,0),(t=N.displayList)==null||t.call(0),l.glTranslatef(.2,.3,.2),(r=N.displayList)==null||r.call(0),l.glTranslatef(0,0,-.4),(s=N.displayList)==null||s.call(0),l.glPopMatrix(),l.glPushMatrix(),l.glTranslatef(this.pos.x,this.pos.y,0),l.glRotatef(this.bank,0,1,0),l.glTranslatef(.5,0,0),(n=N.displayList)==null||n.call(0),l.glTranslatef(-.2,.3,.2),(a=N.displayList)==null||a.call(0),l.glTranslatef(0,0,-.4),(o=N.displayList)==null||o.call(0),l.glPopMatrix();for(let c=0;c<6;c++)l.glPushMatrix(),l.glTranslatef(this.pos.x-.7,this.pos.y-.3,0),l.glRotatef(this.bank,0,1,0),l.glRotatef(180/2-this.fireWideDeg*100,0,0,1),l.glRotatef(c*180/3-this.ttlCnt*4,1,0,0),l.glTranslatef(0,0,.7),(h=N.displayList)==null||h.call(2),l.glPopMatrix(),l.glPushMatrix(),l.glTranslatef(this.pos.x+.7,this.pos.y-.3,0),l.glRotatef(this.bank,0,1,0),l.glRotatef(-180/2+this.fireWideDeg*100,0,0,1),l.glRotatef(c*180/3-this.ttlCnt*4,1,0,0),l.glTranslatef(0,0,.7),(u=N.displayList)==null||u.call(2),l.glPopMatrix()}}};i(N,"isSlow",!1),i(N,"INVINCIBLE_CNT",228),i(N,"rand",new it),i(N,"displayList",null),i(N,"SIZE",.3),i(N,"BASE_SPEED",.6),i(N,"SLOW_BASE_SPEED",.3),i(N,"BANK_BASE",50),i(N,"FIRE_WIDE_BASE_DEG",.7),i(N,"FIRE_NARROW_BASE_DEG",.5),i(N,"TURRET_INTERVAL_LENGTH",.2),i(N,"FIELD_SPACE",1.5);let Tt=N;const A=class A extends yt{constructor(){super(...arguments);i(this,"fieldLimitX",0);i(this,"fieldLimitY",0);i(this,"field");i(this,"ship");i(this,"manager");i(this,"pos",new R);i(this,"vel",new R);i(this,"cnt",0);i(this,"isDown",!0);i(this,"isInhaled",!1);i(this,"inhaleCnt",0)}static init(){A.rand=new it}static resetBonusScore(){A.bonusScore=10}static setSpeedRate(t){A.rate=t,A.speed=A.BASE_SPEED*A.rate}init(t){const r=Array.isArray(t)?t[0]:t;if(!(r instanceof _e))throw new Error("Bonus.init requires BonusInitializer");this.field=r.field,this.ship=r.ship,this.manager=r.manager,this.pos=new R,this.vel=new R,this.fieldLimitX=this.field.size.x/6*5,this.fieldLimitY=this.field.size.y/10*9}set(t,r=null){this.pos.x=t.x,this.pos.y=t.y,r!==null&&(this.pos.x+=r.x,this.pos.y+=r.y),this.vel.x=A.rand.nextSignedFloat(.07),this.vel.y=A.rand.nextSignedFloat(.07),this.cnt=0,this.inhaleCnt=0,this.isDown=!0,this.isInhaled=!1,this.exists=!0}missBonus(){A.resetBonusScore()}getBonus(){C.playSe(C.GET_BONUS),this.manager.addScore(A.bonusScore),A.bonusScore<1e3&&(A.bonusScore+=10)}move(){if(this.pos.x+=this.vel.x,this.pos.y+=this.vel.y,this.vel.x-=this.vel.x/50,this.pos.x>this.fieldLimitX?(this.pos.x=this.fieldLimitX,this.vel.x>0&&(this.vel.x=-this.vel.x)):this.pos.x<-this.fieldLimitX&&(this.pos.x=-this.fieldLimitX,this.vel.x<0&&(this.vel.x=-this.vel.x)),this.isDown)this.vel.y+=(-A.speed-this.vel.y)/50,this.pos.y<-this.fieldLimitY&&(this.isDown=!1,this.pos.y=-this.fieldLimitY,this.vel.y=A.speed);else if(this.vel.y+=(A.speed-this.vel.y)/50,this.pos.y>this.fieldLimitY){this.missBonus(),this.exists=!1;return}if(this.cnt++,this.cnt<A.RETRO_CNT)return;const t=this.pos.dist(this.ship.pos);if(t<A.ACQUIRE_WIDTH*(1+this.inhaleCnt*.2)&&this.ship.cnt>=-228){this.getBonus(),this.exists=!1;return}if(this.isInhaled){this.inhaleCnt++;let r=(A.INHALE_WIDTH-t)/48;r<.025&&(r=.025),this.vel.x+=(this.ship.pos.x-this.pos.x)*r,this.vel.y+=(this.ship.pos.y-this.pos.y)*r,this.ship.cnt<-228&&(this.isInhaled=!1,this.inhaleCnt=0)}else t<A.INHALE_WIDTH&&this.ship.cnt>=-228&&(this.isInhaled=!0)}draw(){const t=this.cnt<A.RETRO_CNT?1-this.cnt/A.RETRO_CNT:0,r=this.cnt*.1,s=Math.sin(r)*.3,n=Math.cos(r)*.3;t>0?(w.setRetroParam(t,.2),w.drawBoxRetro(this.pos.x-s,this.pos.y-n,A.BOX_SIZE/2,A.BOX_SIZE/2,0),w.drawBoxRetro(this.pos.x+s,this.pos.y+n,A.BOX_SIZE/2,A.BOX_SIZE/2,0),w.drawBoxRetro(this.pos.x-n,this.pos.y+s,A.BOX_SIZE/2,A.BOX_SIZE/2,0),w.drawBoxRetro(this.pos.x+n,this.pos.y-s,A.BOX_SIZE/2,A.BOX_SIZE/2,0)):(this.isInhaled?l.setColor(.8,.6,.4,.7):this.isDown?l.setColor(.4,.9,.6,.7):l.setColor(.8,.9,.5,.7),w.drawBoxLine(this.pos.x-s-A.BOX_SIZE/2,this.pos.y-n-A.BOX_SIZE/2,A.BOX_SIZE,A.BOX_SIZE),w.drawBoxLine(this.pos.x+s-A.BOX_SIZE/2,this.pos.y+n-A.BOX_SIZE/2,A.BOX_SIZE,A.BOX_SIZE),w.drawBoxLine(this.pos.x-n-A.BOX_SIZE/2,this.pos.y+s-A.BOX_SIZE/2,A.BOX_SIZE,A.BOX_SIZE),w.drawBoxLine(this.pos.x+n-A.BOX_SIZE/2,this.pos.y-s-A.BOX_SIZE/2,A.BOX_SIZE,A.BOX_SIZE))}};i(A,"rate",1),i(A,"bonusScore",10),i(A,"BASE_SPEED",.1),i(A,"speed",A.BASE_SPEED),i(A,"INHALE_WIDTH",3),i(A,"ACQUIRE_WIDTH",1),i(A,"RETRO_CNT",20),i(A,"BOX_SIZE",.4),i(A,"rand",new it);let at=A;class _e{constructor(e,t,r){this.field=e,this.ship=t,this.manager=r}}class Lt extends Et{constructor(t,r){super(t,[r],()=>new ct);i(this,"cnt",0);_.setBulletsManager(this),ct.init(),this.cnt=0}addManagedBullet(t,r,s,n,a,o,h,u,c,m,b){const g=this.acquireActor();return g?(g.setRunnerBullet(t,r,s,n,a,o,h,u,c,m,b),g.setInvisible(),g):null}addTopBullet(t,r,s,n,a,o,h,u,c,m,b,g){const T=this.addManagedBullet(r,s,n,a,o,h,u,c,m,b,g);return T?(T.setTop(t),T):null}addTopMorphBullet(t,r,s,n,a,o,h,u,c,m,b,g,T,S,v){const P=this.acquireActor();return P?(P.setRunnerMorphBullet(r,s,n,a,o,h,u,c,m,b,g,T,S,0,v),P.setTop(t),P):null}move(){super.move(),this.cnt++}getTurn(){return this.cnt}killMe(t){const r=this.actor[t.id];if(r&&r.bullet.id===t.id){r.remove();return}for(let s=0;s<this.actor.length;s++){const n=this.actor[s];if(!n.exists)continue;const a=n.bullet;if(a===t||a.id===t.id){n.remove();return}}}clear(){for(let t=0;t<this.actor.length;t++)this.actor[t].exists&&this.actor[t].remove()}static registFunctions(t){const r=t.callbacks??(t.callbacks={});r.getBulletDirection=os,r.getAimDirection=Ls,r.getBulletSpeed=hs,r.getDefaultSpeed=cs,r.getRank=ds,r.createSimpleBullet=us,r.createBullet=ps,r.getTurn=ms,r.doVanish=fs,r.doChangeDirection=bs,r.doChangeSpeed=gs,r.doAccelX=ws,r.doAccelY=ys,r.getBulletSpeedX=Es,r.getBulletSpeedY=xs,r.getRand=Ss}acquireActor(){return this.getInstance()}addSimpleBullet(t,r){const s=this.acquireActor();if(!s)return;const n=_.now,a=n.morphParser,o=n.morphNum,h=n.morphIdx,u=n.morphCnt;if(n.isMorph){const c=a[h];if(!c)throw new Error(`Morph parser missing at index ${h} (morphNum=${o})`);const m=c.createRunner();Lt.registFunctions(m),s.setRunnerMorphBullet(m,_.now.pos.x,_.now.pos.y,t,r,_.now.rank,n.speedRank,n.shape,n.color,n.bulletSize,n.xReverse,a,o,h+1,u-1);return}s.setSimpleBullet(_.now.pos.x,_.now.pos.y,t,r,_.now.rank,n.speedRank,n.shape,n.color,n.bulletSize,n.xReverse)}addStateBullet(t,r,s){const n=this.acquireActor();if(!n)return;const a=this.createRunnerFromState(t);Lt.registFunctions(a);const o=_.now;if(o.isMorph){n.setRunnerMorphBullet(a,_.now.pos.x,_.now.pos.y,r,s,_.now.rank,o.speedRank,o.shape,o.color,o.bulletSize,o.xReverse,o.morphParser,o.morphNum,o.morphIdx,o.morphCnt);return}n.setRunnerBullet(a,_.now.pos.x,_.now.pos.y,r,s,_.now.rank,o.speedRank,o.shape,o.color,o.bulletSize,o.xReverse)}createRunnerFromState(t){return t.createRunner()}}function Ls(d){const e=_.now.pos,t=_.target,r=_.now.xReverse;return Math.atan2(t.x-e.x,t.y-e.y)*r*180/Math.PI}class Jt extends _{constructor(t){super(t);i(this,"morphParser",[]);i(this,"morphNum",0);i(this,"morphIdx",0);i(this,"morphCnt",0);i(this,"baseMorphIdx",0);i(this,"baseMorphCnt",0);i(this,"isMorph",!1)}setMorph(t,r,s,n){if(n<=0){this.isMorph=!1;return}this.isMorph=!0,this.baseMorphCnt=this.morphCnt=n,this.morphNum=r;for(let a=0;a<r;a++)this.morphParser[a]=t[a];this.morphIdx=s,this.morphIdx>=this.morphNum&&(this.morphIdx=0),this.baseMorphIdx=this.morphIdx}resetMorph(){this.morphIdx=this.baseMorphIdx,this.morphCnt=this.baseMorphCnt}}i(Jt,"MORPH_MAX",8);class As extends Jt{constructor(t){super(t);i(this,"speedRank",0);i(this,"shape",0);i(this,"color",0);i(this,"bulletSize",0);i(this,"xReverse",0)}setParam(t,r,s,n,a){this.speedRank=t,this.shape=r,this.color=s,this.bulletSize=n,this.xReverse=a}}const y=class y extends yt{constructor(){super();i(this,"bullet");i(this,"field");i(this,"ship");i(this,"isSimple",!1);i(this,"isTop",!1);i(this,"isVisible",!0);i(this,"parser",null);i(this,"ppos",new R);i(this,"cnt",0);i(this,"rtCnt",0);i(this,"shouldBeRemoved",!1);i(this,"backToRetro",!1)}static init(){y.nextId=0}static resetTotalBulletsSpeed(){y.totalBulletsSpeed=0}init(t){const r=Array.isArray(t)?t[0]:t;if(!(r instanceof Fe))throw new Error("BulletActor.init requires BulletActorInitializer");this.field=r.field,this.ship=r.ship,this.bullet=this.createBullet(y.nextId++),this.ppos=new R,this.exists=!1}createBullet(t){return new As(t)}start(t,r,s,n,a){this.exists=!0,this.isTop=!1,this.isVisible=!0,this.ppos.x=this.bullet.pos.x,this.ppos.y=this.bullet.pos.y,this.bullet.setParam(t,r,s,n,a),this.cnt=0,this.rtCnt=0,this.shouldBeRemoved=!1,this.backToRetro=!1}setRunnerBullet(t,r,s,n,a,o,h,u,c,m,b){this.bullet.set(r,s,n,a,o),this.bullet.setRunner(t),this.bullet.isMorph=!1,this.isSimple=!1,this.start(h,u,c,m,b)}setRunnerMorphBullet(t,r,s,n,a,o,h,u,c,m,b,g,T,S,v){this.bullet.set(r,s,n,a,o),this.bullet.setRunner(t),this.bullet.setMorph(g,T,S,v),this.isSimple=!1,this.start(h,u,c,m,b)}setSimpleBullet(t,r,s,n,a,o,h,u,c,m){this.bullet.set(t,r,s,n,a),this.bullet.isMorph=!1,this.isSimple=!0,this.start(o,h,u,c,m)}setInvisible(){this.isVisible=!1}setTop(t){this.parser=t,this.isTop=!0,this.setInvisible()}rewind(){if(this.bullet.remove(),!this.parser)return;const t=this.parser.createRunner();Lt.registFunctions(t),this.bullet.setRunner(t),this.bullet.resetMorph()}remove(){this.shouldBeRemoved=!0}removeForced(){this.isSimple||this.bullet.remove(),this.exists=!1}toRetro(){!this.isVisible||this.backToRetro||(this.backToRetro=!0,this.rtCnt>=y.RETRO_CNT&&(this.rtCnt=y.RETRO_CNT-.1))}checkShipHit(){let t=this.ppos.x-this.bullet.pos.x,r=this.ppos.y-this.bullet.pos.y;const s=t*t+r*r;if(s<=1e-5)return;const n=this.ship.pos.x-this.bullet.pos.x,a=this.ship.pos.y-this.bullet.pos.y,o=t*n+r*a;if(o<0||o>s)return;const h=n*n+a*a-o*o/s;h>=0&&h<=y.SHIP_HIT_WIDTH&&this.ship.destroyed()}move(){if(this.ppos.x=this.bullet.pos.x,this.ppos.y=this.bullet.pos.y,this.isSimple||(this.bullet.move(),this.isTop&&this.bullet.isEnd()&&this.rewind()),this.shouldBeRemoved){this.removeForced();return}let t;if(this.rtCnt<y.RETRO_CNT){if(t=this.bullet.speedRank*(.3+this.rtCnt/y.RETRO_CNT*.7),this.backToRetro){if(this.rtCnt-=t,this.rtCnt<=0){this.removeForced();return}}else this.rtCnt+=t;if(this.ship.cnt<-228/2&&this.isVisible&&this.rtCnt>=y.RETRO_CNT){this.removeForced();return}}else t=this.bullet.speedRank,this.cnt>y.BULLET_DISAPPEAR_CNT&&this.toRetro();this.bullet.pos.x+=(Math.sin(this.bullet.deg)*this.bullet.speed+this.bullet.acc.x)*t*this.bullet.xReverse,this.bullet.pos.y+=(Math.cos(this.bullet.deg)*this.bullet.speed-this.bullet.acc.y)*t,this.isVisible&&(y.totalBulletsSpeed+=this.bullet.speed*t,this.rtCnt>y.RETRO_CNT&&this.checkShipHit(),this.checkFieldHit(this.bullet.pos,y.FIELD_SPACE)&&this.removeForced()),this.cnt++}checkFieldHit(t,r){const s=this.field;return typeof s.checkHit=="function"?s.checkHit(t,r):t.x<-s.size.x+r||t.x>s.size.x-r||t.y<-s.size.y+r||t.y>s.size.y-r}drawRetro(t){const r=1-this.rtCnt/y.RETRO_CNT;w.setRetroParam(r,.4*this.bullet.bulletSize);const s=y.bulletColor[this.clampColor(this.bullet.color)];w.setRetroColor(s[0],s[1],s[2],1);let n=0,a=0,o=0,h=0;const u=y.shapePos[this.clampShape(this.bullet.shape)];for(let c=0;c<u.length;c++){const m=n,b=a,g=u[c][0]*this.bullet.bulletSize;a=u[c][1]*this.bullet.bulletSize,n=g*Math.cos(t)-a*Math.sin(t),a=g*Math.sin(t)+a*Math.cos(t),c>0?w.drawLineRetro(m,b,n,a):(o=n,h=a)}w.drawLineRetro(n,a,o,h)}draw(){if(!this.isVisible)return;let t=0;switch(this.bullet.shape){case 0:case 2:case 5:t=-this.bullet.deg*this.bullet.xReverse;break;case 1:t=this.cnt*.14;break;case 3:t=this.cnt*.23;break;case 4:t=this.cnt*.33;break;case 6:t=this.cnt*.08;break;default:t=-this.bullet.deg*this.bullet.xReverse;break}if(l.glPushMatrix(),l.glTranslatef(this.bullet.pos.x,this.bullet.pos.y,0),this.rtCnt>=y.RETRO_CNT&&y.displayList){const r=this.clampColor(this.bullet.color)*(y.BULLET_SHAPE_NUM+1);y.displayList.call(r),l.glRotatef(Oe(t),0,0,1),l.glScalef(this.bullet.bulletSize,this.bullet.bulletSize,1),y.displayList.call(r+1+this.clampShape(this.bullet.shape))}else this.drawRetro(t);l.glPopMatrix()}clampShape(t){return t<0?0:t>=y.BULLET_SHAPE_NUM?y.BULLET_SHAPE_NUM-1:t}clampColor(t){return t<0?0:t>=y.BULLET_COLOR_NUM?y.BULLET_COLOR_NUM-1:t}static createDisplayLists(){y.deleteDisplayLists();const t=y.BULLET_COLOR_NUM*(y.BULLET_SHAPE_NUM+1),r=new Kt(t);let s=0,n=!1;for(let a=0;a<y.BULLET_COLOR_NUM;a++){let o=y.bulletColor[a][0],h=y.bulletColor[a][1],u=y.bulletColor[a][2];o+=(1-o)*.5,h+=(1-h)*.5,u+=(1-u)*.5;for(let c=0;c<y.BULLET_SHAPE_NUM+1;c++)n?r.nextNewList():(r.beginNewList(),n=!0),l.setColor(o,h,u,1),y.drawDisplayListShape(c,o,h,u),s++}n&&s>0&&r.endNewList(),y.displayList=r}static drawDisplayListShape(t,r,s,n){let o=0,h=0;switch(t){case 0:l.glBegin(l.GL_TRIANGLE_FAN),l.glVertex3f(-.1,-.1,0),l.glVertex3f(y.SHAPE_POINT_SIZE,-.1,0),l.glVertex3f(y.SHAPE_POINT_SIZE,y.SHAPE_POINT_SIZE,0),l.glVertex3f(-.1,y.SHAPE_POINT_SIZE,0),l.glEnd();break;case 1:o=1/2,l.glDisable(l.GL_BLEND),l.glBegin(l.GL_LINE_LOOP),l.glVertex3f(-o,-o,0),l.glVertex3f(o,-o,0),l.glVertex3f(0,1,0),l.glEnd(),l.glEnable(l.GL_BLEND),l.setColor(r,s,n,.55),l.glBegin(l.GL_TRIANGLE_FAN),l.glVertex3f(-o,-o,0),l.glVertex3f(o,-o,0),l.setColor(y.SHAPE_BASE_COLOR_R,y.SHAPE_BASE_COLOR_G,y.SHAPE_BASE_COLOR_B,.55),l.glVertex3f(0,1,0),l.glEnd();break;case 2:o=1/2,l.glDisable(l.GL_BLEND),l.glBegin(l.GL_LINE_LOOP),l.glVertex3f(0,-1,0),l.glVertex3f(o,0,0),l.glVertex3f(0,1,0),l.glVertex3f(-o,0,0),l.glEnd(),l.glEnable(l.GL_BLEND),l.setColor(r,s,n,.7),l.glBegin(l.GL_TRIANGLE_FAN),l.glVertex3f(0,-1,0),l.glVertex3f(o,0,0),l.setColor(y.SHAPE_BASE_COLOR_R,y.SHAPE_BASE_COLOR_G,y.SHAPE_BASE_COLOR_B,.55),l.glVertex3f(0,1,0),l.glVertex3f(-o,0,0),l.glEnd();break;case 3:o=1/4,h=1/3*2,l.glDisable(l.GL_BLEND),l.glBegin(l.GL_LINE_LOOP),l.glVertex3f(-o,-h,0),l.glVertex3f(o,-h,0),l.glVertex3f(o,h,0),l.glVertex3f(-o,h,0),l.glEnd(),l.glEnable(l.GL_BLEND),l.setColor(r,s,n,.45),l.glBegin(l.GL_TRIANGLE_FAN),l.glVertex3f(-o,-h,0),l.glVertex3f(o,-h,0),l.setColor(y.SHAPE_BASE_COLOR_R,y.SHAPE_BASE_COLOR_G,y.SHAPE_BASE_COLOR_B,.55),l.glVertex3f(o,h,0),l.glVertex3f(-o,h,0),l.glEnd();break;case 4:o=1/2,l.glDisable(l.GL_BLEND),l.glBegin(l.GL_LINE_LOOP),l.glVertex3f(-o,-o,0),l.glVertex3f(o,-o,0),l.glVertex3f(o,o,0),l.glVertex3f(-o,o,0),l.glEnd(),l.glEnable(l.GL_BLEND),l.setColor(r,s,n,.7),l.glBegin(l.GL_TRIANGLE_FAN),l.glVertex3f(-o,-o,0),l.glVertex3f(o,-o,0),l.setColor(y.SHAPE_BASE_COLOR_R,y.SHAPE_BASE_COLOR_G,y.SHAPE_BASE_COLOR_B,.55),l.glVertex3f(o,o,0),l.glVertex3f(-o,o,0),l.glEnd();break;case 5:o=1/2,l.glDisable(l.GL_BLEND),l.glBegin(l.GL_LINE_LOOP),l.glVertex3f(-o/2,-o,0),l.glVertex3f(o/2,-o,0),l.glVertex3f(o,-o/2,0),l.glVertex3f(o,o/2,0),l.glVertex3f(o/2,o,0),l.glVertex3f(-o/2,o,0),l.glVertex3f(-o,o/2,0),l.glVertex3f(-o,-o/2,0),l.glEnd(),l.glEnable(l.GL_BLEND),l.setColor(r,s,n,.85),l.glBegin(l.GL_TRIANGLE_FAN),l.glVertex3f(-o/2,-o,0),l.glVertex3f(o/2,-o,0),l.glVertex3f(o,-o/2,0),l.glVertex3f(o,o/2,0),l.setColor(y.SHAPE_BASE_COLOR_R,y.SHAPE_BASE_COLOR_G,y.SHAPE_BASE_COLOR_B,.55),l.glVertex3f(o/2,o,0),l.glVertex3f(-o/2,o,0),l.glVertex3f(-o,o/2,0),l.glVertex3f(-o,-o/2,0),l.glEnd();break;case 6:o=2/3,h=1/5,l.glDisable(l.GL_BLEND),l.glBegin(l.GL_LINE_STRIP),l.glVertex3f(-o,-o+h,0),l.glVertex3f(0,o+h,0),l.glVertex3f(o,-o+h,0),l.glEnd(),l.glEnable(l.GL_BLEND),l.setColor(r,s,n,.55),l.glBegin(l.GL_TRIANGLE_FAN),l.glVertex3f(-o,-o+h,0),l.glVertex3f(o,-o+h,0),l.setColor(y.SHAPE_BASE_COLOR_R,y.SHAPE_BASE_COLOR_G,y.SHAPE_BASE_COLOR_B,.55),l.glVertex3f(0,o+h,0),l.glEnd();break;case 7:o=1/2,l.glDisable(l.GL_BLEND),l.glBegin(l.GL_LINE_LOOP),l.glVertex3f(-o,-o,0),l.glVertex3f(0,-o,0),l.glVertex3f(o,0,0),l.glVertex3f(o,o,0),l.glVertex3f(0,o,0),l.glVertex3f(-o,0,0),l.glEnd(),l.glEnable(l.GL_BLEND),l.setColor(r,s,n,.85),l.glBegin(l.GL_TRIANGLE_FAN),l.glVertex3f(-o,-o,0),l.glVertex3f(0,-o,0),l.glVertex3f(o,0,0),l.setColor(y.SHAPE_BASE_COLOR_R,y.SHAPE_BASE_COLOR_G,y.SHAPE_BASE_COLOR_B,.55),l.glVertex3f(o,o,0),l.glVertex3f(0,o,0),l.glVertex3f(-o,0,0),l.glEnd();break}}static deleteDisplayLists(){y.displayList&&(y.displayList.close(),y.displayList=null)}};i(y,"totalBulletsSpeed",0),i(y,"BULLET_SHAPE_NUM",7),i(y,"BULLET_COLOR_NUM",4),i(y,"FIELD_SPACE",.5),i(y,"BULLET_DISAPPEAR_CNT",180),i(y,"nextId",0),i(y,"displayList",null),i(y,"SHIP_HIT_WIDTH",.2),i(y,"RETRO_CNT",24),i(y,"SHAPE_POINT_SIZE",.1),i(y,"SHAPE_BASE_COLOR_R",1),i(y,"SHAPE_BASE_COLOR_G",.9),i(y,"SHAPE_BASE_COLOR_B",.7),i(y,"bulletColor",[[1,0,0],[.2,1,.4],[.3,.3,1],[1,1,0]]),i(y,"shapePos",[[[-.5,-.5],[.5,-.5],[0,1]],[[0,-1],[.5,0],[0,1],[-.5,0]],[[-.25,-.66],[.25,-.66],[.25,.66],[-.25,.66]],[[-.5,-.5],[.5,-.5],[.5,.5],[-.5,.5]],[[-.25,-.5],[.25,-.5],[.5,-.25],[.5,.25],[.25,.5],[-.25,.5],[-.5,.25],[-.5,-.25]],[[-.66,-.46],[0,.86],[.66,-.46]],[[-.5,-.5],[0,-.5],[.5,0],[.5,.5],[0,.5],[-.5,0]]]);let ct=y;class Fe{constructor(e,t){this.field=e,this.ship=t}}function st(d){return d<0?Math.ceil(d):Math.floor(d)}class Ye{constructor(){i(this,"parser",null);i(this,"morphParser");i(this,"morphNum",0);i(this,"morphCnt",0);i(this,"rank",0);i(this,"speedRank",0);i(this,"morphRank",0);i(this,"shape",0);i(this,"color",0);i(this,"bulletSize",0);i(this,"xReverse",1);this.morphParser=Array.from({length:Jt.MORPH_MAX},()=>null)}}const bt=class bt{constructor(){i(this,"wingShapePos");i(this,"collisionPos");i(this,"collisionSize");i(this,"batteryPos");i(this,"batteryNum",0);i(this,"r",0);i(this,"g",0);i(this,"b",0);i(this,"barrage");i(this,"xReverseAlternate",!1);i(this,"shield",0);this.barrage=Array.from({length:bt.BARRAGE_PATTERN_MAX},()=>new Ye),this.wingShapePos=Array.from({length:bt.WING_SHAPE_POINT_NUM},()=>new R),this.collisionPos=new R,this.collisionSize=new R,this.batteryPos=Array.from({length:bt.WING_BATTERY_MAX},()=>new R)}};i(bt,"WING_SHAPE_POINT_NUM",3),i(bt,"WING_BATTERY_MAX",3),i(bt,"BARRAGE_PATTERN_MAX",8);let zt=bt;const f=class f{constructor(){i(this,"barrage");i(this,"bodyShapePos");i(this,"collisionSize");i(this,"wingCollision",!1);i(this,"r",0);i(this,"g",0);i(this,"b",0);i(this,"retroSize",0);i(this,"batteryType");i(this,"batteryNum",0);i(this,"shield",0);i(this,"fireInterval",0);i(this,"firePeriod",0);i(this,"barragePatternNum",0);i(this,"id");i(this,"type",f.SMALL);i(this,"er",1);i(this,"eg",1);i(this,"eb",1);i(this,"ect",0);if(this.bodyShapePos=Array.from({length:f.BODY_SHAPE_POINT_NUM},()=>new R),this.collisionSize=new R,this.barrage=Array.from({length:f.BARRAGE_PATTERN_MAX},()=>new Ye),this.batteryType=Array.from({length:f.BATTERY_MAX},()=>new zt),f.idCnt>=f.ENEMY_TYPE_MAX)throw new Error("EnemyType id overflow");this.id=f.idCnt,f.idCnt++}static init(e){f.rand=new it,f.barrageManager=e,f.idCnt=0,f.usedMorphParser=Array.from({length:e.BARRAGE_MAX},()=>!1)}static clearIsExistList(){for(let e=0;e<f.idCnt;e++)f.isExist[e]=!1}static requireRand(){if(!f.rand)throw new Error("EnemyType.init() must be called before creating enemy types.");return f.rand}static requireBarrageManager(){if(!f.barrageManager)throw new Error("EnemyType.init() must be called before creating enemy types.");return f.barrageManager}getParser(e,t){var n;const s=((n=f.requireBarrageManager().parser[e])==null?void 0:n[t])??null;if(!s)throw new Error(`Missing barrage parser type=${e} idx=${t}`);return s}setBarrageType(e,t,r){const s=f.requireRand(),n=f.requireBarrageManager();e.parser=this.getParser(t,s.nextInt(n.parserNum[t])),f.usedMorphParser.fill(!1);const a=r===f.ROLL?n.parserNum[F.MORPH]:n.parserNum[F.MORPH_LOCK];for(let o=0;o<e.morphParser.length;o++){let h=s.nextInt(a);for(let u=0;u<a&&f.usedMorphParser[h];u++)h++,h>=a&&(h=0);e.morphParser[o]=r===f.ROLL?this.getParser(F.MORPH,h):this.getParser(F.MORPH_LOCK,h),f.usedMorphParser[h]=!0}e.morphNum=e.morphParser.length}setBarrageRank(e,t,r,s){const n=f.requireRand();if(t<=0){e.rank=0;return}for(e.rank=Math.sqrt(t)/(8-n.nextInt(3)),e.rank>.8&&(e.rank=n.nextFloat(.2)+.8),t/=e.rank+2,r===f.WEAK&&(e.rank/=2),s===f.ROLL?e.speedRank=Math.sqrt(t)*(n.nextFloat(.2)+1):e.speedRank=Math.sqrt(t*.66)*(n.nextFloat(.2)+.8),e.speedRank<1&&(e.speedRank=1),e.speedRank>2&&(e.speedRank=Math.sqrt(e.speedRank)+.27),e.morphRank=t/e.speedRank,e.morphCnt=0;e.morphRank>1;)e.morphCnt++,e.morphRank/=3;r===f.VERYWEAK?(e.morphRank/=2,e.morphCnt=st(e.morphCnt/1.7)):r===f.MORPHWEAK?e.morphRank/=2:r===f.WEAK&&(e.morphRank/=1.5)}setBarrageRankSlow(e,t,r,s,n){this.setBarrageRank(e,t,r,s),e.speedRank*=n}setBarrageShape(e,t){const r=f.requireRand();e.shape=r.nextInt(f.BULLET_SHAPE_NUM),e.color=r.nextInt(f.BULLET_COLOR_NUM),e.bulletSize=(1+r.nextSignedFloat(.1))*t}setEnemyColorType(){const e=f.requireRand();this.ect=e.nextInt(3)}createEnemyColor(){const e=f.requireRand();switch(this.ect){case 0:this.er=1,this.eg=e.nextFloat(.7)+.3,this.eb=e.nextFloat(.7)+.3;break;case 1:this.er=e.nextFloat(.7)+.3,this.eg=1,this.eb=e.nextFloat(.7)+.3;break;case 2:this.er=e.nextFloat(.7)+.3,this.eg=e.nextFloat(.7)+.3,this.eb=1;break}}setEnemyShapeAndWings(e){const t=f.requireRand();this.createEnemyColor(),this.r=this.er,this.g=this.eg,this.b=this.eb;const r=f.enemySize[e][0]+t.nextSignedFloat(f.enemySize[e][1]),s=f.enemySize[e][2]+t.nextSignedFloat(f.enemySize[e][3]),n=f.enemySize[e][0]+t.nextSignedFloat(f.enemySize[e][1]),a=f.enemySize[e][2]+t.nextSignedFloat(f.enemySize[e][3]);switch(this.bodyShapePos[0].x=-r,this.bodyShapePos[0].y=s,this.bodyShapePos[1].x=r,this.bodyShapePos[1].y=s,this.bodyShapePos[2].x=n,this.bodyShapePos[2].y=-a,this.bodyShapePos[3].x=-n,this.bodyShapePos[3].y=-a,this.retroSize=f.enemySize[e][4],e){case f.SMALL:case f.MIDDLE:case f.MIDDLEBOSS:this.batteryNum=2;break;case f.LARGE:case f.LARGEBOSS:this.batteryNum=4;break}let o=0,h=0,u=0,c=0,m=0;this.collisionSize.x=r>n?r:n,this.collisionSize.y=s>a?s:a;for(let b=0;b<this.batteryNum;b++){const g=this.batteryType[b];let T=1;if(b%2===0){o=f.enemySize[e][5]+t.nextFloat(f.enemySize[e][6]),this.batteryNum<=2?h=t.nextSignedFloat(f.enemySize[e][7]):b<2?h=t.nextFloat(f.enemySize[e][7]/2)+f.enemySize[e][7]/2:h=-t.nextFloat(f.enemySize[e][7]/2)-f.enemySize[e][7]/2;let P=0;switch(t.nextInt(2)===0?P=t.nextFloat(Math.PI/2)-Math.PI/4:P=t.nextFloat(Math.PI/2)+Math.PI/4*3,u=o/2+Math.sin(P)*(f.enemySize[e][8]/2+t.nextFloat(f.enemySize[e][8]/2)),c=h/2+Math.cos(P)*(f.enemySize[e][8]/2+t.nextFloat(f.enemySize[e][8]/2)),e){case f.SMALL:case f.MIDDLE:case f.LARGE:m=1;break;case f.MIDDLEBOSS:m=150+t.nextInt(30);break;case f.LARGEBOSS:m=200+t.nextInt(50);break}if(this.createEnemyColor(),T=-1,!this.wingCollision){o>this.collisionSize.x&&(this.collisionSize.x=o);let O=Math.abs(h);O>this.collisionSize.y&&(this.collisionSize.y=O),O=Math.abs(c),O>this.collisionSize.y&&(this.collisionSize.y=O)}}g.wingShapePos[0].x=o/4*T,g.wingShapePos[0].y=h/4,g.wingShapePos[1].x=o*T,g.wingShapePos[1].y=h,g.wingShapePos[2].x=u*T,g.wingShapePos[2].y=c,g.collisionPos.x=(o+o/4)/2*T,g.collisionPos.y=(h+c+h/4)/3,g.collisionSize.x=o/4*3/2*1;const S=Math.abs(h-c)/2,v=Math.abs(h-h/4)/2;g.collisionSize.y=S>v?S:v,g.r=this.er,g.g=this.eg,g.b=this.eb,g.shield=m}}setBattery(e,t,r,s,n,a,o,h){const u=f.requireRand(),c=this.batteryType[n],m=this.batteryType[n+1],b=c.barrage[a],g=m.barrage[a];this.setBarrageType(b,r,h),this.setBarrageRankSlow(b,e/t,s,h,o),this.setBarrageShape(b,.8),b.xReverse=u.nextInt(2)*2-1,g.parser=b.parser;for(let O=0;O<Jt.MORPH_MAX;O++)g.morphParser[O]=b.morphParser[O];g.morphNum=b.morphNum,g.morphCnt=b.morphCnt,g.rank=b.rank,g.speedRank=b.speedRank,g.morphRank=b.morphRank,g.shape=b.shape,g.color=b.color,g.bulletSize=b.bulletSize,g.xReverse=-b.xReverse,u.nextInt(4)===0?(c.xReverseAlternate=!0,m.xReverseAlternate=!0):(c.xReverseAlternate=!1,m.xReverseAlternate=!1);let T=c.wingShapePos[1].x,S=c.wingShapePos[1].y;const v=c.wingShapePos[2].x,P=c.wingShapePos[2].y;for(let O=0;O<t;O++)c.batteryPos[O].x=T,c.batteryPos[O].y=S,m.batteryPos[O].x=-T,m.batteryPos[O].y=S,T+=(v-T)/(t-1),S+=(P-S)/(t-1);c.batteryNum=t,m.batteryNum=t}setSmallEnemyType(e,t){const r=f.requireRand();this.type=f.SMALL,this.barragePatternNum=1,this.wingCollision=!1,this.setEnemyColorType();const s=this.barrage[0];t===f.ROLL?this.setBarrageType(s,F.SMALL,t):this.setBarrageType(s,F.SMALL_LOCK,t),this.setBarrageRank(s,e,f.VERYWEAK,t),this.setBarrageShape(s,.7),s.xReverse=r.nextInt(2)*2-1,this.setEnemyShapeAndWings(f.SMALL),this.setBattery(0,0,0,f.NORMAL,0,0,1,t),this.shield=1,this.fireInterval=99999,this.firePeriod=150+r.nextInt(40),e<10&&(this.firePeriod=st(this.firePeriod/(2-e*.1)))}setMiddleEnemyType(e,t){const r=f.requireRand();this.type=f.MIDDLE,this.barragePatternNum=1,this.wingCollision=!1,this.setEnemyColorType();const s=this.barrage[0];this.setBarrageType(s,F.MIDDLE,t);let n=0,a=0;if(t===f.ROLL)switch(r.nextInt(6)){case 0:case 1:n=e/3*2,a=0;break;case 2:n=e/4,a=e/4;break;case 3:case 4:case 5:n=0,a=e/2;break}else switch(r.nextInt(6)){case 0:case 1:n=e/5,a=e/4;break;case 2:case 3:case 4:case 5:n=0,a=e/2;break}this.setBarrageRank(s,n,f.MORPHWEAK,t),this.setBarrageShape(s,.75),s.xReverse=r.nextInt(2)*2-1,this.setEnemyShapeAndWings(f.MIDDLE),t===f.ROLL?(this.shield=40+r.nextInt(10),this.setBattery(a,1,F.MIDDLESUB,f.NORMAL,0,0,1,t),this.fireInterval=100+r.nextInt(60),this.firePeriod=st(this.fireInterval/(1.8+r.nextFloat(.7)))):(this.shield=30+r.nextInt(8),this.setBattery(a,1,F.MIDDLESUB_LOCK,f.NORMAL,0,0,1,t),this.fireInterval=72+r.nextInt(30),this.firePeriod=st(this.fireInterval/(1.2+r.nextFloat(.2)))),e<10&&(this.firePeriod=st(this.firePeriod/(2-e*.1)))}setLargeEnemyType(e,t){const r=f.requireRand();this.type=f.LARGE,this.barragePatternNum=1,this.wingCollision=!1,this.setEnemyColorType();const s=this.barrage[0];this.setBarrageType(s,F.LARGE,t);let n=0,a=0,o=0;if(t===f.ROLL)switch(r.nextInt(9)){case 0:case 1:case 2:case 3:n=e,a=0,o=0;break;case 4:n=e/3*2,a=e/3*2,o=0;break;case 5:n=e/3*2,a=0,o=e/3*2;break;case 6:case 7:case 8:n=0,a=e/3*2,o=e/3*2;break}else switch(r.nextInt(9)){case 0:n=e/4*3,a=0,o=0;break;case 1:case 2:n=e/4*2,a=e/3*2,o=0;break;case 3:case 4:n=e/4*2,a=0,o=e/3*2;break;case 5:case 6:case 7:case 8:n=0,a=e/3*2,o=e/3*2;break}this.setBarrageRank(s,n,f.WEAK,t),this.setBarrageShape(s,.8),s.xReverse=r.nextInt(2)*2-1,this.setEnemyShapeAndWings(f.LARGE),t===f.ROLL?(this.shield=60+r.nextInt(10),this.setBattery(a,1,F.MIDDLESUB,f.NORMAL,0,0,1,t),this.setBattery(o,1,F.MIDDLESUB,f.NORMAL,2,0,1,t),this.fireInterval=150+r.nextInt(60),this.firePeriod=st(this.fireInterval/(1.3+r.nextFloat(.8)))):(this.shield=45+r.nextInt(8),this.setBattery(a,1,F.MIDDLESUB_LOCK,f.NORMAL,0,0,1,t),this.setBattery(o,1,F.MIDDLESUB_LOCK,f.NORMAL,2,0,1,t),this.fireInterval=100+r.nextInt(50),this.firePeriod=st(this.fireInterval/(1.2+r.nextFloat(.2)))),e<10&&(this.firePeriod=st(this.firePeriod/(2-e*.1)))}setMiddleBossEnemyType(e,t){const r=f.requireRand();this.type=f.MIDDLEBOSS,this.barragePatternNum=2+r.nextInt(2),this.wingCollision=!0,this.setEnemyColorType();const s=1+r.nextInt(2);for(let n=0;n<this.barragePatternNum;n++){const a=this.barrage[n];this.setBarrageType(a,F.LARGE,t);let o=0,h=0;switch(r.nextInt(3)){case 0:o=e,h=0;break;case 1:o=e/3,h=e/3;break;case 2:o=0,h=e;break}this.setBarrageRankSlow(a,o,f.NORMAL,t,.9),this.setBarrageShape(a,.9),a.xReverse=r.nextInt(2)*2-1,this.setEnemyShapeAndWings(f.MIDDLEBOSS),this.setBattery(h,s,F.MIDDLE,f.WEAK,0,n,.9,t)}this.shield=300+r.nextInt(50),this.fireInterval=200+r.nextInt(40),this.firePeriod=st(this.fireInterval/(1.2+r.nextFloat(.4))),e<10&&(this.firePeriod=st(this.firePeriod/(2-e*.1)))}setLargeBossEnemyType(e,t){const r=f.requireRand();this.type=f.LARGEBOSS,this.barragePatternNum=2+r.nextInt(3),this.wingCollision=!0,this.setEnemyColorType();const s=1+r.nextInt(3),n=1+r.nextInt(3);for(let a=0;a<this.barragePatternNum;a++){const o=this.barrage[a];this.setBarrageType(o,F.LARGE,t);let h=0,u=0,c=0;switch(r.nextInt(3)){case 0:h=e,u=0,c=0;break;case 1:h=e/3,u=e/3,c=0;break;case 2:h=e/3,u=0,c=e/3;break}this.setBarrageRankSlow(o,h,f.NORMAL,t,.9),this.setBarrageShape(o,1),o.xReverse=r.nextInt(2)*2-1,this.setEnemyShapeAndWings(f.LARGEBOSS),this.setBattery(u,s,F.MIDDLE,f.NORMAL,0,a,.9,t),this.setBattery(c,n,F.MIDDLE,f.NORMAL,2,a,.9,t)}this.shield=400+r.nextInt(50),this.fireInterval=220+r.nextInt(60),this.firePeriod=st(this.fireInterval/(1.2+r.nextFloat(.3))),e<10&&(this.firePeriod=st(this.firePeriod/(2-e*.1)))}};i(f,"BARRAGE_PATTERN_MAX",zt.BARRAGE_PATTERN_MAX),i(f,"BODY_SHAPE_POINT_NUM",4),i(f,"BATTERY_MAX",4),i(f,"ENEMY_TYPE_MAX",32),i(f,"BULLET_SHAPE_NUM",7),i(f,"BULLET_COLOR_NUM",4),i(f,"SMALL",0),i(f,"MIDDLE",1),i(f,"LARGE",2),i(f,"MIDDLEBOSS",3),i(f,"LARGEBOSS",4),i(f,"ROLL",0),i(f,"LOCK",1),i(f,"isExist",Array.from({length:f.ENEMY_TYPE_MAX},()=>!1)),i(f,"rand",null),i(f,"barrageManager",null),i(f,"idCnt",0),i(f,"usedMorphParser",[]),i(f,"NORMAL",0),i(f,"WEAK",1),i(f,"VERYWEAK",2),i(f,"MORPHWEAK",3),i(f,"enemySize",[[.3,.3,.3,.1,.1,1,.4,.6,.9],[.4,.2,.4,.1,.15,2.2,.2,1.6,1],[.6,.3,.5,.1,.2,3,.3,1.4,1.2],[.9,.3,.7,.2,.25,5,.6,3,1.5],[1.2,.2,.9,.1,.3,7,.8,4.5,1.5]]);let j=f;const L=class L extends yt{constructor(){super(...arguments);i(this,"state",L.SEARCH);i(this,"pos",Array.from({length:L.LENGTH},()=>new R));i(this,"cnt",0);i(this,"lockMinY",0);i(this,"lockedEnemy");i(this,"lockedPart",-1);i(this,"lockedPos",new R);i(this,"released",!1);i(this,"vel",new R);i(this,"ship");i(this,"field");i(this,"manager")}static init(){L.rand=new it}init(t){const r=Array.isArray(t)?t[0]:t;if(!(r instanceof Ge))throw new Error("Lock.init requires LockInitializer");this.ship=r.ship,this.field=r.field,this.manager=r.manager,this.pos=Array.from({length:L.LENGTH},()=>new R),this.vel=new R,this.lockedPos=new R}reset(){for(let t=0;t<L.LENGTH;t++)this.pos[t].x=this.ship.pos.x,this.pos[t].y=this.ship.pos.y;this.vel.x=L.rand.nextSignedFloat(1.5),this.vel.y=-2,this.cnt=0}set(){this.reset(),this.state=L.SEARCH,this.lockMinY=this.field.size.y*2,this.released=!1,this.exists=!0}hit(){this.state=L.HIT,this.cnt=0}move(){var t,r;if(this.state===L.SEARCH){this.exists=!1;return}else this.state===L.SEARCHED&&(this.state=L.LOCKING,C.playSe(C.LOCK));switch(this.state!==L.HIT&&this.state!==L.CANCELED&&(this.lockedPart<0?(this.lockedPos.x=this.lockedEnemy.pos.x,this.lockedPos.y=this.lockedEnemy.pos.y):(this.lockedPos.x=this.lockedEnemy.pos.x+this.lockedEnemy.type.batteryType[this.lockedPart].collisionPos.x,this.lockedPos.y=this.lockedEnemy.pos.y+this.lockedEnemy.type.batteryType[this.lockedPart].collisionPos.y)),this.state){case L.LOCKING:this.cnt>=L.LOCK_CNT&&(this.state=L.LOCKED,C.playSe(C.LASER),this.cnt=0);break;case L.LOCKED:this.cnt>=L.NO_COLLISION_CNT&&(this.state=L.FIRED);case L.FIRED:case L.CANCELED:this.state!==L.CANCELED?(!this.lockedEnemy.exists||this.lockedEnemy.shield<=0||this.lockedPart>=0&&this.lockedEnemy.battery[this.lockedPart].shield<=0?this.state=L.CANCELED:(this.vel.x+=(this.lockedPos.x-this.pos[0].x)*L.SPEED,this.vel.y+=(this.lockedPos.y-this.pos[0].y)*L.SPEED),this.vel.x*=.9,this.vel.y*=.9,this.pos[0].x+=(this.lockedPos.x-this.pos[0].x)*.002*this.cnt,this.pos[0].y+=(this.lockedPos.y-this.pos[0].y)*.002*this.cnt):this.vel.y+=(this.field.size.y*2-this.pos[0].y)*L.SPEED;for(let s=L.LENGTH-1;s>0;s--)this.pos[s].x=this.pos[s-1].x,this.pos[s].y=this.pos[s-1].y;if(this.pos[0].x+=this.vel.x,this.pos[0].y+=this.vel.y,this.pos[0].y>this.field.size.y+5){if(this.state===L.CANCELED){this.exists=!1;return}this.state=L.LOCKED,C.playSe(C.LASER),this.reset()}{const s=Math.atan2(this.pos[1].x-this.pos[0].x,this.pos[1].y-this.pos[0].y);(r=(t=this.manager).addParticle)==null||r.call(t,this.pos[0],s,0,L.SPEED*32)}break;case L.HIT:for(let s=1;s<L.LENGTH;s++)this.pos[s].x=this.pos[s-1].x,this.pos[s].y=this.pos[s-1].y;if(this.cnt>5)if(!this.released)this.state=L.LOCKED,C.playSe(C.LASER),this.reset();else{this.exists=!1;return}break}this.cnt++}draw(){switch(this.state){case L.LOCKING:{const t=this.lockedPos.y-(L.LOCK_CNT-this.cnt)*.5;let r=(L.LOCK_CNT-this.cnt)*.1;const s=(L.LOCK_CNT-this.cnt)*.5+.8;w.setRetroParam((L.LOCK_CNT-this.cnt)/L.LOCK_CNT,.2);for(let n=0;n<3;n++,r+=Math.PI*2/3)w.drawBoxRetro(this.lockedPos.x+Math.sin(r)*s,t+Math.cos(r)*s,.2,1,r+Math.PI/2);break}case L.LOCKED:case L.FIRED:case L.CANCELED:case L.HIT:{let t=0,r=.8;w.setRetroParam(0,.2);for(let s=0;s<3;s++,t+=Math.PI*2/3)w.drawBoxRetro(this.lockedPos.x+Math.sin(t)*r,this.lockedPos.y+Math.cos(t)*r,.2,1,t+Math.PI/2);r=this.cnt*.1;for(let s=0;s<L.LENGTH-1;s++,r-=.1){let n=r;n<0?n=0:n>1&&(n=1),w.setRetroParam(n,.33),w.drawLineRetro(this.pos[s].x,this.pos[s].y,this.pos[s+1].x,this.pos[s+1].y)}break}}}};i(L,"SEARCH",0),i(L,"SEARCHED",1),i(L,"LOCKING",2),i(L,"LOCKED",3),i(L,"FIRED",4),i(L,"HIT",5),i(L,"CANCELED",6),i(L,"LENGTH",12),i(L,"NO_COLLISION_CNT",8),i(L,"SPEED",.01),i(L,"LOCK_CNT",8),i(L,"rand",new it);let Pt=L;class Ge{constructor(e,t,r){i(this,"ship");i(this,"field");i(this,"manager");this.ship=e,this.field=t,this.manager=r}}const Y=class Y extends yt{constructor(){super(...arguments);i(this,"released",!1);i(this,"pos",Array.from({length:Y.LENGTH},()=>new R));i(this,"cnt",0);i(this,"vel",Array.from({length:Y.LENGTH},()=>new R));i(this,"ship");i(this,"field");i(this,"manager");i(this,"dist",0)}init(t){const r=Array.isArray(t)?t[0]:t;if(!(r instanceof Ue))throw new Error("Roll.init requires RollInitializer");this.ship=r.ship,this.field=r.field,this.manager=r.manager,this.pos=Array.from({length:Y.LENGTH},()=>new R),this.vel=Array.from({length:Y.LENGTH},()=>new R)}set(){for(let t=0;t<Y.LENGTH;t++)this.pos[t].x=this.ship.pos.x,this.pos[t].y=this.ship.pos.y,this.vel[t].x=0,this.vel[t].y=0;this.cnt=0,this.dist=0,this.released=!1,this.exists=!0}move(){var t,r;if(this.released){if(this.pos[0].y+=Y.SPEED,this.pos[0].y>this.field.size.y){this.exists=!1;return}(r=(t=this.manager).addParticle)==null||r.call(t,this.pos[0],Math.PI,Y.BASE_SIZE*Y.LENGTH,Y.SPEED/8)}else this.dist<Y.BASE_DIST&&(this.dist+=Y.BASE_DIST/90),this.pos[0].x=this.ship.pos.x+Math.sin(this.cnt*.1)*this.dist,this.pos[0].y=this.ship.pos.y+Math.cos(this.cnt*.1)*this.dist;for(let s=1;s<Y.LENGTH;s++){this.pos[s].x+=this.vel[s].x,this.pos[s].y+=this.vel[s].y,this.vel[s].x*=Y.BASE_RESISTANCE,this.vel[s].y*=Y.BASE_RESISTANCE;const n=this.pos[s].dist(this.pos[s-1]);if(n<=Y.BASE_LENGTH)continue;const a=(n-Y.BASE_LENGTH)*Y.BASE_SPRING,o=Math.atan2(this.pos[s-1].x-this.pos[s].x,this.pos[s-1].y-this.pos[s].y);this.vel[s].x+=Math.sin(o)*a,this.vel[s].y+=Math.cos(o)*a}this.cnt++}draw(){this.released?w.setRetroParam(1,.2):w.setRetroParam(.5,.2);for(let t=0;t<Y.LENGTH;t++)w.drawBoxRetro(this.pos[t].x,this.pos[t].y,Y.BASE_SIZE*(Y.LENGTH-t),Y.BASE_SIZE*(Y.LENGTH-t),this.cnt*.1)}};i(Y,"LENGTH",4),i(Y,"NO_COLLISION_CNT",45),i(Y,"BASE_LENGTH",1),i(Y,"BASE_RESISTANCE",.8),i(Y,"BASE_SPRING",.2),i(Y,"BASE_SIZE",.2),i(Y,"BASE_DIST",3),i(Y,"SPEED",.75);let It=Y;class Ue{constructor(e,t,r){this.ship=e,this.field=t,this.manager=r}}const lt=class lt extends yt{constructor(){super(...arguments);i(this,"pos",new R);i(this,"field");i(this,"vel",new R);i(this,"deg",0);i(this,"cnt",0)}init(t){const r=Array.isArray(t)?t[0]:t;if(!(r instanceof Ve))throw new Error("Shot.init requires ShotInitializer");this.field=r.field,this.pos=new R,this.vel=new R}set(t,r){this.pos.x=t.x,this.pos.y=t.y,this.deg=r,this.vel.x=Math.sin(this.deg)*lt.SPEED,this.vel.y=Math.cos(this.deg)*lt.SPEED,this.cnt=0,this.exists=!0}move(){this.pos.x+=this.vel.x,this.pos.y+=this.vel.y,this.field.checkHit(this.pos,lt.FIELD_SPACE)&&(this.exists=!1),this.cnt++}draw(){let t;this.cnt>lt.RETRO_CNT?t=1:t=this.cnt/lt.RETRO_CNT,w.setRetroParam(t,.2),w.drawBoxRetro(this.pos.x,this.pos.y,.2,1,this.deg)}};i(lt,"SPEED",1),i(lt,"FIELD_SPACE",1),i(lt,"RETRO_CNT",4);let kt=lt;class Ve{constructor(e){this.field=e}}class Ms{constructor(e){i(this,"topBullet");i(this,"shield",0);i(this,"damaged",!1);this.topBullet=Array.from({length:e},()=>null)}}const E=class E extends yt{constructor(){super();i(this,"pos",new R);i(this,"type");i(this,"battery",[]);i(this,"shield",0);i(this,"field");i(this,"bullets");i(this,"shots");i(this,"rolls");i(this,"locks");i(this,"ship");i(this,"manager");i(this,"cnt",0);i(this,"topBullet",null);i(this,"moveBullet",null);i(this,"movePoint",[]);i(this,"movePointNum",0);i(this,"movePointIdx",0);i(this,"speed",0);i(this,"deg",0);i(this,"onRoute",!1);i(this,"baseDeg",0);i(this,"fireCnt",0);i(this,"barragePatternIdx",0);i(this,"fieldLimitX",0);i(this,"fieldLimitY",0);i(this,"appCnt",0);i(this,"dstCnt",0);i(this,"timeoutCnt",0);i(this,"z",0);i(this,"isBoss",!1);i(this,"vel",new R);i(this,"velCnt",0);i(this,"damaged",!1);i(this,"bossTimer",0);const t=this.getBatteryTypeConst("WING_BATTERY_MAX",3),r=this.getEnemyTypeConst("BATTERY_MAX",4);this.battery=Array.from({length:r},()=>new Ms(t)),this.movePoint=Array.from({length:E.MOVE_POINT_MAX},()=>new R)}init(t){const r=Array.isArray(t)?t[0]:t;if(!(r instanceof $e))throw new Error("Enemy.init requires EnemyInitializer");this.field=r.field,this.bullets=r.bullets,this.shots=r.shots,this.rolls=r.rolls,this.locks=r.locks,this.ship=r.ship,this.manager=r.manager,this.pos=new R,this.movePoint=Array.from({length:E.MOVE_POINT_MAX},()=>new R),this.vel=new R,this.velCnt=0,this.fieldLimitX=this.field.size.x/4*3,this.fieldLimitY=this.field.size.y/4*3}set(t,r,s,n){this.pos.x=t.x,this.pos.y=t.y,this.type=s;const a=n.createRunner();if(this.registFunctions(a),this.moveBullet=this.bullets.addManagedBullet(a,this.pos.x,this.pos.y,r,0,.5,1,0,0,1,1)??null,!!this.moveBullet){this.cnt=0,this.shield=this.type.shield;for(let o=0;o<this.type.batteryNum;o++)this.battery[o].shield=this.type.batteryType[o].shield;this.fireCnt=0,this.barragePatternIdx=0,this.baseDeg=r,this.appCnt=0,this.dstCnt=0,this.timeoutCnt=0,this.z=0,this.isBoss=!1,this.exists=!0}}setBoss(t,r,s){this.pos.x=t.x,this.pos.y=t.y,this.type=s,this.moveBullet=null;const n=E.rand.nextFloat(this.field.size.x/4)+this.field.size.x/4,a=E.rand.nextFloat(this.field.size.y/9)+this.field.size.y/7,o=this.field.size.y/7*4;this.movePointNum=E.rand.nextInt(3)+2;for(let u=0;u<Math.floor(this.movePointNum/2);u++)this.movePoint[u*2].x=E.rand.nextFloat(n/2)+n/2,this.movePoint[u*2+1].x=-this.movePoint[u*2].x,this.movePoint[u*2].y=this.movePoint[u*2+1].y=E.rand.nextSignedFloat(a)+o;this.movePointNum===3&&(this.movePoint[2].x=0,this.movePoint[2].y=E.rand.nextSignedFloat(a)+o);for(let u=0;u<8;u++){const c=E.rand.nextInt(this.movePointNum);let m=E.rand.nextInt(this.movePointNum);c===m&&(m++,m>=this.movePointNum&&(m=0));const b=this.movePoint[c];this.movePoint[c]=this.movePoint[m],this.movePoint[m]=b}this.speed=.03+E.rand.nextFloat(.02),this.movePointIdx=0,this.deg=Math.PI,this.onRoute=!1,this.cnt=0,this.shield=this.type.shield;for(let u=0;u<this.type.batteryNum;u++)this.battery[u].shield=this.type.batteryType[u].shield;const h=this.getEnemyTypeConst("BATTERY_MAX",4);for(let u=this.type.batteryNum;u<h;u++)this.battery[u].shield=0;this.fireCnt=0,this.barragePatternIdx=0,this.baseDeg=r,this.appCnt=E.APPEARANCE_CNT,this.z=E.APPEARANCE_Z,this.dstCnt=0,this.timeoutCnt=0,this.isBoss=!0,this.bossTimer=0,this.exists=!0}setBullet(t,r,s=1){if(t.rank<=0)return null;const n=t.parser.createRunner();this.registFunctions(n);let a=this.pos.x,o=this.pos.y;return r&&(a+=r.x,o+=r.y),t.morphCnt>0?this.bullets.addTopMorphBullet(t.parser,n,a,o,this.baseDeg,0,t.rank,t.speedRank,t.shape,t.color,t.bulletSize,t.xReverse*s,t.morphParser,t.morphNum,t.morphCnt)??null:this.bullets.addTopBullet(t.parser,n,a,o,this.baseDeg,0,t.rank,t.speedRank,t.shape,t.color,t.bulletSize,t.xReverse*s)??null}setTopBullets(){this.topBullet=this.setBullet(this.type.barrage[this.barragePatternIdx],null);for(let t=0;t<this.type.batteryNum;t++){const r=this.battery[t];if(r.shield<=0)continue;const s=this.type.batteryType[t];let n=1;for(let a=0;a<s.batteryNum;a++)r.topBullet[a]=this.setBullet(s.barrage[this.barragePatternIdx],s.batteryPos[a],n),s.xReverseAlternate&&(n*=-1)}}addBonuses(t,r){var n,a;const s=Math.floor((r*3/(this.cnt/30+1)*at.rate||0)+.9);(a=(n=this.manager).addBonus)==null||a.call(n,this.pos,t,s)}addBonusesByTypeShield(){this.addBonuses(null,this.type.shield)}addWingFragments(t,r,s,n,a){var u,c;const o=this.getBatteryTypeConst("WING_SHAPE_POINT_NUM",3);let h=1;for(let m=0;m<o;m++,h++)h>=o&&(h=0),(c=(u=this.manager).addFragments)==null||c.call(u,r,this.pos.x+t.wingShapePos[m].x,this.pos.y+t.wingShapePos[m].y,this.pos.x+t.wingShapePos[h].x,this.pos.y+t.wingShapePos[h].y,s,n,a)}addFragments(t,r,s,n){var h,u;const a=this.getEnemyTypeConst("BODY_SHAPE_POINT_NUM",4);let o=1;for(let c=0;c<a;c++,o++)o>=a&&(o=0),(u=(h=this.manager).addFragments)==null||u.call(h,t,this.pos.x+this.type.bodyShapePos[c].x,this.pos.y+this.type.bodyShapePos[c].y,this.pos.x+this.type.bodyShapePos[o].x,this.pos.y+this.type.bodyShapePos[o].y,r,s,n);for(let c=0;c<this.type.batteryNum;c++)this.battery[c].shield>0&&this.addWingFragments(this.type.batteryType[c],t,r,s,n)}addDamage(t){var r,s,n,a,o,h,u;if(this.shield-=t,this.shield<=0)if(this.addBonusesByTypeShield(),(s=(r=this.manager).addScore)==null||s.call(r,this.getEnemyTypeScore(this.type.type)),this.isBoss)this.addFragments(15,0,.1,E.rand.nextSignedFloat(1)),C.playSe(C.BOSS_DESTROYED),(a=(n=this.manager).setScreenShake)==null||a.call(n,20,.05),(h=(o=this.manager).clearBullets)==null||h.call(o),this.removeTopBullets(),this.dstCnt=E.DESTROYED_CNT;else{let c=E.rand.nextSignedFloat(1);this.type.type===this.getEnemyTypeConst("SMALL",0)?(c=((u=this.moveBullet)==null?void 0:u.bullet.deg)??0,C.playSe(C.ENEMY_DESTROYED)):C.playSe(C.LARGE_ENEMY_DESTROYED),this.addFragments(this.type.type*4+2,0,.04,c),this.remove()}this.damaged=!0}removeBattery(t,r){var s;for(let n=0;n<r.batteryNum;n++)t.topBullet[n]&&((s=t.topBullet[n])==null||s.remove(),t.topBullet[n]=null);t.damaged=!0}addDamageBattery(t,r){var s,n,a,o;if(this.battery[t].shield-=r,this.battery[t].shield<=0){const h=this.type.batteryType[t].collisionPos;this.addBonuses(h,this.type.batteryType[t].shield),(n=(s=this.manager).addScore)==null||n.call(s,E.ENEMY_WING_SCORE),this.addWingFragments(this.type.batteryType[t],10,0,.1,E.rand.nextSignedFloat(1)),C.playSe(C.LARGE_ENEMY_DESTROYED),(o=(a=this.manager).setScreenShake)==null||o.call(a,10,.03),this.removeBattery(this.battery[t],this.type.batteryType[t]),this.vel.x=-h.x/10,this.vel.y=-h.y/10,this.velCnt=60,this.removeTopBullets(),this.fireCnt=this.velCnt+10}}checkHit(t,r,s){if(Math.abs(t.x-this.pos.x)<this.type.collisionSize.x+r&&Math.abs(t.y-this.pos.y)<this.type.collisionSize.y+s)return E.HIT;if(this.type.wingCollision)for(let n=0;n<this.type.batteryNum;n++){if(this.battery[n].shield<=0)continue;const a=this.type.batteryType[n];if(Math.abs(t.x-this.pos.x-a.collisionPos.x)<a.collisionSize.x+r&&Math.abs(t.y-this.pos.y-a.collisionPos.y)<a.collisionSize.y+s)return n}return E.NOHIT}checkLocked(t,r,s){if(Math.abs(t.x-this.pos.x)<this.type.collisionSize.x+r&&this.pos.y<s.lockMinY&&this.pos.y>t.y)return s.lockMinY=this.pos.y,E.HIT;if(this.type.wingCollision){let n=E.NOHIT;for(let a=0;a<this.type.batteryNum;a++){if(this.battery[a].shield<=0)continue;const o=this.type.batteryType[a],h=this.pos.y+o.collisionPos.y;Math.abs(t.x-this.pos.x-o.collisionPos.x)<o.collisionSize.x+r&&h<s.lockMinY&&h>t.y&&(s.lockMinY=h,n=a)}if(n!==E.NOHIT)return n}return E.NOHIT}checkDamage(){var r,s,n,a,o,h,u,c,m,b;const t=this.getShotSpeed();for(let g=0;g<this.shots.actor.length;g++){const T=this.shots.actor[g];if(!T.exists)continue;const S=T,v=this.checkHit(S.pos,.7,0);v>=E.HIT&&((s=(r=this.manager).addParticle)==null||s.call(r,S.pos,E.rand.nextSignedFloat(.3),0,t/4),(a=(n=this.manager).addParticle)==null||a.call(n,S.pos,E.rand.nextSignedFloat(.3),0,t/4),(h=(o=this.manager).addParticle)==null||h.call(o,S.pos,Math.PI+E.rand.nextSignedFloat(.3),0,t/7),T.exists=!1,v===E.HIT?this.addDamage(E.SHOT_DAMAGE):this.addDamageBattery(v,E.SHOT_DAMAGE))}if(this.manager.mode===this.getManagerModeRoll())for(let g=0;g<this.rolls.actor.length;g++){const T=this.rolls.actor[g];if(!T.exists)continue;const S=T,v=this.checkHit(S.pos[0],1,1);if(v>=E.HIT){for(let O=0;O<4;O++)(c=(u=this.manager).addParticle)==null||c.call(u,S.pos[0],E.rand.nextFloat(Math.PI*2),0,t/10);let P=E.ROLL_DAMAGE;if(S.released)P+=P;else if(S.cnt<this.getRollNoCollisionCnt())continue;v===E.HIT?this.addDamage(P):this.addDamageBattery(v,P)}}else if(this.type.type!==this.getEnemyTypeConst("SMALL",0))for(let g=0;g<this.locks.actor.length;g++){const T=this.locks.actor[g];if(!T.exists)continue;const S=T;if(S.state===this.getLockState("SEARCH",0)||S.state===this.getLockState("SEARCHED",1)){const v=this.checkLocked(S.pos[0],2.5,S);v>=E.HIT&&(S.state=this.getLockState("SEARCHED",1),S.lockedEnemy=this,S.lockedPart=v);return}if(S.state===this.getLockState("FIRED",4)&&S.lockedEnemy===this){const v=this.checkHit(S.pos[0],1.5,1.5);if(v>=E.HIT&&v===S.lockedPart){for(let P=0;P<4;P++)(b=(m=this.manager).addParticle)==null||b.call(m,S.pos[0],E.rand.nextFloat(Math.PI*2),0,t/10);v===E.HIT?this.addDamage(E.LOCK_DAMAGE):this.addDamageBattery(v,E.LOCK_DAMAGE),S.hit()}}}}removeTopBullets(){var t;this.topBullet&&(this.topBullet.remove(),this.topBullet=null);for(let r=0;r<this.type.batteryNum;r++){const s=this.type.batteryType[r],n=this.battery[r];for(let a=0;a<s.batteryNum;a++)n.topBullet[a]&&((t=n.topBullet[a])==null||t.remove(),n.topBullet[a]=null)}}remove(){this.removeTopBullets(),this.moveBullet&&this.moveBullet.remove(),this.exists=!1}gotoNextPoint(){this.onRoute=!1,this.movePointIdx++,this.movePointIdx>=this.movePointNum&&(this.movePointIdx=0)}moveBoss(){const t=this.movePoint[this.movePointIdx],r=Math.atan2(t.x-this.pos.x,t.y-this.pos.y);let s=r-this.deg;s>Math.PI?s-=Math.PI*2:s<-Math.PI&&(s+=Math.PI*2);const n=Math.abs(s);n<E.BOSS_MOVE_DEG?this.deg=r:s>0?(this.deg+=E.BOSS_MOVE_DEG,this.deg>=Math.PI*2&&(this.deg-=Math.PI*2)):(this.deg-=E.BOSS_MOVE_DEG,this.deg<0&&(this.deg+=Math.PI*2)),this.pos.x+=Math.sin(this.deg)*this.speed,this.pos.y+=Math.cos(this.deg)*this.speed,this.velCnt>0&&(this.velCnt--,this.pos.x+=this.vel.x,this.pos.y+=this.vel.y,this.vel.x*=.92,this.vel.y*=.92),this.onRoute?n>Math.PI/2&&this.gotoNextPoint():n<Math.PI/2&&(this.onRoute=!0),this.pos.x>this.fieldLimitX?(this.pos.x=this.fieldLimitX,this.gotoNextPoint()):this.pos.x<-this.fieldLimitX&&(this.pos.x=-this.fieldLimitX,this.gotoNextPoint()),this.pos.y>this.fieldLimitY?(this.pos.y=this.fieldLimitY,this.gotoNextPoint()):this.pos.y<this.fieldLimitY/4&&(this.pos.y=this.fieldLimitY/4,this.gotoNextPoint())}controlFireCnt(){this.fireCnt<=0?(this.setTopBullets(),this.fireCnt=this.type.fireInterval,this.barragePatternIdx++,this.barragePatternIdx>=this.type.barragePatternNum&&(this.barragePatternIdx=0)):this.fireCnt<this.type.fireInterval-this.type.firePeriod&&this.removeTopBullets(),this.fireCnt--}move(){var t,r,s,n,a,o,h,u;if(this.setEnemyTypeExist(this.type.id,!0),this.isBoss)this.moveBoss();else{if(!this.moveBullet){this.remove();return}this.pos.x=this.moveBullet.bullet.pos.x,this.pos.y=this.moveBullet.bullet.pos.y}this.topBullet&&(this.topBullet.bullet.pos.x=this.pos.x,this.topBullet.bullet.pos.y=this.pos.y),this.damaged=!1;for(let c=0;c<this.type.batteryNum;c++){const m=this.type.batteryType[c],b=this.battery[c];b.damaged=!1;for(let g=0;g<m.batteryNum;g++)b.topBullet[g]&&(b.topBullet[g].bullet.pos.x=this.pos.x+m.batteryPos[g].x,b.topBullet[g].bullet.pos.y=this.pos.y+m.batteryPos[g].y)}if(this.isBoss){let c=1;if(this.appCnt>0)this.z<0&&(this.z-=E.APPEARANCE_Z/60),this.appCnt--,c=1-this.appCnt/E.APPEARANCE_CNT;else if(this.dstCnt>0){if(this.addFragments(1,this.z,.05,E.rand.nextSignedFloat(Math.PI)),(r=(t=this.manager).clearBullets)==null||r.call(t),this.z+=E.DESTROYED_Z/60,this.dstCnt--,this.dstCnt<=0){this.addFragments(25,this.z,.4,E.rand.nextSignedFloat(Math.PI)),C.playSe(C.BOSS_DESTROYED),(n=(s=this.manager).setScreenShake)==null||n.call(s,60,.01),this.remove(),(o=(a=this.manager).setBossShieldMeter)==null||o.call(a,0,0,0,0,0,0);return}c=this.dstCnt/E.DESTROYED_CNT}else if(this.timeoutCnt>0){if(this.z+=E.DESTROYED_Z/60,this.timeoutCnt--,this.timeoutCnt<=0){this.remove();return}c=0}else this.controlFireCnt(),c=1,this.bossTimer++,this.bossTimer>E.BOSS_TIMEOUT&&(this.timeoutCnt=E.TIMEOUT_CNT,this.shield=0,this.removeTopBullets());(u=(h=this.manager).setBossShieldMeter)==null||u.call(h,this.shield,this.battery[0].shield,this.battery[1].shield,this.battery[2].shield,this.battery[3].shield,c)}else{if(this.checkFieldHit(this.pos)){this.remove();return}this.pos.y<-this.field.size.y/4?this.removeTopBullets():this.controlFireCnt()}this.cnt++,this.appCnt<=0&&this.dstCnt<=0&&this.timeoutCnt<=0&&this.checkDamage()}draw(){let t=1;this.appCnt>0?(w.setRetroZ(this.z),t=this.appCnt/E.APPEARANCE_CNT,w.setRetroParam(1,this.type.retroSize*(1+t*10)),w.setRetroColor(this.type.r,this.type.g,this.type.b,1-t)):this.dstCnt>0?(w.setRetroZ(this.z),t=this.dstCnt/E.DESTROYED_CNT/2+.5,w.setRetroColor(this.type.r,this.type.g,this.type.b,t)):this.timeoutCnt>0?(w.setRetroZ(this.z),t=this.timeoutCnt/E.TIMEOUT_CNT,w.setRetroColor(this.type.r,this.type.g,this.type.b,t)):(w.setRetroParam(1,this.type.retroSize),this.damaged?w.setRetroColor(1,1,this.type.b,1):w.setRetroColor(this.type.r,this.type.g,this.type.b,1));const r=this.getEnemyTypeConst("BODY_SHAPE_POINT_NUM",4);let s=1;for(let a=0;a<r;a++,s++)s>=r&&(s=0),w.drawLineRetro(this.pos.x+this.type.bodyShapePos[a].x,this.pos.y+this.type.bodyShapePos[a].y,this.pos.x+this.type.bodyShapePos[s].x,this.pos.y+this.type.bodyShapePos[s].y);if(this.type.type!==this.getEnemyTypeConst("SMALL",0)){l.glBegin(l.GL_TRIANGLE_FAN),l.setColor(w.retroR,w.retroG,w.retroB,0);for(let a=0;a<r;a++)a===2&&l.setColor(w.retroR,w.retroG,w.retroB,w.retroA),l.glVertex3f(this.pos.x+this.type.bodyShapePos[a].x,this.pos.y+this.type.bodyShapePos[a].y,this.z);l.glEnd()}const n=this.getBatteryTypeConst("WING_SHAPE_POINT_NUM",3);for(let a=0;a<this.type.batteryNum;a++){const o=this.type.batteryType[a];if(this.appCnt>0?w.setRetroColor(o.r,o.g,o.b,1-t):this.dstCnt>0||this.timeoutCnt>0?w.setRetroColor(o.r,o.g,o.b,t):this.battery[a].damaged?w.setRetroColor(1,1,o.b,1):w.setRetroColor(o.r,o.g,o.b,1),s=1,this.battery[a].shield<=0)w.drawLineRetro(this.pos.x+o.wingShapePos[0].x,this.pos.y+o.wingShapePos[0].y,this.pos.x+o.wingShapePos[1].x,this.pos.y+o.wingShapePos[1].y);else{for(let h=0;h<n;h++,s++)s>=n&&(s=0),w.drawLineRetro(this.pos.x+o.wingShapePos[h].x,this.pos.y+o.wingShapePos[h].y,this.pos.x+o.wingShapePos[s].x,this.pos.y+o.wingShapePos[s].y);if(this.type.type!==this.getEnemyTypeConst("SMALL",0)){l.glBegin(l.GL_TRIANGLE_FAN),l.setColor(w.retroR,w.retroG,w.retroB,w.retroA);for(let h=0;h<n;h++)h===2&&l.setColor(w.retroR,w.retroG,w.retroB,0),l.glVertex3f(this.pos.x+o.wingShapePos[h].x,this.pos.y+o.wingShapePos[h].y,this.z);l.glEnd()}}}w.setRetroZ(0)}registFunctions(t){Lt.registFunctions(t)}checkFieldHit(t){return typeof this.field.checkHit=="function"?this.field.checkHit(t):t.x<-this.field.size.x||t.x>this.field.size.x||t.y<-this.field.size.y||t.y>this.field.size.y}getEnemyTypeConst(t,r){const s=j[t];return typeof s=="number"?s:r}getBatteryTypeConst(t,r){var a,o,h;const s=(h=(o=(a=this.type)==null?void 0:a.batteryType)==null?void 0:o[0])==null?void 0:h.constructor,n=s==null?void 0:s[t];return typeof n=="number"?n:r}getManagerModeRoll(){var r;const t=(r=this.manager.constructor)==null?void 0:r.ROLL;return typeof t=="number"?t:0}getRollNoCollisionCnt(){const t=It.NO_COLLISION_CNT;return typeof t=="number"?t:45}getShotSpeed(){const t=kt.SPEED;return typeof t=="number"?t:1}getLockState(t,r){const s=Pt[t];return typeof s=="number"?s:r}setEnemyTypeExist(t,r){const s=j;s.isExist||(s.isExist=[]),s.isExist[t]=r}getEnemyTypeScore(t){return t<0?E.ENEMY_TYPE_SCORE[0]:t>=E.ENEMY_TYPE_SCORE.length?E.ENEMY_TYPE_SCORE[E.ENEMY_TYPE_SCORE.length-1]:E.ENEMY_TYPE_SCORE[t]}};i(E,"FIELD_SPACE",.5),i(E,"MOVE_POINT_MAX",8),i(E,"APPEARANCE_CNT",90),i(E,"APPEARANCE_Z",-15),i(E,"DESTROYED_CNT",90),i(E,"DESTROYED_Z",-10),i(E,"TIMEOUT_CNT",90),i(E,"BOSS_TIMEOUT",1800),i(E,"SHOT_DAMAGE",1),i(E,"ROLL_DAMAGE",1),i(E,"LOCK_DAMAGE",7),i(E,"ENEMY_TYPE_SCORE",[100,500,1e3,5e3,1e4]),i(E,"ENEMY_WING_SCORE",1e3),i(E,"BOSS_MOVE_DEG",.02),i(E,"NOHIT",-2),i(E,"HIT",-1),i(E,"rand",new it);let xt=E;class $e{constructor(e,t,r,s,n,a,o){this.field=e,this.bullets=t,this.shots=r,this.rolls=s,this.locks=n,this.ship=a,this.manager=o}}const x=class x{constructor(){i(this,"size",new R);i(this,"eyeZ",20);i(this,"aimZ",10);i(this,"aimSpeed",.1);i(this,"roll",0);i(this,"yaw",0);i(this,"z",10);i(this,"speed",.1);i(this,"yawYBase",0);i(this,"yawZBase",0);i(this,"aimYawYBase",0);i(this,"aimYawZBase",0);i(this,"r",0);i(this,"g",0);i(this,"b",0)}init(){this.size.x=11,this.size.y=16,this.eyeZ=20,this.roll=0,this.yaw=0,this.z=10,this.aimZ=10,this.speed=.1,this.aimSpeed=.1,this.yawYBase=0,this.yawZBase=0,this.aimYawYBase=0,this.aimYawZBase=0,this.r=0,this.g=0,this.b=0}setColor(e){const t=wt,r=t.ROLL,s=t.LOCK;switch(e){case r:this.r=.2,this.g=.2,this.b=.7;break;case s:this.r=.5,this.g=.3,this.b=.6;break}}move(){this.roll+=this.speed,this.roll>=x.RING_ANGLE_INT&&(this.roll-=x.RING_ANGLE_INT),this.yaw+=this.speed,this.z+=(this.aimZ-this.z)*.003,this.speed+=(this.aimSpeed-this.speed)*.004,this.yawYBase+=(this.aimYawYBase-this.yawYBase)*.002,this.yawZBase+=(this.aimYawZBase-this.yawZBase)*.002}setType(e){switch(e){case 0:this.aimYawYBase=30,this.aimYawZBase=0;break;case 1:this.aimYawYBase=0,this.aimYawZBase=20;break;case 2:this.aimYawYBase=50,this.aimYawZBase=10;break;case 3:this.aimYawYBase=10,this.aimYawZBase=30;break}}draw(){var t;l.setColor(this.r,this.g,this.b,.7);let e=-16*x.RING_ANGLE_INT/2+this.roll;for(let r=0;r<x.RING_NUM;r++){for(let s=1;s<8;s++){const n=s/16+.5;l.glPushMatrix(),l.glTranslatef(0,0,this.z),l.glRotatef(e,1,0,0);const a=Math.sin(this.yaw/180*Math.PI);l.glRotatef(a*this.yawYBase,0,1,0),l.glRotatef(a*this.yawZBase,0,0,1),l.glScalef(1,1,n),(t=x.displayList)==null||t.call(0),l.glPopMatrix()}e+=x.RING_ANGLE_INT}}checkHit(e,t=0){return e.x<-this.size.x+t||e.x>this.size.x-t||e.y<-this.size.y+t||e.y>this.size.y-t}static writeOneRing(){l.glBegin(l.GL_LINE_STRIP);for(let e=0;e<=x.RING_POS_NUM/2-2;e++)l.glVertex3f(x.ringPos[e].x,x.RING_SIZE,x.ringPos[e].y);for(let e=x.RING_POS_NUM/2-2;e>=0;e--)l.glVertex3f(x.ringPos[e].x,-.5,x.ringPos[e].y);l.glVertex3f(x.ringPos[0].x,x.RING_SIZE,x.ringPos[0].y),l.glEnd(),l.glBegin(l.GL_LINE_STRIP),l.glVertex3f(x.ringPos[x.RING_POS_NUM/2-1].x,x.RING_SIZE,x.ringPos[x.RING_POS_NUM/2-1].y),l.glVertex3f(x.ringPos[x.RING_POS_NUM/2].x,x.RING_SIZE,x.ringPos[x.RING_POS_NUM/2].y),l.glVertex3f(x.ringPos[x.RING_POS_NUM/2].x,-.5,x.ringPos[x.RING_POS_NUM/2].y),l.glVertex3f(x.ringPos[x.RING_POS_NUM/2-1].x,-.5,x.ringPos[x.RING_POS_NUM/2-1].y),l.glVertex3f(x.ringPos[x.RING_POS_NUM/2-1].x,x.RING_SIZE,x.ringPos[x.RING_POS_NUM/2-1].y),l.glEnd(),l.glBegin(l.GL_LINE_STRIP);for(let e=x.RING_POS_NUM/2+1;e<=x.RING_POS_NUM-1;e++)l.glVertex3f(x.ringPos[e].x,x.RING_SIZE,x.ringPos[e].y);for(let e=x.RING_POS_NUM-1;e>=x.RING_POS_NUM/2+1;e--)l.glVertex3f(x.ringPos[e].x,-.5,x.ringPos[e].y);l.glVertex3f(x.ringPos[x.RING_POS_NUM/2+1].x,x.RING_SIZE,x.ringPos[x.RING_POS_NUM/2+1].y),l.glEnd()}static createDisplayLists(){x.deleteDisplayLists();let e=-x.RING_DEG*(x.RING_POS_NUM/2-.5);for(let r=0;r<x.RING_POS_NUM;r++,e+=x.RING_DEG)x.ringPos[r].x=Math.sin(e)*x.RING_RADIUS,x.ringPos[r].y=Math.cos(e)*x.RING_RADIUS;const t=new Kt(1);t.beginNewList(),x.writeOneRing(),t.endNewList(),x.displayList=t}static deleteDisplayLists(){var e;(e=x.displayList)==null||e.close(),x.displayList=null}};i(x,"TYPE_NUM",4),i(x,"displayList",null),i(x,"RING_NUM",16),i(x,"RING_ANGLE_INT",10),i(x,"RING_POS_NUM",16),i(x,"ringPos",Array.from({length:x.RING_POS_NUM},()=>new R)),i(x,"RING_DEG",Math.PI/3/(x.RING_POS_NUM/2+.5)),i(x,"RING_RADIUS",10),i(x,"RING_SIZE",.5);let vt=x;class ge extends yt{}const X=class X extends ge{constructor(){super(...arguments);i(this,"pos",[]);i(this,"vel",[]);i(this,"impact",new R);i(this,"z",0);i(this,"lumAlp",0);i(this,"retro",0);i(this,"cnt",0)}init(t){if(!((Array.isArray(t)?t[0]:t)instanceof He))throw new Error("Fragment.init requires FragmentInitializer");this.pos=Array.from({length:X.POINT_NUM},()=>new R),this.vel=Array.from({length:X.POINT_NUM},()=>new R),this.impact=new R}set(t,r,s,n,a,o,h){const u=X.rand.nextFloat(1),c=X.rand.nextFloat(1);this.pos[0].x=t*u+s*(1-u),this.pos[0].y=r*u+n*(1-u),this.pos[1].x=t*c+s*(1-c),this.pos[1].y=r*c+n*(1-c);for(let m=0;m<X.POINT_NUM;m++)this.vel[m].x=X.rand.nextSignedFloat(1)*o,this.vel[m].y=X.rand.nextSignedFloat(1)*o;this.impact.x=Math.sin(h)*o*4,this.impact.y=Math.cos(h)*o*4,this.z=a,this.cnt=32+X.rand.nextInt(24),this.lumAlp=.8+X.rand.nextFloat(.2),this.retro=1,this.exists=!0}move(){if(this.cnt--,this.cnt<0){this.exists=!1;return}for(let t=0;t<X.POINT_NUM;t++)this.pos[t].opAddAssign(this.vel[t]),this.pos[t].opAddAssign(this.impact),this.vel[t].opMulAssign(.98);this.impact.opMulAssign(.95),this.lumAlp*=.98,this.retro*=.97}draw(){w.setRetroZ(this.z),w.setRetroParam(this.retro,.2),w.drawLineRetro(this.pos[0].x,this.pos[0].y,this.pos[1].x,this.pos[1].y)}drawLuminous(){this.lumAlp<.2||(l.setColor(X.R,X.G,X.B,this.lumAlp),l.glVertex3f(this.pos[0].x,this.pos[0].y,this.z),l.glVertex3f(this.pos[1].x,this.pos[1].y,this.z))}};i(X,"R",1),i(X,"G",.8),i(X,"B",.6),i(X,"POINT_NUM",2),i(X,"rand",new it);let ht=X;class He{}const I=class I{static changeColor(e){I.colorIdx=e*I.LETTER_NUM}static drawLetter(e,t,r,s,n){I.displayList&&(l.glPushMatrix(),l.glTranslatef(t,r,0),l.glScalef(s,s,s),l.glRotatef(n,0,0,1),I.displayList.call(e+I.colorIdx),l.glPopMatrix())}static drawString(e,t,r,s,n){let a=t,o=0;switch(n){case I.TO_RIGHT:o=0;break;case I.TO_DOWN:o=90;break;case I.TO_LEFT:o=180;break;case I.TO_UP:o=270;break}for(let h=0;h<e.length;h++){const u=e[h];if(u!==" "){const c=u.charCodeAt(0);let m;c>=48&&c<=57?m=c-48:c>=65&&c<=90?m=c-65+10:c>=97&&c<=122?m=c-97+10:u==="."?m=36:u==="-"?m=38:u==="+"?m=39:m=37,I.drawLetter(m,a,r,s,o)}switch(n){case I.TO_RIGHT:a+=s*1.7;break;case I.TO_DOWN:r+=s*1.7;break;case I.TO_LEFT:a-=s*1.7;break;case I.TO_UP:r-=s*1.7;break}}}static drawNum(e,t,r,s,n){let a=Math.trunc(e),o=t,h=0;switch(n){case I.TO_RIGHT:h=0;break;case I.TO_DOWN:h=90;break;case I.TO_LEFT:h=180;break;case I.TO_UP:h=270;break}for(;;){switch(I.drawLetter(a%10,o,r,s,h),n){case I.TO_RIGHT:o-=s*1.7;break;case I.TO_DOWN:r-=s*1.7;break;case I.TO_LEFT:o+=s*1.7;break;case I.TO_UP:r+=s*1.7;break}if(a=Math.trunc(a/10),a<=0)break}}static drawBox(e,t,r,s,n,a,o){l.setColor(n,a,o,.5),w.drawBoxSolid(e-r,t-s,r*2,s*2),l.setColor(n,a,o,1),w.drawBoxLine(e-r,t-s,r*2,s*2)}static drawGlyph(e,t,r,s){for(let n=0;;n++){let a=I.spData[e][n][4]|0;if(a>99990)break;let o=-I.spData[e][n][0];const h=-I.spData[e][n][1];let u=I.spData[e][n][2],c=I.spData[e][n][3];u*=.66,c*=.6,o=-o,a%=180,a<=45||a>135?I.drawBox(o,h,u,c,t,r,s):I.drawBox(o,h,c,u,t,r,s)}}static createDisplayLists(){const e=new Kt(I.LETTER_NUM*2);let t=!1,r=0;for(let s=0;s<I.LETTER_NUM;s++)t?e.nextNewList():(e.beginNewList(),t=!0),I.drawGlyph(s,1,1,1),r++;for(let s=0;s<I.LETTER_NUM;s++)e.nextNewList(),I.drawGlyph(s,1,.7,.7),r++;t&&r>0&&e.endNewList(),I.displayList=e,I.colorIdx=0}static deleteDisplayLists(){var e;(e=I.displayList)==null||e.close(),I.displayList=null}};i(I,"displayList",null),i(I,"colorIdx",0),i(I,"WHITE",0),i(I,"RED",1),i(I,"TO_RIGHT",0),i(I,"TO_DOWN",1),i(I,"TO_LEFT",2),i(I,"TO_UP",3),i(I,"LETTER_NUM",42),i(I,"spData",[[[0,1.15,.65,.3,0],[-.6,.55,.65,.3,90],[.6,.55,.65,.3,90],[-.6,-.55,.65,.3,90],[.6,-.55,.65,.3,90],[0,-1.15,.65,.3,0],[0,0,0,0,99999]],[[0,.55,.65,.3,90],[0,-.55,.65,.3,90],[0,0,0,0,99999]],[[0,1.15,.65,.3,0],[.65,.55,.65,.3,90],[0,0,.65,.3,0],[-.65,-.55,.65,.3,90],[0,-1.15,.65,.3,0],[0,0,0,0,99999]],[[0,1.15,.65,.3,0],[.65,.55,.65,.3,90],[0,0,.65,.3,0],[.65,-.55,.65,.3,90],[0,-1.15,.65,.3,0],[0,0,0,0,99999]],[[-.65,.55,.65,.3,90],[.65,.55,.65,.3,90],[0,0,.65,.3,0],[.65,-.55,.65,.3,90],[0,0,0,0,99999]],[[0,1.15,.65,.3,0],[-.65,.55,.65,.3,90],[0,0,.65,.3,0],[.65,-.55,.65,.3,90],[0,-1.15,.65,.3,0],[0,0,0,0,99999]],[[0,1.15,.65,.3,0],[-.65,.55,.65,.3,90],[0,0,.65,.3,0],[-.65,-.55,.65,.3,90],[.65,-.55,.65,.3,90],[0,-1.15,.65,.3,0],[0,0,0,0,99999]],[[0,1.15,.65,.3,0],[.65,.55,.65,.3,90],[.65,-.55,.65,.3,90],[0,0,0,0,99999]],[[0,1.15,.65,.3,0],[-.65,.55,.65,.3,90],[.65,.55,.65,.3,90],[0,0,.65,.3,0],[-.65,-.55,.65,.3,90],[.65,-.55,.65,.3,90],[0,-1.15,.65,.3,0],[0,0,0,0,99999]],[[0,1.15,.65,.3,0],[-.65,.55,.65,.3,90],[.65,.55,.65,.3,90],[0,0,.65,.3,0],[.65,-.55,.65,.3,90],[0,-1.15,.65,.3,0],[0,0,0,0,99999]],[[0,1.15,.65,.3,0],[-.65,.55,.65,.3,90],[.65,.55,.65,.3,90],[0,0,.65,.3,0],[-.65,-.55,.65,.3,90],[.65,-.55,.65,.3,90],[0,0,0,0,99999]],[[-.1,1.15,.45,.3,0],[-.65,.55,.65,.3,90],[.45,.55,.65,.3,90],[-.1,0,.45,.3,0],[-.65,-.55,.65,.3,90],[.65,-.55,.65,.3,90],[0,-1.15,.65,.3,0],[0,0,0,0,99999]],[[0,1.15,.65,.3,0],[-.65,.55,.65,.3,90],[-.65,-.55,.65,.3,90],[0,-1.15,.65,.3,0],[0,0,0,0,99999]],[[-.1,1.15,.45,.3,0],[-.65,.55,.65,.3,90],[.45,.4,.65,.3,90],[-.65,-.55,.65,.3,90],[.65,-.55,.65,.3,90],[0,-1.15,.65,.3,0],[0,0,0,0,99999]],[[0,1.15,.65,.3,0],[-.65,.55,.65,.3,90],[0,0,.65,.3,0],[-.65,-.55,.65,.3,90],[0,-1.15,.65,.3,0],[0,0,0,0,99999]],[[0,1.15,.65,.3,0],[-.65,.55,.65,.3,90],[0,0,.65,.3,0],[-.65,-.55,.65,.3,90],[0,0,0,0,99999]],[[0,1.15,.65,.3,0],[-.65,.55,.65,.3,90],[.25,0,.25,.3,0],[-.65,-.55,.65,.3,90],[.65,-.55,.65,.3,90],[0,-1.15,.65,.3,0],[0,0,0,0,99999]],[[-.65,.55,.65,.3,90],[.65,.55,.65,.3,90],[0,0,.65,.3,0],[-.65,-.55,.65,.3,90],[.65,-.55,.65,.3,90],[0,0,0,0,99999]],[[0,.55,.65,.3,90],[0,-.55,.65,.3,90],[0,0,0,0,99999]],[[-.65,.55,.65,.3,90],[-.65,-.55,.65,.3,90],[.65,-.75,.25,.3,90],[0,-1.15,.65,.3,0],[0,0,0,0,99999]],[[-.65,.55,.65,.3,90],[.45,.55,.65,.3,90],[-.1,0,.45,.3,0],[-.65,-.55,.65,.3,90],[.65,-.55,.65,.3,90],[0,0,0,0,99999]],[[-.65,.55,.65,.3,90],[-.65,-.55,.65,.3,90],[0,-1.15,.65,.3,0],[0,0,0,0,99999]],[[-.3,1.15,.25,.3,0],[.3,1.15,.25,.3,0],[-.65,.55,.65,.3,90],[.65,.55,.65,.3,90],[-.65,-.55,.65,.3,90],[.65,-.55,.65,.3,90],[0,.55,.65,.3,90],[0,-.55,.65,.3,90],[0,0,0,0,99999]],[[0,1.15,.65,.3,0],[-.65,.55,.65,.3,90],[.65,.55,.65,.3,90],[-.65,-.55,.65,.3,90],[.65,-.55,.65,.3,90],[0,0,0,0,99999]],[[0,1.15,.65,.3,0],[-.65,.55,.65,.3,90],[.65,.55,.65,.3,90],[-.65,-.55,.65,.3,90],[.65,-.55,.65,.3,90],[0,-1.15,.65,.3,0],[0,0,0,0,99999]],[[0,1.15,.65,.3,0],[-.65,.55,.65,.3,90],[.65,.55,.65,.3,90],[0,0,.65,.3,0],[-.65,-.55,.65,.3,90],[0,0,0,0,99999]],[[0,1.15,.65,.3,0],[-.65,.55,.65,.3,90],[.65,.55,.65,.3,90],[-.65,-.55,.65,.3,90],[.65,-.55,.65,.3,90],[0,-1.15,.65,.3,0],[.2,-.6,.45,.3,60],[0,0,0,0,99999]],[[0,1.15,.65,.3,0],[-.65,.55,.65,.3,90],[.65,.55,.65,.3,90],[-.1,0,.45,.3,0],[-.65,-.55,.65,.3,90],[.45,-.55,.65,.3,90],[0,0,0,0,99999]],[[0,1.15,.65,.3,0],[-.65,.55,.65,.3,90],[0,0,.65,.3,0],[.65,-.55,.65,.3,90],[0,-1.15,.65,.3,0],[0,0,0,0,99999]],[[-.4,1.15,.45,.3,0],[.4,1.15,.45,.3,0],[0,.55,.65,.3,90],[0,-.55,.65,.3,90],[0,0,0,0,99999]],[[-.65,.55,.65,.3,90],[.65,.55,.65,.3,90],[-.65,-.55,.65,.3,90],[.65,-.55,.65,.3,90],[0,-1.15,.65,.3,0],[0,0,0,0,99999]],[[-.65,.55,.65,.3,90],[.65,.55,.65,.3,90],[-.5,-.55,.65,.3,90],[.5,-.55,.65,.3,90],[0,-1.15,.45,.3,0],[0,0,0,0,99999]],[[-.65,.55,.65,.3,90],[.65,.55,.65,.3,90],[-.65,-.55,.65,.3,90],[.65,-.55,.65,.3,90],[-.3,-1.15,.25,.3,0],[.3,-1.15,.25,.3,0],[0,.55,.65,.3,90],[0,-.55,.65,.3,90],[0,0,0,0,99999]],[[-.4,.6,.85,.3,240],[.4,.6,.85,.3,300],[-.4,-.6,.85,.3,120],[.4,-.6,.85,.3,60],[0,0,0,0,99999]],[[-.4,.6,.85,.3,240],[.4,.6,.85,.3,300],[0,-.55,.65,.3,90],[0,0,0,0,99999]],[[0,1.15,.65,.3,0],[.35,.5,.65,.3,300],[-.35,-.5,.65,.3,120],[0,-1.15,.65,.3,0],[0,0,0,0,99999]],[[0,-1.15,.05,.3,0],[0,0,0,0,99999]],[[0,-1.15,.65,.3,0],[0,0,0,0,99999]],[[0,0,.65,.3,0],[0,0,0,0,99999]],[[-.4,0,.45,.3,0],[.4,0,.45,.3,0],[0,.55,.65,.3,90],[0,-.55,.65,.3,90],[0,0,0,0,99999]],[[0,1,.4,.2,90],[0,0,0,0,99999]],[[-.19,1,.4,.2,90],[.2,1,.4,.2,90],[0,0,0,0,99999]]]);let M=I;class Le extends Et{constructor(e,t,r){super(e,t,r)}drawLuminous(){for(let e=0;e<this.actor.length;e++)this.actor[e].exists&&this.actor[e].drawLuminous()}}function ne(d){return d<0?Math.ceil(d):Math.floor(d)}const B=class B{constructor(){i(this,"parsec",0);i(this,"bossSection",!1);i(this,"gameManager");i(this,"barrageManager");i(this,"field");i(this,"rand");i(this,"SIMULTANEOUS_APPEARNCE_MAX",4);i(this,"appearance",[]);i(this,"SMALL_ENEMY_TYPE_MAX",3);i(this,"smallType",[]);i(this,"MIDDLE_ENEMY_TYPE_MAX",4);i(this,"middleType",[]);i(this,"LARGE_ENEMY_TYPE_MAX",2);i(this,"largeType",[]);i(this,"middleBossType");i(this,"largeBossType");i(this,"apNum",0);i(this,"apos");i(this,"sectionCnt",0);i(this,"sectionIntervalCnt",0);i(this,"section",0);i(this,"rank",0);i(this,"rankInc",0);i(this,"middleRushSectionNum",0);i(this,"middleRushSection",!1);i(this,"stageType",0);i(this,"MIDDLE_RUSH_SECTION_PATTERN",6);i(this,"apparancePattern",[[[1,0,0],[2,0,0],[1,1,0],[1,0,1],[2,1,0],[2,0,1],[0,1,1]],[[1,0,0],[1,1,0],[1,1,0],[1,0,1],[2,1,0],[1,1,1],[0,1,1]]])}init(e,t,r){this.gameManager=e,this.barrageManager=t,this.field=r,this.rand=new it,this.apos=new R,this.smallType=Array.from({length:this.SMALL_ENEMY_TYPE_MAX},()=>new j),this.middleType=Array.from({length:this.MIDDLE_ENEMY_TYPE_MAX},()=>new j),this.largeType=Array.from({length:this.LARGE_ENEMY_TYPE_MAX},()=>new j),this.middleBossType=new j,this.largeBossType=new j,this.appearance=Array.from({length:this.SIMULTANEOUS_APPEARNCE_MAX},()=>({type:this.smallType[0],moveParser:null,point:B.TOP,pattern:B.ALTERNATE,sequence:B.RANDOM,pos:0,num:0,interval:0,groupInterval:0,cnt:0,left:0,side:1}))}close(){}setRank(e,t,r,s){this.rank=e,this.rankInc=t,this.rank+=this.rankInc*ne(r/10),this.section=-1,this.parsec=r-1,this.stageType=s,this.createStage(),this.gotoNextSection()}move(){for(let e=0;e<this.apNum;e++){const t=this.appearance[e];if(t.cnt--,t.cnt>0){this.middleRushSection?t.type.type===j.MIDDLE&&!j.isExist[t.type.id]&&(t.cnt=0,j.isExist[t.type.id]=!0):t.type.type===j.SMALL&&!j.isExist[t.type.id]&&(t.cnt=0,j.isExist[t.type.id]=!0);continue}let r=0;switch(t.sequence){case B.RANDOM:r=this.rand.nextFloat(1);break;case B.FIXED:r=t.pos;break}let s=0;switch(t.point){case B.TOP:switch(t.pattern){case B.BOTH_SIDES:this.apos.x=(r-.5)*this.field.size.x*1.8;break;default:this.apos.x=(r*.6+.2)*this.field.size.x*t.side;break}this.apos.y=this.field.size.y-xt.FIELD_SPACE,s=Math.PI;break;case B.BACK:switch(t.pattern){case B.BOTH_SIDES:this.apos.x=(r-.5)*this.field.size.x*1.8;break;default:this.apos.x=(r*.6+.2)*this.field.size.x*t.side;break}this.apos.y=-this.field.size.y+xt.FIELD_SPACE,s=0;break;case B.SIDE:switch(t.pattern){case B.BOTH_SIDES:this.apos.x=(this.field.size.x-xt.FIELD_SPACE)*(this.rand.nextInt(2)*2-1);break;default:this.apos.x=(this.field.size.x-xt.FIELD_SPACE)*t.side;break}this.apos.y=(r*.4+.4)*this.field.size.y,this.apos.x<0?s=Math.PI/2:s=Math.PI/2*3;break}this.apos.x*=.88,t.moveParser&&this.gameManager.addEnemy(this.apos,s,t.type,t.moveParser),t.left--,t.left<=0?(t.cnt=t.groupInterval,t.left=t.num,t.pattern!==B.ONE_SIDE&&(t.side*=-1),t.pos=this.rand.nextFloat(1)):t.cnt=t.interval}(!this.bossSection||!j.isExist[this.middleBossType.id]&&!j.isExist[this.largeBossType.id])&&this.sectionCnt--,this.sectionCnt<this.sectionIntervalCnt&&(this.section===9&&this.sectionCnt===this.sectionIntervalCnt-1&&gt.fadeMusic(),this.apNum=0,this.sectionCnt<=0&&this.gotoNextSection()),j.clearIsExistList()}createEnemyData(){for(let e=0;e<this.smallType.length;e++)this.smallType[e].setSmallEnemyType(this.rank,this.gameManager.mode);for(let e=0;e<this.middleType.length;e++)this.middleType[e].setMiddleEnemyType(this.rank,this.gameManager.mode);for(let e=0;e<this.largeType.length;e++)this.largeType[e].setLargeEnemyType(this.rank,this.gameManager.mode);this.middleBossType.setMiddleBossEnemyType(this.rank,this.gameManager.mode),this.largeBossType.setLargeBossEnemyType(this.rank,this.gameManager.mode)}setAppearancePattern(e){switch(this.rand.nextInt(5)){case 0:e.pattern=B.ONE_SIDE;break;case 1:case 2:e.pattern=B.ALTERNATE;break;case 3:case 4:e.pattern=B.BOTH_SIDES;break}switch(this.rand.nextInt(3)){case 0:e.sequence=B.RANDOM;break;case 1:case 2:e.sequence=B.FIXED;break}}getParser(e){const t=this.barrageManager.parserNum[e]??0;return t<=0?null:this.barrageManager.parser[e][this.rand.nextInt(t)]??null}setSmallAppearance(e){e.type=this.smallType[this.rand.nextInt(this.smallType.length)];let t=0;switch(this.rand.nextFloat(1)>.2?(e.point=B.TOP,t=F.SMALLMOVE):(e.point=B.SIDE,t=F.SMALLSIDEMOVE),e.moveParser=this.getParser(t),this.setAppearancePattern(e),e.pattern===B.ONE_SIDE&&(e.pattern=B.ALTERNATE),this.rand.nextInt(4)){case 0:e.num=7+this.rand.nextInt(5),e.groupInterval=72+this.rand.nextInt(15),e.interval=15+this.rand.nextInt(5);break;case 1:e.num=5+this.rand.nextInt(3),e.groupInterval=56+this.rand.nextInt(10),e.interval=20+this.rand.nextInt(5);break;case 2:case 3:e.num=2+this.rand.nextInt(2),e.groupInterval=45+this.rand.nextInt(20),e.interval=25+this.rand.nextInt(5);break}}setMiddleAppearance(e){e.type=this.middleType[this.rand.nextInt(this.middleType.length)];const t=F.MIDDLEMOVE;switch(e.point=B.TOP,e.moveParser=this.getParser(t),this.setAppearancePattern(e),this.rand.nextInt(3)){case 0:e.num=4,e.groupInterval=240+this.rand.nextInt(150),e.interval=80+this.rand.nextInt(30);break;case 1:e.num=2,e.groupInterval=180+this.rand.nextInt(60),e.interval=180+this.rand.nextInt(20);break;case 2:e.num=1,e.groupInterval=150+this.rand.nextInt(50),e.interval=100;break}}setLargeAppearance(e){e.type=this.largeType[this.rand.nextInt(this.largeType.length)];const t=F.LARGEMOVE;switch(e.point=B.TOP,e.moveParser=this.getParser(t),this.setAppearancePattern(e),this.rand.nextInt(3)){case 0:e.num=3,e.groupInterval=400+this.rand.nextInt(100),e.interval=240+this.rand.nextInt(40);break;case 1:e.num=2,e.groupInterval=400+this.rand.nextInt(60),e.interval=300+this.rand.nextInt(20);break;case 2:e.num=1,e.groupInterval=270+this.rand.nextInt(50),e.interval=200;break}}setAppearance(e,t){switch(t){case B.SMALL:this.setSmallAppearance(e);break;case B.MIDDLE:this.setMiddleAppearance(e);break;case B.LARGE:this.setLargeAppearance(e);break}e.cnt=0,e.left=e.num,e.side=this.rand.nextInt(2)*2-1,e.pos=this.rand.nextFloat(1)}createSectionData(){if(this.apNum=0,this.rank<=0)return;if(this.field.aimSpeed=.1+this.section*.02,this.section===4){const a=new R;a.x=0,a.y=this.field.size.y/4*3,this.gameManager.addBoss(a,Math.PI,this.middleBossType),this.bossSection=!0,this.sectionIntervalCnt=this.sectionCnt=120,this.field.aimZ=11;return}if(this.section===9){const a=new R;a.x=0,a.y=this.field.size.y/4*3,this.gameManager.addBoss(a,Math.PI,this.largeBossType),this.bossSection=!0,this.sectionIntervalCnt=this.sectionCnt=180,this.field.aimZ=12;return}this.section===this.middleRushSectionNum?(this.middleRushSection=!0,this.field.aimZ=9):(this.middleRushSection=!1,this.field.aimZ=10+this.rand.nextSignedFloat(.3)),this.bossSection=!1,this.section===3?this.sectionIntervalCnt=120:this.section===3?this.sectionIntervalCnt=240:this.sectionIntervalCnt=60,this.sectionCnt=this.sectionIntervalCnt+600;const e=ne(this.section*3/7)+1,t=3+ne(this.section*3/10);let r=e+this.rand.nextInt(t-e+1);this.section===0?r=0:this.middleRushSection&&(r=this.MIDDLE_RUSH_SECTION_PATTERN);const s=this.apparancePattern[this.gameManager.mode]??this.apparancePattern[0],n=s[r]??s[0];for(let a=0;a<n[0];a++,this.apNum++)this.setAppearance(this.appearance[this.apNum],B.SMALL);for(let a=0;a<n[1];a++,this.apNum++)this.setAppearance(this.appearance[this.apNum],B.MIDDLE);for(let a=0;a<n[2];a++,this.apNum++)this.setAppearance(this.appearance[this.apNum],B.LARGE)}createStage(){this.createEnemyData(),this.middleRushSectionNum=2+this.rand.nextInt(6),this.middleRushSectionNum<=4&&this.middleRushSectionNum++,this.field.setType(this.stageType%vt.TYPE_NUM),C.playBgm(this.stageType%C.BGM_NUM),this.stageType++}gotoNextSection(){this.section++,this.parsec++;const t=this.gameManager.constructor.TITLE??0;this.gameManager.state===t&&this.section>=4&&(this.section=0,this.parsec-=4),this.section>=10&&(this.section=0,this.rank+=this.rankInc,this.createStage()),this.createSectionData()}};i(B,"TOP",0),i(B,"SIDE",1),i(B,"BACK",2),i(B,"ONE_SIDE",0),i(B,"ALTERNATE",1),i(B,"BOTH_SIDES",2),i(B,"RANDOM",0),i(B,"FIXED",1),i(B,"SMALL",0),i(B,"MIDDLE",1),i(B,"LARGE",2),i(B,"STAGE_TYPE_NUM",4);let ce=B;const Zt=class Zt{constructor(e){i(this,"num",0);i(this,"fileName");i(this,"image",null);i(this,"texture",null);i(this,"loaded",!1);i(this,"failed",!1);i(this,"loadPromise");i(this,"settleLoadPromise",null);i(this,"loadPromiseSettled",!1);if(this.fileName=`${Zt.imagesDir}${e}`,!this.fileName)throw new J(`Unable to load: ${this.fileName}`);this.loadPromise=new Promise(t=>{this.settleLoadPromise=t}),this.loadImage()}deleteTexture(){var e;this.texture&&((e=l.gl)==null||e.deleteTexture(this.texture)),this.texture=null,this.image=null,this.loaded=!1,this.failed=!1,this.num=0}bind(){var e,t;if(this.failed)throw new J(`Unable to load: ${this.fileName}`);this.loaded&&(!this.texture&&this.image&&(this.texture=((e=l.gl)==null?void 0:e.createTextureFromImage(this.image))??null),this.texture&&((t=l.gl)==null||t.bindTexture(this.texture),this.num=1))}get src(){return this.fileName}get isLoaded(){return this.loaded}get isFailed(){return this.failed}getImage(){return this.image}waitForLoad(){return this.loadPromise}loadImage(){if(typeof Image>"u"){this.failed=!0,this.loaded=!1,this.resolveLoadPromise(!1);return}const e=new Image;e.onload=()=>{this.image=e,this.loaded=!0,this.failed=!1,this.num=1,this.resolveLoadPromise(!0)},e.onerror=()=>{this.failed=!0,this.loaded=!1,this.image=null,this.num=0,this.resolveLoadPromise(!1)},e.src=this.fileName}resolveLoadPromise(e){var t;this.loadPromiseSettled||(this.loadPromiseSettled=!0,(t=this.settleLoadPromise)==null||t.call(this,e))}};i(Zt,"imagesDir","images/");let de=Zt;const H=class H{constructor(){i(this,"hiScore",[]);i(this,"reachedParsec",[]);i(this,"selectedDifficulty",1);i(this,"selectedParsecSlot",0);i(this,"selectedMode",0);this.init()}init(){this.reachedParsec=[],this.hiScore=[];for(let e=0;e<H.MODE_NUM;e++){const t=[],r=[];for(let s=0;s<H.DIFFICULTY_NUM;s++){t.push(0);const n=[];for(let a=0;a<H.REACHED_PARSEC_SLOT_NUM;a++)n.push(0);r.push(n)}this.reachedParsec.push(t),this.hiScore.push(r)}this.selectedDifficulty=1,this.selectedParsecSlot=0,this.selectedMode=0}loadPrevVersionData(e){const t=Ae(e);for(let r=0;r<H.DIFFICULTY_NUM;r++){this.reachedParsec[0][r]=Vt(t,["reachedParsec",r]);for(let s=0;s<H.REACHED_PARSEC_SLOT_NUM;s++)this.hiScore[0][r][s]=Vt(t,["hiScore",r,s])}this.selectedDifficulty=St(t,"selectedDifficulty"),this.selectedParsecSlot=St(t,"selectedParsecSlot")}load(){try{const e=Cs(H.PREF_FILE);if(!e)throw new Error("No pref data");const t=JSON.parse(e),r=Ae(t),s=St(r,"version");if(s===H.PREV_VERSION_NUM){this.init(),this.loadPrevVersionData(r);return}if(s!==H.VERSION_NUM)throw new Error("Wrong version num");for(let n=0;n<H.MODE_NUM;n++)for(let a=0;a<H.DIFFICULTY_NUM;a++){this.reachedParsec[n][a]=Vt(r,["reachedParsec",n,a]);for(let o=0;o<H.REACHED_PARSEC_SLOT_NUM;o++)this.hiScore[n][a][o]=Vt(r,["hiScore",n,a,o])}this.selectedDifficulty=St(r,"selectedDifficulty"),this.selectedParsecSlot=St(r,"selectedParsecSlot"),this.selectedMode=St(r,"selectedMode")}catch{this.init()}}save(){const e={version:H.VERSION_NUM,reachedParsec:this.reachedParsec,hiScore:this.hiScore,selectedDifficulty:this.selectedDifficulty,selectedParsecSlot:this.selectedParsecSlot,selectedMode:this.selectedMode};Ps(H.PREF_FILE,JSON.stringify(e))}};i(H,"PREV_VERSION_NUM",10),i(H,"VERSION_NUM",20),i(H,"PREF_FILE","p47.prf"),i(H,"MODE_NUM",2),i(H,"DIFFICULTY_NUM",4),i(H,"REACHED_PARSEC_SLOT_NUM",10);let K=H;function Ae(d){if(typeof d!="object"||d===null||Array.isArray(d))throw new Error("Invalid pref data");return d}function St(d,e){const t=d[e];if(typeof t!="number"||!Number.isFinite(t))throw new Error(`Invalid integer value: ${e}`);return t|0}function Vt(d,e){let t=d[e[0]];for(let r=1;r<e.length;r++){const s=e[r];if(!Array.isArray(t))throw new Error(`Invalid array path: ${e.join(".")}`);t=t[s]}if(typeof t!="number"||!Number.isFinite(t))throw new Error(`Invalid integer value: ${e.join(".")}`);return t|0}function Cs(d){return typeof localStorage>"u"?null:localStorage.getItem(d)}function Ps(d,e){typeof localStorage>"u"||localStorage.setItem(d,e)}const W=class W{constructor(){i(this,"pad");i(this,"gameManager");i(this,"prefManager");i(this,"field");i(this,"slotNum",[]);i(this,"startReachedParsec",[]);i(this,"curX",0);i(this,"curY",0);i(this,"mode",0);i(this,"boxCnt",0);i(this,"titleTexture",null);i(this,"padPrsd",!0)}init(e,t,r,s){this.pad=e,this.gameManager=t,this.prefManager=r,this.field=s,this.gameManager.difficulty=r.selectedDifficulty,this.gameManager.parsecSlot=r.selectedParsecSlot,this.gameManager.mode=r.selectedMode,this.titleTexture=new de("title.bmp"),this.slotNum.length=0,this.startReachedParsec.length=0;for(let n=0;n<K.MODE_NUM;n++)this.slotNum.push(Array(K.DIFFICULTY_NUM+1).fill(0)),this.startReachedParsec.push(Array(K.DIFFICULTY_NUM).fill(0))}close(){var e;(e=this.titleTexture)==null||e.deleteTexture(),this.titleTexture=null}async waitForAssets(){return this.titleTexture?this.titleTexture.waitForLoad():!0}start(){for(let e=0;e<K.MODE_NUM;e++){for(let t=0;t<K.DIFFICULTY_NUM;t++)this.slotNum[e][t]=((this.prefManager.reachedParsec[e][t]-1)/10|0)+1,this.startReachedParsec[e][t]=this.slotNum[e][t]*10+1,this.slotNum[e][t]>10&&(this.slotNum[e][t]=10);this.slotNum[e][K.DIFFICULTY_NUM]=1}this.curX=this.gameManager.parsecSlot,this.curY=this.gameManager.difficulty,this.mode=this.gameManager.mode,this.boxCnt=W.BOX_COUNT,this.field.setColor(this.mode)}getStartParsec(e,t){if(t<K.REACHED_PARSEC_SLOT_NUM-1)return t*10+1;let r=this.prefManager.reachedParsec[this.mode][e];return r--,r=(r/10|0)*10,r++,r}move(){const e=this.pad.getDirState();this.padPrsd?e===0&&(this.padPrsd=!1):(e&tt.Dir.DOWN?(this.curY++,this.curY>=this.slotNum[this.mode].length&&(this.curY=0),this.curX>=this.slotNum[this.mode][this.curY]&&(this.curX=this.slotNum[this.mode][this.curY]-1)):e&tt.Dir.UP?(this.curY--,this.curY<0&&(this.curY=this.slotNum[this.mode].length-1),this.curX>=this.slotNum[this.mode][this.curY]&&(this.curX=this.slotNum[this.mode][this.curY]-1)):e&tt.Dir.RIGHT?(this.curX++,this.curX>=this.slotNum[this.mode][this.curY]&&(this.curX=0)):e&tt.Dir.LEFT&&(this.curX--,this.curX<0&&(this.curX=this.slotNum[this.mode][this.curY]-1)),e!==0&&(this.boxCnt=W.BOX_COUNT,this.padPrsd=!0,this.gameManager.startStage(this.curY,this.curX,this.getStartParsec(this.curY,this.curX),this.mode))),this.boxCnt>=0&&this.boxCnt--}setStatus(){this.gameManager.difficulty=this.curY,this.gameManager.parsecSlot=this.curX,this.gameManager.mode=this.mode,this.curY<K.DIFFICULTY_NUM&&(this.prefManager.selectedDifficulty=this.curY,this.prefManager.selectedParsecSlot=this.curX,this.prefManager.selectedMode=this.mode)}changeMode(){this.mode++,this.mode>=K.MODE_NUM&&(this.mode=0),this.curX>=this.slotNum[this.mode][this.curY]&&(this.curX=this.slotNum[this.mode][this.curY]-1),this.field.setColor(this.mode),this.gameManager.startStage(this.curY,this.curX,this.getStartParsec(this.curY,this.curX),this.mode)}drawBox(e,t,r,s){l.setColor(1,1,1,1),w.drawBoxLine(e,t,r,s),l.setColor(1,1,1,.5),w.drawBoxSolid(e,t,r,s)}drawBoxLight(e,t,r,s){l.setColor(1,1,1,.7),w.drawBoxLine(e,t,r,s),l.setColor(1,1,1,.3),w.drawBoxSolid(e,t,r,s)}drawTitleBoard(){var e;(e=this.titleTexture)!=null&&e.isLoaded&&(l.glEnable(l.GL_TEXTURE_2D),this.titleTexture.bind(),w.setColor(1,1,1,1),l.glBegin(l.GL_TRIANGLE_FAN),l.glTexCoord2f(0,0),l.glVertex3f(180,20,0),l.glTexCoord2f(1,0),l.glVertex3f(308,20,0),l.glTexCoord2f(1,1),l.glVertex3f(308,148,0),l.glTexCoord2f(0,1),l.glVertex3f(180,148,0),l.glEnd(),l.glDisable(l.GL_TEXTURE_2D))}draw(){let e,t;const r=W.DIFFICULTY_STR[this.curY];M.drawString(r,470-r.length*14,150,10,M.TO_RIGHT);const s=W.MODE_STR[this.mode];M.drawString(s,470-s.length*14,450,10,M.TO_RIGHT),this.curX>0&&(M.drawString("START AT PARSEC",290,180,6,M.TO_RIGHT),M.drawNum(this.getStartParsec(this.curY,this.curX),470,180,6,M.TO_RIGHT)),this.curY<K.DIFFICULTY_NUM&&M.drawNum(this.prefManager.hiScore[this.mode][this.curY][this.curX],470,210,10,M.TO_RIGHT),t=260;for(let n=0;n<K.DIFFICULTY_NUM+1;n++){e=180;for(let a=0;a<this.slotNum[this.mode][n];a++){if(a===this.curX&&n===this.curY){const o=(W.BOX_COUNT-this.boxCnt)/2|0;this.drawBox(e-o,t-o,W.BOX_SMALL_SIZE+o*2,W.BOX_SMALL_SIZE+o*2),a===0?M.drawString(W.DIFFICULTY_SHORT_STR[n],e+13,t+13,12,M.TO_RIGHT):(M.drawString(W.DIFFICULTY_SHORT_STR[n],e+4,t+13,12,M.TO_RIGHT),a>=K.REACHED_PARSEC_SLOT_NUM-1?M.drawString("X",e+21,t+14,12,M.TO_RIGHT):M.drawNum(a,e+22,t+13,12,M.TO_RIGHT))}else this.drawBoxLight(e,t,W.BOX_SMALL_SIZE,W.BOX_SMALL_SIZE);e+=28}t+=32,n===K.DIFFICULTY_NUM-1&&(t+=15)}this.drawTitleBoard()}};i(W,"BOX_COUNT",16),i(W,"BOX_SMALL_SIZE",24),i(W,"DIFFICULTY_SHORT_STR",["P","N","H","E","Q"]),i(W,"DIFFICULTY_STR",["PRACTICE","NORMAL","HARD","EXTREME","QUIT"]),i(W,"MODE_STR",["ROLL","LOCK"]);let ue=W;const rt=class rt extends ge{constructor(){super(...arguments);i(this,"pos",new R);i(this,"ppos",new R);i(this,"vel",new R);i(this,"z",0);i(this,"mz",0);i(this,"pz",0);i(this,"lumAlp",0);i(this,"cnt",0)}init(t){if(!((Array.isArray(t)?t[0]:t)instanceof ze))throw new Error("Particle.init requires ParticleInitializer");this.pos=new R,this.ppos=new R,this.vel=new R}set(t,r,s,n){s>0?(this.pos.x=t.x+Math.sin(r)*s,this.pos.y=t.y+Math.cos(r)*s):(this.pos.x=t.x,this.pos.y=t.y),this.z=0;const a=rt.rand.nextFloat(.5)+.75;this.vel.x=Math.sin(r)*n*a,this.vel.y=Math.cos(r)*n*a,this.mz=rt.rand.nextSignedFloat(.7),this.cnt=12+rt.rand.nextInt(48),this.lumAlp=.8+rt.rand.nextFloat(.2),this.exists=!0}move(){if(this.cnt--,this.cnt<0){this.exists=!1;return}this.ppos.x=this.pos.x,this.ppos.y=this.pos.y,this.pz=this.z,this.pos.opAddAssign(this.vel),this.vel.opMulAssign(.98),this.z+=this.mz,this.lumAlp*=.98}draw(){l.glVertex3f(this.ppos.x,this.ppos.y,this.pz),l.glVertex3f(this.pos.x,this.pos.y,this.z)}drawLuminous(){this.lumAlp<.2||(l.setColor(rt.R,rt.G,rt.B,this.lumAlp),l.glVertex3f(this.ppos.x,this.ppos.y,this.pz),l.glVertex3f(this.pos.x,this.pos.y,this.z))}};i(rt,"R",1),i(rt,"G",1),i(rt,"B",.5),i(rt,"rand",new it);let Xt=rt;class ze{}const ae=1,Is=27,Me=80,ks=16;class Ce extends yt{init(e){}move(){}draw(){}}class Ns extends ge{init(e){}move(){}draw(){}drawLuminous(){}}const D=class D extends yr{constructor(){super(...arguments);i(this,"nowait",!1);i(this,"difficulty",1);i(this,"parsecSlot",0);i(this,"mode",D.ROLL);i(this,"state",D.TITLE);i(this,"ENEMY_MAX",32);i(this,"FIRST_EXTEND",2e5);i(this,"EVERY_EXTEND",5e5);i(this,"LEFT_MAX",4);i(this,"BOSS_WING_NUM",4);i(this,"SLOWDOWN_START_BULLETS_SPEED",[30,42]);i(this,"PAD_BUTTON1",tt.Button.A);i(this,"PAD_BUTTON2",tt.Button.B);i(this,"pad");i(this,"prefManager");i(this,"screen");i(this,"rand");i(this,"field");i(this,"ship");i(this,"enemies");i(this,"particles");i(this,"fragments");i(this,"bullets");i(this,"shots");i(this,"rolls");i(this,"locks");i(this,"bonuses");i(this,"barrageManager");i(this,"stageManager");i(this,"title");i(this,"left",0);i(this,"score",0);i(this,"extendScore",this.FIRST_EXTEND);i(this,"cnt",0);i(this,"pauseCnt",0);i(this,"bossShield",0);i(this,"bossWingShield",Array(this.BOSS_WING_NUM).fill(0));i(this,"interval",0);i(this,"pPrsd",!0);i(this,"btnPrsd",!0);i(this,"screenShakeCnt",0);i(this,"screenShakeIntense",0);i(this,"waitingForBarrageAssets",!0);i(this,"barrageAssetsReady",!1);i(this,"barrageAssetsFailed",!1);i(this,"titleAssetsReady",!1);i(this,"titleAssetsFailed",!1)}init(){var s,n;this.pad=this.input,this.prefManager=this.abstPrefManager,this.screen=this.abstScreen,this.difficulty=this.getPrefValue("selectedDifficulty",1),this.parsecSlot=this.getPrefValue("selectedParsecSlot",0),this.mode=this.getPrefValue("selectedMode",D.ROLL),this.rand=new it,vt.createDisplayLists(),this.field=new vt,this.field.init(),Tt.createDisplayLists(),this.ship=new Tt,this.ship.init(this.pad,this.field,this),this.particles=new Le(128,[new ze],this.hasActorContract(Xt)?(()=>new Xt):(()=>new Ns)),this.fragments=new Le(128,[new He],()=>new ht),ct.createDisplayLists(),this.bullets=new Lt(512,new Fe(this.field,this.ship)),M.createDisplayLists();const t=new Ve(this.field);this.shots=new Et(32,[t],this.hasActorContract(kt)?(()=>new kt):(()=>new Ce));const r=new Ue(this.ship,this.field,this);this.rolls=new Et(4,[r],this.hasActorContract(It)?(()=>new It):(()=>new Ce)),Pt.init(),this.locks=new Et(4,[new Ge(this.ship,this.field,this)],()=>new Pt),this.enemies=new Et(this.ENEMY_MAX,[new $e(this.field,this.bullets,this.shots,this.rolls,this.locks,this.ship,this)],()=>new xt),at.init(),this.bonuses=new Et(128,[new _e(this.field,this.ship,this)],()=>new at),this.barrageManager=new F,j.init(this.barrageManager),this.barrageManager.loadBulletMLs().then(()=>{this.onBarrageAssetsReady(!1)}).catch(a=>{const o=a instanceof Error?a:new Error(String(a));Rt.error(o),this.onBarrageAssetsReady(!0)}),this.stageManager=new ce,this.stageManager.init(this,this.barrageManager,this.field),this.title=new ue,this.title.init(this.pad,this,this.prefManager,this.field),(n=(s=this.title).waitForAssets)==null||n.call(s).then(a=>{this.onTitleAssetsReady(a===!1)}).catch(a=>{const o=a instanceof Error?a:new Error(String(a));Rt.error(o),this.onTitleAssetsReady(!0)}),this.interval=this.mainLoop.INTERVAL_BASE,C.init(this)}start(){if(this.assetsReady()){this.waitingForBarrageAssets=!1,this.startTitle();return}this.waitingForBarrageAssets=!0,this.state=D.TITLE,this.cnt=0,gt.haltMusic()}close(){this.barrageManager.unloadBulletMLs(),this.title.close(),C.close(),M.deleteDisplayLists(),vt.deleteDisplayLists(),Tt.deleteDisplayLists(),ct.deleteDisplayLists()}addScore(t){this.score+=t,this.score>this.extendScore&&(this.left<this.LEFT_MAX&&(C.playSe(C.EXTEND),this.left++),this.extendScore<=this.FIRST_EXTEND?this.extendScore=this.EVERY_EXTEND:this.extendScore+=this.EVERY_EXTEND)}shipDestroyed(){this.mode===D.ROLL?this.releaseRoll():this.releaseLock(),this.clearBullets(),this.left--,this.left<0&&this.startGameover()}addParticle(t,r,s,n){var o;const a=this.particles.getInstanceForced();a.exists=!0,(o=a.set)==null||o.call(a,t,r,s,n)}addFragments(t,r,s,n,a,o,h,u){var c;for(let m=0;m<t;m++){const b=this.fragments.getInstanceForced();b.exists=!0,(c=b.set)==null||c.call(b,r,s,n,a,o,h,u)}}addEnemy(t,r,s,n){var o;const a=this.enemies.getInstance();a&&((o=a.set)==null||o.call(a,t,r,s,n),a.exists=!0)}clearBullets(){var t;for(let r=0;r<this.bullets.actor.length;r++){const s=this.bullets.actor[r];s.exists&&((t=s.toRetro)==null||t.call(s))}}addBoss(t,r,s){var a;const n=this.enemies.getInstance();n&&((a=n.setBoss)==null||a.call(n,t,r,s),n.exists=!0)}addShot(t,r){const s=this.shots.getInstance();s&&(this.callIfFunction(s,"set",t,r),s.exists=!0)}addRoll(){const t=this.rolls.getInstance();t&&(this.callIfFunction(t,"set"),t.exists=!0)}addLock(){const t=this.locks.getInstance();t&&(this.callIfFunction(t,"set"),t.exists=!0)}releaseRoll(){for(let t=0;t<this.rolls.actor.length;t++){const r=this.rolls.actor[t];r.exists&&(r.released=!0)}}releaseLock(){for(let t=0;t<this.locks.actor.length;t++){const r=this.locks.actor[t];r.exists&&(r.released=!0)}}addBonus(t,r,s){for(let n=0;n<s;n++){const a=this.bonuses.getInstance();if(!a)return;this.callIfFunction(a,"set",t,r),a.exists=!0}}setBossShieldMeter(t,r,s,n,a,o){const h=o*.7;this.bossShield=t*h|0,this.bossWingShield[0]=r*h|0,this.bossWingShield[1]=s*h|0,this.bossWingShield[2]=n*h|0,this.bossWingShield[3]=a*h|0}startStage(t,r,s,n){this.enemies.clear(),this.bullets.clear(),this.difficulty=t,this.parsecSlot=r,this.mode=n;const a=this.rand.nextInt(99999);switch(t){case D.PRACTICE:this.stageManager.setRank(1,4,s,a),this.ship.setSpeedRate(.7),at.setSpeedRate(.6);break;case D.NORMAL:this.stageManager.setRank(10,8,s,a),this.ship.setSpeedRate(.9),at.setSpeedRate(.8);break;case D.HARD:this.stageManager.setRank(22,12,s,a),this.ship.setSpeedRate(1),at.setSpeedRate(1);break;case D.EXTREME:this.stageManager.setRank(36,16,s,a),this.ship.setSpeedRate(1.2),at.setSpeedRate(1.3);break;case D.QUIT:default:this.stageManager.setRank(0,0,0,0),this.ship.setSpeedRate(1),at.setSpeedRate(1);break}}setScreenShake(t,r){this.screenShakeCnt=t,this.screenShakeIntense=r}move(){if(this.pad.keys[Is]===ae){this.mainLoop.breakLoop();return}if(this.waitingForBarrageAssets){this.cnt++;return}switch(this.state){case D.IN_GAME:this.inGameMove();break;case D.TITLE:this.titleMove();break;case D.GAMEOVER:this.gameoverMove();break;case D.PAUSE:this.pauseMove();break}this.cnt++}draw(){var r,s,n,a,o,h,u,c,m,b,g,T,S,v,P,O;const t=this.mainLoop.event;if(t.type===ks){const G=((r=t.resize)==null?void 0:r.w)??0,U=((s=t.resize)==null?void 0:s.h)??0;G>150&&U>100&&this.screen.resized(G,U)}if(this.waitingForBarrageAssets){(a=(n=this.screen).viewOrthoFixed)==null||a.call(n),this.drawLoadingStatus(),(h=(o=this.screen).viewPerspective)==null||h.call(o);return}switch((c=(u=this.screen).startRenderToTexture)==null||c.call(u),l.glPushMatrix(),this.setEyepos(),this.state){case D.IN_GAME:case D.PAUSE:this.inGameDrawLuminous();break;case D.TITLE:this.titleDrawLuminous();break;case D.GAMEOVER:this.gameoverDrawLuminous();break}switch(l.glPopMatrix(),(b=(m=this.screen).endRenderToTexture)==null||b.call(m),this.screen.clear(),l.glPushMatrix(),this.setEyepos(),this.state){case D.IN_GAME:case D.PAUSE:this.inGameDraw();break;case D.TITLE:this.titleDraw();break;case D.GAMEOVER:this.gameoverDraw();break}switch(l.glPopMatrix(),(T=(g=this.screen).drawLuminous)==null||T.call(g),(v=(S=this.screen).viewOrthoFixed)==null||v.call(S),this.state){case D.IN_GAME:this.inGameDrawStatus();break;case D.TITLE:this.titleDrawStatus();break;case D.GAMEOVER:this.gameoverDrawStatus();break;case D.PAUSE:this.pauseDrawStatus();break}(O=(P=this.screen).viewPerspective)==null||O.call(P)}onBarrageAssetsReady(t){this.barrageAssetsReady=!0,this.barrageAssetsFailed=t,this.tryLeaveAssetLoading()}onTitleAssetsReady(t){this.titleAssetsReady=!0,this.titleAssetsFailed=t,this.tryLeaveAssetLoading()}tryLeaveAssetLoading(){this.assetsReady()&&this.waitingForBarrageAssets&&(this.waitingForBarrageAssets=!1,this.startTitle())}assetsReady(){return this.barrageAssetsReady&&this.titleAssetsReady}initShipState(){this.left=2,this.score=0,this.extendScore=this.FIRST_EXTEND,this.ship.start()}startInGame(){this.state=D.IN_GAME,this.initShipState(),this.startStage(this.difficulty,this.parsecSlot,this.getStartParsec(this.difficulty,this.parsecSlot),this.mode)}startTitle(){var t,r;this.state=D.TITLE,(r=(t=this.title).start)==null||r.call(t),this.initShipState(),this.bullets.clear(),this.ship.cnt=0,this.startStage(this.difficulty,this.parsecSlot,this.getStartParsec(this.difficulty,this.parsecSlot),this.mode),this.cnt=0,gt.haltMusic()}startGameover(){this.state=D.GAMEOVER,this.bonuses.clear(),this.shots.clear(),this.rolls.clear(),this.locks.clear(),this.setScreenShake(0,0),this.mainLoop.interval=this.interval=this.mainLoop.INTERVAL_BASE,this.cnt=0;const t=this.getHiScore(this.mode,this.difficulty,this.parsecSlot);this.score>t&&this.setHiScore(this.mode,this.difficulty,this.parsecSlot,this.score);const r=this.stageManager.parsec??0;r>this.getReachedParsec(this.mode,this.difficulty)&&this.setReachedParsec(this.mode,this.difficulty,r),gt.fadeMusic()}startPause(){this.state=D.PAUSE,this.pauseCnt=0}resumePause(){this.state=D.IN_GAME}stageMove(){var t,r;(r=(t=this.stageManager).move)==null||r.call(t)}inGameMove(){if(this.stageMove(),this.field.move(),this.callIfFunction(this.ship,"move"),this.bonuses.move(),this.shots.move(),this.enemies.move(),this.mode===D.ROLL?this.rolls.move():this.locks.move(),ct.resetTotalBulletsSpeed(),this.bullets.move(),this.particles.move(),this.fragments.move(),this.moveScreenShake(),this.pad.keys[Me]===ae?this.pPrsd||(this.pPrsd=!0,this.startPause()):this.pPrsd=!1,!this.nowait){const t=this.SLOWDOWN_START_BULLETS_SPEED[this.mode]??this.SLOWDOWN_START_BULLETS_SPEED[0];if(ct.totalBulletsSpeed>t){let r=ct.totalBulletsSpeed/t;r>1.75&&(r=1.75),this.interval+=(r*this.mainLoop.INTERVAL_BASE-this.interval)*.1}else this.interval+=(this.mainLoop.INTERVAL_BASE-this.interval)*.08;this.mainLoop.interval=this.interval}}titleMove(){var t,r,s,n,a,o;if((r=(t=this.title).move)==null||r.call(t),this.cnt<=8)this.btnPrsd=!0;else{const h=this.pad.getButtonState();if((h&this.PAD_BUTTON1)!==0){if(!this.btnPrsd){(n=(s=this.title).setStatus)==null||n.call(s),this.difficulty>=4?this.mainLoop.breakLoop():this.startInGame();return}}else(h&this.PAD_BUTTON2)!==0?this.btnPrsd||((o=(a=this.title).changeMode)==null||o.call(a),this.btnPrsd=!0):this.btnPrsd=!1}this.stageMove(),this.field.move(),this.enemies.move(),this.bullets.move()}gameoverMove(){let t=!1;this.cnt<=64?this.btnPrsd=!0:(this.pad.getButtonState()&(this.PAD_BUTTON1|this.PAD_BUTTON2))!==0?this.btnPrsd||(t=!0):this.btnPrsd=!1,this.cnt>64&&t?this.startTitle():this.cnt>500&&this.startTitle(),this.field.move(),this.enemies.move(),this.bullets.move(),this.particles.move(),this.fragments.move()}pauseMove(){this.pauseCnt++,this.pad.keys[Me]===ae?this.pPrsd||(this.pPrsd=!0,this.resumePause()):this.pPrsd=!1}inGameDraw(){this.field.draw(),w.setRetroColor(.2,.7,.5,1),l.glBlendFunc(l.GL_SRC_ALPHA,l.GL_ONE_MINUS_SRC_ALPHA),this.bonuses.draw(),l.glBlendFunc(l.GL_SRC_ALPHA,l.GL_ONE),l.setColor(.3,.7,1,1),l.glBegin(l.GL_LINES),this.particles.draw(),l.glEnd(),w.setRetroColor(ht.R,ht.G,ht.B,1),this.fragments.draw(),w.setRetroZ(0),this.callIfFunction(this.ship,"draw"),w.setRetroColor(.8,.8,.2,.8),this.shots.draw(),w.setRetroColor(1,.8,.5,1),this.mode===D.ROLL?this.rolls.draw():this.locks.draw(),this.enemies.draw(),this.bullets.draw()}titleDraw(){this.field.draw(),this.enemies.draw(),this.bullets.draw()}gameoverDraw(){this.field.draw(),l.setColor(.3,.7,1,1),l.glBegin(l.GL_LINES),this.particles.draw(),l.glEnd(),w.setRetroColor(ht.R,ht.G,ht.B,1),this.fragments.draw(),w.setRetroZ(0),this.enemies.draw(),this.bullets.draw()}inGameDrawLuminous(){l.glBegin(l.GL_LINES),this.particles.drawLuminous(),this.fragments.drawLuminous(),l.glEnd()}titleDrawLuminous(){}gameoverDrawLuminous(){l.glBegin(l.GL_LINES),this.particles.drawLuminous(),this.fragments.drawLuminous(),l.glEnd()}drawBoard(t,r,s,n){l.setColor(0,0,0,1),l.glBegin(l.GL_QUADS),l.glVertexXYZ(t,r,0),l.glVertexXYZ(t+s,r,0),l.glVertexXYZ(t+s,r+n,0),l.glVertexXYZ(t,r+n,0),l.glEnd()}drawSideBoards(){l.glDisable(l.GL_BLEND),this.drawBoard(0,0,160,480),this.drawBoard(480,0,160,480),l.glEnable(l.GL_BLEND)}drawScore(){M.drawNum(this.score,120,28,25,M.TO_UP),M.drawNum(at.bonusScore,24,20,12,M.TO_UP)}drawLeft(){this.left<0||(M.drawString("LEFT",520,260,25,M.TO_DOWN),M.changeColor(M.RED),M.drawNum(this.left,520,450,25,M.TO_DOWN),M.changeColor(M.WHITE))}drawParsec(){const t=this.stageManager.parsec??0;t<10?M.drawNum(t,600,26,25,M.TO_DOWN):t<100?M.drawNum(t,600,68,25,M.TO_DOWN):M.drawNum(t,600,110,25,M.TO_DOWN)}drawBox(t,r,s,n){s<=0||(l.setColor(1,1,1,.5),w.drawBoxSolid(t,r,s,n),l.setColor(1,1,1,1),w.drawBoxLine(t,r,s,n))}drawBossShieldMeter(){this.drawBox(165,6,this.bossShield,6);let t=24;for(let r=0;r<this.BOSS_WING_NUM;r++)switch(r%2){case 0:this.drawBox(165,t,this.bossWingShield[r],6);break;case 1:this.drawBox(475-this.bossWingShield[r],t,this.bossWingShield[r],6),t+=12;break}}drawSideInfo(){this.drawSideBoards(),this.drawScore(),this.drawLeft(),this.drawParsec()}inGameDrawStatus(){this.drawSideInfo(),this.stageManager.bossSection&&this.drawBossShieldMeter()}titleDrawStatus(){var t,r;this.drawSideBoards(),this.drawScore(),(r=(t=this.title).draw)==null||r.call(t)}gameoverDrawStatus(){this.drawSideInfo(),this.cnt>64&&M.drawString("GAME OVER",220,200,15,M.TO_RIGHT)}pauseDrawStatus(){this.drawSideInfo(),this.pauseCnt%60<30&&M.drawString("PAUSE",280,220,12,M.TO_RIGHT)}drawLoadingStatus(){this.drawSideBoards(),M.drawString("LOADING ASSETS",234,192,10,M.TO_RIGHT),M.drawString(this.barrageAssetsReady?"BULLETML: OK":"BULLETML: ...",230,224,8,M.TO_RIGHT),M.drawString(this.titleAssetsReady?"TITLE BMP: OK":"TITLE BMP: ...",230,250,8,M.TO_RIGHT),(this.barrageAssetsFailed||this.titleAssetsFailed)&&(M.changeColor(M.RED),M.drawString("LOAD FAILED",252,286,10,M.TO_RIGHT),M.changeColor(M.WHITE))}moveScreenShake(){this.screenShakeCnt>0&&this.screenShakeCnt--}setEyepos(){let t=0,r=0;this.screenShakeCnt>0&&(t=this.rand.nextSignedFloat(this.screenShakeIntense*(this.screenShakeCnt+10)),r=this.rand.nextSignedFloat(this.screenShakeIntense*(this.screenShakeCnt+10))),l.glTranslatef(t,r,-this.field.eyeZ)}getStartParsec(t,r){return this.title.getStartParsec?this.title.getStartParsec(t,r):r*10+1}getPrefValue(t,r){const s=this.prefManager[t];return typeof s=="number"?s:r}getHiScore(t,r,s){const n=this.prefManager.hiScore;if(typeof n=="number")return n;if(!Array.isArray(n))return 0;const a=n[t];if(!Array.isArray(a))return 0;const o=a[r];if(!Array.isArray(o))return 0;const h=o[s];return typeof h=="number"?h:0}setHiScore(t,r,s,n){const a=this.prefManager;if(typeof a.hiScore=="number"){a.hiScore=n;return}if(!Array.isArray(a.hiScore))return;const o=a.hiScore[t];if(!Array.isArray(o))return;const h=o[r];Array.isArray(h)&&(h[s]=n)}getReachedParsec(t,r){const s=this.prefManager.reachedParsec;if(!Array.isArray(s))return 0;const n=s[t];if(!Array.isArray(n))return 0;const a=n[r];return typeof a=="number"?a:0}setReachedParsec(t,r,s){const n=this.prefManager;if(!Array.isArray(n.reachedParsec))return;const a=n.reachedParsec[t];Array.isArray(a)&&(a[r]=s)}hasActorContract(t){const r=t.prototype;return r?typeof r.init=="function"&&typeof r.move=="function"&&typeof r.draw=="function":!1}callIfFunction(t,r,...s){const n=t[r];typeof n=="function"&&n.apply(t,s)}};i(D,"ROLL",0),i(D,"LOCK",1),i(D,"TITLE",0),i(D,"IN_GAME",1),i(D,"GAMEOVER",2),i(D,"PAUSE",3),i(D,"PRACTICE",0),i(D,"NORMAL",1),i(D,"HARD",2),i(D,"EXTREME",3),i(D,"QUIT",4);let wt=D,Pe=null,Ct=null,jt=null,Ie=null,Wt=null;function Ds(d){Pe=new w,Ct=new tt;try{Ct.openJoystick()}catch{}jt=new wt,Ie=new K,Wt=new tr(Pe,Ct,jt,Ie);try{Bs(d)}catch{return 1}return Wt.loop(),0}function Bs(d){const e=d[0]??"p47-web";for(let t=1;t<d.length;t++)switch(d[t]){case"-brightness":{t>=d.length-1&&Mt(e),t++;const r=parseInt(d[t],10)/100;r>=0&&r<=1||Mt(e),l.brightness=r;break}case"-luminous":{t>=d.length-1&&Mt(e),t++;const r=parseInt(d[t],10)/100;r>=0&&r<=1||Mt(e),w.luminous=r;break}case"-nosound":z.noSound=!0;break;case"-window":l.windowMode=!0;break;case"-reverse":Ct&&(Ct.buttonReversed=!0);break;case"-lowres":l.width=320,l.height=240;break;case"-nowait":jt&&(jt.nowait=!0);break;case"-accframe":Wt&&(Wt.accframe=1);break;case"-slowship":Tt.isSlow=!0;break;default:Mt(e)}}function Os(d){Rt.error(`Usage: ${d} [-brightness [0-100]] [-luminous [0-100]] [-nosound] [-window] [-reverse] [-lowres] [-slowship] [-nowait] [-accframe]`)}function Mt(d){throw Os(d),new Error("Invalid options")}Ds(["p47-web"]);
