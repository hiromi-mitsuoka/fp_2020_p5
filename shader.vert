attribute vec4 aPosition;

void main(){
  vec4 position=aPosition*2.-1.;
  gl_Position=position;
}