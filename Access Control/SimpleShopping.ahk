CoordMode, Pixel, Screen

count = 0

while(count<2)
{
MouseClick, left, 1590, 727
MouseClick, left, 1590, 727
MouseClick, left, 1590, 727

Sleep, 250

Send ^x

outputVar = %Clipboard%
Run node ./NodeJS/verify.js \"%outputVar%\" > output.txt
Sleep, 1000
string = FileReadLine, output.txt, count

if string == "notpurchased"
  SoundPlay, *-1
count++
}
