#ifndef Test_h
#define Test_h

#include "Arduino.h"

class Test
{
  	public:
    	Test(int test);
		void calibrate();
			
  	private:
		int _test;
};

#endif