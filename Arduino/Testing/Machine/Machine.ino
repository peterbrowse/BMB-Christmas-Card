#include <Servo.h> 
 
Servo firingServo; 
Servo directionServo;
 
int firingPos = 120;    
int directionPos = 90; 
 
void setup() 
{ 
  firingServo.attach(2);
  directionServo.attach(3);
} 
 
void loop() 
{ 
  //SWEEP
  for(directionPos = 0; directionPos < 180; directionPos += 1)
  {
    directionServo.write(directionPos);
    delay(15);                        
  } 
  for(directionPos = 180; directionPos >= 0; directionPos-=1)
  {                                
    directionServo.write(directionPos);
    delay(15);
  }
  
  //FIRING
  for(firingPos = 120; firingPos < 180; firingPos += 1)
  {
    firingServo.write(firingPos);
    delay(30);                        
  } 
  for(firingPos = 180; firingPos >= 120; firingPos-=1)
  {                                
    firingServo.write(firingPos);
  } 
} 
