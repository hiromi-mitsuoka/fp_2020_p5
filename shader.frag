// Author @patriciogv ( patriciogonzalezvivo.com ) - 2015

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_amp;
uniform float u_shaderMode;

mat2 scale(vec2 _scale){
  return mat2(_scale.x,0.,
  0.,_scale.y);
}

float box(in vec2 _st,in vec2 _size){
  _size=vec2(.5)-_size*.5;
  vec2 uv=smoothstep(_size,
    _size+vec2(.001),
  _st);
  uv*=smoothstep(_size,
    _size+vec2(.001),
    vec2(1.)-_st);
    return uv.x*uv.y;
  }
  
  float cross(in vec2 _st,float _size){
    return box(_st,vec2(_size,_size/7.))+
    box(_st,vec2(_size/7.,_size));
  }
  
  void main(){
    vec2 st=gl_FragCoord.xy/u_resolution.xy;
    vec3 color=vec3(0.);
    
    // float amp_lebel=fract(u_amp*10.);
    // st*=amp_lebel;
    // st=fract(st);
    
    st*=u_shaderMode;
    st=fract(st);
    
    st-=vec2(.5);
    st=scale(vec2(sin(u_amp*10.)))*st;
    st+=vec2(.5);
    
    color=vec3(cross(st,.1));
    
    gl_FragColor=vec4(color,1.);
    gl_FragColor=vec4(1.-color,1.);
  }
