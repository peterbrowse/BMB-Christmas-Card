*************************************************************************
*  Setup Instructions For Influxis Flash Media Encoder Web Viewer v1.0	*
*  released 06/22/2007							*
*************************************************************************

UPLOADING YOUR WEB FILES:

Upload the html, swf, and xml files located in this 
directory to your web server and go to the corresponding URL.

For example:

http://www.yourdomain.com/viewer.html
or
http://www.yourdomain.com/admin.html

-------------------------------------------------------------------------

HOW TO USE:

Once you’ve uploaded your files, go to your admin URL: 
(example. http://www.yourdomain.com/admin.html)
(the actual URL should correspond to wherever you placed your files)

--

Now open the Flash Media Encoder (FME) Application.  
(You can download the FME from the Adobe site:)
http://www.adobe.com/products/flashmediaserver/flashmediaencoder/

Open the settings.xml file that came with the zip file you downloaded from Influxis.  
Find the rtmp tag and copy value in the path attribute. 
Example:
<rtmp path="rtmp://xxxxx.rtmphost.com/fmewebviewer/"/>

*Copy the 'rtmp://xxxxx.rtmphost.com/fmewebviewer/' portion only, not the entire 
xml tag.

--

Switch back to the FME application you have running and paste the rtmp path 
you just copied to the "FMS URL" Field.

Add the stream name "MyStream" (or whatever name you wish) in the "Stream" Field.

Press the "Connect" button to connect to your application with out publishing 
video, then press the "Start" button to begin streaming.  You can also just 
simply hit the "Start" button and the FME will connect and begin streaming 
your video immediately.

--

Use the options on the administration panel to manage users, turn on/off 
the chat, adjust the size of the video that the viewer side displays at.
You can even do live effects to the Live Video using the effects panel in 
the Administration board.

-----------------------------------------------------------------------

Please report any problems, bugs, or feature requests to:
support@influxis.com

Certainly feel free to contact us if you require any assistance!


