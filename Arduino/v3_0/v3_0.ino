#include <WiFiSetup.h>
#include <ServoReset.h>
#include <WiFi.h>
#include <SPI.h>
#include <Servo.h>

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
      // Make a HTTP request:
      wifiSetup.client.println("GET / HTTP/1.0");
      wifiSetup.client.println();
  }
}

String incomingData = "";               // string to hold the text from server

void loop() {
  //check for incoming data over TCP
  if (wifiSetup.client.available()) {
    char inChar = wifiSetup.client.read();
    incomingData += inChar; 
      if (!wifiSetup.client.available()) {
         Serial.println("incomingData: "+incomingData); 
         if(incomingData == "left"){
           left();
         } else if(incomingData == "right"){
           right();
         } else if(incomingData == "reset"){
           servoReset.reset();
         } 
         incomingData = "";
      }
   }
}

void left() {
    Serial.println("Left Called");
    while(servo.read() != 0){
      servo.write(servo.read()-1);
      delay(15);
    }
}

void right() {
    Serial.println("Right Called");
    while(servo.read() != 180){
      servo.write(servo.read()+1);
      delay(15);
    }
}
