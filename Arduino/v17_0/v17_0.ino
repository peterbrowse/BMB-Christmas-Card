#include <WiFi.h>
#include <WiFiSetup.h>
#include <SPI.h>
#include <Servo.h>
#include <ScoreGate.h>
#include <SimpleTimer.h>

#include <string>
#include <sstream>

//CONSTS
const int FIRING_SERVO_PIN        =   22;
const int DIRECTION_SERVO_PIN     =   23;

const int FIRING_REST_POSITION    =   110;
//0 - 2
const int DEBUG_LEVEL             =   2;

const char* TCP_PASS[] = {"santaServer"};

Servo firingServo; 
Servo directionServo;

SimpleTimer timer;

//Targets
ScoreGate santa(24, 100, scoreCallback, DEBUG_LEVEL);
ScoreGate nutCracker(25, 125, scoreCallback, DEBUG_LEVEL);
ScoreGate polarBear(26, 150, scoreCallback, DEBUG_LEVEL);
ScoreGate kid(27, 25, scoreCallback, DEBUG_LEVEL);

int firingPos = FIRING_REST_POSITION;    
int directionPos = 90;

const char* pong[] = {"ping"};

WiFiSetup wifiSetup("BMB_Guest", "superdry", "5.79.16.234", 8090, 0, DEBUG_LEVEL); //BMB Connection Details //WiFiSetup wifiSetup("Superfantasticwifi", "mgslalala99", "5.79.16.234", 8090, 0); //Peter's House Connection Details

void setup() {
  Serial.begin(9600);
  
  if(DEBUG_LEVEL > 0){ Serial.println("Waiting to boot"); }
  
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
  
}

String incomingData = "";               // string to hold the text from server

void loop() {
  // LOOPS
  santa.run();
  nutCracker.run();
  polarBear.run();
  kid.run();
  
  timer.run(); 
 
  fireRun(); 
  
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
  } else if (data == "reset"){
    software_Reset();
  }
  
  if(data != "pong"){
    timer.restartTimer(0); 
  }
  
  if(data != "fire"){
    char charBuf[50];
    data.toCharArray(charBuf, 50);
    wifiSetup.client.write(charBuf);
  }
   
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

/// FIRE FUNCTIONALITY START ///
bool canMove = true;
unsigned long lastFireWrite;

void fire() {
    if(DEBUG_LEVEL > 0){ Serial.println("Fire Called"); }
    lastFireWrite = millis();
    
    while(firingServo.read() < 180)
    {
        firingServo.write(firingServo.read()+1);         
    } 
}

void fireRun(){
  if((millis()-lastFireWrite) <= 1000ul){
      canMove = false;
  }else{
      canMove = true;
      firingServo.write(firingPos);
  }
}
/// FIRE FUNCIONALITY FINSIHED ///

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

void scoreCallback(int score){
  timer.disable(0);
  char charBuf[50];
  String holder = "score{";
  holder += score;
  holder += "}";
  holder.toCharArray(charBuf, 50);
  wifiSetup.client.write(charBuf);
  if(DEBUG_LEVEL > 0){ Serial.println(charBuf); }
  delay(1500);
  timer.restartTimer(0);
  timer.enable(0);
}
///// TCP FUNCTIONS ENDS /////

void software_Reset() 
{ 
  asm volatile ("  jmp 0");  
}  
