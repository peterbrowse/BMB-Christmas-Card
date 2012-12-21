/*
  	ScoreGate.h - A Class to Easily Setup our ScoreGates.
  	Created by: Arthur Tindsley, 
	Date: December 8, 2012.
  	Released into the public domain.

	ARGUMENTS:
	1) Analog pin on board it's connected to
	2) Points
	3) Callback on score
	4) Debug 
	    0 (Default) - No Printing to Serial
	    1 - Basic info sent to Serial
	    2 - Next Step up
		3 - Full debug info sent to Serial
*/

#ifndef ScoreGate_h
#define ScoreGate_h

#include "Arduino.h"

typedef void (*ScoreCallback)(int);

class ScoreGate
{
  	public:
    	ScoreGate(int pin, int score, ScoreCallback scoreCallback, int debugLevel = 0);
		
		//FUNCTIONS
		void run();
		
		// GETTERS AND SETTERS
		int getPin();
		
		int getdebugLevel();
		void setdebugLevel(int debugLevel);
		
		int getScore();
		void setScore(int pin);
		
  	private:
		void check();
		void justScored();
		
		int _pin;
		int _score;
		
		int _debugLevel;
		
		bool _firstRun;
		
		ScoreCallback _scoreCallback;
		
		unsigned long _millisSinceStart;
		unsigned long _lastScoreMillis;
		bool _justScored;
};

#endif