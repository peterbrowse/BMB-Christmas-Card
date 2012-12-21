#include <Test.h>

//Test test1(1);
Test test2(2);
Test test3(3);
Test test4(4);
Test test5(5);
Test test6(6);

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
//  test1.calibrate();
  test2.calibrate();
  test3.calibrate();
  test4.calibrate();
  test5.calibrate();
  test6.calibrate();
}

void loop() {
  // put your main code here, to run repeatedly: 
  
}
