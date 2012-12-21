#include <IRScoreGate.h>

/*ARGUMENTS

IRScoreGate.h - A Class to Easily Setup our IRScoreGates.
Created by: Arthur Tindsley, 
Date: November 27, 2012.
Released into the public domain.

ARGUMENTS:
1) Analog pin on board it's connected to
2) Points
3) Callback on calibration
4) Callback on score
5) Late starter tells the class to act differently if the LED has been initiated after launch
6) Added Tolerance
7) Debug 
    0 (Default) - No Printing to Serial
    1 - Basic info sent to Serial
    2 - Full debug info sent to Serial
*/

IRScoreGate kid(0, 25, calbratedCallback, scoreCallback, true, 7, 2);

int completeCalibrations = 0;

void setup()
{
  Serial.begin(9600);
  delay(10000);
  while(completeCalibrations < 1){
     kid.calibrate();
  }
}

void loop(){
    kid.run();
//    Serial.println(analogRead(0));
}

void calbratedCallback(){
   Serial.println("Calibrated");
   completeCalibrations++; 
}

void scoreCallback(int score){
  Serial.print("Score: ");
  Serial.println(score); 
}
