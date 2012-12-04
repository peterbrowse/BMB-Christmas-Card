#include <WiFiSetup.h>
#include <ServoReset.h>
#include <WiFi.h>
#include <SPI.h>
#include <Servo.h>
#include <SimpleTimer.h>

#include <string>
#include <sstream>

Servo firingServo; 
Servo directionServo;
SimpleTimer timer;

int firingPos = 120;    
int directionPos = 90;
const char* tcpPass[] = {"santaServer"};
const char* pong[] = {"ping"};

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
  timer.setInterval(10000, pingPong);
  //servoReset.reset();
  //Serial.println("Waiting for Servo to Reset");
  //delay(2000);
  if(wifiSetup.connect()){
      //Serial.println("santaServer");
      if(readHandshake()) {
        wifiSetup.client.write(tcpPass[0]);
      }
  }
}

String incomingData = "";               // string to hold the text from server

void loop() {
  timer.run();  
  while (wifiSetup.client.available() && wifiSetup.client.connected()) {
    monitor();
//    while (wifiSetup.client.available()) {
//      char inChar = wifiSetup.client.read();
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
//    }
  }
    
  if(!wifiSetup.client.connected()) {
    Serial.println("TCP Connection lost");
    timer.disable(0);
    wifiSetup.client.stop();
    wifiSetup.connect();
    if(wifiSetup.client.connected()) {
      if(readHandshake()) {
        wifiSetup.client.write(tcpPass[0]);
        timer.enable(0);
        timer.restartTimer(0); 
      }
    }
  }
}

void monitor() {
    char character;
    
  if (wifiSetup.client.available() > 0) {
        timer.disable(0);
        String data = "";
        bool endReached = false;
        while (!endReached) {
            character = wifiSetup.client.read();
            endReached = character == -1;

            if (!endReached) {
                data += character;
            }
        }
        wifiSetup.client.flush();
        delay(1);
        dataArrived(data); 
   }
}

void dataArrived(String data) {
    if(data != "pong") {
      Serial.println("Data Arrived: " + data);
      char charBuf[50];
      data.toCharArray(charBuf, 50);
      wifiSetup.client.write(charBuf);
      timer.enable(0);
      timer.restartTimer(0);
    }
    
    else {
      timer.enable(0);
      timer.restartTimer(0); 
    }
}

void left() {
    Serial.println("Left Called");
//    while(directionServo.read() != 180){
      directionServo.write(directionServo.read()+5);
      delay(15);
//    }
}

void right() {
    Serial.println("Right Called");
//    while(directionServo.read() != 0){
      directionServo.write(directionServo.read()-5);
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

bool readHandshake() {
    bool result = false;
    char character;
    String handshake = "", line;
    int maxAttempts = 100, attempts = 0;
    
    while(wifiSetup.client.available() == 0 && attempts < maxAttempts) 
    { 
        delay(100); 
        attempts++;
    }
    
    while((line = readLine()) != "") {
        handshake += line + '\n';
    }
    
    String response = tcpPass[0];
    result = handshake.indexOf(response) != -1;
    
    if(!result) {
        timer.disable(0);
        wifiSetup.client.stop();
        wifiSetup.connect();
        if(wifiSetup.client.connected()) {
          if(readHandshake()) {
            wifiSetup.client.write(tcpPass[0]);
            timer.enable(0);
            timer.restartTimer(0); 
          }
        }
    }
    
    return result;
}

String readLine() {
    String line = "";
    char character;
    
    while(wifiSetup.client.available() > 0 && (character = wifiSetup.client.read()) != '\n') {
        if (character != '\r' && character != -1) {
            line += character;
        }
    }
    
    return line;
}

void pingPong() {
  Serial.println("Ping Pong");  
  if(wifiSetup.client.connected()) {
    wifiSetup.client.write(pong[0]);
  }
  
  else {
    timer.disable(0);
    wifiSetup.client.stop();
    wifiSetup.connect();
    if(wifiSetup.client.connected()) {
      if(readHandshake()) {
        wifiSetup.client.write(tcpPass[0]);
        timer.enable(0);
        timer.restartTimer(0); 
      }
    }
  }
}
