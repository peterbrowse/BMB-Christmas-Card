/*
  	ScoreGate.h - A Class to Easily Setup our ScoreGates.
  	Created by: Arthur Tindsley, 
	Date: December 8, 2012.
  	Released into the public domain.
*/

#include "Arduino.h"

#include "ScoreGate.h"
#include <SPI.h>
#include <WProgram.h>

ScoreGate::ScoreGate(int pin, int score, ScoreCallback scoreCallback, int debugLevel)
{
	_pin 					= 	pin;
	_score 					= 	score;
	_scoreCallback			=	scoreCallback;
	_debugLevel				=	debugLevel;
	
	_firstRun = true;
	
	pinMode(_pin, INPUT); 
}

void ScoreGate::run()
{
	if(_debugLevel > 2){ Serial.println(digitalRead(_pin)); }
  	if (digitalRead(_pin) == HIGH && !_justScored) {  
   		_lastScoreMillis = millis();
		_scoreCallback(_score);
		if(_debugLevel > 0){ Serial.println("SCORE"); }
   	}
	
	if((millis()-_lastScoreMillis) <= 500ul){
		_justScored = true;
	}else{
		_justScored = false;
	}
	
}

// GETTERS AND SETTERS
int ScoreGate::getPin() { return _pin; }

int ScoreGate::getdebugLevel(){ return _debugLevel; }
void ScoreGate::setdebugLevel(int debugLevel) { _debugLevel = debugLevel; }

int ScoreGate::getScore() { return _score; }
void ScoreGate::setScore(int score) { _score = score; }
