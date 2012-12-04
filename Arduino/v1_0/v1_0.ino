#include <SPI.h>
#include <WiFi.h>

const int ledPin = 13;

char ssid[] = "BMB_Guest";     //  your network SSID (name) 
char pass[] = "superdry";    // your network password
char* serverAddress = "5.79.16.234"; //enter the IP of your node.js server
int serverPort = 8080; //enter the port your node.js server is running on, by default it is 1337

int status = WL_IDLE_STATUS;     // the Wifi radio's status
String result = "0";
int encryptionType = 0;
byte mac[6];

WiFiClient client;

void connection() {
  // attempt to connect using WPA2 encryption:
  Serial.println("Attempting to connect to WPA2 network...");
  status = WiFi.begin(ssid, pass);
   // if you're not connected, stop here:
  if ( status != WL_CONNECTED) { 
    Serial.println("Couldn't get a wifi connection");
    while(true);
  }
  
  // if you are connected, print out info about the connection:
  else {
    Serial.println("Connected to network");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
    WiFi.macAddress(mac);
    Serial.print("MAC Address: ");
    Serial.print(mac[5],HEX);
    Serial.print(":");
    Serial.print(mac[4],HEX);
    Serial.print(":");
    Serial.print(mac[3],HEX);
    Serial.print(":");
    Serial.print(mac[2],HEX);
    Serial.print(":");
    Serial.print(mac[1],HEX);
    Serial.print(":");
    Serial.println(mac[0],HEX);
    long rssi = WiFi.RSSI();
    Serial.print("Signal Strength: ");
    Serial.print(rssi);
    Serial.println(" dBm");
    
    encryptionType = WiFi.encryptionType();
    Serial.print("Encryption Type: ");
    
    if(encryptionType == 2) {
      result = "TKIP (WPA)";
    }
    
    else if(encryptionType == 5) {
     result = "WEP";
    }
    
    else if(encryptionType == 4) {
      result = "CCMP (WPA)";
    }
    
    else if(encryptionType == 7) {
      result = "NONE";
    }
    
    else if(encryptionType == 8) {
      result = "AUTO";
    }
    
    else {
      result = "N/A"; 
    }
    
    Serial.println(result);
    if (client.connect(serverAddress, serverPort)) {
      Serial.println("connection made");
      // Make a HTTP request:
      client.println("GET /ertertertertertert HTTP/1.0");
      client.println();
    }
  }
}

void setup() {
  // initialize serial:
  Serial.begin(9600);
  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, LOW);

  connection(); 
}

void loop() {
  if (client.connected()) {
    digitalWrite(ledPin, HIGH);
  }
  else {
    digitalWrite(ledPin, LOW);
  }
  
  //check for incoming data over TCP
  if (client.available()) {
    char c = client.read();
    Serial.println(c);
  }
}
