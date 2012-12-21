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
    	WiFiSetup(char* ssid, char* pass, char* serverAddress, int serverPort, int encryptionType, int debugLevel = 0);

		WiFiClient client;
		
		//FUNCTIONS
		bool connect();
		void software_Reset();
		
		//GETTERS AND SETTERS
		int getdebugLevel();
		void setdebugLevel(int debugLevel);
		
  	private:
		char* _ssid;
		char* _pass;
		char* _serverAddress;
		int _serverPort;
		int _status;
		String _result;
		int _encryptionType;
		byte _mac[6];
		
		int _debugLevel;
};

#endif