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

WiFiSetup::WiFiSetup(char* ssid, char* pass, char* serverAddress, int serverPort, int encryptionType)
{
	_ssid = ssid;   //  your network SSID (name) 
	_pass = pass;    // your network password
	_serverAddress = serverAddress; //enter the IP of your node.js server
	_serverPort = serverPort; //enter the port your node.js server is running on, by default it is 1337

	status = WL_IDLE_STATUS;     // the Wifi radio's status
	result = "0";
	_encryptionType = encryptionType;
}

bool WiFiSetup::connect()
{
	// attempt to connect using WPA2 encryption:
	  Serial.println("Attempting to connect to WPA2 network...");
	  status = WiFi.begin(_ssid, _pass);
	   // if you're not connected, stop here:
	  if ( status != WL_CONNECTED) { 
	  	software_Reset();
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

	    _encryptionType = WiFi.encryptionType();
	    Serial.print("Encryption Type: ");

	    if(_encryptionType == 2) {
	      result = "TKIP (WPA)";
	    }

	    else if(_encryptionType == 5) {
	     result = "WEP";
	    }

	    else if(_encryptionType == 4) {
	      result = "CCMP (WPA)";
	    }

	    else if(_encryptionType == 7) {
	      result = "NONE";
	    }

	    else if(_encryptionType == 8) {
	      result = "AUTO";
	    }

	    else {
	      result = "N/A"; 
	    }

	    Serial.println(result);
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