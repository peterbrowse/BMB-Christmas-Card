#include <WiFiSetup.h>
#include <ServoReset.h>
#include <WiFi.h>
#include <SPI.h>
#include <Servo.h>

#include <string> //WARNING
#include <sstream> //WARNING

Servo firingServo; 
Servo directionServo;

int firingPos = 120;    
int directionPos = 90; 

//ServoReset servoReset(servo);

WiFiSetup wifiSetup("BMB_Guest", "superdry", "5.79.16.234", 8090, 0);

void setup() {
  // initialize serial:
  Serial.begin(9600);
  Serial.println("Waiting to boot");
  delay(2000);
  firingServo.attach(2);
  directionServo.attach(3);
  firingServo.write(firingPos);
  directionServo.write(directionPos);
  //servoReset.reset();
  //Serial.println("Waiting for Servo to Reset");
  //delay(2000);
  if(wifiSetup.connect()){
      Serial.println("Connection Made");
  }
}

//String incomingData = "";               // string to hold the text from server

void loop() {
  
//  while (wifiSetup.client.connected()) {
    if (wifiSetup.client.available()) {
      char c = wifiSetup.client.read();
      Serial.print("TEST:"+c);
      if (c == '1') {
        Serial.println("1");
        wifiSetup.client.print('1');
      }
      else if (c == '0') {
        Serial.println("0");
        wifiSetup.client.print('0');
      }
      
      
      
//      incomingData += inChar; 
//        if (!wifiSetup.client.available()) {
//           Serial.println("incomingData: "+incomingData); 
//           if(incomingData == "left"){
//             left();
//             wifiSetup.client.write("Left");
//        } else if(incomingData == "right"){
//           right();
//           wifiSetup.client.write("right");
//        } else if(incomingData == "fire"){
//           //servoReset.reset();
//           fire();
//           wifiSetup.client.write("fire");
//        } 
//        incomingData = "";
//      }
    }
//  }
//  wifiSetup.connect();
//  Serial.println("Crashy Crashy!");
}

void left() {
    Serial.println("Left Called");
//    while(directionServo.read() != 180){
      directionServo.write(directionServo.read()+10);
      delay(15);
//    }
}

void right() {
    Serial.println("Right Called");
//    while(directionServo.read() != 0){
      directionServo.write(directionServo.read()-10);
      delay(15);
//    }
}

void fire() {
    Serial.println("Fire Called");
    for(firingPos = 120; firingPos < 180; firingPos += 1)
    {
      firingServo.write(firingPos);
      delay(15);                        
    } 
    for(firingPos = 180; firingPos >= 120; firingPos-=1)
    {                                
      firingServo.write(firingPos);
    } 
}
