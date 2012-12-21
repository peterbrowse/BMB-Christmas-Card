#include <ScoreGate.h>

/*ARGUMENTS

ScoreGate.h - A Class to Easily Setup our ScoreGates.
Created by: Arthur Tindsley, 
Date: December 8, 2012.
Released into the public domain.

ARGUMENTS:
1) Analog pin on board it's connected to
2) Points
3) Callback on score
4) Debug 
    0 (Default) - No Printing to Serial
    1 - Basic info sent to Serial
    2 - Full debug info sent to Serial
*/

ScoreGate kid(22, 25, scoreCallback, 2);
ScoreGate snowMan(23, 50, scoreCallback, 2);
ScoreGate rudolph(24, 75, scoreCallback, 2);
ScoreGate fatherChristmas(25, 100, scoreCallback, 2);
ScoreGate nutCracker(26, 125, scoreCallback, 2);
ScoreGate polarBear(27, 150, scoreCallback, 2);

void setup()
{
  Serial.begin(9600);
//  pinMode(22, INPUT);
}

void loop(){
    kid.run();
    snowMan.run();
    rudolph.run();
    fatherChristmas.run();
    nutCracker.run();
    polarBear.run();
//  if(digitalRead(22) == LOW){
//     Serial.println("LOW");
//  }else if(digitalRead(22) == HIGH){
//    Serial.println("HIGH");
//  }
}

void scoreCallback(int score){
  Serial.print("Score: ");
  Serial.println(score); 
}
