/*
  	ServoReset.h - Library for reseting a Servo.
  	Created by: Arthur Tindsley, 
	Date: October 2, 2012.
  	Released into the public domain.
*/

#ifndef ServoReset_h
#define ServoReset_h

#include "Arduino.h"
#include "Servo.h"

class ServoReset
{
  	public:
    	ServoReset(Servo servo, int point = 90);
		int read();
		void reset();
		
  	private:
		int _point;
		Servo _servo;
};

#endif