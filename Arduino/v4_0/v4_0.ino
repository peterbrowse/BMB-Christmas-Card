#include <WiFiSetup.h>
#include <ServoReset.h>
#include <WiFi.h>
#include <SPI.h>
#include <Servo.h>

#include <string>
#include <sstream>

Servo servo;

ServoReset servoReset(servo);

WiFiSetup wifiSetup("BMB_Guest", "superdry", "5.79.16.234", 8090, 0);

void setup() {
  // initialize serial:
  Serial.begin(9600);
  Serial.println("Waiting to boot");
  delay(2000);
  servo.attach(2);
  servoReset.reset();
  Serial.println("Waiting for Servo to Reset");
  delay(2000);
  if(wifiSetup.connect()){
      Serial.println("Connection Made");
  }
}

String incomingData = "";               // string to hold the text from server

void loop() {
  
  while (wifiSetup.client.connected()) {
  if (wifiSetup.client.available()) {
    char inChar = wifiSetup.client.read();
    incomingData += inChar; 
      if (!wifiSetup.client.available()) {
         Serial.println("incomingData: "+incomingData); 
         if(incomingData == "left"){
           left();
           wifiSetup.client.write("Left");
         } else if(incomingData == "right"){
           right();
           wifiSetup.client.write("right");
         } else if(incomingData == "reset"){
           servoReset.reset();
           wifiSetup.client.write("reset");
         } 
         incomingData = "";
      }
    }
  }
  wifiSetup.connect();

}

void left() {
    Serial.println("Left Called");
    while(servo.read() != 180){
      servo.write(servo.read()+10);
      delay(15);
    }
}

void right() {
    Serial.println("Right Called");
    while(servo.read() != 0){
      servo.write(servo.read()-10);
      delay(15);
    }
}
