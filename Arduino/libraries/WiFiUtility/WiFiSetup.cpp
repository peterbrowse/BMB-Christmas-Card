/*
  	WiFiSetup.cpp - A Class to Easily Setup our Wifi.
  	Created by: Arthur Tindsley, 
	Date: October 3, 2012.
  	Released into the public domain.
*/

#include "Arduino.h"

#include "WiFiSetup.h"
#include "WiFi.h"
#include <SPI.h>
#include <WProgram.h>

WiFiSetup::WiFiSetup(char* ssid, char* pass, char* serverAddress, int serverPort, int encryptionType, int debugLevel)
{
	_ssid = ssid;   //  your network SSID (name) 
	_pass = pass;    // your network password
	_serverAddress = serverAddress; //enter the IP of your node.js server
	_serverPort = serverPort; //enter the port your node.js server is running on, by default it is 1337

	_status = WL_IDLE_STATUS;     // the Wifi radio's status
	_result = "0";
	_encryptionType = encryptionType;
	
	_debugLevel = debugLevel;
}

bool WiFiSetup::connect()
{
	// attempt to connect using WPA2 encryption:
	  if(_debugLevel > 0){ Serial.println("Attempting to connect to WPA2 network..."); }
	  		_status = WiFi.begin(_ssid, _pass);
	// if you're not connected, stop here:
	  if ( _status != WL_CONNECTED) { 
			if(_debugLevel > 0){ Serial.println("ERROR: SOFTWARE RESET FROM WIFISETUP"); }
	  		software_Reset();
	  }

	  // if you are connected, print out info about the connection:
	  else {
		if(_debugLevel > 0){ 
	    	Serial.println("Connected to network");
	    	Serial.print("IP Address: ");
	    	Serial.println(WiFi.localIP());
		}
		
	    WiFi.macAddress(_mac);
	
		if(_debugLevel > 0){ 
	    	Serial.print("MAC Address: ");
	    	Serial.print(_mac[5],HEX);
	    	Serial.print(":");
	    	Serial.print(_mac[4],HEX);
	    	Serial.print(":");
	    	Serial.print(_mac[3],HEX);
	    	Serial.print(":");
	    	Serial.print(_mac[2],HEX);
	    	Serial.print(":");
	    	Serial.print(_mac[1],HEX);
	    	Serial.print(":");
	    	Serial.println(_mac[0],HEX);
		}
		
		long rssi = WiFi.RSSI();
		
		if(_debugLevel > 0){ 
	    	Serial.print("Signal Strength: ");
	    	Serial.print(rssi);
	    	Serial.println(" dBm");
		}
	    
		_encryptionType = WiFi.encryptionType();
		
		if(_debugLevel > 0){ Serial.print("Encryption Type: "); }
		
	    if(_encryptionType == 2) {
	      	_result = "TKIP (WPA)";
	    }

	    else if(_encryptionType == 5) {
	     	_result = "WEP";
	    }

	    else if(_encryptionType == 4) {
	      	_result = "CCMP (WPA)";
	    }

	    else if(_encryptionType == 7) {
	      	_result = "NONE";
	    }

	    else if(_encryptionType == 8) {
	      	_result = "AUTO";
	    }

	    else {
	      	_result = "N/A"; 
	    }

	    if(_debugLevel > 0){ Serial.println(_result); }
	
	    if (client.connect(_serverAddress, _serverPort)) {
	    	if(client.connected()) {
	    		return 1;
	    	}
	    	
	    	else {
	    		software_Reset();
	    	}
	    }
	}
}

void WiFiSetup::software_Reset() 
{ 
	asm volatile ("  jmp 0");  
} 

// GETTERS AND SETTERS
int WiFiSetup::getdebugLevel(){ return _debugLevel; }
void WiFiSetup::setdebugLevel(int debugLevel) { _debugLevel = debugLevel; }