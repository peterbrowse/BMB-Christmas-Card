/*
  	IRScoreGate.cpp - A Class to Easily Setup our IRScoreGates.
  	Created by: Arthur Tindsley, 
	Date: November 27, 2012.
  	Released into the public domain.
*/

#include "Arduino.h"

#include "IRScoreGate.h"
#include <SPI.h>
#include <WProgram.h>

IRScoreGate::IRScoreGate(int pin, int score, CalibratedCallback calibratedCallback, ScoreCallback scoreCallback, bool lateStarter, int addedTolerance, int debugLevel)
{
	_pin 					= 	pin;
	_score 					= 	score;
	_calibratedCallback 	= 	calibratedCallback;
	_scoreCallback			=	scoreCallback;
	_addedTolerance			= 	addedTolerance;
	_lateStarter			=	lateStarter;
	_debugLevel				=	debugLevel;
	
	_sensorMin = 1023;
	_sensorMax = 0;
	
	_firstRun = true;
}

void IRScoreGate::calibrate()
{
	if(_firstRun){
		_firstRun = false;
		_millisSinceStart = millis();
	}
	
	if((millis()-_millisSinceStart) <= 2000ul){
		calibrating();
	}else{
		calibrated();
	}
}

void IRScoreGate::calibrating()
{	
	if(_debugLevel > 1){ 
		Serial.print("RAW: ");
		Serial.println(_sensorValue); 
	}
		
	_sensorValue = analogRead(_pin);
	
	// record the maximum sensor value
 	if (_sensorValue > _sensorMax) {
		_sensorMax = (_sensorValue + _addedTolerance);
 	}
			
 	// record the minimum sensor value
 	if (_sensorValue < _sensorMin) {
		_sensorMin = _sensorValue;
 	}
}

void IRScoreGate::calibrated()
{
	_calibratedCallback();
	
	if(_debugLevel > 0){
		Serial.println();
		Serial.print("IRScoreGate on pin ");
		Serial.print(_pin);
		Serial.println(" is calibrated!");	
		Serial.println("Sensor Min:");
		Serial.print(_sensorMin);
		Serial.println();
		Serial.println("Sensor Max:");
		Serial.print(_sensorMax);
		Serial.println();
	}
	_calibrated = true;
}

void IRScoreGate::run()
{
	if(_lateStarter){
		// read the sensor
	  	_sensorValue = analogRead(_pin);

	  	if(_debugLevel > 1){ 
			Serial.print("CALIBRATED (Late): ");
			Serial.println(_sensorValue); 
		}

		// Scoring functionality
		if(_sensorValue > (_sensorMax+_addedTolerance) && !_justScored){
			_lastScoreMillis = millis();
			_scoreCallback(_score);
			if(_debugLevel > 0){ Serial.println("SCORE"); }
		}
	}else{
		// read the sensor
	  	_sensorValue = analogRead(_pin);

	  	// apply the calibration to the sensor reading
	  	_sensorValue = map(_sensorValue, _sensorMin, _sensorMax, 0, 100);

	  	// in case the sensor value is outside the range seen during calibration
	 	_sensorValue = constrain(_sensorValue, 0, 100);  

	  	if(_debugLevel > 1){ 
			Serial.print("CALIBRATED: ");
			Serial.println(_sensorValue); 
		}

		// Scoring functionality
		if(_sensorValue > 70 && !_justScored){
			_lastScoreMillis = millis();
			_scoreCallback(_score);
			if(_debugLevel > 0){ Serial.println("SCORE"); }
		}
		
	}
	
	if((millis()-_lastScoreMillis) <= 2000ul){
		_justScored = true;
	}else{
		_justScored = false;
	}
	
}

// GETTERS AND SETTERS
int IRScoreGate::getPin() { return _pin; }

int IRScoreGate::getAddedTolerance(){ return _addedTolerance; }
void IRScoreGate::setAddedTolerance(int addedTolerance) { _addedTolerance = addedTolerance; }

int IRScoreGate::getdebugLevel(){ return _debugLevel; }
void IRScoreGate::setdebugLevel(int debugLevel) { _debugLevel = debugLevel; }

int IRScoreGate::getScore() { return _score; }
void IRScoreGate::setScore(int score) { _score = score; }
