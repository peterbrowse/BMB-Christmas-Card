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
    firingServo.write(firingPos);
    directionServo.write(directionPos);
} 
