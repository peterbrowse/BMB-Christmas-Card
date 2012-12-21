#include <WiFi.h>
#include <WiFiSetup.h>
#include <SPI.h>
#include <Servo.h>
#include <IRScoreGate.h>
#include <SimpleTimer.h>

#include <string>
#include <sstream>

//CONSTS
const int FIRING_SERVO_PIN        =   2;
const int DIRECTION_SERVO_PIN     =   3;
const int NUMBER_OF_TARGETS       =   2;

//0 - 2
const int DEBUG_LEVEL             =   1;

const char* TCP_PASS[] = {"santaServer"};

//VARS

//Targets
int completeCalibrations = 0;
IRScoreGate polarBear(0, 150, calbratedCallback, scoreCallback, 15, DEBUG_LEVEL);
//IRScoreGate polarBear1(1, 100, calbratedCallback, scoreCallback, 15, DEBUG_LEVEL);
//IRScoreGate polarBear2(2, 75, calbratedCallback, scoreCallback, 15, DEBUG_LEVEL);
//IRScoreGate polarBear3(3, 50, calbratedCallback, scoreCallback, 15, DEBUG_LEVEL);
//IRScoreGate polarBear4(4, 25, calbratedCallback, scoreCallback, 15, DEBUG_LEVEL);
//IRScoreGate polarBear5(5, 5, calbratedCallback, scoreCallback, 15, DEBUG_LEVEL);


Servo firingServo; 
Servo directionServo;

SimpleTimer timer;

int firingPos = 120;    
int directionPos = 90;

const char* pong[] = {"ping"};

WiFiSetup wifiSetup("BMB_Guest", "superdry", "5.79.16.234", 8090, 0, DEBUG_LEVEL); //BMB Connection Details //WiFiSetup wifiSetup("Superfantasticwifi", "mgslalala99", "5.79.16.234", 8090, 0); //Peter's House Connection Details

void setup() {
  Serial.begin(9600);
  
  if(DEBUG_LEVEL > 0){ Serial.println("Waiting to boot"); }
//  delay(2000); We can' have this before the calibration loop. Talk to Peter about 
  
  firingServo.attach(FIRING_SERVO_PIN);
  directionServo.attach(DIRECTION_SERVO_PIN);
  
  firingServo.write(firingPos);
  directionServo.write(directionPos);
  
  if(wifiSetup.connect()){
      if(readHandshake()) {
        wifiSetup.client.write(TCP_PASS[0]);
        timer.setTimer(10000, pingPong, 0);
      }
  }
  
  while(completeCalibrations < NUMBER_OF_TARGETS){
      polarBear.calibrate();
//      polarBear1.calibrate();
//      polarBear2.calibrate();
//      polarBear3.calibrate();
//      polarBear4.calibrate();
//      polarBear5.calibrate();
  }
  
}

String incomingData = "";               // string to hold the text from server

void loop() {
  // LOOPS
  polarBear.run();
//  polarBear1.run();
//  polarBear2.run();
//  polarBear3.run();
//  polarBear4.run();
//  polarBear5.run();
  
  timer.run();  
  
  while (wifiSetup.client.available()) {
    monitor();
  }
    
  if(!wifiSetup.client.connected()) {
    if(DEBUG_LEVEL > 0){ Serial.println("ERROR: LINK LOST IN LOOP"); }
    
    timer.deleteTimer(0);
    wifiSetup.client.stop();
    software_Reset();
  }
}

///// TCP FUNCTIONS BEGINS /////
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
  if(DEBUG_LEVEL > 1){ Serial.println("Data Arrived: " + data); }
  
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
  
  // LOOK INTO MORE!
  char charBuf[50];
  data.toCharArray(charBuf, 50);
  wifiSetup.client.write(charBuf);
  timer.toggle(0);
}

void left() {
      if(DEBUG_LEVEL > 0){ Serial.println("Left Called"); }
      
      directionServo.write(directionServo.read()+5);
}

void right() {
      if(DEBUG_LEVEL > 0){ Serial.println("Right Called"); }

      directionServo.write(directionServo.read()-5);
}

void fire() {
    if(DEBUG_LEVEL > 0){ Serial.println("Fire Called"); }
    
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
    
    String response = TCP_PASS[0];
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
  if(DEBUG_LEVEL > 1){ Serial.println(pong[0]); }  
  
  if(wifiSetup.client.connected()) {
    wifiSetup.client.write(pong[0]);
  }
  
  else {
    if(DEBUG_LEVEL > 0){ Serial.println("ERROR: LINK LOST IN HEARBEAT FUNCTION"); }
    
    timer.deleteTimer(0);
    wifiSetup.client.stop();
    software_Reset();
  }
}
///// TCP FUNCTIONS ENDS /////

///// GATES FUNCTIONS BEGINS /////
void calbratedCallback(){
  Serial.println("Calibrated"); 
  completeCalibrations++;
}

void scoreCallback(int score){
  char charBuf[50];
  String holder = "score:";
  holder += score;
  holder.toCharArray(charBuf, 50);
  wifiSetup.client.write(charBuf);
  if(DEBUG_LEVEL > 0){ Serial.println(charBuf); }
}
///// GATES FUNCTIONS ENDS /////

void software_Reset() 
{ 
  asm volatile ("  jmp 0");  
}  
