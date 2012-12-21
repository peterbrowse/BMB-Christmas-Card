/*
  	IRScoreGate.h - A Class to Easily Setup our IRScoreGates.
  	Created by: Arthur Tindsley, 
	Date: November 27, 2012.
  	Released into the public domain.

	ARGUMENTS:
	1) Analog pin on board it's connected to
	2) Points
	3) Callback on calibration
	4) Callback on score
	5) Late starter tells the class to act differently if the LED has been initiated after launch
	6) Added Tolerance
	7) Debug 
	    0 (Default) - No Printing to Serial
	    1 - Basic info sent to Serial
	    2 - Full debug info sent to Serial
*/

#ifndef IRScoreGate_h
#define IRScoreGate_h

#include "Arduino.h"

typedef void (*CalibratedCallback)(void);
typedef void (*ScoreCallback)(int);

class IRScoreGate
{
  	public:
    	IRScoreGate(int pin, int score, CalibratedCallback calibratedCallback, ScoreCallback scoreCallback, bool lateStarter = false, int addedTolerance = 0, int debugLevel = 0);
		
		//FUNCTIONS
		void calibrate();
		void run();
		
		// GETTERS AND SETTERS
		int getPin();
		
		int getAddedTolerance();
		void setAddedTolerance(int addedTolerance);
		
		int getdebugLevel();
		void setdebugLevel(int debugLevel);
		
		int getScore();
		void setScore(int pin);
		
  	private:
		void calibrating();
		void calibratingLate();
		void calibrated();
		void check();
		void justScored();
		
		int _pin;
		int _score;
		
		int _lateStarter;
		int _addedTolerance;
		int _debugLevel;
		
		CalibratedCallback _calibratedCallback;
		ScoreCallback _scoreCallback;
		
		bool _firstRun;
		bool _calibrated;
		
		unsigned long _millisSinceStart;
		unsigned long _lastScoreMillis;
		bool _justScored;
		
		int _sensorValue;
		int _sensorMin;
		int _sensorMax;
};

#endif