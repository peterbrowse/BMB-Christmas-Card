#include "Arduino.h"

#include "Test.h"
#include <SPI.h>
#include <WProgram.h>

Test::Test(int test)
{
	_test = test;
}

void Test::calibrate()
{
	while(0 < 1){
		Serial.println(_test);
	}
}