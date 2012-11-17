/*
  	WiFiSetup.cpp - A Class to Easily Setup our Wifi.
  	Created by: Arthur Tindsley, 
	Date: October 3, 2012.
  	Released into the public domain.
*/

#ifndef WiFiSetup_h
#define WiFiSetup_h

#include "Arduino.h"
#include "WiFi.h"

class WiFiSetup
{
  	public:
    	WiFiSetup(char* ssid, char* pass, char* serverAddress, int serverPort, int encryptionType);

		WiFiClient client;
		
		bool connect();
		
  	private:
		char* _ssid;
		char* _pass;
		char* _serverAddress;
		int _serverPort;
		int status;
		String result;
		int _encryptionType;
		byte mac[6];
};

#endif