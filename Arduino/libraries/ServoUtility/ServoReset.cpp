/*
  	ServoReset.h - Library for reseting a Servo.
  	Created by: Arthur Tindsley, 
	Date: October 2, 2012.
  	Released into the public domain.
*/

#include "Arduino.h"
#include "Servo.h"
#include "ServoReset.h"

ServoReset::ServoReset(Servo servo, int point)
{
	_point = point;
	_servo = servo;
}

int ServoReset::read()
{
	return _servo.read();
}

void ServoReset::reset()
{
	while(_servo.read() != _point){
		if(_servo.read() > _point){
			_servo.write(_servo.read()-1);        
			delay(15);
		} else if (_servo.read() < _point){
			_servo.write(_servo.read()+1); 
			delay(15);   
		}
	}
}