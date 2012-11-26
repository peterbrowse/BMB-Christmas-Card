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

WiFiSetup wifiSetup("BMB_Guest", "superdry", "5.79.16.234", 8090, 0); //BMB Connection Details
//WiFiSetup wifiSetup("Superfantasticwifi", "mgslalala99", "5.79.16.234", 8090, 0); //Peter's House Connection Details

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
      //Serial.println("santaServer");
      if(readHandshake()) {
        wifiSetup.client.write(tcpPass[0]);
        timer.setTimer(10000, pingPong, 0);
         
      }
  }
}

String incomingData = "";               // string to hold the text from server

void loop() {
  timer.run();  
  while (wifiSetup.client.available()) {
    monitor();
  }
    
  if(!wifiSetup.client.connected()) {
    //Serial.println("Link lost in loop");
    timer.deleteTimer(0);
    wifiSetup.client.stop();
    software_Reset();
  }
}

void monitor() {
    char character;
    
  if (wifiSetup.client.available() > 0) {
        timer.toggle(0);
        String data = "";
        bool endReached = false;
        while (!endReached) {
            character = wifiSetup.client.read();
            endReached = character == '\r';

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
  Serial.println("Data Arrived: " + data);
  
  if(data == "left"){
    left();
  } else if(data == "right"){
    right();
  } else if(data == "fire"){
    fire();
  } 
  
  if(data != "pong"){
   timer.restartTimer(0); 
  }
  
  char charBuf[50];
  data.toCharArray(charBuf, 50);
  wifiSetup.client.write(charBuf);
  timer.toggle(0);
}

void left() {
      //Serial.println("Left Called");
//    while(directionServo.read() != 180){
      directionServo.write(directionServo.read()+5);
      delay(15);
//    }
}

void right() {
      //Serial.println("Right Called");
//    while(directionServo.read() != 0){
      directionServo.write(directionServo.read()-5);
      delay(15);
//    }
}

void fire() {
    //Serial.println("Fire Called");
    for(firingPos = 120; firingPos < 180; firingPos += 1)
    {
      firingServo.write(firingPos);
      delay(20);                        
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
    int maxAttempts = 300, attempts = 0;
    
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
        wifiSetup.client.stop();
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
  Serial.println(pong[0]);  
  if(wifiSetup.client.connected()) {
    wifiSetup.client.write(pong[0]);
  }
  
  else {
    //Serial.println("Link lost in heartbeat function");
    timer.deleteTimer(0);
    wifiSetup.client.stop();
    software_Reset();
  }
}

void software_Reset() // Restarts program from beginning but does not reset the peripherals and registers
{ 
  asm volatile ("  jmp 0");  
}  
